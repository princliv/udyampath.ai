import React, { useState, useEffect } from "react";
import Details from "../components/jobpage/details";
import applyGif from "../assets/jobpage/apply.gif";
import { useNavigate } from "react-router-dom";

const JobPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [city, setCity] = useState(""); 

  useEffect(() => {
    let timer;
    if (showModal) {
      timer = setTimeout(() => {
        setShowModal(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showModal]);

  return (
    <div className="studio-page">
      <div className="studio-wrap">
      <header className="studio-hero studio-hero--jobs">
        <p className="studio-kicker">Your city, then on-site or remote, then salary against expenses</p>
        <h1>Find a job you can live on.</h1>
        <p className="studio-lead">
          Enter the city you would live in. Each role is marked recommended or not from its posted pay against that city&apos;s monthly cost.
        </p>
        <div className="studio-row">
          <label className="studio-field">
            <span>Your city</span>
            <input
              type="text"
              placeholder="Pune, Bengaluru, Hyderabad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <button type="button" className="studio-btn studio-btn--dark" onClick={() => navigate("/base")}>
            Compare cities
          </button>
          <button type="button" className="studio-btn studio-btn--line" onClick={() => setShowModal(true)}>
            How matching works
          </button>
        </div>
      </header>

      {/* Pass City Name to Details Component */}
      <Details city={city} />
      </div>

      {/* Modal */}
      {showModal && (
        <>
          {/* Modal Overlay */}
          <div style={{
            position: "fixed",
            top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0, 0, 0, 0.5)", zIndex: 999
          }} />
          
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
            width: "300px",
            zIndex: 1000
          }}>
            <h2>Yayy! 😊</h2>
            <p>We recommended jobs that are best for you</p>
            <img src={applyGif} alt="Apply GIF" style={{ width: "80px", margin: "10px 0" }} />
            <p>Click <b>'View Details'</b> to explore insights</p>
          </div>
        </>
      )}
    </div>
  );
};

export default JobPage;
