import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isDefaultLocale = locale === 'en';
    
    // Canonical Strategy: English root always links to /services/Mexico
    const canonicalUrl = isDefaultLocale ? `${APP_URL}/services/Mexico` : `${APP_URL}/${locale}/services/Mexico`;

    return {
        title: "Visa de Indonesia para Ciudadanos Mexicanos 2026: Centro Oficial & GCI",
        description: "La guía definitiva para mexicanos que viajan o residen en Indonesia. e-VoA oficial para turistas, visas de negocios B211A y el programa GCI para antiguos ciudadanos.",
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'x-default': `${APP_URL}/services/Mexico`,
                'en': `${APP_URL}/services/Mexico`,
                'id': `${APP_URL}/id/services/Mexico`
            }
        }
    };
}

export default async function MexicoHubPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Services", url: `/${locale}/services` },
        { label: "Mexico Hub", url: `/${locale}/services/Mexico` }
    ];

    const cta = {
        title: "¿Viajas de Ciudad de México a Bali?",
        desc: "No permitas que la burocracia arruine tu viaje. Nuestra agencia oficial procesa tu e-VoA en menos de 24 horas para que disfrutes Indonesia sin filas.",
        buttonText: "Iniciar Mi Solicitud Mexicana",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "overview",
            title: "1. Reglas de Entrada 2026 para Mexicanos",
            content: (
                <div className="space-y-4">
                    <p>Los ciudadanos mexicanos que ingresan a Indonesia en 2026 deben contar con una visa válida. El proceso de entrada es hoy totalmente digital. Ya sea que viajes por turismo a Bali o por negocios a Yakarta, nuestro laboratorio legal facilita tu admisión oficial.</p>
                </div>
            )
        },
        {
            id: "evoa",
            title: "2. e-VoA (B1) para Turistas de México",
            content: (
                <div className="space-y-4">
                    <p>La **e-VoA (Visa Electrónica a la Llegada)** es la opción preferida por los viajeros mexicanos. Permite una estancia de 30 días extensible a 60 y acceso a los **Autogates** en los aeropuertos internacionales.</p>
                </div>
            )
        },
        {
            id: "business",
            title: "3. Visas de Negocios B211A",
            content: (
                <div className="space-y-4">
                    <p>Para inversionistas y nómadas digitales de México, la visa **B211A** ofrece hasta 180 días de estancia legal con el respaldo de nuestro patrocinio PT PMA oficial.</p>
                </div>
            )
        },
        {
            id: "gci-track",
            title: "4. Track GCI para Diáspora en México",
            content: (
                <div className="space-y-4">
                    <p>Si eres un antiguo ciudadano indonesio residente en México, el programa **GCI (Global Citizen of Indonesia)** te otorga residencia de por vida y derechos de trabajo ilimitados en Indonesia.</p>
                </div>
            )
        },
        {
            id: "identity",
            title: "5. Programa IDiv Infinity™ para Mexicanos",
            content: (
                <div className="space-y-4">
                    <p>Al procesar tu visa con nosotros, accedes a la tarjeta **IDiv Gold Variant**, un símbolo de estatus y seguridad jurídica dentro del territorio indonesio.</p>
                </div>
            )
        },
        {
            id: "passport",
            title: "6. Vigencia del Pasaporte Mexicano",
            content: (
                <div className="space-y-4">
                    <p>Tu pasaporte mexicano debe tener **al menos 6 meses de vigencia** al momento de aterrizar. Las aerolíneas denegarán el embarque si no se cumple este requisito estrictamente.</p>
                </div>
            )
        },
        {
            id: "flights",
            title: "7. Logística de Vuelos desde México",
            content: (
                <div className="space-y-4">
                    <p>La mayoría de los mexicanos vuelan vía **Los Ángeles (LAX), Seúl (ICN) o Estambul (IST)**. Asegúrate de que tu visa esté vinculada digitalmente antes de abordar tu último tramo.</p>
                </div>
            )
        },
        {
            id: "bali-levy",
            title: "8. Tasa Turística en Bali (IDR 150,000)",
            content: (
                <div className="space-y-4">
                    <p>Todo ciudadano mexicano que ingrese a Bali debe pagar la tasa de 150,000 IDR. Te recomendamos pagar a través de 'Love Bali' antes de salir de México.</p>
                </div>
            )
        },
        {
            id: "customs",
            title: "9. Declaración de Aduanas Electrónica (e-CD)",
            content: (
                <div className="space-y-4">
                    <p>No más formularios de papel. Los mexicanos deben llenar el **e-CD** 72 horas antes del arribo para obtener el código QR de salida.</p>
                </div>
            )
        },
        {
            id: "overstay",
            title: "10. Multas por Sobrepermanencia",
            content: (
                <div className="space-y-4">
                    <p>Exceder la vigencia de tu visa en Indonesia se multa con **1,000,000 IDR (~1,100 MXN) diarios**. Monitorea siempre tu fecha de salida en nuestro rastreador.</p>
                </div>
            )
        },
        {
            id: "insurance",
            title: "11. Seguro de Viaje y Salud",
            content: (
                <div className="space-y-4">
                    <p>Es vital contar con seguro internacional. Los hospitales de Bali (BIMC) están acostumbrados a trabajar con aseguradoras globales que cubren a ciudadanos mexicanos.</p>
                </div>
            )
        },
        {
            id: "surf-sports",
            title: "12. Deportes y Estilo de Vida en Bali",
            content: (
                <div className="space-y-4">
                    <p>Muchos mexicanos visitan Bali por el surf en Uluwatu. Recuérdate que para conducir una moto legalmente necesitas licencia internacional equivalente.</p>
                </div>
            )
        },
        {
            id: "investment",
            title: "13. Inversiones Inmobiliarias para Mexicanos",
            content: (
                <div className="space-y-4">
                    <p>Asesoramos en la creación de **PT PMA** para ciudadanos de México interesados en el floreciente mercado inmobiliario de Bali y Lombok.</p>
                </div>
            )
        },
        {
            id: "nomad-track",
            title: "14. Nómadas Digitales Mexicanos",
            content: (
                <div className="space-y-4">
                    <p>Canggu cuenta con una comunidad creciente de hispanohablantes. Tu visa B211A es la llave para trabajar remotamente para tus clientes en México o EE.UU.</p>
                </div>
            )
        },
        {
            id: "support",
            title: "15. ¿Por qué elegir nuestra Agencia?",
            content: (
                <div className="space-y-4">
                    <p>Somos una agencia registrada con sede física en Bali. Brindamos soporte legal para que tu estancia en el archipiélago sea 100% segura y legal.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "16. Preguntas Frecuentes (FAQ)",
            content: (
                <div className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">¿Puedo extender mi visa e-VoA?</h4>
                        <p className="text-sm opacity-80">Sí, se puede extender una vez por 30 días más, logrando un total de 60 días de estancia legal en el país.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Visa Indonesia para Ciudadanos Mexicanos 2026: Centro Oficial"
            subtitle="Explora las reglas de entrada, beneficios GCI y soluciones migratorias personalizadas para el HUB de México."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
