# 🧠 INDONESIAN VISAS: COMPREHENSIVE MASTER INTELLIGENCE REPORT
**Version:** 3.8.0 (Regulation & Admin Depth) | **Date:** March 17, 2026
**Status:** Production Optimized | **Confidentiality:** Boss Bayu Authorized

---

## 🏗️ 1. SYSTEM CORE ARCHITECTURE & STACK

The Indonesian Visas platform is built on a high-availability, performance-tuned infrastructure designed for extreme reliability and trust.

### 1.1 Technology Stack
- **Framework**: Next.js 16.1.1 (App Router) using Turbopack for optimized development and builds.
- **Frontend**: 
    - **UI**: Vanilla CSS for core aesthetics + Tailwind CSS for utility + Material UI (MUI) v7 for complex admin components.
    - **Animation**: `Framer Motion` for high-end micro-interactions and 3D effects.
    - **Icons**: `Lucide React` + specialized SVG icons.
- **Backend & Database**:
    - **Platform**: Supabase (PostgreSQL).
    - **ORM**: Prisma v5 (Type-safe schemas).
    - **Storage**: Supabase Storage for customer passports and visa documents.
- **AI Infrastructure**:
    - **Engine**: OpenAI GPT-4o / GPT-4o-mini via Vercel AI SDK.
    - **Agents**: Multi-agent semi-autonomous governance (Master, Worker, Risk, Seller).
- **Services**:
    - **Payments**: Midtrans (Snap IDR) & PayPal (Capture Global).
    - **Email**: Resend (Transactional emails for orders, payments, and receipts).
    - **Analytics**: Google Tag Manager & Custom Server-side Tracking.

### 1.2 Base Build Information
- **Build Mode**: Static Site Generation (SSG) for 2000+ SEO pages + Dynamic SSR for dashboard and admin functions.
- **Middleware**: Custom `middleware.ts` for instantaneous "Fast-Path" TTFB (under 200ms) on public pages.
- **Internationalization**: `next-intl` compatible structure using localized sub-paths (`/en`, `/id`).

---

## ⚖️ 2. AI CONSTITUTION & AGENT GOVERNANCE

The system is governed by a **Semi-Autonomous Multi-Agent Framework** where roles are strictly isolated to prevent security breaches.

### 2.1 The Agent Roles
| Agent | Role | Authority | Requirements |
|---|---|---|---|
| **AI Master** | Strategic COO | Propose changes, analyze metrics, evaluate risks. | `BOSS_PASSPHRASE` to activate. |
| **AI Risk** | Compliance Guard | Scans for anomalies, pricing errors, and legal risks. | Holds Veto power over executions. |
| **AI Worker** | Silent Executor | Performs authenticated database mutations. | Requires `approvalId` + `CONFIRM_CODE`. |
| **AI Seller** | Sales Consultant | Real-time customer support & inquiry handling. | No database mutation authority. |

### 2.2 Critical Security Protocols
- **Passphrase recognition**: `(xxxxx)` activates Boss Mode; `(xxxxx)` confirms execution.
- **Snapshot Requirement**: The AI Worker must take a JSON snapshot of any content *before* updating to allow for 100% rollback accuracy.
- **Legal Strict Mode**: Modifications to `/legal`, `/terms-and-conditions`, and `/privacy-policy` require double-confirmation and mandatory Risk Scan.

---

## 📈 3. HOW IT WORKS: CORE SYSTEM FLOWS

### 3.1 Order & Application Flow
1. **Entry**: User lands on `/` or `/services/[id]` and initiates via the "Hero" or "Select Country" CTA.
2. **Step 1 (Visa/Arrival)**: User selects their country (97 eligible) and arrival date. For specific visas (e.g., D1, D2), **Multi-Price Tier Selection** (1 Year vs 2 Years) is integrated directly.
3. **Step 2 (Documents)**: Secure upload system for passports and required documents.
4. **Step 3 (Payment)**: 
    - **Midtrans**: Generates a 24-hour Snap Token for IDR payments (GoPay, VA, CC).
    - **PayPal**: Direct capture integration with auto-invoice generation and **Status Sync Webhook**.
5. **Step 4 (Success)**: Immediate redirection to `/thanks` with a unique dynamic `invoiceId`.

### 3.2 Tracking and Management
- **Customer Side**: `/check-status` allows users to track their application in real-time using Order ID or Passport Number.
- **Admin Side**: `OrderPanel` broadcasts live updates via Supabase Realtime when new applications are received.
- **Automation**: Payment success webhooks (Doku/Midtrans) automatically transition orders to `Review by Agent` status.

---

