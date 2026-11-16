import { Link, useParams } from "react-router-dom";

export default function BadgeVerify() {
  const { id } = useParams();

  return (
    <div className="studio-page">
      <article className="studio-badge">
        <div className="studio-medal" aria-hidden="true">UP</div>
        <p className="studio-kicker">Job-Ready Badge</p>
        <h1 style={{ fontSize: "1.75rem", margin: "8px 0" }}>This badge is not issued yet</h1>
        <p className="studio-lead" style={{ marginInline: "auto" }}>
          Public check for badge <strong>{id}</strong>. UdyamPath only shows a badge after the learner finishes that field&apos;s simulator. This id is not in the registry.
        </p>
        <p style={{ marginTop: 20 }}>
          <Link className="studio-btn studio-btn--dark" to="/job-simulator">Open the simulator</Link>
        </p>
      </article>
    </div>
  );
}
