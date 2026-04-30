# 🛡️ BALI ENTERPRISES GROUP — CORPORATE MASTER INTELLIGENCE NODE
**Version**: 4.1 (Brand Compliance Hardened)
**Last Audit**: 2026-04-30
**Canonical Source**: https://indonesianvisas.com (This file lives in the indonesianvisas.com repository)

---

## ⚠️ AI DEVELOPER INSTRUCTIONS (READ THIS FIRST)

**IF YOU ARE AN AI ASSISTANT READING THIS FILE:**

1. **This file is the SINGLE SOURCE OF TRUTH** for all websites in the Bali Enterprises ecosystem.
2. **Every website** in this ecosystem MUST have its JSON-LD structured data synchronized with the templates in Section 6.
3. **You MUST use the exact values** from Section 1 (Legal Identity) — do NOT modify, reformat, or abbreviate any legal data.
4. **The `@id` anchor** `https://indonesianvisas.com/#organization` is the MASTER NODE. All child/division sites must reference this ID in their `parentOrganization` block.
5. **Before making ANY changes**, cross-reference the site you are working on with Section 3 to understand its exact role, scope, and relationship to the parent organization.
6. **After implementing JSON-LD**, validate using https://validator.schema.org/ and https://search.google.com/test/rich-results.

**CRITICAL RULES:**
- NEVER invent or guess legal data (NIB, AHU, NPWP, SKT) — only use values from Section 1.
- NEVER remove `parentOrganization` — it is the Knowledge Graph backbone.
- ALWAYS include `founder` block on primary pages.
- ALWAYS match the `areaServed` to the site's target region from Section 3.
- `taxID` format is RAW 16-digit: `0100000008117681` (no dots, no dashes).

---

## 1. LEGAL IDENTITY MATRIX (THE SOURCE OF TRUTH)

> **USE THESE EXACT VALUES. DO NOT MODIFY.**

| Field | Value | Notes |
| :--- | :--- | :--- |
| **Legal Entity** | PT Indonesian Visas Agency | Primary operating company |
| **NIB** | `0402260034806` | Business Registration Number |
| **AHU** | `AHU-00065.AH.02.01.TAHUN 2020` | Ministry of Law Registration |
| **KKPR** | `04022610215171007` | Land Use Permit |
| **NPWP (taxID)** | `0100000008117681` | 16-digit raw format |
| **NPWP (display)** | `01.000.000.0-811.7681` | Human-readable format |
| **KBLI** | `79111` | Travel Agency / Visa Services |
| **SKT** | `S-04449/SKT-WP-CT/KPP.1701/2026` | Tax Registered Certificate |
| **Address** | Jl. Tibungsari No.11C, Padangsambian Kaja, Denpasar Barat, Bali 80117 | Physical office |
| **Phone** | `+62-857-2704-1992` | Primary contact |
| **Email** | `contact@indonesianvisas.agency` | Business email |
| **Tech Phone** | `+62-851-1123-7007` | Telegram/Tech support |
| **Founded** | `2010` | Company founding year |
| **Brand** | Indonesian Visas™ (Trademark Pending) | |
| **Technology** | Smart ID / Sponsor ID (Patent-Pending) | NFC/QR/CHIP |

### Parent Holding Company
| Field | Value |
| :--- | :--- |
| **Name** | PT Bali Enterprises Group |
| **URL** | https://bali.enterprises |
| **Email** | info@bali.enterprises |
| **KBLI** | 70209 (Management / Holding) |

### Founder (E-E-A-T)
| Field | Value |
| :--- | :--- |
| **Name** | Bayu Damopolii-Manoppo |
| **Title** | Founder & Strategic Director |
| **LinkedIn (Primary)** | https://www.linkedin.com/in/balihelp/ |
| **LinkedIn (Legacy)** | https://www.linkedin.com/in/bayu-damopolii-887ab883/ |

---

## 2. ECOSYSTEM MAP (Domain Cluster)

> **AI: Find the row matching the site you are working on. Use its Role, Region, and Type to select the correct template from Section 6.**

