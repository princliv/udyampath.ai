import { motion, useReducedMotion } from "framer-motion";

const GlassCard = ({
  children,
  style = {},
  onClick,
  className = "",
  hoverLift = true,
  delay = 0,
}) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={`glass glass-card ${className}`}
      style={{ position: "relative", overflow: "hidden", cursor: onClick ? "pointer" : "default", ...style }}
      onClick={onClick}
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.01 : 0.2, delay }}
      whileHover={hoverLift && !reduce ? { y: -6 } : undefined}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
