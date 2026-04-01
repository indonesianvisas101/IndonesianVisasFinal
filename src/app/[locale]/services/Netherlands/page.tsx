import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isDefaultLocale = locale === 'en';
    
    // Canonical Strategy: English root always links to /services/Netherlands
    const canonicalUrl = isDefaultLocale ? `${APP_URL}/services/Netherlands` : `${APP_URL}/${locale}/services/Netherlands`;

    return {
        title: "Indonesisch Visum voor Nederlanders 2026: Officieel Hub & GCI Diaspora",
        description: "De definitieve gids voor Nederlanders die naar Indonesië reizen of er verblijven. Officiële e-VoA voor toeristen, B211A zakenvisum en GCI voor oud-Nederlands-Indiërs.",
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'x-default': `${APP_URL}/services/Netherlands`,
                'en': `${APP_URL}/services/Netherlands`,
                'id': `${APP_URL}/id/services/Netherlands`
            }
        }
    };
}

export default async function NetherlandsHubPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Services", url: `/${locale}/services` },
        { label: "Netherlands Hub", url: `/${locale}/services/Netherlands` }
    ];

    const cta = {
        title: "Van Schiphol naar de tropen?",
        desc: "Laat bureaucratie uw reis niet hinderen. Ons officieel PT PMA kantoor verwerkt uw e-VoA in minder dan 24 uur.",
        buttonText: "Vraag Mijn Nederlands Visum Aan",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "overview",
            title: "1. Inreisregels 2026 voor Nederlanders",
            content: (
                <div className="space-y-4">
                    <p>Nederlandse burgers die in 2026 Indonesië binnenkomen, moeten in het bezit zijn van een geldig visum. Of u nu voor vakantie naar Bali gaat of voor zaken in Jakarta bent, het inreislandschap is nu volledig digitaal. Wij bieden officiële ondersteuning voor uw veilige toelating.</p>
                </div>
            )
        },
        {
            id: "evoa",
            title: "2. e-VoA (B1) voor Nederlandse Toeristen",
            content: (
                <div className="space-y-4">
                    <p>Het **Electronic Visa on Arrival (e-VoA)** is de standaardkeuze voor toeristen. Hiermee kunnen Nederlandse burgers gebruikmaken van de digitale **Autogates** bij aankomst in Jakarta of Bali, waardoor u de handmatige wachtrijen omzeilt.</p>
                </div>
            )
        },
        {
            id: "gci-track",
            title: "3. GCI Track voor Oud-WNI in Nederland",
            content: (
                <div className="space-y-4">
                    <p>Gezien de grote Indonesische diaspora in Nederland, is de **GCI (Global Citizen of Indonesia)** track essentieel voor oud-Indonesische burgers en hun nakomelingen. Dit programma biedt levenslang verblijfsrechten en onbeperkte werkvergunningen.</p>
                </div>
            )
        },
        {
            id: "business",
            title: "4. Zakenvisum & Investeringen (B211A)",
            content: (
                <div className="space-y-4">
                    <p>Voor Nederlandse ondernemers biedt het **B211A zakelijk visum** een verblijf tot 180 dagen. Ons kantoor verzorgt het vereiste PT PMA-sponsorschap om uw zakelijke kansen in Indonesië te maximaliseren.</p>
                </div>
            )
        },
        {
            id: "passport",
            title: "5. Paspoort Geldigheid & Eisen",
            content: (
                <div className="space-y-4">
                    <p>Uw Nederlandse paspoort moet **minimaal 6 maanden** geldig zijn op de dag van aankomst. KLM en andere vliegmaatschappijen zullen hier streng op controleren bij het inchecken op Schiphol.</p>
                </div>
            )
        },
        {
            id: "flights",
            title: "6. Vlieglogistiek vanuit Nederland",
            content: (
                <div className="space-y-4">
                    <p>De meeste Nederlanders vliegen rechtstreeks met **KLM** of via **Singapore (SQ), Doha (QR) of Dubai (EK)**. Wij zorgen ervoor dat uw digitale visum is gekoppeld aan uw paspoortgegevens vóór uw definitieve vertrek.</p>
                </div>
            )
        },
        {
            id: "bali-levy",
            title: "7. Bali Toeristenbelasting (IDR 150,000)",
            content: (
                <div className="space-y-4">
                    <p>Elke Nederlandse burger die Bali bezoekt, moet de verplichte heffing van 150.000 IDR betalen. Wij raden u aan dit vooraf te doen via 'Love Bali' om wachtrijen te voorkomen.</p>
                </div>
            )
        },
        {
            id: "customs",
            title: "8. Elektronische Douaneaangifte (e-CD)",
            content: (
                <div className="space-y-4">
                    <p>Vanaf 2026 moet elke aankomst het **e-CD** formulier binnen 72 uur voor landing invullen. U ontvangt een QR-code voor directe controle bij de bagage-uitgang.</p>
                </div>
            )
        },
        {
            id: "overstay",
            title: "9. Boetes bij Overschrijding van de Verblijfsduur",
            content: (
                <div className="space-y-4">
                    <p>Blijf niet langer dan toegestaan! Een overstay kost **IDR 1.000.000 per dag (~€60)**. Voorkom administratieve rompslomp en een mogelijk inreisverbod.</p>
                </div>
            )
        },
        {
            id: "insurance",
            title: "10. Reisverzekering & Gezondheid",
            content: (
                <div className="space-y-4">
                    <p>Zorg voor een uitgebreide zorgverzekering. Grote ziekenhuizen op Bali (Siloam/BIMC) accepteren de meeste internationale polissen die Nederlanders afsluiten.</p>
                </div>
            )
        },
        {
            id: "idiv-infinity",
            title: "11. IDiv Infinity™ voor Nederlanders",
            content: (
                <div className="space-y-4">
                    <p>Cliënten die hun visum via ons regelen, krijgen de gespecialiseerde goud-variant IDiv Card. Dit is uw teken van juridische status en veiligheid binnen Indonesisch territorium.</p>
                </div>
            )
        },
        {
            id: "retirement",
            title: "12. Pensioen in de Tropen (E33E)",
            content: (
                <div className="space-y-4">
                    <p>Veel Nederlandse gepensioneerden (60+) kiezen Bali voor een kwalitatievere levensstijl. Het **Pensioen KITAS (E33E)** biedt een pad naar permanent verblijfsrecht.</p>
                </div>
            )
        },
        {
            id: "property",
            title: "13. Vastgoedrechten voor Nederlanders",
            content: (
                <div className="space-y-4">
                    <p>Wij begeleiden Nederlandse burgers bij de aankoop van onroerend goed via **Hak Pakai** of leasehold constructies, volledig beschermd door Indonesische wetgeving.</p>
                </div>
            )
        },
        {
            id: "digital-nomad",
            title: "14. Track voor Digitale Nomaden",
            content: (
                <div className="space-y-4">
                    <p>Voor Nederlanders die op afstand werken (remote work), biedt het **B211A Visit Visa** de ideale legale status om 180 dagen in de coworking spaces van Canggu of Uluwatu te verblijven.</p>
                </div>
            )
        },
        {
            id: "culture",
            title: "15. Cultureel Respect en Geschiedenis",
            content: (
                <div className="space-y-4">
                    <p>Gezien onze gedeelde geschiedenis wordt van Nederlanders een hoog niveau van cultureel bewustzijn verwacht. Lokale autoriteiten waarderen beleefdheid en respect voor lokale tradities.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "16. FAQ voor Nederlandse Burgers",
            content: (
                <div className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Kan ik ter plekke mijn visum stickers plakken?</h4>
                        <p className="text-sm opacity-80">Het e-VoA is volledig digitaal. U heeft geen fysieke sticker meer nodig, wat de aankomstprocedure aanzienlijk versnelt.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Indonesisch Visum voor Nederlanders 2026: Officieel Hub"
            subtitle="Behoud uw band met Indonesië met onze GCI-expertise, zakenvisum-begeleiding en logistieke ondersteuning voor Nederlandse vakantiegangers."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
