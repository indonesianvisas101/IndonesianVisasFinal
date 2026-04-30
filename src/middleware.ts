
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { locales, defaultLocale } from '@/i18n/locales'
import { handleMarketingAttribution } from '@/lib/marketing'
import { slugify } from '@/utils/slugify'

import { IDIV_DOC_PATHS } from '@/constants/paths'

const RATE_LIMIT_MAP = new Map<string, { count: number, reset: number }>();
const LIMIT = 1000; // Increased to 1000 requests to prevent 429 in dashboard usage
const WINDOW = 60 * 1000; // 1 minute

export async function middleware(request: NextRequest) {
    const ip = (request as any).ip || request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const record = RATE_LIMIT_MAP.get(ip);

    if (record) {
        if (now > record.reset) {
            RATE_LIMIT_MAP.set(ip, { count: 1, reset: now + WINDOW });
        } else {
            record.count++;
            if (record.count > LIMIT) {
                return new NextResponse('Too Many Requests', { status: 429 });
            }
        }
    } else {
        RATE_LIMIT_MAP.set(ip, { count: 1, reset: now + WINDOW });
    }

    return await proxy(request);
}

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    
    // OPTIMIZATION: Return early for public static assets
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    // Handle API specifically - usually global/non-localized
    // OPTIMIZATION: Skip session update in middleware for API routes to avoid latency.
    // The API routes themselves (src/app/api/...) handle their own auth/refresh via createClient().
    if (pathname.startsWith('/api') || pathname.startsWith('/auth')) {
        return NextResponse.next();
    }

    // 0. NEW: Support for clean IDIV Doc URLs
    if (IDIV_DOC_PATHS.includes(pathname)) {
        const preferredLocale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale;
        const targetLocale = locales.includes(preferredLocale as any) ? preferredLocale : defaultLocale;
        
        const response = NextResponse.rewrite(
            new URL(`/${targetLocale}/idiv-hub${pathname}`, request.url)
        );
        return await handleMarketingAttribution(request, response);
    }

    // 0.1 NEW: Smart Redirect for 'Dirty' slugs (No more 404s for spaces/commas)
    const isPotentiallyDirty = pathname.includes('%20') || pathname.includes(',') || /[A-Z]/.test(pathname);
    if (isPotentiallyDirty && (pathname.includes('visa-knowledge') || pathname.includes('indonesia-visa-updates'))) {
        const segments = pathname.split('/');
        const lastSegment = segments[segments.length - 1];
        const cleanSlug = slugify(decodeURIComponent(lastSegment));
        
        if (cleanSlug !== lastSegment) {
            segments[segments.length - 1] = cleanSlug;
            return NextResponse.redirect(new URL(segments.join('/'), request.url), 301);
        }
    }

    const segments = pathname.split('/')
    const pathLocale = segments[1]
    const pathWithoutLocale = '/' + segments.slice(2).join('/')

    // 1. Canonical Redirects for the Default Locale (English)
    // If user explicitly visits /en/... we redirect them to /... (the root domain)
    if (pathLocale === defaultLocale) {
        // Check if this is aDoc Hub path (we want it at root only)
        if (IDIV_DOC_PATHS.includes(pathWithoutLocale)) {
            return NextResponse.redirect(new URL(pathWithoutLocale, request.url));
        }

        const targetPath = pathWithoutLocale === '/' ? '/' : pathWithoutLocale;
        return NextResponse.redirect(new URL(targetPath, request.url));
    }

    // 2. Locale Determination
    const pathnameIsMissingLocale = !locales.includes(pathLocale as any);
    
    // 3. Performance Check: Identify if this is a Public Landing Page
    // We do this BEFORE potentially slow Supabase calls
    const checkPath = pathnameIsMissingLocale ? pathname : pathWithoutLocale;
    const isPublic = isPublicRoute(checkPath);
    const isDashboardOrAdmin = checkPath.startsWith('/dashboard') || checkPath.startsWith('/admin');

    // 4. Handle Missing Locale
    if (pathnameIsMissingLocale) {
        const preferredLocale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale;
        const targetLocale = locales.includes(preferredLocale as any) ? preferredLocale : defaultLocale;

        if (targetLocale === defaultLocale) {
            // BEST PRACTICE: Rewrite instead of Redirect for root domain SEO
            const url = request.nextUrl.clone();
            url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
            
            const response = NextResponse.rewrite(url);
            // We still want to handle marketing attribution on rewrites
            return await handleMarketingAttribution(request, response);
        } else {
            // Redirect to other locales (id, fr, etc.)
            return NextResponse.redirect(
                new URL(`/${targetLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
            );
        }
    }

    // 5. Protected Routes & Auth Loading
    // PERFORMANCE: Only call updateSession if we are NOT on a public landing page
    // OR if we are specifically approaching a protected route.
    let user = null;
    let response = NextResponse.next();

    if (isDashboardOrAdmin || !isPublic) {
        const sessionData = await updateSession(request);
        user = sessionData.user;
        response = sessionData.response;
    }

    // 6. Security Enforcement
    if (isDashboardOrAdmin) {
        if (!user) {
            const url = request.nextUrl.clone()
            url.pathname = `/${pathLocale}/login`
            return NextResponse.redirect(url)
        }
    }

    // 7. Auth Redirect (Logged in users away from login/register)
    if (user && (pathWithoutLocale === '/login' || pathWithoutLocale === '/register')) {
        const url = request.nextUrl.clone()
        const role = user.user_metadata?.role
        url.pathname = role === 'admin' ? `/${pathLocale}/admin` : `/${pathLocale}/dashboard`;
        return NextResponse.redirect(url)
    }

    // 8. Finalize Marketing Attribution
    response = await handleMarketingAttribution(request, response);

    // 9. Hardening: Security Headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
}

function isPublicRoute(path: string) {
    const publicStartPaths = [
        '/',
        '/services',
        '/about',
        '/contact',
        '/faq',
        '/login',
        '/register',
        '/forgot-password',
        '/verify',
        '/public',
        '/company-formation',
        '/apply',
        '/extend',
        '/pricing',
        '/verification-explained',
        '/terms-and-conditions',
        '/privacy-policy',
        '/refund',
        '/affiliate',
        '/thanks',
        '/invoice',
        '/travel',
        '/sitemap',
        '/help',
        '/visa-glossary',
        '/visa-faq',
        '/indonesia-visa-updates',
        '/indonesian-visa-update',
        '/indonesia-visa-guide-2026',
        '/visa-types',
        '/visa-extension',
        '/immigration-rules',
        '/travel-indonesia',
        '/blog',
        '/guides',
        '/visa-indonesia-for-',
        '/id-indonesian-visas',
        '/idiv-search',
        '/arrival-card',
        ...IDIV_DOC_PATHS
    ]

    // Exact match or starts with (handle /services/*)
    if (path === '/' || path === '') return true; // root (relative to locale)


    return publicStartPaths.some(p => path === p || path.startsWith(p + '/'));
}

export default middleware;

// PERFORMANCE: Only run middleware on actual page navigations,
// not static assets, images, or internal Next.js resources.
// This prevents the middleware from being invoked on every single request.
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon\\.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
    ],
};
