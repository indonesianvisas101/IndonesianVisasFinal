import React from "react";
import IdentityGuideTemplate from "@/components/legal/IdentityGuideTemplate";
import { generateCanonical } from "@/utils/seo";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Guide to Resident ID Cards for Foreigners in Indonesia | SKP & KTP-el",
        description: "Comprehensive legal guide for KITAS and KITAP holders on obtaining an Indonesian ID Card (SKP or KTP-el). Learn the requirements, timeline, and local regulations.",
        alternates: {
            canonical: generateCanonical(locale, "/id-card-for-foreigner-in-indonesia"),
        },
    };
}

const sections = [
    {
        title: "Understanding Legal Identity for Foreigners",
        content: "Navigating the Indonesian immigration system requires more than just a visa stamp in your passport. For foreign residents holding a KITAS (Limited Stay Permit) or KITAP (Permanent Stay Permit), obtaining a local identification document is a mandatory legal requirement under Indonesian Law No. 24 of 2013 on Population Administration.\n\nWhile your passport serves as your international travel document, the local Resident ID (commonly known as SKP for KITAS holders and KTP-el for KITAP holders) is your proof of residency within the Republic of Indonesia. Without these documents, expats in Bali and other regions may face difficulties in administrative tasks, from opening bank accounts to processing local vehicle registrations."
    },
    {
        title: "What is the SKP (Surat Keterangan Penduduk)?",
        content: "The SKP is the primary identification document issued to foreign nationals residing in Indonesia on a Limited Stay Permit (KITAS). Unlike a tourist visa which grants temporary stay, a KITAS signifies a more permanent presence, necessitating inclusion in the local population registry (Disdukcapil).\n\nIn regions like Bali, the SKP acts as your local 'KTP'—it contains your unique Identity Number (NIK), address, and validity period matching your KITAS. It is vital for staying compliant with local Banjar regulations in areas like Canggu, Seminyak, and Ubud."
    },
    {
        title: "KTP-el for Foreigners: The KITAP Benefit",
        content: "Foreigners who have successfully transitioned to a KITAP (Permanent Stay Permit) are eligible for a KTP-el (Electronic Resident Identity Card). While the physical card looks remarkably similar to the one held by Indonesian citizens, the 'Citizenship' field will clearly state your nationality, and the card usually has a validity of 5 years, renewable upon the extension of your KITAP.\n\nHaving a KTP-el significantly upgrades your administrative standing in Indonesia, often making it easier to secure long-term contracts, insurance policies, and even certain property lease arrangements."
    },
    {
        title: "The Mandatory Role of the Local Banjar in Bali",
        content: "If you are residing in Bali, the process of obtaining your ID card is uniquely tied to the local community structure known as the Banjar. Before approaching the Disdukcapil (Department of Population and Civil Registry), you must first secure a 'Domicile Letter' (Surat Keterangan Domisili) from your local Kelurahan or Desa, which often requires a visit to the Banjar head (Kaling or Kelod).\n\nThis community-level registration ensures that you are recognized as a legal resident in your specific area. Failure to register with your local Banjar can result in fines and administrative blocks when you try to process your national ID documents."
    },
    {
        title: "Step 1: Document Preparation Checklist",
        content: "To begin your application for an Indonesian Resident ID card in Bali or Jakarta, you must prepare a comprehensive dossier. The primary requirements include:\n\n- Original Passport with at least 12 months validity.\n- Valid ITAS (KITAS) or ITAP (KITAP) documents.\n- STM (Surat Tanda Melapor) from the local Police Department.\n- SKTT (Surat Keterangan Tempat Tinggal) application form.\n- Verified Domicile Letter from your local Bali Banjar or Apartment management.\n- Sponsorship certificate from your Indonesian company or spouse."
    },
    {
        title: "Step 2: Processing at Disdukcapil Bali",
        content: "Once your local community letters are secured, the application is submitted to the Disdukcapil. In Bali, this is typically handled at the Regency level (e.g., Disdukcapil Badung for Canggu/Uluwatu or Disdukcapil Denpasar for Sanur). The process involves digital biometric capturing, where your fingerprints and iris are registered into the national database.\n\nOur agency provides full concierge service for this step, ensuring you have a dedicated officer to guide you through the appointment and handle all follow-up administrative work."
    },
    {
        title: "Validity and Renewal Protocols",
        content: "Your Indonesian ID card for foreigners is not permanent; its validity is strictly tied to your stay permit. For KITAS holders, the SKP must be renewed annually alongside your visa extension. For KITAP holders, the KTP-el is valid for five years.\n\nIt is crucial to start the renewal process at least 30 days before the expiry date. Overstaying your resident ID validity, even if your visa is still valid, can lead to complications with local authorities and potential fines at the Disdukcapil level."
    },
    {
        title: "Why Expats in Bali Need Private Assistance",
        content: "The intersection of national immigration law and local Balinese customary law can be a labyrinth for even the most experienced expat. From language barriers at government offices to understanding the subtle nuances of Banjar contributions, the DIY approach often leads to weeks of delays and multiple failed attempts.\n\nIndonesian Visas offers a streamlined, legal path to securing your identity documents. We leverage 16+ years of relationships with local authorities to ensure your residency is processed correctly, legally, and swiftly without you ever having to wonder about the next step."
    }
];

export default async function IdCardForeignerPage() {
    return (
        <IdentityGuideTemplate 
            title="Resident ID Cards for Foreigners"
            description="The definitive guide for KITAS and KITAP holders to secure their legal identity in Indonesia. Navigate the SKTT, SKP, and KTP-el process with Bali's premier legal agency."
            sections={sections}
        />
    );
}
