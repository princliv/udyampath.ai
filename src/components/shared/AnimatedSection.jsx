import { motion, useReducedMotion } from "framer-motion";

const AnimatedSection = ({
  children,
  delay = 0,
  direction = "up",
  className = "",
  staggerChildren = false,
  amount = 0.2,
  once = true,
}) => {
  const reduce = useReducedMotion();
  const offset = reduce ? 0 : direction === "left" ? -24 : direction === "right" ? 24 : 16;
  const axis = direction === "up" ? "y" : "x";

  const hidden = { opacity: 0, [axis]: offset };
  const visible = { opacity: 1, [axis]: 0 };

  if (staggerChildren && Array.isArray(children)) {
    const visibleChildren = children.slice(0, 6);
    return (
      <motion.div
        className={`animated-section ${className}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: reduce ? 0 : 0.04, delayChildren: delay } },
        }}
      >
        {visibleChildren.map((child, index) => (
          <motion.div key={index} variants={{ hidden, visible }} transition={{ duration: reduce ? 0.01 : 0.2 }}>
            {child}
          </motion.div>
        ))}
        {children.slice(6)}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`animated-section ${className}`}
      initial={hidden}
      whileInView={visible}
      transition={{ duration: reduce ? 0.01 : 0.2, delay, ease: [0.2, 0, 0, 1] }}
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
