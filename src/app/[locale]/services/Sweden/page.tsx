import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isDefaultLocale = locale === 'en';
    
    // Canonical Strategy: English root always links to /services/Sweden
    const canonicalUrl = isDefaultLocale ? `${APP_URL}/services/Sweden` : `${APP_URL}/${locale}/services/Sweden`;

    return {
        title: "Indonesiska Visum för Svenskar 2026: Officiell Hub & GCI Diaspora",
        description: "Den definitiva guiden för svenska medborgare som reser till eller bor i Indonesien. Officiell e-VoA för turister, B211A affärsvisa och GCI för tidigare medborgare.",
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'x-default': `${APP_URL}/services/Sweden`,
                'en': `${APP_URL}/services/Sweden`,
                'id': `${APP_URL}/id/services/Sweden`
            }
        }
    };
}

export default async function SwedenHubPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Services", url: `/${locale}/services` },
        { label: "Sweden Hub", url: `/${locale}/services/Sweden` }
    ];

    const cta = {
        title: "Reser du från Arlanda (ARN) till Bali?",
        desc: "Låt inte byråkrati hindra din resa. Vår officiella PT PMA-byrå hanterar ditt e-VoA på under 24 timmar så att du kan njuta av Indonesien direkt vid ankomst.",
        buttonText: "Starta Min Svenska Ansökan",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "overview",
            title: "1. Inreseregler 2026 för Svenska Medborgare",
            content: (
                <div className="space-y-4">
                    <p>Svenska medborgare som reser in i Indonesien 2026 måste inneha ett giltigt visum. Inresemiljön är nu helt digitaliserad. Oavsett om du besöker Bali för semester eller är i Jakarta för affärsinvesteringar, erbjuder vi officiellt stöd för din lagliga inresa.</p>
                </div>
            )
        },
        {
            id: "evoa",
            title: "2. e-VoA (B1) för Svenska Turister",
            content: (
                <div className="space-y-4">
                    <p>Det elektroniska visumet vid ankomst (**e-VoA**) är standardvalet för turister. Det tillåter svenskar att använda digitala **Autogates** vid ankomst till Jakarta eller Bali, vilket sparar tid och undviker manuella köer.</p>
                </div>
            )
        },
        {
            id: "business",
            title: "3. Affärsvisa & Investeringar (B211A)",
            content: (
                <div className="space-y-4">
                    <p>För svenska entreprenörer och konsulter erbjuder **B211A** affärsvisa upp till 180 dagars laglig vistelse med stöd av vårt officiella PT PMA-sponsring.</p>
                </div>
            )
        },
        {
            id: "gci-track",
            title: "4. GCI Track för Diaspora i Sverige",
            content: (
                <div className="space-y-4">
                    <p>För tidigare indonesiska medborgare bosatta i Sverige erbjuder programmet **GCI (Global Citizen of Indonesia)** livslångt uppehållstillstånd och fullständiga arbetsrättigheter i Indonesien.</p>
                </div>
            )
        },
        {
            id: "passport",
            title: "5. Giltighet för Svenskt Pass",
            content: (
                <div className="space-y-4">
                    <p>Ditt svenska pass **måste vara giltigt i minst 6 månader** från ankomstdatum. Flygbolag (SAS, Finnair, Emirates) kommer att neka ombordstigning om detta krav inte uppfylls.</p>
                </div>
            )
        },
        {
            id: "flights",
            title: "6. Flyglogistik från Sverige",
            content: (
                <div className="space-y-4">
                    <p>De flesta svenskar flyger via **Doha (QR), Dubai (EK) eller Helsingfors (AY)**. Vi säkerställer att ditt digitala visum är kopplat till ditt pass före ditt sista flygsegment.</p>
                </div>
            )
        },
        {
            id: "bali-levy",
            title: "7. Bali Turistskatt (IDR 150 000)",
            content: (
                <div className="space-y-4">
                    <p>Varje svensk medborgare som besöker Bali måste betala den obligatoriska avgiften på 150 000 IDR. Vi rekommenderar att betala via 'Love Bali' före avresa från Arlanda.</p>
                </div>
            )
        },
        {
            id: "customs",
            title: "8. Elektronisk Tulldeklaration (e-CD)",
            content: (
                <div className="space-y-4">
                    <p>Svenskar måste fylla i **e-CD** 72 timmar före ankomst för att få den QR-kod som krävs för att passera tullen vid bagageutgången.</p>
                </div>
            )
        },
        {
            id: "overstay",
            title: "9. Böter vid Överskriden Vistelse",
            content: (
                <div className="space-y-4">
                    <p>Överskrid inte ditt visums giltighet! En överstay kostar **IDR 1 000 000 per dag (~650 SEK)**. Undvik administrativa problem genom vårt visumspårningssystem.</p>
                </div>
            )
        },
        {
            id: "insurance",
            title: "10. Reseförsäkring & Hälsa",
            content: (
                <div className="space-y-4">
                    <p>Svenskar rekommenderas starkt att ha en omfattande reseförsäkring. De stora sjukhusen på Bali (Siloam/BIMC) accepterar de flesta internationella försäkringar som svenska resenärer väljer.</p>
                </div>
            )
        },
        {
            id: "nomad-track",
            title: "11. Track för Svenska Digitala Nomader",
            content: (
                <div className="space-y-4">
                    <p>Canggu och Uluwatu är populära hubbar för svenska frilansare. Vi hanterar ditt B211A-visum så att du kan arbeta lagligt på distans för dina svenska kunder från paradiset på Bali.</p>
                </div>
            )
        },
        {
            id: "retirement",
            title: "12. Pensionering i Tropikerna (E33E)",
            content: (
                <div className="space-y-4">
                    <p>För svenskar över 60 år erbjuder **Retirement KITAS** en unik väg till permanent bosättning i Indonesien med stöd av vår officiella byrå.</p>
                </div>
            )
        },
        {
            id: "investment",
            title: "13. Fastighetsinvesteringar för Svenskar",
            content: (
                <div className="space-y-4">
                    <p>Vi bistår svenska investerare i att skapa **PT PMA**-strukturer för att säkra deras investeringar i lyxvillor och resorter på Bali och Lombok.</p>
                </div>
            )
        },
        {
            id: "idiv-infinity",
            title: "14. IDiv Infinity™ för Svenska Medborgare",
            content: (
                <div className="space-y-4">
                    <p>Kunder som använder våra tjänster får den speciella guld-varianten av IDiv Card. Det är din garanti för juridisk status och säkerhet inom Indonesiens territorium.</p>
                </div>
            )
        },
        {
            id: "why-us",
            title: "15. Varför Svenska Resenärer Litar på Oss?",
            content: (
                <div className="space-y-4">
                    <p>Vi är en registrerad PT PMA-byrå med stark juridisk expertis. Vi förstår de specifika behoven hos resenärer från Sverige och säkerställer 100 % efterlevnad av alla dokument.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "16. FAQ för Svenska Medborgare",
            content: (
                <div className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Kan jag förlänga mitt e-VoA på plats?</h4>
                        <p className="text-sm opacity-80">Ett 30-dagars e-VoA kan förlängas en gång med ytterligare 30 dagar, vilket ger totalt 60 dagars laglig vistelse via vår byrå.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Indonesiska Visum för Svenskar 2026: Officiell Hub"
            subtitle="Upptäck inreseregler, GCI-möjligheter och elitära visumvägar för svenska resenärer med vår officiella juridiska hjälp."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