| # | Domain | Role | Target Region | Site Type | JSON-LD Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **indonesianvisas.com** | National Flagship (HQ) | All Indonesia | `flagship` | ✅ COMPLETE |
| 2 | **balivisa.agency** | Bali City Division | Bali | `city-division` | ✅ SYNCED |
| 3 | **jakartavisas.agency** | Jakarta City Division | Jakarta / IKN | `city-division` | ✅ SYNCED |
| 4 | **balihelp.id** | Lifestyle & Emergency Concierge | Bali Local | `lifestyle` | ❌ PENDING |
| 5 | **bali.enterprises** | Strategic Holding & Education | Global | `holding` | ❌ PENDING |
| 6 | **bali.technology** | R&D / Smart ID Innovation | Global | `tech` | ❌ PENDING |
| 7 | **indodesign.website** | Creative & UI/UX Studio | Global | `tech` | ❌ PENDING |
| 8 | **immigration-software.com** | SaaS Immigration Platform | Global | `tech` | ❌ PENDING |
| 9 | **editions-atlas.com** | Hospitality & Visa Integration | Global | `partner` | ❌ PENDING |
| 10 | **europeindonesiavisa.online** | Europe Division | Europe | `country-division` | ❌ PENDING |
| 11 | **americaindonesiavisa.online** | America Division | Americas | `country-division` | ❌ PENDING |
| 12 | **australiaindonesiavisa.online** | Australia Division | Oceania | `country-division` | ❌ PENDING |
| 13 | **russiaindonesiavisa.online** | Russia Division | Russia/CIS | `country-division` | ❌ PENDING |
| 14 | **ukindonesiavisa.online** | UK Division | United Kingdom | `country-division` | ❌ PENDING |
| 15 | **uaeindonesiavisas.agency** | UAE Division | Middle East | `country-division` | ❌ PENDING |
| 16 | **chinaindonesiavisa.online** | China Division | China/ASEAN | `country-division` | ❌ PENDING |
| 17 | **indiaindonesiavisa.online** | India Division | South Asia | `country-division` | ❌ PENDING |
| 18 | **lombokvisa.online** | Lombok Division | Lombok | `city-division` | ❌ PENDING |
| 19 | **surabayavisa.online** | Surabaya Division | Surabaya | `city-division` | ❌ PENDING |

---

## 3. SITE SPECIFICATIONS (Per-Domain Config)

> **AI: Read the specification for the site you are working on. This defines WHAT the site should say and DO.**

### TYPE: `flagship` — indonesianvisas.com
- **Role**: Primary National Immigration & Visa Facilitator.
- **Scope**: National (All regions of Indonesia).
- **Products**: B1, C1, C12, D1, D2, D12, E33G (Remote Worker), E28A (Investor), GCI Program, Smart ID.
- **Authority**: "First-Hand Direct Legal Sponsor — Zero Intermediaries".
- **JSON-LD**: Full Corporation schema with all subOrganizations, OfferCatalog, FAQPage, ProfessionalService, WebSite+SearchAction. Already complete.

### TYPE: `city-division` — balivisa.agency
- **Role**: Official Bali Division of PT Indonesian Visas Agency.
- **Scope**: Bali Local (Uluwatu, Canggu, Ubud, Seminyak, Denpasar, Sanur, Nusa Dua).
- **Core Services**: Tourism visa extensions, Local sponsorship, Smart ID distribution.
- **Important**: All major visa processing redirects to `indonesianvisas.com`.
- **JSON-LD Template**: Use `TEMPLATE A` from Section 6.

### TYPE: `city-division` — jakartavisas.agency
- **Role**: Official Jakarta Division of PT Indonesian Visas Agency.
- **Scope**: Jakarta & Greater Area (South, Central, North, West, East Jakarta, Tangerang, Bekasi, Depok, IKN).
- **Core Services**: Corporate Visas, Investor KITAS (E28A), PT PMA, Executive Identity.
- **Important**: All major visa processing redirects to `indonesianvisas.com`.
- **JSON-LD Template**: Use `TEMPLATE A` from Section 6.

### TYPE: `city-division` — lombokvisa.online, surabayavisa.online
- **Role**: Regional visa division.
- **Important**: Same structure as balivisa/jakarta. Adjust `areaServed` and `name` accordingly.
- **JSON-LD Template**: Use `TEMPLATE A` from Section 6.

### TYPE: `country-division` — europeindonesiavisa.online, americaindonesiavisa.online, etc.
- **Role**: Country/region-specific visa landing page.
- **Scope**: Target country/region specified in Section 2.
- **Core Services**: Offshore visa applications, pre-arrival visa processing.
- **Important**: These sites primarily serve as landing pages. Visa processing redirects to `indonesianvisas.com`.
- **JSON-LD Template**: Use `TEMPLATE B` from Section 6.

