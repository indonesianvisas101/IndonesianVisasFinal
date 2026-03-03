export const locales = [
    'en', 'id', 'fr', 'de', 'es', 'it', 'nl', 'ru', 'zh', 'ja',
    'ko', 'ar', 'hi', 'pt', 'tr', 'pl', 'vi', 'th', 'ms', 'uk'
] as const;

export const defaultLocale = 'en';

export type Locale = (typeof locales)[number];

// 20 Major Languages with accurate flag codes (ISO 3166-1 alpha-2)
export const LANGUAGE_DETAILS: Record<Locale, { label: string; flag: string }> = {
    en: { label: 'English', flag: 'us' }, // or 'gb'
    id: { label: 'Indonesia', flag: 'id' },
    fr: { label: 'Français', flag: 'fr' },
    de: { label: 'Deutsch', flag: 'de' },
    es: { label: 'Español', flag: 'es' },
    it: { label: 'Italiano', flag: 'it' },
    nl: { label: 'Nederlands', flag: 'nl' },
    ru: { label: 'Русский', flag: 'ru' },
    zh: { label: '中文', flag: 'cn' },
    ja: { label: '日本語', flag: 'jp' },
    ko: { label: '한국어', flag: 'kr' },
    ar: { label: 'العربية', flag: 'sa' },
    hi: { label: 'हिन्दी', flag: 'in' },
    pt: { label: 'Português', flag: 'pt' },
    tr: { label: 'Türkçe', flag: 'tr' },
    pl: { label: 'Polski', flag: 'pl' },
    vi: { label: 'Tiếng Việt', flag: 'vn' },
    th: { label: 'ไทย', flag: 'th' },
    ms: { label: 'Melayu', flag: 'my' },
    uk: { label: 'Українська', flag: 'ua' }
};
