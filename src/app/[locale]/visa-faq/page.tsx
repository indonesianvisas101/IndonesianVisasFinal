import React from "react";
import SEOPageLayout from "@/components/layout/SEOPageLayout";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Visa FAQ | Expert Immigration Answers | Indonesian Visas",
        description: "Comprehensive FAQ hub for Indonesian visas. 30+ answers about VoA, KITAS, B211A, overstay rules, and immigration processing for 2026.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-faq`,
        },
    };
}

export default async function VisaFaqHubPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const sections = [
        {
            id: "definitions",
            title: "Visa Types & Definitions",
            content: (
                <div className="space-y-4">
                    <p><strong>Q1: What is the most popular visa for tourists?</strong><br />A1: The Visa on Arrival (VoA) is the most common for stays up to 60 days.</p>
                    <p><strong>Q2: What is a B211A visa?</strong><br />A2: It is a single-entry visit visa for tourism or business meetings, valid for up to 180 days.</p>
                    <p><strong>Q3: What does KITAS stand for?</strong><br />A3: Kartu Izin Tinggal Terbatas (Limited Stay Permit Card).</p>
                    <p><strong>Q4: Is there a Digital Nomad visa?</strong><br />A4: Yes, the Remote Worker Visa (E33G) allows foreigners to work for overseas companies while living in Indonesia.</p>
                    <p><strong>Q5: What is a Golden Visa?</strong><br />A5: It is a 5-10 year residency permit for high-net-worth investors and talent.</p>
                    <p><strong>Q6: Can I get a visa for social work?</strong><br />A6: Yes, the C317 index is used for social activities and family unification.</p>
                </div>
            )
        },
        {
            id: "extensions",
            title: "Visa Extensions & Renewals",
            content: (
                <div className="space-y-4">
                    <p><strong>Q7: How many times can I extend a VoA?</strong><br />A7: You can extend a VoA exactly once for an additional 30 days.</p>
                    <p><strong>Q8: When should I start my KITAS extension?</strong><br />A8: We recommend starting at least 30-45 days before expiry.</p>
                    <p><strong>Q9: Do I need to visit immigration for every extension?</strong><br />A9: Usually, a physical visit for biometrics is required for the first extension of a new permit.</p>
                    <p><strong>Q10: Can I extend my visa if my passport is full?</strong><br />A10: No, you must renew your passport first or get an emergency travel document.</p>
                    <p><strong>Q11: Is there an express extension service?</strong><br />A11: Yes, most agencies offer priority processing (3-4 days) for an additional fee.</p>
                    <p><strong>Q12: Can I extend a B211A visa multiple times?</strong><br />A12: Yes, it can be extended twice, each time for 60 days.</p>
                </div>
            )
        },
        {
            id: "overstay",
            title: "Overstay & Legal Risks",
            content: (
                <div className="space-y-4">
                    <p><strong>Q13: What is the fine for overstaying?</strong><br />A13: The current fine is IDR 1,000,000 per day.</p>
                    <p><strong>Q14: Will I be deported for a 1-day overstay?</strong><br />A14: Usually not, you simply pay the fine at the airport. However, 60+ days overstay results in deportation.</p>
                    <p><strong>Q15: Can I work on a tourist visa?</strong><br />A15: Absolutely not. Working without a permit (KITAS + IMTA) is a criminal offense in Indonesia.</p>
                    <p><strong>Q16: What happens if I am blacklisted?</strong><br />A16: You will be barred from entering Indonesia for 6 months to several years.</p>
                    <p><strong>Q17: Is volunteering considered work?</strong><br />A17: Yes, even unpaid 'productive' activities require a specific visa index.</p>
                    <p><strong>Q18: Can I own land as a foreigner?</strong><br />A18: Foreigners can hold 'Hak Pakai' (Right of Use) or 'Hak Guna Bangunan' (Right to Build) under a PMA company.</p>
                </div>
            )
        },
        {
            id: "logistics",
            title: "Visa Processing & Logistics",
            content: (
                <div className="space-y-4">
                    <p><strong>Q19: How long does an e-Visa take?</strong><br />A19: Standard processing is 3-5 business days. Express takes 24-48 hours.</p>
                    <p><strong>Q20: Do I need a return ticket?</strong><br />A20: Yes, immigration officers often check for a confirmed onward/return flight.</p>
                    <p><strong>Q21: Can I pay for my visa in USD?</strong><br />A21: At the airport, major currencies are accepted. Online, payments are via IDR credit card systems.</p>
                    <p><strong>Q22: Is my data safe with Indonesian Visas Agency?</strong><br />A22: Yes, we use encrypted storage and follow strict data protection protocols.</p>
                    <p><strong>Q23: How will I receive my e-Visa?</strong><br />A23: It will be sent to your registered email address as a PDF file.</p>
                    <p><strong>Q24: Do kids need their own visa?</strong><br />A24: Yes, every person regardless of age must have an individual visa.</p>
                </div>
            )
        },
        {
            id: "regulations",
            title: "Immigration Regulations 2026",
            content: (
                <div className="space-y-4">
                    <p><strong>Q25: Are there new health requirements?</strong><br />A25: Current rules require Satusehat app registration, though most mandates have eased.</p>
                    <p><strong>Q26: What is the minimum bank balance for a KITAS?</strong><br />A26: Typically USD 2,000 or equivalent.</p>
                    <p><strong>Q27: Can I change from a tourist to a work visa onshore?</strong><br />A27: Usually, yes, provided you have the correct sponsorship.</p>
                    <p><strong>Q28: What is an EPO?</strong><br />A28: Exit Permit Only. It is the process of closing your KITAS when you finish your stay.</p>
                    <p><strong>Q29: Can I open a business in Bali?</strong><br />A29: Yes, by incorporating a PMA company (Foreign Direct Investment).</p>
                    <p><strong>Q30: How can I trust a visa agency?</strong><br />A30: Look for a registered NIB/AHU and a physical office (like our headquarters in Bali).</p>
                </div>
            )
        }
    ];

    // FAQ Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the most popular visa for tourists?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The Visa on Arrival (VoA) is the most common for stays up to 60 days."
                }
            },
            {
                "@type": "Question",
                "name": "What is a B211A visa?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "It is a single-entry visit visa for tourism or business meetings, valid for up to 180 days."
                }
            },
            {
                "@type": "Question",
                "name": "What is the fine for overstaying in Indonesia?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The current fine for overstaying is IDR 1,000,000 per day per person."
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <SEOPageLayout
                locale={locale}
                title="Indonesia Visa FAQ Hub"
                subtitle="Expert answers to the most frequently asked questions about Indonesian immigration, residency, and legal compliance."
                breadcrumbs={[
                    { label: "Home", url: `/${locale}` },
                    { label: "Visa FAQ", url: `/${locale}/visa-faq` }
                ]}
                sections={sections}
                cta={{
                    title: "Still have questions?",
                    desc: "Our legal consultants are available 24/7 to clarify your specific situation.",
                    buttonText: "Ask a Consultant",
                    link: `/${locale}/apply`
                }}
            />
        </>
    );
}
