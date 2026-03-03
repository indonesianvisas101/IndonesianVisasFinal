"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import styles from "./FAQPreview.module.css";
import Link from "next/link";

const FAQS = [
    {
        q: "How long does visa processing take?",
        a: "Standard processing: 3-5 business days. Express service: 1-4 hours (additional fees apply). VOA can be obtained on arrival at Indonesian airports for eligible nationalities."
    },
    {
        q: "What documents do I need?",
        a: "Valid passport (minimum 6 months validity), recent passport photo, proof of accommodation in Indonesia, return/onward flight ticket. Business visas may require additional documents like invitation letters."
    },
    {
        q: "Can I extend my visa?",
        a: "Yes! We offer visa extension services for most visa types. VOA can be extended once for 30 days. Tourist visas (B211A) can be extended up to 4 times. Apply at least 7 days before your visa expires."
    },
    {
        q: "What are visa fees?",
        a: "Fees vary by visa type. VOA: $20 USD. Tourist Visa: from $40 USD. Business visas: from $50-150 USD depending on type. KITAS: from $500-1500 USD. All prices include government fees and our service charges."
    },
    {
        q: "Which countries are eligible for Indonesian visas?",
        a: "Citizens from 97 countries are eligible for VOA and visa services. This includes most European, American, Asian, and Oceanic countries. Some countries require special treatment or additional documentation."
    }
];

const FAQPreview = ({ dict }: { dict?: any }) => {
    const t = dict?.faq_preview || {};
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = t.faqs || FAQS;

    return (
        <section className={`${styles.section} pb-24`}>
            <div className="container">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-center mode-aware-text">{t.title || "Frequently Asked Questions"}</h2>
                <div className={styles.list}>
                    {faqs.map((faq: any, i: number) => (
                        <div key={i} className={`glass-card ${styles.item} ${openIndex === i ? styles.open : ''}`}>
                            <button className={styles.question} onClick={() => toggle(i)}>
                                <span className="font-bold text-lg text-left pr-8 mode-aware-text">{faq.q}</span>
                                {openIndex === i ? <Minus size={20} className="text-accent" /> : <Plus size={20} className="text-primary" />}
                            </button>
                            <div className={styles.answer}>
                                <div className="text-base leading-relaxed mode-aware-subtext pb-4">{faq.a}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.faqFooter}>
                    <Link href="/faq" className={`cta-accent ${styles.viewAllBtn}`}>
                        {t.view_all || "View Complete FAQ"}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FAQPreview;
