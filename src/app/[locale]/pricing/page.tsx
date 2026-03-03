import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import VisaCatalog from "@/components/visa/VisaCatalog";
import { getMessages } from "@/i18n/getMessages";

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = await getMessages(locale);
    const t = dict?.pricing_page || {};

    return (
        <div className="min-h-screen bg-white pt-24 pb-12 dark:bg-slate-900 transition-colors duration-300">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <Link href={`/${locale}`} className="inline-block mb-6">
                        <div className="relative w-48 h-16">
                            <Image
                                src="/Favicon.webp"
                                alt="Indonesian Visas"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black mode-aware-text mb-4 tracking-tighter">
                        {t.hero_title || "Transparent Pricing"}
                    </h1>
                    <p className="text-xl mode-aware-subtext max-w-2xl mx-auto leading-relaxed">
                        {t.hero_description || "We believe in honest, upfront pricing. The fees below include all government charges and our professional service fee."}
                    </p>
                </div>

                {/* Dynamic Pricing Catalog */}
                <div className="max-w-7xl mx-auto">
                    <VisaCatalog />
                </div>

                <div className="mt-16 text-center">
                    <p className="text-lg mode-aware-subtext font-medium">
                        {t.custom_service_text || "Need a custom service?"} {" "}
                        <Link href={`/${locale}/contact`} className="text-primary font-bold hover:underline">
                            {t.custom_service_cta || "Contact our Agency Support"}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
