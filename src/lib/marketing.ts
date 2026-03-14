
import { NextRequest, NextResponse } from 'next/server';

/**
 * Advanced Marketing Middleware
 * Captures UTM parameters and persists them in cookies for attribution.
 */
export async function handleMarketingAttribution(request: NextRequest, response: NextResponse) {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // UTM Parameters to capture
    const utmParams = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'utm_term',
        'gclid',     // Google Ads
        'fbclid',    // Facebook Ads
        'ttclid'     // TikTok Ads
    ];

    let hasMarketingData = false;
    const attribution: Record<string, string> = {};

    utmParams.forEach(param => {
        const value = searchParams.get(param);
        if (value) {
            attribution[param] = value;
            hasMarketingData = true;
        }
    });

    // Capture Referrer if not already set
    const referrer = request.headers.get('referer');
    if (referrer && !attribution.referrer) {
        attribution.referrer = referrer;
    }

    // Persist attribution in a long-lived cookie (30 days)
    if (hasMarketingData || attribution.referrer) {
        // We merge with existing attribution if present? 
        // For now, new marketing campaign overrides old one (standard last-click attribution logic)
        const expiry = 60 * 60 * 24 * 30; // 30 days
        response.cookies.set('marketing_attribution', JSON.stringify(attribution), {
            path: '/',
            maxAge: expiry,
            httpOnly: false, // Accessible by client-side for "Ghost Capture"
            sameSite: 'lax'
        });
    }

    return response;
}
