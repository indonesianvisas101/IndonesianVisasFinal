import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isDefaultLocale = locale === 'en';
    
    // Canonical Strategy: English root always links to /services/United-States
    const canonicalUrl = isDefaultLocale ? `${APP_URL}/services/United-States` : `${APP_URL}/${locale}/services/United-States`;

    return {
        title: "Indonesia Visa for US Citizens 2026: Official Hub & GCI Diaspora Program",
        description: "The definitive guide for Americans traveling to or residing in Indonesia. Official e-VoA for tourists, Digital Nomad tracks, US-Indo Tax Treaty context, and GCI for former citizens.",
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'x-default': `${APP_URL}/services/United-States`,
                'en': `${APP_URL}/services/United-States`,
                'id': `${APP_URL}/id/services/United-States`
            }
        }
    };
}

export default async function USAHubPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Services", url: `/${locale}/services` },
        { label: "United States Hub", url: `/${locale}/services/United-States` }
    ];

    const cta = {
        title: "Planning a Move from USA to Bali or Jakarta?",
        desc: "Don't gamble with your immigration status. Our registered PT PMA agency handles US-sponsored visas, from 30-day e-VoA to 10-year Golden Visas.",
        buttonText: "Start My US Application",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "overview",
            title: "1. The 2026 Entry Rules for Americans",
            content: (
                <div className="space-y-4">
                    <p>United States citizens entering Indonesia in 2026 must possess a valid visa. The entry landscape has shifted toward a fully digital verification system. Whether you are visiting for leisure or relocating for long-term investment, the **Electronic Visa on Arrival (e-VoA)** and the **GCI program** are the primary entry tracks for Americans.</p>
                </div>
            )
        },
        {
            id: "evoa",
            title: "2. e-VoA (B1) for US Tourists",
            content: (
                <div className="space-y-4">
                    <p>The **Electronic Visa on Arrival (e-VoA)** is valid for 30 days and can be extended once for an additional 30 days. For US citizens, this allows for immediate access to the **Autogates** at major airports. It is strictly for tourism and non-working business meetings.</p>
                </div>
            )
        },
        {
            id: "gci-track",
            title: "3. GCI Track for Former WNI in USA",
            content: (
                <div className="space-y-4">
                    <p>With a large Indonesian diaspora in cities like Los Angeles and New York, the **Global Citizen of Indonesia (GCI)** track is the premier choice for former citizens. It provides a lifetime residency status with full work and property ownership rights, preserving your ancestral connection.</p>
                </div>
            )
        },
        {
            id: "digital-nomad",
            title: "4. Digital Nomad & Remote Work (B211A)",
            content: (
                <div className="space-y-4">
                    <p>For US-based remote workers, the **B211A Visit Visa** allows for a stay of up to 180 days. This is the preferred legal track for Americans living the "Bali Nomad" lifestyle while working for US-based employers.</p>
                </div>
            )
        },
        {
            id: "investment",
            title: "5. Investment & Golden Visa (E31/E32)",
            content: (
                <div className="space-y-4">
                    <p>High-net-worth US individuals can apply for the **Golden Visa**, offering 5-10 year residency. This is ideal for those investing in Indonesian real estate or established equity in PT PMA (Foreign Investment) companies.</p>
                </div>
            )
        },
        {
            id: "retirement",
            title: "6. Retirement Excellence (E33E)",
            content: (
                <div className="space-y-4">
                    <p>American retirees aged 60+ often choose the **Retirement KITAS (E33E)** to enjoy a premium lifestyle in Bali or Yogyakarta. We assist in securing the required sponsorship and health insurance compliance.</p>
                </div>
            )
        },
        {
            id: "validity",
            title: "7. The 6-Month Passport Validity Trap",
            content: (
                <div className="space-y-4">
                    <p>A common pitfall for US travelers: Your passport **must have at least 6 months validity** from the date of arrival. US airlines will deny boarding if this requirement is not met, even by a single day.</p>
                </div>
            )
        },
        {
            id: "flights",
            title: "8. Flight Logistics from USA",
            content: (
                <div className="space-y-4">
                    <p>While direct flights are expanding, most Americans transit via Singapore (SQ), Taipei (EVA), or Tokyo (ANA/JAL). Ensure your visa is active and printed before your final leg into Indonesia.</p>
                </div>
            )
        },
        {
            id: "medical",
            title: "9. Medical & Insurance Compliance",
            content: (
                <div className="space-y-4">
                    <p>Medicare is not valid in Indonesia. Americans must have private travel or international health insurance. Major hospitals in Bali (Siloam/BIMC) expect up-front payment or verified insurance guarantee.</p>
                </div>
            )
        },
        {
            id: "customs",
            title: "10. Electronic Customs (e-CD)",
            content: (
                <div className="space-y-4">
                    <p>All US arrivals must fill out the **Electronic Customs Declaration (e-CD)** within 72 hours of landing. This generates a QR code that speeds up your baggage exit.</p>
                </div>
            )
        },
        {
            id: "logistics",
            title: "11. Local Hub Logistics",
            content: (
                <div className="space-y-4">
                    <p>Upon arrival in Jakarta or Bali, secure official airport transport. For long-term residents, we provide assistance with domestic SIM card registration (IMEI) which is mandatory for US phones stayed over 90 days.</p>
                </div>
            )
        },
        {
            id: "tax",
            title: "12. US-Indonesia Tax Treaty",
            content: (
                <div className="space-y-4">
                    <p>The US and Indonesia maintain a **Double Tax Treaty**. This is critical for American expats to understand to avoid being taxed twice on global income while residing in Indonesia for more than 183 days.</p>
                </div>
            )
        },
        {
            id: "education",
            title: "13. International Schools for US Families",
            content: (
                <div className="space-y-4">
                    <p>For US families relocation, there are internationally accredited schools (IB/Cambridge) in Sanur, Canggu, and Jakarta. A dependent KITAS is required for American children to enroll.</p>
                </div>
            )
        },
        {
            id: "trust",
            title: "14. Trust & Official PT PMA Sponsorship",
            content: (
                <div className="space-y-4">
                    <p>Only trust agencies with a physical office and valid NIB. **PT Indonesian Visas Agency** is a registered sponsor, ensuring your US-origin documents are handled with maximum security.</p>
                </div>
            )
        },
        {
            id: "culture",
            title: "15. Cultural Respect for Americans",
            content: (
                <div className="space-y-4">
                    <p>Indonesians value "Gotong Royong" (mutual help). American's directness is respected, but maintaining "Wajah" (Face/Politeness) is key to smooth interactions with immigration and local authorities.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "16. FAQ for American Citizens",
            content: (
                <div className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can I work on a Tourist e-VoA?</h4>
                        <p className="text-sm opacity-80">No. Working for an Indonesian employer is strictly prohibited. For remote work for a US company, use the B211A/Remote Worker track.</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Do I need a physical visa sticker?</h4>
                        <p className="text-sm opacity-80">The e-VoA and e-Visa are digital. You only need a digital copy on your phone and a printed copy as backup.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Indonesia Visa for US Citizens 2026: Official Hub"
            subtitle="Explore essential e-VoA rules, US-Indo tax treaty context, and GCI diaspora benefits specially tailored for American travelers and investors."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
