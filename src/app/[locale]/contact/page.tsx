import type { Metadata } from "next";
import { getMessages } from "@/i18n/getMessages";
import ContactPageClient from "@/components/contact/ContactPageClient";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://indonesianvisas.com";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const canonical = `${APP_URL}/${locale}/contact`;

    return {
        title: "Contact Us | Indonesian Visas — Official Visa Agency",
        description:
            "Get in touch with our expert visa consultants via Email, WhatsApp, or visit our office in Bali. We handle Indonesian visas, KITAS, EVOA, and more.",
        alternates: { canonical },
        openGraph: {
            title: "Contact Indonesian Visas",
            description: "Reach our visa experts via email, WhatsApp, or at our Bali office.",
            url: canonical,
            siteName: "Indonesian Visas",
            locale: locale,
            type: "website",
        },
    };
}

export default async function ContactPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const dict = await getMessages(locale);

    return <ContactPageClient dict={dict} locale={locale} />;
}
