"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { formatNavLink } from "@/utils/seo";
import QuickApplicationModal from "@/components/application/QuickApplicationModal";
import { Zap, ArrowRight } from "lucide-react";

interface ServicesHeroProps {
    locale: string;
    t: any;
}

const ServicesHero: React.FC<ServicesHeroProps> = ({ locale, t }) => {
    const [isQuickApplyOpen, setIsQuickApplyOpen] = useState(false);

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-60" />
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 blur-[100px] rounded-full animate-pulse [animation-delay:2000ms]" />
            
            <div className="container relative z-10 mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="text-center lg:text-left space-y-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm"
                    >
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-black mode-aware-text uppercase tracking-widest">{t.hero_subtitle || "Trusted Visa Partner"}</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-6xl md:text-8xl font-black mode-aware-text tracking-tighter leading-[0.9]"
                    >
                        {t.hero_title || "Your Passport to Paradise"}
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl md:text-3xl mode-aware-subtext leading-relaxed max-w-3xl mx-auto font-medium"
                    >
                        {t.hero_description || "Professional, secure, and expedited visa processing. We handle the bureaucracy so you can focus on your journey."}
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap gap-6 justify-center lg:justify-start"
                    >
                        <Link href="#catalog" className="group relative px-10 py-5 bg-primary text-black font-black rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all overflow-hidden flex items-center gap-2">
                            <span>Explore Services</span>
                            <ArrowRight size={20} />
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                        </Link>
                        <button 
                            onClick={() => setIsQuickApplyOpen(true)}
                            className="px-10 py-5 bg-[#4B0082] text-white font-black rounded-2xl shadow-2xl shadow-[#4B0082]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group border border-white/10"
                        >
                            <Zap size={20} className="group-hover:animate-bounce" />
                            <span>Quick Application</span>
                        </button>
                    </motion.div>
                </div>

                {/* Right Column: Hero Image */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative hidden lg:block"
                >
                    <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl border border-white/10">
                        <img 
                            src="/images/IndonesianVisas/indonesia.webp" 
                            alt="Indonesian Visa Services" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                    {/* Floating Decorative Card */}
                    <div className="absolute -bottom-6 -left-6 p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-white/5 animate-float">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-black">10k+</div>
                            <div>
                                <p className="text-sm font-black mode-aware-text uppercase tracking-widest">Happy Travelers</p>
                                <p className="text-[10px] mode-aware-subtext">Certified & Verified</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

            {/* Quick Apply Modal */}
            <AnimatePresence>
                {isQuickApplyOpen && (
                    <QuickApplicationModal 
                        isOpen={isQuickApplyOpen} 
                        onClose={() => setIsQuickApplyOpen(false)} 
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default ServicesHero;
