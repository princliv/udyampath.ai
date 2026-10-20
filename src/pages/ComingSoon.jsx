import { useNavigate } from "react-router-dom";

const ComingSoon = ({ title = "This feature" }) => {
  const navigate = useNavigate();

  return (
    <main
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px",
      }}
    >
      <div style={{ maxWidth: "520px", textAlign: "center" }}>
        <p
          style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#1181c8",
            marginBottom: "12px",
          }}
        >
          Coming soon
        </p>
        <h1 style={{ marginBottom: "12px" }}>{title}</h1>
        <p style={{ color: "#475569", marginBottom: "24px" }}>
          This part of UdyamPath is not available yet. You can keep using courses, jobs, and tools in the meantime.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            background: "#004aad",
            color: "#fff",
            border: "none",
            borderRadius: "999px",
            padding: "12px 20px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Go back
        </button>
      </div>
    </main>
  );
};

export default ComingSoon;
