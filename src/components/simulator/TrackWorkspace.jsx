import { useState } from "react";

const TABS = [
  { id: "training", label: "Training" },
  { id: "task", label: "Task assigned" },
];

export default function TrackWorkspace() {
  const [tab, setTab] = useState("training");

  return (
    <section className="studio-hero studio-hero--sim" aria-labelledby="sim-title">
      <p className="studio-kicker">Job simulator · Data analyst</p>
      <h1 id="sim-title">Junior Data Analyst at Nimbus Retail</h1>
      <p className="studio-lead">
        A placement-style task for this field. Training explains the work. The assigned task is what you would submit before the deadline.
      </p>
      <div className="studio-tabs" role="tablist" aria-label="Simulator steps">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`studio-btn ${tab === item.id ? "studio-btn--gold" : "studio-btn--line"}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="studio-panel" role="tabpanel">
        {tab === "training" ? (
          <div className="studio-split">
            <div>
              <h2>How this role works</h2>
              <p className="studio-note">
                Nimbus Retail is a fictional company. You clean a sales export, check the numbers, and write what changed.
              </p>
              <ul>
                <li>Read the briefing before you open the sheet.</li>
                <li>The task has a deadline once it is assigned for real.</li>
                <li>A wrong answer should point you back to the lesson that covers that check.</li>
              </ul>
            </div>
            <aside>
              <h2>Next task</h2>
              <p>Clean last quarter&apos;s sales sheet.</p>
              <p className="studio-note">Graded submission and the Job-Ready Badge unlock after a specialization certificate. This screen is the workspace you will use.</p>
            </aside>
          </div>
        ) : (
          <div>
            <h2>Clean last quarter&apos;s sales sheet</h2>
            <p className="studio-note">
              Remove blank rows, fix the date column, and report revenue by category. A hidden check will grade this once the simulator backend is connected. Nothing you type here is scored yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
