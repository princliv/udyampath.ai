import React, { useState } from "react";
import { Link } from "react-router-dom";
import softGif from "../../assets/toolpage/soft.gif";
import communicationImg from "../../assets/toolpage/communication.jpg";
import timeImg from "../../assets/toolpage/time.jpg";
import adaptabilityImg from "../../assets/toolpage/adaptability.jpeg";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const images = [
  { src: communicationImg, alt: "Communication", link: "/communication" },
  { src: adaptabilityImg, alt: "Adaptability", link: "/adaptability" },
  { src: timeImg, alt: "Time Management", link: "/timemanage" },
];

const SoftSkill = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 2 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= images.length - 2 ? 0 : prev + 1));
  };

  return (
    <div
      style={{
        textAlign: "center",
        width: "100%",
        padding: "20px",
        background: "#fff",
        borderRadius: "10px",
      }}
    >
      {/* Heading with GIF */}
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        Essential Soft Skills for Success
        <img src={softGif} alt="Soft Skills GIF" style={{ width: "74px", height: "74px" }} />
      </h2>

      {/* Image Slider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
          position: "relative",
        }}
      >
        <FaChevronLeft
          onClick={prevSlide}
          style={{ cursor: "pointer", fontSize: "24px", color: "#333", marginRight: "10px" }}
        />

        {/* Display Two Images */}
        <div style={{ display: "flex", gap: "10px", flex: "0 1 auto", minWidth: 0 }}>
          {[0, 1].map((offset) => {
            const index = (currentIndex + offset) % images.length;
            return (
              <Link key={index} to={images[index].link} style={{ display: "block", flex: "0 1 250px", minWidth: 0 }}>
                <img
                  src={images[index].src}
                  alt={images[index].alt}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "auto",
                    aspectRatio: "250 / 160",
                    objectFit: "cover",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                  }}
                />
              </Link>
            );
          })}
        </div>

        <FaChevronRight
          onClick={nextSlide}
          style={{ cursor: "pointer", fontSize: "24px", color: "#333", marginLeft: "10px" }}
        />
      </div>
    </div>
  );
};

export default SoftSkill;
