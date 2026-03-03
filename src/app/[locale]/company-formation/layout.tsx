import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Company Formation in Indonesia | PT PMA, Local PT & CV",
    description: "Start your business in Indonesia with our comprehensive company formation services. Offering 100% Foreign Ownership (PT PMA), Local PT, and CV registration packages.",
    keywords: ["PT PMA", "Company Registration Indonesia", "Bali Business Setup", "Foreign Investment Indonesia", "Local PT", "Visa Indonesia"],
    openGraph: {
        title: "Company Formation in Indonesia | PT PMA & Legal Services",
        description: "Complete business setup services in Indonesia. Establish your PT PMA or Local Company today.",
        type: "website",
    }
};

export default function CompanyFormationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
