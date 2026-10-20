import React, { useState, useEffect } from "react";
import confusedGif from "../../assets/jobpage/confused.gif"; // Animated icon
import headerBg from "../../assets/jobpage/headerbg.png"; // Background image for search section
import BaseDetails from "../jobpage/baseDetails";
import { pageShellStyle, SectionColumns } from "../shared/sectionColumns";

// Import all city images
import BengaloreImg from "../../assets/jobpage/Banglore.png";
import HyderabadImg from "../../assets/jobpage/Hydrabad.png";
import ChennaiImg from "../../assets/jobpage/Chennai.png";
import PuneImg from "../../assets/jobpage/Pune.png";
import GurgaonImg from "../../assets/jobpage/Gurgaon.png";
import NoidaImg from "../../assets/jobpage/Noida.png";
import MumbaiImg from "../../assets/jobpage/Mumbai.png";
import KolkataImg from "../../assets/jobpage/Kolkata.png";
import AhmedabadImg from "../../assets/jobpage/Ahmedabad.png";

// Map city names to images
const cityImages = {
  Bengalore: BengaloreImg,
  Hyderabad: HyderabadImg,
  Chennai: ChennaiImg,
  Pune: PuneImg,
  Gurgaon: GurgaonImg,
  Noida: NoidaImg,
  Mumbai: MumbaiImg,
  Kolkata: KolkataImg,
  Ahmedabad: AhmedabadImg
};

const BasePage = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [inputCity, setInputCity] = useState("");
  const [cityData, setCityData] = useState([]);

  // Fetch city data from the public folder
  useEffect(() => {
    fetch("/citydata.json") // Accessing from public folder
      .then(response => response.json())
      .then(data => setCityData(data))
      .catch(error => console.error("Error loading city data:", error));
  }, []);

  const handleApply = () => {
    const cityInfo = cityData.find(city => city.city.toLowerCase() === inputCity.toLowerCase());
    if (cityInfo) {
      setSelectedCity(cityInfo);
    } else {
      setSelectedCity(null); // Reset if city not found
    }
  };

  return (
    <div style={pageShellStyle}>
      <SectionColumns>
      <div style={{ padding: "20px", borderRadius: "10px", background: "#e0f2fe", minWidth: 0, textAlign: "left" }}>
        <h2 style={{ color: "#004369", fontSize: "clamp(1.65rem, 2vw, 2.2rem)", lineHeight: 1.2, margin: 0 }}>
          Confused About Your Favorite City’s Budget?
          <img 
            src={confusedGif} 
            alt="" 
            style={{ width: "72px", height: "72px", verticalAlign: "middle", marginLeft: "12px" }} 
          />
        </h2>
        <p style={{ fontSize: "18px", fontWeight: 600, marginTop: "12px" }}>
          Uncover the Costs Now!
        </p>
      </div>

      <div style={{ 
        backgroundImage: `url(${headerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "20px",
        borderRadius: "10px",
        minWidth: 0,
      }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <h2 style={{ fontSize: "30px", textAlign: "left", margin: 0 }}>
            Get Recommendation based on the <span style={{ color: "#004aad" }}>Salary</span> with<br /> 
            respect to <span style={{ color: "#004aad" }}>Expense</span>
          </h2>
          <input
            type="text"
            placeholder="Enter Living City"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px", width: "100%", maxWidth: "280px", fontSize: "16px" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "15px" }}>
        <button 
          onClick={handleApply}
          style={{ 
            padding: "12px 20px", 
            background: "#004aad", 
            color: "white", 
            border: "none", 
            borderRadius: "8px", 
            cursor: "pointer", 
            fontSize: "16px" 
          }}
        >
          Apply
        </button>
        </div>
      </div>
      </SectionColumns>

      {/* Selected City Box */}
      {selectedCity && (
        <div style={{ 
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          alignItems: "center",
          background: "#f0f4f8",
          padding: "15px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          margin: "30px auto"
        }}>
          <h3 style={{ margin: "0", fontWeight: "bold", fontSize: "20px" }}>
            Selected City: {selectedCity.city}
          </h3>
          <img 
            src={cityImages[selectedCity.city]} 
            alt={selectedCity.city} 
            style={{ width: "200px", maxWidth: "100%", height: "100px", objectFit: "cover", borderRadius: "10px" }}
          />
        </div>
      )}

    <BaseDetails cityData={selectedCity} />
    </div>
  );
};

export default BasePage;
