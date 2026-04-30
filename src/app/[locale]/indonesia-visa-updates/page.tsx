import React from 'react';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@mui/material';
import { Newspaper, Calendar, ArrowRight, Tag, Zap } from 'lucide-react';
import Image from 'next/image';

import SubscriptionForm from '@/components/forms/SubscriptionForm';

export const dynamic = 'force-dynamic';

export default async function NewsFeedPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    
    const updates = await prisma.immigrationUpdate.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <main className="min-h-screen bg-black overflow-x-hidden">
            {/* PRE-HEADER SPACE */}
            <div className="h-20 bg-black" />

            {/* HERO SECTION - EDGE TO EDGE */}
            <section className="relative pt-32 pb-24 bg-black border-b border-white/5 overflow-hidden">
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/30 mb-8">
                            <Newspaper className="w-4 h-4" />
                            <span className="text-sm font-black uppercase tracking-wider">Intelligence Feed</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8">
                            Indonesia <span className="text-primary italic">Visa News</span> <br className="hidden md:block" /> & Legal Updates.
                        </h1>
                        <p className="text-xl md:text-2xl text-white/50 max-w-3xl leading-relaxed">
                            Real-time intelligence on Indonesian immigration policies, visa regulations, and travel requirements to ensure your journey stays on track.
                        </p>
                    </div>
                </div>

                {/* Cybernetic Background Glow */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            </section>

            <section className="py-24 bg-[#050505]">
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
                    {updates.length === 0 ? (
                        <div className="max-w-2xl mx-auto text-center py-32 border-2 border-dashed border-white/10 rounded-[3rem]">
                            <Newspaper className="w-20 h-20 text-white/10 mx-auto mb-8" />
                            <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">No intelligence reports yet</h3>
                            <p className="text-white/40 text-lg">Our legal team is finalizing the latest immigration audits. Check back soon.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
                            {updates.map((update: any) => (
                                <Link 
                                    key={update.id} 
                                    href={`/${locale}/indonesia-visa-updates/${update.slug}`}
                                    className="group flex flex-col bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.08] hover:border-primary/40 transition-all duration-700 hover:-translate-y-2 shadow-2xl"
                                >
                                    <div className="relative h-80 w-full overflow-hidden">
                                        {update.image && 
                                         !update.image.includes('gemini.google.com') && 
                                         !update.image.includes('drive.google.com') ? (
                                            <Image 
                                                src={update.image} 
                                                alt={update.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center group-hover:scale-110 transition-transform duration-[1.5s]">
                                                <Newspaper className="w-16 h-16 text-white/20" />
                                            </div>
                                        )}
                                        
                                        {/* Overlay Tags */}
                                        <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                            <div className="px-4 py-1.5 bg-primary/90 backdrop-blur-md text-black text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">
                                                {update.category}
                                            </div>
                                        </div>

                                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
                                    </div>

                                    <div className="p-10 flex-grow flex flex-col">
                                        <div className="flex items-center gap-6 text-white/30 text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                                <span>{new Date(update.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-3.5 h-3.5 text-primary" />
                                                <span>Audit Clear</span>
                                            </div>
                                        </div>

                                        <h2 className="text-2xl md:text-3xl font-black text-white group-hover:text-primary transition-colors duration-500 leading-[1.1] tracking-tight mb-6">
                                            {update.title}
                                        </h2>

                                        <p className="text-white/40 text-lg leading-relaxed mb-10 line-clamp-3 font-medium">
                                            {update.summary || update.content.substring(0, 160).replace(/[#*]/g, '') + '...'}
                                        </p>

                                        <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                                            <span className="inline-flex items-center gap-3 text-primary text-xs font-black uppercase tracking-widest group-hover:gap-5 transition-all duration-500">
                                                Read Intelligence Report
                                                <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* SUBSCRIPTION HARDENING */}
            <section className="py-32 bg-black border-t border-white/5">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-primary/20">
                        <Zap className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
                        Stay Ahead of the <span className="text-primary italic">Bureaucracy</span>.
                    </h2>
                    <p className="text-white/40 text-xl mb-12 max-w-2xl mx-auto font-medium">
                        Join 5,000+ global citizens receiving weekly Indonesian immigration intelligence directly to their inbox.
                    </p>
                    <div className="max-w-md mx-auto">
                        <SubscriptionForm />
                    </div>
                </div>
            </section>
        </main>
    );
}
