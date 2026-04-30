# 🧠 INDONESIAN VISAS: COMPREHENSIVE MASTER INTELLIGENCE REPORT
**Version:** 59.0.0 (Visual Supremacy & Sustainable Hardening) | **Date:** April 30, 2026
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
    - **Payments**: Midtrans (Snap IDR) & PayPal (Capture Global) & DOKU (Indonesia).
    - **Email**: Resend (Transactional emails for orders, payments, and receipts) + **Multi-traveler Invoice Splitter**.
- **Analytics**: Google Tag Manager & Custom Server-side Tracking.

### 1.2 Base Build Information
- **Build Mode**: Static Site Generation (SSG) for 3266 SEO pages + Dynamic SSR for dashboard and admin.
- **ISR**: Landing page `revalidate = 3600` — 1-hour CDN cache, zero Supabase hits per visitor.
- **Middleware**: Custom `proxy.ts` for instantaneous "Fast-Path" TTFB (under 200ms) on public pages.
- **Internationalization**: 20 locales supported (`/en`, `/id`, `/fr`, `/es`, `/de`, `/zh`, `/ja`, `/ko`, `/ar`, `/ru`, `/pt`, `/it`, `/nl`, `/tr`, `/pl`, `/vi`, `/th`, `/ms`, `/hi`, `/uk`).

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
2. **Step 1 (Visa/Arrival)**: User selects their country (97 eligible) and arrival date. **Strict Tier Selection** is enforced.
3. **Step 2 (Documents & Travelers)**: Secure upload system. For multi-traveler orders, Individual Email Addresses are collected.
4. **Step 3 (Payment & Splitting)**: Total order is split into individual `VisaApplication` and `Invoice` records.
    - **DOKU**: Indonesian bank payment gateway (primary).
    - **Midtrans**: IDR Snap Token.
    - **PayPal**: Direct capture integration with auto-invoice generation.
5. **Step 4 (Success & Onboarding)**: Immediate redirection to `/thanks`.
6. **Negotiated Pricing Tier**: Custom "Negotiated" tier for VIP pricing with 2% PPh 23 Tax + 4% Platform Fee auto-calculation.
7. **Calling Visa Logic**: Unified with the standard Negotiated flow — fresh DOKU/PayPal links for every transaction.

### 3.2 Tracking and Management
- **Customer Side**: `/check-status` and the private Dashboard.
- **Admin Side**: `OrderPanel` broadcasts live updates via Supabase Realtime.
- **Automation**: Payment success webhooks (Doku/Midtrans/PayPal) automatically transition orders.

---

***PHASE 102.2 COMPLETE — HARDENED & PRODUCTION READY***

---

***PHASE 103 — SATELLITE ECOSYSTEM & SEO BLITZKRIEG (APRIL 27, 2026)***

#### 🚀 SEO Blitzkrieg (2026-2027 Hubs)
- **Deployment**: Launched 5 massive strategic landing pages targeted at AI Search and Long-tail queries for the next 2-year cycle.
- **Routes**: `/indonesian-visas-in-2026-2027-all-types-and-prices`, `/bali-visas-in-2026-2027-all-types-and-prices`, `/jakarta-visas-in-2026-2027-all-types-and-prices`, `/indonesian-visas-lates-updated`, and `/bali-visas-lates-updated`.
- **Interlinking**: Established a regional hub-and-spoke link matrix between the 5 new nodes to maximize E-E-A-T and PageRank distribution.

#### 🛡️ Admin Dashboard Recovery & Resilience
- **Bypass Logic**: Implemented an "Advanced Bypass" in `error.tsx` allowing Admins to skip the "Optimizing Layout" (WebSocket Blocker) screen via a session flag.
- **Resilience**: Hardened `admin/page.tsx` with try-catch blocks and null-checks on Supabase Realtime listeners, preventing a total page crash if background services are blocked.

#### 🔗 Global Cluster Synchronization (v2.3)
- **Satellite Integration**: Officially registered `balivisa.agency` and `jakartavisas.agency` as official city-based divisions.
- **Data Standardization**: Unified the **NPWP (TaxID)** format to the 16-digit machine-readable string (`1000000008117681`) across both the Master Layout and the Sync Guide.
- **Source of Truth**: Updated `GLOBAL_DATA_SYNC.md` to v2.3 to serve as the unified intelligence node for all AI/Human developers in the ecosystem.

#### 🏗️ Build & Performance
- **Verified Build**: Successfully executed `npm run build` with over 3200+ statically generated routes.
- **Sitemap Update**: Fully integrated new routes into `sitemap.ts` and the visual `/sitemap` portal.

---

***PHASE 103 COMPLETE — HARDENED & PRODUCTION READY***

## 🛡️ 4. SMART ID & VERIFICATION SYSTEM (v57.0)

