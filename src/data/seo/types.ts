export type SeoSectionType = 'hero' | 'content' | 'faq' | 'features' | 'cta' | 'process';

export interface SeoSection {
    id: string;
    type: SeoSectionType;
    title?: string;
    subtitle?: string;
    content?: string; // HTML or Markdown
    items?: any[]; // Flexible array for features/processes
    image?: string;
    primaryButton?: {
        label: string;
        href: string;
    };
    secondaryButton?: {
        label: string;
        href: string;
    };
}

export interface SeoPageData {
    slug: string; // E.g., 'trust/legal'
    title: string;
    description: string;
    keywords?: string[];
    canonicalUrl?: string; // Will default to base + slug
    ogImage?: string;
    sections: SeoSection[];
    faqs?: { question: string; answer: string }[];
    updatedAt: string; // ISO String
}
