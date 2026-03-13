import React from 'react';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Calendar, Tag, ChevronLeft, Share2, Facebook, Twitter, MessageSquare, Newspaper } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

export default async function SingleUpdatePage({ params }: { params: { locale: string; slug: string } }) {
    const { locale, slug } = params;

    const update = await prisma.immigrationUpdate.findUnique({
        where: { slug }
    });

    if (!update || !update.published) {
        notFound();
    }

    return (
        <SEOPageLayout
            title={update.title}
            description={update.summary || update.title}
        >
            <div className="pt-32 pb-20 bg-black min-h-screen">
                <div className="container mx-auto px-4">
                    {/* Back Button */}
                    <Link 
                        href={`/${locale}/indonesia-visa-updates`}
                        className="inline-flex items-center text-white/50 hover:text-primary transition-colors mb-8 group"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Updates
                    </Link>

                    <div className="max-w-4xl mx-auto">
                        <div className="mb-10">
                            <div className="px-4 py-1.5 bg-primary text-black text-xs font-black rounded-full uppercase inline-block mb-6 tracking-widest">
                                {update.category}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
                                {update.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-white/50 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Published on {new Date(update.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    <span>Legal & Immigration</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                                        <Image src="/Logo.webp" width={24} height={24} alt="AV" />
                                    </div>
                                    <span className="font-bold text-white/80">Indonesian Visas Agency</span>
                                </div>
                            </div>
                        </div>

                        {update.image && (
                            <div className="relative h-[400px] md:h-[500px] w-full rounded-[40px] overflow-hidden mb-12 border border-white/10 shadow-2xl">
                                <Image 
                                    src={update.image} 
                                    alt={update.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Main Content */}
                            <div className="lg:col-span-8">
                                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:text-white prose-p:text-white/70 prose-strong:text-primary prose-a:text-primary hover:prose-a:underline">
                                    <ReactMarkdown>{update.content}</ReactMarkdown>
                                </div>

                                {/* Bottom Share */}
                                <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <span className="text-white/50 text-sm font-bold uppercase tracking-widest">Share this:</span>
                                        <div className="flex gap-2">
                                            {[Facebook, Twitter, Share2].map((Icon, i) => (
                                                <button key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-primary hover:text-black hover:border-primary transition-all">
                                                    <Icon className="w-4 h-4" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <Link 
                                        href={`/${locale}/contact`}
                                        className="inline-flex items-center gap-2 bg-primary text-black font-black px-6 py-3 rounded-2xl hover:scale-105 transition-all"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        Speak to an Expert
                                    </Link>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-4">
                                <div className="sticky top-32 space-y-8">
                                    {/* Sidebar Card 1: Related Visas */}
                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                                        <h4 className="text-xl font-black text-white mb-4">Related Solutions</h4>
                                        <div className="space-y-4">
                                            {['B211A Business', 'Visit Visa on Arrival', 'Digital Nomad KITAS'].map((visa, i) => (
                                                <Link key={i} href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                                                    <span className="text-white/80 group-hover:text-primary transition-colors">{visa}</span>
                                                    <ChevronLeft className="w-4 h-4 text-white/20 rotate-180 group-hover:text-primary" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sidebar Card 2: Support */}
                                    <div className="bg-primary rounded-3xl p-6 text-black relative overflow-hidden group">
                                        <div className="relative z-10">
                                            <h4 className="text-xl font-black mb-2">Need Help?</h4>
                                            <p className="text-sm font-medium opacity-80 mb-6">Our legal experts are available 24/7 to answer your immigration questions.</p>
                                            <Link href={`/${locale}/contact`} className="block w-full text-center bg-black text-white font-black py-4 rounded-xl hover:bg-white hover:text-black transition-all">
                                                Contact Support
                                            </Link>
                                        </div>
                                        <Newspaper className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SEOPageLayout>
    );
}
