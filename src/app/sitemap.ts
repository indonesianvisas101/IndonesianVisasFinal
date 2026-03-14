import { MetadataRoute } from 'next';
import { VISA_DETAILS } from '@/constants/visaDetails';
import { locales } from '@/i18n/locales';
import { seoPageSlugs } from '@/data/seo';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://indonesianvisas.com';

    // Base Routes (without locale prefix - let middleware handle default)
    // Actually, for SEO, we should list explicit localized versions + x-default
    // But basic sitemap usually lists the accessible URLs. 
    // Since our app uses /[locale]/... structure, we should list those.

    // Core Pages
    const pages = [
        '',
        '/services',
        '/pricing',
        '/affiliate',
        '/company-formation',
        '/about',
        '/faq',
        '/verification-explained',
        '/apply',
        '/extend',
        '/login',
        '/register',
        '/forgot-password',
        '/privacy-policy',
        '/terms-and-conditions',
        '/refund',
        '/legal-experts',
        '/fast-approval',
        // SEO Knowledge Architecture Phase 37
        '/indonesia-visa-guide-2026',
        '/visa-types/b211a-visa-indonesia',
        '/visa-types/visa-on-arrival-bali',
        '/visa-types/kitas-indonesia',
        '/visa-types/investor-visa-indonesia',
        '/visa-types/business-visa-indonesia',
        '/visa-extension/visa-extension-bali',
        '/visa-extension/extend-voa-bali',
        '/visa-extension/b211a-extension-guide',
        '/visa-indonesia-for-australians',
        '/visa-indonesia-for-americans',
        '/visa-indonesia-for-uk-citizens',
        '/visa-indonesia-for-indians',
        '/visa-indonesia-for-chinese',
        '/visa-indonesia-for-russians',
        '/immigration-rules/immigration-rules-indonesia',
        '/immigration-rules/indonesia-visa-overstay-rules',
        '/immigration-rules/immigration-rules-for-foreigners',
        '/travel-indonesia/do-you-need-a-visa-for-bali',
        '/travel-indonesia/bali-visa-requirements-2026',
        '/travel-indonesia/jakarta-visa-guide',
        '/travel-indonesia/bali-travel-entry-requirements',
        '/comparisons/indonesia-visa-vs-thailand-visa',
        '/comparisons/bali-visa-vs-malaysia-visa',
        '/blog/indonesia-visa-guide',
        '/blog/bali-visa-guide',
        '/blog/immigration-rules-indonesia',
        '/blog/bali-expat-guide',
        '/blog/how-to-move-to-bali-legally',
        // Specialized SEO Hubs Phase 37 Extension
        '/visa-glossary',
        '/visa-glossary/what-is-kitas',
        '/visa-glossary/what-is-b211a',
        '/visa-glossary/what-is-voa',
        '/visa-glossary/what-is-investor-visa',
        '/visa-glossary/what-is-business-visa',
        '/visa-faq',
        '/indonesia-visa-updates',
        '/indonesia-visa-updates/visa-updates-2026',
        '/indonesia-visa-updates/new-bali-immigration-rules',
        '/indonesia-visa-updates/indonesia-digital-nomad-visa-news',
        ...seoPageSlugs.map(slug => `/${slug}`)
    ];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Generate for each locale
    locales.forEach(locale => {
        // Static Pages
        pages.forEach(page => {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}${page}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 
                    page === '' ? 1.0 : 
                    page === '/indonesia-visa-guide-2026' ? 0.9 :
                    page.startsWith('/visa-faq') ? 0.9 :
                    page.startsWith('/visa-glossary') && page !== '/visa-glossary' ? 0.8 :
                    page.startsWith('/visa-types') ? 0.8 :
                    page.startsWith('/visa-indonesia-for') ? 0.7 :
                    page.startsWith('/blog') ? 0.6 :
                    page.startsWith('/indonesia-visa-updates') ? 0.6 :
                    0.8,
            });
        });

        // Dynamic Visa Routes
        Object.keys(VISA_DETAILS).forEach(id => {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}/services/${id}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.9,
            });
        });
    });

    // Also include root URLs (which redirect to default locale)? 
    // Google prefers explicit localized URLs. 
    // We can add the root '/' as x-default in alternate links, but for sitemap.xml, listing specific pages is good.
    // Let's stick to generating all localized variants.

    return sitemapEntries;
}
