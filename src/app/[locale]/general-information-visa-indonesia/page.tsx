import React from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { Metadata } from 'next';
import { generateCanonical } from "@/utils/seo";
import { ShieldCheck, FileText, Clock, CreditCard } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "General Information Visa Indonesia | Indonesian Visas Agency",
        description: "Comprehensive details on the Visitor Stay Permit (ITK), eligibility, Visa Types (Single or Multiple-Entry), extensions, and documents requirements in Indonesia.",
        alternates: {
            canonical: generateCanonical(locale, "/general-information-visa-indonesia"),
        },
    };
}

export default async function GeneralInformationPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300 pt-32 pb-20">
            <SectionWrapper>
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-black mode-aware-text mb-8 tracking-tighter">
                        General Information (Visitor Stay Permit)
                    </h1>

                    <div className="space-y-12 mode-aware-subtext leading-relaxed text-lg font-medium">
                        
                        {/* 1. Eligibility Section */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-black mode-aware-text flex items-center gap-2">
                                <ShieldCheck className="text-primary" /> 1. Eligibility & Granting
                            </h2>
                            <p>
                                The Visitor Stay Permit (ITK) can be granted to foreign nationals who enter the Indonesian Territory using:
                            </p>
                            <ul className="list-disc list-inside pl-4 space-y-1">
                                <li>Visitor Visa (Single or Multiple Entry)</li>
                                <li>Visa on Arrival (VoA / e-VoA)</li>
                                <li>Visa Exemption facilities at authorized Checkpoints</li>
                                <li>Crew members coming for duty</li>
                                <li>Children born in Indonesia whose parents hold an ITK</li>
                            </ul>
                        </section>

                        {/* 2. Visa Types & Extensions */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-black mode-aware-text flex items-center gap-2">
                                <Clock className="text-primary" /> 2. Stay Periods & Extensions
                            </h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                                    <h3 className="font-bold mode-aware-text mb-2 text-base">Single-Entry Visa (Index C)</h3>
                                    <p className="text-sm">
                                        Initial grant of 60 days. Can be extended up to a maximum stay of 180 days or 12 months for specific index types.
                                    </p>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                                    <h3 className="font-bold mode-aware-text mb-2 text-base">Multiple-Entry Visa (Index D)</h3>
                                    <p className="text-sm">
                                        Initial grant of 60 days per visit. Max total stay depends on sub-index allowances (extendable up to 180 days).
                                    </p>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                                    <h3 className="font-bold mode-aware-text mb-2 text-base">Visa on Arrival (Index B)</h3>
                                    <p className="text-sm">
                                        Granted for 30 days. Extendable once for an additional 30 days at content Immigration Offices.
                                    </p>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                                    <h3 className="font-bold mode-aware-text mb-2 text-base">Short-Visit VoA (Index F)</h3>
                                    <p className="text-sm">
                                        Granted for 7 days. Non-extendable and cannot be converted to other stay permits.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 3. Requirements */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-black mode-aware-text flex items-center gap-2">
                                <FileText className="text-primary" /> 3. Required Documentation
                            </h2>
                            <p>To process or extend your stay permit, the following documents are typically required:</p>
                            <ul className="list-disc list-inside pl-4 space-y-2">
                                <li>A valid Passport (minimum 6 months validity remaining).</li>
                                <li>Scanned copy of your current Visa seal or arrival stamp.</li>
                                <li>Letter of Guarantee from a local Sponsor (if applicable, e.g., for B211A extensions).</li>
                                <li>A bank statement proving sufficient living expenses during stay.</li>
                                <li>Statement of Purpose or onward travel itineraries.</li>
                            </ul>
                        </section>

                        {/* 4. Procedure & Timing */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-black mode-aware-text flex items-center gap-2">
                                <CreditCard className="text-primary" /> 4. Pricing & Processing Speed
                            </h2>
                            <p>
                                Application takes approximately **3 working days** for standard processing from the time payment verification is completed. 
                                *For calling visa countries, processing can take up to 5 days.*
                            </p>
                            <div className="bg-primary/5 dark:bg-primary/10 border-l-4 border-primary p-6 rounded-2xl">
                                <p className="text-base font-bold mode-aware-text">
                                    Fees generally cover:
                                </p>
                                <p className="text-sm opacity-80 mt-1">
                                    Official Visa Government Tax, Processing Admin Fees, and 2% PPH 23 regulatory fees.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
}
