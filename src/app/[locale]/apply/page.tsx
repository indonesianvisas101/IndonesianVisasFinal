import React from "react";
import VisaCatalog from "@/components/visa/VisaCatalog";
import { ShieldCheck, FileText, CreditCard, Zap, Search, Headphones, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import PageWrapper from "@/components/layout/PageWrapper";
import SectionWrapper from "@/components/layout/SectionWrapper";

export default function ApplyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = React.use(params);
    return (
        <PageWrapper className="transition-colors duration-300">
            {/* Main Hero / Catalog Section */}
            <SectionWrapper id="apply-intro" className="relative z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />

                <div className="text-center mb-16 pt-8">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 border border-primary/20 backdrop-blur-sm">
                        Visa Services
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight leading-tight">
                        Apply For A Visa
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Choose from our most valid visa options. Real-time processing, secure payment, and 99% approval rate.
                    </p>
                </div>

                {/* Catalog handles listing popular visas first */}
                <VisaCatalog />
            </SectionWrapper>

            {/* NEW SECTIONS FOR EXPANSION */}
            
            {/* 1. Document Readiness */}
            <SectionWrapper id="document-readiness" className="py-20 bg-slate-50 dark:bg-white/5">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <FileText size={32} />
                        </div>
                        <h2 className="text-4xl font-black mode-aware-text">Smart Document Analysis</h2>
                        <p className="text-lg mode-aware-subtext leading-relaxed">
                            Our proprietary verification engine automatically checks your passport and documents for common errors before submission. This reduces rejection rates by 85% and ensures your application is perfect the first time.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "AI-Powered Photo Validation",
                                "Passport Validity Verification",
                                "Sponsor Letter Matching",
                                "Automatic OCR Extraction"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 font-bold mode-aware-text text-sm">
                                    <ShieldCheck size={18} className="text-primary" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative h-[400px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-white/10">
                        <Image src="/images/pages/immigration-hub.webp" alt="Document Verification" fill className="object-cover" />
                    </div>
                </div>
            </SectionWrapper>

            {/* 2. Multi-Layer Security */}
            <SectionWrapper id="security" className="py-24 text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-bold border border-emerald-500/20">
                        <ShieldCheck size={16} /> 256-bit Encryption
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mode-aware-text">Bank-Level Privacy as Standard</h2>
                    <p className="text-xl mode-aware-subtext">
                        Your personal data and passport biometrics are encrypted at rest and in transit. We are fully compliant with Indonesian and International data protection laws (GDPR parity).
                    </p>
                </div>
            </SectionWrapper>

            {/* 3. Real-Time Tracking Visualization */}
            <SectionWrapper id="tracking" className="py-20">
                <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="grid lg:grid-cols-2 gap-16 relative z-10 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-black">Track Every Milestone</h2>
                            <p className="text-xl text-white/70">
                                No more guessing. Our interactive dashboard provides minute-by-minute updates as your visa moves through verification, submission, and final approval.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { label: "Submitted to Immigration", status: "Completed", icon: Search },
                                    { label: "Internal Verification", status: "Completed", icon: ShieldCheck },
                                    { label: "Government Processing", status: "Active", icon: Clock },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                                        <item.icon className={item.status === 'Completed' ? 'text-emerald-400' : 'text-primary'} />
                                        <div className="flex-1">
                                            <div className="font-bold">{item.label}</div>
                                            <div className="text-xs opacity-60">{item.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative aspect-video bg-white/5 rounded-3xl border border-white/10 p-2 overflow-hidden">
                           <Image src="/images/pages/indonesian-global-logistics.webp" alt="Tracking Dashboard" fill className="object-contain opacity-80" />
                        </div>
                    </div>
                </div>
            </SectionWrapper>

            {/* 4. Global Payment Gateway */}
            <SectionWrapper id="payments" className="py-24">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black mode-aware-text tracking-tight">Flexible Payment Options</h2>
                    <p className="text-xl mode-aware-subtext max-w-2xl mx-auto">Pay securely with your preferred method. We support over 20+ international and local Indonesian payment channels.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                    {[
                        { name: "Credit/Debit", icon: CreditCard },
                        { name: "QRIS / Local Bank", icon: Zap },
                        { name: "PayPal / Stripe", icon: Headphones },
                        { name: "Crypto (Soon)", icon: ShieldCheck },
                    ].map((method, i) => (
                        <div key={i} className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 text-center border border-slate-200 dark:border-white/10 group hover:border-primary/50 transition-all">
                            <method.icon size={32} className="mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                            <div className="font-bold mode-aware-text">{method.name}</div>
                        </div>
                    ))}
                </div>
            </SectionWrapper>

            {/* 5. Custom Visa Solutions (Modified) */}
            <SectionWrapper id="custom-solution" fullWidth noBottomMargin className="relative py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
                        {/* Gradient Accents */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white">
                                Need a Custom Visa Solution?
                            </h2>
                            <p className="mb-10 text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                                If you don't see what you're looking for, or need a complex KITAS arrangement, our specialists are here to help.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Link
                                    href={`/${locale}/contact`}
                                    className="w-full sm:w-auto px-10 py-5 text-base font-bold text-slate-900 transition-all duration-200 bg-white rounded-2xl hover:bg-gray-100 hover:scale-105 active:scale-95"
                                >
                                    Contact Support
                                </Link>
                                <Link
                                    href={`/${locale}/extend`}
                                    className="w-full sm:w-auto px-10 py-5 text-base font-bold text-white transition-all duration-200 bg-primary rounded-2xl border border-primary/20 hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                                >
                                    Extend Visa
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </PageWrapper>
    );
}
