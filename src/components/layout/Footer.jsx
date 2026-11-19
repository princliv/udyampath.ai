import { Link, useLocation } from "react-router-dom";
import { Mail, MapPin, Phone, Printer } from "lucide-react";
const logo = "/udyampath-logo-reverse.svg";

export default function Footer() {
  const { pathname } = useLocation();
  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <footer className="app-footer">
      <div className="app-footer-grid">
        <div>
          <img className="app-footer-logo" src={logo} alt="UdyamPath" />
          <p style={{ maxWidth: "460px" }}>
            A complete solution for learning, time management, mental wellness, and career growth.
          </p>
          <p>Build skills. Find opportunities. Grow with confidence.</p>
        </div>
        <div>
          <h2>Products</h2>
          <Link to="/coursepage">Courses</Link>
          <br />
          <Link to="/specializations">Specializations</Link>
          <br />
          <Link to="/notespage">Notes</Link>
          <br />
          <Link to="/jobpage">Jobs</Link>
        </div>
        <div>
          <h2>Tools</h2>
          <Link to="/techInterview">Interview Practice</Link>
          <br />
          <Link to="/projectModal">Project Listing</Link>
          <br />
          <Link to="/ai-mentor">Mentora</Link>
          <br />
          <Link to="/toolspage">Career Supportive Tools</Link>
        </div>
        <div>
          <h2>Contact</h2>
          <p>
            <MapPin size={16} aria-hidden="true" /> Roorkee, Uttarakhand, 247667, India
          </p>
          <p>
            <Mail size={16} aria-hidden="true" /> udyampath@gmail.com
          </p>
          <p>
            <Phone size={16} aria-hidden="true" /> +91 969 312 093
          </p>
          <p>
            <Printer size={16} aria-hidden="true" /> +01 234 567 89
          </p>
        </div>
      </div>
      <div className="app-footer-bar">
        <p style={{ margin: 0 }}>© 2026 UdyamPath. Crafted for modern career growth.</p>
        <a href="https://udyampath.com">Visit Website</a>
      </div>
    </footer>
  );
}
