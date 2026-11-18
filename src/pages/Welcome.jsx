import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { writeProfile } from "../lib/firebase";
import { Progress } from "../components/ui";

const steps = [
  {
    key: "goal",
    title: "What do you want to become?",
    hint: "A role or a field is enough. You can change this later.",
  },
  {
    key: "city",
    title: "Which city are you in now?",
    hint: "We use this when a job's pay is compared with the cost of living.",
  },
  {
    key: "lifestyle",
    title: "What does a normal month cost you?",
    hint: "Low, medium, or high. This is an estimate, not a judgement.",
    options: [
      ["low", "Low"],
      ["medium", "Medium"],
      ["high", "High"],
    ],
  },
  {
    key: "arrangement",
    title: "How do you live?",
    hint: "Shared and single change the rent we assume.",
    options: [
      ["shared", "Shared"],
      ["single", "On my own"],
    ],
  },
];

export default function Welcome() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [city, setCity] = useState("");
  const [lifestyle, setLifestyle] = useState("medium");
  const [arrangement, setArrangement] = useState("shared");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const current = steps[step];

  const finish = async () => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/homepage");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await writeProfile(user.uid, {
        displayName: user.displayName || "",
        email: user.email || "",
        location: { cityId: city.trim().toLowerCase().replace(/\s+/g, "-"), label: city.trim() },
        preferences: { goal: goal.trim(), lifestyle, arrangement },
        onboarding: { completed: true },
      });
      navigate("/homepage", { replace: true });
    } catch (err) {
      setError(err.message || "Could not save onboarding.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <Progress label="Welcome" value={((step + 1) / steps.length) * 100} />
        <h1 style={styles.title}>{current.title}</h1>
        <p style={styles.hint}>{current.hint}</p>
        {current.key === "goal" ? (
          <input style={styles.input} value={goal} onChange={(event) => setGoal(event.target.value)} aria-label="Goal" />
        ) : null}
        {current.key === "city" ? (
          <input style={styles.input} value={city} onChange={(event) => setCity(event.target.value)} aria-label="City" />
        ) : null}
        {current.options ? (
          <div style={styles.options}>
            {current.options.map(([value, label]) => {
              const selected = (current.key === "lifestyle" ? lifestyle : arrangement) === value;
              return (
                <button
                  key={value}
                  type="button"
                  style={{ ...styles.option, ...(selected ? styles.optionOn : null) }}
                  onClick={() => (current.key === "lifestyle" ? setLifestyle(value) : setArrangement(value))}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ) : null}
        {error ? <p style={styles.error}>{error}</p> : null}
        <div style={styles.row}>
          {step > 0 ? (
            <button type="button" style={styles.secondary} onClick={() => setStep((value) => value - 1)}>
              Back
            </button>
          ) : (
            <span />
          )}
          {step < steps.length - 1 ? (
            <button type="button" style={styles.primary} onClick={() => setStep((value) => value + 1)}>
              Next
            </button>
          ) : (
            <button type="button" style={styles.primary} onClick={finish} disabled={saving}>
              {saving ? "Saving..." : "Finish"}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    background: "var(--bg)",
  },
  card: {
    width: "min(100%, 420px)",
    background: "#fff",
    border: "1px solid var(--n-200)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-xs)",
    padding: "24px",
  },
  title: { fontSize: "28px", fontWeight: 800, margin: "16px 0 8px", color: "var(--n-900)" },
  hint: { margin: "0 0 16px", color: "var(--n-600)" },
  input: {
    width: "100%",
    minHeight: "44px",
    borderRadius: "10px",
    border: "1px solid var(--n-300)",
    padding: "10px 12px",
    fontSize: "16px",
  },
  options: { display: "flex", flexDirection: "column", gap: "8px" },
  option: {
    minHeight: "44px",
    borderRadius: "10px",
    border: "1px solid var(--n-300)",
    background: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  optionOn: { borderColor: "var(--brand-600)", background: "var(--brand-50)", color: "var(--brand-700)" },
  row: { display: "flex", justifyContent: "space-between", marginTop: "20px" },
  primary: {
    minHeight: "44px",
    padding: "0 18px",
    border: 0,
    borderRadius: "10px",
    background: "var(--brand-600)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondary: {
    minHeight: "44px",
    padding: "0 18px",
    borderRadius: "10px",
    border: "1px solid var(--n-300)",
    background: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  error: { color: "var(--danger)", marginTop: "12px" },
};
