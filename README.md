# LeadFlow CRM — Client Lead Management System (Mini CRM)

A full-stack, responsive Client Lead Management System (Mini CRM) built with **React**, **Vite**, and **Node.js/Express**. Designed to solve a fundamental business need: capturing incoming website contact form inquiries, tracking their sales pipeline progression (`New` → `Contacted` → `In Discussion` → `Converted` / `Lost`), logging timestamped follow-up conversations, and providing real-time pipeline analytics behind a secure admin interface.

---

## 🎯 Overview & Use Case

Whenever prospective clients submit an inquiry on an agency, freelance, or startup website, businesses require a central command system to:
1. **Store & Qualify**: Ingest form submissions with source attribution.
2. **Pipeline Progression**: Advance leads across qualification stages (`New` → `Contacted` → `In Discussion` → `Converted` / `Lost`).
3. **Log Follow-ups**: Record meeting summaries, discovery calls, quotes sent, and action items with timestamps.
4. **Monitor Conversion**: Track conversion rates and source channels to optimize client acquisition.

---

## ✨ Features

- **Comprehensive Lead Listing**: View contact names, emails, phone numbers, companies, acquisition sources, budgets, and timestamps.
- **Interactive Status Workflow**: Quick status update selector (`New`, `Contacted`, `In Discussion`, `Converted`, `Lost`).
- **Follow-Up Notes & Activity Timeline**: Log timestamped conversation notes, meeting takeaways, and next steps for any lead.
- **Secure Admin Authentication**: Protected dashboard with token-based session management, password hashing, and logout controls.
- **Website Contact Form Simulator**: Dedicated tab demonstrating end-to-end integration by dispatching live inquiries to `POST /api/leads` and watching them populate the CRM in real time.
- **Search & Multi-Level Filtering**:
  - Full-text search across name, email, company, and message.
  - Filter by pipeline status (`All`, `New`, `Contacted`, `In Discussion`, `Converted`, `Lost`).
  - Filter by acquisition source (`Website Contact Form`, `Landing Page`, `Referral`, `LinkedIn`, `Direct`).
  - Sort by Newest, Oldest, or Name (A-Z).
- **Real-Time Analytics Cards**: Instant metrics on Total Leads, Inbound Inquiries, In Discussion, Converted Deals, and Conversion Rate (%).
- **CSV Export**: One-click data export for client reports, spreadsheets, or backup.
- **Dark & Light Mode**: Accessible theme switcher persisted in `localStorage`.
- **Production Ready**: Single-command development and consolidated Express production server.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Font Awesome icons, custom modern CSS design system
- **Backend**: Node.js, Express
- **Database / Storage**: Persistent JSON database (`data/leads.json`) with auto-seeding on first run
- **Security & Reliability**: Bearer token authentication, input validation, bot trap honeypot, IP rate limiting, CORS

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher recommended)
- `npm`

### 1. Installation
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
- **Frontend App**: http://127.0.0.1:5174
- **Backend API**: http://127.0.0.1:3002
*(The Vite development server automatically proxies `/api` requests to Express).*

### 3. Production Build
```bash
npm run build
npm start
```
Serves both the compiled client dashboard and the REST API together on port 3002.

---

## 🔐 Admin Authentication

Preconfigured credentials for evaluation:

- **Email**: `admin@crm.local`
- **Password**: `admin123`

*(Can be configured via environment variables in `.env`: `ADMIN_EMAIL` and `ADMIN_PASSWORD`).*

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate admin & receive session token |
| `GET` | `/api/auth/me` | Protected | Verify active session & user details |
| `POST` | `/api/auth/logout` | Protected | Revoke active session token |

### Leads Pipeline
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/leads` | Protected | Get leads with search, filters (`status`, `source`), & sorting |
| `GET` | `/api/leads/:id` | Protected | Get lead profile with full activity notes |
| `POST` | `/api/leads` | Public | Capture incoming lead from website forms or add manually |
| `PATCH` | `/api/leads/:id/status`| Protected | Update pipeline status (`New`, `Contacted`, etc.) |
| `PUT` | `/api/leads/:id` | Protected | Update lead contact or budget details |
| `DELETE` | `/api/leads/:id` | Protected | Delete lead from the system |

### Follow-Up Notes
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/leads/:id/notes` | Protected | Add timestamped follow-up note |
| `DELETE` | `/api/leads/:id/notes/:noteId` | Protected | Remove a specific note |

### Analytics & System
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics` | Protected | Retrieve pipeline counts, conversion rate, & source breakdown |
| `GET` | `/api/health` | Public | Server health & uptime status |

---

## 👤 Author

- **Name**: Anas Ali
- **GitHub**: [@AnasAli30](https://github.com/AnasAli30)
- **Role**: Full-stack and Web3 Developer
