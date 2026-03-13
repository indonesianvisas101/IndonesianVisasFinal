import React from "react";
import dynamic from "next/dynamic";
import { Star, MapPin, ShieldCheck, FileText, CheckCircle, PhoneCall as PhoneCallIcon, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getMessages } from "@/i18n/getMessages";

// Lazy Load Components
const AboutFullExpansion = dynamic(() => import("@/components/sections/AboutFullExpansion"), {
    loading: () => <div className="h-64 flex items-center justify-center text-gray-400">Loading Full Details...</div>
});
const WhyChooseUs = dynamic(() => import("@/components/sections/WhyChooseUs"), {
    loading: () => <div className="h-64 flex items-center justify-center text-gray-400">Loading Features...</div>
});
const GoogleReviews = dynamic(() => import("@/components/sections/GoogleReviews"), {
    loading: () => <div className="h-64 flex items-center justify-center text-gray-400">Loading Reviews...</div>
});

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = await getMessages(locale);
    const t = dict?.about_page || {};

    return (
        <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300">
            {/* HERO SECTION - Deep Brand Gradient */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-60" />
                <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex flex-wrap justify-center gap-4 mb-8 translate-y-0 animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm transition-all hover:border-primary/30 group">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-sm font-bold mode-aware-text">{t.hero_since || "Since 2010"}</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 shadow-sm transition-all hover:bg-primary/10 group">
                                <ShieldCheck size={16} className="text-primary" />
                                <span className="text-sm font-bold text-primary">{t.hero_legal_badge || "Legal and Registered Company"}</span>
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 mode-aware-text tracking-tight animate-fade-in-up [animation-delay:200ms]">
                            {t.hero_title || "Your Trusted Partner in Indonesia"}
                        </h1>
                        <p className="text-xl md:text-2xl mode-aware-subtext max-w-2xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:400ms]">
                            {t.hero_description || "We are more than just a visa agency. We are your legal gateway to living, working, and thriving in Indonesia. With over 16 years of dedicated service, we have helped over 10,000+ travelers and businesses navigate the regulations."}
                        </p>
                        
                        {/* Legal Registration Block */}
                        <div className="mt-8 inline-block text-left bg-white/50 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 p-6 rounded-2xl animate-fade-in-up [animation-delay:600ms] shadow-sm">
                            <h3 className="text-xs font-bold text-primary mb-3 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck size={14} /> Official Registration
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm mode-aware-text font-mono">
                                <div><span className="opacity-60 text-[11px] uppercase tracking-wider block mb-0.5">Entity</span> PT Indonesian Visas Agency</div>
                                <div><span className="opacity-60 text-[11px] uppercase tracking-wider block mb-0.5">NIB</span> 0402260034806</div>
                                <div><span className="opacity-60 text-[11px] uppercase tracking-wider block mb-0.5">License</span> 04022610215171007</div>
                                <div><span className="opacity-60 text-[11px] uppercase tracking-wider block mb-0.5">AHU</span> AHU-00065.AH.02.01.TAHUN 2020</div>
                                <div className="sm:col-span-2"><span className="opacity-60 text-[11px] uppercase tracking-wider block mb-0.5">Official Immigration Sponsor</span> 2010, 2014, 2023, 2024, 2026</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS GRID - Floating Card Design */}
            <section className="py-12 relative z-20 -mt-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
                        {[
                            { label: t.stats?.years || "Years Experience", value: "16+", icon: ShieldCheck },
                            { label: t.stats?.processed || "Visas Processed", value: "10k+", icon: FileText },
                            { label: t.stats?.success || "Success Rate", value: "99%", icon: CheckCircle },
                            { label: t.stats?.support || "Support Avail.", value: "24/7", icon: PhoneCallIcon },
                        ].map((stat, i) => (
                            <div key={i} className="glass-card p-8 rounded-3xl text-center group hover:border-primary/50 transition-all duration-500 hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <stat.icon size={28} />
                                </div>
                                <div className="text-3xl font-black mode-aware-text mb-1">{stat.value}</div>
                                <div className="text-sm font-bold mode-aware-subtext uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT AREA */}
            <main className="container mx-auto px-4 py-20">
                <div className="max-w-7xl mx-auto space-y-32">

                    {/* Mission Section */}
                    <AboutFullExpansion dict={dict} />

                    {/* Why Choose Us Section with custom styling */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/5 rounded-[3rem] -rotate-1 scale-105" />
                        <WhyChooseUs dict={dict} />
                    </div>

                    {/* Ecosystem Section */}
                    <section className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[500px] rounded-[3rem] overflow-hidden group">
                            <Image
                                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop"
                                alt="Bali Enterprises Headquarters"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 shadow-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-10 left-10 text-white">
                                <p className="text-primary font-bold uppercase tracking-widest mb-2">{t.bali_enterprises_subtitle || "Global Headquarters"}</p>
                                <h3 className="text-3xl font-black">{dict?.footer?.brand_title || "Indonesian Visas"}</h3>
                            </div>
                        </div>
                        <div className="space-y-8 lg:p-12">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black mode-aware-text leading-tight">
                                    {t.bali_enterprises_title || "Part of Bali Enterprises Ecosystem"}
                                </h2>
                                <p className="text-xl mode-aware-subtext leading-relaxed">
                                    {t.bali_enterprises_p1 || "Indonesian Visas is a key subsidiary of Bali Enterprises, the premier gateway for international investment and strategic partnerships in Indonesia."}
                                </p>
                                <p className="text-lg mode-aware-subtext leading-relaxed opacity-80">
                                    {t.bali_enterprises_p2 || "We combine international standards of governance with deep local execution strength, connecting global vision with Indonesian opportunity."}
                                </p>
                            </div>
                            <Link
                                href="https://bali.enterprises"
                                target="_blank"
                                className="inline-flex items-center gap-4 px-8 py-4 text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-xl hover:shadow-[#9155FD]/20 group"
                                style={{ backgroundColor: '#9155FD' }}
                            >
                                {t.bali_enterprises_cta || "Explore the Ecosystem"}
                                <ArrowRight className="transition-transform group-hover:translate-x-2" />
                            </Link>
                        </div>
                    </section>

                    {/* Team Section */}
                    <section className="space-y-16">
                        <div className="max-w-3xl mx-auto text-center space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black mode-aware-text">Our Dedicated Team</h2>
                            <p className="text-xl mode-aware-subtext">Meet the experts behind your seamless Indonesian journey. Our team combines decades of legal expertise with a passion for world-class service.</p>
                        </div>
                        <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl group">
                            <Image
                                src="/images/IndonesianVisas/Team.webp"
                                alt="Indonesian Visas Agency Team"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        </div>
                    </section>

                    {/* Social Proof Section */}
                    <section className="text-center space-y-12">
                        <div className="space-y-4">
                            <div className="flex justify-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={28} className="fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <h2 className="text-4xl font-black mode-aware-text">{t.reviews_title || "What they say About Us"}</h2>
                            <p className="font-bold mode-aware-subtext">{t.reviews_based_on || "Based on 100+ reviews"}</p>
                        </div>
                        <GoogleReviews dict={dict} />
                        <div className="pt-8 flex justify-center">
                            <Link
                                href={`/${locale}/reviews`}
                                target="_blank"
                                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 mode-aware-text font-bold hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                <Image src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_92x30dp.png" alt="Google" width={60} height={20} className="dark:invert dark:opacity-70" />
                                {t.reviews_cta || "Review Us on Google"}
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
