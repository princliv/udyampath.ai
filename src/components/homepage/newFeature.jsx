import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import homeSection2 from "../../assets/homeSection2.jpeg";
import homeSection3 from "../../assets/notes.png";
import homeSection4 from "../../assets/course.jpg";

const cardData = [
  {
    image: homeSection3,
    title: "Notes Hard to Read? Discover Visual Diagrams!",
    description: "Transform your lengthy notes into easy-to-understand diagrams in seconds.",
    link: "/notes",
  },
  {
    image: homeSection2,
    title: "Know the Cost of Living Around You",
    description: "Get real-time reports tailored to your location and make informed decisions.",
    link: "/base",
  },
  {
    image: homeSection4,
    title: "Skip What You Know, Learn What You Don't",
    description: "Start a course customized to your knowledge level—no repetition, just growth.",
    link: "/coursepage",
  },
];

const NewFeature = () => {
  const reduce = useReducedMotion();

  return (
    <section id="whats-new" style={styles.container}>
      <h2 style={styles.heading}>What's New for You</h2>
      <motion.div
        style={styles.cardContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: reduce ? 0 : 0.04 } },
        }}
      >
        {cardData.map((item) => (
          <motion.article
            key={item.link}
            className="home-feature-card"
            style={styles.card}
            variants={{
              hidden: { opacity: 0, y: reduce ? 0 : 12 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Link to={item.link} style={styles.link}>
              <img src={item.image} alt="" style={styles.image} />
              <div style={styles.textContainer}>
                <h3 style={styles.cardHeading}>{item.title}</h3>
                <p style={styles.subHeading}>{item.description}</p>
                <span style={styles.learnMore}>Learn more</span>
              </div>
            </Link>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
};

const styles = {
  container: {
    padding: "64px 24px",
    background: "var(--bg)",
  },
  heading: {
    fontSize: "var(--fs-h2)",
    fontWeight: 800,
    textAlign: "center",
    margin: "0 0 32px",
    color: "var(--n-900)",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  card: {
    background: "var(--n-0)",
    border: "1px solid var(--n-200)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-xs)",
    overflow: "hidden",
  },
  link: {
    color: "inherit",
    textDecoration: "none",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
    transition: "transform 200ms ease",
  },
  textContainer: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    textAlign: "left",
  },
  cardHeading: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "var(--n-900)",
  },
  subHeading: {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.5,
    color: "var(--n-600)",
  },
  learnMore: {
    marginTop: "8px",
    fontWeight: 700,
    color: "var(--brand-600)",
  },
};

export default NewFeature;
