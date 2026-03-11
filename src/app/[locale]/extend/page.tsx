"use client";

import React from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionWrapper from "@/components/layout/SectionWrapper";
import VisaCatalog from "@/components/visa/VisaCatalog";

export default function ExtendPage() {
    return (
        <PageWrapper className="transition-colors">
            {/* Hero */}
            <SectionWrapper id="extend-intro">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-600 mb-4">
                        Extend Your Visa
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Don't let your adventure end. Easy, secure, and fast visa extension services for all visa types.
                    </p>
                </div>

                {/* Unified Filter and Catalog */}
                <VisaCatalog />
            </SectionWrapper>

            {/* Submission Form Section */}
            <SectionWrapper id="extend-form" noBottomMargin>
                <div className="bg-white dark:bg-slate-900 p-8 md:p-12 mb-16 max-w-3xl mx-auto rounded-[24px] shadow-2xl border border-gray-100 dark:border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-yellow-500" />

                    <h2 className="text-3xl font-bold mb-4 text-center text-slate-900 dark:text-white">Start Your Extension</h2>
                    <p className="text-center mb-10 text-slate-600 dark:text-slate-400">Please fill out the form below. Our team will pick up your passport or guide you through the process.</p>

                    <form action={`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ID || 'xbdlnjka'}`} method="POST" className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-sm text-slate-700 dark:text-slate-300">Full Name</label>
                                <input name="name" type="text" className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" required placeholder="As shown in passport" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-sm text-slate-700 dark:text-slate-300">WhatsApp Number</label>
                                <input name="whatsapp" type="tel" className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" required placeholder="+62..." />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm text-slate-700 dark:text-slate-300">Current Visa Type</label>
                            <select name="visaType" className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                                <option>VoA / e-VoA</option>
                                <option>B211A Tourist</option>
                                <option>KITAS</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm text-slate-700 dark:text-slate-300">Additional Notes / Address</label>
                            <textarea name="notes" rows={3} className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" placeholder="Where are you staying in Bali?"></textarea>
                        </div>

                        <button type="submit" className="mt-4 w-full py-4 text-lg font-bold text-white bg-accent rounded-xl shadow-lg hover:shadow-accent/40 hover:-translate-y-1 transition-all duration-200">
                            Submit Extension Request
                        </button>
                    </form>
                </div>
            </SectionWrapper>
        </PageWrapper>
    );
}
