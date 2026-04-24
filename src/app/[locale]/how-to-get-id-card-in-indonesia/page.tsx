import React from "react";
import IdentityGuideTemplate from "@/components/legal/IdentityGuideTemplate";
import { generateCanonical } from "@/utils/seo";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "How to Get an ID Card in Indonesia: A Step-by-Step Guide for Expats",
        description: "A comprehensive tutorial on securing your local identification as a foreigner in Indonesia. From KITAS to KTP, we cover every step of the legal process.",
        alternates: {
            canonical: generateCanonical(locale, "/how-to-get-id-card-in-indonesia"),
        },
    };
}

const sections = [
    {
        title: "Starting Your Identity Journey in Indonesia",
        content: "If you have recently moved to Indonesia on a KITAS or KITAP, your passport is no longer your only required ID. To live, work, and commute legally, you must enter the national population database. This guide provides a clear, step-by-step roadmap for expats to obtain their mandatory local ID cards, ensuring you avoid the common pitfalls of Indonesian bureaucracy."
    },
    {
        title: "Step 1: The Foundation — Your Stay Permit",
        content: "Before you can apply for a Resident ID, you must have a valid residency permit. This means your KITAS (Kartu Izin Tinggal Terbatas) or KITAP (Kartu Izin Tinggal Tetap) must be fully processed by Immigration. You cannot apply for a local resident ID on a B211A Visitor Visa or a Visa on Arrival (VoA). The Resident ID is reserved for those who have a permit to 'reside' (stay for 6-12+ months)."
    },
    {
        title: "Step 2: Police Registration (STM)",
        content: "Once your visa is active, your sponsor or agent must report your presence to the local police department to obtain a 'Surat Tanda Melapor' (STM). This document confirms that the police are aware of your residence address. The STM is a prerequisite for your Disdukcapil application and is often checked during stay permit extensions."
    },
    {
        title: "Step 3: Local Bali Community Check-in (Banjar)",
        content: "In Bali, the power lies with the local community. You must visit your local Banjar head (Kaling) with your passport and lease agreement. They will issue a community-level domicile certificate. This 'Bali Wording' refers to the unique Adat (customary) registration that is mandatory for anyone living in Canggu, Ubud, or Bukit. This letter is the key that unlocks the national registry offices."
    },
    {
        title: "Step 4: The SKTT Application (Limited Stay)",
        content: "For KITAS holders, the next goal is the SKTT (Surat Keterangan Tempat Tinggal). This is technically a 'Certificate of Residence' but it serves as your primary local ID. You (or your agent) submit your dossier to the Disdukcapil (Civil Registry Office) in your regency. This is now largely a digital process, but biometric verification is still required in many regions."
    },
    {
        title: "Step 5: Biometric Capturing and Data Entry",
        content: "At the Disdukcapil, you will undergo biometric data capturing. This involves taking a formal digital photograph, scanning all ten fingerprints, and occasionally a digital iris scan. This data is linked to your NIK (National ID Number). Once registered, your information exists in the 'Sistem Informasi Administrasi Kependudukan' (SIAK), the national data backbone of Indonesia."
    },
    {
        title: "Step 6: Issuance and Physical ID Receipt",
        content: "After biometrics, the processing time varies from 3 to 10 working days. In Bali, the cards are usually printed at the Regency office in Badung (Sempidi) or Denpasar. Once printed, the card is officially your local ID. It proves you are a legal resident and allows you to access services like local bank accounts and Indonesian driver’s licenses (SIM)."
    },
    {
        title: "Step 7: Mandatory Maintenance and Extensions",
        content: "Your ID card is tied to your KITAS/KITAP. When you extend your visa, you MUST extend your ID card. Many expats forget this final step, leading to 'Identity Gaps' in the database that can cause issues years later during citizenship or permanent residency applications. Indonesian Visas provides an automated tracking service to ensure your IDs never expire."
    },
    {
        title: "Professional Concierge Service in Bali",
        content: "Don't spend your days off sitting in government offices. Indonesian Visas specializes in the 'End-to-End Residency' path. We handle the Banjar, the Police, and the Disdukcapil. All you do is show up for your 10-minute biometric appointment. We do the rest, ensuring your life in Bali is legally sound and stress-free."
    }
];

export default async function HowToGetIdPage() {
    return (
        <IdentityGuideTemplate 
            title="How to Get an ID Card in Indonesia"
            description="The step-by-step masterclass for expatriates. Secure your SKTT, SKP, and NIK legally with our comprehensive Indonesian population registry guide."
            sections={sections}
        />
    );
}
