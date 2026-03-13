import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Visa Requirements for Australians 2026 – Complete Guide",
        description: "Everything Australian citizens need to know about traveling to Indonesia. Learn about the e-VoA for Aussies, passport requirements, and overstay fines.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-indonesia-for-australians`,
        }
    };
}

export default async function VisaForAustraliansPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Guides", url: `/${locale}/guides` },
        { label: "Visa Guide for Australians", url: `/${locale}/visa-indonesia-for-australians` }
    ];

    const cta = {
        title: "Skip the Bali Airport Queues",
        desc: "Get your e-VoA sorted before you board your flight from Sydney, Melbourne, or Perth. Fast, secure, and fully digital.",
        buttonText: "Apply for e-VoA Now",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "requirements",
            title: "1. Do Australians Need a Visa for Indonesia?",
            content: (
                <div className="space-y-4">
                    <p><strong>Yes.</strong> Direct visa-free entry for Australian citizens was suspended. To enter Indonesia (including Bali, Jakarta, and Lombok) in 2026, Australian passport holders must secure a visa either prior to arrival or at the airport terminal.</p>
                </div>
            )
        },
        {
            id: "duration",
            title: "2. Allowed Stay Duration",
            content: (
                <div className="space-y-4">
                    <p>The standard Visa on Arrival (VoA) grants an initial 30-day stay. This begins from the exact date you clear immigration at Denpasar (DPS) or Soekarno-Hatta (CGK). If extended onshore, an Australian citizen can stay up to a maximum of 60 days consecutively without leaving the archipelago.</p>
                </div>
            )
        },
        {
            id: "visa-types",
            title: "3. Visa Types Available for Aussies",
            content: (
                <div className="space-y-4">
                    <p>Australian citizens are highly privileged in the Indonesian visa ecosystem and qualify for almost every tier:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Visa on Arrival (e-VoA / B1):</strong> Best for holidays up to 60 days.</li>
                        <li><strong>B211A Visit Visa:</strong> Best for digital nomads staying up to 6 months (180 days).</li>
                        <li><strong>Investor KITAS:</strong> Accessible for Australians starting a PT PMA company to invest in property or hospitality.</li>
                        <li><strong>Retirement KITAS:</strong> Highly popular for Australian retirees over 60 looking to relocate long-term.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "documents",
            title: "4. Required Documents",
            content: (
                <div className="space-y-4">
                    <p>Whether applying for an e-VoA online or grabbing the sticker at the airport, you must provide the following:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>A valid Australian Passport with <strong>at least 6 months validity</strong> from the date of arrival. Immigration will rigidly deny boarding if your passport expires in 5.9 months.</li>
                        <li>A confirmed return ticket to Australia or an onward flight to a third country within the 90-day window.</li>
                        <li>Electronic Customs Declaration (e-CD) QR code (generated 72 hours prior to arrival).</li>
                    </ul>
                </div>
            )
        },
        {
            id: "application",
            title: "5. Application Steps for the e-VoA",
            content: (
                <div className="space-y-4">
                    <p>Instead of queuing at Ngurah Rai International Airport alongside thousands of other tourists, we strongly advise obtaining the e-VoA online:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Prepare a photo of your passport bio-page and a separate passport-style portrait photo.</li>
                        <li>Log into the official Molina immigration portal.</li>
                        <li>Select Australian nationality and apply for the B1 Tourism Visit Visa.</li>
                        <li>Process the payment (approx. $50 AUD).</li>
                        <li>Upon arrival in Bali, walk straight to the automated Autogates, scan your passport, and enter instantly.</li>
                    </ol>
                </div>
            )
        },
        {
            id: "extensions",
            title: "6. Extension Rules for Australians",
            content: (
                <div className="space-y-4">
                    <p>The VoA can be extended exactly once for another 30 days. If you possess an e-VoA, simply log back into the portal and process your extension digitally. If you hold a paper Visa on Arrival, you must surrender your physical Australian passport to the Denpasar or Jimbaran immigration office and attend a mandatory biometric scanning appointment. We highly recommend utilizing an agency to avoid destroying three days of your Bali holiday in government waiting rooms.</p>
                </div>
            )
        },
        {
            id: "travel-tips",
            title: "7. Australian Travel Tips for Bali",
            content: (
                <div className="space-y-4">
                    <p>Bali is effectively a second home for many Australians, but local laws are tightening:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Scooter Safety:</strong> While renting a scooter is simple, riding without an International Driving Permit (IDP) with a motorcycle endorsement legally voids standard Australian travel insurance in the event of an accident.</li>
                        <li><strong>Respect the Culture:</strong> Do not drive shirtless, always wear a helmet, and be severely cautious of stepping on Canang Sari (daily offerings) placed on pavements.</li>
                        <li><strong>No Drugs:</strong> Indonesia enforces the death penalty for drug trafficking. Avoid recreational narcotics entirely.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "faq",
            title: "8. Frequently Asked Questions",
            content: (
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can an Australian get a KITAS?</h4>
                        <p className="mode-aware-subtext text-sm">Absolutely. Thousands of Australians hold Working, Investor, and Retirement KITAS permits across Indonesia.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Indonesia Visa Requirements for Australians 2026 – Complete Guide"
            subtitle="Understand VoA requirements, passport validity traps, and digital gates at Bali airport exclusively tailored for Aussie travelers."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
