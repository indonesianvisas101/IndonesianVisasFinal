# 🧠 INDONESIAN VISAS: COMPREHENSIVE MASTER INTELLIGENCE REPORT
**Version:** 55.5.0 (GCI Hardened & Global Dominance) | **Date:** April 1, 2026
**Status:** Hardened & Production Ready | **Confidentiality:** Boss Bayu Authorized

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
    - **Email**: Resend (Transactional emails for orders, payments, and receipts) + **Multi-traveler Invoice Splitter**.
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
2. **Step 1 (Visa/Arrival)**: User selects their country (97 eligible) and arrival date. **Strict Tier Selection** is enforced; users cannot proceed without choosing a pricing tier (e.g., Standard vs Express).
3. **Step 2 (Documents & Travelers)**: Secure upload system. For multi-traveler orders, **Individual Email Addresses** are collected for every person to ensure separate legal processing and receipt delivery.
4. **Step 3 (Payment & Splitting)**: 
    - **Logic**: The total order is split into individual `VisaApplication` and `Invoice` records. The total amount is divided equally among travelers.
    - **Midtrans**: Generates a 24-hour Snap Token for IDR payments.
    - **PayPal**: Direct capture integration with auto-invoice generation and **localized redirect support** (maintains `/en`, `/id` paths).
5. **Step 4 (Success & Onboarding)**: Immediate redirection to `/thanks`. An automated "Create Hub Account" suggestion is sent to the user's email to facilitate status tracking.

### 3.2 Tracking and Management
- **Customer Side**: `/check-status` and the private Dashboard allow users to track their application.
- **Admin Side**: `OrderPanel` broadcasts live updates via Supabase Realtime.
- **Automation**: Payment success webhooks (Doku/Midtrans/PayPal) automatically transition orders to `Review by Agent` status.

---

## 🛡️ 4. VERIFICATION & IDiv SYSTEM

The **IDiv Advanced Safety System™** is the crown jewel of platform trust.

### 4.1 The IDiv Card System
- **Modern 3D Card**: A premium UI component (`IDivCardModern.tsx`) showing the issued visa.
- **Layout Standardization**: Locked vertical positions for all data fields (`minHeight`) and truncated Smart IDs (header) ensuring 1:1 visual parity with the "Perfect" sample across all data lengths.
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
- **Invoicing Enhancements**: The Admin Invoicing Tab displays full **Step 1-4 Submission Details**, including passport info, tier selections, and live document links.

### 5.2 Dynamic Reporting Engine
- **API Endpoint**: `/api/admin/reports/dynamic` with `DYNAMIC_REPORT_SECRET` protection.
- **Google Sheets Integration**: A custom Google Apps Script (`indonesianvisas.com Report`) connects the platform database directly to the official spreadsheet for one-click updates.
- **Corporate Transparency**: Reports now include PPH23 tax breakdowns and Gateway-specific itemization.

---

## 🌍 6. PAGE INVENTORY & SITE STRUCTURE

The platform features a massive, SEO-optimized directory structured for visibility and conversion.

### 6.1 Core Landing & Funnels
- `/` — Main Hub
- `/gci` — **GCI Landing Page** (Hardened v55, Instant Page Logic)
- `/services/[id]` — **Dynamic Regional Hubs**. Nationality-specific landing pages for 11 countries (USA, France, China, Mexico, Netherlands, Canada, Poland, Brazil, Singapore, Sweden, Australia) and regional hubs (Bali, Jakarta, Lombok).
- `/apply` — Application Wizard (**Multi-traveler ready**)
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
- `/services/Australia/indonesia-citizenship` — **GCI Australia Hub** (Hardened v55).

---

## 🏵️ 8. GLOBAL CITIZEN OF INDONESIA (GCI) — THE ELITE CLUSTER [v55.5]
Specific ultra-high-net-worth (UHNW) and diaspora pathways integrated with Resend Lead Engine.

| Component | Status | Description |
|---|---|---|
| **Resend Lead Engine** | **Operational** | Dual-notification (Admin + Client) for every inquiry. |
| **GCI Detailed Guide** | **Hardened** | 16-section deep-dive with improved visibility and bug-fixed rendering. |
| **Activity Monitoring** | **Active** | 24h Zero-Activity monitoring with auto-marketing triggers via AI Master. |
| **Australia Pathway** | **Hardened** | Fixed 404 redirections and dedicated Oceania hub. |

---

## 🔒 7. SECURITY & MAINTENANCE REPOSITORY

### 7.1 Database Protections
- **Cursor Rules Lock**: AI agents are strictly forbidden from dropping or destructively seeding primary tables without a `BOSS_PASSPHRASE`.
- **Decimal Precision**: Financial fields use `Decimal(20, 2)` to prevent overflow on high-value IDR corporate orders.
- **Audit Trails**: Every mutation record includes `initiated_by`, `approval_id`, and `snapshot_ref`.

### 7.2 Maintenance Commands
- **Build Verification**: `rm -rf .next && npm run build` (Ensures zero-error production).
- **Sync**: `git commit -m "[Phase Header]: [Summary]"` + `git push origin main`.
- **Infrastructure**: Added Corporate BCA Support (PT Indonesian Visas Agency) with **SWIFT/CENAIDJA** verification.

---
**END OF MASTER INTELLIGENCE REPORT v55.5.0**
*(Maintained by Antigravity AI Master Agent)*
