import React from "react";
import { useNavigate } from "react-router-dom";
import headerBg from '../assets/toolpage/headerbgtools.png'; // Import the background image
import Interview from "../components/toolspage/interview";
import { pageShellStyle, SectionColumns } from "../components/shared/sectionColumns";

const JobPage = () => {
  const navigate = useNavigate();

  return (
    <div style={pageShellStyle}>
      {/* Top Section — same columns and card size as the course page header */}
      <SectionColumns>
        <div style={{
          background: "#131346",
          color: "white",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "left",
          minWidth: 0,
        }}>
          <h2 style={{ fontSize: "clamp(1.65rem, 2vw, 2.2rem)", lineHeight: 1.2, margin: 0 }}>Chat with your perfect Buddy</h2>
          <button 
            style={{ 
              marginTop: "10px", 
              padding: "10px 15px", 
              background: "#fac832", 
              color: "#131346", 
              border: "none", 
              borderRadius: "5px", 
              cursor: "pointer" 
            }} 
            onClick={() => navigate("/ai-mentor")}
          >
            Mentora
          </button>
        </div>

        {/* Right Rectangle */}
        <div style={{ 
          backgroundImage: `url(${headerBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: "20px", 
          borderRadius: "10px", 
          minWidth: 0
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <h2 style={{ fontSize: "30px", margin: 0 }}>
              Get your dream job with <br /><span style={{ color: "#004aad" }}> Interview Prep</span> and 
              <span style={{ color: "#004aad" }}> projects </span>
            </h2>
            <input
              type="text"
              placeholder="Enter"
              style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px", width: "100%", maxWidth: "300px" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
          <button style={{ 
            padding: "10px 15px", 
            background: "#004aad", 
            color: "white", 
            border: "none", 
            borderRadius: "5px", 
            cursor: "pointer"
          }}>
            Search
          </button>
          </div>
        </div>
      </SectionColumns>
     <Interview /> 
    </div>
  );
};

export default JobPage;
