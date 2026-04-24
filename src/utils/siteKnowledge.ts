import { VISA_DATABASE } from '@/constants/visas';
import { COUNTRY_DATA } from '@/constants/countries';
import { IDIV_DOC_PATHS } from '@/constants/paths';
import { seoPageSlugs } from '@/data/seo';
import prisma from '@/lib/prisma';

export interface SiteKnowledgeEntry {
    title: string;
    description: string;
    link: string;
    category: 'Visa' | 'Service' | 'Guide' | 'Country' | 'Information' | 'Company';
    keywords: string[];
}

export const SITE_KNOWLEDGE: SiteKnowledgeEntry[] = [
    // 1. Core Pages
    { title: 'Home', description: 'Indonesian Visas Landing Page - Your gateway to Bali and Indonesia.', link: '/', category: 'Information', keywords: ['home', 'start', 'bali', 'indonesia'] },
    { title: 'All Services', description: 'Explore all Indonesian visa services, pricing, and requirements.', link: '/services', category: 'Service', keywords: ['pricing', 'cost', 'list', 'all'] },
    { title: 'About Us', description: 'Learn about our 16+ years of experience in Indonesian immigration.', link: '/about', category: 'Information', keywords: ['company', 'history', 'experience', 'team'] },
    { title: 'FAQ', description: 'Frequently asked questions about visas, extensions, and immigration.', link: '/faq', category: 'Information', keywords: ['help', 'questions', 'support', 'answers'] },
    { title: 'Company Formation', description: 'Register your PT PMA or Local PT company in Bali or Jakarta.', link: '/company-formation', category: 'Company', keywords: ['pt pma', 'business', 'setup', 'legal', 'bali', 'jakarta'] },
    { title: 'IDiv Hub', description: 'Centralized documentation and digital identifier system for travelers.', link: '/idiv-hub', category: 'Guide', keywords: ['docs', 'manual', 'hub', 'verification'] },

    { title: 'Visa Identification Guide', description: 'Major guide on how Indonesian Visa Identification system works.', link: '/id-indonesian-visas', category: 'Guide', keywords: ['guide', 'identification', 'id', 'verification'] },

    // 2. Visa Deep Dives (From Constants)
    ...VISA_DATABASE.map(v => ({
        title: v.name,
        description: `${v.category} - ${v.validity}. ${v.description}`,
        link: `/services/${v.id}`,
        category: 'Visa' as const,
        keywords: [v.id, v.category.toLowerCase(), 'apply', 'price', 'requirements']
    })),

    // 3. Country Guides
    ...COUNTRY_DATA.map(c => ({
        title: `${c.name} Visa Guide`,
        description: `Check visa requirements and eligibility for citizens of ${c.name}.`,
        link: '/services', // Redirecting to services as a general hub for country checks
        category: 'Country' as const,
        keywords: [c.name.toLowerCase(), c.code.toLowerCase(), 'citizens', 'nationality']
    })),

    // 4. Documentation Paths
    ...IDIV_DOC_PATHS.map(path => {
        const title = path.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Guide';
        return {
            title,
            description: `Official documentation and guide for ${title.toLowerCase()}.`,
            link: path,
            category: 'Guide' as const,
            keywords: ['guide', 'help', 'instructions', 'idiv']
        };
    }),

    // 5. SEO Specialized Clusters
    ...seoPageSlugs.map(slug => {
         const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
         return {
             title,
             description: `Strategic guide and information about ${title.toLowerCase()} in Indonesia.`,
             link: `/${slug}`,
             category: 'Guide' as const,
             keywords: ['seo', 'guide', 'information', ...slug.split('-')]
         };
    }),

    // 6. Support & Legal
    { title: 'Privacy Policy', description: 'How we handle your data and protect your privacy.', link: '/privacy-policy', category: 'Information', keywords: ['legal', 'data', 'privacy'] },
    { title: 'Terms & Conditions', description: 'General terms and conditions for using our services.', link: '/terms-and-conditions', category: 'Information', keywords: ['legal', 'terms'] },
    { title: 'Refund Policy', description: 'Information about refunds and service guarantees.', link: '/refund', category: 'Information', keywords: ['legal', 'refund', 'money'] }
];

export const getKnowledgeForAI = () => {
    return SITE_KNOWLEDGE.map(entry => `- [${entry.title}] (${entry.link}): ${entry.description}`).join('\n');
};

export const getKnowledgeForAIAsync = async () => {
    const staticKnowledge = getKnowledgeForAI();
    
    try {
        const pages = await prisma.knowledgePage.findMany({
            where: { published: true },
            select: { title: true, slug: true, category: true, metadata: true }
        });
        
        const updates = await prisma.immigrationUpdate.findMany({
            where: { published: true },
            select: { title: true, slug: true, category: true, summary: true }
        });

        const dynamicPages = pages.map(p => {
            const desc = (p.metadata as any)?.description || `Knowledge article about ${p.title}`;
            return `- [${p.title}] (/visa-knowledge/${p.slug}): ${desc} [Category: ${p.category || 'Knowledge'}]`;
        });

        const dynamicUpdates = updates.map(u => {
            return `- [${u.title}] (/indonesia-visa-updates/${u.slug}): ${u.summary || 'Update'} [Category: Immigration Update]`;
        });

        return `${staticKnowledge}\n\nDYNAMIC KNOWLEDGE (DATABASE):\n${dynamicPages.join('\n')}\n${dynamicUpdates.join('\n')}`;
    } catch (e) {
        console.error("Failed to fetch dynamic site knowledge", e);
        return staticKnowledge;
    }
};