The **Smart ID Advanced Safety System™** is the crown jewel of platform trust.

### 4.1 The Card System — 3 Variants
| Card Type | Header | ID Label | Usage |
|---|---|---|---|
| **IDIV** | `VISA IDENTITY CARD` | `REG NO` | Standard visa identity |
| **IDG** | `ID GLOBAL` | `REG NO` | Global citizen card |
| **SMART** | `SMART SYSTEM IDENTITY` | `REG NO` | Premium Smart ID |

- **Component**: `IDivCardModern.tsx` — unified premium 3D card renderer.
- **Koom Passport**: Displayed below the holder name on all card types.
- **Consistent spacing**: All fields use normalized `minHeight` for pixel-perfect layout.

### 4.2 Verification Logic — Public Portals
- **`/idiv-search`**: Public search by REG NO, Passport Number, or Name.
- **`/verify/[slug]`**: QR-triggered verification page with full biometric display.

**Data fields displayed:**
- Name, Nationality, DOB (Tempat / Tanggal Lahir), Gender, Occupation
- Passport Number, REG NO, Visa Status
- Full Address (parsed from JSON-packed `address` field)
- **"View Active Visa"** button (dynamic, appears only if `visaActiveUrl` is stored)

### 4.3 Data Architecture
- **JSON-packed `address` field**: Secondary metadata (DOB, Occupation, Gender, visaActiveUrl) is stored as JSON inside the `address` column — no schema migration required.
- **Admin**: Paste `visaActiveUrl` directly into the Verification record via Admin Dashboard.

### 4.4 Check Legality Popup (Hero)
- **Trigger**: "REGISTERED COMPANY" badge in the hero section is clickable.
- **Content**: Full legal grid — Legal Entity, NIB, NPWP, AHU, SKT, Sponsor Status.
- **4 Buttons**: AHU, NIB, Public Listing, Company Profile (all open in new tab).
- **JSON-LD**: `Organization` schema with `taxID`, `identifier` (NIB, AHU, SKT), `sameAs`.
- **Hidden data**: Machine-readable company JSON in hidden DOM element.
- **ESC key**: Closes the popup. Zero new dependencies.

**Legal Data:**
| Field | Value |
|---|---|
| Legal Name | PT Indonesian Visas Agency |
| NIB | 0402260034806 |
| NPWP | 100000008117681 |
| AHU | AHU-00065.AH.02.01.TAHUN 2020 |
| SKT | S-04449/SKT-WP-C/KT/KPP.1701/2026 |
| Sponsor Status | Recorded 2010, 2014, 2023, 2024, 2026 |

---

## ⚡ 5. PERFORMANCE ARCHITECTURE (v57.0)

### 5.1 Landing Page Strategy
- **ISR**: `revalidate = 3600` — Halaman di-serve dari CDN cache 1 jam. Zero DB/Supabase request per visitor.
- **Hero**: Server Component — zero JS blocking for LCP.
- **Below-fold**: All sections wrapped in `LazySection` + `dynamic()` — load on scroll only.
- **Font**: Inter with `display: 'swap'` — no render blocking.

### 5.2 Resource Hints (layout `<head>`)
| Type | Target |
|---|---|
| `preconnect` | GTM, Google Fonts, Gstatic, Supabase |
| `dns-prefetch` | PayPal, DOKU, Unsplash, randomuser.me |
| `preload` | `/Favicon.webp` (fetchPriority: high), `/og-image.webp` |

### 5.3 Image Optimization (next.config.ts)
- **Formats**: `avif`, `webp` (AVIF first for max compression)
- **minimumCacheTTL**: `31536000` — 1 year CDN cache for all optimized images
- **deviceSizes**: `[640, 828, 1080, 1200, 1920]` — tuned to real traffic
- **imageSizes**: `[16, 32, 64, 128, 256]`

### 5.4 Build Optimizations Active
- `optimizeCss: true` (critters CSS inlining)
- `optimizePackageImports`: lucide-react, framer-motion, @mui/material, @mui/icons-material, d3, lodash
- `compress: true` (Gzip)
- `scrollRestoration: true`

---

## 📊 6. ADMIN INTELLIGENCE & REPORTING

### 6.1 AI Master Panel (`/admin/ai-master`)
- **Approval Queue**: Review AI proposals.
- **Management**: Approve/reject changes, risk logs, system mode toggle.
- **Invoicing**: Full Step 1-4 submission details including passport info, tier selections, live document links.

### 6.2 Verification Admin Tab
- Unified verification management with `visaActiveUrl` field for visa document redirection.
- Fields: Holder Name, REG NO, Passport, Visa Type, Status, Address (JSON), visaActiveUrl.

