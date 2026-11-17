import { motion, useReducedMotion } from "framer-motion";
import discoverCoursesGif from "../../assets/img2.gif";
import jobSimulatorGif from "../../assets/img3.gif";
import perfectJobGif from "../../assets/img4.gif";

const steps = [
  {
    gif: discoverCoursesGif,
    title: "Hybrid pathway",
    description: "Prove what you already know with a test or a credential, and skip that part of the syllabus.",
  },
  {
    gif: jobSimulatorGif,
    title: "Job simulator",
    description: "After the certificate, practise real tasks on a deadline and earn a Job-Ready Badge.",
  },
  {
    gif: perfectJobGif,
    title: "A job you can afford",
    description: "See roles that match your skills and still cover the cost of living in that city.",
  },
];

const HowItWorks = () => {
  const reduce = useReducedMotion();

  return (
    <section style={styles.container}>
      <h2 style={styles.heading}>How it works</h2>
      <div style={styles.stepsWrapper}>
        {steps.map((step, index) => {
          const fromLeft = index % 2 === 0;
          return (
            <motion.article
              key={step.title}
              style={styles.step}
              initial={{ opacity: 0, x: reduce ? 0 : fromLeft ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: reduce ? 0.01 : 0.2, delay: index * 0.04 }}
            >
              <motion.div
                style={styles.number}
                initial={{ scale: reduce ? 1 : 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: reduce ? 0.01 : 0.2 }}
              >
                {index + 1}
              </motion.div>
              <img src={step.gif} alt="" style={styles.image} />
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepDescription}>{step.description}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

const styles = {
  container: {
    padding: "64px 20px",
    textAlign: "center",
    background: "var(--n-0)",
  },
  heading: {
    fontSize: "var(--fs-h2)",
    margin: "0 0 40px",
    fontWeight: 800,
    color: "var(--n-900)",
  },
  stepsWrapper: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "24px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  step: {
    flex: "1 1 260px",
    maxWidth: "320px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "var(--n-0)",
    border: "1px solid var(--n-200)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-xs)",
    padding: "28px 20px",
  },
  number: {
    width: "56px",
    height: "56px",
    borderRadius: "999px",
    background: "var(--brand-600)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "22px",
    marginBottom: "16px",
  },
  image: {
    width: "140px",
    height: "140px",
    marginBottom: "16px",
    objectFit: "cover",
    borderRadius: "var(--radius-md)",
  },
  stepTitle: {
    fontSize: "20px",
    fontWeight: 700,
    margin: "0 0 8px",
    color: "var(--n-900)",
  },
  stepDescription: {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.5,
    color: "var(--n-600)",
  },
};

export default HowItWorks;
