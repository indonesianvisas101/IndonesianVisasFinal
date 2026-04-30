import React from "react";
import dynamic from "next/dynamic";
import HeroClient from "@/components/hero/HeroClient";
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
    title: "Indonesian Visas | Official Direct First-Hand Sponsor & Immigration Hub",
    description: "The Official Direct First-Hand Sponsor for Indonesian Visas since 2010. Strategic legal-tech infrastructure for B1 VOA, C1/C12, D1/D2/D12, and KITAS. Originally Bali Help. 99.9% Success Rate. Zero Intermediaries.",
    keywords: ["indonesia visa", "bali visa agency", "official indonesian visa", "direct visa sponsor", "e-voa indonesia", "kitas bali", "bali help", "bali enterprises group", "smart id bali"],
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
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
    ],
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '200',
      'bestRating': '5',
      'worstRating': '1'
    }
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
        'name': 'Is IndonesianVisas.com a direct sponsor or an intermediary agency?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'We are a First-Hand Direct Legal Sponsor. Unlike many agencies that act as brokers, IndonesianVisas.com (PT Indonesian Visas Agency) provides primary corporate sponsorship, ensuring faster processing, lower costs, and zero intermediaries.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How can I verify the legality of PT Indonesian Visas Agency?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Our legality is fully transparent. You can verify our NIB (0402260034806), AHU (AHU-00065.AH.02.01.TAHUN 2020), and KKPR (04022610215171007) directly on the Indonesian Ministry of Law (AHU) and OSS portals. We provide direct links for public legal audit via Government portals.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What is Smart ID and why do I need it?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Smart ID is our patent-pending digital identity ecosystem (including Sponsor ID, IDiv, and IDg). It features NFC, QR, and Chip technology that allows tourists to verify their sponsorship status online and offline for hotel bookings, rentals, and emergencies without needing to carry their physical passport.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Is IndonesianVisas.com compliant with international data privacy standards?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Absolutely. We implement Global Compliance Standards, including GDPR-aligned privacy protocols and Indonesian Law No. 27/2022. Our platform uses secure 256-bit encryption, local caching for data integrity, and strict cookie policies to protect your sensitive passport and biometric information.'
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
      {/* Hero — Interactive Client Component */}
      <HeroClient 
        dict={dict} 
        title={dict?.hero?.title}
        subtitle={dict?.hero?.subtitle}
        description={dict?.hero?.description}
        steps={dict?.hero?.steps}
        stats={dict?.hero?.stats}
      />

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

