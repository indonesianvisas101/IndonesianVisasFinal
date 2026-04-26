"use client";

import React from "react";
import Link from "next/link";
import { 
    ShieldCheck, 
    MessageSquare, 
    Mail, 
    ArrowRight, 
    CheckCircle2, 
    Globe, 
    FileText, 
    CreditCard, 
    Building2, 
    Briefcase, 
    UserCheck,
    Search,
    Map
} from "lucide-react";

interface IdentityGuideTemplateProps {
    title: string;
    description: string;
    sections: {
        title: string;
        content: string;
    }[];
}

const IdentityGuideTemplate: React.FC<IdentityGuideTemplateProps> = ({ title, description, sections }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] transition-colors duration-300">
            {/* 1. HERO SECTION */}
            <header className="pt-40 pb-20 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900/10">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 text-primary mb-6 font-black tracking-widest uppercase text-sm italic">
                            <Map size={24} />
                            Bali Legal Identity guide
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mode-aware-text tracking-tighter mb-8 leading-none">
                            {title}
                        </h1>
                        <p className="text-xl md:text-2xl mode-aware-subtext max-w-3xl font-medium leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </header>

            {/* 2. MAIN CONTENT GRID */}
            <div className="container mx-auto px-4 py-24">
                <div className="grid lg:grid-cols-12 gap-16 max-w-7xl mx-auto">
                    
                    {/* LEFT: CONTENT SECTIONS */}
                    <main className="lg:col-span-8 space-y-20">
                        {sections.map((section, idx) => (
                            <section key={idx} className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-xl">
                                        {idx + 1}
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black mode-aware-text tracking-tight uppercase">
                                        {section.title}
                                    </h2>
                                </div>
                                <div className="text-lg mode-aware-subtext leading-relaxed font-medium whitespace-pre-wrap">
                                    {section.content}
                                </div>
                            </section>
                        ))}
                    </main>

                    {/* RIGHT: STICKY CONTACT CTA & SERVICES */}
                    <aside className="lg:col-span-4 space-y-8">
                        <div className="sticky top-32 space-y-8">
                            
                            {/* PREMIUM CONTACT CTA */}
                            <div className="glass-card p-10 rounded-[3rem] border border-primary/20 bg-primary/5 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-12 -translate-y-12" />
                                
                                <h3 className="text-2xl font-black mode-aware-text mb-6">Need Legal Help in Bali?</h3>
                                <p className="mode-aware-subtext mb-8 font-bold">Our experts provide 1-on-1 legal assistance for Foreigner ID & Residency in Bali.</p>
                                
                                <div className="space-y-4">
                                    <Link 
                                        href="https://wa.me/628123456789" // Example WA
                                        target="_blank"
                                        className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-black text-white shadow-xl hover:scale-105 active:scale-95 transition-all"
                                        style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
                                    >
                                        <MessageSquare size={24} /> WhatsApp Us Now
                                    </Link>
                                    
                                    <Link 
                                        href="https://wa.me/628123456789" // Example WA
                                        target="_blank"
                                        className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-black text-white shadow-xl hover:scale-105 active:scale-95 transition-all"
                                        style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' }}
                                    >
                                        <Mail size={24} /> Email Consultation
                                    </Link>
                                </div>

                                <div className="mt-8 flex items-center justify-center gap-3 text-xs font-black mode-aware-text uppercase tracking-widest opacity-60">
                                    <ShieldCheck size={16} /> Verified Legal Service
                                </div>
                            </div>

                            {/* OTHER SERVICES LIST */}
                            <div className="glass-card p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 space-y-8">
                                <h3 className="text-xl font-black mode-aware-text uppercase tracking-tight">Our Local ID Services</h3>
                                <ul className="space-y-6">
                                    {[
                                        { name: "Indonesian ID Card (SKP/KTP)", icon: UserCheck },
                                        { name: "Indonesian Family Card (KK)", icon: Building2 },
                                        { name: "Drivers Licence Card (SIM)", icon: CreditCard },
                                        { name: "Police Clearance (SKCK)", icon: Briefcase },
                                        { name: "Bank Account Opening", icon: Globe }
                                    ].map((service, sIdx) => (
                                        <li key={sIdx} className="flex items-center gap-4 group cursor-pointer">
                                            <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                                <service.icon size={20} />
                                            </div>
                                            <span className="font-bold mode-aware-text group-hover:text-primary transition-colors">{service.name}</span>
                                        </li>
                                    ))}
                                </ul>
                                
                                <Link 
                                    href="/services" 
                                    className="flex items-center gap-2 text-sm font-black text-primary uppercase tracking-widest pt-4 border-t border-slate-200 dark:border-white/5"
                                >
                                    View All Services <ArrowRight size={16} />
                                </Link>
                            </div>

                        </div>
                    </aside>
                </div>
            </div>

            {/* 3. SEO FOOTER SECTION */}
            <section className="py-32 border-t border-slate-200 dark:border-white/5">
                <div className="container mx-auto px-4 text-center space-y-12 max-w-4xl mx-auto">
                    <h2 className="text-4xl font-black mode-aware-text tracking-tighter capitalize underline decoration-primary/20 decoration-8 underline-offset-8">
                        Stay Legal. Stay in Bali.
                    </h2>
                    <p className="text-xl mode-aware-subtext leading-relaxed font-medium">
                        Since 2008, Indonesian Visas has been the premier choice for expats navigating the complexities of local identity documents. Whether you reside in Canggu, Ubud, Uluwatu, or Seminyak, our local agents understand the unique requirements of the Bali Disdukcapil and the involvement of the local Banjar community. Don't risk your residency with amateur services—trust the agency with over 16 years of legal immigration experience.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/services" className="px-8 py-4 bg-primary text-black rounded-2xl font-black shadow-lg hover:scale-105 transition-all">Start Your Application</Link>
                        <Link href="/faq" className="px-8 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 mode-aware-text rounded-2xl font-black shadow-lg hover:scale-105 transition-all">Identity FAQ Guide</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default IdentityGuideTemplate;
