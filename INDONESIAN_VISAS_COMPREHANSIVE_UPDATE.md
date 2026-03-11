# 🌐 INDONESIAN VISAS COMPREHENSIVE SYSTEM UPDATE & KNOWLEDGE BASE
**Timestamp:** 2026-03-03 14:40 WIB  
**Version:** v2.7.0-COMPREHENSIVE  
**Status:** Production Mode Active  

---

## 🏗️ 1. SYSTEM CORE ARCHITECTURE

| Layer | Technology | Role |
|---|---|---|
| **Frontend/Framework** | Next.js 16.1.1 (App Router + Turbopack) | Server-Side Rendering (SSR) & Dynamic Routing |
| **Styling** | Vanilla CSS + Tailwind CSS + Material UI (MUI) v7 | Modern, responsive, and aesthetic UI |
| **Authentication** | Supabase Auth (@supabase/ssr) | Google OAuth & Email/Password session management |
| **Database/ORM** | Prisma v5 + Supabase PostgreSQL | Type-safe data modeling & persistent storage |
| **Payment Gateway** | Midtrans (SNAP Integration) | Secure IDR transaction handling |
| **AI SDK** | Vercel AI SDK (@ai-sdk/react | ai ^6.0) | Streamed LLM interactions & tool-calling |
| **Icons** | Lucide React + MUI Icons | Visual language |

---

## 🛰️ 2. PRODUCTION ROUTE INVENTORY (APPLICATION MAP)

### 📂 2.1 Customer-Facing Routes (App Router)
- `● /[locale]` — Multi-language Landing Page (Home)
- `● /[locale]/about` — Company background and mission
- `● /[locale]/services` — Full visa catalog
- `● /[locale]/services/[id]` — Detailed visa specific landing pages (e.g., B1, D12, E28A)
- `● /[locale]/apply` — Multi-step Visa Application wizard
- `● /[locale]/pricing` — Consolidated price comparison table
- `● /[locale]/extend` — Visa extension service portal
- `● /[locale]/arrival-card` — Digital Customs/Arrival card submission
- `● /[locale]/register` | `● /[locale]/login` — User authentication portal
- `● /[locale]/dashboard` — Secure customer portal (Orders, Documents, Settings)
- `● /[locale]/faq` — Knowledge base for customers
- `● /[locale]/terms-and-conditions` | `● /[locale]/privacy-policy` | `● /[locale]/refund` — Legal coverage
- `ƒ /[locale]/verify/[slug]` — Public Authenticity verification for issued visas
- `ƒ /[locale]/invoice/[id]` — Dynamic invoice generator/viewer

### 📂 2.2 Admin & Internal Routes
- `● /[locale]/admin` — Central Management Hub (Statistics, Orders, Invoices, Users)
- `○ /admin/ai-master` — Professional AI Orchestration Dashboard
- `ƒ /[locale]/admin?tab=ai_master` — Deep-linked AI control center

### 📂 2.3 API Ecosystem (Logic Layer)
| Category | Endpoint | Purpose |
|---|---|---|
| **AI Master** | `/api/ai-master/chat` | Orchestrator (gpt-4o) with tool-calling capabilities |
| | `/api/ai-master/verify` | Secure passphrase validation for Boss Mode |
| | `/api/ai-master/management` | System state, change requests, and risk logs fetch |
| | `/api/ai-master/strategic-report` | Revenue, funnel, and expiry forecast intelligence |
| | `/api/ai-master/order-intelligence` | Deep analytics on order volume and trends |
| **AI Worker** | `/api/ai-worker/execute` | Real production database mutations (Executes `visa.update`) |
| **AI Seller** | `/api/chat` | Customer-facing sales stream with action button support |
| | `/api/chat/conversations` | Live feed of customer chats for admin monitoring |
| **Governance** | `/api/cron/risk-scan` | Automated data integrity and sentiment scan |
| | `/api/cron/emergency-scan` | Recursive execution and hazard detection |
| **Payments** | `/api/payments/midtrans/token` | Generates 24h Snap Token for transactions |
| | `/api/payments/midtrans/webhook` | Processed real-time status updates (SHA512 SECURED) |
| **Auth** | `/api/user/profile` | Fetches session profile via Prisma (RLS bypass with token) |
| | `/api/auth/session` | Standard Next-Auth style session check |
| **Management** | `/api/users` | Admin-only user list |
| | `/api/applications` | Visa application CRUD operations |
| | `/api/invoices` | Financial document management |

