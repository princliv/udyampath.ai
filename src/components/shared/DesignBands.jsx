import { Link } from "react-router-dom";

const paths = [
  { mark: "DO", title: "DevOps Engineering", text: "Ship software, watch it run, and fix what breaks.", to: "/specializations", wash: "#f3e8ff", ink: "#7c3aed", tags: ["6 months", "Path"] },
  { mark: "BC", title: "Blockchain Development", text: "Contracts, wallets, and the systems around them.", to: "/specializations", wash: "#fef3c7", ink: "#b45309", tags: ["6 months", "Path"] },
  { mark: "GD", title: "Game Development", text: "Loops, physics, and a game you can show.", to: "/specializations", wash: "#ede9fe", ink: "#6d28d9", tags: ["6 months", "Path"] },
  { mark: "IoT", title: "Internet of Things", text: "Devices, sensors, and the software that ties them.", to: "/specializations", wash: "#e0f2fe", ink: "#0369a1", tags: ["6 months", "Path"] },
];

const subjects = [
  { mark: "OS", title: "Operating systems", to: "/notes", wash: "#d1fae5", ink: "#0f766e", tags: ["Notes", "PYQ"] },
  { mark: "DBMS", title: "Database systems", to: "/notes", wash: "#dbeafe", ink: "#1d4ed8", tags: ["Notes", "PYQ"] },
  { mark: "OOP", title: "Object oriented programming", to: "/notes", wash: "#ede9fe", ink: "#6d28d9", tags: ["Notes"] },
  { mark: "DSA", title: "Data structures", to: "/notes", wash: "#fce7f3", ink: "#be185d", tags: ["Notes", "PYQ"] },
  { mark: "JAVA", title: "Java", to: "/notes", wash: "#fef3c7", ink: "#b45309", tags: ["Notes"] },
  { mark: "SE", title: "Software engineering", to: "/notes", wash: "#fae8ff", ink: "#a21caf", tags: ["Notes"] },
];

function BandCard({ mark, title, text, to, wash, ink, tags, action = "Open" }) {
  return (
    <article className="path-card">
      <div className="path-card-band" style={{ "--wash": wash, "--ink": ink }}>
        <span className="path-card-mark">{mark}</span>
      </div>
      <div className="path-card-body">
        <h3>{title}</h3>
        {text ? <p>{text}</p> : null}
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

export function HomeDesignBand() {
  return (
    <section className="studio-page" style={{ minHeight: 0, paddingTop: 8 }}>
      <div className="studio-wrap">
        <div className="studio-grid">
          {paths.map((item) => (
            <BandCard key={item.mark} {...item} action="Open this path" />
          ))}
        </div>
        <div className="city-panel">
          <div>
            <p className="studio-kicker" style={{ color: "#fde68a" }}>Cost of living</p>
            <h2>₹40,000 means something different in Mumbai and Kolkata.</h2>
            <p>The same salary covers a different month in each city. Compare before you apply.</p>
            <Link className="studio-btn studio-btn--gold" to="/base">Compare cities</Link>
          </div>
          <Link className="studio-btn studio-btn--line" to="/jobpage" style={{ color: "#fff", borderColor: "#fff", alignSelf: "end" }}>
            See jobs
          </Link>
        </div>
        <div className="field-panel">
          <h2>Pick a field. We’ll show you the shortest honest path.</h2>
          <div className="studio-row" style={{ justifyContent: "center" }}>
            <Link className="studio-btn studio-btn--dark" to="/specializations">Start a path</Link>
            <Link className="studio-btn studio-btn--line" to="/jobpage">Browse jobs</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NotesDesignBand() {
  return (
    <section className="studio-page" style={{ minHeight: 0 }}>
      <div className="studio-wrap">
        <header>
          <p className="studio-kicker">Notes and study</p>
          <h1 className="studio-section-title" style={{ fontSize: "clamp(1.8rem, 1.2rem + 1.4vw, 2.3rem)", maxWidth: "18ch" }}>
            Revise faster, the night before and every week.
          </h1>
          <p className="studio-lead">Short notes, mind maps, flashcards, and previous-year papers for the core CS subjects.</p>
        </header>
        <div className="studio-grid">
          {subjects.map((item) => (
            <BandCard key={item.mark} {...item} action="Open notes" />
          ))}
        </div>
        <div className="field-panel" style={{ textAlign: "left" }}>
          <p className="studio-kicker">Flashcards</p>
          <h2 style={{ marginTop: 0 }}>Tap the card to see the answer.</h2>
          <p>What is a semaphore?</p>
          <Link className="studio-btn studio-btn--teal" to="/flashcards">Open flashcards</Link>
        </div>
      </div>
    </section>
  );
}

export function ProfileDesignBand({ name, location }) {
  const initials = (name || "UP")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <section className="studio-page" style={{ minHeight: 0, paddingBottom: 0 }}>
      <div className="studio-wrap">
        <div className="profile-band">
          <article className="path-card" style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span className="profile-initials">{initials}</span>
              <div>
                <p className="studio-kicker">My learning</p>
                <h2 style={{ margin: 0 }}>Welcome back</h2>
                <p className="studio-note">{name}{location ? ` · ${location}` : ""}</p>
              </div>
            </div>
          </article>
          <article className="path-card" style={{ padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>Continue learning</h3>
            <p className="studio-note">Pick up the course you left, or open the catalog.</p>
            <Link className="studio-btn studio-btn--dark" to="/coursepage">Open courses</Link>
          </article>
          <article className="job-ready-card">
            <p className="studio-kicker" style={{ color: "#c4b5fd" }}>Simulator</p>
            <h3>Job-Ready badge</h3>
            <p>Finish a simulator track and the badge shows on your profile.</p>
            <Link className="studio-btn studio-btn--line" to="/job-simulator" style={{ color: "#fff", borderColor: "#fff" }}>
              Open simulator
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
