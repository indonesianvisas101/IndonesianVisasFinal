import React from 'react';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@mui/material';
import { Newspaper, Calendar, ArrowRight, Tag } from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function NewsFeedPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    
    const updates = await prisma.immigrationUpdate.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <SEOPageLayout
            title="Indonesia Immigration Updates 2026"
            description="The latest news, policy changes, and immigration updates for Indonesia. Stay informed about KITAS, B211A, and Visa on Arrival regulations."
        >
            <div className="relative pt-32 pb-20 bg-black">
                {/* Hero Header */}
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/30 mb-6">
                            <Newspaper className="w-4 h-4" />
                            <span className="text-sm font-black uppercase tracking-wider">Live Updates</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
                            Indonesia <span className="text-primary italic text-stroke-thin">Visa News</span> & Legal Updates.
                        </h1>
                        <p className="text-xl text-white/70 max-w-2xl leading-relaxed">
                            Real-time intelligence on Indonesian immigration policies, visa regulations, and travel requirements to ensure your journey stays on track.
                        </p>
                    </div>
                </div>

                {/* Animated Background Elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent opacity-50 pointer-events-none" />
            </div>

            <section className="py-20 bg-[#0a0a0a]">
                <div className="container mx-auto px-4">
                    {updates.length === 0 ? (
                        <div className="max-w-2xl mx-auto text-center py-20 border-2 border-dashed border-white/10 rounded-3xl">
                            <Newspaper className="w-16 h-16 text-white/20 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-2">No updates yet</h3>
                            <p className="text-white/50">Our team is preparing the latest immigration reports. Check back soon.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {updates.map((update: any) => (
                                <Link 
                                    key={update.id} 
                                    href={`/${locale}/indonesia-visa-updates/${update.slug}`}
                                    className="group flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-primary/50 transition-all duration-500"
                                >
                                    <div className="relative h-64 w-full">
                                        {update.image ? (
                                            <Image 
                                                src={update.image} 
                                                alt={update.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-black flex items-center justify-center">
                                                <Newspaper className="w-12 h-12 text-primary/30" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <div className="px-3 py-1 bg-primary text-black text-xs font-black rounded-full uppercase">
                                                {update.category}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 flex-grow flex flex-col">
                                        <div className="flex items-center gap-4 text-white/40 text-xs mb-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{new Date(update.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Tag className="w-3 h-3" />
                                                <span>Immigration</span>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-4 group-hover:text-primary transition-colors leading-tight">
                                            {update.title}
                                        </h3>
                                        <p className="text-white/60 line-clamp-3 mb-6 text-sm leading-relaxed">
                                            {update.summary || update.content.substring(0, 150) + '...'}
                                        </p>
                                        <div className="mt-auto flex items-center text-primary font-bold text-sm">
                                            Read Full Update <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-20 bg-primary">
                <div className="container mx-auto px-4">
                    <SubscriptionBlock />
                </div>
            </section>
        </SEOPageLayout>
    );
}

function SubscriptionBlock() {
    const [email, setEmail] = React.useState('');
    const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubscribe = async () => {
        if (!email || !email.includes('@')) return;
        setStatus('loading');
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (res.ok) {
                setStatus('success');
                setEmail('');
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-black rounded-[40px] p-12 text-center relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Never Miss a Policy Change.</h2>
                <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                    Subscribe to our weekly immigration digest and stay ahead of the latest Indonesian visa regulations.
                </p>
                
                {status === 'success' ? (
                    <div className="bg-white/10 text-primary p-6 rounded-2xl font-bold animate-pulse">
                        Thanks for subscribing! Check your inbox soon.
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-grow bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all"
                        />
                        <button 
                            onClick={handleSubscribe}
                            disabled={status === 'loading'}
                            className="bg-primary text-black font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Joining...' : 'Subscribe'}
                        </button>
                    </div>
                )}
                {status === 'error' && <p className="text-red-500 mt-4 font-bold">Something went wrong. Please try again.</p>}
            </div>
            {/* Background Decoration */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
        </div>
    );
}
