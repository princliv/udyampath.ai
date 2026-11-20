import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { flattenLessons } from "./catalog";

export function enrollmentId(uid, courseId) {
  return `${uid}_${courseId}`;
}

export async function readEnrollment(uid, courseId) {
  if (!uid || !courseId) return null;
  const snap = await getDoc(doc(firestore, "enrollments", enrollmentId(uid, courseId)));
  return snap.exists() ? snap.data() : null;
}

export async function enroll(uid, course) {
  const id = enrollmentId(uid, course.id);
  const ref = doc(firestore, "enrollments", id);
  const existing = await getDoc(ref);
  if (existing.exists()) return existing.data();
  const data = {
    uid,
    courseId: course.id,
    courseTitle: course.title,
    status: "in_progress",
    progressPct: 0,
    lessonsDone: {},
    lastLessonId: "",
    startedAt: Date.now(),
  };
  await setDoc(ref, data);
  return data;
}

export async function saveLessonProgress(uid, course, lessonId) {
  const lessons = flattenLessons(course);
  const ref = doc(firestore, "enrollments", enrollmentId(uid, course.id));
  const existing = (await getDoc(ref)).data() || {
    uid,
    courseId: course.id,
    startedAt: Date.now(),
    progressPct: 0,
  };
  const lessonsDone = { ...(existing.lessonsDone || {}), [lessonId]: Date.now() };
  const progressPct = Math.min(100, Math.round((Object.keys(lessonsDone).length / Math.max(lessons.length, 1)) * 100));
  const data = {
    ...existing,
    uid,
    courseId: course.id,
    courseTitle: course.title,
    status: progressPct >= 100 ? "completed" : "in_progress",
    progressPct,
    lessonsDone,
    lastLessonId: lessonId,
    completedAt: progressPct >= 100 ? Date.now() : existing.completedAt || null,
  };
  await setDoc(ref, data);
  return data;
}
