import React from 'react';
import GCIContent from '@/components/gci/GCIContent';
import { getMessages } from '@/i18n/getMessages';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const { locale } = params;
    return {
        title: 'Indonesian Citizenship for Australians | Global Citizen of Indonesia (GCI)',
        description: 'Elite residency and citizenship-by-investment pathways for Australian nationals. Secure your lifetime access to Indonesia with the GCI program.',
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/services/Australia/indonesia-citizenship`,
        }
    };
}

export default async function AustraliaCitizenshipPage(props: Props) {
    const params = await props.params;
    const { locale } = params;
    const dict = await getMessages(locale);

    return (
        <main>
            <GCIContent dict={dict} />
        </main>
    );
}
