# 🇮🇩 PT Indonesian Visas Agency™

Welcome to the official repository of **IndonesianVisas.com** — a premium, AI-orchestrated platform for Indonesian visa and immigration services.

## 🚀 Vision
To provide the most secure, transparent, and aesthetically premium visa processing experience in Indonesia, powered by advanced AI and synchronized real-time data.

## 🧠 System Architecture
- **Framework**: Next.js 16.1.1 (App Router, Turbopack)
- **Database**: Supabase PostgreSQL + Prisma ORM v5
- **UI/UX**: Vanilla CSS + Tailwind CSS + Material UI v7 + Framer Motion
- **Payment**: DOKU (Indonesia) + PayPal (Global) + Midtrans (IDR)
- **AI Orchestration**: Multi-agent system (AI Master, AI Seller, AI Risk, AI Worker) with `BOSS_PASSPHRASE` command logic.
- **Internationalization**: 20 locales (`/en`, `/id`, `/fr`, `/es`, `/de`, `/zh`, `/ja`, `/ko`, `/ar`, `/ru`, `/pt`, `/it`, `/nl`, `/tr`, `/pl`, `/vi`, `/th`, `/ms`, `/hi`, `/uk`)

## 🛡️ Key Features
# Indonesian Visas Intelligence Suite
**Version:** 60.0.0 (SEO Autonomy & Authority Hardening)
**Status:** PRODUCTION READY - HARDENED 🛡️
**Engine:** Next.js 16.1.1 (Turbopack) | Prisma v5 | AI Multi-Agent v2.3

---

- **Bali & Jakarta SEO**: Deployed dedicated landing pages with upgraded JSON-LD (`ProfessionalService` + `FAQPage`) and city-specific AI instruction manuals (`BALI_INSTRUCTION.md`, `JAKARTA_INSTRUCTION.md`).
- **Brand Compliance**: Comprehensive audit and removal of non-compliant "Official" claims. Transitioned to "Verified" and "Direct Sponsor" identity to ensure government compliance.
- **Auth Hardening**: Fixed Google OAuth 404 issue by isolating root-level auth callbacks from localized middleware redirection.
- **ISR Landing Page**: `revalidate=3600` — 1-hour CDN cache, zero DB hits per visitor.
- **LazySection**: All below-fold components loaded on scroll via Intersection Observer.

## 📦 Build Status
```
Version:  v60.0.0 (Authority Hardened + OAuth Fix)
Date:     April 30, 2026
Build:    ✓ Compiled clean | ✓ TypeScript 0 errors | ✓ GDPR Ready
Branch:   main
```

## 🛠️ Development

```bash
# Setup environment
cp .env.example .env.local

# Install dependencies
npm install

# Run development mode
npm run dev

# ALWAYS run before git push (pre-push build verification)
npm run build

# Clear cache if ChunkLoadError occurs
rm -rf .next && npm run build

# Deploy
git add -A && git commit -m "feat: [description] (vX.X.X)" && git push origin main
```

> **⚠️ Rule**: `npm run build` is ALWAYS executed BEFORE `git push`. Successful build = green light to deploy.

## 📜 Documentation
- `MASTER_REPORT.md` — Comprehensive system intelligence report (v57.0.0)
- `ONGOING_UPDATE_REPORT.md` — Full AI constitution, agent governance & historical update logs
- `BALI_INSTRUCTION.md` — SEO dominance blueprint for Bali division
- `JAKARTA_INSTRUCTION.md` — SEO dominance blueprint for Jakarta division
- `GLOBAL_DATA_SYNC.md` — Master ecosystem synchronization blueprint (v4.1)
- `SITE_STRUCTURE.md` — Complete page inventory and routing architecture

---
© 2026 PT Indonesian Visas Agency™. All Rights Reserved.
