import React from "react";
import IdentityGuideTemplate from "@/components/legal/IdentityGuideTemplate";
import { generateCanonical } from "@/utils/seo";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia ID Card for Foreigners in Bali: Residency & Identity Services",
        description: "Specialized Bali-focused guide for expats in Canggu, Ubud, and Seminyak to secure their local identification. Learn about Disdukcapil Badung and Banjar registration.",
        alternates: {
            canonical: generateCanonical(locale, "/id-card-for-foreigner-in-bali"),
        },
    };
}

const sections = [
    {
        title: "Bali Residency: A Unique Legal Landscape",
        content: "Living in Bali is a dream for many, but maintaining legal residency requires navigating a unique dual-system of law: National Indonesian Law and Balinese Customary Law (Adat). For foreigners in Bali holding a KITAS or KITAP, your residency is not established until you are registered with both the Regency government (Disdukcapil) and your local community (Banjar).\n\nThis guide focuses specifically on the Bali-localized process of obtaining your Resident ID, addressing the unique requirements of the Island of the Gods."
    },
    {
        title: "The Importance of the Banjar in Bali",
        content: "Unlike Jakarta or Surabaya, Bali is divided into traditional community units called 'Banjars'. Every resident, including foreigners (Expats), must be known to the local Banjar head (Kaling or Kelod). In hotspots like Canggu, Berawa, and Pererenan, the Banjar plays a critical role in security and administration.\n\nTo get your Bali ID Card, you must first secure a 'Surat Domisili' from your Banjar. This level of 'Bali Wording' is essential because without the Banjar's stamp, the Regency government will not recognize your residency. We assist you in coordinating these local introductions and administrative requirements."
    },
    {
        title: "Disdukcapil Badung: The Hub for South Bali",
        content: "If you reside in Canggu, Seminyak, Kuta, Bukit, or Uluwatu, your ID card will be processed by the Disdukcapil Badung, located in Sempidi. This office is the busiest in Bali and requires precise document preparation. They are particularly strict about 'Identity Traceability'—ensuring that your work permit, residence permit, and local community registration all share exact matching data.\n\nOur specialists visit Disdukcapil Badung daily, ensuring that our clients' files are prioritized and that any data discrepancies are solved on the spot."
    },
    {
        title: "SKP and SKTT for Bali KITAS Holders",
        content: "Most expats in Bali are on a KITAS (Working, Retirement, or Investor). For you, the primary goal is the SKTT (Surat Keterangan Tempat Tinggal). In Bali, this card is your permit to exist within the local population. It is required if you want to buy a motorbike in your own name, secure a local driving license (SIM), or even just show proof of residency to local Pecalang (traditional security) during village events or festivals."
    },
    {
        title: "Ubud and Gianyar Regency Specifics",
        content: "Expats residing in Ubud, Tegallalang, or Saba fall under the jurisdiction of Disdukcapil Gianyar. The process here is slightly different and often involves more traditional documentation requirements. Being registered in Gianyar often requires a deeper verification of your domicile, as the region is heavily focused on cultural preservation. We have local agents dedicated specifically to the Gianyar regency for our Ubud-based clients."
    },
    {
        title: "Identity for Mixed Couples in Bali",
        content: "Bali has a high concentration of mixed-marriage couples. If you are married to a local Balinese, your integration into their Family Card (KK) and the subsequent issuance of your KTP-el is a profound legal step. It integrates you into the local Adat system and provides significant long-term legal security. We specialize in the sensitive and complex paperwork required for mixed households in Bali."
    },
    {
        title: "Bali SIM (Driving License) Requirements",
        content: "Did you know you cannot get a five-year Indonesian Driving License (SIM) in Bali without a valid Resident ID? Whether you want a SIM A (Car) or SIM C (Motorbike) from the Polresta Badung or Denpasar, you will be asked for your SKTT or KTP-el. By securing your resident ID first, you unlock the ability to drive legally across the island without relying on temporary international permits."
    },
    {
        title: "SKCK: Police Clearance for Bali Residents",
        content: "When it comes time to extend your long-term visa or apply for a permanent residency (KITAP) or even an Indonesian passport (Citizenship), the authorities will require an SKCK (Surat Keterangan Catatan Kepolisian). In Bali, this is issued by the Polda Bali or local Polres. They will explicitly ask for your local resident ID and Family Card before they can run a background check. Our 'Total Bali Legality' service ensures these documents are always ready when you need them."
    },
    {
        title: "Opening a Bali Bank Account (BCA, Mandiri, BNI)",
        content: "While some banks in Bali allow account opening with just a passport and KITAS, having a local ID card makes the process significantly faster and provides access to more advanced banking features like Credit Cards, higher transaction limits, and local digital payments (QRIS). Your NIK (National ID Number) from your Bali ID card becomes your primary identifier in the Indonesian financial system."
    },
    {
        title: "Conclusion: Why Indonesian Visas is the Best in Bali",
        content: "Navigating the 'Bali Way' of bureaucracy requires patience, local knowledge, and established relationships. With over 16 years of operation in Denpasar and Badung, Indonesian Visas is the most trusted agency for foreigner identity services. We don't just process papers; we secure your right to call Bali home. Contact us today via WhatsApp or Email to start your Bali residency registration."
    }
];

export default async function IdCardBaliPage() {
    return (
        <IdentityGuideTemplate 
            title="Indonesia ID Card for Foreigners in Bali"
            description="The ultimate local identity guide for Bali expats. From Banjar registration to Disdukcapil Badung. Canggu, Ubud, and Seminyak localized legal services."
            sections={sections}
        />
    );
}