## 🛡️ 4. VERIFICATION & IDiv SYSTEM

The **IDiv Advanced Safety System™** is the crown jewel of platform trust.

### 4.1 The IDiv Card System
- **Modern 3D Card**: A premium UI component (`IDivCardModern.tsx`) showing the issued visa.
- **3D Effect**: Users can click to flip the card in a 3D space.
- **Back Side**: Contains the **Smart QR Code** and official security holograms.
- **Smart QR**: When scanned, it redirects the user (or immigration officer) to the official verification page (`/verify/[slug]`).

### 4.2 Verification Logic
- **Status Lifecycle**: 9 distinct stages — `Pending`, `Review by Agent`, `On Going`, `Preparing for Submission`, `Submitted`, `Approved`, `Active (Complete)`, `Reject`, `Expired`.
- **QR Verification**: Every issued IDiv card is pinned to a unique database `Verification` record.
- **Authenticity Check**: The public `/verify` route performs a real-time integrity check, ensuring the visa data hasn't been tampered with.

---

## 📊 5. ADMIN INTELLIGENCE & REPORTING

### 5.1 AI Master Panel
Located at `/admin/ai-master`, this is the command center for Boss Bayu.
- **Approval Queue**: Review proposals from the AI Master (e.g., price updates, new news articles).
- **Management**: Approve/reject AI change requests, view risk logs, toggle system mode.
- **Invoicing Enhancements**: The Admin Invoicing Tab now displays full **Step 1-4 Submission Details**, including selected visa tiers, arrival dates, passport info, and document links.

### 5.2 Dynamic Reporting Engine
- **API Endpoint**: `/api/admin/reports/dynamic` with `DYNAMIC_REPORT_SECRET` protection.
- **Google Sheets Integration**: A custom Google Apps Script (`indonesianvisas.com Report`) connects the platform database directly to the official spreadsheet for one-click updates.
- **Security**: Sensitive data (passwords, encryption keys) are strictly filtered out of report snapshots.

---

## 🌍 6. PAGE INVENTORY & SITE STRUCTURE

The platform features a massive, SEO-optimized directory structured for visibility and conversion.

### 6.1 Core Landing & Funnels
- `/` — Main Hub
- `/apply` — Application Wizard
- `/extend` — Extension Wizard
- `/arrival-card` — Digital Pass
- `/pricing` — Comparison Matrix
- `/pricing/[id]` — Detailed pricing breakdown per visa.

### 6.2 Strategic Hubs
- `/travel-indonesia` — Entry requirements portal.
- `/business-indonesia` — B2B relocation & Investment hub.
- `/expat-guides` — Long-term living & digital nomad guides.
- `/trust` — Trust metrics, methodology, and legal compliance.
- `/services` — All service inventory.

### 6.3 Content & Knowledge Hubs
- `/indonesia-visa-updates` — Dynamic news and regulation hub.
- `/visa-knowledge/[slug]` — Deep-dive authority articles.
- `/blog` — Standard Expat & Visa articles.
- `/visa-faq` — Searchable help-center categorized by visa type.
- `/regulations/*` — Regulation Depth Authority Cluster (4 specialized legal pages).

### 6.4 User & Security Routes
- `/dashboard` — Personal portal for orders/documents.
- `/check-status` — Public tracking interface.
- `/verify/[slug]` — Authenticity verification portal.
- `/invoice/[id]` — Digital invoice generator.
- `/help` — Troubleshooting and safety guides.

---

## 🔒 7. SECURITY & MAINTENANCE REPOSITORY

### 7.1 Database Protections
- **Cursor Rules Lock**: AI agents are strictly forbidden from dropping or destructively seeding primary tables without a `BOSS_PASSPHRASE`.
- **Decimal Precision**: Financial fields use `Decimal(20, 2)` to prevent overflow on high-value IDR corporate orders.
- **Audit Trails**: Every mutation record includes `initiated_by`, `approval_id`, and `snapshot_ref`.

### 7.2 Maintenance Commands
- **Build Verification**: `rm -rf .next && npm run build` (Ensures zero-error production).
- **Sync**: `git commit -m "[Phase Header]: [Summary]"` + `git push origin main`.
- **Secrets**: Masked in documentation.
    - `BOSS_PASSPHRASE`: (xxxxx)
    - `CONFIRM_CODE`: (xxxxx)
    - `PAYPAL_CLIENT_ID`: (xxxxx)
    - `MIDTRANS_SERVER_KEY`: (xxxxx)

---
**END OF MASTER INTELLIGENCE REPORT v3.7.0**
*(Maintained by IndonesianVisas AI Master Agent)*
