
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { locales, defaultLocale } from '@/i18n/locales'
import { handleMarketingAttribution } from '@/lib/marketing'

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    let response = NextResponse.next();

    // OPTIMIZATION: Return early for public static assets/routes if strict matcher misses them
    // (Though matcher below handles most)
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') ||
        pathname === '/favicon.ico'
    ) {
        // For API routes, we still might need auth, but we don't need locale redirection
        // But usually API routes are global.
        // Let's just pass through for static files.
        // For /api, we usually want auth but NOT locale. 
        if (pathname.startsWith('/api')) {
            return (await updateSession(request)).response;
        }
        return NextResponse.next();
    }

    // 1. Check for Locale
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    // Redirect if missing locale
    if (pathnameIsMissingLocale) {
        // PREFERENCE: Cookie > Accept-Language Header (ignored for now) > Default
        const locale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale

        // Ensure valid locale from cookie
        const validLocale = locales.includes(locale as any) ? locale : defaultLocale;

        // Redirect to localized path
        return NextResponse.redirect(
            new URL(`/${validLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
        )
    } 

    // TYPO/LEGACY FIX: Redirect singular 'update' to plural 'updates'
    if (pathname.includes('/indonesian-visa-update') && !pathname.includes('/indonesian-visa-updates')) {
        const newPathname = pathname.replace('/indonesian-visa-update', '/indonesia-visa-updates');
        return NextResponse.redirect(new URL(newPathname, request.url));
    }

    // If path HAS locale, ensure we update the cookie to match the path
    // This ensures subsequent visits to root or other pages default to this new locale
    const pathLocale = pathname.split('/')[1];
    if (locales.includes(pathLocale as any)) {
        const currentCookie = request.cookies.get('NEXT_LOCALE')?.value;
        if (currentCookie !== pathLocale) {
            const localeResponse = NextResponse.next();
            localeResponse.cookies.set('NEXT_LOCALE', pathLocale, { path: '/', maxAge: 31536000 });
            return localeResponse;
        }
    }

    // 2. Run Supabase Auth Logic (Refresh Token) on the localized path
    const { response: sessionResponse, user } = await updateSession(request)
    response = sessionResponse;

    // 3. Protected Routes (Dashboard / Admin)
    // We need to check if the path (stripped of locale) is protected
    // e.g. /en/dashboard -> /dashboard

    // Extract path without locale
    const segments = pathname.split('/')
    const pathWithoutLocale = '/' + segments.slice(2).join('/') // segments[0] is empty, [1] is locale



    const isProtected =
        pathWithoutLocale.startsWith('/dashboard') ||
        pathWithoutLocale.startsWith('/admin') ||
        (!user && !isPublicRoute(pathWithoutLocale));

    if (isProtected) {
        // If no user, redirect to login (localized)
        if (!user) {
            const url = request.nextUrl.clone()
            url.pathname = `/${segments[1]}/login`
            return NextResponse.redirect(url)
        }
    }

    // 4. Auth Routes (Login / Register) - Redirect to dashboard if logged in
    if (user && (pathWithoutLocale === '/login' || pathWithoutLocale === '/register')) {
        const url = request.nextUrl.clone()
        const role = user.user_metadata?.role
        if (role === 'admin') {
            url.pathname = `/${segments[1]}/admin` // Keep locale
            // Or redirect to global admin if not localized? User implied structure has [locale]/... so admin is likely localized or not.
            // If admin was moved to [locale], then /en/admin is correct.
        } else {
            url.pathname = `/${segments[1]}/dashboard`
        }
        return NextResponse.redirect(url)
    }


    // 5. Finalize Marketing Attribution & Cookies
    response = await handleMarketingAttribution(request, response);

    return response
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
        '/visa-indonesia-for-'
    ]

    // Exact match or starts with (handle /services/*)
    if (path === '/' || path === '') return true; // root (relative to locale)

    return publicStartPaths.some(p => path === p || path.startsWith(p + '/'));
}
