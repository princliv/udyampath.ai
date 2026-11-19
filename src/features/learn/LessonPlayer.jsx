import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { findCourse, flattenLessons, loadCourses } from "./catalog";
import { readEnrollment, saveLessonProgress } from "./enroll";
import "./learn.css";

function LessonBody({ lesson }) {
  if (!lesson) return null;
  if (lesson.type === "video") {
    return <iframe className="learn-frame" title={lesson.title} src={lesson.content} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />;
  }
  if (lesson.type === "pdf") {
    return <iframe className="learn-frame" title={lesson.title} src={lesson.content} />;
  }
  if (lesson.type === "image") {
    return <img alt={lesson.title} src={lesson.content} style={{ maxWidth: "100%", borderRadius: 12 }} />;
  }
  if (lesson.type === "code") {
    return <pre className="learn-prose"><code>{lesson.content}</code></pre>;
  }
  return <div className="learn-prose" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(lesson.content || lesson.summary || "") }} />;
}

export default function LessonPlayer() {
  const { slug, lessonId } = useParams();
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => {
    loadCourses().then((courses) => setCourse(findCourse(courses, slug)));
  }, [slug]);

  const lessons = flattenLessons(course);
  const index = Math.max(0, lessons.findIndex((lesson) => lesson.id === lessonId));
  const lesson = lessons[index];
  const prev = lessons[index - 1];
  const next = lessons[index + 1];

  const lessonKey = lesson?.id;
  useEffect(() => {
    if (!user || !course || !lessonKey) return;
    saveLessonProgress(user.uid, course, lessonKey)
      .then(setEnrollment)
      .catch((error) => setMessage(error.message));
  }, [user, course, lessonKey]);

  useEffect(() => {
    if (!user || !course) return;
    readEnrollment(user.uid, course.id).then(setEnrollment);
  }, [user, course]);

  if (!course) {
    return <div className="learn-page"><div className="learn-wrap"><p>Loading lesson…</p></div></div>;
  }
  if (!lesson) {
    return <div className="learn-page"><div className="learn-wrap"><p>This course has no lessons yet.</p></div></div>;
  }

  return (
    <div className="learn-page">
      <div className="learn-wrap learn-player">
        <aside className="learn-panel learn-outline">
          <p className="studio-kicker">Outline</p>
          <h2 style={{ marginTop: 0 }}>{course.title}</h2>
          {lessons.map((item) => (
            <Link key={item.id} className={item.id === lesson.id ? "is-current" : undefined} to={`/courses/${course.slug}/learn/${item.id}`}>
              {enrollment?.lessonsDone?.[item.id] ? "Done · " : ""}{item.title}
            </Link>
          ))}
        </aside>
        <article className="learn-lesson">
          <p className="studio-kicker">{lesson.type} · {lesson.durationMin} min</p>
          <h1 className="learn-title">{lesson.title}</h1>
          {lesson.summary ? <p className="learn-muted">{lesson.summary}</p> : null}
          <LessonBody lesson={lesson} />
          <div className="learn-actions">
            {prev ? <Link className="studio-btn studio-btn--line" to={`/courses/${course.slug}/learn/${prev.id}`}>Previous</Link> : null}
            {next ? <Link className="studio-btn studio-btn--dark" to={`/courses/${course.slug}/learn/${next.id}`}>Next</Link> : (
              <Link className="studio-btn studio-btn--dark" to={`/courses/${course.slug}/assess/final`}>Take the final test</Link>
            )}
          </div>
          <p className="learn-muted">{user ? `${enrollment?.progressPct || 0}% saved to your enrollment.` : "Sign in to save progress and resume later."}</p>
          {message ? <p>{message}</p> : null}
        </article>
      </div>
    </div>
  );
}
