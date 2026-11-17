import { useEffect, useState } from "react";

const SkeletonCard = ({
  width = "100%",
  height = 200,
  className = "",
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`skeleton-card ${className}`}
      style={{ width, height, borderRadius: "var(--radius-lg)" }}
      aria-hidden="true"
    />
  );
};

export default SkeletonCard;
