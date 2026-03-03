import React from 'react';
import dynamic from 'next/dynamic';
import { getMessages } from "@/i18n/getMessages";
import SectionWrapper from "@/components/layout/SectionWrapper";

// Lazy Load the interactive parts
const CompanyFormationContent = dynamic(() => import("./CompanyFormationContent"), {
    loading: () => <div className="h-96 flex items-center justify-center">Loading Services...</div>
});

export default async function CompanyFormationPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = await getMessages(locale);
    const t = dict?.company_formation_page || {};

    return (
        <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300">
            {/* Hero */}
            <SectionWrapper id="formation-intro" className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-60" />
                <div className="text-center mb-16 px-4 relative z-10">
                    <span className="inline-block py-1 px-4 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 border border-primary/20 backdrop-blur-sm animate-fade-in-up">
                        {t.hero_badge || "Corporate Services"}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mode-aware-text mb-6 leading-tight tracking-tighter">
                        {t.hero_title || "Company Formation in Indonesia"}
                    </h1>
                    <p className="text-xl mode-aware-subtext max-w-2xl mx-auto leading-relaxed font-medium">
                        {t.hero_description || "Start your business in Bali or anywhere in Indonesia with our comprehensive registration services. From PT PMA to Local PT, we simplify the legalities."}
                    </p>
                </div>
            </SectionWrapper>

            {/* Main Content Component (Client) */}
            <CompanyFormationContent dict={dict} />
        </div>
    );
}
