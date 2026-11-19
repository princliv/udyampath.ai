import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import functions from "firebase-functions/v1";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { gradeAttempt, publicQuestion, selectQuestions } from "./grade.js";

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
  return result;
});
