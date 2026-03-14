const fs = require('fs');
const path = require('path');

const generateContent = (cluster, slug, title) => {
    // Generate 10 sections minimum
    const sections = [];
    
    sections.push({
        id: 'hero',
        type: 'hero',
        title: title,
        subtitle: `Everything you need to know about ${title.toLowerCase()} in Indonesia.`,
        primaryButton: { label: 'Apply Now', href: '/apply' },
        secondaryButton: { label: 'Contact Us', href: '/contact' }
    });

    sections.push({
        id: 'intro',
        type: 'content',
        title: 'Introduction',
        content: `<p>Welcome to our comprehensive guide on <strong>${title}</strong>. Indonesia is actively welcoming global talent, investors, and tourists. Navigating the immigration system requires precise understanding to ensure absolute legal compliance.</p>`
    });

    sections.push({
        id: 'requirements',
        type: 'features',
        title: 'Key Requirements',
        subtitle: `Essential prerequisites for ${title}`,
        items: [
            { title: 'Valid Passport', description: 'Must have at least 6 months validity from entry date.' },
            { title: 'Proof of Funds', description: 'Bank statements showing sufficient balance.' },
            { title: 'Return Ticket', description: 'Proof of onward travel out of Indonesia.' }
        ]
    });

    sections.push({
        id: 'process',
        type: 'process',
        title: 'How It Works',
        items: [
            { title: 'Step 1: Consultation', description: 'Speak with our immigration experts.' },
            { title: 'Step 2: Document Submission', description: 'Provide all required paperwork securely.' },
            { title: 'Step 3: Processing', description: 'We handle the government liaison.' },
            { title: 'Step 4: Approval', description: 'Receive your official document.' }
        ]
    });

    sections.push({
        id: 'legal',
        type: 'content',
        title: 'Legal Compliance',
        content: '<p>IndonesianVisas operates strictly within the Directorate General of Immigration boundaries. Overstaying or violating visa terms carries severe penalties including daily fines and deportation.</p>'
    });

    sections.push({
        id: 'faq',
        type: 'faq',
        title: 'Frequently Asked Questions',
        items: [
            { question: `How long does ${title} take?`, answer: 'Processing typically takes 5-10 business days for standard applications.' },
            { question: `Is there an express option?`, answer: 'Yes, VIP express processing is available.' },
            { question: `Can I do this myself?`, answer: 'While possible, using our registered agency guarantees compliance and avoids rejections.' }
        ]
    });

    sections.push({
        id: 'common-mistakes',
        type: 'content',
        title: 'Common Mistakes to Avoid',
        content: '<ul><li>Using unofficial agents.</li><li>Providing incorrect sponsor details.</li><li>Ignoring expiry dates.</li></ul>'
    });

    sections.push({
        id: 'costs',
        type: 'content',
        title: 'Costs & Fees',
        content: '<p>All our pricing is transparent with zero hidden fees. Government levies and agency fees are clearly itemized in our invoices.</p>'
    });

    sections.push({
        id: 'why-us',
        type: 'features',
        title: 'Why Choose IndonesianVisas',
        subtitle: 'The gold standard in Indonesian immigration',
        items: [
            { title: '100% Legal', description: 'Fully registered and compliant.' },
            { title: 'Expert Team', description: 'Decades of combined experience.' },
            { title: 'Secure System', description: 'Your data is encrypted and protected.' }
        ]
    });

    sections.push({
        id: 'cta',
        type: 'cta',
        title: 'Ready to Start?',
        subtitle: 'Join thousands of successful applicants.',
        primaryButton: { label: 'Get Started Today', href: '/apply' }
    });

    return {
        slug: `${cluster}/${slug}`,
        title: title,
        description: `Comprehensive 2026 authority guide on ${title}. Learn the process, requirements, costs, and legal regulations for Indonesia and Bali.`,
        updatedAt: new Date().toISOString(),
        sections: sections,
        faqs: [
            { question: `How long does ${title} take?`, answer: 'Processing typically takes 5-10 business days for standard applications.' },
            { question: `Is there an express option?`, answer: 'Yes, VIP express processing is available.' },
            { question: `Can I do this myself?`, answer: 'While possible, using our registered agency guarantees compliance and avoids rejections.' }
        ]
    };
};

