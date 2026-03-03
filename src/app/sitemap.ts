import { MetadataRoute } from 'next';
import { VISA_DETAILS } from '@/constants/visaDetails';
import { locales } from '@/i18n/locales';

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
        '/contact',
        '/about',
        '/faq',
        '/verification-explained',
        '/bali_help',
        '/apply',
        '/extend',
        '/login',
        '/register',
        '/forgot-password',
        '/privacy-policy',
        '/terms-and-conditions',
        '/refund',
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
                priority: page === '' ? 1.0 : 0.8,
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
