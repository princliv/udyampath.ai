import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BookOpen, Briefcase, Home, User, Wrench } from "lucide-react";

export default function MobileDock({ user, onLogin, onLogout }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const hidden = pathname === "/recruiter" || pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [open]);

  if (hidden) return null;

  return (
    <nav className="mobile-dock" aria-label="Mobile">
      <div className="mobile-dock-group" ref={menuRef}>
        <NavLink to="/homepage" aria-label="Home">
          <Home size={20} aria-hidden="true" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/explore" aria-label="Courses">
          <BookOpen size={20} aria-hidden="true" />
          <span>Courses</span>
        </NavLink>
        <NavLink to="/jobpage" aria-label="Jobs">
          <Briefcase size={20} aria-hidden="true" />
          <span>Jobs</span>
        </NavLink>
        <NavLink to="/toolspage" aria-label="Tools">
          <Wrench size={20} aria-hidden="true" />
          <span>Tools</span>
        </NavLink>
        {user ? (
          <button type="button" aria-label="Profile options" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            <User size={20} aria-hidden="true" />
            <span>Profile</span>
          </button>
        ) : (
          <button type="button" aria-label="Login" onClick={() => onLogin("login")}>
            <User size={20} aria-hidden="true" />
            <span>Login</span>
          </button>
        )}
      </div>
      {user && open ? (
        <div className="mobile-dock-menu">
          <Link to="/profile" onClick={() => setOpen(false)}>
            My Profile
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            Logout
          </button>
        </div>
      ) : null}
    </nav>
  );
}
