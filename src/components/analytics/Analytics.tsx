"use client";

import { GoogleAnalytics } from '@next/third-parties/google';

export default function Analytics() {
    // Only load if ID is present
    if (!process.env.NEXT_PUBLIC_GA_ID) return null;

    return <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />;
}
