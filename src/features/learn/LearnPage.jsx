import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion, useReducedMotion } from "framer-motion";
import { auth, firestore } from "../../firebase/firebase";
import { flattenLessons, loadCourses } from "./catalog";
import "./learn.css";

export default function LearnPage() {
  const reduce = useReducedMotion();
  const [user, setUser] = useState(undefined);
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    if (!user) return undefined;
    let stop = false;
    Promise.all([
      getDocs(query(collection(firestore, "enrollments"), where("uid", "==", user.uid))),
      loadCourses(),
    ])
      .then(([snap, courses]) => {
        if (stop) return;
        setRows(snap.docs.map((item) => {
          const data = item.data();
          const course = courses.find((entry) => entry.id === data.courseId);
          const lessons = flattenLessons(course);
          const next = lessons.find((lesson) => !data.lessonsDone?.[lesson.id]) || lessons[0];
          return { id: item.id, ...data, course, nextLessonId: next?.id, nextTitle: next?.title };
        }));
      })
      .catch((error) => setMessage(error.message));
    return () => {
      stop = true;
    };
  }, [user]);

  return (
    <div className="learn-page">
      <div className="learn-wrap">
        <header className="learn-hero">
          <p className="studio-kicker">My learning</p>
          <h1>Pick up where you left off.</h1>
        </header>
        {user === undefined ? <p>Loading your courses…</p> : null}
        {user === null ? <p><Link to="/login">Sign in</Link> to see the courses you have enrolled in.</p> : null}
        {message ? <p>{message}</p> : null}
        {user && !rows.length && !message ? (
          <p>No enrollments yet. <Link to="/explore">Browse the catalog.</Link></p>
        ) : null}
        <div className="learn-scroller">
          {rows.map((row) => (
            <article key={row.id} className="learn-panel">
              <h2 style={{ marginTop: 0 }}>{row.course?.title || row.courseTitle || row.courseId}</h2>
              <p className="learn-muted">{row.progressPct || 0}% complete</p>
              <div className="learn-progress" aria-hidden="true">
                <motion.span
                  initial={{ width: reduce ? `${row.progressPct || 0}%` : 0 }}
                  animate={{ width: `${row.progressPct || 0}%` }}
                  transition={{ duration: reduce ? 0 : 0.6 }}
                />
              </div>
              {row.course && row.nextLessonId ? (
                <Link className="studio-btn studio-btn--dark" to={`/courses/${row.course.slug}/learn/${row.nextLessonId}`}>
                  {row.nextTitle ? `Next: ${row.nextTitle}` : "Continue"}
                </Link>
              ) : null}
              {row.certificateId ? (
                <p><Link to={`/verify/certificate/${row.certificateId}`}>View certificate</Link></p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
