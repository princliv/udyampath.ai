import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import functions from "firebase-functions/v1";
import { onCall, HttpsError } from "firebase-functions/v2/https";

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