### TYPE: `lifestyle` — balihelp.id
- **Role**: "Boots on the Ground" lifestyle & emergency support.
- **Scope**: Bali Local Only.
- **Services**: Emergency (Legal/Police/Medical), Logistics (Airport, Driver), Nomad Hub (Office, E-SIM), Luxury (Massage, Jacuzzi), Pet/Baby services.
- **Important**: Redirects ALL visa requests to `indonesianvisas.com`.
- **JSON-LD Template**: Use `TEMPLATE C` from Section 6.

### TYPE: `holding` — bali.enterprises
- **Role**: Corporate Governance & Investment Education.
- **Scope**: Global Strategic Management.
- **Services**: Company Formation (PT PMA, Yayasan), Investment Planning, Ecosystem Governance.
- **JSON-LD Template**: Use `TEMPLATE D` from Section 6.

### TYPE: `tech` — bali.technology, indodesign.website, immigration-software.com
- **Role**: Technology R&D / Creative / SaaS.
- **Scope**: Global.
- **Identity Link**: Must be listed as `creator`/`developer` in Smart ID schemas.
- **JSON-LD Template**: Use `TEMPLATE E` from Section 6.

### TYPE: `partner` — editions-atlas.com
- **Role**: Strategic hospitality & visa integration partnership.
- **JSON-LD**: Use `TEMPLATE E` but reference `memberOf` instead of `parentOrganization`.

---

## 4. CONTACT MATRIX

| Purpose | Email | Phone | Platform |
| :--- | :--- | :--- | :--- |
| General/Visa | contact@indonesianvisas.agency | +62 857-2704-1992 | WhatsApp |
| Holding | info@bali.enterprises | — | Email |
| Bali Support | info@balihelp.id | +62 857-2704-1992 | WhatsApp |
| Tech Support | — | +62 851-1123-7007 | Telegram |

---

## 5. SOCIAL & VERIFICATION LINKS

> **AI: Include relevant links in `sameAs` arrays based on the site you are working on.**

| Platform | URL |
| :--- | :--- |
| Google Maps | https://maps.app.goo.gl/p6t9JSd5CGCDf7jZA |
| Instagram | https://www.instagram.com/balihelp.id |
| X (Twitter) | https://x.com/IndonesianVisas |
| Telegram | https://t.me/IndonesianVisas |
| LinkedIn (Founder) | https://www.linkedin.com/in/balihelp/ |
| LinkedIn (Legacy) | https://www.linkedin.com/in/bayu-damopolii-887ab883/ |
| CompaniesHouse | https://companieshouse.id/indonesian-visas-agency?ref=search |

---

## 6. JSON-LD TEMPLATES (COPY-PASTE READY)

> **AI: Select the template that matches the `Site Type` from Section 2. Replace all `[PLACEHOLDER]` values. Do NOT modify the structure.**

### TEMPLATE A: City Division (balivisa.agency, jakartavisas.agency, lombokvisa.online, surabayavisa.online)

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://[DOMAIN]/#organization",
  "name": "[CITY] Visa Agency — Official Division of PT Indonesian Visas Agency",
  "url": "https://[DOMAIN]",
  "description": "Official [CITY] division of PT Indonesian Visas Agency. Direct legal sponsor for Indonesian visas — zero intermediaries. Specializing in [LIST 2-3 KEY SERVICES FOR THIS CITY].",
  "telephone": "+62-857-2704-1992",
  "email": "contact@indonesianvisas.agency",
  "areaServed": ["[CITY]", "[SUB-AREA 1]", "[SUB-AREA 2]"],
  "parentOrganization": {
    "@type": "Corporation",
    "@id": "https://indonesianvisas.com/#organization",
    "name": "PT Indonesian Visas Agency",
    "legalName": "PT Indonesian Visas Agency",
    "taxID": "0100000008117681",
    "url": "https://indonesianvisas.com"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jl. Tibungsari No.11C, Padangsambian Kaja",
    "addressLocality": "Denpasar Barat, Denpasar",
    "addressRegion": "Bali",
    "postalCode": "80117",
    "addressCountry": "ID"
  },
  "identifier": [
    { "@type": "PropertyValue", "name": "NIB", "value": "0402260034806" },
    { "@type": "PropertyValue", "name": "AHU", "value": "AHU-00065.AH.02.01.TAHUN 2020" }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "200",
    "bestRating": "5"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "[CITY] Visa Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "[SERVICE 1 — customize for city]" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "[SERVICE 2 — customize for city]" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "[SERVICE 3 — customize for city]" } }
    ]
  },
  "sameAs": [
    "https://indonesianvisas.com",
    "https://maps.app.goo.gl/p6t9JSd5CGCDf7jZA"
  ],
  "founder": {
    "@type": "Person",
    "name": "Bayu Damopolii-Manoppo",
    "jobTitle": "Founder & Strategic Director",
    "url": "https://www.linkedin.com/in/balihelp/",
    "sameAs": ["https://www.linkedin.com/in/bayu-damopolii-887ab883/"]
  }
}
```

**Also add FAQPage schema (REQUIRED for city divisions):**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I get a visa in [CITY]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Write a 2-3 sentence answer mentioning IndonesianVisas.com, the city name, key visa types, and 'direct legal sponsor — zero intermediaries'.]"
      }
    },
    {
      "@type": "Question",
      "name": "What is the best visa for [CITY TARGET AUDIENCE]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Write a 2-3 sentence answer about the most popular visa for this city's demographic.]"
      }
    }
  ]
}
```

