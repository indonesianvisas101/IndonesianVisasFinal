import React from "react";
import IdentityGuideTemplate from "@/components/legal/IdentityGuideTemplate";
import { generateCanonical } from "@/utils/seo";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "How to Get an Indonesian Family Card (Kartu Keluarga) for Foreigners",
        description: "Official guide for foreign families and KITAS/KITAP holders on obtaining a Family Card (Kartu Keluarga) in Indonesia. Essential for long-term residency and legal status.",
        alternates: {
            canonical: generateCanonical(locale, "/family-card-for-foreigner-in-indonesia"),
        },
    };
}

const sections = [
    {
        title: "The Role of the Family Card (KK) for Expats",
        content: "In the Indonesian administrative system, the 'Kartu Keluarga' (Family Card) is as important as the individual ID card. It is a government-issued document that lists the names, relationships, and identities of every member of a household. For foreigners living in Bali or Jakarta on residency permits (KITAS/KITAP), being registered on a Family Card is a critical step in achieving full legal compliance.\n\nWhether you are a foreign family moving together or a foreigner married to an Indonesian citizen, the Kartu Keluarga serves as the primary reference for local government services, school enrollments for your children, and the issuance of individual KTP-el or SKTT cards."
    },
    {
        title: "Kartu Keluarga for Foreign Households",
        content: "Can a family of 100% foreigners have an Indonesian Family Card? Yes. If you and your family hold KITAS or KITAP residency permits, you are required to register your household. The Disdukcapil (Civil Registry) will issue a Family Card that lists all foreign members, their passport numbers, and their residency permit details.\n\nThis document is essential when you want to process ID cards for each family member, as the NIK (National ID Number) for each person is derived from and managed within the Family Card database."
    },
    {
        title: "Mixed Marriage Households",
        content: "For foreigners married to Indonesian citizens, the Kartu Keluarga is the cornerstone of your legal life in Indonesia. In a mixed marriage, the Indonesian spouse is usually the 'Head of Household' on the card, and the foreign spouse is listed with their nationality and KITAS/KITAP details.\n\nEnsuring that the foreign spouse is correctly added to the Indonesian spouse’s KK is a prerequisite for applying for a 'Spouse-Sponsored KITAS' and is vital for potential future citizenship applications (Naturalization)."
    },
    {
        title: "Registration Process in Bali: Banjar to Disdukcapil",
        content: "If you reside in Bali—whether in a private villa in Canggu or a family home in Sanur—the process begins at the local level. You must first register with your local Banjar (Kaling). They will verify your residency and provide you with a 'Surat Keterangan' that acknowledges your household's presence in the village.\n\nWith this letter, along with your immigration documents, you then apply to the Regency Disdukcapil (e.g., Badung or Gianyar) to have your Family Card printed. Our team specialized in Bali regional administration handles this entire hierarchy of bureaucracy for you."
    },
    {
        title: "Requirements for Foreign Card Issuance",
        content: "To secure a Kartu Keluarga for your household in Indonesia, you will need:\n\n- Valid KITAS or KITAP for all members.\n- Certified English or Indonesian translations of your Marriage Certificate.\n- Birth Certificates for all children (duly translated and often apostilled/legalized).\n- Valid Passports for all family members.\n- Domicile Certificate from the local Bali village or apartment management.\n- Indonesian ID (KTP) of the sponsor (if applicable)."
    },
    {
        title: "Importance for School and Healthcare",
        content: "Many expats are surprised to find that enrollment in International Schools in Bali often requires a NIK or proof of local residency. Having your children listed on a Kartu Keluarga provides this proof instantly. Furthermore, if you wish to enroll your family in the national healthcare system (BPJS) or secure long-term local insurance, the KK is the document requested to prove the family unit."
    },
    {
        title: "Updating Data: Births and Moves",
        content: "The Family Card is a living document. If you have a child born in Indonesia, or if a family member leaves the country permanently, the KK must be updated. Similarly, if your family moves from a villa in Seminyak to a house in Ubud, you must process a 'Letter of Move' (Surat Pindah) to transfer your Kartu Keluarga data to the new sub-district registry."
    },
    {
        title: "Elite Concierge for Foreign Families",
        content: "At Indonesian Visas, we understand that your family's time is valuable. We offer a dedicated 'Family Residency Package' that handles the individual ID cards (SKP/KTP) and the Family Card (KK) simultaneously. We coordinate with the local Banjar heads and the Disdukcapil officers to ensure your family is 100% legal without you ever having to step foot in a government office."
    }
];

export default async function FamilyCardPage() {
    return (
        <IdentityGuideTemplate 
            title="Indonesian Family Card for Foreigners"
            description="The complete expatriate guide to obtaining the 'Kartu Keluarga' (KK). Ensure your household is legally registered in Bali and Indonesia for school, health, and residency."
            sections={sections}
        />
    );
}
