import { useState } from "react";
import { Link } from "react-router-dom";

const groups = [
  {
    id: "interview",
    title: "Interview prep",
    items: [
      {
        mark: "TI",
        title: "Tech interview",
        text: "Role questions for the skills, the system, and the work you will be asked to show.",
        to: "/techInterview",
        wash: "#fde8df",
        ink: "#e25b2a",
        kicker: "Practice",
        tags: ["30 min", "Questions"],
        action: "Start practising",
      },
      {
        mark: "HR",
        title: "HR interview",
        text: "Behaviour questions and the stories that make an answer sound specific.",
        to: "/hrInterview",
        wash: "#fde2e4",
        ink: "#d63b45",
        kicker: "Practice",
        tags: ["Stories", "Behaviour"],
        action: "Start practising",
      },
      {
        mark: "GD",
        title: "Group discussion",
        text: "Topics, speaking turns, and how a round is scored.",
        to: "/groupdiscussion",
        wash: "#fde8df",
        ink: "#e07a2f",
        kicker: "Practice",
        tags: ["Topics", "Roles"],
        action: "Join a practice",
      },
    ],
  },
  {
    id: "placement",
    title: "Placement prep",
    items: [
      {
        mark: "PT",
        title: "Placement tests",
        text: "Aptitude and company-style tests you can sit before the real paper.",
        to: "/placeTest",
        wash: "#e7f1ff",
        ink: "#2457f5",
        kicker: "Timed",
        tags: ["Aptitude", "Timed"],
        action: "Start a test",
      },
      {
        mark: "PP",
        title: "Company papers",
        text: "Previous papers from campus and product companies.",
        to: "/placementpapers",
        wash: "#e7f1ff",
        ink: "#1d4ed8",
        kicker: "Papers",
        tags: ["Amazon", "Google"],
        action: "Open papers",
      },
      {
        mark: "IC",
        title: "Interview checklist",
        text: "What to have ready the day before you walk in.",
        to: "/interview-checklist",
        wash: "#e7f1ff",
        ink: "#2563eb",
        kicker: "Checklist",
        tags: ["Resume", "Links"],
        action: "Open checklist",
      },
    ],
  },
  {
    id: "soft",
    title: "Soft skills",
    items: [
      {
        mark: "CO",
        title: "Communication",
        text: "Speak and write clearly in tech and HR rounds.",
        to: "/communication",
        wash: "#f3e8ff",
        ink: "#7c3aed",
        kicker: "Skill",
        tags: ["Speaking", "Email"],
        action: "Start session",
      },
      {
        mark: "AD",
        title: "Adaptability",
        text: "Handle changing tasks, feedback, and new teams.",
        to: "/adaptability",
        wash: "#f3e8ff",
        ink: "#6d28d9",
        kicker: "Skill",
        tags: ["Feedback", "New teams"],
        action: "Start session",
      },
      {
        mark: "TM",
        title: "Time management",
        text: "Plan the week around classes, prep, and deadlines.",
        to: "/timemanage",
        wash: "#fae8ff",
        ink: "#a21caf",
        kicker: "Skill",
        tags: ["Planning", "Deadlines"],
        action: "Start session",
      },
    ],
  },
  {
    id: "profile",
    title: "Build your profile",
    items: [
      {
        mark: "PR",
        title: "Project ideas",
        text: "Portfolio projects you can explain in an interview.",
        to: "/Pdetails",
        wash: "#e7f8f1",
        ink: "#0f766e",
        kicker: "Portfolio",
        tags: ["Build", "Explain"],
        action: "Open ideas",
      },
      {
        mark: "RC",
        title: "Resume check",
        text: "See which keywords the role is asking for.",
        to: "/resume-check",
        wash: "#e7f8f1",
        ink: "#0f766e",
        kicker: "Resume",
        tags: ["Keywords", "Role"],
        action: "Check resume",
      },
      {
        mark: "AI",
        title: "AI mentor",
        text: "Ask Mentora while you prepare. Full chat is coming.",
        to: "/ai-mentor",
        wash: "#fff4e8",
        ink: "#c2410c",
        kicker: "Mentor",
        tags: ["Coming soon"],
        action: "Open mentor",
      },
    ],
  },
];

function PathCard({ mark, title, text, to, wash, ink, kicker, tags, action }) {
  return (
    <article className="path-card">
      <div className="path-card-band" style={{ "--wash": wash, "--ink": ink }}>
        <span className="path-card-kicker">{kicker}</span>
        <span className="path-card-mark">{mark}</span>
      </div>
      <div className="path-card-body">
        <h3>{title}</h3>
        <p>{text}</p>
        <div className="path-card-meta">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <Link className="studio-btn studio-btn--dark" to={to}>
          {action}
        </Link>
      </div>
    </article>
  );
}

export default function ToolsHub() {
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? groups : groups.filter((group) => group.id === filter);

  return (
    <div className="studio-page">
      <div className="studio-wrap">
        <header>
          <p className="studio-kicker">Career tools</p>
          <h1 className="studio-section-title" style={{ fontSize: "clamp(1.8rem, 1.2rem + 1.6vw, 2.4rem)", maxWidth: "16ch" }}>
            Practise the parts of placement no course teaches.
          </h1>
          <p className="studio-lead">
            Interviews, aptitude tests, group discussions, and the profile pieces recruiters open.
          </p>
          <div className="studio-tabs" role="tablist" aria-label="Tool groups">
            <button
              type="button"
              className={filter === "all" ? "studio-btn studio-btn--dark" : "studio-btn studio-btn--line"}
              onClick={() => setFilter("all")}
            >
              All tools
            </button>
            {groups.map((group) => (
              <button
                key={group.id}
                type="button"
                className={filter === group.id ? "studio-btn studio-btn--dark" : "studio-btn studio-btn--line"}
                onClick={() => setFilter(group.id)}
              >
                {group.title}
              </button>
            ))}
          </div>
        </header>

        {visible.map((group) => (
          <section key={group.id}>
            <h2 className="studio-section-title">{group.title}</h2>
            <div className="studio-grid">
              {group.items.map((item) => (
                <PathCard key={item.to} {...item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
