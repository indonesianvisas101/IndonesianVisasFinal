'use client';

import React from 'react';
import { SeoPageData } from '@/data/seo/types';

export const SchemaGenerator = ({ pageData }: { pageData: SeoPageData }) => {
    const baseUrl = 'https://indonesianvisas.com';
    const url = `${baseUrl}/${pageData.slug}`;

    const schemas = [];

    // Article Schema
    schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: pageData.title,
        description: pageData.description,
        url: url,
        dateModified: pageData.updatedAt,
        author: {
            '@type': 'Organization',
            name: 'IndonesianVisas.com'
        },
        publisher: {
            '@type': 'Organization',
            name: 'IndonesianVisas.com',
            logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/Logo.webp`
            }
        }
    });

    // FAQ Schema
    if (pageData.faqs && pageData.faqs.length > 0) {
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: pageData.faqs.map(faq => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer
                }
            }))
        });
    }

    return (
        <>
            {schemas.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </>
    );
};
