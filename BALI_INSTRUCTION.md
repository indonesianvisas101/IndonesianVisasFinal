# 🏝️ BALI VISA — AI KEYWORD DOMINANCE INSTRUCTION
**Target Site**: https://balivisa.agency
**Version**: 1.0
**Created**: 2026-04-30
**Parent Blueprint**: See `GLOBAL_DATA_SYNC.md` for full ecosystem context.

---

## ⚠️ AI INSTRUCTIONS

**OBJECTIVE**: Make `balivisa.agency` the #1 Google result for:
- `bali visa` / `bali visas`
- `visa bali` / `visa for bali`
- `bali visa 2026` / `bali visa 2027`
- `bali visa price` / `bali visa cost`
- `bali visa extension` / `extend visa bali`
- `bali digital nomad visa` / `bali nomad visa`
- `bali visa on arrival` / `voa bali`

**LEGAL IDENTITY**: This site is operated by **PT Indonesian Visas Agency** (NOT a separate company). All legal data MUST come from `GLOBAL_DATA_SYNC.md` Section 1. Do NOT invent any legal data.

**RELATIONSHIP**: `balivisa.agency` is the **Official Bali Division** of `indonesianvisas.com`. It is NOT an independent entity. All JSON-LD must reflect this via `parentOrganization`.

---

## STEP 1: META TAGS (Priority: CRITICAL)

Every page on `balivisa.agency` must have keyword-optimized meta tags. The homepage is the most important.

### Homepage Meta Tags
```html
<title>Bali Visa 2026-2027 | Bali Visa Agency of PT Indonesian Visas Agency — Direct Sponsor</title>
<meta name="description" content="Apply for your Bali visa online. Official Bali division of PT Indonesian Visas Agency. B1 VOA extension, C1 tourist visa, E33G digital nomad KITAS, investor KITAS. First-hand direct legal sponsor based in Bali." />
<meta name="keywords" content="bali visa, bali visas, visa bali, bali visa 2026, bali visa price, bali visa extension, bali nomad visa, bali visa on arrival, voa bali, bali visa cost, bali visa agency, bali visa sponsor" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<link rel="canonical" href="https://balivisa.agency/" />
```

---

## STEP 2: H1 TAGS (Priority: CRITICAL)

Every page MUST have exactly ONE `<h1>` tag containing the primary keyword.

| Page | H1 Tag |
| :--- | :--- |
| Homepage | `Bali Visa — Bali Division of PT Indonesian Visas Agency` |
| VOA | `Bali Visa on Arrival (VOA) — Extension & Requirements 2026` |
| Tourist | `Bali Tourist Visa — C1 Visit Visa 60-180 Days` |
| Nomad | `Bali Digital Nomad Visa — E33G Remote Worker KITAS` |

---

## STEP 3: JSON-LD STRUCTURED DATA (Priority: CRITICAL)

### 3A. Homepage — ProfessionalService

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://balivisa.agency/#organization",
  "name": "Bali Visa Agency — Official Division of PT Indonesian Visas Agency",
  "url": "https://balivisa.agency",
  "description": "The trusted Bali visa agency of PT Indonesian Visas Agency. First-hand direct legal sponsor for all types of Bali visas: B1 VOA, C1 tourist visa, E33G digital nomad KITAS, E28A investor KITAS. Based in Denpasar, Bali — zero intermediaries.",
  "telephone": "+62-857-2704-1992",
  "email": "contact@indonesianvisas.agency",
  "areaServed": ["Bali", "Denpasar", "Kuta", "Seminyak", "Canggu", "Ubud", "Uluwatu", "Sanur", "Nusa Dua"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jl. Tibungsari No.11C, Padangsambian Kaja",
    "addressLocality": "Denpasar Barat, Denpasar",
    "addressRegion": "Bali",
    "postalCode": "80117",
    "addressCountry": "ID"
  },
  "parentOrganization": {
    "@type": "Corporation",
    "@id": "https://indonesianvisas.com/#organization",
    "name": "PT Indonesian Visas Agency",
    "taxID": "0100000008117681",
    "url": "https://indonesianvisas.com"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "200",
    "bestRating": "5"
  }
}
```

### 3B. Homepage — FAQPage

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I get a visa for Bali?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can get a Bali visa through BaliVisa.Agency, the official Bali division of PT Indonesian Visas Agency. Options include Visa on Arrival (30-60 days), C1 Tourist Visa (60-180 days), and E33G Digital Nomad KITAS (1 year)."
      }
    },
    {
      "@type": "Question",
      "name": "How much does a Bali visa cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bali visa costs vary by type: Visa on Arrival (VOA) is IDR 500,000 for 30 days, C1 Tourist Visa starts from IDR 3,500,000, and E33G Digital Nomad KITAS starts from IDR 15,000,000 for 1 year."
      }
    }
  ]
}
```

---

## STEP 4: ON-PAGE CONTENT STRATEGY

- **Keyword Density**: Ensure `bali visa` appears naturally 8-12x on the homepage.
- **Internal Linking**: Link to `https://indonesianvisas.com` as the "Parent HQ".
- **Footer**: Must include "Official Bali Division of PT Indonesian Visas Agency" and legal NIB/AHU.

---
**END OF BALI INSTRUCTION v1.0**
