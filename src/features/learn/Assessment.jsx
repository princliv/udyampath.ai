import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "../../firebase/firebase";
import { findCourse, loadCourses } from "./catalog";
import { IssueCertificateButton } from "./certificates";
import "./learn.css";

const PROCTORED = new Set(["final", "placement"]);

async function facePresent(video) {
  const faceapi = await import("face-api.js");
  if (!facePresent.ready) {
    await faceapi.nets.tinyFaceDetector.loadFromUri(
      "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights",
    );
    facePresent.ready = true;
  }
  const found = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.4 }));
  return Boolean(found);
}

export default function Assessment({ kind: kindProp, courseTitle, courseId: courseIdProp }) {
  const params = useParams();
  const kind = kindProp || params.kind || "quiz";
  const proctor = PROCTORED.has(kind);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [user, setUser] = useState(null);
  const [courseLabel, setCourseLabel] = useState(courseTitle || "");
  const [courseId, setCourseId] = useState(courseIdProp || (kind === "placement" ? "placement" : ""));
  const [attemptId, setAttemptId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [faceOk, setFaceOk] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [faceMissingSec, setFaceMissingSec] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    if (courseIdProp || kind === "placement") return;
    loadCourses().then((courses) => {
      const found = findCourse(courses, params.slug || courseTitle || "");
      if (found) {
        setCourseId(found.id);
        setCourseLabel(found.title);
      }
    });
  }, [courseIdProp, courseTitle, kind, params.slug]);

  useEffect(() => {
    if (!proctor || !started) return undefined;
    const onHide = () => {
      if (document.hidden) setTabSwitches((count) => count + 1);
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [proctor, started]);

  useEffect(() => {
    if (!proctor || !started) return undefined;
    let stop = false;
    const tick = async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        setFaceMissingSec((seconds) => seconds + 1);
        return;
      }
      try {
        const seen = await facePresent(video);
        if (stop) return;
        setFaceOk(seen);
        if (!seen) setFaceMissingSec((seconds) => seconds + 1);
      } catch {
        setFaceOk(false);
      }
    };
    const timer = setInterval(tick, 1000);
    return () => {
      stop = true;
      clearInterval(timer);
    };
  }, [proctor, started]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const start = async () => {
    if (!user) {
      setMessage("Sign in to start. Grading runs on the server.");
      return;
    }
    const gradedCourseId = courseId || "catalog";
    setMessage("");
    if (proctor) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        setMessage("Camera permission was blocked. The test still records that the face check could not run.");
      }
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        setMessage("Fullscreen was blocked. Tab switches are still counted.");
      }
    }
    try {
      const call = httpsCallable(functions, "startAssessment");
      const response = await call({ courseId: gradedCourseId, kind });
      setAttemptId(response.data.attemptId);
      setQuestions(response.data.questions || []);
      setStarted(true);
    } catch (error) {
      setMessage(error.message || "Could not start the assessment. Start the functions emulator and sign in.");
    }
  };

  const submit = async () => {
    try {
      const call = httpsCallable(functions, "submitAssessment");
      const response = await call({
        attemptId,
        answers,
        proctor: { faceMissingSec, tabSwitches },
      });
      setResult(response.data);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    } catch (error) {
      setMessage(error.message || "Could not submit.");
    }
  };

  const question = questions[index];

  return (
    <div className="learn-page">
      <div className="learn-wrap learn-layout">
        <article className="learn-panel">
          <p className="studio-kicker">{kind} · server graded</p>
          <h1 className="learn-title">{courseLabel || "Assessment"}</h1>
          {!started ? (
            <>
              <p>Questions are scored by startAssessment and submitAssessment. The answer key never comes down to the page.</p>
              {proctor ? <p>This sitting uses the camera, a tiny face check, fullscreen, and a tab-switch count.</p> : null}
              {user ? <button className="studio-btn studio-btn--dark" type="button" onClick={start}>Start</button> : <Link className="studio-btn studio-btn--dark" to="/login">Sign in to start</Link>}
            </>
          ) : null}
          {started && question && !result ? (
            <>
              <p>Question {index + 1} of {questions.length}</p>
              <h2>{question.prompt}</h2>
              {question.options.map((option, optionIndex) => (
                <button
                  key={option}
                  type="button"
                  className={answers[question.id] === optionIndex ? "assess-option is-picked" : "assess-option"}
                  onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                >
                  {option}
                </button>
              ))}
              <div className="learn-actions">
                {index > 0 ? <button className="studio-btn studio-btn--line" type="button" onClick={() => setIndex(index - 1)}>Previous</button> : null}
                {index < questions.length - 1 ? (
                  <button className="studio-btn studio-btn--dark" type="button" onClick={() => setIndex(index + 1)}>Next</button>
                ) : (
                  <button className="studio-btn studio-btn--dark" type="button" onClick={submit}>Submit</button>
                )}
              </div>
            </>
          ) : null}
          {result ? (
            <div>
              <h2>{result.passed ? "Passed" : "Not passed yet"} · {result.score}%</h2>
              <p>{result.correct} of {result.total} correct. Pass mark is 70.</p>
              <ul>
                {(result.perQuestion || []).map((item) => (
                  <li key={item.id}>{item.correct ? "Correct" : "Review"} — {item.explanation}</li>
                ))}
              </ul>
              {result.passed && kind === "final" ? (
                <IssueCertificateButton kind="course" refId={courseId || "catalog"} label="Issue certificate" />
              ) : null}
              {params.slug ? <p><Link to={`/courses/${params.slug}`}>Back to the course</Link></p> : null}
            </div>
          ) : null}
          {message ? <p>{message}</p> : null}
        </article>
        {proctor ? (
          <aside className="learn-enroll">
            <p className="studio-kicker">Proctor</p>
            <video ref={videoRef} className="learn-video" autoPlay muted playsInline />
            <p>{faceOk ? "Face detected" : "Face not detected"}</p>
            <p>Away from camera: {faceMissingSec}s</p>
            <p>Tab switches: {tabSwitches}</p>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
