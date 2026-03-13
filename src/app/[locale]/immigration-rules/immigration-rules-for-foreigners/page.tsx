import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Immigration Rules for Foreigners in Bali 2026 – Legal Guide",
        description: "Essential laws and daily regulations every expat and tourist must follow in Bali and Indonesia. Avoid deportation and understand exact legal obligations.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/immigration-rules/immigration-rules-for-foreigners`,
        }
    };
}

export default async function ForeignerRulesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Immigration Rules", url: `/${locale}/immigration-rules` },
        { label: "Rules for Foreigners", url: `/${locale}/immigration-rules/immigration-rules-for-foreigners` }
    ];

    const cta = {
        title: "Stay Legally Compliant in Bali",
        desc: "Ensure your residency or long-term tourist setup is fundamentally secure. Utilize our corporate agency to safeguard your Indonesian visa from sudden legal changes.",
        buttonText: "Verify My Visa Status",
        link: `/${locale}/contact`
    };

    const sections = [
        {
            id: "legal-obligations",
            title: "1. Legal Obligations of Foreigners",
            content: (
                <div className="space-y-4">
                    <p>
                        Entering the Republic of Indonesia requires an absolute waiver of ignorance. Foreign nationals and expats in Bali are held to the exact same penal standards as local citizens, with the added severe threat of the immigration deportation lever. You are legally obligated to understand the bounds of your specific visa index before engaging in any activity.
                    </p>
                </div>
            )
        },
        {
            id: "carrying-docs",
            title: "2. Carrying Documentation (Passports vs KITAS)",
            content: (
                <div className="space-y-4">
                    <p>
                        Indonesian law dictates that foreign nationals must be capable of presenting legal identification to authorized officers upon request.
                    </p>
                    <p>
                        <strong>Tourists (VoA / B211A):</strong> You are not expected to carry your physical passport to the beach (which risks theft). Keeping a high-resolution photograph of your passport bio-page and the eVisa QR code on your smartphone is standard, accepted practice by local police during routine scooter checks.
                    </p>
                    <p>
                        <strong>Residents (KITAS/KITAP):</strong> You should carry your physical KITAS card (or its digital equivalent) at all times, as this serves as your primary domestic identification across the archipelago.
                    </p>
                </div>
            )
        },
        {
            id: "working-illegally",
            title: "3. Working Illegally: The Ultimate Offense",
            content: (
                <div className="space-y-4">
                    <p>
                        The most fiercely enforced rule by Indonesian Immigration is the absolute prevention of foreign labor theft. Only a Working KITAS (Index C312) grants the legal right to execute daily occupational labor on Indonesian soil.
                    </p>
                    <p>
                        Holding an Investor KITAS (C314), an onshore B211A, or a standard VoA absolutely prohibits you from earning localized money from Indonesian sources, or physically replacing a job an Indonesian citizen could perform (e.g., bartending at a beach club, teaching private yoga classes, or physically managing a construction site). Engaging in these actions triggers highly publicized raids and targeted deportations.
                    </p>
                </div>
            )
        },
        {
            id: "customs",
            title: "4. Custom Declarations (e-CD) and Importing Goods",
            content: (
                <div className="space-y-4">
                    <p>
                        Upon arrival, all foreigners must submit an Electronic Customs Declaration (e-CD). Crucially, Indonesia maintains severe import taxation laws to protect local industries. If you attempt to bring in brand new, boxed, high-end electronics (like multiple iPhones or heavy camera equipment) intended for sale within Bali, Customs officers at Ngurah Rai will impound the goods and levy massive import duties before releasing them.
                    </p>
                </div>
            )
        },
        {
            id: "culture",
            title: "5. Respecting Local Culture and Religion",
            content: (
                <div className="space-y-4">
                    <p>
                        Indonesia is a deeply religious nation adhering to Pancasila. Disrespecting religious centers is not merely a social faux pas; it is a deportable offense under immigration law.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Dress Codes:</strong> You must wear long pants or a sarong, and cover your shoulders when entering any Hindu temple in Bali or Mosque in Java.</li>
                        <li><strong>Public Decency:</strong> Riding a scooter in a bikini down main roads or walking shirtless into supermarkets violates local decency laws and draws immense scrutiny from local Pecalang (village security).</li>
                        <li><strong>Nyepi (Day of Silence):</strong> Once a year, Bali completely shuts down. Airports close, internet is restricted, and nobody—including tourists—is legally permitted to leave their property or turn on bright lights for 24 hours. Defying this results in immediate arrest by the Pecalang.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "drugs",
            title: "6. Drug Trafficking Laws",
            content: (
                <div className="space-y-4">
                    <p>
                        Indonesia’s narcotics laws are among the most draconian on earth. There is zero tolerance for recreational drug use. Marijuana (THC), despite changing global laws, remains categorized alongside heroin as a Class 1 narcotic. Bringing even medical marijuana or gummies into the airport will result in immediate detention at the notorious Kerobokan Prison, and trafficking larger quantities mandates the death penalty via firing squad.
                    </p>
                </div>
            )
        },
        {
            id: "officers",
            title: "7. Dealing with Immigration Officers",
            content: (
                <div className="space-y-4">
                    <p>
                        If approached by immigration intelligence officers or specialized tourism task forces in Bali, absolute compliance and politeness are mandated. Do not argue, raise your voice, or attempt to bribe an officer executing a targeted raid. Instantly contact your legal sponsor (such as PT Indonesian Visas Agency) so an Indonesian-speaking corporate representative can mediate the discussion regarding your visa status.
                    </p>
                </div>
            )
        },
        {
            id: "faq",
            title: "8. FAQ & Crucial Tips",
            content: (
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10">
                        <h4 className="font-bold text-primary mb-2">Are prescription medications allowed into Indonesia?</h4>
                        <p className="mode-aware-subtext text-sm">Yes, standard prescriptions are permitted. However, powerful ADHD medications (like Adderall or Ritalin) contain amphetamines and can trigger severe issues at Customs. You absolutely must carry a formal, translated, signed letter from your doctor proving it is for personal medical use during your short stay.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Immigration Rules for Foreigners in Bali 2026 – Legal Guide"
            subtitle="The definitive legal survival guide for foreign nationals in Indonesia. Master the laws separating relaxed tourism from harsh immigration enforcement."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
