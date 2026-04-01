import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isDefaultLocale = locale === 'en';
    
    // Canonical Strategy: English root always links to /services/Poland
    const canonicalUrl = isDefaultLocale ? `${APP_URL}/services/Poland` : `${APP_URL}/${locale}/services/Poland`;

    return {
        title: "Wizy do Indonezji dla Polaków 2026: Oficjalny Hub & GCI Diaspora",
        description: "Kompleksowy przewodnik dla obywateli Polski podróżujących lub mieszkających w Indonezji. Oficjalna e-VoA dla turystów, wizy biznesowe B211A i program GCI.",
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'x-default': `${APP_URL}/services/Poland`,
                'en': `${APP_URL}/services/Poland`,
                'id': `${APP_URL}/id/services/Poland`
            }
        }
    };
}

export default async function PolandHubPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Services", url: `/${locale}/services` },
        { label: "Poland Hub", url: `/${locale}/services/Poland` }
    ];

    const cta = {
        title: "Lecisz z Warszawy lub Krakowa do Bali?",
        desc: "Nie daj się zaskoczyć biurokracji. Nasze oficjalne biuro PT PMA przetwarza Twoją e-VoA w mniej niż 24 godziny, abyś mógł cieszyć się Indonezją bez kolejek.",
        buttonText: "Rozpocznij Moje Polskie Zgłoszenie",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "overview",
            title: "1. Zasady Wjazdu 2026 dla Polaków",
            content: (
                <div className="space-y-4">
                    <p>Obywatele Polski wjeżdżający do Indonezji w 2026 roku muszą posiadać ważną wizę. Proces wjazdowy jest teraz w pełni cyfrowy. Niezależnie od tego, czy udajesz się na wakacje na Bali, czy w interesach do Dżakarty, zapewniamy oficjalne wsparcie dla Twojego bezpieczeństwa prawnego.</p>
                </div>
            )
        },
        {
            id: "evoa",
            title: "2. e-VoA (B1) dla Turystów z Polski",
            content: (
                <div className="space-y-4">
                    <p>Wiza elektroniczna przy wjeździe (**e-VoA**) jest standardowym wyborem dla turystów. Umożliwia ona obywatelom Polski korzystanie z cyfrowych **Autogate** na lotniskach w Dżakarcie i na Bali, co znacznie przyspiesza odprawę paszportową.</p>
                </div>
            )
        },
        {
            id: "business",
            title: "3. Wizy Biznesowe B211A",
            content: (
                <div className="space-y-4">
                    <p>Dla polskich inwestorów i freelancerów wiza **B211A** oferuje początkowy 60-dniowy pobyt z możliwością przedłużenia do 180 dni pod patronatem naszej oficjalnej agencji PT PMA.</p>
                </div>
            )
        },
        {
            id: "gci-track",
            title: "4. GCI Track dla Polonii w Indonezji",
            content: (
                <div className="space-y-4">
                    <p>Dla byłych obywateli Indonezji mieszkających w Polsce, program **GCI (Global Citizen of Indonesia)** zapewnia dożywotnie prawo pobytu i pełną swobodę pracy w Indonezji.</p>
                </div>
            )
        },
        {
            id: "passport",
            title: "5. Ważność Polskiego Paszportu",
            content: (
                <div className="space-y-4">
                    <p>Twój polski paszport **musi być ważny co najmniej 6 miesięcy** od daty przyjazdu. Linie lotnicze (np. LOT, Qatar, Emirates) nie wpuszczą Cię na pokład, jeśli ten wymóg nie zostanie spełniony.</p>
                </div>
            )
        },
        {
            id: "flights",
            title: "6. Logistyka Lotów z Polski",
            content: (
                <div className="space-y-4">
                    <p>Większość Polaków lata przez **Dohę (QR), Dubaj (EK) lub Stambuł (TK)**. Upewniamy się, że Twoja wiza cyfrowa jest powiązana z paszportem przed Twoim ostatnim etapem podróży do Indonezji.</p>
                </div>
            )
        },
        {
            id: "bali-levy",
            title: "7. Podatek Turystyczny w Bali (IDR 150,000)",
            content: (
                <div className="space-y-4">
                    <p>Każdy obywatel Polski odwiedzający Bali musi uiścić opłatę w wysokości 150 000 IDR. Zalecamy dokonanie płatności przez 'Love Bali' przed wyjazdem z Polski, aby uniknąć kolejek.</p>
                </div>
            )
        },
        {
            id: "customs",
            title: "8. Elektroniczna Deklaracja Celna (e-CD)",
            content: (
                <div className="space-y-4">
                    <p>Od 2026 r. każdy przyjazd musi wypełnić formularz **e-CD** w ciągu 72 godzin przed lądowaniem. Otrzymasz kod QR, który przyspieszy wyjście z bagażami.</p>
                </div>
            )
        },
        {
            id: "overstay",
            title: "9. Kary za Przekroczenie Pobytu",
            content: (
                <div className="space-y-4">
                    <p>Nie przekraczaj ważności wizy! Przekroczenie pobytu kosztuje **IDR 1.000.000 dziennie (~260 PLN)**. Unikaj problemów administracyjnych dzięki naszemu systemowi śledzenia wiz.</p>
                </div>
            )
        },
        {
            id: "insurance",
            title: "10. Ubezpieczenie Turystyczne i Zdrowotne",
            content: (
                <div className="space-y-4">
                    <p>Zaleca się posiadanie szerokiego ubezpieczenia podróżnego. Główne szpitale na Bali (Siloam/BIMC) akceptują większość polis międzynarodowych, które wybierają Polacy.</p>
                </div>
            )
        },
        {
            id: "idiv-infinity",
            title: "11. IDiv Infinity™ dla Polaków",
            content: (
                <div className="space-y-4">
                    <p>Klienci korzystający z naszych usług otrzymują specjalny wariant karty IDiv Gold. Jest to Twoja gwarancja statusu prawnego i bezpieczeństwa na terytorium Indonezji.</p>
                </div>
            )
        },
        {
            id: "nomad-track",
            title: "12. Track dla Cyfrowych Nomadów z Polski",
            content: (
                <div className="space-y-4">
                    <p>Uluwatu i Canggu to coraz popularniejsze huby dla polskich freelancerów pracujących zdalnie. Zarządzamy Twoją wizą B211A, abyś mógł legalnie pracować dla polskich klientów z rajów na Bali.</p>
                </div>
            )
        },
        {
            id: "retirement",
            title: "13. Emerytura w Tropikach (E33E)",
            content: (
                <div className="space-y-4">
                    <p>Dla Polaków powyżej 60 roku życia wiza **Retirement KITAS** oferuje wyjątkową ścieżkę do stałego pobytu w Indonezji przy stałym wsparciu naszej agencji.</p>
                </div>
            )
        },
        {
            id: "investment",
            title: "14. Inwestycje w Nieruchomości",
            content: (
                <div className="space-y-4">
                    <p>Pomagamy polskim inwestorom w tworzeniu struktur **PT PMA**, aby zabezpieczyć ich inwestycje w luksusowe wille i resorty na Bali i Lombok.</p>
                </div>
            )
        },
        {
            id: "why-us",
            title: "15. Dlaczego Polacy Nam Ufają?",
            content: (
                <div className="space-y-4">
                    <p>Jesteśmy zarejestrowaną agencją PT PMA z silną ekspertyzą prawną. Rozumiemy specyficzne potrzeby podróżnych z Polski i zapewniamy 100% zgodności dokumentów.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "16. FAQ dla Obywateli Polski",
            content: (
                <div className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Czy mogę przedłużyć e-VoA na miejscu?</h4>
                        <p className="text-sm opacity-80">30-dniowa wiza e-VoA może zostać przedłużona raz o kolejne 30 dni, co daje łącznie 60 dni legalnego pobytu za pośrednictwem naszej agencji.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Wizy do Indonezji dla Polaków 2026: Oficjalny Hub"
            subtitle="Odkryj zasady wjazdu, możliwości GCI i elitarne ścieżki wizowe dla polskich podróżników z naszą oficjalną pomocą prawną."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
