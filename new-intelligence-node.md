# New Intelligence Node

Neural Intelligence Offloaded"Referency Prompt dari Gemini dan Chat GPT : Prompt Ai Chat GPT : Implement structured data (JSON-LD) secara optimal untuk: Canonical domain:" Access Full Intelligence Node (.md)

--- 
Source: Smart Notes Collective

Referency Prompt dari Gemini dan Chat GPT :

Prompt Ai



Chat GPT :


Implement structured data (JSON-LD) secara optimal untuk:





Canonical domain:
https://indonesianvisas.com



Page:
/company-profile

Tujuan:





Meningkatkan AI readability (LLM, crawler)



Menguatkan legal entity trust



Menghindari entity ambiguity



Menjadikan IndonesianVisas sebagai knowledge graph entity



âš™ï¸ IMPLEMENTATION RULES (WAJIB IKUTI)





JSON-LD harus:





Inject ke <head>



Server-side render (SSR)



Tidak duplikat antar halaman



Canonical:





Semua page â†’ canonical ke https://indonesianvisas.com/...



/company-profile â†’ canonical ke dirinya sendiri



Gunakan:





next/head atau metadata API (Next.js App Router)



Jangan inject via client JS



Data harus:





Konsisten dengan UI (Company Profile page)



Tidak ada mismatch



ðŸ§  STRUCTURE YANG HARUS DIBUAT

Gunakan 3 layer schema:





Corporation (MAIN ENTITY)



WebSite



Service



Legal Credentials (identifier + hasCredential)



ðŸ’» CODE IMPLEMENTATION (NEXT.JS â€“ GLOBAL LAYOUT)

/app/layout.tsx



import Script from "next/script";



