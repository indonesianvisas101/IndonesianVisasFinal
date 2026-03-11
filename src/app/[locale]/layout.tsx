
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

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://indonesianvisas.com'),
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
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Indonesian Visas | Your Gateway to Indonesia",
    description: "Expert visa and company formation services in Bali and Indonesia. Get your Tourist, Business, or Retirement visa effortlessly.",
    url: 'https://indonesianvisas.com',
    siteName: 'Indonesian Visas',
    images: [
      {
        url: '/images/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Indonesian Visas Official Agency',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Indonesian Visas | Expert Agency",
    description: "Fast & Reliable Visa Services for Bali & Indonesia. Apply online today.",
    images: ['/images/twitter-image.jpg'],
  },
  icons: {
    icon: '/Favicon.webp',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "GOOGLE_SITE_VERIFICATION_ID_PLACEHOLDER",
  },
};

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
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://flagcdn.com" />
        <link rel="preconnect" href="https://api.doku.com" />
        <link rel="preconnect" href="https://api-sandbox.doku.com" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://flagcdn.com" />
        <link rel="dns-prefetch" href="https://api.resend.com" />
      </head>
      <body className={inter.className} suppressHydrationWarning>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Indonesian Visas",
              "url": "https://indonesianvisas.com",
              "logo": "https://indonesianvisas.com/Favicon.webp",
              "description": "Professional visa services for travelers, businesses, and digital nomads in Indonesia.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Bali",
                "addressCountry": "ID"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "areaServed": "ID",
                "availableLanguage": ["English", "Indonesian"]
              }
            })
          }}
        />
        <AuthProvider>
          <ApplicationProvider>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[1000] focus:bg-white focus:text-primary focus:p-4 focus:rounded-xl focus:shadow-xl focus:font-bold border-2 border-primary">
              Skip to content
            </a>
            <Header dict={dict} locale={currentLocale} />
            <main id="main-content" className="flex-grow min-h-screen">
              {children}
            </main>
            <Footer dict={dict} locale={currentLocale} />
            <ClientLayout />
          </ApplicationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
