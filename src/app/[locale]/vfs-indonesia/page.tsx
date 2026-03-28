import type { Metadata } from 'next';
import VFSEducationalTemplate from '@/components/layout/VFSEducationalTemplate';
import { VFS_PAGES } from '@/constants/vfs-guidance';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const data = VFS_PAGES['vfs-indonesia'];
    return {
        title: data.metaTitle,
        description: data.metaDescription,
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/vfs-indonesia`,
        }
    };
}

export default async function VFSIndonesiaPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const data = VFS_PAGES['vfs-indonesia'];

    return <VFSEducationalTemplate data={data} locale={locale} />;
}
