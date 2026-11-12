import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

function ensureDirectoryExistence(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const INITIAL_SEED_LEADS = [
  {
    id: "lead_01",
    name: "Aarav Patel",
    email: "aarav.patel@horizonfin.com",
    phone: "+91 98201 44521",
    company: "Horizon Fintech",
    source: "Website Contact Form",
    status: "New",
    budget: "$5,000 - $10,000",
    message: "Looking for a full-stack dashboard for our B2B loan portfolio tracking with real-time analytics.",
    notes: [
      {
        id: "note_101",
        text: "Lead arrived via main website contact form. High intent for Q1 launch.",
        author: "System (Webhook)",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "lead_02",
    name: "Elena Rostova",
    email: "elena@pulsecreative.design",
    phone: "+1 (415) 890-1234",
    company: "Pulse Creative Agency",
    source: "Landing Page",
    status: "Contacted",
    budget: "$3,000 - $5,000",
    message: "We need an interactive client portal where our clients can review branding milestones and invoice status.",
    notes: [
      {
        id: "note_102",
        text: "Sent preliminary pricing deck and portfolio examples over email.",
        author: "Admin (Anas Ali)",
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
      {
        id: "note_103",
        text: "Elena replied positively, requested a 20-minute Zoom call for Friday 3 PM.",
        author: "Admin (Anas Ali)",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "lead_03",
    name: "Marcus Vance",
    email: "marcus.v@apexlogistics.io",
    phone: "+44 20 7946 0912",
    company: "Apex Global Logistics",
    source: "Referral",
    status: "In Discussion",
    budget: "$10,000+",
    message: "Referred by David from BlockScale. We need a dispatch scheduling tool integrated with our driver telemetry.",
    notes: [
      {
        id: "note_104",
        text: "Initial discovery call completed. Discussed requirements for dispatch map integration.",
        author: "Admin (Anas Ali)",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: "note_105",
        text: "Submitted technical scope of work and architecture diagram. Awaiting security review.",
        author: "Admin (Anas Ali)",
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "lead_04",
    name: "Sophia Chen",
    email: "sophia@lumencare.health",
    phone: "+1 (650) 432-8765",
    company: "LumenCare Telehealth",
    source: "Website Contact Form",
    status: "Converted",
    budget: "$8,000 - $12,000",
    message: "Interested in rebuilding our patient onboarding web flow with HIPAA-compliant form intake.",
    notes: [
      {
        id: "note_106",
        text: "Intro call scheduled and completed.",
        author: "Admin (Anas Ali)",
        createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
      },
      {
        id: "note_107",
        text: "Proposal approved! Contract signed and 50% deposit received via wire.",
        author: "Admin (Anas Ali)",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "lead_05",
    name: "Devon Miller",
    email: "devon@cryptovaults.xyz",
    phone: "+1 (312) 555-0188",
    company: "CryptoVaults",
    source: "LinkedIn",
    status: "New",
    budget: "$4,000 - $6,000",
    message: "Saw your Web3 and React work on GitHub. We need an MVP minting dashboard with wallet connect (wagmi/viem).",
    notes: [
      {
        id: "note_108",
        text: "Inbound via LinkedIn message. Added to CRM pipeline for immediate qualification.",
        author: "Admin (Anas Ali)",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "lead_06",
    name: "Carlos Gomez",
    email: "carlos@bistrodelmar.com",
    phone: "+34 91 123 4567",
    company: "Bistro Del Mar",
    source: "Direct",
    status: "Lost",
    budget: "< $1,000",
    message: "Need a 1-page menu site with reservations. Budget is strictly $400.",
    notes: [
      {
        id: "note_109",
        text: "Budget below minimum project threshold. Recommended Squarespace / WordPress self-serve template.",
        author: "Admin (Anas Ali)",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: "note_110",
        text: "Client decided to build DIY. Marked as Lost.",
        author: "Admin (Anas Ali)",
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "lead_07",
    name: "Priya Sharma",
    email: "priya@zenithapparel.in",
    phone: "+91 91672 88910",
    company: "Zenith Sustainable Apparel",
    source: "Website Contact Form",
    status: "Converted",
    budget: "$6,500",
    message: "We need an e-commerce storefront revamp focusing on mobile performance, micro-animations, and Shopify sync.",
    notes: [
      {
        id: "note_111",
        text: "Sent demo video of mobile performance audits.",
        author: "Admin (Anas Ali)",
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
      {
        id: "note_112",
        text: "Contract finalized. Project kicked off sprint 1.",
        author: "Admin (Anas Ali)",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

function readAllLeads() {
  ensureDirectoryExistence(LEADS_FILE);
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(INITIAL_SEED_LEADS, null, 2), "utf8");
    return [...INITIAL_SEED_LEADS];
  }
  try {
    const raw = fs.readFileSync(LEADS_FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error reading leads file:", error);
    return [...INITIAL_SEED_LEADS];
  }
}

function writeAllLeads(leads) {
  ensureDirectoryExistence(LEADS_FILE);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf8");
}

export const db = {
  getLeads({ search = "", status = "All", source = "All", sort = "newest" } = {}) {
    let leads = readAllLeads();

    // Filter by status
    if (status && status !== "All") {
      leads = leads.filter((lead) => lead.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by source
    if (source && source !== "All") {
      leads = leads.filter((lead) => lead.source.toLowerCase() === source.toLowerCase());
    }

    // Search query (name, email, company, message)
    if (search && search.trim() !== "") {
      const q = search.toLowerCase().trim();
      leads = leads.filter(
        (lead) =>
          lead.name?.toLowerCase().includes(q) ||
          lead.email?.toLowerCase().includes(q) ||
          lead.company?.toLowerCase().includes(q) ||
          lead.message?.toLowerCase().includes(q) ||
          lead.phone?.toLowerCase().includes(q)
      );
    }

    // Sorting
    leads.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (sort === "oldest") return dateA - dateB;
      if (sort === "name") return (a.name || "").localeCompare(b.name || "");
      return dateB - dateA; // default newest
    });

    return leads;
  },

  getLeadById(id) {
    const leads = readAllLeads();
    return leads.find((lead) => lead.id === id) || null;
  },

  createLead({ name, email, phone = "", company = "", source = "Website Contact Form", budget = "", message = "" }) {
    if (!name || !email) {
      throw new Error("Name and Email are required fields.");
    }

    const leads = readAllLeads();
    const newLead = {
      id: "lead_" + Date.now().toString(36) + "_" + crypto.randomBytes(3).toString("hex"),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company.trim(),
      source: source.trim() || "Website Contact Form",
      status: "New",
      budget: budget.trim(),
      message: message.trim(),
      notes: [
        {
          id: "note_" + Date.now().toString(36),
          text: `Inbound lead captured via ${source || "Website Contact Form"}.`,
          author: "System (Webhook)",
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    leads.unshift(newLead);
    writeAllLeads(leads);
    return newLead;
  },

  updateLeadStatus(id, newStatus) {
    const validStatuses = ["New", "Contacted", "In Discussion", "Converted", "Lost"];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const leads = readAllLeads();
    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) return null;

    const oldStatus = leads[index].status;
    leads[index].status = newStatus;
    leads[index].updatedAt = new Date().toISOString();

    leads[index].notes.push({
      id: "note_" + Date.now().toString(36) + "_" + crypto.randomBytes(2).toString("hex"),
      text: `Status changed from "${oldStatus}" to "${newStatus}".`,
      author: "Admin",
      createdAt: new Date().toISOString(),
    });

    writeAllLeads(leads);
    return leads[index];
  },

  updateLead(id, updates) {
    const leads = readAllLeads();
    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) return null;

    const allowed = ["name", "email", "phone", "company", "budget", "source", "status", "message"];
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        leads[index][key] = updates[key];
      }
    }

    leads[index].updatedAt = new Date().toISOString();
    writeAllLeads(leads);
    return leads[index];
  },

  deleteLead(id) {
    const leads = readAllLeads();
    const filtered = leads.filter((l) => l.id !== id);
    if (filtered.length === leads.length) return false;
    writeAllLeads(filtered);
    return true;
  },

  addLeadNote(id, text, author = "Admin") {
    if (!text || !text.trim()) {
      throw new Error("Note content cannot be empty.");
    }

    const leads = readAllLeads();
    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) return null;

    const newNote = {
      id: "note_" + Date.now().toString(36) + "_" + crypto.randomBytes(3).toString("hex"),
      text: text.trim(),
      author: author.trim() || "Admin",
      createdAt: new Date().toISOString(),
    };

    leads[index].notes.push(newNote);
    leads[index].updatedAt = new Date().toISOString();
    writeAllLeads(leads);
    return newNote;
  },

  deleteLeadNote(leadId, noteId) {
    const leads = readAllLeads();
    const index = leads.findIndex((l) => l.id === leadId);
    if (index === -1) return null;

    const initialLength = leads[index].notes.length;
    leads[index].notes = leads[index].notes.filter((n) => n.id !== noteId);
    if (leads[index].notes.length === initialLength) return false;

    leads[index].updatedAt = new Date().toISOString();
    writeAllLeads(leads);
    return true;
  },

  getAnalytics() {
    const leads = readAllLeads();
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === "New").length;
    const contactedCount = leads.filter((l) => l.status === "Contacted").length;
    const discussionCount = leads.filter((l) => l.status === "In Discussion").length;
    const convertedCount = leads.filter((l) => l.status === "Converted").length;
    const lostCount = leads.filter((l) => l.status === "Lost").length;
    const conversionRate = total > 0 ? ((convertedCount / total) * 100).toFixed(1) : 0;

    // Sources breakdown
    const sources = {};
    leads.forEach((l) => {
      sources[l.source] = (sources[l.source] || 0) + 1;
    });

    return {
      total,
      new: newCount,
      contacted: contactedCount,
      inDiscussion: discussionCount,
      converted: convertedCount,
      lost: lostCount,
      conversionRate: Number(conversionRate),
      sources,
    };
  },
};
