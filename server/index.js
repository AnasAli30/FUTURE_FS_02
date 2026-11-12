import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { db } from "./db.js";
import {
  generateToken,
  requireAuth,
  revokeToken,
  validateSessionToken,
  verifyCredentials,
  adminCredentials,
} from "./auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3002;
const isProd = process.env.NODE_ENV === "production";
const distDir = path.resolve(__dirname, "../dist");

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (!req.url.startsWith("/assets")) {
      console.log(`${req.method} ${req.url} -> ${res.statusCode} (${Date.now() - start}ms)`);
    }
  });
  next();
});

// Simple IP-based rate limiter for public lead submissions
const submissionTracker = new Map();
function rateLimitLeads(req, res, next) {
  const ip = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 15;

  const userRecord = submissionTracker.get(ip) || [];
  const recent = userRecord.filter((timestamp) => now - timestamp < windowMs);

  if (recent.length >= maxRequests) {
    return res.status(429).json({ error: "Too many lead submissions. Please try again shortly." });
  }

  recent.push(now);
  submissionTracker.set(ip, recent);
  next();
}

// -------------------------------------------------------------
// Health
// -------------------------------------------------------------
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Client Lead Management System (Mini CRM)",
    task: "FUTURE_FS_02",
    time: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// Auth Routes
// -------------------------------------------------------------
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  if (!verifyCredentials(email, password)) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const { token, expiresAt } = generateToken(email);
  res.json({
    ok: true,
    token,
    expiresAt,
    user: {
      email,
      name: "Admin User",
      role: "Administrator",
    },
  });
});

app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ authenticated: false });
  }
  const token = authHeader.substring(7);
  const session = validateSessionToken(token);
  if (!session) {
    return res.status(401).json({ authenticated: false });
  }

  res.json({
    authenticated: true,
    user: {
      email: session.email,
      name: "Admin User",
      role: "Administrator",
    },
  });
});

app.post("/api/auth/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    revokeToken(authHeader.substring(7));
  }
  res.json({ ok: true });
});

// -------------------------------------------------------------
// Leads Routes
// -------------------------------------------------------------

// 1. Get all leads (Search, Filter, Sort) - Protected
app.get("/api/leads", requireAuth, (req, res) => {
  try {
    const { search, status, source, sort } = req.query;
    const leads = db.getLeads({ search, status, source, sort });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch leads." });
  }
});

// 2. Get single lead with notes - Protected
app.get("/api/leads/:id", requireAuth, (req, res) => {
  try {
    const lead = db.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found." });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch lead." });
  }
});

// 3. Create lead (Public endpoint for website contact forms & manual dashboard additions)
app.post("/api/leads", rateLimitLeads, (req, res) => {
  try {
    const { name, email, phone, company, source, budget, message, trap } = req.body || {};

    // Bot trap check
    if (trap) {
      return res.status(200).json({ ok: true, message: "Lead captured successfully." });
    }

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    const lead = db.createLead({
      name,
      email,
      phone: phone || "",
      company: company || "",
      source: source || "Website Contact Form",
      budget: budget || "",
      message: message || "",
    });

    res.status(201).json({
      ok: true,
      message: "Lead created and added to pipeline successfully.",
      lead,
    });
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to create lead." });
  }
});

// 4. Quick status update - Protected
app.patch("/api/leads/:id/status", requireAuth, (req, res) => {
  try {
    const { status } = req.body || {};
    if (!status) return res.status(400).json({ error: "New status is required." });

    const updated = db.updateLeadStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: "Lead not found." });

    res.json({ ok: true, lead: updated });
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to update lead status." });
  }
});

// 5. Update lead details - Protected
app.put("/api/leads/:id", requireAuth, (req, res) => {
  try {
    const updated = db.updateLead(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ error: "Lead not found." });

    res.json({ ok: true, lead: updated });
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to update lead." });
  }
});

// 6. Delete lead - Protected
app.delete("/api/leads/:id", requireAuth, (req, res) => {
  try {
    const success = db.deleteLead(req.params.id);
    if (!success) return res.status(404).json({ error: "Lead not found." });

    res.json({ ok: true, message: "Lead removed from system." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete lead." });
  }
});

// 7. Add follow-up note to lead - Protected
app.post("/api/leads/:id/notes", requireAuth, (req, res) => {
  try {
    const { text, author } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Note text is required." });
    }

    const note = db.addLeadNote(req.params.id, text, author || "Admin");
    if (!note) return res.status(404).json({ error: "Lead not found." });

    const updatedLead = db.getLeadById(req.params.id);
    res.status(201).json({ ok: true, note, lead: updatedLead });
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to add note." });
  }
});

// 8. Delete follow-up note from lead - Protected
app.delete("/api/leads/:id/notes/:noteId", requireAuth, (req, res) => {
  try {
    const success = db.deleteLeadNote(req.params.id, req.params.noteId);
    if (!success) return res.status(404).json({ error: "Note or lead not found." });

    const updatedLead = db.getLeadById(req.params.id);
    res.json({ ok: true, message: "Note removed.", lead: updatedLead });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete note." });
  }
});

// -------------------------------------------------------------
// Analytics Route - Protected
// -------------------------------------------------------------
app.get("/api/analytics", requireAuth, (req, res) => {
  try {
    const stats = db.getAnalytics();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch analytics." });
  }
});

// -------------------------------------------------------------
// Serve static client in production or when dist exists
// -------------------------------------------------------------
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(PORT, "127.0.0.1", () => {
  console.log(`[Mini CRM API] Listening on http://127.0.0.1:${PORT}`);
  console.log(`[Mini CRM API] Default Admin: ${adminCredentials.email} / admin123`);
});
