/**
 * GCI Elite Authority Hardening Utility
 * Automatically injects internal links for Diaspora-related keywords with Premium Styling.
 */

const GCI_KEYWORDS = [
    { key: "Global Citizen of Indonesia", url: "/gci" },
    { key: "Indonesian Diaspora", url: "/gci" },
    { key: "Eks-WNI", url: "/gci" },
    { key: "Unlimited ITAP", url: "/gci" },
    { key: "Diaspora Status", url: "/gci" },
    { key: "Lifetime Residency", url: "/gci" },
    { key: "IDiv Infinity", url: "/gci" }
];

export function linkGCIKeywords(text: string, locale: string = 'en'): string {
    if (!text) return text;
    
    let processed = text;
    
    GCI_KEYWORDS.forEach(({ key, url }) => {
        // Only replace if not already inside a link
        const regex = new RegExp(`(?<!<a[^>]*>)\\b(${key})\\b(?!<\\/a>)`, 'gi');
        
        // Premium Subtle Style: Gold underline on hover, font-bold for authority
        const link = `<a href="/${locale}${url}" class="text-blue-500 hover:text-amber-500 hover:underline decoration-amber-500/50 underline-offset-4 transition-all duration-300 font-bold font-serif italic">${key}</a>`;
        
        processed = processed.replace(regex, link);
    });
    
    return processed;
}
