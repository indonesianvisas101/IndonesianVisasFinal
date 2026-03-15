# 🌐 SITE STRUCTURE & PAGE INVENTORY: INDONESIAN VISAS

This document provides a comprehensive map of all routes, funnels, and hubs within the Indonesian Visas platform.

---

## 🏗️ 1. CORE PLATFORM HUB (Root & High-Level)
| Route | Description | Importance |
|---|---|---|
| `/` | **Landing Page** | Primary conversion point, Hero, and Service search. |
| `/about` | **About Us** | Company history, authority, and team overview. |
| `/sitemap` | **Visual Sitemap** | Navigation hub for users and search engine indexing. |
| `/trust` | **Trust Center** | Aggregator for security, process, and methodology. |
| `/contact` | **Contact Hub** | Direct inquiry and support gateway. |

---

## 🛂 2. VISA APPLICATION & SERVICES
Primary funnels for customer acquisition.

| Category | Routes |
|---|---|
| **Direct Funnels** | `/apply`, `/extend`, `/arrival-card`, `/fast-approval` |
| **Service Catalog** | `/services`, `/services/[id]` (Dynamic pages for B1, D12, etc.) |
| **Pricing** | `/pricing`, `/pricing/[id]` |
| **Lifecycle** | `/thanks` (Payment Success), `/invoice/[id]`, `/check-status` (Tracking) |

---

## 📚 3. KNOWLEDGE & SEO HUBS
Massive authority clusters designed for SEO dominance.

### 3.1 Industry & News
- `/indonesia-visa-updates` — Dynamic news and regulation hub (Fact-checked).
- `/visa-knowledge/[slug]` — AI-generated deep dives from the Immigration Analyst.
- `/blog` — Traditional lifestyle and visa guide articles.

### 3.2 Geographic & Category Hubs
- `/travel` & `/travel-indonesia` — Regional entry requirements.
- `/business-indonesia` — Relocation, Investment, and B2B focus.
- `/expat-guides` — Living, Working, and Nomadism in Bali/Indonesia.
- `/visa-guides` — Detailed step-by-step processing walkthroughs.

### 3.3 Rule & Glossary Repositories
- `/immigration-rules` — Regulatory framework details.
- `/immigration-system` — Technical logic of Indonesian immigration.
- `/visa-glossary` — Dictionary of visa terms (VOA, KITAS, B211A explained).
- `/visa-faq` — Categorized help repository.
- `/comparisons` — Head-to-head analysis (e.g., Bali vs. Thailand).

---

## 👤 4. USER GATEWAY & AUTHENTICATION
Secure portal for customer document management.

- `/register` | `/register/verify` — Account creation.
- `/login` — Secure entry.
- `/forgot-password` | `/update-password` — Account recovery.
- `/dashboard` — User control panel (Orders, Profile, Document Vault).
- `/[username]` — (xxxxx) Profile visibility logic.

---

## ⚙️ 5. ADMINISTRATIVE & SECURITY (INTERNAL)
Restricted hubs for platform management.

- `/admin` — The **AI Master Panel** (Boss Command Center).
- `/verify/[slug]` — Public authenticity verification system for issued visas.
- `/verification-explained` — Trust-building page for the verification process.
- `/legal` — Repository for official corporate registry and ahus.

---

## ⚖️ 6. LEGAL & COMPLIANCE PORTAL
- `/terms-and-conditions` — Official TOS.
- `/privacy-policy` — Data protection (GDPR/PDP).
- `/refund` — Financial transparency & refund eligibility.
- `/legal-experts` — Introduction to the corporate legal team.

---

## 🗺️ 7. SPECIALIZED COUNTRY-SPECIFIC HUBS
Targeted landing pages for major expat demographics.
- `/visa-indonesia-for-americans`
- `/visa-indonesia-for-australians`
- `/visa-indonesia-for-chinese`
- `/visa-indonesia-for-indians`
- `/visa-indonesia-for-russians`
- `/visa-indonesia-for-uk-citizens`

---
**Document Status:** Verified Production v3.7.0
*(Reflects 100% of routes in `src/app/[locale]`)*
