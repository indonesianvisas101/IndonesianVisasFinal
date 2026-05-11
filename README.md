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
**Version:** 61.2.0 (Step 3 & Quick Apply Hardening)
**Status:** PRODUCTION READY - HARDENED 🛡️
**Engine:** Next.js 16.1.1 (Turbopack) | Prisma v5 | AI Multi-Agent v2.3

---

- **Step 3 Document Hardening**: Added real-time upload indicators, success badges, and state-locked navigation for 100% data integrity.
- **Secure Document Gatekeeper**: Implemented logic locks on visa downloads until mandatory legal agreements are digitally signed.
- **Payment Gateway Hardening**: Synchronized financial calculations and added UI guardrails to prevent payment session resets.
- **Quick Apply UX**: Enhanced the Quick Apply modal with "Succeed ✓" status indicators and mandatory field validation.

## 📦 Build Status
```
Version:  v61.2.0 (Step 3 Hardening)
Date:     May 11, 2026
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
