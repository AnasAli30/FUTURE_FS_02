import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faPaperPlane,
  faShieldHalved,
  faArrowRight,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";

export default function PublicLeadCapture({ onLeadSubmitted, onSwitchToDashboard }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    budget: "$5,000 - $10,000",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((curr) => ({ ...curr, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "Website Contact Form",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit inquiry.");

      setSuccess(data.lead);
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        budget: "$5,000 - $10,000",
        message: "",
      });

      if (onLeadSubmitted) {
        onLeadSubmitted(data.lead);
      }
    } catch (err) {
      setError(err.message || "Could not connect to server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="simulator-container">
      <div className="simulator-info">
        <span className="simulator-badge">
          <FontAwesomeIcon icon={faBolt} /> End-to-End Simulation
        </span>
        <h2>Website Contact Form Simulator</h2>
        <p>
          In a production agency or startup setup, client inquiries originate from the public
          website contact form. This simulator triggers the public <code>POST /api/leads</code> endpoint
          just like an actual client filling out a form on your landing page.
        </p>

        <ul className="feature-check-list">
          <li>
            <FontAwesomeIcon icon={faCheckCircle} />
            <span>Sends lead data to Express API without admin auth</span>
          </li>
          <li>
            <FontAwesomeIcon icon={faCheckCircle} />
            <span>Validates email format and runs bot honeypot protection</span>
          </li>
          <li>
            <FontAwesomeIcon icon={faCheckCircle} />
            <span>Auto-assigns status <strong>"New"</strong> and appends webhook note</span>
          </li>
          <li>
            <FontAwesomeIcon icon={faCheckCircle} />
            <span>Immediately appears in the CRM admin dashboard in real-time</span>
          </li>
        </ul>
      </div>

      <div className="simulator-form-card">
        <div style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
            Request a Project Consultation
          </h3>
          <p style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
            Fill this simulated client form to test inbound lead creation.
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <FontAwesomeIcon
              icon={faCheckCircle}
              style={{ fontSize: "3rem", color: "var(--success)", marginBottom: "0.75rem" }}
            />
            <h4 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Inquiry Dispatched Successfully!
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
              Lead <strong>{success.name}</strong> ({success.email}) was received and saved into the Mini CRM pipeline with status <strong>"New"</strong>.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSuccess(null)}
              >
                Send Another Test
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={onSwitchToDashboard}
              >
                <span>View in CRM Dashboard</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="alert-error">{error}</div>}

            <div className="form-grid">
              <div className="form-field">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Jordan Belfort"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Work Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. jordan@stratton.io"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+1 (555) 012-3456"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Company Name</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Stratton Oakmont Tech"
                  value={form.company}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field full">
                <label>Estimated Project Budget</label>
                <select name="budget" value={form.budget} onChange={handleChange}>
                  <option value="< $3,000">&lt; $3,000</option>
                  <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000+">$10,000+</option>
                </select>
              </div>

              <div className="form-field full">
                <label>Project Scope / Description</label>
                <textarea
                  name="message"
                  rows="3"
                  placeholder="Tell us about the application or dashboard you need built..."
                  value={form.message}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: "1.25rem" }}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
              <span>{loading ? "Submitting Inquiry..." : "Submit Inquiry to CRM"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
