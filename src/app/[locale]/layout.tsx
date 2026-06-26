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
import GlobalSchema from "@/components/seo/GlobalSchema";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import { Box } from "@mui/material";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,  // preload WOFF2 in the document head
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
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/Favicon.webp", type: "image/webp", sizes: "512x512" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
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
      <body className={inter.className} suppressHydrationWarning>
        <ThemeRegistry>
          <GoogleTagManagerWrapper gtmId="GTM-N6M9K96X" />
        <GlobalUIProvider>
          <Suspense fallback={null}>
            <GlobalUIOverlay />
          </Suspense>
          <AuthProvider>
            <ApplicationProvider>
              <div className="flex flex-col min-h-screen relative">
                <Header dict={dict} locale={currentLocale} />
                <GlobalInfoPopup locale={currentLocale} />

                {/* v8.39 - Standardized main wrapper to Box for MUI-SSR alignment */}
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
        </ThemeRegistry>
        <GlobalSchema />
      </body>
    </html>
  );
}