export default function RootLayout({ children }) {

Â  return (

Â  Â  <html lang="en">

Â  Â  Â  <head>

Â  Â  Â  Â  <Script

Â  Â  Â  Â  Â  id="indonesianvisas-ldjson"

Â  Â  Â  Â  Â  type="application/ld+json"

Â  Â  Â  Â  Â  strategy="beforeInteractive"

Â  Â  Â  Â  Â  dangerouslySetInnerHTML={{

Â  Â  Â  Â  Â  Â  __html: JSON.stringify({

Â  Â  Â  Â  Â  Â  Â  "@context": "https://schema.org",

Â  Â  Â  Â  Â  Â  Â  "@type": "Corporation",

Â  Â  Â  Â  Â  Â  Â  "name": "PT Indonesian Visas Agency",

Â  Â  Â  Â  Â  Â  Â  "alternateName": "IndonesianVisas",

Â  Â  Â  Â  Â  Â  Â  "url": "https://indonesianvisas.com",

Â  Â  Â  Â  Â  Â  Â  "logo": "https://indonesianvisas.com/logo.png",



Â  Â  Â  Â  Â  Â  Â  "foundingDate": "2014",



Â  Â  Â  Â  Â  Â  Â  "description": "Multinational visa agency specializing exclusively in Indonesian visa services with global country-based and city-based domain network.",



Â  Â  Â  Â  Â  Â  Â  "identifier": [

Â  Â  Â  Â  Â  Â  Â  Â  {

Â  Â  Â  Â  Â  Â  Â  Â  Â  "@type": "PropertyValue",

Â  Â  Â  Â  Â  Â  Â  Â  Â  "name": "NIB",

Â  Â  Â  Â  Â  Â  Â  Â  Â  "value": "0402260034806"

Â  Â  Â  Â  Â  Â  Â  Â  },

Â  Â  Â  Â  Â  Â  Â  Â  {

Â  Â  Â  Â  Â  Â  Â  Â  Â  "@type": "PropertyValue",

Â  Â  Â  Â  Â  Â  Â  Â  Â  "name": "NPWP",

Â  Â  Â  Â  Â  Â  Â  Â  Â  "value": "1000000008117681"

Â  Â  Â  Â  Â  Â  Â  Â  },

Â  Â  Â  Â  Â  Â  Â  Â  {

Â  Â  Â  Â  Â  Â  Â  Â  Â  "@type": "PropertyValue",

Â  Â  Â  Â  Â  Â  Â  Â  Â  "name": "AHU",

Â  Â  Â  Â  Â  Â  Â  Â  Â  "value": "AHU-00065.AH.02.01.TAHUN 2020"

Â  Â  Â  Â  Â  Â  Â  Â  }

Â  Â  Â  Â  Â  Â  Â  ],



Â  Â  Â  Â  Â  Â  Â  "hasCredential": [

Â  Â  Â  Â  Â  Â  Â  Â  {

Â  Â  Â  Â  Â  Â  Â  Â  Â  "@type": "EducationalOccupationalCredential",

Â  Â  Â  Â  Â  Â  Â  Â  Â  "name": "Registered Certificate (SKT)",

Â  Â  Â  Â  Â  Â  Â  Â  Â  "identifier": "S-04449/SKT-WP-CT/KPP.1701/2026"

Â  Â  Â  Â  Â  Â  Â  Â  },

Â  Â  Â  Â  Â  Â  Â  Â  {

Â  Â  Â  Â  Â  Â  Â  Â  Â  "@type": "EducationalOccupationalCredential",

Â  Â  Â  Â  Â  Â  Â  Â  Â  "name": "Immigration Sponsor Status",

Â  Â  Â  Â  Â  Â  Â  Â  Â  "description": "Recorded 2010, 2014, 2023, 2024, 2026"

Â  Â  Â  Â  Â  Â  Â  Â  }

Â  Â  Â  Â  Â  Â  Â  ],



Â  Â  Â  Â  Â  Â  Â  "parentOrganization": {

Â  Â  Â  Â  Â  Â  Â  Â  "@type": "Organization",

Â  Â  Â  Â  Â  Â  Â  Â  "name": "PT Bali Enterprises Group",

Â  Â  Â  Â  Â  Â  Â  Â  "url": "https://bali.enterprises"

Â  Â  Â  Â  Â  Â  Â  },



Â  Â  Â  Â  Â  Â  Â  "subOrganization": [

Â  Â  Â  Â  Â  Â  Â  Â  {

Â  Â  Â  Â  Â  Â  Â  Â  Â  "@type": "Organization",

Â  Â  Â  Â  Â  Â  Â  Â  Â  "name": "Bali Visa Division",

Â  Â  Â  Â  Â  Â  Â  Â  Â  "url": "https://balivisa.agency"

Â  Â  Â  Â  Â  Â  Â  Â  },

Â  Â  Â  Â  Â  Â  Â  Â  {

Â  Â  Â  Â  Â  Â  Â  Â  Â  "@type": "Organization",

Â  Â  Â  Â  Â  Â  Â  Â  Â  "name": "Jakarta Visa Division",

Â  Â  Â  Â  Â  Â  Â  Â  Â  "url": "https://jakartavisas.agency"

Â  Â  Â  Â  Â  Â  Â  Â  }

Â  Â  Â  Â  Â  Â  Â  ],



Â  Â  Â  Â  Â  Â  Â  "hasPart": [

Â  Â  Â  Â  Â  Â  Â  Â  {

Â  Â  Â  Â  Â  Â  Â  Â  Â  "@type": "ItemList",

Â  Â  Â  Â  Â  Â  Â  Â  Â  "name": "Country-Based Visa Services",

Â  Â  Â  Â  Â  Â  Â  Â  Â  "itemListElement": [

Â  Â  Â  Â  Â  Â  Â  Â  Â  Â  { "@type": "WebSite", "url": "https://europeindonesiavisa.online" },

Â  Â  Â  Â  Â  Â  Â  Â  Â  Â  { "@type": "WebSite", "url": "https://americaindonesiavisa.online" },

Â  Â  Â  Â  Â  Â  Â  Â  Â  Â  { "@type": "WebSite", "url": "https://africaindonesiavisa.online" },

Â  Â  Â  Â  Â  Â  Â  Â  Â  Â  { "@type": "WebSite", "url": "https://australiaindonesiavisa.online" },

Â  Â  Â  Â  Â  Â  Â  Â  Â  Â  { "@type": "WebSite", "url": "https://russiaindonesiavisa.online" },

Â  Â  Â  Â  Â  Â  Â  Â  Â  Â  { "@type": "WebSite", "url": "https://chinaindonesiavisa.online" },

Â  Â  Â  Â  Â  Â  Â  Â  Â  Â  { "@type": "WebSite", "url": "https://indiaindonesiavisa.online" }

Â  Â  Â  Â  Â  Â  Â  Â  Â  ]

Â  Â  Â  Â  Â  Â  Â  Â  }

Â  Â  Â  Â  Â  Â  Â  ],



Â  Â  Â  Â  Â  Â  Â  "knowsAbout": [

Â  Â  Â  Â  Â  Â  Â  Â  "Indonesia Visa Services",

Â  Â  Â  Â  Â  Â  Â  Â  "KITAS",

Â  Â  Â  Â  Â  Â  Â  Â  "Visa Sponsorship",

Â  Â  Â  Â  Â  Â  Â  Â  "Company Formation Indonesia"

Â  Â  Â  Â  Â  Â  Â  ]

Â  Â  Â  Â  Â  Â  })

Â  Â  Â  Â  Â  }}

Â  Â  Â  Â  />

Â  Â  Â  </head>

Â  Â  Â  <body>{children}</body>

Â  Â  </html>

Â  );

}



