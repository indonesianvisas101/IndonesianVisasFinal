import React from "react";
import IdentityGuideTemplate from "@/components/legal/IdentityGuideTemplate";
import { generateCanonical } from "@/utils/seo";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "KTP for Foreigners in Indonesia: Requirements, Pricing & Process 2026",
        description: "Official guide for foreign residents to obtain an Electronic ID Card (KTP-el) in Indonesia. Learn about the 'Orange KTP' for foreigners and residency requirements.",
        alternates: {
            canonical: generateCanonical(locale, "/ktp-for-foreigner-in-indonesia"),
        },
    };
}

const sections = [
    {
        title: "The Reality of KTP for Foreign Residents",
        content: "Commonly referred to as the 'KTP Orang Asing', the Indonesian Electronic Resident Identity Card (KTP-el) is the gold standard of residency for international citizens in the archipelago. Under current regulations, foreign nationals residing in Indonesia on a KITAP (Fixed Stay Permit) are required by law to register for an electronic ID at their local civil registry office.\n\nWhile many expats colloquially use the term 'KTP' to refer to any local ID, the official KTP-el is a specific document reserved for permanent residents, providing them with a NIK (Nomor Induk Kependudukan) that is used for nearly all advanced administrative functions in Indonesia, including owning vehicles, getting health insurance (BPJS), and processing high-level banking services."
    },
    {
        title: "Eligibility: Who Can Apply for an Indonesian KTP?",
        content: "Not every expat is eligible for a KTP. The primary requirement is holding a valid ITAP (Izin Tinggal Tetap). If you are currently on a KITAS, you will instead process an SKTT (Surat Keterangan Tempat Tinggal), which serves as your temporary resident identity. However, once you have resided in Indonesia for the required number of years (usually 3-5 years on consecutive KITAS) and successfully converted to a KITAP, the gateway to the KTP-el opens.\n\nAt Indonesian Visas, we assist long-term residents in navigating the transition from KITAS to KITAP, and subsequently, from SKTT to the full KTP-el residency documents."
    },
    {
        title: "Physical Differences: The 'Orange' KTP-el",
        content: "To maintain clarity in population administration, the Indonesian government issues KTP-el cards to foreigners that are visually distinct from those held by citizens. While the layout, security features, and chips are identical, the card color for foreigners is typically a unique hue (often referred to as 'KTP Orange' to distinguish it from the citizen's 'KTP Blue').\n\nAdditionally, the 'Kewarganegaraan' (Citizenship) field will display your foreign nationality, and the 'Masa Berlaku' (Validity) will reflect a fixed date (usually 5 years) rather than the 'Seumur Hidup' (Lifetime) validity enjoyed by Indonesian nationals."
    },
    {
        title: "Essential Requirements for KTP Foreigners 2026",
        content: "Preparing for your KTP-el application in Bali or Jakarta requires a meticulous gathering of legal dossiers. The following are non-negotiable requirements for 2026:\n\n1. A Valid and Validated ITAP (Permanent Stay Permit).\n2. Passport with more than 12 months validity.\n3. Original and copy of the Family Card (KK) for foreigners.\n4. Domicile confirmation from the local village (Desa/Kelurahan).\n5. Police Report Certificate (STM).\n6. Formal 3x4 photos with a Red background (traditional requirement, though many Disdukcapil now use digital live capture)."
    },
    {
        title: "The KTP-el Issuance Process in Bali",
        content: "The process begins with the verification of your KITAP at the local Immigration office. Once verified, you proceed to the Regency Disdukcapil (Civil Registry). In Bali, regulators are particularly focused on the 'Domicile Consistency'—meaning your residence address in the ITAP must perfectly match the address on your local Banjar domicile letter.\n\nOur Bali office handles the coordination between Bali Immigration and the Disdukcapil Badung or Gianyar to ensure that your data is synced correctly in the national population system, preventing common NIK synchronization errors."
    },
    {
        title: "Benefits of Holding an Indonesian KTP-el",
        content: "Holding a KTP-el as a foreigner changes your experience of living in Indonesia. You are recognized as a formal permanent resident, which offers several perks:\n\n- Easier processing of an Indonesian Driving License (SIM).\n- Direct registration for BPJS Kesehatan (National Health Insurance).\n- Capability to open multiple bank accounts with fewer restrictions.\n- Recognition during local Bali security (Pecalang) checks as a registered resident.\n- Streamlined processing for various local permits and business licenses."
    },
    {
        title: "Renewal and Maintenance of Your ID",
        content: "Unlike the citizenship KTP, your card has an expiration date. You must initiate a renewal at least 2-3 months before the card expires to avoid being tagged as an 'illegal resident' in the population database. If you change your address within Indonesia (移居/Pindah), you must register the move in both your old and new regency Disdukcapil to update your KTP-el address."
    },
    {
        title: "How Indonesian Visas Facilitates Your KTP",
        content: "We provide a white-glove service for KITAP holders. We collect your documents, handle the local village (Desa) and Banjar coordination, schedule your biometric appointment at the Disdukcapil, and deliver the physical KTP-el card directly to your villa in Bali or office in Jakarta. We ensure that every 'I' is dotted and every 'T' is crossed, allowing you to enjoy your permanent residency without the stress of bureaucratic hurdles."
    }
];

export default async function KtpForeignerPage() {
    return (
        <IdentityGuideTemplate 
            title="KTP for Foreigners in Indonesia"
            description="Secure your permanent residency status with the full Electronic ID Card (KTP-el). The complete guide for long-term expats, KITAP holders, and foreign families in Indonesia."
            sections={sections}
        />
    );
}
