import React from 'react';
import { Metadata } from 'next';
import { Box, Divider } from '@mui/material';
import LegalHeader from '@/components/legal/LegalHeader';
import CorporateRegistryTable from '@/components/legal/CorporateRegistryTable';
import IPDisclaimer from '@/components/legal/IPDisclaimer';
import LegalDirectoryList from '@/components/legal/LegalDirectoryList';
import LegalContactBox from '@/components/legal/LegalContactBox';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Legal & Compliance Portal | Indonesian Visas",
        description: "Official legal registry, corporate compliance details, and mandatory regulatory disclaimers for PT Indonesian Visas Agency™.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/legal`,
        },
        openGraph: {
            title: "Legal & Compliance Portal | Indonesian Visas",
            description: "Official corporate compliance and legal registry of PT Indonesian Visas Agency™.",
            url: `https://indonesianvisas.com/${locale}/legal`,
            type: 'website',
            images: [
                {
                    url: '/Logo.webp',
                    width: 1200,
                    height: 630,
                    alt: 'Indonesian Visas Legal Portal',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: "Legal & Compliance Portal | Indonesian Visas",
            description: "Official corporate compliance and legal registry of PT Indonesian Visas Agency™.",
            images: ['/Logo.webp'],
        }
    };
}

export default function LegalPage() {
    return (
        <Box 
            component="main" 
            sx={{ 
                bgcolor: 'background.default', 
                minHeight: '100vh',
                '& .MuiTypography-root': {
                    fontFamily: 'var(--font-geist-sans), sans-serif',
                }
            }}
        >
            <LegalHeader />
            <Divider variant="middle" sx={{ opacity: 0.1 }} />
            <CorporateRegistryTable />
            <Divider variant="middle" sx={{ opacity: 0.1 }} />
            <IPDisclaimer />
            <Divider variant="middle" sx={{ opacity: 0.1 }} />
            <LegalDirectoryList />
            <Divider variant="middle" sx={{ opacity: 0.1 }} />
            <LegalContactBox />
            
            {/* Structured Data for Search Engines */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Legal & Compliance Portal",
                        "description": "Official legal registry and compliance repository for PT Indonesian Visas Agency™.",
                        "publisher": {
                            "@type": "Organization",
                            "name": "PT Indonesian Visas Agency™",
                            "url": "https://indonesianvisas.com"
                        }
                    })
                }}
            />
        </Box>
    );
}
