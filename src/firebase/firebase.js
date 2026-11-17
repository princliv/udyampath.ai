import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  connectAuthEmulator,
} from "firebase/auth";
import { connectDatabaseEmulator, get, getDatabase, ref, set } from "firebase/database";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const missingEnv = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingEnv.length) {
  console.error(
    `Missing Firebase env (${missingEnv.join(", ")}). Copy .env.example to .env.local.`,
  );
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

if (import.meta.env.VITE_USE_EMULATORS === "true" && !globalThis.__UDYAM_EMULATORS__) {
  globalThis.__UDYAM_EMULATORS__ = true;
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
  connectDatabaseEmulator(database, "127.0.0.1", 9000);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
}
const googleProvider = new GoogleAuthProvider();

// ✅ Ensure users stay signed in
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Auth persistence setup failed:", error.message);
});

const splitDisplayName = (displayName) => {
  const parts = (displayName || "").split(" ").filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
};

export const getUserProfile = async (uid) => {
  const snapshot = await get(ref(database, `users/${uid}`));
  return snapshot.exists() ? snapshot.val() : null;
};

export const homeForRole = (userType) =>
  String(userType || "").toLowerCase() === "recruiter" ? "/recruiter" : "/homepage";

// Creates users/{uid} only when it is missing, so a later Google sign-in
// cannot overwrite an existing role.
export const signInWithGoogle = async (options = {}) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return { user, profile: snapshot.val() };
    }

    const { firstName, lastName } = splitDisplayName(user.displayName);
    const requested = String(options.userType || "Candidate");
    const profile = {
      firstName,
      lastName,
      email: user.email || "",
      profilePicture: user.photoURL || "",
      userType: requested.toLowerCase() === "recruiter" ? "Recruiter" : "Candidate",
    };
    await set(userRef, profile);
    return { user, profile };
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
    throw error;
  }
};

// ✅ Email & Password Login
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};

// ✅ Email & Password Signup (Optional)
export const signUpWithEmail = async (email, password, firstName, lastName, phone, userType) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user info in the Realtime Database
    await set(ref(database, `users/${user.uid}`), {
      firstName,
      lastName,
      email,
      phone,
      userType,
    });

    return user;
  } catch (error) {
    console.error("Signup Error:", error.message);
    throw error;
  }
};

export { auth, database, firestore, storage, googleProvider };
export default app;
