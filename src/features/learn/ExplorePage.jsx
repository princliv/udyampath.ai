import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { courseRows, filterCourses, loadCourses, readRecentSlugs } from "./catalog";
import { CourseRow } from "./CourseCard";
import "./learn.css";

const emptyFilters = { q: "", topic: "all", level: "all", duration: "all", provider: "all" };

export default function ExplorePage() {
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourses().then(setCourses).catch((err) => setError(err.message));
  }, []);

  const filtered = useMemo(() => filterCourses(courses, filters), [courses, filters]);
  const rows = useMemo(() => courseRows(filtered, readRecentSlugs()), [filtered]);
  const topics = [...new Set(courses.map((course) => course.topic))];
  const levels = [...new Set(courses.map((course) => course.level))];
  const providers = [...new Set(courses.map((course) => course.provider.name))];
  const set = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));

  return (
    <div className="learn-page">
      <div className="learn-wrap">
        <header className="learn-hero">
          <p className="studio-kicker">Catalog</p>
          <h1>Find a course, then prove it.</h1>
          <p className="learn-muted">Search by topic, level, length, and provider. The same card is used in every row.</p>
          <p><Link to="/learn">My learning</Link> · <Link to="/coursepage">60-second learning and the daily challenge</Link></p>
        </header>
        <div className="learn-filters">
          <label>Search<input className="learn-search" value={filters.q} onChange={set("q")} placeholder="Java, data, cloud" /></label>
          <label>Topic<select value={filters.topic} onChange={set("topic")}><option value="all">All topics</option>{topics.map((topic) => <option key={topic}>{topic}</option>)}</select></label>
          <label>Level<select value={filters.level} onChange={set("level")}><option value="all">All levels</option>{levels.map((level) => <option key={level}>{level}</option>)}</select></label>
          <label>Duration<select value={filters.duration} onChange={set("duration")}><option value="all">Any length</option><option value="short">Short</option><option value="medium">Medium</option><option value="long">Long</option></select></label>
          <label>Provider<select value={filters.provider} onChange={set("provider")}><option value="all">All providers</option>{providers.map((provider) => <option key={provider}>{provider}</option>)}</select></label>
        </div>
        {error ? <p>{error}</p> : null}
        {!courses.length && !error ? <p>Loading courses…</p> : null}
        <CourseRow title="Popular" courses={rows.popular} />
        <CourseRow title="New" courses={rows.newest} />
        <CourseRow title="Recommended" courses={rows.recommended} />
        <CourseRow title="Recently viewed" courses={rows.recent} />
        {!filtered.length && courses.length ? <p>No courses match those filters.</p> : null}
      </div>
    </div>
  );
}
