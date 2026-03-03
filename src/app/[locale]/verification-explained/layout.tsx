import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Verification System Explained | Indonesian Visas",
    description: "Understand how the Indonesian Visas QR Verification System works. Learn about data visibility, status codes (Valid/Revoked), and security features.",
    openGraph: {
        title: "QR Verification System Explained",
        description: "Official guide to verifying Indonesian Visas documents.",
    },
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
