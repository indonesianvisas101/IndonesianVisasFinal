import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isDefaultLocale = locale === 'en';
    
    // Canonical Strategy: English root always links to /services/Brazil
    const canonicalUrl = isDefaultLocale ? `${APP_URL}/services/Brazil` : `${APP_URL}/${locale}/services/Brazil`;

    return {
        title: "Visto para Indonésia para Cidadãos Brasileiros 2026: Hub Oficial & GCI",
        description: "O guia definitivo para brasileiros que viajam ou residem na Indonésia. e-VoA oficial para turistas, vistos de negócios B211A e o programa GCI para ex-cidadãos.",
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'x-default': `${APP_URL}/services/Brazil`,
                'en': `${APP_URL}/services/Brazil`,
                'id': `${APP_URL}/id/services/Brazil`
            }
        }
    };
}

export default async function BrazilHubPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Services", url: `/${locale}/services` },
        { label: "Brazil Hub", url: `/${locale}/services/Brazil` }
    ];

    const cta = {
        title: "¿Viajando de Rio ou São Paulo para Bali?",
        desc: "Não deixe a burocracia atrapalhar sua viagem. Nossa agência oficial processa seu e-VoA em menos de 24 horas para que você aproveite a Indonésia sem filas.",
        buttonText: "Iniciar Meu Pedido Brasileiro",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "overview",
            title: "1. Regras de Entrada 2026 para Brasileiros",
            content: (
                <div className="space-y-4">
                    <p>Os cidadãos brasileiros que entram na Indonésia em 2026 devem portar um visto válido. O processo de entrada é agora totalmente digital. Seja para turismo em Bali ou negócios em Jacarta, nosso laboratório jurídico facilita sua admissão oficial.</p>
                </div>
            )
        },
        {
            id: "evoa",
            title: "2. e-VoA (B1) para Turistas do Brasil",
            content: (
                <div className="space-y-4">
                    <p>O **e-VoA (Visto Eletrônico na Chegada)** é a opção preferida pelos viajantes brasileiros. Permite uma estadia de 30 dias extensível para 60 e acesso aos **Autogates** nos aeroportos internacionais.</p>
                </div>
            )
        },
        {
            id: "business",
            title: "3. Vistos de Negócios B211A",
            content: (
                <div className="space-y-4">
                    <p>Para investidores e nômades digitais do Brasil, o visto **B211A** oferece até 180 dias de estadia legal com o respaldo do nosso patrocínio PT PMA oficial.</p>
                </div>
            )
        },
        {
            id: "gci-track",
            title: "4. Track GCI para Diáspora no Brasil",
            content: (
                <div className="space-y-4">
                    <p>Para ex-cidadãos indonésios residentes no Brasil, o programa **GCI (Global Citizen of Indonesia)** oferece residência vitalícia e direitos de trabalho ilimitados na Indonésia.</p>
                </div>
            )
        },
        {
            id: "passport",
            title: "5. Validade do Passaporte Brasileiro",
            content: (
                <div className="space-y-4">
                    <p>O seu passaporte brasileiro **deve ter pelo menos 6 meses de validade** a partir da data de chegada. As companhias aéreas negarão o embarque se este requisito não for cumprido.</p>
                </div>
            )
        },
        {
            id: "flights",
            title: "6. Logística de Voos do Brasil",
            content: (
                <div className="space-y-4">
                    <p>A maioria dos brasileiros voa via **Dubai (EK), Doha (QR) ou Joanesburgo (SA/LA)**. Certifique-se de que seu visto esteja digitalmente vinculado antes do seu último trecho.</p>
                </div>
            )
        },
        {
            id: "bali-levy",
            title: "7. Taxa Turística em Bali (IDR 150.000)",
            content: (
                <div className="space-y-4">
                    <p>Todo cidadão brasileiro que entra em Bali deve pagar a taxa de 150.000 IDR. Recomendamos pagar através do 'Love Bali' antes de sair do Brasil.</p>
                </div>
            )
        },
        {
            id: "customs",
            title: "8. Declaração de Alfândega Eletrônica (e-CD)",
            content: (
                <div className="space-y-4">
                    <p>Os brasileiros devem preencher o **e-CD** 72 horas antes da chegada para obter o código QR de saída das malas.</p>
                </div>
            )
        },
        {
            id: "overstay",
            title: "9. Multas por Excesso de Estadia",
            content: (
                <div className="space-y-4">
                    <p>Exceder a validade do seu visto na Indonésia é multado em **1.000.000 IDR diariamente**. Monitore sempre sua data de saída em nosso rastreador.</p>
                </div>
            )
        },
        {
            id: "insurance",
            title: "10. Seguro Viagem e Saúde",
            content: (
                <div className="space-y-4">
                    <p>É vital contar com seguro internacional. Os hospitais de Bali (BIMC/Siloam) aceitam as principais seguradoras globais que cobrem cidadãos brasileiros.</p>
                </div>
            )
        },
        {
            id: "surfers-lifestyle",
            title: "11. Surf e Estilo de Vida em Bali para Brasileiros",
            content: (
                <div className="space-y-4">
                    <p>Bali é um destino sagrado para os surfistas brasileiros. De Uluwatu a Medewi, ajudamos você a focar nas ondas enquanto cuidamos da sua legalidade migratória.</p>
                </div>
            )
        },
        {
            id: "retirement",
            title: "12. Aposentadoria nos Trópicos (E33E)",
            content: (
                <div className="space-y-4">
                    <p>Para brasileiros acima de 60 anos, o visto **Retirement KITAS** oferece uma rota para residência permanente na Indonésia com o suporte da nossa agência oficial.</p>
                </div>
            )
        },
        {
            id: "investment",
            title: "13. Investimentos Imobiliários para Brasileiros",
            content: (
                <div className="space-y-4">
                    <p>Assessoramos na criação de **PT PMA** para cidadãos brasileiros interessados no mercado imobiliário em expansão de Bali e Lombok.</p>
                </div>
            )
        },
        {
            id: "digital-nomad",
            title: "14. Track Nômade Digital Brasileiro",
            content: (
                <div className="space-y-4">
                    <p>Canggu conta com uma comunidade crescente de brasileiros. Seu visto B211A é a chave para trabalhar remotamente para seus clientes no Brasil ou exterior.</p>
                </div>
            )
        },
        {
            id: "why-us",
            title: "15. Por que escolher nossa Agência?",
            content: (
                <div className="space-y-4">
                    <p>Somos uma agência registrada PT PMA com sede física em Bali e Jacarta. Garantimos 100% de segurança jurídica para seus documentos de origem brasileira.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "16. Perguntas Frequentes (FAQ)",
            content: (
                <div className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Posso estender meu visto e-VoA?</h4>
                        <p className="text-sm opacity-80">Sim, o e-VoA de 30 dias pode ser estendido uma vez por mais 30 dias, totalizando 60 dias de estadia legal.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Visto Indonésia para Cidadãos Brasileiros 2026: Centro Oficial"
            subtitle="Explore as regras de entrada, benefícios GCI e soluções migratórias elétrizantes para viajantes e investidores brasileiros."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
