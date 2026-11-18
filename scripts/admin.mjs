import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const command = process.argv[2];
const uid = process.argv.find((arg) => arg.startsWith("--uid="))?.slice("--uid=".length);

if (!["bootstrap-admin", "approve-recruiter"].includes(command) || !uid) {
  console.error("Usage: node scripts/admin.mjs bootstrap-admin|approve-recruiter --uid=<uid>");
  process.exit(1);
}

if (!process.env.FIRESTORE_EMULATOR_HOST) process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || "demo-udyam";
initializeApp({
  projectId,
  credential: { getAccessToken: async () => ({ access_token: "owner", expires_in: 3600 }) },
});

const patch =
  command === "bootstrap-admin"
    ? { role: "admin" }
    : { role: "recruiter", recruiterStatus: "approved" };
const claims =
  command === "bootstrap-admin"
    ? { admin: true, role: "admin" }
    : { role: "recruiter", recruiterStatus: "approved" };

await getFirestore().doc(`users/${uid}`).set(patch, { merge: true });
try {
  const user = await getAuth().getUser(uid);
  await getAuth().setCustomUserClaims(uid, { ...(user.customClaims || {}), ...claims });
  console.log(`${command} updated Firestore and claims for ${uid}.`);
} catch (error) {
  console.log(`${command} updated Firestore for ${uid}. Claims were not set (${error.code || "auth unavailable"}).`);
}
