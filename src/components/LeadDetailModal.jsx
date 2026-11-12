import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faBuilding,
  faEnvelope,
  faPhone,
  faCoins,
  faClock,
  faPaperPlane,
  faTrashCan,
  faNotesMedical,
  faTag,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function LeadDetailModal({
  lead,
  onClose,
  onUpdateStatus,
  onAddNote,
  onDeleteNote,
}) {
  const [newNote, setNewNote] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  if (!lead) return null;

  async function handleAddNoteSubmit(e) {
    e.preventDefault();
    if (!newNote.trim()) return;
    setSubmittingNote(true);
    try {
      await onAddNote(lead.id, newNote);
      setNewNote("");
    } finally {
      setSubmittingNote(false);
    }
  }

  function formatTime(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const statusOptions = ["New", "Contacted", "In Discussion", "Converted", "Lost"];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{lead.name}</h2>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              ID: {lead.id} · Received {formatTime(lead.createdAt)}
            </span>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="modal-body">
          {/* Quick Info Grid */}
          <div className="form-grid">
            <div className="form-field">
              <label>
                <FontAwesomeIcon icon={faEnvelope} /> Email
              </label>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                <a
                  href={`mailto:${lead.email}?subject=Follow-up on your inquiry`}
                  style={{ color: "var(--primary)", textDecoration: "none" }}
                >
                  {lead.email}
                </a>
              </div>
            </div>

            <div className="form-field">
              <label>
                <FontAwesomeIcon icon={faPhone} /> Phone
              </label>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                {lead.phone || <span style={{ color: "var(--text-subtle)" }}>Not provided</span>}
              </div>
            </div>

            <div className="form-field">
              <label>
                <FontAwesomeIcon icon={faBuilding} /> Company
              </label>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                {lead.company || <span style={{ color: "var(--text-subtle)" }}>Independent / Individual</span>}
              </div>
            </div>

            <div className="form-field">
              <label>
                <FontAwesomeIcon icon={faCoins} /> Budget / Scale
              </label>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                {lead.budget || <span style={{ color: "var(--text-subtle)" }}>Not specified</span>}
              </div>
            </div>

            <div className="form-field full">
              <label>
                <FontAwesomeIcon icon={faTag} /> Pipeline Status
              </label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                {statusOptions.map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`status-pill ${st.toLowerCase().replace(" ", "-")} ${lead.status === st ? "active-pill" : ""}`}
                    style={{
                      opacity: lead.status === st ? 1 : 0.6,
                      boxShadow: lead.status === st ? "0 0 0 2px var(--primary)" : "none",
                    }}
                    onClick={() => onUpdateStatus(lead.id, st)}
                  >
                    {lead.status === st && <FontAwesomeIcon icon={faCircleCheck} />}
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {lead.message && (
              <div className="form-field full">
                <label>Inquiry Message / Request</label>
                <div
                  style={{
                    backgroundColor: "var(--bg-subtle)",
                    border: "1px solid var(--border)",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.875rem",
                    lineHeight: 1.5,
                  }}
                >
                  {lead.message}
                </div>
              </div>
            )}
          </div>

          {/* Follow-up Notes & Activity Timeline */}
          <div className="notes-section">
            <h3>
              <FontAwesomeIcon icon={faNotesMedical} /> Follow-up Notes & Activity History ({lead.notes?.length || 0})
            </h3>

            <div className="timeline">
              {lead.notes && lead.notes.length > 0 ? (
                lead.notes.map((note) => (
                  <div className="timeline-item" key={note.id}>
                    <div className="timeline-meta">
                      <span className="timeline-author">{note.author}</span>
                      <div>
                        <span className="timeline-time">{formatTime(note.createdAt)}</span>
                        {note.author !== "System (Webhook)" && (
                          <button
                            type="button"
                            className="delete-note-btn"
                            title="Delete this note"
                            onClick={() => onDeleteNote(lead.id, note.id)}
                          >
                            <FontAwesomeIcon icon={faTrashCan} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="timeline-text">{note.text}</div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  No follow-up notes yet. Record conversations or action items below.
                </p>
              )}
            </div>

            {/* Add note input */}
            <form onSubmit={handleAddNoteSubmit} className="add-note-form">
              <input
                type="text"
                placeholder="Log a call, sent email, meeting summary, or next step..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                disabled={submittingNote}
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={submittingNote || !newNote.trim()}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
                <span>{submittingNote ? "Saving" : "Add Note"}</span>
              </button>
            </form>
          </div>
        </div>

        <div className="modal-footer">
          <a
            className="btn-secondary"
            href={`mailto:${lead.email}?subject=Regarding your inquiry`}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
          >
            <FontAwesomeIcon icon={faEnvelope} />
            <span>Email Client</span>
          </a>
          <button type="button" className="btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
