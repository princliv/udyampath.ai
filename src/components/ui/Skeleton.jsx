import { useEffect, useState } from "react";

export function Skeleton({ className = "h-4 w-full" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <span
      className={`block rounded-md bg-n-100 motion-safe:animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}