### 6.3 Dynamic Reporting Engine
- **API**: `/api/admin/reports/dynamic` with `DYNAMIC_REPORT_SECRET` protection.
- **Google Sheets Integration**: Custom Apps Script for one-click sync.

---

## 🌍 7. PAGE INVENTORY & SITE STRUCTURE

### 7.1 Core Landing & Funnels
- `/` — Main Hub (ISR cached)
- `/gci` — GCI Landing Page
- `/services/[id]` — Dynamic Regional Hubs (11 countries)
- `/apply`, `/extend`, `/arrival-card`, `/pricing`

### 7.2 Smart ID Portals
- `/smart-id` — Smart ID landing & registration
- `/idiv-search` — Public verification search (REG NO / Passport / Name)
- `/verify/[slug]` — QR-triggered public verification page
- `/idiv-hub/*` — 15+ knowledge pages about the IDIV system

### 7.3 Company Profile
- `/company-profile` — Full corporate profile (SSG, 20 locales)
- `/about` — About page with registration block
- Sections: HeroCorporate, CorporateIdentity, ComplianceGrid, LeadershipProfile, InteractiveTimeline, VisualAssets, SustainabilityImpact, TestimonialCarousel

### 7.4 Content Hubs
- `/indonesia-visa-updates` — Dynamic news hub
- `/visa-knowledge/[slug]`, `/blog`, `/visa-faq`
- `/regulations/*`, `/immigration-system/*`, `/immigration-rules/*`

### 7.5 User Routes
- `/dashboard`, `/check-status`, `/verify/[slug]`, `/invoice/[id]`, `/payment`

---

## 🔒 8. SECURITY & MAINTENANCE

### 8.1 Database Protections
- **CORE DATA IMMUTABILITY**: All Admin Dashboard data (Visa DB, Prices, Verification, Orders, Invoices, Emails) is **Hardened**. AI agents MUST NEVER modify this data.
- **Cursor Rules Lock**: AI agents forbidden from dropping primary tables without `BOSS_PASSPHRASE`.
- **Decimal Precision**: Financial fields use `Decimal(20, 2)`.
- **Audit Trails**: Every mutation includes `initiated_by`, `approval_id`, `snapshot_ref`.

### 8.2 Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Content-Security-Policy: Strict allowlist (self, GTM, PayPal, DOKU, Supabase, Google Analytics)

### 8.3 Maintenance Commands
```bash
# Pre-push build verification (ALWAYS before git push)
npm run build

# Clear cache and rebuild if ChunkLoadError
rm -rf .next && npm run build

# Deploy
git add -A
git commit -m "feat: [description] (vX.X.X)"
git push origin main
```

> **RULE**: `npm run build` is ALWAYS run BEFORE `git push`. A successful build is the green light to push.

---

## 📦 9. LATEST BUILD REPORT

### Build: v57.0.0 — April 26, 2026
```
✓ Compiled successfully in 69s
✓ TypeScript: 0 errors
✓ 3266 static pages generated (SSG)
✓ 20 locales × 163 routes
✓ ISR: Landing page revalidate=3600 activated
```

### Modified Files in This Release
| File | Change |
|---|---|
| `HeroClient.tsx` | Check Legality popup with JSON-LD, legal data grid, ESC handler |
| `IDivCardModern.tsx` | Koom Passport field, spacing normalization |
| `verify/[slug]/page.tsx` | DOB, Occupation, Gender, Visa Active button |
| `idiv-search/SearchClient.tsx` | JSON address parsing, full biometric display |
| `api/verification/route.ts` | visaActiveUrl unpacking from JSON address |
| `ApplicationContext.tsx` | toggleUpsell signature fix (smartId key) |
| `payment/page.tsx` | JSX structure rewrite — clean 3-section layout |
| `company-profile/page.tsx` | Async params fix (Next.js 16 Promise pattern) |
| `SustainabilityImpact.tsx` | CSR images → Unsplash URLs |
| `VisualAssets.tsx` | Removed missing csr-*.webp, added corporate photo |
| `about/page.tsx` | Fixed absolute file path → proper public path |
| `layout.tsx` | Enhanced preconnect/dns-prefetch/preload hints |
| `page.tsx` (home) | ISR `revalidate = 3600` re-enabled |
| `next.config.ts` | `minimumCacheTTL`, `deviceSizes`, `imageSizes` tuned |

### Key Architecture Decisions
- **JSON-packed `address`**: Secondary metadata (DOB, visaActiveUrl) stored as JSON string — zero DB migrations.
- **Check Legality**: Pure React state, zero bundle overhead, lazy DOM injection.
- **npm run build = PRE-PUSH**: Always verify build before deploying.

---

**END OF MASTER INTELLIGENCE REPORT v57.0.0**
*(Maintained by Antigravity AI Master Agent)*