ðŸ“„ PAGE LEVEL (COMPANY PROFILE)

/app/company-profile/page.tsx

Tambahkan JSON-LD tambahan khusus history + legal clarity:



import Script from "next/script";



export default function CompanyProfile() {

Â  return (

Â  Â  <>

Â  Â  Â  <Script

Â  Â  Â  Â  id="indovisa-company-profile"

Â  Â  Â  Â  type="application/ld+json"

Â  Â  Â  Â  strategy="afterInteractive"

Â  Â  Â  Â  dangerouslySetInnerHTML={{

Â  Â  Â  Â  Â  __html: JSON.stringify({

Â  Â  Â  Â  Â  Â  "@context": "https://schema.org",

Â  Â  Â  Â  Â  Â  "@type": "AboutPage",

Â  Â  Â  Â  Â  Â  "name": "Company Profile - IndonesianVisas",

Â  Â  Â  Â  Â  Â  "url": "https://indonesianvisas.com/company-profile",



Â  Â  Â  Â  Â  Â  "about": {

Â  Â  Â  Â  Â  Â  Â  "@type": "Corporation",

Â  Â  Â  Â  Â  Â  Â  "name": "PT Indonesian Visas Agency",

Â  Â  Â  Â  Â  Â  Â  "foundingDate": "2014",

Â  Â  Â  Â  Â  Â  Â  "knowsAbout": [

Â  Â  Â  Â  Â  Â  Â  Â  "Originally established as Bali Help",

Â  Â  Â  Â  Â  Â  Â  Â  "Transition from CV Tunas Raya",

Â  Â  Â  Â  Â  Â  Â  Â  "Omnibus Law compliance",

Â  Â  Â  Â  Â  Â  Â  Â  "Expansion to multinational visa agency"

Â  Â  Â  Â  Â  Â  Â  ]

Â  Â  Â  Â  Â  Â  }

Â  Â  Â  Â  Â  })

Â  Â  Â  Â  }}

Â  Â  Â  />

Â  Â  </>

Â  );

}



ðŸ”’ CANONICAL SETUP

Tambahkan di setiap page:



export const metadata = {

Â  alternates: {

Â  Â  canonical: "https://indonesianvisas.com"

Â  }

};



Untuk /company-profile:



export const metadata = {

Â  alternates: {

Â  Â  canonical: "https://indonesianvisas.com/company-profile"

Â  }

};



âœ… VALIDATION CHECKLIST

Setelah implement:





Test di Google Rich Results



Test di Schema Validator



Pastikan tidak duplicate JSON-LD



Pastikan semua URL resolve (tidak 404)



Pastikan data sama dengan UI



ðŸš€ EXPECTED RESULT

Setelah implement ini:





AI memahami:





Legalitas lengkap



Struktur perusahaan



Network global



Website naik dari:





â€œWebsite biasaâ€
â†’ menjadi



â€œTrusted structured entityâ€



âš ï¸ WARNING

Jangan:





Inject JSON-LD di banyak tempat tanpa kontrol



Masukkan semua domain redirect



Mengubah data legal tanpa sinkronisasi UI



---------------



Gemini AI :

Prompt untuk Antigravity

Subject: Implementasi Knowledge Graph JSON-LD & Struktur Metadata untuk indonesianvisas.com

Context: Saya ingin memperkuat profil E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) pada domain utama indonesianvisas.com. Fokus utama adalah membangun identitas sebagai Multinational Private Agency di bawah holding PT Bali Enterprises Group dan menghubungkan seluruh ekosistem satellite domains (Country-based & City-based).

Objective:





Maksimalkan struktur data di halaman utama (/) dan /company-profile.



Pastikan AI dan Crawler mengenali seluruh legalitas (NIB, AHU, NPWP, SKT).



Hubungkan semua sub-organisasi agar domain utama menjadi "Knowledge Hub".

Task: Terapkan kode JSON-LD berikut ke dalam komponen <head> pada Canonical URL https://indonesianvisas.com dan halaman https://indonesianvisas.com/company-profile.

JSON-LD Code to Implement:



{

Â  "@context": "https://schema.org",

Â  "@type": "Organization",

Â  "@id": "https://indonesianvisas.com/#organization",

Â  "name": "PT Indonesian Visas Agency",

Â  "url": "https://indonesianvisas.com",

Â  "legalName": "PT Indonesian Visas Agency",

Â  "alternateName": ["IndonesianVisas", "Indonesian Visas Agency"],

Â  "description": "A Multinational Visa Agency specialized exclusively in Indonesian visa services. Operating as a private agency under PT Bali Enterprises Group with over 100 country-based and city-based divisions.",

Â  "foundingDate": "2014",

Â  "logo": "https://indonesianvisas.com/logo.png",

Â  "taxID": "100000008117681",

Â  "parentOrganization": {

Â  Â  "@type": "Organization",

Â  Â  "name": "PT Bali Enterprises Group",

Â  Â  "url": "https://bali.enterprises"

Â  },

Â  "identifier": [

Â  Â  {

Â  Â  Â  "@type": "PropertyValue",

Â  Â  Â  "name": "NIB (Business Registration)",

Â  Â  Â  "value": "0402260034806"

Â  Â  },

Â  Â  {

Â  Â  Â  "@type": "PropertyValue",

Â  Â  Â  "name": "AHU (Ministry of Law)",

Â  Â  Â  "value": "AHU-00065.AH.02.01.TAHUN 2020"

Â  Â  },

Â  Â  {

Â  Â  Â  "@type": "PropertyValue",

Â  Â  Â  "name": "SKT (Registered Certificate)",

Â  Â  Â  "value": "S-04449/SKT-WP-CT/KPP.1701/2026"

Â  Â  }

Â  ],

Â  "areaServed": ["Worldwide", "Indonesia"],

Â  "knowsAbout": [

Â  Â  "Indonesian Visa Services",

Â  Â  "e-VoA Indonesia",

Â  Â  "KITAS Services",

Â  Â  "Remote Worker Visa",

Â  Â  "Immigration Sponsor Status"

Â  ],

Â  "subOrganization": [

Â  Â  /* Country-Based Divisions */

Â  Â  { "@type": "Organization", "name": "Indonesian Visa Europe", "url": "https://europeindonesiavisa.online" },

Â  Â  { "@type": "Organization", "name": "Indonesian Visa America", "url": "https://americaindonesiavisa.online" },

Â  Â  { "@type": "Organization", "name": "Indonesian Visa Australia", "url": "https://australiaindonesiavisa.online" },

Â  Â  { "@type": "Organization", "name": "Indonesian Visa Russia", "url": "https://russiaindonesiavisa.online" },

Â  Â  { "@type": "Organization", "name": "Indonesian Visa UK", "url": "https://ukindonesiavisa.online" },

Â  Â  { "@type": "Organization", "name": "Indonesian Visa UAE", "url": "https://uaeindonesiavisas.agency" },

Â Â  Â 

Â  Â  /* City-Based Divisions */

Â  Â  { "@type": "Organization", "name": "Bali Visa Division", "url": "https://balivisa.agency" },

Â  Â  { "@type": "Organization", "name": "Jakarta Visa Division", "url": "https://jakartavisas.agency" },

Â  Â  { "@type": "Organization", "name": "Lombok Visa Division", "url": "https://lombokvisa.online" },

Â  Â  { "@type": "Organization", "name": "Surabaya Visa Division", "url": "https://surabayavisa.online" }

Â  ],

Â  "contactPoint": {

Â  Â  "@type": "ContactPoint",

Â  Â  "contactType": "customer support",

Â  Â  "url": "https://indonesianvisas.com/contact-us"

Â  }

}



Additional Instructions for Antigravity:





Canonical Header: Pastikan rel="canonical" mengarah tepat ke https://indonesianvisas.com untuk menghindari duplikasi konten dari domain satellite.



Entity Linking: Di halaman /company-profile, pastikan data legalitas dalam JSON-LD sinkron dengan UI yang ditampilkan di layar (Screenshot Credentials).



Internal Linking: Optimalkan skema subOrganization di atas. Jika ada penambahan domain satellite baru di masa depan, otomatisasi integrasi ke dalam array subOrganization ini.



Sedikit tips tambahan untuk Anda, Boss:

Setelah Antigravity menerapkan ini, Anda bisa mengecek hasilnya di Google Rich Results Test. Jika sudah muncul sebagai "Organization" dengan identitas yang lengkap, maka AI manapun yang melakukan browsing ke situs Anda akan langsung mengenali bahwa Anda adalah "pemain besar" di industri visa Indonesia.