const clusters = {
    'trust': [
        { slug: 'legal', title: 'Legal Registration & Compliance' },
        { slug: 'company-profile', title: 'Company Profile & Authority' },
        { slug: 'our-process', title: 'Our Immigration Process' },
        { slug: 'why-choose-us', title: 'Why Choose Us' }
    ],
    'expat-guides': [
        { slug: 'move-to-bali', title: 'How to Move to Bali in 2026' },
        { slug: 'how-to-live-in-bali', title: 'Living in Bali: Expat Guide' },
        { slug: 'how-to-stay-in-bali-long-term', title: 'Long-Term Stay Options for Bali' },
        { slug: 'bali-digital-nomad-guide', title: 'Bali Digital Nomad Guide' },
        { slug: 'expat-guide-indonesia', title: 'Ultimate Expat Guide to Indonesia' }
    ],
    'business-indonesia': [
        { slug: 'start-company-in-bali', title: 'Start a Company (PT PMA) in Bali' },
        { slug: 'business-visa-indonesia-guide', title: 'Indonesia Business Visa Guide' },
        { slug: 'invest-in-indonesia', title: 'How to Invest in Indonesia' },
        { slug: 'indonesia-investor-visa-guide', title: 'Investor Visa (KITAS) Guide' },
        { slug: 'bali-business-setup', title: 'Bali Business Setup Requirements' }
    ],
    'visa-process': [
        { slug: 'visa-processing-time-indonesia', title: 'Indonesia Visa Processing Times' },
        { slug: 'visa-cost-indonesia', title: 'Complete Visa Cost Guide' },
        { slug: 'visa-extension-cost-bali', title: 'Visa Extension Costs in Bali' },
        { slug: 'how-to-apply-indonesia-visa', title: 'How to Apply for an Indonesian Visa' }
    ],
    'immigration-system': [
        { slug: 'indonesia-immigration-system', title: 'Understanding the Indonesia Immigration System' },
        { slug: 'types-of-indonesia-visas', title: 'Types of Indonesia Visas Explained' },
        { slug: 'bali-entry-requirements', title: 'Bali Entry Requirements 2026' },
        { slug: 'indonesia-visa-requirements', title: 'Complete Indonesia Visa Requirements' }
    ]
};

const outputDir = path.join(__dirname, '../src/data/seo');

let indexExport = "import { SeoPageData } from './types';\n\n";

for (const [clusterKey, pages] of Object.entries(clusters)) {
    const clusterData = {};
    const safeKey = clusterKey.replace(/-/g, '');
    pages.forEach(p => {
        const fullSlug = clusterKey + '/' + p.slug;
        clusterData[fullSlug] = generateContent(clusterKey, p.slug, p.title);
    });

    const fileContent = "import { SeoPageData } from './types';\n\nexport const " + safeKey + "Data: Record<string, SeoPageData> = " + JSON.stringify(clusterData, null, 4) + ";\n";
    fs.writeFileSync(path.join(outputDir, safeKey + '.ts'), fileContent);
    indexExport += "import { " + safeKey + "Data } from './" + safeKey + "';\n";
}

indexExport += `
const allData: Record<string, SeoPageData> = {
    ...trustData,
    ...expatguidesData,
    ...businessindonesiaData,
    ...visaprocessData,
    ...immigrationsystemData
};

export const getSeoPageData = (slug: string): SeoPageData => {
    return allData[slug] || {
        slug,
        title: 'Not Found',
        description: 'Page not found.',
        sections: [],
        updatedAt: new Date().toISOString()
    };
};
`;

fs.writeFileSync(path.join(outputDir, 'index.ts'), indexExport);
console.log('SEO Data purely generated successfully.');
