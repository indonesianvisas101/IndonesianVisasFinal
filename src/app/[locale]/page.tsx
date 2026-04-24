import React from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/hero/Hero";
import LazySection from "@/components/layout/LazySection";
import { getMessages } from "@/i18n/getMessages";
import ApplyExtend from "@/components/sections/ApplyExtend";
import type { Metadata } from 'next';

// ISR: Cache the landing page for 1 hour — avoids DB/Supabase hits on every visitor request
// ISR: Cache disabled temporarily to debug hydration/404 issues
// export const revalidate = 3600;

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
  return {
    title: "Indonesian Visas | Fast & Reliable Application Service",
    description: "Apply for your Indonesia Visa online. Tourist VOA, B211A, KITAS and more. Trusted agents with 99% success rate based in Bali.",
    alternates: {
      canonical: locale === 'en' ? 'https://indonesianvisas.com' : `https://indonesianvisas.com/${locale}`,
    },
    openGraph: {
      title: "Indonesian Visas | Fast Office Bali",
      description: "Official Indonesia Visa Agency in Bali. 99.9% Success Rate.",
      images: ['/images/IndonesianVisas/16K.webp'],
    }
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getMessages(locale);

  return (
    <>
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

