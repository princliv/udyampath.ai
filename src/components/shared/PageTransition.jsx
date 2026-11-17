import { motion, useReducedMotion } from "framer-motion";

const PageTransition = ({ children, className = "" }) => {
  const reduce = useReducedMotion();
  const distance = reduce ? 0 : 8;

  return (
    <motion.div
      className={`page-transition ${className}`}
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduce ? 0 : -distance }}
      transition={{ duration: reduce ? 0.01 : 0.2, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
