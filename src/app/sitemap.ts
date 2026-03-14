import { MetadataRoute } from 'next';
import { VISA_DETAILS } from '@/constants/visaDetails';
import prisma from '@/lib/prisma';
import { locales } from '@/i18n/locales';
import { seoPageSlugs } from '@/data/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://indonesianvisas.com';

    // 1. Static Routes
    const pages = [
        '', '/services', '/pricing', '/affiliate', '/company-formation', '/company-profile',
        '/about', '/faq', '/legal', '/apply', '/extend', '/login', '/register',
        '/forgot-password', '/privacy-policy', '/terms-and-conditions', '/refund',
        '/legal-experts', '/fast-approval', '/indonesia-visa-guide-2026',
        '/visa-types/b211a-visa-indonesia', '/visa-types/visa-on-arrival-bali',
        '/visa-types/kitas-indonesia', '/visa-types/investor-visa-indonesia',
        '/visa-types/business-visa-indonesia', '/visa-extension/visa-extension-bali',
        '/visa-extension/extend-voa-bali', '/visa-extension/b211a-extension-guide',
        '/visa-indonesia-for-australians', '/visa-indonesia-for-americans',
        '/visa-indonesia-for-uk-citizens', '/visa-indonesia-for-indians',
        '/visa-indonesia-for-chinese', '/visa-indonesia-for-russians',
        '/immigration-rules/immigration-rules-indonesia', '/immigration-rules/indonesia-visa-overstay-rules',
        '/immigration-rules/immigration-rules-for-foreigners', '/travel-indonesia/do-you-need-a-visa-for-bali',
        '/travel-indonesia/bali-visa-requirements-2026', '/travel-indonesia/jakarta-visa-guide',
        '/travel-indonesia/bali-travel-entry-requirements', '/comparisons/indonesia-visa-vs-thailand-visa',
        '/comparisons/bali-visa-vs-malaysia-visa', '/blog/indonesia-visa-guide',
        '/blog/bali-visa-guide', '/blog/immigration-rules-indonesia',
        '/blog/bali-expat-guide', '/blog/how-to-move-to-bali-legally',
        '/visa-glossary', '/visa-glossary/what-is-kitas', '/visa-glossary/what-is-b211a',
        '/visa-glossary/what-is-voa', '/visa-glossary/what-is-investor-visa',
        '/visa-glossary/what-is-business-visa', '/visa-faq', '/indonesia-visa-updates',
        '/indonesia-visa-updates/visa-updates-2026', '/indonesia-visa-updates/new-bali-immigration-rules',
        '/indonesia-visa-updates/indonesia-digital-nomad-visa-news',
        ...seoPageSlugs.map(slug => `/${slug}`)
    ];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // 2. Fetch Dynamic Content
    const [knowledgePages] = await Promise.all([
        (prisma as any).knowledgePage.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } })
    ]);

    // 3. Generate for each locale
    for (const locale of locales) {
        // Static Pages
        pages.forEach(page => {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}${page}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: page === '' ? 1.0 : (page.startsWith('/visa-types') ? 0.9 : 0.8),
            });
        });

        // Visa Service Pages
        Object.keys(VISA_DETAILS).forEach(id => {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}/services/${id}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.9,
            });
        });

        // Programmatic Knowledge Pages
        knowledgePages.forEach((kp: any) => {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}/visa-knowledge/${kp.slug}`,
                lastModified: kp.updatedAt,
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        });
    }

    return sitemapEntries;
}

