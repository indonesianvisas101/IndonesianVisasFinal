# 🌐 INDONESIAN VISAS COMPREHENSIVE SYSTEM UPDATE & KNOWLEDGE BASE
**Timestamp:** 2026-03-12 01:20 WIB  
**Version:** v2.9.0-COMPREHENSIVE  
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
- **Capabilities:** 8+ Strategic Tools — Can propose changes, approve them, execute them, toggle system modes, and report on risks/status.
- **Authentication:** Requires `@BossBayu2026` passphrase for ChatWidget/Dashboard "Boss Mode".
- **Validation**: Requires `AdminBayu2026` confirmation code for all database mutation executions.
- **Tone**: Professional, respectful "Digital COO" persona.

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
- **Check** `.env.local` for the `BOSS_PASSPHRASE` (`@BossBayu2026`) and `CONFIRM_CODE` (`AdminBayu2026`).
- **Use** the `getSystemStatus` tool to monitor real-time web health and customer sentiment.
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

### 10.4 Performance & Admin Intelligence (March 11, 2026)
- **Real-time Order Badges**: Admin Dashboard now features real-time Supabase broadcasts for new visa applications, showing a persistent badge on the "Incoming Orders" tab.
- **Information Center**: Integrated new order alerts directly into the dashboard's Information Center for immediate awareness.
- **AI "Boss Mode" 2.0**:
    - AI now addresses the administrator with probabilistic greetings ("Boss", "My Boss", "Boss Bayu", "Bro").
    - Implemented `AdminBayu` signature protocol for secure command validation.
    - Simplified @mention routing for Seller vs Expert modes.
- **Payment & UX Hardening**:
    - **Doku Fallback**: Implemented automatic phone number fallback to prevent "phone length" errors in Doku Checkout.
    - **Step 1 Optimization**: Refined country filtering with `useMemo` to eliminate interaction lag on low-end devices.
    - **Universal Domain**: Unified all email and system redirects to `https://indonesianvisas.com`.

### 10.5 Infrastructure
- **Analytics**: Optimized Google Analytics loading via a 5.5s deferred client-side injection to maximize PageSpeed Performance scores.
- **Deployment**: Configured for Cloudflare Pages with full sitemap, robots, and OpenGraph optimization.

---
### 10.6 Advanced Flow & Security Hardening (March 11th - evening)
- **AI Security Protocol**: Transitioned from hardcoded `AdminBayu` to `ADMIN_SIGNATURE_CODE` environment variable for cryptographic-grade command validation.
- **Transactional Automation**:
    - **Payment Reminders**: Fully automated Doku payment guides sent via email upon checkout initiation.
    - **Confirmation Loop**: Dual-stage confirmation for both customer (receipt) and admin (alert).
- **UX Flow "Visual Polish"**:
    - **Step 1 (Arrival Date)**: Implemented `pulseHighlight` animation and high-contrast borders for the arrival date card to minimize user friction.
    - **Step 4 (Order Intel)**: Added dynamic **Price x People = Total** summary with a 10-currency converter supporting USD, AUD, EUR, GBP, SGD, JPY, CNY, MYR, KRW, THB.
    - **Real-time Price Comparison**: Simulated "fair rate" calculation with loading states to build customer trust.
- **Deep Linking**: Implemented `visa` URL parameter support to auto-select visa types and open the application panel directly from marketing links.
- **Admin Visibility**: Updated the Admin Order Panel to provide instant access to all uploaded customer documents via direct storage links.

---
**END OF COMPREHENSIVE REPORT (Updated March 11, Post-Evening Refresh)**

### Section 10: Security Hardening & DOKU Payment Fixes (Phase 21)
**Date:** March 11, 2026
**Focus:** Admin API Security and Payment Gateway Payload format.

1. **DOKU Jokul Checkout V1 API Fix:**
   - **Issue:** DOKU Gateway was returning a 500 error during checkout.
   - **Resolution:** Added the missing required `payment` object containing `payment_due_date` strictly required by the DOKU `checkout/v1/payment` endpoint.

2. **Invoice Update API Patch `PATCH /api/applications`:**
   - **Issue:** The admin interface failed to patch the status of individual invoices due to missing Auth tokens (Client components vs SSR Cookies).
   - **Resolution:** Implemented a robust Bearer Token fallback mechanism. The API now elegantly falls back to extracting authorization tokens from headers if standard SSR cookies fail.

3. **Admin Dashboard Security & Route Enforcement:**
   - **Issue:** Unauthorized users could potentially access the `/admin` route's UI layout.
   - **Resolution:** Hardened `src/app/[locale]/admin/page.tsx`. Added `isLoading` state handling directly connected to `useAuth` user profiles alongside `useEffect` redirect routing. Only users strictly designated with `user.role === 'admin'` can render the administrative panel. Other users are forcefully redirected.
### Section 11: Boss Mode & Ecosystem Intelligence (Phase 23)
**Date:** March 12, 2026
**Focus:** AI Master Security & Real-time Monitoring.

1. **Boss Mode Activation:**
   - AI Master now recognizes `@BossBayu2026` to unlock high-privilege administrative persona.
   - Persona updated to be highly respectful and mission-aligned ("Eye eye captain!", "Yes Boss Bayu").

2. **2-Step Approval (Hardened):**
   - Introduced a second layer of security for `executeApprovedChange`.
   - The AI will refuse to execute any database update unless the user explicitly provides the confirmation code `AdminBayu2026` in the message history.

3. **Ecosystem Status Intelligence:**
   - Implemented `getSystemStatus` tool.
   - Capability: Reports real-time system health, count of today's visa orders, and scans customer chat logs for sentiment analysis (identifying complaints or technical hurdles).

4. **Visa Data Synchronization:**
   - Established the Admin Dashboard as the absolute source of truth.
   - `VisaDetailPage` now dynamically renders pricing, requirements, and descriptions from the database, overriding static constants.

### Section 12: Verification & Invoice Sync Hardening (Phase 25)
**Date:** March 12, 2026
**Focus:** Admin Verification Control & Payment Flow Automation.

1. **Expanded Application Status:**
   - Invoice Editor now offers 9 lifecycle statuses: `Pending`, `Review by Agent`, `On Going`, `Preparing for submission`, `Submited`, `Approved`, `Active (Complete)`, `Reject`, `Expired`.

2. **Admin Verification Control:**
   - Added Verification Status dropdown to Edit dialog: `VERIFIED (VALID)`, `NOT VERIFIED (REVOKED)`, `PENDING`.
   - Directly connected to the barcode/QR verification system.

3. **Automated Post-Payment Sync:**
   - DOKU webhook now transitions application status to `Review by Agent` on successful payment.
   - Linked Verification record is auto-set to `VALID`.
   - Customer receives payment success email with invoice link.

4. **Consistent Status Recognition:**
   - `OrderPanel`, `InvoiceTab`, and public Invoice page all recognize the new statuses.
   - Prevents double-charging by hiding "Pay Now" for all paid-equivalent statuses.
