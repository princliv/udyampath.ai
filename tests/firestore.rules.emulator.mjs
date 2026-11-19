import { readFileSync } from "node:fs";
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";

const testEnv = await initializeTestEnvironment({
  projectId: "demo-udyam",
  firestore: {
    rules: readFileSync(new URL("../firestore.rules", import.meta.url), "utf8"),
    host: "127.0.0.1",
    port: 8080,
  },
});

function check(name, promise) {
  return promise.then(
    () => console.log(`ok ${name}`),
    (error) => {
      console.error(`failed ${name}`);
      throw error;
    },
  );
}

await testEnv.clearFirestore();

const alice = testEnv.authenticatedContext("alice");
await check(
  "owner creates a profile",
  assertSucceeds(setDoc(doc(alice.firestore(), "users", "alice"), { displayName: "Alice" })),
);
await check(
  "owner cannot write role",
  assertFails(setDoc(doc(alice.firestore(), "users", "alice"), { role: "admin" }, { merge: true })),
);
await check(
  "owner writes private data",
  assertSucceeds(setDoc(doc(alice.firestore(), "users", "alice", "private", "notes"), { value: [1] })),
);

const bob = testEnv.authenticatedContext("bob");
await check(
  "another user cannot read private data",
  assertFails(getDoc(doc(bob.firestore(), "users", "alice", "private", "notes"))),
);

await testEnv.withSecurityRulesDisabled(async (context) => {
  await setDoc(doc(context.firestore(), "courses", "java"), { title: "Java" });
});
await check(
  "public can read courses",
  assertSucceeds(getDoc(doc(testEnv.unauthenticatedContext().firestore(), "courses", "java"))),
);
await check(
  "a learner cannot write courses",
  assertFails(setDoc(doc(alice.firestore(), "courses", "hack"), { title: "nope" })),
);

await check(
  "an unapproved account cannot post",
  assertFails(
    setDoc(doc(alice.firestore(), "Recruiters", "alice", "jobs", "one"), { recruiterId: "alice", title: "Role" }),
  ),
);

const approved = testEnv.authenticatedContext("approved", { recruiterStatus: "approved" });
await check(
  "an approved recruiter can post",
  assertSucceeds(
    setDoc(doc(approved.firestore(), "Recruiters", "approved", "jobs", "one"), {
      recruiterId: "approved",
      title: "Role",
    }),
  ),
);

const legacy = testEnv.authenticatedContext("legacy");
await check(
  "a recruiter without a user document can still post",
  assertSucceeds(
    setDoc(doc(legacy.firestore(), "Recruiters", "legacy", "jobs", "one"), { recruiterId: "legacy", title: "Old" }),
  ),
);

await check(
  "question banks stay closed",
  assertFails(getDoc(doc(alice.firestore(), "questionBanks", "course", "questions", "q1"))),
);

await check(
  "a learner enrolls only on their own id",
  assertSucceeds(
    setDoc(doc(alice.firestore(), "enrollments", "alice_amazon-java"), {
      uid: "alice",
      courseId: "amazon-java",
      progressPct: 0,
      status: "in_progress",
      lessonsDone: {},
    }),
  ),
);
await check(
  "a learner cannot enroll as someone else",
  assertFails(
    setDoc(doc(alice.firestore(), "enrollments", "bob_amazon-java"), {
      uid: "bob",
      courseId: "amazon-java",
      progressPct: 0,
    }),
  ),
);
await check(
  "attempts stay closed to the client",
  assertFails(getDoc(doc(alice.firestore(), "assessmentAttempts", "one"))),
);

await testEnv.cleanup();
console.log("rules ok");
