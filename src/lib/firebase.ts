import {
  doc,
  getDoc,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "../firebase/firebase.js";

export type Lifestyle = "low" | "medium" | "high";
export type Arrangement = "shared" | "single";

export type UserProfile = {
  displayName?: string;
  email?: string;
  photoURL?: string;
  bannerURL?: string;
  phone?: string;
  recruiterRequested?: boolean;
  location?: { cityId?: string; state?: string; label?: string };
  preferences?: {
    lifestyle?: Lifestyle;
    arrangement?: Arrangement;
    goal?: string;
  };
  education?: Record<string, string>[];
  experience?: Record<string, string>[];
  skills?: string[];
  links?: { linkedin?: string; github?: string; portfolio?: string };
  highlights?: string[];
  documents?: { name: string; path: string }[];
  onboarding?: { completed?: boolean };
  form?: Record<string, string>;
  role?: "learner" | "recruiter" | "admin";
  recruiterStatus?: "pending" | "approved";
};

const protectedFields = ["role", "recruiterStatus"];

export function userDoc(uid: string) {
  return doc(firestore, "users", uid);
}

export function stripProtected(data: DocumentData) {
  const next = { ...data };
  for (const key of protectedFields) delete next[key];
  return next;
}

export async function readProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(userDoc(uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function writeProfile(uid: string, patch: DocumentData) {
  await setDoc(userDoc(uid), stripProtected(patch), { merge: true });
}

export const profileConverter = {
  toFirestore(profile: UserProfile) {
    return stripProtected(profile);
  },
  fromFirestore(snapshot: { data: () => DocumentData }) {
    return snapshot.data() as UserProfile;
  },
};

export type CourseRecord = { title: string; company?: string; slug: string; source: "seed" };
export type CityRecord = {
  name: string;
  slug: string;
  medium: Record<string, number>;
  low: Record<string, number>;
  high: Record<string, number>;
  source: "seed";
};
export type JobRecord = {
  title: string;
  company?: string;
  kind: "job" | "internship";
  cityId?: string;
  salary?: { raw: string; period: "year" | "month"; monthly: number };
  source: "seed";
};

export async function uploadUserFile(uid: string, file: File, folder: string) {
  const safeName = file.name.replace(/[^\w.\-]+/g, "-");
  const path = `users/${uid}/${folder}/${Date.now()}-${safeName}`;
  const stored = ref(storage, path);
  await uploadBytes(stored, file);
  const url = await getDownloadURL(stored);
  return { path, url };
}
