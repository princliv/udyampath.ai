import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { signInWithGoogle, signInWithEmail, signUpWithEmail, getUserProfile, homeForRole, sendPasswordReset } from "../firebase/firebase";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(initialMode === "signup");
  const [userType, setUserType] = useState("candidate");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsSignup(initialMode === "signup");
    }
  }, [isOpen, initialMode]);

  const linkedInEnabled = import.meta.env.VITE_LINKEDIN_OIDC === "true";

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setGender("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const finishAuth = (role) => {
    navigate(homeForRole(role), { replace: true });
    onClose({ redirected: true });
    resetForm();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { profile } = await signInWithGoogle({
        userType: userType === "recruiter" ? "Recruiter" : "Candidate",
      });
      finishAuth(profile?.userType);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          setLoading(false);
          return;
        }

        const role = userType === "recruiter" ? "Recruiter" : "Candidate";
        await signUpWithEmail(email, password, firstName, lastName, "", role);
        finishAuth(role);
      } else {
        const credential = await signInWithEmail(email, password);
        const profile = await getUserProfile(credential.user.uid);
        finishAuth(profile?.userType);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    ...styles.input,
    ...(isSignup ? styles.inputDense : null),
  };

  const handleReset = async () => {
    if (!email) {
      alert("Enter your email, then ask for a reset link.");
      return;
    }
    try {
      await sendPasswordReset(email);
      alert("Password reset email sent.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
    <motion.div style={styles.overlay} onClick={() => onClose()} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        style={styles.modal}
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <button style={styles.closeButton} onClick={onClose} aria-label="Close auth modal">
          x
        </button>

        <div style={styles.headerBadge}>{isSignup ? "Create Account" : "Welcome Back"}</div>
        <h2 style={styles.title}>{isSignup ? "Sign up" : "Log in"}</h2>

        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tabButton,
              ...(userType === "candidate" ? styles.tabButtonActive : null),
            }}
            onClick={() => setUserType("candidate")}
            type="button"
          >
            Candidate
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(userType === "recruiter" ? styles.tabButtonActive : null),
            }}
            onClick={() => setUserType("recruiter")}
            type="button"
          >
            Recruiter
          </button>
        </div>

        <button style={styles.socialButton} onClick={handleGoogleLogin} disabled={loading} type="button">
          <FcGoogle style={styles.icon} /> Continue with Google
        </button>

        {linkedInEnabled ? (
          <button style={{ ...styles.socialButton, ...styles.linkedinButton }} type="button">
            <FaLinkedin style={styles.icon} /> Continue with LinkedIn
          </button>
        ) : null}

        <p style={styles.orText}>Or {isSignup ? "sign up" : "log in"} with email</p>

        <form onSubmit={handleAuth}>
          {isSignup && (
            <>
              <div style={styles.row}>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={inputStyle}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={styles.genderContainer}>
                <label style={styles.genderOption}>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={gender === "Male"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Male
                </label>
                <label style={styles.genderOption}>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={gender === "Female"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Female
                </label>
                <label style={styles.genderOption}>
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={gender === "Other"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Other
                </label>
              </div>
            </>
          )}

          <label style={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </label>

          <label style={styles.label}>
            Password
          <div style={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          </label>
          {!isSignup ? (
            <button type="button" style={styles.switchButton} onClick={handleReset}>
              Forgot password
            </button>
          ) : null}

          {isSignup && (
            <div style={styles.passwordContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
                required
              />
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          )}

          <button style={styles.authButton} disabled={loading} type="submit">
            {loading ? "Please wait..." : isSignup ? "Create Account" : "Log in"}
          </button>
        </form>

        <p style={styles.switchText}>
          {isSignup ? "Already have an account?" : "New to UdyAmPath?"}
          <button
            style={styles.switchButton}
            onClick={() => setIsSignup(!isSignup)}
            type="button"
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </p>
      </motion.div>
    </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(7, 18, 40, 0.62)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px",
    zIndex: 1600,
  },
  modal: {
    width: "min(92vw, 420px)",
    maxHeight: "92vh",
    overflowY: "auto",
    borderRadius: "18px",
    padding: "22px 18px 18px",
    background: "#ffffff",
    border: "1px solid var(--n-200)",
    boxShadow: "0 18px 45px rgba(0, 0, 0, 0.28)",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "1px solid rgba(255, 255, 255, 0.34)",
    background: "rgba(255, 255, 255, 0.16)",
    color: "var(--n-800)",
    fontSize: "15px",
    cursor: "pointer",
  },
  headerBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "5px 10px",
    borderRadius: "999px",
    border: "1px solid rgba(255, 255, 255, 0.38)",
    background: "rgba(17, 129, 200, 0.24)",
    color: "#e8f6ff",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "10px",
  },
  title: {
    margin: "0 0 14px",
    color: "var(--n-900)",
    fontSize: "32px",
    lineHeight: 1.1,
    fontWeight: 800,
  },
  tabContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    marginBottom: "12px",
  },
  tabButton: {
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.34)",
    padding: "9px 8px",
    background: "var(--n-50)",
    color: "var(--n-800)",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },
  tabButtonActive: {
    background: "linear-gradient(135deg, #1181c8 0%, #004aad 100%)",
    border: "1px solid rgba(181, 228, 255, 0.9)",
  },
  socialButton: {
    width: "100%",
    border: "1px solid rgba(255, 255, 255, 0.6)",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.92)",
    color: "#09315f",
    padding: "10px 12px",
    marginBottom: "8px",
    fontWeight: 600,
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  linkedinButton: {
    background: "linear-gradient(135deg, #0077b5 0%, #0a66c2 100%)",
    color: "#ffffff",
    border: "1px solid rgba(255, 255, 255, 0.22)",
  },
  icon: {
    marginRight: "8px",
    fontSize: "16px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "var(--n-800)",
    fontSize: "14px",
    fontWeight: 700,
    textAlign: "left",
  },
  orText: {
    margin: "10px 0",
    fontSize: "13px",
    color: "var(--n-600)",
    textAlign: "center",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  input: {
    width: "100%",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.38)",
    background: "rgba(255, 255, 255, 0.9)",
    minHeight: "44px",
    padding: "10px 11px",
    marginBottom: "10px",
    fontSize: "15px",
    color: "#102a43",
  },
  inputDense: {
    marginBottom: "8px",
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: "10px",
    top: "30%",
    color: "#4b5d73",
    fontSize: "14px",
    cursor: "pointer",
  },
  genderContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "8px",
    color: "var(--n-800)",
    fontSize: "14px",
  },
  genderOption: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },
  authButton: {
    width: "100%",
    border: "none",
    borderRadius: "10px",
    padding: "11px",
    color: "#ffffff",
    background: "var(--brand-600)",
    minHeight: "44px",
    boxShadow: "none",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "2px",
  },
  switchText: {
    margin: "10px 0 0",
    color: "var(--n-800)",
    fontSize: "13px",
    textAlign: "center",
  },
  switchButton: {
    marginLeft: "8px",
    background: "none",
    border: "none",
    color: "var(--brand-600)",
    textDecoration: "underline",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default AuthModal;
