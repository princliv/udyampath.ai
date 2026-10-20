import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
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
