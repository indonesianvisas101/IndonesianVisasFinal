'use client';

import React from 'react';
import { SeoPageData, SeoSection } from '@/data/seo/types';
import { Box } from '@mui/material';
import { HeroSection, ContentSection, FaqSection, FeaturesSection, ProcessSection, CtaSection } from './sections';
import { SchemaGenerator } from './SchemaGenerator';

export default function SeoPageBuilder({ pageData }: { pageData: SeoPageData }) {
    
    const renderSection = (section: SeoSection) => {
        switch (section.type) {
            case 'hero': return <HeroSection key={section.id} section={section} />;
            case 'content': return <ContentSection key={section.id} section={section} />;
            case 'faq': return <FaqSection key={section.id} section={section} />;
            case 'features': return <FeaturesSection key={section.id} section={section} />;
            case 'process': return <ProcessSection key={section.id} section={section} />;
            case 'cta': return <CtaSection key={section.id} section={section} />;
            default: return null;
        }
    };

    return (
        <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.paper' }}>
            <SchemaGenerator pageData={pageData} />
            {pageData.sections.map(renderSection)}
        </Box>
    );
}
