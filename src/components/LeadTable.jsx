import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPlus,
  faFileArrowDown,
  faCommentDots,
  faTrashCan,
  faFolderOpen,
  faTag,
  faBuilding,
  faPhone,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

export default function LeadTable({
  leads,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  sourceFilter,
  setSourceFilter,
  sort,
  setSort,
  onOpenAddModal,
  onSelectLead,
  onUpdateStatus,
  onDeleteLead,
  onRefresh,
}) {
  const statusOptions = ["New", "Contacted", "In Discussion", "Converted", "Lost"];
  const sourceOptions = [
    "Website Contact Form",
    "Landing Page",
    "Referral",
    "LinkedIn",
    "Direct",
  ];

  function getStatusClass(status) {
    switch (status) {
      case "New":
        return "new";
      case "Contacted":
        return "contacted";
      case "In Discussion":
        return "in-discussion";
      case "Converted":
        return "converted";
      case "Lost":
        return "lost";
      default:
        return "new";
    }
  }

  function exportCSV() {
    if (!leads.length) return;
    const headers = ["ID", "Name", "Email", "Phone", "Company", "Source", "Status", "Budget", "Message", "Created At"];
    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${(l.name || "").replace(/"/g, '""')}"`,
      `"${(l.email || "").replace(/"/g, '""')}"`,
      `"${(l.phone || "").replace(/"/g, '""')}"`,
      `"${(l.company || "").replace(/"/g, '""')}"`,
      `"${(l.source || "").replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${(l.budget || "").replace(/"/g, '""')}"`,
      `"${(l.message || "").replace(/"/g, '""')}"`,
      `"${l.createdAt}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function formatDate(isoString) {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="lead-pipeline-wrapper">
      {/* Toolbar */}
      <div className="toolbar-card">
        <div className="filter-group">
          <div className="search-input-wrapper">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input
              type="text"
              placeholder="Search by name, email, company..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="select-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            className="select-control"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="All">All Sources</option>
            {sourceOptions.map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>

          <select
            className="select-control"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A-Z)</option>
          </select>

          <button
            type="button"
            className="btn-icon"
            title="Refresh Leads"
            onClick={onRefresh}
          >
            <FontAwesomeIcon icon={faRotateRight} />
          </button>
        </div>

        <div className="action-buttons">
          <button type="button" className="btn-secondary" onClick={exportCSV}>
            <FontAwesomeIcon icon={faFileArrowDown} />
            <span>Export CSV</span>
          </button>

          <button type="button" className="btn-primary" onClick={onOpenAddModal}>
            <FontAwesomeIcon icon={faPlus} />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-card" style={{ marginTop: "1rem" }}>
        <div className="table-responsive">
          <table className="lead-table">
            <thead>
              <tr>
                <th>Lead Contact</th>
                <th>Company / Phone</th>
                <th>Source</th>
                <th>Status</th>
                <th>Follow-ups</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className="lead-info-cell">
                        <span className="lead-name">{lead.name}</span>
                        <span className="lead-email">{lead.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="company-pill">
                        {lead.company || <span style={{ color: "var(--text-subtle)" }}>—</span>}
                      </div>
                      {lead.phone && <div className="phone-sub">{lead.phone}</div>}
                    </td>
                    <td>
                      <span className="source-tag">
                        <FontAwesomeIcon icon={faTag} style={{ fontSize: "0.65rem" }} />
                        {lead.source}
                      </span>
                    </td>
                    <td>
                      <select
                        className={`table-status-select ${getStatusClass(lead.status)}`}
                        value={lead.status}
                        onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="action-btn"
                        onClick={() => onSelectLead(lead)}
                        title="View / Add Follow-up Notes"
                      >
                        <FontAwesomeIcon icon={faCommentDots} />
                        <span>{lead.notes?.length || 0} notes</span>
                      </button>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      {formatDate(lead.createdAt)}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="action-btn"
                          onClick={() => onSelectLead(lead)}
                          title="Open Lead Card"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          className="action-btn delete"
                          onClick={() => onDeleteLead(lead.id, lead.name)}
                          title="Delete Lead"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <FontAwesomeIcon icon={faFolderOpen} />
                      <p>No client leads match your criteria.</p>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ marginTop: "1rem", display: "inline-flex" }}
                        onClick={() => {
                          setSearch("");
                          setStatusFilter("All");
                          setSourceFilter("All");
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
