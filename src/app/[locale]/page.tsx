import React from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/hero/Hero";
import LazySection from "@/components/layout/LazySection";
import { getMessages } from "@/i18n/getMessages";
import ApplyExtend from "@/components/sections/ApplyExtend";
import type { Metadata } from 'next';

// ISR: Cache the landing page for 1 hour — avoids DB/Supabase hits on every visitor
export const revalidate = 3600;


// Lazy load all below-fold components
// Note: ssr: false is not allowed in Server Components, so we rely on LazySection 
// (a Client Component) to prevent these from rendering during initial SSR.
const ServicesPreview = dynamic(() => import("@/components/sections/ServicesPreview"), {
  loading: () => <div className="h-64" aria-hidden />,
});
const GCIWrapper = dynamic(() => import("@/components/sections/GCIWrapper"), {
  loading: () => <div className="h-64" aria-hidden />,
});
const HowItWorks = dynamic(() => import("@/components/sections/HowItWorks"), {
  loading: () => <div className="h-64" aria-hidden />,
});
const FunnelStatus = dynamic(() => import("@/components/sections/FunnelStatus"), {
  loading: () => <div className="h-64" aria-hidden />,
});
const WhyChooseUs = dynamic(() => import("@/components/sections/WhyChooseUs"), {
  loading: () => <div className="h-64" aria-hidden />,
});
const AboutPreview = dynamic(() => import("@/components/sections/AboutPreview"), {
  loading: () => <div className="h-64" aria-hidden />,
});
const SEOAboutExpansion = dynamic(() => import("@/components/sections/SEOAboutExpansion"), {
  loading: () => <div className="h-64" aria-hidden />,
});
const FAQPreview = dynamic(() => import("@/components/sections/FAQPreview"), {
  loading: () => <div className="h-64" aria-hidden />,
});
const ContactSection = dynamic(() => import("@/components/sections/ContactSection"), {
  loading: () => <div className="h-64" aria-hidden />,
});
const GoogleReviews = dynamic(() => import("@/components/sections/GoogleReviews"), {
  loading: () => <div className="h-64" aria-hidden />,
});
const SafetyGuard = dynamic(() => import("@/components/sections/SafetyGuard"), {
  loading: () => <div className="h-64" aria-hidden />,
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
  
  return {
    title: "Indonesian Visas | Official Multinational Agency & Immigration Hub",
    description: "Official Indonesia Visa Agency operated by PT Indonesian Visas Agency. Strategic immigration infrastructure for E-VOA, B211A, and KITAS. Omnibus Law compliant service with 99.9% success rate.",
    keywords: ["indonesia visa", "bali visa agency", "official indonesian visa", "e-voa indonesia", "kitas bali", "bali help", "bali enterprises group"],
    alternates: {
      canonical: locale === 'en' ? APP_URL : `${APP_URL}/${locale}`,
    },
    openGraph: {
      title: "Indonesian Visas | Multinational Agency Bali",
      description: "Official Indonesia Visa Intelligence Hub. Secure your E-VOA, B211A, and KITAS with Bali's most trusted legal agency.",
      url: APP_URL,
      siteName: "Indonesian Visas",
      images: [
        {
          url: '/images/BaliHelpCompress.webp',
          width: 1200,
          height: 630,
          alt: "Indonesian Visas Official Banner"
        }
      ],
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Indonesian Visas | Official Agency",
      description: "Official Indonesia Visa Agency. 99.9% Success Rate. Secure your visa online.",
      images: ['/images/BaliHelpCompress.webp'],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    }
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getMessages(locale);
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': 'PT Indonesian Visas Agency (Bali Help)',
    'image': `${APP_URL}/Logo.webp`,
    'url': APP_URL,
    'telephone': '+62-857-2704-1992',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Jl. Tibungsari No.11C, Padangsambian Kaja',
      'addressLocality': 'Denpasar Barat, Denpasar',
      'addressRegion': 'Bali',
      'postalCode': '80117',
      'addressCountry': 'ID'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': -8.6441,
      'longitude': 115.1789
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
      ],
      'opens': '09:00',
      'closes': '17:00'
    },
    'sameAs': [
      'https://maps.app.goo.gl/p6t9JSd5CGCDf7jZA',
      'https://www.instagram.com/balihelp.id'
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Can I apply for an Indonesia visa online?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, through IndonesianVisas.com you can apply for various Indonesia visas online, including E-VOA, B211A, and KITAS, with 24/7 assistance.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Is IndonesianVisas.com an official legal agency?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, IndonesianVisas.com is operated by PT Indonesian Visas Agency (NIB: 0402260034806), a legally registered multinational visa agency based in Bali.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Where is your physical office located?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Our main office is located at Jl. Tibungsari No.11C, Padangsambian Kaja, Denpasar Barat, Bali 80117, Indonesia.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How long does the Indonesia visa process take?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'The processing time varies: E-VOA can be instant, while the B211A Business/Tourism visa typically takes 3-5 working days depending on the chosen tier (Standard/Priority).'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Hero — critical, server-rendered immediately */}
      <Hero dict={dict} />

      {/* Just below hero — minimal delay */}
      <ApplyExtend dict={dict} />

      <LazySection minHeight="600px" rootMargin="200px">
        <ServicesPreview dict={dict} />
      </LazySection>

      <LazySection minHeight="500px" rootMargin="150px">
        <GCIWrapper dict={dict} />
      </LazySection>

      {/* Well below the fold — load on scroll approach */}
      <LazySection minHeight="500px">
        <HowItWorks dict={dict} />
      </LazySection>

      <LazySection minHeight="400px">
        <FunnelStatus dict={dict} />
      </LazySection>

      <LazySection minHeight="500px">
        <WhyChooseUs dict={dict} />
      </LazySection>

      <LazySection minHeight="500px">
        <SafetyGuard dict={dict} />
      </LazySection>

      <LazySection minHeight="400px">
        <AboutPreview dict={dict} />
      </LazySection>

      <LazySection minHeight="300px">
        <SEOAboutExpansion dict={dict} />
      </LazySection>

      <LazySection minHeight="400px">
        <FAQPreview dict={dict} />
      </LazySection>

      <LazySection minHeight="500px">
        <section className="py-20 bg-slate-50 dark:bg-white/5">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-black mode-aware-text">What Our Clients Say</h2>
              <p className="text-lg mode-aware-subtext">Real reviews from Google Maps</p>
            </div>
            <GoogleReviews dict={dict} />
          </div>
        </section>
      </LazySection>

      <LazySection minHeight="300px">
        <ContactSection dict={dict} />
      </LazySection>
    </>
  );
}

