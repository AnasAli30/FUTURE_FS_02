import crypto from "crypto";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@crm.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SECRET = process.env.SESSION_SECRET || "mini_crm_secret_key_2026_future_interns";

// In-memory active tokens store (token -> { email, expiresAt })
const activeSessions = new Map();

export function hashPassword(plain) {
  return crypto.createHmac("sha256", SECRET).update(plain).digest("hex");
}

export function generateToken(email) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  activeSessions.set(token, { email, expiresAt });
  return { token, expiresAt };
}

export function verifyCredentials(email, password) {
  if (!email || !password) return false;
  return (
    email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD
  );
}

export function validateSessionToken(token) {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  return session;
}

export function revokeToken(token) {
  if (token) activeSessions.delete(token);
}

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing or invalid token." });
  }

  const token = authHeader.substring(7);
  const session = validateSessionToken(token);
  if (!session) {
    return res.status(401).json({ error: "Session expired or invalid. Please log in again." });
  }

  req.user = session;
  next();
}

export const adminCredentials = {
  email: ADMIN_EMAIL,
};
