import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Bali Visa Guide 2026 – Expat & Tourist Essentials",
        description: "Your local Bali visa companion. Learn about the nuances of living in Bali legally, avoiding 'Satgas' raids, and choosing the right visa for island life.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/blog/bali-visa-guide`,
        }
    };
}

export default async function BaliVisaBlogPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Blog", url: `/${locale}/blog` },
        { label: "Bali Visa Guide", url: `/${locale}/blog/bali-visa-guide` }
    ];

    const cta = {
        title: "Moving to Bali?",
        desc: "Don't let visa stress ruin your island dreams. Our Bali-based team handles thousands of extensions and KITAS applications every month.",
        buttonText: "Inquire About Bali Visas",
        link: `/${locale}/contact`
    };

    const sections = [
        {
            id: "bali-specifics",
            title: "1. Why Bali Visas are Different",
            content: (
                <div className="space-y-4">
                    <p>
                        While immigration law is national, Bali's enforcement and "vibe" are unique. In 2026, Bali is the frontline of Indonesian tourism innovation. It's the only place where you'll find specialized "Tourism Police" and "Satgas" units dedicated to monitoring foreigners. Understanding Bali-specific visa mechanics is vital for anyone planning to stay longer than a surfboard rental.
                    </p>
                </div>
            )
        },
        {
            id: "canggu-ubud-nomads",
            title: "2. The Canggu & Ubud Nomad Visa Track",
            content: (
                <div className="space-y-4">
                    <p>
                        The B211A is the "nomad visa" of choice for the 2026 Bali scene. It gives you 60 days of freedom, which can be bumped to 180. If you are living in a villa in Pererenan or a guesthouse in Ubud, having an agency like PT Indonesian Visas as your sponsor provides a layer of legal separation and professional handling that DIY applications lack.
                    </p>
                </div>
            )
        },
        {
            id: "avoiding-raids",
            title: "3. Staying Legal: Avoiding the 'Satgas' Raids",
            content: (
                <div className="space-y-4">
                    <p>
                        In 2026, immigration "Intelligence" frequently visits coworking spaces and popular cafes. To stay safe:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Always carry a copy:</strong> Keep your eVisa PDF on your home screen.</li>
                        <li><strong>Activities match Visa:</strong> Do not promote local businesses or sell goods on Instagram if you are on a B211A.</li>
                        <li><strong>Address Reporting:</strong> Ensure your villa manager has reported your passport to the local Banjar.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "extension-logistics",
            title: "4. The Extension 'Bio' Visit",
            content: (
                <div className="space-y-4">
                    <p>
                        If you are in Bali on a B211A or paper VoA, you will eventually have to visit one of the three immigration offices: **Denpasar (Renon)**, **Jimbaran (South)**, or **Singaraja (North)**. Using an agency like ours means you spend exactly 10 minutes there for fingerprints and photos, rather than 4 hours in a queue.
                    </p>
                </div>
            )
        },
        {
            id: "social-media-danger",
            title: "5. The Social Media Danger Zone",
            content: (
                <div className="space-y-4">
                    <p>
                        In 2026, Bali immigration officers are remarkably tech-savvy. They monitor hashtags like #WorkFromBali and #BaliBusiness. If your social media profile suggests you are running a local business or employing locals without a KITAS, you are effectively inviting a home visit from immigration officers.
                    </p>
                </div>
            )
        },
        {
            id: "family-visas",
            title: "6. Family Visa Strategies",
            content: (
                <div className="space-y-4">
                    <p>
                        Moving your family to Bali? The "Dependent KITAS" is your best friend. If one parent secures an Investor or Working KITAS, the spouse and children receive residency rights automatically (Index C317). This is far more cost-effective than keeping a family of four on individual B211A visas for years.
                    </p>
                </div>
            )
        },
        {
            id: "living-bali-permanently",
            title: "7. Moving Toward Permanency",
            content: (
                <div className="space-y-4">
                    <p>
                        The "Golden Visa" (Index E28) is the 2026 trend for high-net-worth individuals. With a $350k investment or a $35k bank deposit, you can secure 5-10 years of residency. For the "Bali Lifer," this is the ultimate endgame, removing the need for yearly renewals and agency sponsorship fees.
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
                        <h4 className="font-bold text-primary mb-2">My Bali visa is about to expire, what do I do?</h4>
                        <p className="mode-aware-subtext text-sm">Contact an agency immediately. If you have at least 3 business days, we can usually lodge an emergency extension. If you've already expired, prepare to pay the daily fine and let us negotiate your exit or regularization.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Bali Visa Guide 2026 – Expat & Tourist Essentials"
            subtitle="Navigate the specific 2026 Bali immigration landscape. Protect your villa stay and master the art of legal island living."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
