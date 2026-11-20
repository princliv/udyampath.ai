import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import functions from "firebase-functions/v1";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getStorage } from "firebase-admin/storage";
import { gradeAttempt, publicQuestion, selectQuestions } from "./grade.js";
import { buildCertificatePdf, courseReady, slugify, specializationGaps } from "./certificate.js";

const questionBanks = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "data", "questionBanks.json"), "utf8"),
);

initializeApp();

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  await getFirestore()
    .doc(`users/${user.uid}`)
    .set({ email: user.email || "", role: "learner" }, { merge: true });
  const existing = (await getAuth().getUser(user.uid)).customClaims || {};
  if (existing.role === "admin" || existing.recruiterStatus === "approved") return;
  await getAuth().setCustomUserClaims(user.uid, { ...existing, role: "learner" });
});

export const approveRecruiter = onCall(async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Admin only.");
  }
  const uid = request.data?.uid;
  if (!uid) throw new HttpsError("invalid-argument", "uid is required.");
  await getFirestore().doc(`users/${uid}`).set({ role: "recruiter", recruiterStatus: "approved" }, { merge: true });
  const user = await getAuth().getUser(uid);
  await getAuth().setCustomUserClaims(uid, {
    ...(user.customClaims || {}),
    role: "recruiter",
    recruiterStatus: "approved",
  });
  return { ok: true };
});

const KINDS = ["pre", "quiz", "final", "placement"];

export const startAssessment = onCall(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in required.");
  const courseId = String(request.data?.courseId || "");
  const kind = String(request.data?.kind || "");
  if (!courseId || !KINDS.includes(kind)) {
    throw new HttpsError("invalid-argument", "courseId and kind are required.");
  }
  const questions = selectQuestions(questionBanks, { courseId, kind });
  if (!questions.length) throw new HttpsError("failed-precondition", "No questions for this test.");
  const attempt = getFirestore().collection("assessmentAttempts").doc();
  const expiresAt = Date.now() + 30 * 60 * 1000;
  await attempt.set({
    uid: request.auth.uid,
    courseId,
    kind,
    questions,
    startedAt: Date.now(),
    expiresAt,
    submittedAt: null,
  });
  return {
    attemptId: attempt.id,
    expiresAt,
    questions: questions.map(publicQuestion),
  };
});

export const submitAssessment = onCall(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in required.");
  const attemptId = String(request.data?.attemptId || "");
  if (!attemptId) throw new HttpsError("invalid-argument", "attemptId is required.");
  const ref = getFirestore().doc(`assessmentAttempts/${attemptId}`);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpsError("not-found", "Attempt not found.");
  const attempt = snap.data();
  if (attempt.uid !== request.auth.uid) throw new HttpsError("permission-denied", "Not your attempt.");
  if (attempt.submittedAt) throw new HttpsError("failed-precondition", "Already submitted.");
  if (Date.now() > attempt.expiresAt) throw new HttpsError("deadline-exceeded", "Attempt expired.");
  const result = gradeAttempt(attempt.questions, request.data?.answers || {});
  const proctor = request.data?.proctor || {};
  await ref.set(
    {
      submittedAt: Date.now(),
      score: result.score,
      passed: result.passed,
      proctor: {
        faceMissingSec: Number(proctor.faceMissingSec || 0),
        tabSwitches: Number(proctor.tabSwitches || 0),
      },
    },
    { merge: true },
  );
  if (attempt.kind === "final" && result.passed) {
    const enrollment = getFirestore().doc(`enrollments/${request.auth.uid}_${attempt.courseId}`);
    const existing = await enrollment.get();
    if (existing.exists) await enrollment.set({ passedFinal: true }, { merge: true });
  }
  return result;
});

function recipientName(userData, token) {
  const joined = [userData.firstName, userData.lastName].filter(Boolean).join(" ");
  return userData.displayName || joined || token.name || token.email || "UdyamPath learner";
}

export const issueCertificate = onCall(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in required.");
  const kind = String(request.data?.kind || "");
  const refId = String(request.data?.refId || "");
  if (!refId || !["course", "specialization"].includes(kind)) {
    throw new HttpsError("invalid-argument", "kind and refId are required.");
  }
  const db = getFirestore();
  const uid = request.auth.uid;
  const userSnap = await db.doc(`users/${uid}`).get();
  const name = recipientName(userSnap.data() || {}, request.auth.token || {});
  const owned = await db.collection("certificates").where("uid", "==", uid).get();
  const existing = owned.docs.find((item) => item.data().kind === kind && item.data().refId === refId);
  if (existing) return { id: existing.id, already: true, ...existing.data() };

  if (kind === "course") {
    const enrollmentSnap = await db.doc(`enrollments/${uid}_${refId}`).get();
    const enrollment = enrollmentSnap.data();
    if (!courseReady(enrollment)) {
      throw new HttpsError("failed-precondition", "Finish every lesson and pass the final test first.");
    }
    return saveCertificate({ db, uid, kind, refId, name, title: enrollment.courseTitle || refId });
  }

  const specs = JSON.parse(
    readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "public", "specializations.json"), "utf8"),
  ).specializations;
  const spec = specs.find((item) => slugify(item.name) === refId || String(item.id) === refId);
  if (!spec) throw new HttpsError("not-found", "Specialization not found.");
  const enrolled = await db.collection("enrollments").where("uid", "==", uid).get();
  const completed = enrolled.docs
    .map((item) => item.data())
    .filter((item) => Number(item.progressPct) >= 100 && item.passedFinal === true);
  const gaps = specializationGaps(
    (spec.courses || []).map((course) => course.name),
    { titles: completed.map((item) => item.courseTitle), ids: completed.map((item) => item.courseId) },
  );
  if (gaps.length) {
    throw new HttpsError("failed-precondition", `Still open: ${gaps.slice(0, 4).join(", ")}`);
  }
  return saveCertificate({ db, uid, kind, refId, name, title: spec.name });
});

async function saveCertificate({ db, uid, kind, refId, name, title }) {
  const issuedAt = Date.now();
  const ref = db.collection("certificates").doc();
  const pdfPath = `certificates/${ref.id}.pdf`;
  const bytes = await buildCertificatePdf({
    recipientName: name,
    title,
    certificateId: ref.id,
    issuedAt,
  });
  await getStorage().bucket().file(pdfPath).save(Buffer.from(bytes), { contentType: "application/pdf" });
  const record = {
    uid,
    kind,
    refId,
    title,
    recipientName: name,
    issuedAt,
    pdfPath,
    creditedCourseIds: [],
  };
  await ref.set(record);
  if (kind === "course") {
    await db.doc(`enrollments/${uid}_${refId}`).set({ certificateId: ref.id }, { merge: true });
  }
  return { id: ref.id, already: false, ...record };
}