### TEMPLATE B: Country Division (europeindonesiavisa.online, etc.)

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://[DOMAIN]/#organization",
  "name": "Indonesian Visa [COUNTRY/REGION] — Official Division of PT Indonesian Visas Agency",
  "url": "https://[DOMAIN]",
  "description": "Apply for Indonesian visas from [COUNTRY/REGION]. Official division of PT Indonesian Visas Agency — direct sponsor, zero intermediaries.",
  "areaServed": "[COUNTRY/REGION]",
  "parentOrganization": {
    "@type": "Corporation",
    "@id": "https://indonesianvisas.com/#organization",
    "name": "PT Indonesian Visas Agency",
    "legalName": "PT Indonesian Visas Agency",
    "taxID": "0100000008117681",
    "url": "https://indonesianvisas.com"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jl. Tibungsari No.11C, Padangsambian Kaja",
    "addressLocality": "Denpasar Barat, Denpasar",
    "addressRegion": "Bali",
    "postalCode": "80117",
    "addressCountry": "ID"
  },
  "sameAs": ["https://indonesianvisas.com"],
  "founder": {
    "@type": "Person",
    "name": "Bayu Damopolii-Manoppo",
    "url": "https://www.linkedin.com/in/balihelp/"
  }
}
```

### TEMPLATE C: Lifestyle Site (balihelp.id)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://balihelp.id/#organization",
  "name": "BaliHelp — Lifestyle & Emergency Concierge",
  "url": "https://balihelp.id",
  "description": "Bali's premier lifestyle support and emergency concierge for expats and tourists. Official partner of PT Indonesian Visas Agency.",
  "telephone": "+62-857-2704-1992",
  "email": "info@balihelp.id",
  "areaServed": "Bali, Indonesia",
  "parentOrganization": {
    "@type": "Corporation",
    "@id": "https://indonesianvisas.com/#organization",
    "name": "PT Indonesian Visas Agency",
    "taxID": "0100000008117681",
    "url": "https://indonesianvisas.com"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jl. Tibungsari No.11C, Padangsambian Kaja",
    "addressLocality": "Denpasar Barat, Denpasar",
    "addressRegion": "Bali",
    "postalCode": "80117",
    "addressCountry": "ID"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Bali Concierge Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Emergency Legal & Police Assistance" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Airport Transfer & Private Driver" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Digital Nomad Hub (Office, E-SIM, Relocation)" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Home Service Massage & Wellness" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pet Relocation & Baby Gear Rental" } }
    ]
  },
  "sameAs": [
    "https://indonesianvisas.com",
    "https://www.instagram.com/balihelp.id",
    "https://maps.app.goo.gl/p6t9JSd5CGCDf7jZA"
  ],
  "founder": {
    "@type": "Person",
    "name": "Bayu Damopolii-Manoppo",
    "jobTitle": "Founder & Strategic Director",
    "url": "https://www.linkedin.com/in/balihelp/",
    "sameAs": ["https://www.linkedin.com/in/bayu-damopolii-887ab883/"]
  }
}
```

### TEMPLATE D: Holding Company (bali.enterprises)

