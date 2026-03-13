import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Jakarta Visa Guide 2026 – Entry for Business & Tourism",
        description: "Official entry guide for Soekarno-Hatta International Airport (CGK). Learn about Jakarta's business visa requirements, Autogate access, and stopover rules.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/travel-indonesia/jakarta-visa-guide`,
        }
    };
}

export default async function JakartaVisaGuidePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Travel Info", url: `/${locale}/travel-indonesia` },
        { label: "Jakarta Entry Guide", url: `/${locale}/travel-indonesia/jakarta-visa-guide` }
    ];

    const cta = {
        title: "Heading to Jakarta for Business?",
        desc: "Ensure your commercial activities are legally protected. We specialize in B211B Business Visas and Multiple Entry D212 setups for corporate travelers.",
        buttonText: "Inquire for Business Visa",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "cgk-arrival",
            title: "1. Arriving at Soekarno-Hatta (CGK)",
            content: (
                <div className="space-y-4">
                    <p>
                        Jakarta's Soekarno-Hatta International Airport is the primary gateway for international business and government affairs in Indonesia. While many tourists head straight to Bali, Jakarta serves as the critical hub for those seeking Business Visas, KITAS processing, and long-term residency permits.
                    </p>
                </div>
            )
        },
        {
            id: "business-focus",
            title: "2. The Business Visa (B211B)",
            content: (
                <div className="space-y-4">
                    <p>
                        Most travelers landing in Jakarta are on commercial missions. If you are attending meetings, visiting factories, or negotiating contracts, the standard Tourist VoA is technically insufficient for high-level commercial activity. The **B211B Business Visa** is the legally correct index, requiring a corporate sponsor from an Indonesian company.
                    </p>
                </div>
            )
        },
        {
            id: "autogates",
            title: "3. Jakarta Autogate Access",
            content: (
                <div className="space-y-4">
                    <p>
                        Jakarta Terminal 3 features some of the most advanced biometric Autogates in Southeast Asia. If you have a pre-approved **e-VoA** or **e-Visa**, you do not need to speak to an immigration officer. You simply scan your passport and look into the facial recognition camera. This can save you 60-90 minutes of standing in the manual queues during peak evening arrival banks.
                    </p>
                </div>
            )
        },
        {
            id: "transit-rules",
            title: "4. Transit and Stopover Rules",
            content: (
                <div className="space-y-4">
                    <p>
                        If you are transiting through Jakarta to a third country (e.g., flight from London to Sydney with a 12-hour layover), you do **not** need a visa provided you stay within the international transit hall of Terminal 3. However, if you wish to exit the airport to stay at a nearby hotel, you **must** purchase a Visa on Arrival.
                    </p>
                </div>
            )
        },
        {
            id: "transport",
            title: "5. Getting to the City: Visa Issues",
            content: (
                <div className="space-y-4">
                    <p>
                        To take the Railink train or a Silver Bird taxi into Central Jakarta (Menteng/Sudirman), you must have already cleared immigration. You cannot "leave" the airport and return to the transit zone without a valid entry stamp or digital permit.
                    </p>
                </div>
            )
        },
        {
            id: "kitas-processing",
            title: "6. KITAS and Onshore Processing",
            content: (
                <div className="space-y-4">
                    <p>
                        Jakarta is the headquarters of the Directorate General of Immigration. If you are applying for a complex Investor or Working KITAS, your physical documents will often flow through the Jakarta central office. Landing in Jakarta to begin your residency process is often faster than doing so in regional offices.
                    </p>
                </div>
            )
        },
        {
            id: "overstay-jakarta",
            title: "7. Overstaying in Jakarta",
            content: (
                <div className="space-y-4">
                    <p>
                        Jakarta enforcement is exceptionally efficient. If you attempt to leave via CGK with an expired visa, you will be pulled aside by the supervisor immediately. The fine (1,000,000 IDR per day) must be paid in full before you are allowed to board your flight. Unlike Bali, there is less "leeway" for administrative errors in the capital.
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
                        <h4 className="font-bold text-primary mb-2">Is the Jakarta visa different from the Bali visa?</h4>
                        <p className="mode-aware-subtext text-sm">No. An Indonesian visa is national. If you enter in Jakarta on a VoA, you can fly to Bali, Java, or Sumatra internally without any further visa checks or payments.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Jakarta Visa Guide 2026 – Entry for Business & Tourism"
            subtitle="The professional traveler's guide to entering Indonesia via the capital. High-speed entry protocols and business visa regulations explained."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
