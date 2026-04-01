import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isDefaultLocale = locale === 'en';
    
    // Canonical Strategy: English root always links to /services/France
    const canonicalUrl = isDefaultLocale ? `${APP_URL}/services/France` : `${APP_URL}/${locale}/services/France`;

    return {
        title: "Visa Indonésie pour les Citoyens Français 2026 : Hub Officiel & GCI Diaspora",
        description: "Le guide définitif pour les Français voyageant ou résidant en Indonésie. e-VoA officielle pour les touristes, visas d'affaires B211A, et GCI pour les anciens citoyens.",
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'x-default': `${APP_URL}/services/France`,
                'en': `${APP_URL}/services/France`,
                'id': `${APP_URL}/id/services/France`
            }
        }
    };
}

export default async function FranceHubPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Services", url: `/${locale}/services` },
        { label: "France Hub", url: `/${locale}/services/France` }
    ];

    const cta = {
        title: "D'un vol Air France à une plage à Bali ?",
        desc: "Ne vous perdez pas dans la bureaucratie. Notre agence spécialisée traite vos e-VoA en moins de 24 heures pour que vous puissiez explorer l'Indonésie en toute sérénité.",
        buttonText: "Demander Mon Visa Français",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "overview",
            title: "1. Les Règles d'Entrée 2026 pour les Français",
            content: (
                <div className="space-y-4">
                    <p>Les citoyens français entrant en Indonésie en 2026 doivent détenir un visa valide. Le système d'entrée est désormais entièrement numérique. Que vous soyez en vacances à Bali ou en mission d'affaires à Jakarta, nous facilitons votre admission avec une précision officielle.</p>
                </div>
            )
        },
        {
            id: "evoa",
            title: "2. e-VoA (B1) pour les Touristes Français",
            content: (
                <div className="space-y-4">
                    <p>L'**e-VoA (Visa à l'Arrivée Électronique)** est l'option standard pour les séjours de 30 jours. Elle permet aux citoyens français d'utiliser les **Autogates** numériques, évitant ainsi les files d'attente manuelles interminables à l'arrivée.</p>
                </div>
            )
        },
        {
            id: "business",
            title: "3. Visas d'Affaires B211A",
            content: (
                <div className="space-y-4">
                    <p>Pour les investisseurs et consultants français, le visa **B211A** offre une flexibilité maximale avec un séjour initial de 60 jours, extensible jusqu'à 180 jours. Idéal pour développer vos projets à Jakarta ou Surabaya.</p>
                </div>
            )
        },
        {
            id: "gci-track",
            title: "4. Track GCI pour la Diaspora en France",
            content: (
                <div className="space-y-4">
                    <p>Pour les anciens citoyens indonésiens résidant en France (Paris, Lyon, Marseille), le programme **GCI (Global Citizen of Indonesia)** offre un statut de résidence à vie avec des droits de travail complets.</p>
                </div>
            )
        },
        {
            id: "passport",
            title: "5. Validité du Passeport Français",
            content: (
                <div className="space-y-4">
                    <p>Votre passeport doit impérativement être valide **au moins 6 mois** après votre date d'arrivée. Les compagnies aériennes au départ de CDG refuseront l'embarquement sans exception.</p>
                </div>
            )
        },
        {
            id: "flights",
            title: "6. Logistique des Vols depuis la France",
            content: (
                <div className="space-y-4">
                    <p>La plupart des Français voyagent via **Singapour (SQ), Doha (QR) ou Dubaï (EK)**. Notre agence propose un service de conciergerie pour s'assurer que votre visa est lié à votre passeport avant votre embarquement.</p>
                </div>
            )
        },
        {
            id: "bali-levy",
            title: "7. Taxe Touristique de Bali (IDR 150,000)",
            content: (
                <div className="space-y-4">
                    <p>Tout citoyen français se rendant à Bali doit s'acquitter de la taxe de 150 000 IDR. Nous facilitons ce paiement en ligne via le portail 'Love Bali' pour un passage rapide.</p>
                </div>
            )
        },
        {
            id: "customs",
            title: "8. Déclaration de Douane (e-CD)",
            content: (
                <div className="space-y-4">
                    <p>La déclaration de douane est désormais numérique. Remplissez l'**e-CD** 72 heures avant votre arrivée pour obtenir votre QR code de sortie bagages.</p>
                </div>
            )
        },
        {
            id: "overstay",
            title: "9. Amendes pour Dépassement de Séjour",
            content: (
                <div className="space-y-4">
                    <p>Attention : tout jour supplémentaire sans visa valide est sanctionné par une amende de **1 000 000 IDR (~65 €)**. Ne risquez pas l'expulsion pour une erreur de calendrier.</p>
                </div>
            )
        },
        {
            id: "insurance",
            title: "10. Assurance Voyage & Santé",
            content: (
                <div className="space-y-4">
                    <p>Il est fortement recommandé d'avoir une assurance couvrant les risques médicaux et le rapatriement. Les hôpitaux de Bali (Siloam) acceptent les principales assurances internationales.</p>
                </div>
            )
        },
        {
            id: "culture",
            title: "11. Culture & Écoles Françaises à Bali",
            content: (
                <div className="space-y-4">
                    <p>Fait marquant : Bali accueille une large communauté française. Le **Lycée Français de Bali (LFB)** à Umalas offre un curriculum d'excellence pour les enfants des expatriés français.</p>
                </div>
            )
        },
        {
            id: "retirement",
            title: "12. Retraite à Bali (E33E)",
            content: (
                <div className="space-y-4">
                    <p>Pour les Français de plus de 60 ans, le visa **KITAS Retraite** permet de profiter de la douceur de vivre indonésienne avec un parrainage simplifié par notre agence.</p>
                </div>
            )
        },
        {
            id: "investment",
            title: "13. Investissements Immobiliers",
            content: (
                <div className="space-y-4">
                    <p>Nous assistons les citoyens français dans la création de structures **PT PMA** pour sécuriser leurs investissements immobiliers en bail emphytéotique (Leasehold) ou en pleine propriété sécurisée (Hak Pakai).</p>
                </div>
            )
        },
        {
            id: "digital-nomad",
            title: "14. Track Nomadisme Numérique",
            content: (
                <div className="space-y-4">
                    <p>Ulubatu et Canggu sont devenus des hubs pour les freelances français. Nous gérons votre statut de résident pour que vous travailliez légalement à distance.</p>
                </div>
            )
        },
        {
            id: "why-us",
            title: "15. Pourquoi nous faire confiance ?",
            content: (
                <div className="space-y-4">
                    <p>Agence enregistrée PT PMA avec une expertise juridique solide. Nous parlons français pour vous aider à naviguer dans les subtilités de l'immigration indonésienne.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "16. FAQ pour les Français",
            content: (
                <div className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Puis-je prolonger mon visa sur place ?</h4>
                        <p className="text-sm opacity-80">L'e-VoA de 30 jours peut être prolongée une fois pour 30 jours supplémentaires, soit un total de 60 jours, via notre service dédié.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Visa Indonésie pour les Citoyens Français 2026 : Hub Officiel"
            subtitle="Découvrez les règles d'e-VoA, les parrainages GCI et les solutions pour expatriés français avec notre expertise de laboratoire juridique."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
