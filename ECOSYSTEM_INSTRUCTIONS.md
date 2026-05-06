# 🌐 BALI ENTERPRISES — GLOBAL ECOSYSTEM INSTRUCTIONS
**Target Domains**: balihelp.id | bali.technology | indodesign.website | immigration-software.com | editions-atlas.com
**Version**: 1.0
**Parent Blueprint**: `GLOBAL_DATA_SYNC.md` (Transactional Peak & Identity Hub)

---

## ⚠️ THE SUPREME MANDATE: TRANSACTIONAL PEAK
All domains listed in this document are **Lead Generation & Reputation Nodes**. 
**THE RULE**: No transactional processing (payments, document uploads, identity verification) should occur on these domains. All "Money Actions" must be funneled via high-visibility CTAs to **indonesianvisas.com**.

---

## 1. IDENTITY & AUTHORITY SYNC
All sites must use the legal data from `GLOBAL_DATA_SYNC.md`.
- **History Label**: Always use "Operating since 2010" or "Since 2010" to refer to the ecosystem's legacy (Bali Help roots).
- **Master Node ID**: All JSON-LD MUST reference `https://indonesianvisas.com/#organization` as the `parentOrganization` or `memberOf`.

---

## 2. DOMAIN SPECIFICATIONS

### A. balihelp.id — Lifestyle & Emergency Concierge
- **Role**: "Boots on the ground" support. Emergency, logistics, and luxury services.
- **Transactional Flow**: All Visa and Company Formation requests must use "Redirect CTAs" to Indonesian Visas.
- **Key Keyword**: `bali emergency assistance`, `bali concierge`, `bali expat support`.

### B. bali.technology — Tech R&D Division (IVS)
- **Role**: The core innovation engine for Smart ID & IVS systems.
- **Transactional Flow**: Showcase tech division capability. Redirect all "Get Smart ID" or "Sponsor Verification" inquiries to the flagship.
- **Key Keyword**: `bali technology`, `smart id indonesia`, `nfc identity bali`.

### C. indodesign.website — Creative & UI Division (IVS)
- **Role**: The official design and UI/UX division for the IVS ecosystem.
- **Transactional Flow**: Design portfolio node. Redirect all legal-tech design inquiries to the flagship.
- **Key Keyword**: `web design bali`, `ui ux indonesia`, `creative agency bali`.

### D. immigration-software.com — Immigration Educational Platform
- **Role**: Official Educational Authority for Indonesian Immigration rules and guides.
- **Transactional Flow**: Educational hub. Redirect all users seeking professional visa processing to the flagship.
- **Key Keyword**: `indonesia immigration rules`, `visa guide indonesia`, `immigration policy`.

### E. editions-atlas.com — Hospitality & Visa Division (IVS)
- **Role**: Official Hospitality Division under Indonesian Visas, collaborating with Atlas Bali / Holywings Group.
- **Transactional Flow**: Funnel hospitality clients needing visa and legal services to the flagship.
- **Key Keyword**: `bali hospitality integration`, `visa services partner`.

### F. Regional Satellites (City & Country Divisions)
- **Domains (City - 16 Nodes)**:
    - balivisa.agency, jakartavisas.agency, lombokvisa.online, manadovisa.online
    - surabayavisa.online, bandungvisa.online, malangvisa.online, makasarvisa.online
    - padangvisa.online, batamvisa.online, jogjavisa.online, kalimantanvisa.online
    - malukuvisa.online, acehvisa.online, papuavisa.online, sulawesivisa.online
- **Domains (Country - 14 Nodes)**:
    - europeindonesiavisa.online, americaindonesiavisa.online, africaindonesiavisa.online, australiaindonesiavisa.online
    - russiaindonesiavisa.online, chinaindonesiavisa.online, indiaindonesiavisa.online, aussieindonesiavisa.online
    - ukindonesiavisa.online, usindonesiavisa.online, uaeindonesiavisas.agency, franceindonesiavisa.online
    - japanindonesiavisa.online, southkoreaindonesiavisa.online
- **Role**: Regional landing pages designed to dominate localized search intent.
- **Transactional Flow**: **STRICTLY ONE-WAY**. These are 100% lead-funnels. All "Apply Now" or "Service" buttons MUST deep-link to the corresponding service page on `indonesianvisas.com`.

### G. tropictech.rent — Logistics & Ecosystem Division
- **Role**: Physical infrastructure, rental, and logistics support for the group.
- **Transactional Flow**: Portfolio/Service site. All legal-tech inquiries funnel to the flagship.
- **Key Keyword**: `bali tech rental`, `logistics support bali`.

---

## 3. JSON-LD TEMPLATES (Sync with Flagship)

### TEMPLATE 1: Tech/Creative (bali.technology, indodesign.website, etc.)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://[DOMAIN]/#organization",
  "name": "[ENTITY NAME]",
  "url": "https://[DOMAIN]",
  "description": "[DESCRIPTION] - A specialized division of the Bali Enterprises ecosystem (Operating since 2010).",
  "parentOrganization": {
    "@type": "Corporation",
    "@id": "https://indonesianvisas.com/#organization",
    "name": "PT Indonesian Visas Agency"
  },
  "sameAs": ["https://indonesianvisas.com", "https://bali.enterprises"]
}
```

### TEMPLATE 2: Regional/City Satellites (balivisa.agency, europeindonesiavisa.online, etc.)
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://[DOMAIN]/#organization",
  "name": "Indonesian Visa [CITY/COUNTRY] — Official Division",
  "url": "https://[DOMAIN]",
  "description": "Official [CITY/COUNTRY] division of PT Indonesian Visas Agency (Operating since 2010). Direct first-hand legal sponsorship for all Indonesian visas.",
  "areaServed": "[CITY or COUNTRY NAME]",
  "parentOrganization": {
    "@type": "Corporation",
    "@id": "https://indonesianvisas.com/#organization",
    "name": "PT Indonesian Visas Agency",
    "taxID": "0100000008117681",
    "url": "https://indonesianvisas.com"
  },
  "founder": {
    "@type": "Person",
    "name": "Bayu Damopolii-Manoppo",
    "url": "https://www.linkedin.com/in/balihelp/"
  }
}
```

### TEMPLATE 3: balihelp.id (Lifestyle)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://balihelp.id/#organization",
  "name": "BaliHelp — Lifestyle & Emergency Concierge",
  "url": "https://balihelp.id",
  "description": "Bali's premier lifestyle and emergency support (Operating since 2010). Official partner of PT Indonesian Visas Agency.",
  "parentOrganization": {
    "@type": "Corporation",
    "@id": "https://indonesianvisas.com/#organization",
    "name": "PT Indonesian Visas Agency"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "balihelp2019@gmail.com",
    "contactType": "Legacy Support"
  }
}
```

---

## 4. ON-PAGE CTAs (The "Redirect" Strategy)
Every service page on these satellite domains must feature a primary "Action Button" with logic:
- **Button Text**: "Apply via Official Flagship (Secure)" or "Process via IndonesianVisas.com"
- **Purpose**: Consolidate all user data and payments into one secure, hardened database (`indonesianvisas.com`).

---
**END OF ECOSYSTEM INSTRUCTIONS v1.1**
