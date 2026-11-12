import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar.jsx";
import StatsCards from "./components/StatsCards.jsx";
import LeadTable from "./components/LeadTable.jsx";
import LeadDetailModal from "./components/LeadDetailModal.jsx";
import AddLeadModal from "./components/AddLeadModal.jsx";
import PublicLeadCapture from "./components/PublicLeadCapture.jsx";
import LoginPage from "./components/LoginPage.jsx";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("crm_token") || "");
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem("crm_theme") || "light");
  const [activeTab, setActiveTab] = useState("leads");

  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    inDiscussion: 0,
    converted: 0,
    lost: 0,
    conversionRate: 0,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [sort, setSort] = useState("newest");

  const [selectedLead, setSelectedLead] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("crm_theme", theme);
  }, [theme]);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  function showToast(message) {
    setToast(message);
  }

  // Check auth session
  useEffect(() => {
    if (!token) {
      setAuthChecked(true);
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setAuthChecked(true);
      })
      .catch(() => {
        localStorage.removeItem("crm_token");
        localStorage.removeItem("crm_user");
        setToken("");
        setUser(null);
        setAuthChecked(true);
      });
  }, [token]);

  // Fetch leads and stats
  const fetchDashboardData = useCallback(() => {
    if (!token) return;

    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (statusFilter !== "All") params.append("status", statusFilter);
    if (sourceFilter !== "All") params.append("source", sourceFilter);
    if (sort) params.append("sort", sort);

    // Fetch leads
    fetch(`/api/leads?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLeads(data);
          // If modal open, update modal lead reference
          setSelectedLead((curr) => (curr ? data.find((l) => l.id === curr.id) || null : null));
        }
      })
      .catch((err) => console.error("Error fetching leads:", err));

    // Fetch stats
    fetch("/api/analytics", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.total === "number") {
          setStats(data);
        }
      })
      .catch((err) => console.error("Error fetching analytics:", err));
  }, [token, search, statusFilter, sourceFilter, sort]);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, token]);

  // Actions
  function handleLoginSuccess(newToken, newUser) {
    setToken(newToken);
    setUser(newUser);
    showToast("Signed in as Administrator");
  }

  function handleLogout() {
    fetch("/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).finally(() => {
      localStorage.removeItem("crm_token");
      localStorage.removeItem("crm_user");
      setToken("");
      setUser(null);
      showToast("Logged out of CRM");
    });
  }

  async function handleUpdateStatus(leadId, newStatus) {
    try {
      const res = await fetch(`/api/leads/${leadId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      showToast(`Lead status updated to "${newStatus}"`);
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleAddNote(leadId, noteText) {
    try {
      const res = await fetch(`/api/leads/${leadId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: noteText, author: user?.name || "Admin" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add note");

      showToast("Follow-up note logged");
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteNote(leadId, noteId) {
    try {
      const res = await fetch(`/api/leads/${leadId}/notes/${noteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete note");

      showToast("Note deleted");
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteLead(leadId, leadName) {
    if (!window.confirm(`Are you sure you want to permanently delete lead "${leadName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete lead");

      if (selectedLead?.id === leadId) setSelectedLead(null);
      showToast(`Lead "${leadName}" deleted`);
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleAddLead(newLeadData) {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLeadData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to add lead");

    showToast(`Lead "${data.lead.name}" added to pipeline`);
    fetchDashboardData();
  }

  function handleSimulatorInquiry(createdLead) {
    showToast(`New inbound lead received: ${createdLead.name}`);
    fetchDashboardData();
  }

  if (!authChecked) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
        Loading CRM workspace...
      </div>
    );
  }

  if (!token) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        onLogout={handleLogout}
        user={user}
      />

      <main className="main-content">
        {activeTab === "leads" && (
          <>
            <StatsCards stats={stats} />

            <LeadTable
              leads={leads}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sourceFilter={sourceFilter}
              setSourceFilter={setSourceFilter}
              sort={sort}
              setSort={setSort}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onSelectLead={(lead) => setSelectedLead(lead)}
              onUpdateStatus={handleUpdateStatus}
              onDeleteLead={handleDeleteLead}
              onRefresh={fetchDashboardData}
            />
          </>
        )}

        {activeTab === "simulator" && (
          <PublicLeadCapture
            onLeadSubmitted={handleSimulatorInquiry}
            onSwitchToDashboard={() => setActiveTab("leads")}
          />
        )}
      </main>

      {/* Modals */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdateStatus={handleUpdateStatus}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
        />
      )}

      {isAddModalOpen && (
        <AddLeadModal
          onClose={() => setIsAddModalOpen(false)}
          onAddLead={handleAddLead}
        />
      )}

      {/* Toast Notification */}
      {toast && <div className="toast-notice">{toast}</div>}
    </div>
  );
}
