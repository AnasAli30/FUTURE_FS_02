import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function AddLeadModal({ onClose, onAddLead }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "Website Contact Form",
    budget: "",
    message: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((curr) => ({ ...curr, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and Email are required.");
      return;
    }

    setSaving(true);
    try {
      await onAddLead(form);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create lead.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Client Lead</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert-error">{error}</div>}

            <div className="form-grid">
              <div className="form-field">
                <label>Contact Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Rachel Green"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. rachel@greenmedia.com"
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
                  placeholder="e.g. +1 555-0199"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Company / Organization</label>
                <input
                  type="text"
                  name="company"
                  placeholder="e.g. Green Media LLC"
                  value={form.company}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Lead Source</label>
                <select name="source" value={form.source} onChange={handleChange}>
                  <option value="Website Contact Form">Website Contact Form</option>
                  <option value="Landing Page">Landing Page</option>
                  <option value="Referral">Referral</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Direct">Direct</option>
                </select>
              </div>

              <div className="form-field">
                <label>Estimated Budget</label>
                <input
                  type="text"
                  name="budget"
                  placeholder="e.g. $5,000 - $8,000"
                  value={form.budget}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field full">
                <label>Inquiry Message / Initial Notes</label>
                <textarea
                  name="message"
                  rows="3"
                  placeholder="What does the client need built or addressed?"
                  value={form.message}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              <FontAwesomeIcon icon={faPlus} />
              <span>{saving ? "Adding..." : "Add to Pipeline"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