---

## 🧠 3. AI MULTI-AGENT ORCHESTRATION (THE BRAIN)

The website operates under a **Semi-Autonomous Governance Model** where AI agents specialize in distinct business functions.

### 🤖 3.1 AI MASTER (Digital COO)
- **Role:** Central Decision Maker.
- **Capabilities:** 7 Strategic Tools — Can propose changes, approve them, execute them, toggle system modes, and report on risks.
- **Authentication:** Requires `boss2026` passphrase for ChatWidget access.

### 🤖 3.2 AI RISK (Compliance & Audit)
- **Role:** 24/7 Security Sentinel.
- **Audit Logic:** Checks `Visa` tables for missing pricing, identifies "Stale" governance requests, and analyzes `ChatConversation` for high-frustration keywords (Sentiment Analysis).

### 🤖 3.3 AI WORKER (Execution)
- **Role:** Immutable Action Logger.
- **Control:** ONLY executes if a valid `approvalId` exists and Risk Guard has not vetoed.
- **Action:** Creates a snapshot of data *before* updating, then logs the change meticulously.

### 🤖 3.4 AI SELLER (Sales & Support)
- **Role:** Professional Consultant.
- **The "Button" System:** Uses `[BTN:label|url]` syntax to insert real UI buttons into responses (e.g., [BTN:Apply Now|/en/apply]).
- **Boss mode:** Switches to AI Master if a user provides the secret passphrase.

---

## 💳 4. FINANCIAL & DATA FLOWS

### 4.1 Payment Lifecycle (Midtrans)
1.  **Initiation:** User clicks "Pay" -> API `/api/payments/midtrans/token` generates a transaction.
2.  **User Action:** User pays via GoPay, Virtual Account, or Credit Card.
3.  **Webhook:** Midtrans sends `POST /api/payments/midtrans/webhook`.
4.  **Verification:** System calculates `SHA512(order_id + status_code + gross_amount + serverKey)`.
5.  **Autoplay:** Upon success, the system:
    -   Marks `Payment` as SUCCESS.
    -   Marks `Invoice` as PAID.
    -   Marks `VisaApplication` as Paid.
    -   Triggers a Formspree email receipt.

### 4.2 Governance Flow (The approve-execute loop)
-   **Propose:** AI Master suggests a price change -> Creates `AIChangeRequest`.
-   **Review:** Admin (Boss) sees the request in the Dashboard.
-   **Approve:** AI Master generates `approvalId`.
-   **Execute:** AI Worker reads metadata -> updates DB -> Logs completion.

---

## 🗄️ 5. DATABASE ENTITIES (SCHEMA HIGHLIGHTS)

| Entity | Primary Purpose |
|---|---|
| **`User`** | Stores profile, role (admin/user), and auth linkage. |
| **`Visa`** | Master catalog for all visa types (B1, C1, D12, etc.) and pricing. |
| **`VisaApplication`** | Core record of a customer's visa order + documents. |
| **`Invoice`** | Financial shell for applications, tracking IDR amount and status. |
| **`Payment`** | Unique transaction record with Midtrans snapshot data. |
| **`ChatConversation`** | Long-term log of customer-to-AI-Seller interactions. |
| **`AIRiskLog`** | Automated security scan findings. |
| **`AIExecutionLog`** | Immutable history of "Who changed what and when". |

---

## 🛡️ 6. SECURITY & RELIABILITY MEASURES

### 6.1 Defensive Profile Fetch
API `/api/user/profile` features a **Bearer Token Fallback**. If the cookie session hasn't synced (common right after login), it verifies the JWT directly against Supabase to ensure the UI never hits a 401 error.

### 6.2 Raw SQL Chat Logging
To avoid Prisma's dev-mode hot-reload cache issues, `chat_conversations` are upserted via `prisma.$executeRaw`. This ensures customer logs are **never lost** even during server deployments.

### 6.3 Financial Hard Lock
AI Worker is strictly prohibited from touching `Payment`, `Invoice`, or `User` tables. Business mutations are restricted to `Visa`, `CompanyService`, and general content.

