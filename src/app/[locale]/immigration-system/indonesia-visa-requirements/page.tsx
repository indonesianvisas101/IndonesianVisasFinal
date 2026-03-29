import React from 'react';
import { Metadata } from 'next';
import SeoPageBuilder from '@/components/seo/SeoPageBuilder';
import { getSeoPageData } from '@/data/seo';
import { generateCanonical } from '@/utils/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const slug = 'immigration-system/indonesia-visa-requirements';
    const data = getSeoPageData(slug);
    const canonicalUrl = generateCanonical(locale, slug);

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
    const data = getSeoPageData('immigration-system/indonesia-visa-requirements');
    return <SeoPageBuilder pageData={data} />;
}
