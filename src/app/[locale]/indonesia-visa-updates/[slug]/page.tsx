import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import { Newspaper, Calendar, ArrowLeft, Tag, Share2, Clock, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

export async function generateMetadata(props: PageProps) {
    const params = await props.params;
    const { slug } = params;

    const update = await prisma.immigrationUpdate.findUnique({
        where: { slug },
        select: { title: true, summary: true }
    });

    if (!update) return { title: 'News Update | Indonesian Visas' };

    return {
        title: `${update.title} | Indonesian Visa Intelligence`,
        description: update.summary || `Latest policy update regarding ${update.title}.`,
    };
}

export default async function NewsDetailPage(props: PageProps) {
    const params = await props.params;
    const { locale, slug } = params;

    const update = await prisma.immigrationUpdate.findUnique({
        where: { slug }
    });

    if (!update || !update.published) {
        return notFound();
    }

    return (
        <main className="min-h-screen bg-black overflow-x-hidden">
            {/* PRE-HEADER SPACE */}
            <div className="h-20 bg-black" />

            <article className="pb-24">
                {/* PREMIUM HERO SECTION - WIDER */}
                <div className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-black to-[#050505]">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
                        <div className="max-w-5xl">
                            <Link 
                                href={`/${locale}/indonesia-visa-updates`}
                                className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mb-12 group py-2 px-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                            >
                                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                                Back to All Intelligence
                            </Link>

                            <div className="flex flex-wrap items-center gap-3 mb-8">
                                <span className="px-4 py-1.5 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                    {update.category}
                                </span>
                                <span className="px-4 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    Official Update
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-8 italic drop-shadow-2xl">
                                {update.title}
                            </h1>

                            {update.summary && (
                                <p className="text-xl md:text-2xl text-white/60 font-medium leading-relaxed mb-10 max-w-4xl animate-fade-in delay-100">
                                    {update.summary}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-8 text-slate-500 dark:text-slate-400 text-sm font-bold border-y border-slate-200 dark:border-white/5 py-6 mb-12">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span>{new Date(update.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span>5 Min Read</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-primary" />
                                    <span>Verified Policy</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>

                {/* CONTENT SECTION - OPTIMIZED READABILITY */}
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-12">
                    <div className="max-w-[1000px]">
                        <div className="grid lg:grid-cols-[1fr_280px] gap-20">
                            {/* Main Content */}
                            <div>
                                {update.image && 
                                 !update.image.includes('gemini.google.com') && 
                                 !update.image.includes('drive.google.com') && (
                                    <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden mb-16 shadow-2xl border border-slate-200 dark:border-white/10">
                                        <Image 
                                            src={update.image} 
                                            alt={update.title}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    </div>
                                )}
                                <div className="space-y-8 text-white/80 text-xl leading-relaxed font-medium">
                                    {update.content.split('\n').map((para, i) => {
                                        const trimmed = para.trim();
                                        if (!trimmed) return <br key={i} />;
                                        
                                        // SMART-LINK DETECTOR & LIST RENDERER
                                        const renderTextWithLinks = (text: string) => {
                                            const urlRegex = /(https?:\/\/[^\s]+)/g;
                                            const parts = text.split(urlRegex);
                                            return parts.map((part, index) => {
                                                if (part.match(urlRegex)) {
                                                    return (
                                                        <a 
                                                            key={index} 
                                                            href={part} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-primary font-black underline underline-offset-4 hover:text-white transition-colors break-all"
                                                        >
                                                            {part}
                                                        </a>
                                                    );
                                                }
                                                return part;
                                            });
                                        };

                                        if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
                                            return (
                                                <div key={i} className="flex gap-6 items-start bg-white/5 p-8 rounded-[2rem] border border-white/10 group hover:bg-white/10 transition-colors">
                                                    <Zap className="text-primary shrink-0 mt-1" size={24} />
                                                    <span className="text-white">{renderTextWithLinks(trimmed.substring(1).trim())}</span>
                                                </div>
                                            );
                                        }

                                        return (
                                            <p key={i} className="mode-aware-text-force-white text-white">
                                                {renderTextWithLinks(trimmed)}
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Sidebar / Tools */}
                            <aside className="hidden lg:block space-y-12">
                                <div className="sticky top-32 space-y-12">
                                    <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6 italic">Quick Actions</h3>
                                        <button className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-black text-sm mb-4 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                                            <Share2 size={16} />
                                            Share Intelligence
                                        </button>
                                        <Link href={`/${locale}/apply`} className="w-full py-4 rounded-xl border-2 border-primary text-primary font-black text-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                                            Apply for Visa
                                        </Link>
                                    </div>

                                    <div className="p-8 rounded-3xl bg-primary/10 border border-primary/20">
                                        <ShieldCheck className="text-primary mb-4" size={32} />
                                        <h3 className="text-lg font-black mb-2">Legal Accuracy</h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                            All data presented here is cross-referenced with the latest Minister of Law & Human Rights regulations.
                                        </p>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </article>
        </main>
    );
}

export async function generateStaticParams() {
    const updates = await prisma.immigrationUpdate.findMany({
        where: { published: true },
        select: { slug: true }
    });
    
    return updates.map((u) => ({
        slug: u.slug,
    }));
}
