import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesian Citizenship for Australians 2026: Naturalization Guide",
        description: "Official guide on the pathway to Indonesian citizenship (WNI) for Australians. Requirements, dual-citizenship legality, and naturalization for married couples.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/australia/indonesia-citizenship`,
        }
    };
}

export default async function AustraliaCitizenshipPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Australia Hub", url: `/${locale}/australia` },
        { label: "Citizenship Guide", url: `/${locale}/australia/indonesia-citizenship` }
    ];

    const cta = {
        title: "Is it time to become a full citizen?",
        desc: "From KITAP to Naturalization, we provide the legal roadmap for Australians making Indonesia their permanent home. Schedule a consultation for the ultimate step.",
        buttonText: "Request Residency Strategy",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "intro",
            title: "1. The Ultimate Commitment: WNI",
            content: (
                <div className="space-y-4">
                    <p>For some Australian citizens, a life in Bali or Jakarta isn't just about a visa; it's about becoming part of the nation. Becoming an <strong>Indonesian Citizen (WNI - Warga Negara Indonesia)</strong> is the final step in a long journey of residency. While the process is rigorous, it provides the ultimate stable legal standing in the archipelago.</p>
                </div>
            )
        },
        {
            id: "dual-citizenship",
            title: "2. The Dual-Nationality Problem",
            content: (
                <div className="space-y-4">
                    <p><strong>Crucial Fact:</strong> Indonesia strictly <strong>does not recognize dual citizenship</strong> for adults (over 21). While Australia allows you to hold multiple passports, if you choose to become an Indonesian citizen, you must legally renounce your Australian citizenship and surrender your Australian passport. This is the primary hurdle for most Australians considering this path.</p>
                </div>
            )
        },
        {
            id: "naturalization",
            title: "3. General Naturalization Eligibility",
            content: (
                <div className="space-y-4">
                    <p>Under Indonesian Law No. 12 of 2006, an Australian citizen can apply for naturalization if they meet these criteria:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Age:</strong> Must be at least 18 years old or already married.</li>
                        <li><strong>Residency:</strong> Must have lived in Indonesia for <strong>5 years consecutively</strong> or <strong>10 years non-consecutively</strong> on a KITAP (Permanent Stay Permit).</li>
                        <li><strong>Language:</strong> Be able to speak the Indonesian language (Bahasa Indonesia) and possess a basic knowledge of Indonesian history and ideology (Pancasila).</li>
                        <li><strong>Income:</strong> Proof of steady income or employment.</li>
                        <li><strong>No Criminal Record:</strong> Specifically for serious offenses.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "marriage",
            title: "4. Citizenship via Marriage",
            content: (
                <div className="space-y-4">
                    <p>If you are an Australian married to an Indonesian citizen, your path to WNI is slightly more streamlined. Once you have held a <strong>Marriage KITAP</strong> for a certain period, you can apply for citizenship based on your marital status. However, the requirement to renounce your original citizenship remains absolute.</p>
                </div>
            )
        },
        {
            id: "children",
            title: "5. Children of Mixed Marriages",
            content: (
                <div className="space-y-4">
                    <p>Children born to one Australian parent and one Indonesian parent were historically forced to choose only one nationality. Since 2006, these children can hold <strong>Dual Citizenship</strong> until they turn 18 (or max 21), at which point they must officially choose between the two. Current legislative discussions suggest this might change in the future, possibly allowing dual citizenship for a longer term.</p>
                </div>
            )
        },
        {
            id: "process",
            title: "6. The Application Journey",
            content: (
                <div className="space-y-4">
                    <p>The naturalization process is handled by the **Ministry of Law and Human Rights (Kemenkumham)**. It involves multiple stages of interviews, background checks by the intelligence services (BIN), and finally, a Presidential Decree. Once granted, you will take an oath of allegiance to the Republic of Indonesia.</p>
                </div>
            )
        },
        {
            id: "benefits",
            title: "7. Benefits of Becoming a Citizen",
            content: (
                <div className="space-y-4">
                    <p>While giving up your Australian passport is a major decision, the benefits of WNI are unique:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>HAK MILIK:</strong> You can own land and property (Freehold) in your own name.</li>
                        <li><strong>No Visas:</strong> No more annual KITAS renewals or five-year KITAP fingerprints.</li>
                        <li><strong>Employment:</strong> Complete freedom to work in any sector (including civil service or government).</li>
                        <li><strong>Voting:</strong> Participation in the Indonesian democratic process.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "faq",
            title: "8. FAQ for Citizenship Seekers",
            content: (
                <div className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can an Australian 're-claim' their citizenship after renouncing it?</h4>
                        <p className="text-sm opacity-80">This is complex. Australian law allows for the 'resumption' of citizenship in certain circumstances, but doing so would likely invalidate your Indonesian citizenship immediately if discovered.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Indonesian Citizenship for Australians 2026: Naturalization Guide"
            subtitle="Understand the legal pathways, dual-citizenship restrictions, and naturalization requirements for Australians making the ultimate commitment."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