```json
{
  "@context": "https://schema.org",
  "@type": "Corporation",
  "@id": "https://bali.enterprises/#organization",
  "name": "PT Bali Enterprises Group",
  "url": "https://bali.enterprises",
  "email": "info@bali.enterprises",
  "description": "A diversified holding company governing a multi-sectoral ecosystem of technology, media, immigration law, hospitality, and wellness in Indonesia.",
  "subOrganization": [
    { "@type": "Organization", "name": "PT Indonesian Visas Agency", "url": "https://indonesianvisas.com", "@id": "https://indonesianvisas.com/#organization" },
    { "@type": "Organization", "name": "BaliHelp", "url": "https://balihelp.id" },
    { "@type": "Organization", "name": "Bali Technology", "url": "https://bali.technology" },
    { "@type": "Organization", "name": "IndoDesignWeb", "url": "https://indodesign.website" },
    { "@type": "Organization", "name": "Immigration Software", "url": "https://immigration-software.com" }
  ],
  "founder": {
    "@type": "Person",
    "name": "Bayu Damopolii-Manoppo",
    "jobTitle": "Founder & Strategic Director",
    "url": "https://www.linkedin.com/in/balihelp/",
    "sameAs": [
      "https://www.linkedin.com/in/bayu-damopolii-887ab883/",
      "https://www.linkedin.com/in/balihelp/"
    ]
  }
}
```

### TEMPLATE E: Tech/Creative/Partner Sites (bali.technology, indodesign.website, immigration-software.com, editions-atlas.com)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://[DOMAIN]/#organization",
  "name": "[ENTITY NAME]",
  "url": "https://[DOMAIN]",
  "description": "[CUSTOM DESCRIPTION — what this entity does]",
  "parentOrganization": {
    "@type": "Organization",
    "name": "PT Bali Enterprises Group",
    "url": "https://bali.enterprises"
  },
  "memberOf": {
    "@type": "Corporation",
    "@id": "https://indonesianvisas.com/#organization",
    "name": "PT Indonesian Visas Agency"
  },
  "sameAs": ["https://indonesianvisas.com", "https://bali.enterprises"]
}
```

> **Note for editions-atlas.com**: Replace `parentOrganization` with:
> ```json
> "memberOf": {
>   "@type": "Organization",
>   "name": "PT Bali Enterprises Group",
>   "url": "https://bali.enterprises",
>   "description": "Strategic partnership for hospitality and visa integration."
> }
> ```

---

## 7. IMPLEMENTATION CHECKLIST

> **AI: After implementing JSON-LD on any site, verify ALL items below are true.**

- [ ] `parentOrganization.@id` is exactly `https://indonesianvisas.com/#organization`
- [ ] `taxID` is exactly `0100000008117681` (16 digits, no formatting)
- [ ] `NIB` is exactly `0402260034806`
- [ ] `AHU` is exactly `AHU-00065.AH.02.01.TAHUN 2020`
- [ ] `SKT` is exactly `S-04449/SKT-WP-CT/KPP.1701/2026` (note: `CT` not `C/KT`)
- [ ] `founder.name` is exactly `Bayu Damopolii-Manoppo`
- [ ] `founder.url` is `https://www.linkedin.com/in/balihelp/`
- [ ] `address` matches Section 1 exactly
- [ ] `sameAs` includes `https://indonesianvisas.com` (for all division sites)
- [ ] `areaServed` matches the target region from Section 2
- [ ] No duplicate `@id` values on the same page
- [ ] JSON-LD validates at https://validator.schema.org/
- [ ] Rich Results pass at https://search.google.com/test/rich-results
- [ ] After completion, update the `JSON-LD Status` column in Section 2 of THIS file to ✅

---

## 8. KNOWLEDGE GRAPH ARCHITECTURE

```
                    ┌─────────────────────────────┐
                    │   PT Bali Enterprises Group  │
                    │   https://bali.enterprises   │
                    │   @type: Corporation          │
                    └──────────────┬───────────────┘
                                   │ subOrganization
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
    ┌─────┴──────┐          ┌──────┴──────┐          ┌──────┴──────┐
    │ PT IVA     │          │ BaliHelp    │          │ Bali Tech  │
    │ @id: HQ/#  │          │ balihelp.id │          │ bali.tech  │
    │ FLAGSHIP   │          │ LIFESTYLE   │          │ R&D        │
    └──────┬─────┘          └─────────────┘          └────────────┘
           │ subOrganization
    ┌──────┼──────────┬──────────┬──────────┐
    │      │          │          │          │
  Bali   Jakarta   Lombok   Europe    America  ...
  Div    Div       Div      Div       Div
```

**Every child node MUST reference the parent via `parentOrganization.@id`.**

---
**END OF MASTER INTELLIGENCE NODE v4.0**
