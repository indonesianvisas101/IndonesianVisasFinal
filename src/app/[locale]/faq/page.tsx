import React from "react";
import Link from "next/link";
import { HelpCircle, Clock, CreditCard, AlertCircle, Plane, MessageSquare, Phone, ArrowRight } from "lucide-react";
import { getMessages } from "@/i18n/getMessages";
import FAQItem from "@/components/faq/FAQItem";
import { FAQS } from "@/constants/faqs";
import PageWrapper from "@/components/layout/PageWrapper";

import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Frequently Asked Questions | Indonesian Visas",
        description: "Find answers to common questions about Indonesian visas, entry requirements, and immigration procedures.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/faq`,
        },
    };
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = await getMessages(locale);
    const t = dict?.faq_page || {};
    const categoriesT = t.categories || {};

    const CATEGORIES = [
        { id: "general", title: categoriesT.general || "General Questions", icon: HelpCircle },
        { id: "process", title: categoriesT.process || "Process & Timing", icon: Clock },
        { id: "payment", title: categoriesT.payment || "Payment & Fees", icon: CreditCard },
        { id: "problems", title: categoriesT.problems || "Common Visa Problems", icon: AlertCircle },
        { id: "travel", title: categoriesT.travel || "Travel & Entry", icon: Plane },
        { id: "help", title: categoriesT.help || "Help & Support", icon: MessageSquare },
    ];

    return (
        <PageWrapper className="bg-white dark:bg-[#030712]">
            <div className="w-full">
                {/* HERO SECTION */}
                <section className="relative pt-12 pb-20 overflow-hidden bg-primary dark:bg-primary/5 rounded-[3rem] text-center">
                    <div className="container relative z-10 mx-auto px-4">
                        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                            <h1 className="text-5xl md:text-7xl font-black text-white mode-aware-text tracking-tighter">
                                {t.hero_title || "Frequently Asked Questions"}
                            </h1>
                            <p className="text-xl md:text-2xl text-white/80 mode-aware-subtext max-w-2xl mx-auto leading-relaxed">
                                {t.hero_description || "Everything you need to know about Indonesian visas, permits, and regulations."}
                            </p>
                        </div>
                    </div>
                </section>

                {/* CATEGORY NAV */}
                <nav className="sticky top-[72px] z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-sm scrollbar-hide overflow-x-auto mt-8 rounded-2xl">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-start md:justify-center gap-1 md:gap-4 py-4 min-w-max">
                            {CATEGORIES.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`#${cat.id}`}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mode-aware-subtext hover:bg-primary/5 hover:text-primary transition-all whitespace-nowrap"
                                >
                                    <cat.icon size={18} />
                                    {cat.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* FAQ CONTENT */}
                <main className="container mx-auto px-4 py-20">
                    <div className="max-w-4xl mx-auto space-y-24">
                        {CATEGORIES.map((cat) => (
                            <div key={cat.id} id={cat.id} className="scroll-mt-32 space-y-8">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <cat.icon size={28} />
                                    </div>
                                    <h2 className="text-3xl font-black mode-aware-text tracking-tight">{cat.title}</h2>
                                </div>

                                <div className="grid gap-6">
                                    {FAQS.filter(f => f.category === cat.id).map((faq, i) => {
                                        const qKey = faq.id;
                                        const aKey = `a${faq.id.slice(1)}`;
                                        return (
                                            <FAQItem
                                                key={i}
                                                question={t.questions?.[qKey] || faq.question}
                                                answer={t.questions?.[aKey] || faq.answer}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                {/* STILL HAVE QUESTIONS */}
                <section className="container mx-auto px-4 pb-32">
                    <div className="max-w-4xl mx-auto glass-card p-12 rounded-[3rem] text-center space-y-8 overflow-hidden relative group hover:border-primary/50 transition-colors duration-500">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-110" />
                        <div className="relative z-10 space-y-6">
                            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto">
                                <MessageSquare size={40} />
                            </div>
                            <h2 className="text-4xl font-black mode-aware-text">{t.still_questions_title || "Still have questions?"}</h2>
                            <p className="text-xl mode-aware-subtext max-w-xl mx-auto leading-relaxed font-medium">
                                {t.still_questions_desc || "Can't find the answer you're looking for? Our team is ready to assist you directly."}
                            </p>
                            <div className="pt-4">
                                <Link
                                    href="https://wa.me/6285727041992"
                                    target="_blank"
                                    className="inline-flex items-center gap-4 px-10 py-5 text-white text-xl font-black rounded-2xl shadow-2xl shadow-[#9155FD]/20 transition-all hover:opacity-90 hover:-translate-y-1 active:scale-95 group"
                                    style={{ backgroundColor: '#9155FD' }}
                                >
                                    <Phone size={24} />
                                    {t.still_questions_cta || "Chat with Support"}
                                    <ArrowRight className="transition-transform group-hover:translate-x-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PageWrapper>
    );
}
