const fs = require('fs');
const path = require('path');

const clusters = [
    {
        folder: 'trust',
        pages: ['legal', 'company-profile', 'our-process', 'why-choose-us']
    },
    {
        folder: 'expat-guides',
        pages: ['move-to-bali', 'how-to-live-in-bali', 'how-to-stay-in-bali-long-term', 'bali-digital-nomad-guide', 'expat-guide-indonesia']
    },
    {
        folder: 'business-indonesia',
        pages: ['start-company-in-bali', 'business-visa-indonesia-guide', 'invest-in-indonesia', 'indonesia-investor-visa-guide', 'bali-business-setup']
    },
    {
        folder: 'visa-process',
        pages: ['visa-processing-time-indonesia', 'visa-cost-indonesia', 'visa-extension-cost-bali', 'how-to-apply-indonesia-visa']
    },
    {
        folder: 'immigration-system',
        pages: ['indonesia-immigration-system', 'types-of-indonesia-visas', 'bali-entry-requirements', 'indonesia-visa-requirements']
    }
];

const baseDir = path.join(__dirname, '../src/app/[locale]');

clusters.forEach(cluster => {
    cluster.pages.forEach(page => {
        const dirPath = path.join(baseDir, cluster.folder, page);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const pageContent = `import React from 'react';
import { Metadata } from 'next';
import SeoPageBuilder from '@/components/seo/SeoPageBuilder';
import { getSeoPageData } from '@/data/seo';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const data = getSeoPageData('${cluster.folder}/${page}');
    return {
        title: data.title,
        description: data.description,
        alternates: {
            canonical: data.canonicalUrl || \`https://indonesianvisas.com/\${params.locale}/${cluster.folder}/${page}\`,
        },
        openGraph: {
            title: data.title,
            description: data.description,
            url: \`https://indonesianvisas.com/\${params.locale}/${cluster.folder}/${page}\`,
            images: data.ogImage ? [{ url: data.ogImage }] : [],
        }
    };
}

export default function Page({ params }: { params: { locale: string } }) {
    const data = getSeoPageData('${cluster.folder}/${page}');
    return <SeoPageBuilder pageData={data} />;
}
`;
        fs.writeFileSync(path.join(dirPath, 'page.tsx'), pageContent);
        console.log(`Created route: /${cluster.folder}/${page}`);
    });
});
