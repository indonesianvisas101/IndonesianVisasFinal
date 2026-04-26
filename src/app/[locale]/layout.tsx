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
    description: "Secure your Indonesia Visa online. Expert services for Tourist VOA, B211A, KITAS, and Business Visas. Trusted agency in Bali with a 99% approval rate.",
    keywords: [
      "Indonesia Visa", "Bali Visa", "VOA Indonesia", "KITAS Indonesia",
      "Business Visa Indonesia", "Indonesian Visas Agency", "Visa Agent Bali",
      "Company Formation Bali", "Company Registration Indonesia", "PT PMA Bali",
      "Digital Nomad Visa Indonesia", "Retirement Visa Bali"
    ],
    authors: [{ name: "Indonesian Visas Official Team" }],
    creator: "Indonesian Visas",
    publisher: "Indonesian Visas",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...languages,
        'x-default': APP_URL
      }
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: "Indonesian Visas | Your Gateway to Indonesia",
      description: "Expert visa and company formation services in Bali and Indonesia. Get your Tourist, Business, or Retirement visa effortlessly.",
      url: canonicalUrl,
      siteName: 'Indonesian Visas',
      images: [
        {
          url: '/images/BaliHelpCompress.webp',
          width: 1200,
          height: 630,
          alt: 'Indonesian Visas Official Agency',
        },
      ],
      locale: isDefaultLocale ? 'en_US' : `${locale}_${locale.toUpperCase()}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Indonesian Visas | Expert Agency",
      description: "Fast & Reliable Visa Services for Bali & Indonesia. Apply online today.",
      images: ['/images/BaliHelpCompress.webp'],
    },
    icons: {
      icon: [
        { url: '/Favicon.webp', type: 'image/webp' },
      ],
      apple: '/webapp.webp',
    },
    manifest: '/manifest.json',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: "GOOGLE_SITE_VERIFICATION_ID_PLACEHOLDER",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const isValidLocale = locales.includes(locale as any);
  const currentLocale = isValidLocale ? locale : 'en';

  const dict = await getMessages(currentLocale);

  return (
    <html lang={currentLocale}>
      <head>
        {/* ── Critical Connection Hints ── */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://bali.enterprises" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://thvdfcogdxmqipybqzot.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.paypal.com" />
        <link rel="dns-prefetch" href="https://checkout.doku.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://randomuser.me" />
        
        {/* ── LCP / Above-fold critical asset preloads ── */}
        <link rel="preload" as="image" href="/Favicon.webp" fetchPriority="high" type="image/webp" />
        <link rel="preload" as="image" href="/images/BaliHelpCompress.webp" fetchPriority="low" type="image/webp" />
        
        <GoogleTagManagerWrapper gtmId={process.env.NEXT_PUBLIC_GTM_ID || 'GTM-PLACEHOLDER'} />
        <script
          id="indonesianvisas-ldjson"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Corporation",
              "@id": `${APP_URL}/#organization`,
              "name": "PT Indonesian Visas Agency",
              "url": APP_URL,
              "legalName": "PT Indonesian Visas Agency",
              "alternateName": ["IndonesianVisas", "Indonesian Visas Agency", "Bali Help", "BaliHelp"],
              "description": "A Multinational Visa Agency specialized exclusively in Indonesian visa services. Operating as a private agency under PT Bali Enterprises Group. Originally established as Bali Help.",
              "foundingDate": "2014",
              "logo": `${APP_URL}/Favicon.webp`,
              "taxID": "100000008117681",
              "email": "contact@indonesianvisas.agency",
              "telephone": "+62-857-2704-1992",
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
                "https://www.instagram.com/balihelp.id",
                "https://x.com/IndonesianVisas",
                "https://t.me/IndonesianVisas",
                "https://maps.app.goo.gl/p6t9JSd5CGCDf7jZA",
                "https://www.linkedin.com/in/bayu-damopolii-887ab883/",
                "https://www.linkedin.com/in/balihelp/"
              ],
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+62-857-2704-1992",
                  "contactType": "customer service",
                  "contactOption": "TollFree",
                  "areaServed": "ID",
                  "availableLanguage": ["Indonesian", "English"],
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
                    "@type": "Organization", 
                    "name": "PT Indonesian Visas Agency", 
                    "url": "https://indonesianvisas.com",
                    "email": "contact@indonesianvisas.agency",
                    "taxID": "1000000008117681",
                    "identifier": [
                      { "@type": "PropertyValue", "name": "NIB", "value": "0402260034806" },
                      { "@type": "PropertyValue", "name": "AHU", "value": "AHU-00065.AH.02.01.TAHUN 2020" }
                    ],
                    "brand": [
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
              "knowsAbout": [
                "Indonesian Visa Services",
                "e-VoA Indonesia",
                "KITAS Services",
                "Remote Worker Visa",
                "Visa Sponsorship",
                "Company Formation Indonesia",
                "Web Design & Digital Solutions"
              ],
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
                { "@type": "Organization", "name": "Jakarta Visa Division", "url": "https://jakartavisa.agency" },
                { "@type": "Organization", "name": "Lombok Visa Division", "url": "https://lombokvisa.online" },
                { "@type": "Organization", "name": "Surabaya Visa Division", "url": "https://surabayavisa.online" },
                { "@type": "Organization", "name": "Bali Visas Affiliate", "url": "https://balivisas.agency" },
                { "@type": "Organization", "name": "VOA Bali Expert", "url": "https://voabali.com" }
              ]
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
                <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[1000] focus:bg-white focus:text-primary focus:p-4 focus:rounded-xl focus:shadow-xl focus:font-bold border-2 border-primary">
                  Skip to content
                </a>
                
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
