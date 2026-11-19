import { Link } from "react-router-dom";

const washes = ["#ede9fe", "#dbeafe", "#d1fae5", "#fef3c7", "#fae8ff", "#e0f2fe"];
const inks = ["#5b21b6", "#1d4ed8", "#0f766e", "#b45309", "#a21caf", "#0369a1"];

export function CourseCard({ course }) {
  const index = course.title.length % washes.length;
  const mark = course.title.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "UP";
  return (
    <Link className="learn-card" to={`/courses/${course.slug}`}>
      <div className="learn-card-band" style={{ "--wash": washes[index], "--ink": inks[index] }}>
        <span className="learn-card-mark">{mark}</span>
      </div>
      <div className="learn-card-body">
        <p className="learn-muted">{course.provider.name}</p>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="learn-pills">
          <span>{course.level}</span>
          <span>{course.durationLabel || `${course.durationHours}h`}</span>
          <span>{course.topic}</span>
        </div>
      </div>
    </Link>
  );
}

export function CourseRow({ title, courses }) {
  if (!courses?.length) return null;
  return (
    <section className="learn-row">
      <h2>{title}</h2>
      <div className="learn-scroller">
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </section>
  );
}
