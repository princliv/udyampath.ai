import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { findCourse, flattenLessons, loadCourses, rememberCourse } from "./catalog";
import { enroll, readEnrollment } from "./enroll";
import { IssueCertificateButton } from "./certificates";
import "./learn.css";

export default function CourseView() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [open, setOpen] = useState(0);
  const [user, setUser] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    loadCourses().then((courses) => {
      const found = findCourse(courses, slug);
      setCourse(found);
      if (found) rememberCourse(found.slug);
    });
  }, [slug]);

  useEffect(() => {
    if (!user || !course) return;
    readEnrollment(user.uid, course.id).then(setEnrollment).catch((error) => setMessage(error.message));
  }, [user, course]);

  if (!course) return <div className="learn-page"><div className="learn-wrap"><p>Loading course…</p></div></div>;

  const first = flattenLessons(course)[0];
  const resumeId = enrollment?.lastLessonId || first?.id;
  const start = async () => {
    if (!user) return;
    try {
      setEnrollment(await enroll(user, course));
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="learn-page">
      <div className="learn-wrap learn-layout">
        <article>
          <header className="learn-hero">
            <p className="studio-kicker">{course.provider.name}</p>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <div className="learn-pills">
              <span>{course.level}</span>
              <span>{course.durationLabel || `${course.durationHours} hours`}</span>
              <span>{course.topic}</span>
            </div>
          </header>
          <section className="learn-panel">
            <h2>Skills</h2>
            <div className="learn-pills">
              {course.skills.map((skill) => <span key={skill}>{skill}</span>)}
            </div>
          </section>
          <section className="learn-panel learn-syllabus" style={{ marginTop: 16 }}>
            <h2>Syllabus</h2>
            {course.modules.map((module, index) => (
              <div key={module.id}>
                <button type="button" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>
                  {module.title}
                  <span className="learn-muted"> · {module.lessons.length} lessons</span>
                </button>
                {open === index ? (
                  <ul>
                    {module.lessons.map((lesson) => (
                      <li key={lesson.id}>
                        <Link to={`/courses/${course.slug}/learn/${lesson.id}`}>{lesson.title}</Link>
                        <span className="learn-muted"> · {lesson.type} · {lesson.durationMin} min</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </section>
        </article>
        <aside className="learn-enroll">
          <p className="studio-kicker">Enroll</p>
          <h2 style={{ marginTop: 0 }}>{course.title}</h2>
          <p className="learn-muted">{course.provider.name} · {course.durationLabel}</p>
          {enrollment ? <p>{enrollment.progressPct || 0}% complete</p> : <p>Not enrolled yet.</p>}
          {user ? (
            <button className="studio-btn studio-btn--dark" type="button" onClick={start}>
              {enrollment ? "Enrolled" : "Enroll"}
            </button>
          ) : (
            <Link className="studio-btn studio-btn--dark" to="/login">Sign in to enroll</Link>
          )}
          {resumeId ? (
            <p><Link to={`/courses/${course.slug}/learn/${resumeId}`}>Resume where you left off</Link></p>
          ) : null}
          <p><Link to={`/courses/${course.slug}/assess/quiz`}>Quiz</Link> · <Link to={`/courses/${course.slug}/assess/final`}>Final test</Link></p>
          {enrollment?.certificateId ? <p><Link to={`/verify/certificate/${enrollment.certificateId}`}>View certificate</Link></p> : null}
          {user && enrollment?.progressPct >= 100 && enrollment?.passedFinal && !enrollment?.certificateId ? (
            <IssueCertificateButton kind="course" refId={course.id} label="Issue certificate" />
          ) : null}
          <p><Link to="/learn">My learning</Link></p>
          {message ? <p>{message}</p> : null}
        </aside>
      </div>
    </div>
  );
}
