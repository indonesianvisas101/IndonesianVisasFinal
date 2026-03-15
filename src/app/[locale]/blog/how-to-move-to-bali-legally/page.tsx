import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "How to Move to Bali Legally 2026 – Step-by-Step",
        description: "Your official 2026 roadmap for moving to Bali. From shipping containers to securing the perfect Investor KITAS, learn the legal path to relocation.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/blog/how-to-move-to-bali-legally`,
        }
    };
}

export default async function MoveToBaliBlogPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Blog", url: `/${locale}/blog` },
        { label: "Move to Bali Legally", url: `/${locale}/blog/how-to-move-to-bali-legally` }
    ];

    const cta = {
        title: "Ready to Move?",
        desc: "Don't let bureaucracy stand in the way of your relocation. Our dedicated relocation team handles everything from company setup to final KITAS delivery.",
        buttonText: "Schedule Relocation Kickoff",
        link: `/${locale}/contact`
    };

    const sections = [
        {
            id: "step-1-strategy",
            title: "Step 1: Define Your Visa Strategy",
            content: (
                <div className="space-y-4">
                    <p>
                        Before you pack a single bag, you need a legal anchor. In 2026, "winging it" on a tourist visa is an expensive mistake. If you are moving long-term, you should ideally enter on a **B211A Visit Visa** which provides 60 days to find a home and then initiate your **Investor or Working KITAS** onshore without having to leave the country.
                    </p>
                </div>
            )
        },
        {
            id: "step-2-residency",
            title: "Step 2: Securing Residency (The Investor KITAS)",
            content: (
                <div className="space-y-4">
                    <p>
                        For most entrepreneurs moving to Bali in 2026, the **Investor KITAS (C314)** is the gold standard. It allows you to founded a PT PMA company, legally stay for 2 years (renewable), and act as a sponsor for your family. Establishing the company takes about 3-4 weeks via our corporate agency, and the visa takes another 2 weeks. This should be your first priority upon deciding to move.
                    </p>
                </div>
            )
        },
        {
            id: "step-3-housing",
            title: "Step 3: Finding Your Home",
            content: (
                <div className="space-y-4">
                    <p>
                        Avoid signing long-term leases (1 year+) while still overseas. Book an Airbnb for month 1. Visit neighborhoods during both high and low tide, and during peak traffic hours (5 PM). 2026 traffic in Canggu and Ubud is intense; what looks like a 10-minute drive on a map can take an hour in reality.
                    </p>
                </div>
            )
        },
        {
            id: "step-4-banking",
            title: "Step 4: Banking & Financial Autonomy",
            content: (
                <div className="space-y-4">
                    <p>
                        Once your KITAS is issued, you can finally open a full-tier Indonesian bank account (BRI,BCA or Mandiri). This allows you to pay for electricity, high-speed fiber internet, and local vendors via the **QRIS** (Quick Response Code Indonesian Standard) system, which is the soul of commerce in Bali.
                    </p>
                </div>
            )
        },
        {
            id: "step-5-shipping",
            title: "Step 5: Shipping & Customs",
            content: (
                <div className="space-y-4">
                    <p>
                        Thinking of shipping a container of furniture? Unless you hold a valid Working or Investor KITAS, the import duties will be astronomical (up to 40% of the value). We recommend selling your bulk furniture at home and buying locally; Bali's craftsmanship is world-class and significantly cheaper than shipping your old bed across the ocean.
                    </p>
                </div>
            )
        },
        {
            id: "step-6-tax-registration",
            title: "Step 6: NPWP & Tax Compliance",
            content: (
                <div className="space-y-4">
                    <p>
                        Move legally also means tax legally. Within 30 days of your KITAS being issued, you must apply for your **NPWP (Tax ID)**. Our agency handles this during your visa processing. Failing to register for tax marks you as a 'risk' in the immigration database, which will haunt you during your 1-year visa extension.
                    </p>
                </div>
            )
        },
        {
            id: "step-7-integration",
            title: "Step 7: Cultural Integration",
            content: (
                <div className="space-y-4">
                    <p>
                        The final step to a successful move is becoming a part of the island, not just a guest. Register with your local Banjar, hire local staff at fair wages (above UMK), and invest time in learning the language. A legal move is not just about the paper in your passport; it's about the respect you show to the Republic of Indonesia.
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
                        <h4 className="font-bold text-primary mb-2">Can I move to Bali as a digital nomad?</h4>
                        <p className="mode-aware-subtext text-sm">Yes. Thousands do it every month on the B211A visa. Just ensure you aren't competing for local jobs or taking money from local companies, and you are 100% legally sound for up to 6 months per trip.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="How to Move to Bali Legally 2026 – Step-by-Step"
            subtitle="The ultimate 2026 roadmap for a flawless relocation. Navigate visas, company setup, and local tax compliance like a professional."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
