import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/dashboard', '/api', '/_next'],
        },
        sitemap: 'https://indonesianvisas.com/sitemap.xml',
    };
}