---

## 📖 7. KNOWLEDGE BASE FOR AI AGENTS
*If you are an Antigravity Agent reading this, follow these rules:*
- **Always** prioritize `INDONESIAN_VISAS_AI_SYSTEM_MASTER_DOCUMENT_v1.0.md` for governance.
- **Check** `.env.local` for the `MASTER_SECRET_PASSPHRASE` (currently `boss2026`).
- **Use** the `AI Seller Brain` (Tab 6 in Admin) to see what customers are worried about.
- **Never** promise visa approval; strictly follow the **Regulation-First** tone.
- **Ensure** every production build passes `npm run build` before pushing to `main`.

---

## 🛡️ 8. REGISTRATION & AUTHENTICATION HARDENING (Feb 28, 2026)

### 8.1 Critical Role Security (Admin Protection)
Implemented a hardcoded check in the `register` flow to ensure that only `damnbayu@gmail.com` can be promoted to the `admin` role. All other users are strictly forced to the `user` role to prevent unauthorized access.

### 8.2 Profile Persistence & Reliability (API PUT)
Replaced the direct `.update()` call in `/api/user/profile` with an `.upsert()` logic. 
- **Benefit:** If a user’s record is missing from the public database (due to a sync failure), the system now creates it on-demand during their first profile save. 
- **Security:** Unified Bearer Token fallback ensures that profile updates work even if cookies haven't fully propagated.

### 8.3 SUPABASE SYNC FIX (SQL TRIGGER)
Identified and fixed a bug in the `handle_new_user` SQL trigger where the missing `updated_at` field caused database rollbacks.
- **Improved Trigger:** Includes `updated_at: NOW()` to satisfy Prisma schema requirements.
- **Security:** Functions now run with explicit `search_path` to prevent path poisoning.

### 8.4 AUTH UX ENHANCEMENTS
- **Resend Feature:** "Resend Confirmation Email" button added to registration and login views.
- **Dynamic Form:** WhatsApp phone field upgraded with an editable country code datalist.

---
**END OF COMPREHENSIVE REPORT**

---


---

## 10. RECENT UPDATES (MARCH 11, 2026)

### 10.1 Transactional Email System (Resend Integration)
- **Customer Notifications**: Automatic "Application Received" and "Payment Success" emails implemented via `resend`.
- **Admin Alerts**: Immediate email notifications sent to `indonesianvisas@gmail.com` for every new order.
- **Invoice Linking**: Direct link to dynamic PDF invoices included in all financial emails.

### 10.2 Admin Order Intelligence (Order Panel)
- **Real-time Tracking**: New "Incoming Orders" section in Admin Dashboard for monitoring visa and company formation statuses.
- **Enhanced UX**: Integrated filtering and direct link to customer invoices.

### 10.3 DOKU (Jokul) Payment Refinement
- **Production Mode**: Full support for DOKU production API with HMAC-SHA256 signature verification.
- **Environment Security**: All Formspree IDs and Webhook secrets moved to SSR-compatible environment variables.

### March 11th, 2026 - Final Hardening & Extreme Performance
*   **Doku Payment Hardening**:
    *   Implemented server-side phone number sanitization (digits only, 5-16 chars) to prevent API validation failures.
    *   Unified production redirection to `indonesianvisas.com`.
*   **UI Acceleration**:
    *   Optimized `ApplicationPanel` by switching step components from dynamic to static imports, eliminating the interaction lag for "Select Your Country".
    *   Reduced perceived latency in application flow transitions.
*   **PageSpeed & SEO**:
    *   Enabled `optimizeCss` in `next.config.ts` using `critters` for critical CSS inlining.
    *   Audited render-blocking resources and maximized resource hints (`preconnect`/`dns-prefetch`).
    *   Integrated final branding assets: `Favicon.webp`, `og-image.webp`, and `webapp.webp`.

### 10.4 Performance & SEO Gold
- **Landing Page Speed**: Implementation of `next/dynamic` for heavy components and image optimization with `next/image`.
- **Production Domain**: Unified all redirects and CTA links to `https://indonesianvisas.com`.
- **Infrastructure**: Prepared for Cloudflare Pages global CDN distribution.

---
**END OF COMPREHENSIVE REPORT (Updated March 11)**
