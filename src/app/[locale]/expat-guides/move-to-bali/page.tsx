import React from 'react';
import { Metadata } from 'next';
import SeoPageBuilder from '@/components/seo/SeoPageBuilder';
import { getSeoPageData } from '@/data/seo';

// Centralized Canonical Root
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const data = getSeoPageData('expat-guides/move-to-bali');
    const isDefaultLocale = locale === 'en';
    
    // Canonical URL strips /en/ for consistency with Sitemap
    const canonicalUrl = isDefaultLocale 
        ? `${APP_URL}/expat-guides/move-to-bali`
        : `${APP_URL}/${locale}/expat-guides/move-to-bali`;

    return {
        title: data.title,
        description: data.description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: data.title,
            description: data.description,
            url: canonicalUrl,
            images: data.ogImage ? [{ url: data.ogImage }] : [],
        }
    };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const data = getSeoPageData('expat-guides/move-to-bali');
    return <SeoPageBuilder pageData={data} />;
}
