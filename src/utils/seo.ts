/**
 * Centralized SEO & Canonical URL Utilities
 * Specifically designed to resolve indonesianvisas.com GSC indexing conflicts
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
const DEFAULT_LOCALE = 'en';

/**
 * Standardizes Canonical URLs across the platform.
 * Strips the /en/ prefix for the default locale to match XML sitemap.
 */
export function generateCanonical(locale: string, path: string): string {
    const isDefault = locale === DEFAULT_LOCALE;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    // root case
    if (cleanPath === '/' || cleanPath === '') {
        return isDefault ? APP_URL : `${APP_URL}/${locale}`;
    }

    return isDefault
        ? `${APP_URL}${cleanPath}`
        : `${APP_URL}/${locale}${cleanPath}`;
}

/**
 * Formats internal navigation links.
 * Strips the /en/ prefix for the default locale to ensure 1:1 mapping with canoncials.
 */
export function formatNavLink(locale: string, href: string): string {
    const isDefault = locale === DEFAULT_LOCALE;
    const cleanHref = href.startsWith('/') ? href : `/${href}`;
    
    // External links
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('wa.me')) {
        return href;
    }

    if (isDefault) {
        return cleanHref === '/' ? '/' : cleanHref;
    }

    return cleanHref === '/' ? `/${locale}` : `/${locale}${cleanHref}`;
}

/**
 * Validates 'params' and ensures it is properly awaited for Next.js 15+
 */
export async function getSafeParams<T extends { locale: string }>(params: Promise<T>): Promise<T & { currentLocale: string }> {
    const awaitedParams = await params;
    return {
        ...awaitedParams,
        currentLocale: awaitedParams.locale || DEFAULT_LOCALE
    };
}
