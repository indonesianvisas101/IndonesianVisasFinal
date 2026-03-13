import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "The Ultimate Indonesia Visa Guide 2026 – Blog",
        description: "A comprehensive deep-dive into the Indonesian visa landscape. Learn about indices, costs, and the 2026 move toward digital-first immigration.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/blog/indonesia-visa-guide`,
        }
    };
}

export default async function IndonesiaVisaBlogPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Blog", url: `/${locale}/blog` },
        { label: "Indonesia Visa Guide", url: `/${locale}/blog/indonesia-visa-guide` }
  ];

    const cta = {
        title: "Start Your Indonesian Adventure",
        desc: "Overwhelmed by the options? Let our expert agents guide you to the perfect visa for your 2026 travel plans.",
        buttonText: "Consult Our Agents",
        link: `/${locale}/contact`
    };

    const sections = [
        {
            id: "changing-landscape",
            title: "1. The Changing Landscape of 2026",
            content: (
                <div className="space-y-4">
                    <p>
                        Indonesia is no longer the "free for all" tourist destination it once was. In 2026, the Directorate General of Immigration has successfully completed a massive digital overhaul. From the introduction of 10-year Golden Visas to the widespread adoption of AI-monitored Autogates, entering and staying in the archipelago now requires a higher degree of planning and digital literacy than ever before.
                    </p>
                </div>
            )
        },
        {
            id: "visa-breakdown",
            title: "2. The 'Big Three' Visas You Need to Know",
            content: (
                <div className="space-y-4">
                    <p>Regardless of your reason for visiting, 95% of foreigners fall into one of these categories:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Visa on Arrival (B1):</strong> Your 30-to-60 day fast track.</li>
                        <li><strong>B211A Visit Visa:</strong> The "Digital Nomad" workhorse for 6-month stays.</li>
                        <li><strong>Investor KITAS (C314):</strong> The pathway to long-term residency and business ownership.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "timeline-planning",
            title: "3. Planning Your Timeline",
            content: (
                <div className="space-y-4">
                    <p>
                        In 2026, the "last minute" mentality will cost you money. e-VoAs should be secured 72 hours out. B211As require 7-10 days of document normalization. Extensions must be triggered 14 days before expiration. If you are a slow traveler, build an "Immigration Calendar" into your phone to avoid the Rp 1,000,000 daily overstay trap.
                    </p>
                </div>
            )
        },
        {
            id: "agency-ecosystem",
            title: "4. Navigating the Agency Ecosystem",
            content: (
                <div className="space-y-4">
                    <p>
                        Why use an agency in 2026? While the government's Molina portal is powerful, it is also monolithic. Agencies like PT Indonesian Visas provide the **Corporate Sponsorship** letters that individuals cannot legally generate themselves. We act as your guarantor, ensuring that if rules change overnight (as they often do in Indonesia), you have a local legal team ready to pivot your application.
                    </p>
                </div>
            )
        },
        {
            id: "digital-nomad-reality",
            title: "5. Realities of Digital Nomad Life",
            content: (
                <div className="space-y-4">
                    <p>
                        Working from a beanbag in Canggu is iconic, but ensure you carry your B211A digital copy at all times. Immigration "Satgas" (Task Forces) are active. So long as you aren't selling to locals or taking a local salary, remote work on a B211A is the widely accepted standard for 2026.
                    </p>
                </div>
            )
        },
        {
            id: "costs",
            title: "6. Budgeting for Visas",
            content: (
                <div className="space-y-4">
                    <p>
                        Visa costs are a significant line item in your 2026 travel budget. A VoA is cheap ($32), but a 6-month B211A lifecycle (including extensions) will set you back approximately $550-$600 USD. For those moving to Bali permanently, an Investor KITAS lifecycle (Founding a company + Visa + MERP) can range from $2,500 to $4,000 USD depending on processing speed.
                    </p>
                </div>
            )
        },
        {
            id: "future-trends",
            title: "7. The Future of Indonesian Immigration",
            content: (
                <div className="space-y-4">
                    <p>
                        Watch for the expansion of the "Remote Worker Visa" (E33G) which is currently in a pilot phase for certain high-tier income earners. The government is moving toward a "High Value, Low Volume" tourism model, meaning visas will likely become more expensive but provide more rights and better digital infrastructure over time.
                    </p>
                </div>
            )
        },
        {
            id: "faq",
            title: "8. FAQ",
            content: (
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can I apply for a visa while inside Indonesia?</h4>
                        <p className="mode-aware-subtext text-sm">Yes. Most visit visas are now "Onshore Convertible," meaning you can flip from a VoA to a B211A without flying to Singapore. However, this must be initiated well before your current visa expires.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="The Ultimate Indonesia Visa Guide 2026 – Blog"
            subtitle="Understand every layer of the 2026 Indonesian immigration framework. Master your stay from arrival to long-term residency."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
