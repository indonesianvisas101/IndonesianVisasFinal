import React from 'react';
import { Metadata } from 'next';
import SeoPageBuilder from '@/components/seo/SeoPageBuilder';
import { getSeoPageData } from '@/data/seo';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const data = getSeoPageData('business-indonesia/bali-business-setup');
    return {
        title: data.title,
        description: data.description,
        alternates: {
            canonical: data.canonicalUrl || `https://indonesianvisas.com/${params.locale}/business-indonesia/bali-business-setup`,
        },
        openGraph: {
            title: data.title,
            description: data.description,
            url: `https://indonesianvisas.com/${params.locale}/business-indonesia/bali-business-setup`,
            images: data.ogImage ? [{ url: data.ogImage }] : [],
        }
    };
}

export default function Page({ params }: { params: { locale: string } }) {
    const data = getSeoPageData('business-indonesia/bali-business-setup');
    return <SeoPageBuilder pageData={data} />;
}
