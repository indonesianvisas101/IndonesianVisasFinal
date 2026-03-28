import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Travel to Indonesia from Australia 2026: Official Safety & Health Guide",
        description: "The complete Australian traveler's guide to visiting Indonesia. Highlighting health prep (Bali Belly), travel insurance traps, and regional highlights.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/australia/travel-indonesia`,
        }
    };
}

export default async function AustraliaTravelPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Australia Hub", url: `/${locale}/australia` },
        { label: "Travel & Safety Guide", url: `/${locale}/australia/travel-indonesia` }
    ];

    const cta = {
        title: "Is your visa and customs sorted?",
        desc: "Don't let bureaucracy ruin your Sydney-to-Bali flight. We handle everything from e-VoA to customs (e-CD) so you land stress-free.",
        buttonText: "Check My Eligibility",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "intro",
            title: "1. The Essential Bali Trip Prep",
            content: (
                <div className="space-y-4">
                    <p>For Australians, Indonesia—and specifically Bali—is more than just a destination; it's a second home. Whether you're heading for a bachelor party in Seminyak, a family holiday in Sanur, or a surf trip in Uluwatu, proper preparation is the difference between a dream getaway and a logistical nightmare.</p>
                </div>
            )
        },
        {
            id: "flights",
            title: "2. Strategic Flight Routes",
            content: (
                <div className="space-y-4">
                    <p>Direct flights from **Sydney, Melbourne, Perth, Brisbane, Adelaide, and Darwin** make the trip effortless. Budget carriers like Jetstar and AirAsia are the mainstay, while Qantas and Virgin Australia provide full-service options. <strong>Tip:</strong> Perth-to-Bali is often faster and cheaper than Perth-to-Sydney!</p>
                </div>
            )
        },
        {
            id: "weather",
            title: "3. Best Time to Visit (Weather Patterns)",
            content: (
                <div className="space-y-4">
                    <p>The Dry Season (May to September) coincides with Australian winter, making it the perfect time for a tropical escape. The Wet Season (October to April) features humid afternoons and heavy downpours but often offers significantly cheaper accommodation and fewer crowds at popular spots like Finn’s or Potato Head.</p>
                </div>
            )
        },
        {
            id: "currency",
            title: "4. Money & Currency (AUD to IDR)",
            content: (
                <div className="space-y-4">
                    <p>While cards are widely accepted in tourist areas, you should always carry some Rupiah (IDR) for smaller markets and remote island trips. Avoid 'sketchy' money changers in alleyways; stick to authorized shops with official certificates (BMC/PT. Central Kuta). Better yet, use a multi-currency card like <strong>Wise</strong> for better rates at local ATMs.</p>
                </div>
            )
        },
        {
            id: "insurance",
            title: "5. Travel Insurance & Health Prep",
            content: (
                <div className="space-y-4">
                    <p><strong>Warning:</strong> Standard credit card travel insurance often has massive exclusions for 'scooter related incidents' or 'pre-existing conditions' once abroad. We strongly recommend a dedicated policy (e.g., Allianz or Southern Cross) that includes medical evacuation to Darwin or Singapore if things go seriously wrong.</p>
                </div>
            )
        },
        {
            id: "culture",
            title: "6. Balinese & Indonesian Culture",
            content: (
                <div className="space-y-4">
                    <p>The spirit of the island is found in its ceremonies. Respect local priests, dress modestly when away from the beach, and never step on the flower offerings (canang sari) on the floor. Remember that outside of Bali, Indonesia is predominantly Muslim, so modesty is key during transit through Jakarta or Surabaya.</p>
                </div>
            )
        },
        {
            id: "transport",
            title: "7. Transport (Gojek vs Grab)",
            content: (
                <div className="space-y-4">
                    <p>Don't bother with street taxis unless they are **Blue Bird**. Download the <strong>Gojek or Grab</strong> apps immediately. They offer bike-taxis (ojek), car-taxis, and even food delivery (GoFood) at local prices, preventing the common 'tourist markup' often seen in Kuta.</p>
                </div>
            )
        },
        {
            id: "safety",
            title: "8. Staying Safe in the Archipelago",
            content: (
                <div className="space-y-4">
                    <p>Indonesia is generally very safe, but common sense applies. Avoid drinking 'Arak' from unknown sources (methanol poisoning is a real risk), don't leave your phone on the table in bars, and be careful of 'snatch thefts' while on a transit bike in busy areas.</p>
                </div>
            )
        },
        {
            id: "regional",
            title: "9. Beyond Bali (Regional Highlights)",
            content: (
                <div className="space-y-4">
                    <p>Want to see more than just Canggu? Australians are now exploring further afield:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Lombok:</strong> For a more laid-back surf vibe.</li>
                        <li><strong>Komodo National Park:</strong> For world-class diving and the famous dragons.</li>
                        <li><strong>Yogyakarta:</strong> For incredible Javanese culture and ancient temples (Borobudur).</li>
                    </ul>
                </div>
            )
        },
        {
            id: "packing",
            title: "10. What to Pack for the Tropics",
            content: (
                <div className="space-y-4">
                    <p>Lightweight cotton/linen clothing is essential. Don't forget reef-safe sunscreen (it's expensive in Bali), a portable power bank for those long day trips, and a reusable water bottle (many hotels now have filtered refilling stations).</p>
                </div>
            )
        },
        {
            id: "why-agency",
            title: "11. Why Use our Official Agency?",
            content: (
                <div className="space-y-4">
                    <p>We provide the 'Aussie-preferred' service model: Fast responses, transparent pricing, and 100% legal reliability. We don't just process your visa; we ensure you are prepared for customs, health declarations, and regional regulations that might change overnight.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "12. FAQ for Australian Travelers",
            content: (
                <div className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can I drive a car in Bali with my Australian license?</h4>
                        <p className="text-sm opacity-80">Only if you have an International Driving Permit (IDP) alongside your Australian license. Without both, the police can fine you, and your insurance will likely be void.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Travel to Indonesia from Australia 2026: Official Safety & Health Guide"
            subtitle="Navigate seasonal weather, health prep, and regional surf spots with our comprehensive Australian-centric travel handbook."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
