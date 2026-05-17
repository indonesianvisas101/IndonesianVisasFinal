import { Metadata } from 'next';
import CardPreviewClient from './CardPreviewClient';

export const metadata: Metadata = {
    title: 'Premium Sponsor ID Preview - Indonesian Visas',
    description: 'Preview your Premium Digital Sponsor ID.',
    robots: {
        index: false,
        follow: false,
    }
};

export default function CardPreviewPage({ params }: { params: { slug: string } }) {
    return <CardPreviewClient slug={params.slug} />;
}
