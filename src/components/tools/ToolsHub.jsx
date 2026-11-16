import { Link } from "react-router-dom";

const interview = [
  { title: "Technical interview", text: "Practice questions for the role you want.", to: "/techInterview" },
  { title: "HR interview", text: "Common questions and how to answer them.", to: "/hrInterview" },
  { title: "Group discussion", text: "Topics, roles, and how a round is scored.", to: "/groupdiscussion" },
  { title: "Company papers", text: "Previous papers from campus and product companies.", to: "/placementpapers" },
  { title: "Interview checklist", text: "What to have ready before you walk in.", to: "/interview-checklist" },
];

const soft = [
  { mark: "CO", title: "Communication", text: "Speak and write clearly in tech and HR rounds.", to: "/communication", tone: "#ede9fe", ink: "#4f3fd1" },
  { mark: "AD", title: "Adaptability", text: "Handle changing tasks, feedback, and new teams.", to: "/adaptability", tone: "#f3e8ff", ink: "#6d28d9" },
  { mark: "TM", title: "Time management", text: "Plan your week around classes, prep, and deadlines.", to: "/timemanage", tone: "#fae8ff", ink: "#a21caf" },
];

const profile = [
  { mark: "PR", title: "Project ideas", text: "Portfolio projects you can explain in an interview.", to: "/Pdetails", tone: "#ecfdf5", ink: "#0f766e" },
  { mark: "RC", title: "Resume check", text: "See which keywords the role is asking for.", to: "/resume-check", tone: "#f0fdfa", ink: "#0f766e" },
  { mark: "AI", title: "AI mentor", text: "Ask Mentora while you prepare. Full chat is coming.", to: "/ai-mentor", tone: "#fff7ed", ink: "#c2410c" },
];

function DarkTile({ title, text, to }) {
  return (
    <article className="studio-tile">
      <h3>{title}</h3>
      <p>{text}</p>
      <Link className="studio-btn studio-btn--dark" to={to}>Open</Link>
    </article>
  );
}

function MarkTile({ mark, title, text, to, tone, ink }) {
  return (
    <Link className="studio-tile" to={to}>
      <span className="studio-mark" style={{ "--mark": tone, "--ink": ink }}>{mark}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </Link>
  );
}

export default function ToolsHub() {
  return (
    <div className="studio-page">
      <div className="studio-wrap">
        <header className="studio-hero studio-hero--tools">
          <p className="studio-kicker">Career tools</p>
          <h1>Prepare for the round, then the job</h1>
          <p className="studio-lead">
            Interview practice, company papers, soft skills, and the profile pieces recruiters actually open.
          </p>
        </header>

        <section>
          <h2 className="studio-section-title">Interview prep</h2>
          <div className="studio-grid">
            {interview.map((item) => <DarkTile key={item.to} {...item} />)}
          </div>
        </section>

        <section>
          <h2 className="studio-section-title">Soft skills</h2>
          <div className="studio-grid">
            {soft.map((item) => <MarkTile key={item.to} {...item} />)}
          </div>
        </section>

        <section>
          <h2 className="studio-section-title">Build your profile</h2>
          <div className="studio-grid">
            {profile.map((item) => <MarkTile key={item.to} {...item} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
