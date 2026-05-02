import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ApplicationProvider } from "@/components/application/ApplicationContext";
import ClientLayout from "@/components/layout/ClientLayout";
import { AuthProvider } from "@/components/auth/AuthContext";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { getMessages } from "@/i18n/getMessages";
import { locales } from "@/i18n/locales";
import { GlobalUIProvider } from "@/hooks/useGlobalUI";
import GlobalUIOverlay from "@/components/ui/GlobalUIOverlay";
import { Suspense } from "react";
import GoogleTagManagerWrapper from "@/components/common/GoogleTagManagerWrapper";
import GlobalInfoPopup from "@/components/common/GlobalInfoPopup";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

// Centralized Canonical Root
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isDefaultLocale = locale === 'en';

  // Canonical URL strips the /en/ prefix to match Sitemap.xml
  const canonicalUrl = isDefaultLocale ? APP_URL : `${APP_URL}/${locale}`;

  // Build Hreflang alternates for all supported locales
  const languages: Record<string, string> = {};
  locales.forEach(l => {
    languages[l] = l === 'en' ? APP_URL : `${APP_URL}/${l}`;
  });

  return {
    metadataBase: new URL(APP_URL),
    title: {
      default: "Indonesian Visas | Official Visa Agency Bali & Jakarta",
      template: "%s | Indonesian Visas"
    },
    description: "The official first-hand direct legal sponsor for Indonesian visas since 2010. Secure your Indonesia Visa online. Expert services for Tourist VOA, B211A, KITAS, and Business Visas. Trusted agency in Bali with a 99% approval rate.",
    keywords: [
      "Indonesia Visa", "Bali Visa", "VOA Indonesia", "KITAS Indonesia",
      "Business Visa Indonesia", "Indonesian Visas Agency", "Visa Agent Bali",
      "Company Formation Bali", "Company Registration Indonesia", "PT PMA Bali",
      "Digital Nomad Visa Indonesia", "Retirement Visa Bali", "PT Indonesian Visas Agency™ (MYVISA)"
    ],
    authors: [{ name: "Indonesian Visas Official Team" }],
    alternates: {
      canonical: canonicalUrl,
      languages
    },
    openGraph: {
      type: "website",
      siteName: "Indonesian Visas",
      title: "Indonesian Visas | Official Visa Agency",
      description: "Official first-hand sponsor for Indonesian visas since 2010. Expert legal-tech infrastructure for Bali & Jakarta.",
      images: [
        {
          url: `${APP_URL}/OG_IMAGE.webp`,
          width: 1200,
          height: 630,
          alt: "Indonesian Visas Agency"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      site: "@IndonesianVisas",
      title: "Indonesian Visas | Official Visa Agency",
      description: "Official first-hand sponsor for Indonesian visas.",
      images: [`${APP_URL}/OG_IMAGE.webp`]
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    }
  };
}

export const viewport: Viewport = {
  themeColor: "#4B0082",
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getMessages(locale);
  const currentLocale = locale as any;

  return (
    <html lang={currentLocale}>
      <head>
        {/* PERFORMANCE: Resource Hints — parallel DNS + TLS handshake */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://thvdfcogdxmqipybqzot.supabase.co" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://checkout.doku.com" />
        <link rel="dns-prefetch" href="https://www.paypal.com" />
        <GoogleTagManagerWrapper gtmId="GTM-N6M9K96X" />
        {/* PERFORMANCE: WebSite schema for Sitelinks Searchbox */}
        <script
          id="indonesianvisas-website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${APP_URL}/#website`,
              "name": "Indonesian Visas",
              "url": APP_URL,
              "publisher": {
                "@type": "Corporation",
                "@id": `${APP_URL}/#organization`
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${APP_URL}/search?q={search_term}`,
                "query-input": "required name=search_term"
              }
            })
          }}
        />
        <script
          id="indonesianvisas-ldjson"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Corporation",
              "@id": `${APP_URL}/#organization`,
              "name": "PT Indonesian Visas Agency™ (MYVISA)",
              "url": APP_URL,
              "legalName": "PT Indonesian Visas Agency™ (MYVISA)",
              "alternateName": ["MYVISA", "Indonesian Visas", "Indonesian Visas Agency", "Bali Help", "BaliHelp", "BaliVisa Agency", "Jakarta Visas Agency"],
              "description": "A Leading First-Hand Direct Legal Sponsor for Indonesian visas since 2010. Home of Indonesian Visas™ (Trademark Pending) and the patent-pending Smart ID ecosystem. Originally established as Bali Help, providing a multinational legal-tech infrastructure. We maintain extreme transparency with direct links for public legal audit via Government portals (AHU & OSS). Our proprietary Smart ID technology (NFC/QR/CHIP) is a joint innovation with bali.technology and indodesign.website, designed for strategic integration with provincial government systems.",
              "foundingDate": "2010",
              "logo": `${APP_URL}/Favicon.webp`,
              "taxID": "0100000008117681",
              "privacyPolicy": `${APP_URL}/privacy-policy`,
              "email": "contact@indonesianvisas.agency",
              "telephone": "+62-857-2704-1992",
              "knowsAbout": [
                "GDPR", "Data Privacy", "Indonesian Immigration Law",
                "Direct Visa Sponsorship (B1, C1, C12, D1, D2, D12, E33G, E28A)",
                "KBLI 79111 - Travel Agency Services",
                "Global Citizen of Indonesia (GCI) Program",
                "Indonesian Immigration Law",
                "Omnibus Law Compliance",
                "Patent-Pending Digital Identity (NFC/QR/CHIP)",
                "KITAS/KITAP Expert Services",
                "Remote Worker KITAS (E33G) Expert",
                "Investor KITAS (E28A) Compliance",
                "Legal Documentation (KTP, SIM, SKCK)",
                "Company Formation & PT PMA",
                "Public Legal Audit & Government Verification (AHU/OSS)"
              ],
              "publishingPrinciples": "https://indonesianvisas.com/legal-transparency-policy",
              "actionableFeedbackPolicy": "Users are encouraged to verify our corporate legality (PT Indonesian Visas Agency™ / MYVISA) directly via the Indonesian Ministry of Law (AHU) and OSS portals using NIB: 0402260034806.",
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+62-857-2704-1992",
                  "contactType": "Emergency Sponsorship Support",
                  "contactOption": "TollFree",
                  "areaServed": "ID",
                  "availableLanguage": ["Indonesian", "English"],
                  "description": "24/7 Emergency hotline for sponsored clients and local authorities to verify Smart ID / Sponsor ID status.",
                  "url": "https://wa.me/6285727041992"
                },
                {
                  "@type": "ContactPoint",
                  "telephone": "+62-851-1123-7007",
                  "contactType": "technical support",
                  "areaServed": "ID",
                  "availableLanguage": ["Indonesian", "English"],
                  "url": "https://t.me/IndonesianVisas"
                }
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Indonesian Visa & Residency Solutions",
                "itemListElement": [
                  {
                    "@type": "OfferCatalog",
                    "name": "Visit Visas (Short-Stay)",
                    "itemListElement": [
                      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "B1 VOA (Visit Visa) - 30 to 60 Days" } },
                      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "C1 Visit Visa - 60 to 180 Days (Single Entry)" } },
                      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "C1 Business Visa - 60 to 180 Days (Single Entry)" } },
                      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "C12 Pre-Investment Visa - Up to 180 Days" } }
                    ]
                  },
                  {
                    "@type": "OfferCatalog",
                    "name": "Strategic Multiple Entry Visas",
                    "itemListElement": [
                      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "D1 Visit Visa - 1, 2, and 5 Years Validity" } },
                      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "D2 Business Visa - 1, 2, and 5 Years Validity" } },
                      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "D12 Pre-Investment Visa - 1, 2, and 5 Years Validity" } }
                    ]
                  },
                  {
                    "@type": "OfferCatalog",
                    "name": "Residency & KITAS Ecosystem",
                    "itemListElement": [
                      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "E33G Remote Worker KITAS (Digital Nomad) - 1 Year" } },
                      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "E28A Investor KITAS - 1 and 2 Years Validity" } },
                      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Global Citizen of Indonesia (GCI) Strategic Program" } }
                    ]
                  },
                  {
                    "@type": "OfferCatalog",
                    "name": "Smart ID & Digital Identity Ecosystem",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "SoftwareApplication",
                          "name": "Smart ID / Sponsor ID (NFC, QR & CHIP Enabled)",
                          "applicationCategory": "Digital Identity & Security",
                          "operatingSystem": "Web, Android, iOS (via NFC/QR)",
                          "description": "Patent-Pending secure digital identity solution. A joint innovation by Indonesian Visas, bali.technology, and indodesign.website. Designed for verifiable sponsorship and future integration with Bali provincial government systems.",
                          "copyrightHolder": { "@type": "Organization", "name": "PT Indonesian Visas Agency™ (MYVISA)" },
                          "creator": [
                            { "@id": "https://bali.technology" },
                            { "@id": "https://indodesign.website" }
                          ]
                        }
                      },
                      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "IDiv (Verified Digital Visa Identity Platform)" } },
                      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "IDg (Verified Guide & Personal Assistant Identity)" } }
                    ]
                  },
                  {
                    "@type": "OfferCatalog",
                    "name": "State Documentation & Legal Assistance for Foreigners",
                    "itemListElement": [
                      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Family Card (KK) Administration for Foreigners & Mixed Marriage" } },
                      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "ID Card (KTP) for KITAS/KITAP Holders" } },
                      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Indonesian Driving License (SIM) for Expats" } },
                      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Police Record (SKCK) for Legal Clearances" } },
                      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Company Formation (PT PMA) & Legal Business Setup" } }
                    ]
                  }
                ]
              },
              "sameAs": [
                "https://balihelp.id",
                "https://bali.enterprises",
                "https://indodesign.website",
                "https://immigration-software.com",
                "https://editions-atlas.com",
                "https://inaranet.com",
                "https://tropictech.rent",
                "https://massagecanggu.id",
                "https://bali.technology",
                "https://balivisa.agency",
                "https://jakartavisas.agency",
                "https://www.instagram.com/balihelp.id",
                "https://x.com/IndonesianVisas",
                "https://t.me/IndonesianVisas",
                "https://maps.app.goo.gl/p6t9JSd5CGCDf7jZA",
                "https://www.linkedin.com/in/bayu-damopolii-887ab883/",
                "https://www.linkedin.com/in/balihelp/"
              ],
              "hasMap": "https://maps.app.goo.gl/p6t9JSd5CGCDf7jZA",
              "parentOrganization": {
                "@type": "Organization",
                "name": "PT Bali Enterprises Group",
                "url": "https://bali.enterprises",
                "email": "info@bali.enterprises",
                "description": "A diversified holding company governing a multi-sectoral ecosystem of technology, media, immigration law, hospitality, and wellness in Indonesia.",
                "memberOf": [
                  {
                    "@type": "Organization",
                    "name": "Holywings Group (PT Aneka Bintang Gading) Partnership",
                    "url": "https://editions-atlas.com",
                    "email": "contact@editions-atlas.com",
                    "description": "Strategic joint division for hospitality and visa integration services."
                  }
                ],
                "subOrganization": [
                  /* Identity & Legal Division */
                  {
                    "@type": "Corporation",
                    "@id": "https://indonesianvisas.com/#organization",
                    "name": "PT Indonesian Visas Agency™ (MYVISA)",
                    "legalName": "PT Indonesian Visas Agency™ (MYVISA)",
                    "alternateName": ["MYVISA", "Indonesian Visas Agency"],
                    "url": "https://indonesianvisas.com",
                    "email": "contact@indonesianvisas.agency",
                    "taxID": "0100000008117681",
                    "identifier": [
                      { "@type": "PropertyValue", "name": "NIB", "value": "0402260034806" },
                      { "@type": "PropertyValue", "name": "AHU", "value": "AHU-00065.AH.02.01.TAHUN 2020" },
                      { "@type": "PropertyValue", "name": "KKPR", "value": "04022610215171007" },
                      { "@type": "PropertyValue", "name": "KBLI", "value": "79111" }
                    ],
                    "brand": [
                      { "@type": "Brand", "name": "Smart ID", "url": `${APP_URL}/smart-id` },
                      { "@type": "Brand", "name": "GCI Global Citizen of Indonesia", "url": `${APP_URL}/gci` },
                      { "@type": "Brand", "name": "Immigration Software", "url": "https://immigration-software.com" }
                    ]
                  },
                  /* Media & News Division */
                  {
                    "@type": "Organization",
                    "name": "PT Inaranet Group Sejahtra",
                    "url": "https://inaranet.com",
                    "email": "info@newsbali.online",
                    "taxID": "200563955824000",
                    "identifier": [
                      { "@type": "PropertyValue", "name": "NIB", "value": "1005240061962" },
                      { "@type": "PropertyValue", "name": "AHU", "value": "AHU-0032969.AH.01.01.TAHUN 2024" }
                    ],
                    "sameAs": ["https://newsbali.online"]
                  },
                  /* Digital & Tech Division */
                  {
                    "@type": "Organization",
                    "name": "Bali Technology",
                    "url": "https://bali.technology",
                    "description": "Innovation hub focused on robotics, hardware-software integration, and AI solutions."
                  },
                  {
                    "@type": "Organization",
                    "name": "CV Tunas Raya",
                    "url": "https://balihelp.id",
                    "email": "info@balihelp.id",
                    "taxID": "411060296824000",
                    "identifier": [
                      { "@type": "PropertyValue", "name": "NIB", "value": "1260000151246" },
                      { "@type": "PropertyValue", "name": "AHU", "value": "AHU-00558.AH.02.01.TAHUN 2017" }
                    ],
                    "brand": [
                      { "@type": "Brand", "name": "IndoDesignWeb", "url": "https://indodesign.website" },
                      { "@type": "Brand", "name": "Kotabunan Shop", "url": "https://kotabunan.shop" }
                    ]
                  },
                  {
                    "@type": "Organization",
                    "name": "PT Bali Surga Indah",
                    "url": "https://balihelp.id",
                    "email": "info@balihelp.id",
                    "taxID": "20.180.270.9-824.000",
                    "identifier": [
                      { "@type": "PropertyValue", "name": "NIB", "value": "1207250002681" },
                      { "@type": "PropertyValue", "name": "AHU", "value": "AHU-034814.AH.01.30.Tahun 2025" }
                    ]
                  },
                  /* Ecosystem & Logistics Division */
                  {
                    "@type": "Organization",
                    "name": "PT Tropic Tech International",
                    "url": "https://tropictech.rent",
                    "email": "cfo@tropictech.online",
                    "taxID": "287935548901000",
                    "identifier": [
                      { "@type": "PropertyValue", "name": "NIB", "value": "1712240076832" },
                      { "@type": "PropertyValue", "name": "AHU", "value": "AHU-0100025.AH.01.01.TAHUN 2024" }
                    ],
                    "sameAs": ["https://tropictechbali.com", "https://tropictech.online"]
                  },
                  {
                    "@type": "Organization",
                    "name": "PT Nawa Cita Bersama",
                    "url": "https://mybisnis.app",
                    "taxID": "630071611824000",
                    "identifier": [
                      { "@type": "PropertyValue", "name": "NIB", "value": "1101220029136" },
                      { "@type": "PropertyValue", "name": "AHU", "value": "AHU-000640.AH.01.30.TAHUN 2022" }
                    ]
                  },
                  /* Wellness Division */
                  {
                    "@type": "Organization",
                    "name": "PT Bali Experience Group",
                    "url": "https://massagecanggu.id",
                    "email": "ptbaliexperiencegroup@gmail.com",
                    "taxID": "1000000005790315",
                    "identifier": [
                      { "@type": "PropertyValue", "name": "NIB", "value": "2909250131259" },
                      { "@type": "PropertyValue", "name": "AHU", "value": "AHU-0078065.AH.01.01.TAHUN 2025" }
                    ],
                    "sameAs": ["https://jacuzzibali.com", "https://wellnessbali.id"]
                  },
                  /* Smart Ecosystem Division (Digital Products) */
                  {
                    "@type": "Organization",
                    "name": "Smart Ecosystem Division",
                    "url": "https://bali.enterprises/ecosystem",
                    "email": "smart@notes.biz.id",
                    "brand": [
                      { "@type": "Brand", "name": "Smart Notes", "url": "https://notes.biz.id" },
                      { "@type": "Brand", "name": "Smart Convert", "url": "https://convert.biz.id" },
                      { "@type": "Brand", "name": "Smart Editing", "url": "https://editing.biz.id" }
                    ]
                  }
                ]
              },
              "identifier": [
                {
                  "@type": "PropertyValue",
                  "name": "NIB (Business Registration)",
                  "value": "0402260034806"
                },
                {
                  "@type": "PropertyValue",
                  "name": "AHU (Ministry of Law)",
                  "value": "AHU-00065.AH.02.01.TAHUN 2020"
                },
                {
                  "@type": "PropertyValue",
                  "name": "SKT (Registered Certificate)",
                  "value": "S-04449/SKT-WP-CT/KPP.1701/2026"
                }
              ],
              "hasCredential": [
                {
                  "@type": "EducationalOccupationalCredential",
                  "name": "Immigration Sponsor Status",
                  "description": "Recorded 2010, 2014, 2023, 2024, 2026"
                }
              ],
              "areaServed": ["Worldwide", "Indonesia"],
              "subOrganization": [
                /* Digital & Creative Divisions */
                { "@type": "Organization", "name": "IndoDesignWeb", "url": "https://indodesign.website" },
                /* Country-Based Divisions */
                { "@type": "Organization", "name": "Indonesian Visa Europe", "url": "https://europeindonesiavisa.online" },
                { "@type": "Organization", "name": "Indonesian Visa America", "url": "https://americaindonesiavisa.online" },
                { "@type": "Organization", "name": "Indonesian Visa Australia", "url": "https://australiaindonesiavisa.online" },
                { "@type": "Organization", "name": "Indonesian Visa Russia", "url": "https://russiaindonesiavisa.online" },
                { "@type": "Organization", "name": "Indonesian Visa UK", "url": "https://ukindonesiavisa.online" },
                { "@type": "Organization", "name": "Indonesian Visa UAE", "url": "https://uaeindonesiavisas.agency" },
                { "@type": "Organization", "name": "Indonesian Visa China", "url": "https://chinaindonesiavisa.online" },
                { "@type": "Organization", "name": "Indonesian Visa India", "url": "https://indiaindonesiavisa.online" },
                /* City-Based Divisions & Affiliates */
                { "@type": "Organization", "name": "Bali Visa Division", "url": "https://balivisa.agency" },
                { "@type": "Organization", "name": "Jakarta Visa Division", "url": "https://jakartavisas.agency" },
                { "@type": "Organization", "name": "Lombok Visa Division", "url": "https://lombokvisa.online" },
                { "@type": "Organization", "name": "Surabaya Visa Division", "url": "https://surabayavisa.online" }
              ],
              "founder": {
                "@type": "Person",
                "name": "Bayu Damopolii-Manoppo",
                "jobTitle": "Founder & Strategic Director",
                "url": "https://www.linkedin.com/in/balihelp/",
                "sameAs": [
                  "https://www.linkedin.com/in/bayu-damopolii-887ab883/",
                  "https://www.linkedin.com/in/balihelp/",
                  "https://x.com/IndonesianVisas"
                ]
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <GlobalUIProvider>
          <Suspense fallback={null}>
            <GlobalUIOverlay />
          </Suspense>
          <AuthProvider>
            <ApplicationProvider>
              <div className="flex flex-col min-h-screen relative">
                <Header dict={dict} locale={currentLocale} />
                <GlobalInfoPopup locale={currentLocale} />

                <main id="main-content" className="flex-grow relative flex flex-col min-h-screen">
                  {children}
                </main>

                <Footer dict={dict} locale={currentLocale} />
                <ClientLayout />
              </div>
            </ApplicationProvider>
          </AuthProvider>
        </GlobalUIProvider>
      </body>
    </html>
  );
}
