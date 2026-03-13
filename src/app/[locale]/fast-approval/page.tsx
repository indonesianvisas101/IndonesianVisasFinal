import React from "react";
import { Zap, Clock, Rocket, ShieldCheck, ZapOff, CheckCircle, ArrowRight, Timer, Headphones } from "lucide-react";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionWrapper from "@/components/layout/SectionWrapper";
import Image from "next/image";

export default function FastApprovalPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = React.use(params);
    return (
        <PageWrapper className="bg-white dark:bg-[#030712] transition-colors duration-300">
            {/* 1. HERO */}
            <section className="relative pt-32 pb-20 overflow-hidden text-center bg-slate-900 border-b border-white/5">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-30" />
                 <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-black uppercase tracking-widest border border-primary/30">
                            <Rocket size={16} /> VIP Express Lane
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
                            Fast Approval <br/> Services
                        </h1>
                        <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                            Need your Indonesian visa in a matter of hours? Our specialized express lane bypasses standard delays for urgent travel.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. TIMELINE GRID */}
            <SectionWrapper id="fast-timeline" className="py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { time: "1-4 Hours", title: "Instant e-VOA", desc: "Best for last-minute flights and emergency travel.", icon: Zap },
                        { time: "24-48 Hours", title: "Express B211A", desc: "Fast-track for business meetings and social visits.", icon: TimerIcon },
                        { time: "Priority Slot", title: "VIP KITAS", desc: "Front-of-the-line processing for stay permits.", icon: ShieldCheck },
                    ].map((item, i) => (
                        <div key={i} className="p-10 rounded-[2.5rem] glass-card border-slate-200 dark:border-white/10 group hover:border-primary/50 transition-all duration-500">
                             <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <item.icon size={32} />
                             </div>
                             <div className="text-4xl font-black mode-aware-text mb-2">{item.time}</div>
                             <h3 className="text-xl font-bold mode-aware-text mb-4">{item.title}</h3>
                             <p className="text-sm mode-aware-subtext leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </SectionWrapper>

            {/* 3. HOW WE DO IT */}
            <SectionWrapper id="how-it-works-fast" className="py-24 bg-slate-50 dark:bg-white/5 rounded-[4rem]">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                        <h2 className="text-4xl md:text-6xl font-black mode-aware-text leading-tight">Technology Meets Local Execution</h2>
                        <div className="space-y-8">
                            {[
                                { title: "API Direct Integration", desc: "Our system connects directly to the Indonesian Immigration portal for sub-second submission." },
                                { title: "24/7 Response Team", desc: "Dedicated officers working around the clock across multiple time zones." },
                                { title: "Priority Document Audit", desc: "Instant AI-powered verification of your passport and requirements." }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-6">
                                    <div className="text-4xl font-black text-primary/20">0{i+1}</div>
                                    <div className="space-y-1">
                                        <h4 className="text-xl font-bold mode-aware-text">{step.title}</h4>
                                        <p className="mode-aware-subtext text-sm leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl skew-y-3">
                         <Image src="/images/visa/B211A.webp" alt="Fast Processing" fill className="object-cover" />
                         <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/90 dark:bg-black/90 p-8 rounded-3xl shadow-2xl border border-white/20 text-center animate-bounce">
                                <Zap className="text-primary mx-auto mb-2" size={48} />
                                <div className="text-2xl font-black mode-aware-text tracking-tighter">PROCESSING NOW</div>
                                <div className="text-xs font-bold text-primary">ESTIMATED: 55 MIN</div>
                            </div>
                         </div>
                    </div>
                </div>
            </SectionWrapper>

            {/* 4. SUCCESS METRICS */}
            <SectionWrapper id="metrics" className="py-24 text-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
                    {[
                        { label: "Record Approval", value: "32min" },
                        { label: "Successful Urgent", value: "5,000+" },
                        { label: "National Reach", value: "24 Ports" },
                        { label: "Global Rating", value: "4.9/5" },
                    ].map((m, i) => (
                        <div key={i} className="space-y-2">
                            <div className="text-4xl font-black text-primary">{m.value}</div>
                            <div className="text-xs font-bold mode-aware-subtext uppercase tracking-widest">{m.label}</div>
                        </div>
                    ))}
                </div>
            </SectionWrapper>

            {/* 5. EXPERT SUPPORT */}
            <SectionWrapper id="expert-support" className="py-24">
                <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-white text-center space-y-10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center -rotate-12 scale-150 pointer-events-none">
                        <Zap size={400} className="opacity-5" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-4xl md:text-6xl font-black">Need It Even Faster?</h2>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
                            For extremely complex cases or immediate departures, our premium concierges can provide manual oversight on your application.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                            <Link href="https://wa.me/6285727041992" className="w-full sm:w-auto px-12 py-5 bg-white text-black text-xl font-black rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-3">
                                <Headphones /> Emergency WhatsApp
                            </Link>
                            <Link href={`/${locale}/apply`} className="w-full sm:w-auto px-12 py-5 bg-black/20 backdrop-blur-md text-white border border-white/30 text-xl font-black rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                                Apply Express <ArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </PageWrapper>
    );
}

const TimerIcon = ({ size }: { size?: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer"><path d="M10 2h4"/><path d="M12 14v-4"/><path d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6"/><path d="M9 17H4v5"/></svg>;
