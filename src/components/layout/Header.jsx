import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
const logo = "/udyampath-logo.svg";

const links = [
  { to: "/coursepage", label: "Courses" },
  { to: "/jobpage", label: "Opportunity" },
  { to: "/toolspage", label: "Tools" },
  { to: "/notespage", label: "Notes" },
  { to: "/job-simulator", label: "Simulator" },
];

export default function Header({ user, onLogin, onLogout }) {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/recruiter") return null;

  const className = ["app-header", scrolled ? "is-scrolled" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={className}>
      <div className="app-header-inner">
        <Link to="/homepage" aria-label="UdyamPath home">
          <img className="app-logo" src={logo} alt="UdyamPath" />
        </Link>
        <nav className="shell-nav" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className="shell-nav-link">
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <>
              <NavLink to="/profile" className="shell-nav-link">
                Profile
              </NavLink>
              <button type="button" className="shell-logout" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <button type="button" className="shell-login" onClick={() => onLogin("login")}>
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
