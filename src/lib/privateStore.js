import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

function readLocal(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export async function loadPrivate(uid, docId, localKey, fallback) {
  const local = readLocal(localKey);
  if (!uid) return local ?? fallback;
  const snap = await getDoc(doc(firestore, "users", uid, "private", docId));
  if (snap.exists() && snap.data().value != null) return snap.data().value;
  if (local != null) {
    await setDoc(doc(firestore, "users", uid, "private", docId), { value: local });
    return local;
  }
  return fallback;
}

export async function savePrivate(uid, docId, localKey, value) {
  writeLocal(localKey, value);
  if (!uid) return;
  await setDoc(doc(firestore, "users", uid, "private", docId), { value });
}
