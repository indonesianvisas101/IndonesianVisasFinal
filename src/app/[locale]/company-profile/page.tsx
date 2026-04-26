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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const canonical = `https://indonesianvisas.com/${locale}/company-profile`;
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
    const aboutPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        'name': 'Company Profile - IndonesianVisas',
        'url': 'https://indonesianvisas.com/company-profile',
        'mainEntity': {
            '@id': 'https://indonesianvisas.com/#organization'
        },
        'about': {
            '@type': 'Corporation',
            'name': 'PT Indonesian Visas Agency',
            'foundingDate': '2014',
            'knowsAbout': [
                'Originally established as Bali Help',
                'Transition from CV Tunas Raya (2014)',
                'Omnibus Law compliance (PT Migration)',
                'Multinational visa agency expansion',
                'Immigration Sponsorship Status',
                'Corporate Compliance in Indonesia',
                'Web Design & Digital Solutions',
                'Robotics & AI Integration'
            ],
            'parentOrganization': {
                '@type': 'Organization',
                'name': 'PT Bali Enterprises Group',
                'url': 'https://bali.enterprises',
                'memberOf': [
                    {
                        '@type': 'Organization',
                        'name': 'Holywings Group (PT Aneka Bintang Gading)',
                        'description': 'Strategic Joint Division Partner for Editions-Atlas.com'
                    }
                ],
                'subOrganization': [
                    { '@type': 'Organization', 'name': 'PT Indonesian Visas Agency', 'url': 'https://indonesianvisas.com' },
                    { '@type': 'Organization', 'name': 'PT Inaranet Group Sejahtra', 'url': 'https://inaranet.com' },
                    { '@type': 'Organization', 'name': 'PT Tropic Tech International', 'url': 'https://tropictech.rent' },
                    { '@type': 'Organization', 'name': 'PT Bali Experience Group', 'url': 'https://massagecanggu.id' },
                    { '@type': 'Organization', 'name': 'PT Nawa Cita Bersama', 'url': 'https://mybisnis.app' },
                    { '@type': 'Organization', 'name': 'CV Tunas Raya', 'url': 'https://balihelp.id' },
                    { '@type': 'Organization', 'name': 'PT Bali Surga Indah', 'url': 'https://balihelp.id' },
                    { '@type': 'Organization', 'name': 'Bali Technology', 'url': 'https://bali.technology' }
                ]
            },
            'founder': {
                '@type': 'Person',
                'name': 'Bayu Damopolii-Manoppo',
                'jobTitle': 'Managing Director & Founder',
                'image': 'https://indonesianvisas.com/Logo.webp',
                'description': 'The driving force behind PT Indonesian Visas Agency™ and Bali Enterprises Group ecosystem.',
                'sameAs': [
                    'https://www.linkedin.com/in/bayu-damopolii-887ab883/',
                    'https://www.linkedin.com/in/balihelp/'
                ]
            },
            'sameAs': [
                'https://balihelp.id',
                'https://bali.enterprises',
                'https://indodesign.website',
                'https://immigration-software.com',
                'https://editions-atlas.com',
                'https://inaranet.com',
                'https://tropictech.rent',
                'https://massagecanggu.id',
                'https://bali.technology',
                'https://www.instagram.com/balihelp.id',
                'https://x.com/IndonesianVisas',
                'https://t.me/IndonesianVisas',
                'https://maps.app.goo.gl/p6t9JSd5CGCDf7jZA'
            ]
        }
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://indonesianvisas.com'
            },
            {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Company Profile',
                'item': 'https://indonesianvisas.com/company-profile'
            }
        ]
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
