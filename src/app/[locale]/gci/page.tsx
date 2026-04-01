import { Metadata } from "next";
import GCIContent from "@/components/gci/GCIContent";
import { locales } from "@/i18n/locales";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isDefaultLocale = locale === 'en';
    
    // Canonical URL: English always links to the root domain /gci
    const canonicalUrl = `${APP_URL}/gci`;
    
    // Hreflang alternates
    const languages: Record<string, string> = {};
    locales.forEach(l => {
        languages[l] = l === 'en' ? `${APP_URL}/gci` : `${APP_URL}/${l}/gci`;
    });

    return {
        title: "Global Citizen of Indonesia (GCI) | Lifetime Diaspora Residency",
        description: "The ultimate residency status for Indonesian diaspora. Enjoy unlimited stay, work rights, and property ownership in Indonesia through the GCI program.",
        alternates: {
            canonical: canonicalUrl,
            languages: {
                ...languages,
                'x-default': `${APP_URL}/gci`
            }
        },
        openGraph: {
            title: "GCI: The Lifetime Legacy for Indonesian Diaspora",
            description: "Preserving your blood bonds with Indonesia through the world's most robust residency status.",
            url: canonicalUrl,
            images: ['/images/og/gci-banner.webp']
        }
    };
}

import { getMessages } from "@/i18n/getMessages";

export default async function GCIPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = await getMessages(locale);
    
    return <GCIContent dict={dict} />;
}
