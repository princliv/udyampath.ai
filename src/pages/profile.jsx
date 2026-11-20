import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { auth, firestore } from "../firebase/firebase";
import { uploadUserFile, writeProfile } from "../lib/firebase";
import { useProfile } from "../lib/useProfile";
import { Card } from "../components/ui";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiPlus } from "react-icons/fi"; // Import the plus icon
import ProfileEditModal from "../components/profile/ProfileEditModal"; // Import modal component
import DetailForm from "../components/profile/detailform"; // Import form component
import defaultProfileImage from "../assets/profile/profilePhoto.png"; // Default profile photo path
import { ProfileDesignBand } from "../components/shared/DesignBands";

const ProfilePage = () => {
  const [bannerImage, setBannerImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("Your Name");
  const [location, setLocation] = useState("City, Country");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lifestyle, setLifestyle] = useState("medium");
  const [arrangement, setArrangement] = useState("shared");
  const { data: savedProfile } = useProfile();

  useEffect(() => {
    if (!savedProfile) return;
    if (savedProfile.displayName) setName(savedProfile.displayName);
    if (savedProfile.location?.label) setLocation(savedProfile.location.label);
    if (savedProfile.photoURL) setProfileImage(savedProfile.photoURL);
    if (savedProfile.bannerURL) setBannerImage(savedProfile.bannerURL);
    if (savedProfile.preferences?.lifestyle) setLifestyle(savedProfile.preferences.lifestyle);
    if (savedProfile.preferences?.arrangement) setArrangement(savedProfile.preferences.arrangement);
  }, [savedProfile]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setBannerImage(localUrl);
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const uploaded = await uploadUserFile(uid, file, "banner");
    setBannerImage(uploaded.url);
    await writeProfile(uid, { bannerURL: uploaded.url });
  };

  const handleRemoveImage = () => {
    setBannerImage(null);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px" }}>
      <ProfileDesignBand name={name} location={location} />
      {/* Top Section */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* Left Rectangle - Personal Info Card */}
        <div style={{ 
          background: "white", 
          padding: "20px", 
          borderRadius: "10px", 
          width: "250px", 
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          position: "relative"
        }}>
          {/* Title with Edit Icon */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontWeight: "bold", margin: 0 }}>Personal Info</h3>
            <button onClick={toggleModal} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <FiEdit2 style={{ color: "#004aad" }} />
            </button>
          </div>

          {/* Profile Image */}
          <div 
            style={{ 
              width: "80px", 
              height: "80px", 
              backgroundImage: `url(${profileImage || defaultProfileImage})`, 
              borderRadius: "50%", 
              backgroundSize: "cover",
              backgroundPosition: "center",
              margin: "15px auto" 
            }}
          ></div>

          {/* Name */}
          <h3 style={{ margin: "5px 0" }}>{name}</h3>

          {/* Location */}
          <p style={{ color: "gray", fontSize: "14px", margin: "5px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FaMapMarkerAlt style={{ marginRight: "5px" }} /> {location}
          </p>

          <hr style={{ margin: "10px 0", border: "0.5px solid #ddd" }} />

          {/* Update Profile Link */}
          <p style={{ color: "#004aad", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}>
            Update profile visibility
          </p>
        </div>

        {/* Right Rectangle - Dynamic Banner Section */}
        <div style={{ 
          backgroundImage: bannerImage
            ? `linear-gradient(180deg, rgb(76 29 149 / .35), rgb(76 29 149 / .72)), url(${bannerImage})`
            : "linear-gradient(135deg, #8b5cf6, #4c1d95)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: "20px", 
          borderRadius: "10px", 
          flex: 1, 
          marginLeft: "20px",
          minHeight: "150px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          border: "none",
          color: "#fff",
        }}>
          <div style={{ textAlign: "left", zIndex: 1 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", border: "3px solid rgb(255 255 255 / .5)", backgroundImage: `url(${profileImage || defaultProfileImage})`, backgroundSize: "cover", marginBottom: 8 }} />
            <h2 style={{ margin: 0, fontWeight: 800 }}>{name}</h2>
            <p style={{ margin: "4px 0 0" }}>{location}</p>
          </div>

          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            style={{ display: "none" }} 
            id="upload-banner"
          />
          
          {/* Upload Button (Initially) */}
          {!bannerImage && (
            <label 
              htmlFor="upload-banner" 
              style={{ 
                cursor: "pointer", 
                padding: "10px 15px", 
                background: "#004aad", 
                color: "white", 
                borderRadius: "20px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                transition: "background 0.3s", // Smooth transition
              }}
              onMouseEnter={(e) => e.target.style.background = "#00368c"} // Darker color on hover
              onMouseLeave={(e) => e.target.style.background = "#004aad"} // Restore original color
            >
              <FiPlus size={16} /> Upload Banner
            </label>
          )}

          {/* Edit & Remove Icons (After Image is Selected) */}
          {bannerImage && (
            <>
              {/* Edit Icon */}
              <label htmlFor="upload-banner" style={{ 
                position: "absolute",
                top: "10px",
                right: "40px",
                background: "rgba(28, 77, 212, 0.6)",
                color: "white",
                padding: "8px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10px",
              }}>
                <FiEdit2 size={16} />
              </label>

              {/* Remove Icon */}
              <button onClick={handleRemoveImage} style={{ 
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "rgba(255, 0, 0, 0.7)",
                color: "white",
                padding: "8px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <FiTrash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Importing and using the modal */}
      <ProfileEditModal 
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        profileImage={profileImage}
        setProfileImage={setProfileImage} // Pass setProfileImage
        handleProfileChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setProfileImage(URL.createObjectURL(file));
          const uid = auth.currentUser?.uid;
          if (!uid) return;
          const uploaded = await uploadUserFile(uid, file, "photo");
          setProfileImage(uploaded.url);
          await writeProfile(uid, { photoURL: uploaded.url, displayName: name });
        }}
        name={name}
        setName={setName}
        location={location}
        setLocation={setLocation}
        defaultProfileImage={defaultProfileImage} // Pass default image as prop
      />
      
      <Card>
        <h3 style={{ marginTop: 0 }}>Cost of living</h3>
        <p style={{ color: "var(--n-600)" }}>These preferences change how a salary is compared with a city.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <label>
            Lifestyle
            <select value={lifestyle} onChange={(event) => setLifestyle(event.target.value)} style={{ display: "block", minHeight: 44, marginTop: 4 }}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label>
            Living
            <select value={arrangement} onChange={(event) => setArrangement(event.target.value)} style={{ display: "block", minHeight: 44, marginTop: 4 }}>
              <option value="shared">Shared</option>
              <option value="single">On my own</option>
            </select>
          </label>
          <button
            type="button"
            style={{ alignSelf: "end", minHeight: 44, background: "var(--brand-600)", color: "#fff", border: 0, borderRadius: 10, padding: "0 16px", fontWeight: 700 }}
            onClick={() => {
              const uid = auth.currentUser?.uid;
              if (!uid) return;
              writeProfile(uid, { preferences: { ...(savedProfile?.preferences || {}), lifestyle, arrangement } });
            }}
          >
            Save preferences
          </button>
        </div>
      </Card>

      <Card>
        <h3 style={{ marginTop: 0 }}>Highlights</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(savedProfile?.highlights || []).map((item, index) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              style={{ border: "1px solid var(--n-200)", borderRadius: 999, padding: "6px 10px", fontWeight: 700 }}
            >
              {item}
            </motion.span>
          ))}
        </div>
        <CertificateShowcase uid={auth.currentUser?.uid} />
      </Card>

      <DetailForm />
    </div>
  );
};

function CertificateShowcase({ uid }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!uid) return undefined;
    let stop = false;
    getDocs(query(collection(firestore, "certificates"), where("uid", "==", uid)))
      .then((snap) => {
        if (!stop) setItems(snap.docs.map((item) => ({ id: item.id, ...item.data() })));
      })
      .catch(() => setItems([]));
    return () => {
      stop = true;
    };
  }, [uid]);
  if (!items.length) return <p style={{ color: "var(--n-600)" }}>Certificates you earn appear here. Badges arrive with the simulator.</p>;
  return (
    <ul style={{ paddingLeft: 18 }}>
      {items.map((item) => (
        <li key={item.id}>
          <Link to={`/verify/certificate/${item.id}`}>{item.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export default ProfilePage;