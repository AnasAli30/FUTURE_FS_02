import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faGlobe,
  faSun,
  faMoon,
  faRightFromBracket,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

export default function Navbar({ activeTab, setActiveTab, theme, setTheme, onLogout, user }) {
  return (
    <header className="top-nav">
      <div className="brand-group">
        <div className="brand-icon">
          <FontAwesomeIcon icon={faShieldHalved} />
        </div>
        <div className="brand-text">
          <h1>LeadFlow CRM</h1>
          <span>Future Interns · Task 2 (Mini CRM)</span>
        </div>
      </div>

      <nav className="nav-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === "leads" ? "active" : ""}`}
          onClick={() => setActiveTab("leads")}
        >
          <FontAwesomeIcon icon={faUsers} />
          <span>Leads Pipeline</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "simulator" ? "active" : ""}`}
          onClick={() => setActiveTab("simulator")}
        >
          <FontAwesomeIcon icon={faGlobe} />
          <span>Website Form Simulator</span>
        </button>
      </nav>

      <div className="nav-actions">
        <button
          type="button"
          className="btn-icon"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
        </button>

        <div className="user-badge" title={user?.email || "Admin"}>
          <div className="user-avatar">A</div>
          <span>{user?.name || "Admin"}</span>
        </div>

        <button
          type="button"
          className="btn-icon"
          title="Log Out"
          onClick={onLogout}
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </div>
    </header>
  );
}
