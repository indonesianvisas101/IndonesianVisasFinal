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
          url: '/og-image.webp',
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
      images: ['/images/twitter-image.jpg'],
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
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.paypal.com" />
        <link rel="dns-prefetch" href="https://checkout.doku.com" />
        <link rel="dns-prefetch" href="https://thvdfcogdxmqipybqzot.supabase.co" />
        
        {/* Extreme Speed Boosts: Preload critical above-the-fold assets */}
        <link rel="preload" as="image" href="/Favicon.webp" fetchPriority="high" type="image/webp" />
        
        <GoogleTagManagerWrapper gtmId={process.env.NEXT_PUBLIC_GTM_ID || 'GTM-PLACEHOLDER'} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Indonesian Visas",
              "url": APP_URL,
              "logo": `${APP_URL}/Favicon.webp`,
              "description": "Professional visa services for travelers, businesses, and digital nomads in Indonesia.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Bali",
                "addressCountry": "ID"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "areaServed": "ID",
                "availableLanguage": ["English", "Indonesian"]
              }
            })
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>

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
                
                {/* 
                  CRITICAL: Main content wrapper. 
                  We use a div + main structure to ensure consistent hydration with complex providers. 
                */}
                <main 
                  id="main-content" 
                  className="flex-grow relative flex flex-col min-h-screen" 
                >
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
