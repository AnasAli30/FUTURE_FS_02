import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faLock,
  faEnvelope,
  faArrowRight,
  faKey,
} from "@fortawesome/free-solid-svg-icons";

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function fillDemo() {
    setEmail("admin@crm.local");
    setPassword("admin123");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");

      // Save token and notify parent
      localStorage.setItem("crm_token", data.token);
      localStorage.setItem("crm_user", JSON.stringify(data.user));
      onLoginSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-icon">
            <FontAwesomeIcon icon={faShieldHalved} />
          </div>
          <h1>LeadFlow Admin</h1>
          <p>Client Lead Management System · Task 2</p>
        </div>

        <div className="demo-credentials-box">
          <div>
            <strong>Evaluator Demo Credentials:</strong>
          </div>
          <div style={{ marginTop: "0.25rem", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
            Email: <code>admin@crm.local</code> | Password: <code>admin123</code>
          </div>
          <button type="button" className="demo-fill-btn" onClick={fillDemo}>
            <FontAwesomeIcon icon={faKey} /> Quick Fill Credentials
          </button>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field" style={{ marginBottom: "1rem" }}>
            <label>
              <FontAwesomeIcon icon={faEnvelope} /> Admin Email
            </label>
            <input
              type="email"
              placeholder="admin@crm.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field" style={{ marginBottom: "1.5rem" }}>
            <label>
              <FontAwesomeIcon icon={faLock} /> Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}
            disabled={loading}
          >
            <span>{loading ? "Authenticating..." : "Sign In to CRM"}</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </form>
      </div>
    </div>
  );
}
