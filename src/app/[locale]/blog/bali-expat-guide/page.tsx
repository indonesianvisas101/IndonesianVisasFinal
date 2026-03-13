import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "2026 Bali Expat Guide – Living Your Best Island Life",
        description: "The complete 2026 handbook for moving to and living in Bali. Discover best neighborhoods, visa strategies, healthcare, and cost of living for expats.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/blog/bali-expat-guide`,
        }
    };
}

export default async function BaliExpatBlogPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Blog", url: `/${locale}/blog` },
        { label: "Bali Expat Guide", url: `/${locale}/blog/bali-expat-guide` }
    ];

    const cta = {
        title: "Make Your Move Official",
        desc: "Don't just dream of Bali—live it legally. We handle thousands of long-term expat relocations annually with 100% legal compliance.",
        buttonText: "Relocation Consultation",
        link: `/${locale}/contact`
    };

    const sections = [
        {
            id: "the-2026-expat-scene",
            title: "1. The 2026 Bali Expat Scene",
            content: (
                <div className="space-y-4">
                    <p>
                        Bali in 2026 is no longer just a backpacker hub; it is a global destination for high-tier founders, families, and creative elites. While traditional areas like Seminyak remain popular, the expat pulse has moved further north and west to Seseh, Kedungu, and even Uluwatu. Living as an expat today requires a blend of cultural respect and meticulous legal planning.
                    </p>
                </div>
            )
        },
        {
            id: "neighborhoods",
            title: "2. Choosing Your Neighborhood",
            content: (
                <div className="space-y-4">
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Canggu & Pererenan:</strong> The epicenter of digital nomad culture. Fast cafes, world-class gyms, and high density.</li>
                        <li><strong>Uluwatu:</strong> The new premium frontier. Slower pace, better beaches, and a thriving surf-luxe community.</li>
                        <li><strong>Ubud:</strong> Still the spiritual heartland, perfect for writers, healers, and families seeking international schools.</li>
                        <li><strong>Sanur:</strong> The 'Old Guard' of Bali, popular with retirees and those seeking a quieter, more local experience.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "living-costs",
            title: "3. Cost of Living Reality Check",
            content: (
                <div className="space-y-4">
                    <p>
                        Bali is not as "cheap" as it used to be. For a comfortable expat life in 2026:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>1-BR Modern Villa:</strong> $1,500 - $2,500 USD / month.</li>
                        <li><strong>Daily Expenses (Dining/Transport):</strong> $800 - $1,200 USD / month.</li>
                        <li><strong>Visa Overhead:</strong> Average $100 USD / month (B211A Lifecycle).</li>
                    </ul>
                    <p>A single expat should budget at least $3,000 USD / month for a "premium" island lifestyle.</p>
                </div>
            )
        },
        {
            id: "visa-lifecycles",
            title: "4. Managing Your Visa Lifecycle",
            content: (
                <div className="space-y-4">
                    <p>
                        Expats generally move through three phases:
                    </p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li><strong>The Scouter (30-60 Days):</strong> Uses a Visa on Arrival (VoA).</li>
                        <li><strong>The Nomad (6 Months):</strong> Uses the B211A Visit Visa via agency sponsorship.</li>
                        <li><strong>The Resident (1-2 Years):</strong> Establishes a PMA company to secure an Investor KITAS.</li>
                    </ol>
                </div>
            )
        },
        {
            id: "education-schools",
            title: "5. International Schools & Families",
            content: (
                <div className="space-y-4">
                    <p>
                        Bali is a world-class destination for families. Schools like **Green School**, **Empathy School**, and **Bali Island School** provide innovative global curricula. To enroll your children, you **must** have a valid residency visa (usually a Dependent KITAS). Most schools will not accept students on a standard tourist visa.
                    </p>
                </div>
            )
        },
        {
            id: "healthcare",
            title: "6. Healthcare & Insurance",
            content: (
                <div className="space-y-4">
                    <p>
                        Health comes first. Facilities like **BIMC** and **Siloam** provide international standards for expats. However, you must have comprehensive private insurance. If you have a KITAS, you are also eligible for **BPJS**, the Indonesian national health scheme, which is highly affordable for basic care but should only be used as a supplement to private coverage.
                    </p>
                </div>
            )
        },
        {
            id: "community-culture",
            title: "7. Community & Cultural Duty",
            content: (
                <div className="space-y-4">
                    <p>
                        The "Ugly Expat" era is being phased out through strict enforcement. Expats who thrive in Bali are those who learn basic Bahasa Indonesia, respect local ceremonies (Upacara), and contribute to the community. Avoid the trap of living in an expat 'bubble'; Bali is a land of profound depth if you are willing to participate in its traditions.
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
                        <h4 className="font-bold text-primary mb-2">Can I buy property in Bali as an expat?</h4>
                        <p className="mode-aware-subtext text-sm">Foreigners cannot 'own' land (Hak Milik). You can, however, legally have a **Leasehold (Hak Pakai)** for 25-80 years. This is perfectly safe and the standard for all Bali expats, provided you use a reputable notary.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="2026 Bali Expat Guide – Living Your Best Island Life"
            subtitle="The ultimate 2026 manual for new and existing Bali expats. Master the neighborhoods, costs, schools, and legal residency pathways."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
