import { useEffect, useState } from "react";

/** Same breakpoint and columns as the course page header and body. */
export function useWideLayout() {
  const [isWide, setIsWide] = useState(() =>
    typeof window !== "undefined" && window.innerWidth >= 1024
  );

  useEffect(() => {
    const onResize = () => setIsWide(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isWide;
}

export const pageShellStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "20px",
  position: "relative",
  background: "#ffffff",
  borderRadius: "16px",
  width: "100%",
  boxSizing: "border-box",
};

export function SectionColumns({ children, align = "stretch" }) {
  const isWide = useWideLayout();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isWide ? "minmax(220px, 1fr) minmax(0, 4fr)" : "1fr",
        gap: "20px",
        alignItems: align,
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}
