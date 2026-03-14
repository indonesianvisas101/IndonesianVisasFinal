import React from 'react';
import { Metadata } from 'next';
import SeoPageBuilder from '@/components/seo/SeoPageBuilder';
import { getSeoPageData } from '@/data/seo';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const data = getSeoPageData('trust/why-choose-us');
    return {
        title: data.title,
        description: data.description,
        alternates: {
            canonical: data.canonicalUrl || `https://indonesianvisas.com/${params.locale}/trust/why-choose-us`,
        },
        openGraph: {
            title: data.title,
            description: data.description,
            url: `https://indonesianvisas.com/${params.locale}/trust/why-choose-us`,
            images: data.ogImage ? [{ url: data.ogImage }] : [],
        }
    };
}

export default function Page({ params }: { params: { locale: string } }) {
    const data = getSeoPageData('trust/why-choose-us');
    return <SeoPageBuilder pageData={data} />;
}
