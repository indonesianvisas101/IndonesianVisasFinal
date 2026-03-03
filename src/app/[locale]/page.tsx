import React from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/hero/Hero";
import LazySection from "@/components/layout/LazySection";

import ApplyExtend from "@/components/sections/ApplyExtend";
import ServicesPreview from "@/components/sections/ServicesPreview";

const ChatBotWrapper = dynamic(() => import("@/components/chat/ChatBotWrapper"));

// Lazy Load Components (Below the fold)
const HowItWorks = dynamic(() => import("@/components/sections/HowItWorks"), {
  loading: () => <div className="h-64 flex items-center justify-center text-gray-400">Loading Steps...</div>
});
const WhyChooseUs = dynamic(() => import("@/components/sections/WhyChooseUs"), {
  loading: () => <div className="h-64 flex items-center justify-center text-gray-400">Loading Features...</div>
});
const AboutPreview = dynamic(() => import("@/components/sections/AboutPreview"), {
  loading: () => <div className="h-64 flex items-center justify-center text-gray-400">Loading About...</div>
});
const SEOAboutExpansion = dynamic(() => import("@/components/sections/SEOAboutExpansion"), {
  loading: () => <div className="h-64 flex items-center justify-center text-gray-400">Loading Agency Info...</div>
});
const FAQPreview = dynamic(() => import("@/components/sections/FAQPreview"), {
  loading: () => <div className="h-64 flex items-center justify-center text-gray-400">Loading FAQ...</div>
});
const ContactSection = dynamic(() => import("@/components/sections/ContactSection"), {
  loading: () => <div className="h-64 flex items-center justify-center text-gray-400">Loading Contact...</div>
});
const GoogleReviews = dynamic(() => import("@/components/sections/GoogleReviews"), {
  loading: () => <div className="h-64 flex items-center justify-center text-gray-400">Loading Reviews...</div>
});

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Indonesian Visas | Fast & Reliable Application Service",
  description: "Apply for your Indonesia Visa online. Tourist VOA, B211A, KITAS and more. Trusted agents with 99% success rate based in Bali.",
  alternates: {
    canonical: 'https://indonesianvisas.com',
  },
};

import { getMessages } from "@/i18n/getMessages";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getMessages(locale);

  return (
    <>
      <Hero dict={dict} />

      {/* Above the fold (mostly) */}
      <ApplyExtend dict={dict} />
      <ServicesPreview dict={dict} />

      {/* Below the fold (Lazy Loaded on Scroll) */}
      <LazySection minHeight="500px">
        <HowItWorks dict={dict} />
      </LazySection>

      <LazySection minHeight="500px">
        <WhyChooseUs dict={dict} />
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

      <ChatBotWrapper />
    </>
  );
}
