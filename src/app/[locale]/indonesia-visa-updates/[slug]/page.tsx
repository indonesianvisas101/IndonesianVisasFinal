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
        <SEOPageLayout
            title={update.title}
            description={update.summary || update.content.substring(0, 160)}
        >
            <article className="min-h-screen bg-slate-50 dark:bg-[#030712] transition-colors duration-500">
                {/* PREMIUM HERO SECTION */}
                <div className="relative pt-40 pb-20 overflow-hidden">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto">
                            <Link 
                                href={`/${locale}/indonesia-visa-updates`}
                                className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs mb-8 group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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

                            <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-10 italic">
                                {update.title}
                            </h1>

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

                {/* CONTENT SECTION */}
                <div className="container mx-auto px-4 pb-24">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid lg:grid-cols-[1fr_250px] gap-16">
                            {/* Main Content */}
                            <div>
                                {update.image && (
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

                                <div className="prose prose-slate dark:prose-invert prose-lg max-w-none 
                                    prose-headings:font-black prose-headings:tracking-tight prose-headings:italic
                                    prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-xl
                                    prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-black
                                    prose-ul:list-none prose-ul:pl-0
                                    prose-li:bg-slate-100 dark:prose-li:bg-white/5 prose-li:p-6 prose-li:rounded-2xl prose-li:mb-4 prose-li:border prose-li:border-slate-200 dark:prose-li:border-white/10
                                ">
                                    {update.content.split('\n').map((para, i) => {
                                        const trimmed = para.trim();
                                        if (!trimmed) return <br key={i} />;
                                        
                                        // Detect lists based on markdown-ish bullets
                                        if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
                                            return <p key={i} className="flex gap-4 items-center">
                                                <Zap className="text-primary shrink-0" size={18} />
                                                <span>{trimmed.substring(1).trim()}</span>
                                            </p>;
                                        }

                                        return <p key={i}>{trimmed}</p>;
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

                        {/* AUTHOR FOOTER */}
                        <footer className="mt-24 pt-16 border-t border-slate-200 dark:border-white/5">
                            <div className="flex flex-wrap items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-3xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-black">
                                        <Newspaper size={32} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Official Intelligence Source</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white italic">Indonesian Visas Agency Team</p>
                                    </div>
                                </div>
                                <Link 
                                    href={`/${locale}/indonesia-visa-guide-2026`}
                                    className="px-10 py-5 rounded-2xl bg-primary text-black font-black hover:shadow-2xl hover:shadow-primary/40 transition-all hover:-translate-y-1"
                                >
                                    Read Ultimate Guide 2026
                                </Link>
                            </div>
                        </footer>
                    </div>
                </div>
            </article>
        </SEOPageLayout>
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
