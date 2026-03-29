import React from 'react';
import { Metadata } from 'next';
import HeroCorporate from '@/components/company-profile/HeroCorporate';
import CorporateIdentity from '@/components/company-profile/CorporateIdentity';
import LeadershipProfile from '@/components/company-profile/LeadershipProfile';
import ComplianceGrid from '@/components/company-profile/ComplianceGrid';
import InteractiveTimeline from '@/components/company-profile/InteractiveTimeline';
import SustainabilityImpact from '@/components/company-profile/SustainabilityImpact';
import TestimonialCarousel from '@/components/company-profile/TestimonialCarousel';
import VisualAssets from '@/components/company-profile/VisualAssets';
import CorporateCTA from '@/components/company-profile/CorporateCTA';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const canonical = `https://indonesianvisas.com/${params.locale}/company-profile`;
    const title = "Company Profile | PT Indonesian Visas Agency™";
    const description = "Your trusted legal gateway to Indonesia. We are the certified corporate partner for living, working, and thriving in Indonesia. 16+ years of excellence.";

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            title,
            description,
            url: canonical,
            images: [
                {
                    url: 'https://indonesianvisas.com/Logo.webp',
                    width: 800,
                    height: 600,
                    alt: "PT Indonesian Visas Agency™ Logo"
                }
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['https://indonesianvisas.com/Logo.webp'],
        }
    };
}

export default function CompanyProfilePage() {
    // Generate Organization Schema representing our Corporate identity
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'PT Indonesian Visas Agency™',
        url: 'https://indonesianvisas.com',
        logo: 'https://indonesianvisas.com/Logo.webp',
        foundingDate: '2010',
        founders: [
            {
                '@type': 'Person',
                name: 'Bayu Damopolii - Manoppo'
            }
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+62-857-2704-1992',
            contactType: 'customer service',
            availableLanguage: ['English', 'Indonesian']
        },
        sameAs: [
            'https://www.linkedin.com/in/bayu-damopolii-887ab883/'
        ]
    };

    return (
        <div className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            
            <HeroCorporate />
            <CorporateIdentity />
            <ComplianceGrid />
            <LeadershipProfile />
            <InteractiveTimeline />
            <VisualAssets />
            <SustainabilityImpact />
            <TestimonialCarousel />
            <CorporateCTA />
        </div>
    );
}
