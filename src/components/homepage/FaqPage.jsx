import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    question: "How can I get job recommendations?",
    answer:
      "Search for the city you want to live in. Each role is marked from its posted pay against that city's monthly cost.",
  },
  {
    question: "How can I find the cost of living in different cities?",
    answer:
      'Open Compare cities, enter a city, and read the monthly cost next to the jobs posted there.',
  },
  {
    question: "How can I customize my course?",
    answer:
      "If you already know a module, take its test. A pass credits that part so you continue with what you still need.",
  },
  {
    question: "How can I convert my notes?",
    answer: "Open Notes, upload a PDF, and pick the diagram you want your notes turned into.",
  },
];

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>Frequently asked questions</h2>
      <div style={styles.list}>
        {faqData.map((faq, index) => {
          const open = openIndex === index;
          const panelId = `faq-panel-${index}`;
          return (
            <div key={faq.question} style={styles.item}>
              <button
                type="button"
                style={styles.question}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  size={20}
                  aria-hidden="true"
                  style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }}
                />
              </button>
              <div id={panelId} role="region" style={{ ...styles.panel, maxHeight: open ? "160px" : "0" }}>
                <p style={styles.answer}>{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: "64px 20px 80px",
    background: "var(--bg)",
  },
  heading: {
    textAlign: "center",
    color: "var(--n-900)",
    fontSize: "var(--fs-h2)",
    fontWeight: 800,
    margin: "0 0 24px",
  },
  list: {
    maxWidth: "720px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  item: {
    background: "var(--n-0)",
    border: "1px solid var(--n-200)",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
  },
  question: {
    width: "100%",
    minHeight: "44px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    padding: "14px 16px",
    background: "transparent",
    border: 0,
    cursor: "pointer",
    textAlign: "left",
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--n-900)",
  },
  panel: {
    overflow: "hidden",
    transition: "max-height 200ms ease",
  },
  answer: {
    margin: 0,
    padding: "0 16px 16px",
    color: "var(--n-600)",
    lineHeight: 1.5,
  },
};

export default FaqPage;
