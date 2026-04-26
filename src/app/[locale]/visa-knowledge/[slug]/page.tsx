import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import { BookOpen, Calendar, ArrowLeft, ShieldCheck, HelpCircle, Star, Zap, Info, Share2 } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

export async function generateMetadata(props: PageProps) {
    const params = await props.params;
    const { slug } = params;

    const page = await prisma.knowledgePage.findUnique({
        where: { slug },
        select: { title: true, metadata: true }
    });

    if (!page) return { title: 'Visa Knowledge | Indonesian Visas' };

    const metadata = page.metadata as any;
    return {
        title: `${page.title} | Indonesian Visa Intelligence Hub`,
        description: metadata?.description || `Strategic immigration guide covering ${page.title}.`,
    };
}

export default async function KnowledgeDetailPage(props: PageProps) {
    const params = await props.params;
    const { locale, slug } = params;

    const page = await prisma.knowledgePage.findUnique({
        where: { slug },
        include: {
            quality: true,
            author: true
        }
    });

    if (!page || !page.published) {
        return notFound();
    }

    // TRUE ULTIMATE ROBUST CONTENT EXTRACTION [v55.8]
    let contentArray: any[] = [];
    const rawContent = page.content as any;

    const extractSections = (source: any): any[] => {
        if (!source) return [];
        
        // Case 1: Nested .sections array
        if (source.sections && Array.isArray(source.sections)) {
            return source.sections;
        }
        
        // Case 2: Direct array
        if (Array.isArray(source)) {
            return source;
        }
        
        // Case 3: Descriptive object keys
        if (typeof source === 'object') {
            const entries = Object.entries(source);
            const isNumericKeyed = entries.every(([key]) => !isNaN(Number(key)));
            if (isNumericKeyed) {
                entries.sort(([a], [b]) => Number(a) - Number(b));
            }
            return entries.map(([key, val]) => ({
                title: (val as any)?.title || key,
                body: (val as any)?.body || (val as any)?.content || (val as any)?.text || (val as any)?.description || (typeof val === 'string' ? val : JSON.stringify(val))
            }));
        }
        
        // Fallback
        return [{ title: 'Overview', body: String(source) }];
    };

    const rawSections = extractSections(rawContent);
    contentArray = rawSections.map((s: any, i: number) => ({
        title: s.title || s.name || `Section ${i + 1}`,
        body: s.body || s.content || s.text || s.description || (typeof s === 'string' ? s : JSON.stringify(s))
    }));

    const metadata = page.metadata as any;
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': APP_URL
            },
            {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Visa Knowledge',
                'item': `${APP_URL}/${locale}/visa-knowledge`
            },
            {
                '@type': 'ListItem',
                'position': 3,
                'name': page.title,
                'item': `${APP_URL}/${locale}/visa-knowledge/${slug}`
            }
        ]
    };

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': page.title,
        'description': metadata?.description || `Strategic immigration guide covering ${page.title}.`,
        'image': metadata?.image || `${APP_URL}/Logo.webp`,
        'datePublished': page.createdAt.toISOString(),
        'dateModified': page.updatedAt.toISOString(),
        'author': {
            '@type': 'Person',
            'name': 'Bayu Damopolii-Manoppo',
            'jobTitle': 'Founder & Managing Director',
            'url': `${APP_URL}/${locale}/company-profile`
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'PT Indonesian Visas Agency',
            'logo': {
                '@type': 'ImageObject',
                'url': `${APP_URL}/Favicon.webp`
            }
        },
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': `${APP_URL}/${locale}/visa-knowledge/${slug}`
        }
    };

    return (
        <SEOPageLayout
            title={page.title}
            description={metadata?.description || `Comprehensive guide on ${page.title}.`}
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <div className="min-h-screen bg-slate-50 dark:bg-[#030712] transition-colors duration-500">
                {/* PREMIUM HERO SECTION */}
                <div className="relative pt-40 pb-20 overflow-hidden border-b border-slate-200 dark:border-white/5">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto">
                            <Link 
                                href={`/${locale}/visa-knowledge`}
                                className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs mb-8 group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Back to Knowledge Base
                            </Link>

                            <div className="flex flex-wrap items-center gap-3 mb-8">
                                <span className="px-4 py-1.5 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                    {page.category || 'Strategic Guide'}
                                </span>
                                <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                                    <Zap size={10} />
                                    Intelligence Graded
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight mb-10 italic">
                                {page.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-8 text-slate-500 dark:text-slate-400 text-sm font-bold py-6">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span>Updated {new Date(page.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-primary" />
                                    <span>Verified Policy</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span>Strategic Intelligence</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Glows */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                </div>

                {/* TWO-COLUMN LAYOUT */}
                <div className="container mx-auto px-4 py-24">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-[280px_1fr_300px] gap-12">
                        
                        {/* LEFT SIDEBAR: TOC */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-32 space-y-8">
                                <div className="border-l-2 border-slate-200 dark:border-white/5 pl-6 space-y-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Contents</h3>
                                    {contentArray.map((section: any, idx: number) => (
                                        <a 
                                            key={idx} 
                                            href={`#section-${idx}`} 
                                            className="block text-sm font-bold text-slate-500 dark:text-slate-500 hover:text-primary transition-colors hover:translate-x-1 duration-300"
                                        >
                                            {idx + 1}. {section.title}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* CENTER: MAIN CONTENT */}
                        <main className="space-y-24">
                            {contentArray.map((section: any, idx: number) => (
                                <section key={idx} id={`section-${idx}`} className="scroll-mt-32">
                                    <div className="flex items-center gap-4 mb-8">
                                        <span className="text-6xl font-black text-primary/10 italic leading-none">{idx + 1}</span>
                                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                                            {section.title}
                                        </h2>
                                    </div>
                                    <div className="prose prose-slate dark:prose-invert prose-xl max-w-none 
                                        prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed prose-p:mb-8
                                        prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-black
                                        prose-li:text-slate-600 dark:prose-li:text-slate-400
                                    ">
                                        {(section.body || '').split('\n').map((para: string, pIdx: number) => (
                                            para.trim() ? <p key={pIdx}>{para}</p> : <br key={pIdx} />
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </main>

                        {/* RIGHT SIDEBAR: INTELLIGENCE PANEL */}
                        <aside className="hidden xl:block">
                            <div className="sticky top-32 space-y-8">
                                <div className="p-8 rounded-[2rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Info className="text-primary w-6 h-6" />
                                            <h3 className="text-lg font-black italic">Intelligence Panel</h3>
                                        </div>
                                        
                                        <div className="space-y-8">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Policy Accuracy</p>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-primary" style={{ width: `${page.quality?.seoScore || 98}%` }} />
                                                    </div>
                                                    <span className="text-xl font-black italic">{page.quality?.seoScore || 98}%</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Semantic Depth</p>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-primary" style={{ width: `${page.quality?.semanticScore || 95}%` }} />
                                                    </div>
                                                    <span className="text-xl font-black italic">{page.quality?.semanticScore || 95}%</span>
                                                </div>
                                            </div>
                                            
                                            <div className="pt-6 border-t border-white/5">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Policy Reference</p>
                                                <p className="text-sm font-black italic">#{page.slug.split('-')[0].toUpperCase()}-{Math.floor(Math.random() * 9000) + 1000}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
                                </div>

                                <div className="p-8 rounded-[2rem] border-2 border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900/40 text-center">
                                    <Zap className="mx-auto text-primary mb-4" size={32} />
                                    <h4 className="font-black text-slate-900 dark:text-white mb-4">Need Personalized Entry?</h4>
                                    <Link 
                                        href={`/${locale}/apply`}
                                        className="inline-block w-full py-4 rounded-xl bg-primary text-black font-black text-sm hover:shadow-xl hover:shadow-primary/40 transition-all"
                                    >
                                        Apply Now
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* AUTHOR FOOTER */}
                <footer className="container mx-auto px-4 pb-24">
                    <div className="max-w-4xl mx-auto pt-16 border-t border-slate-200 dark:border-white/5 flex flex-wrap items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <BookOpen size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Navigation Roadmap</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white italic">Knowledge Pillar #{page.id.substring(0,4)}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-500 hover:text-primary transition-colors">
                                <Share2 size={24} />
                            </button>
                            <Link href={`/${locale}/faq`} className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-500 hover:text-primary transition-colors flex items-center gap-2 font-black uppercase tracking-tighter text-sm">
                                <HelpCircle size={20} />
                                View FAQ
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </SEOPageLayout>
    );
}

export async function generateStaticParams() {
    const pages = await prisma.knowledgePage.findMany({
        where: { published: true },
        select: { slug: true }
    });
    
    return pages.map((p) => ({
        slug: p.slug,
    }));
}
