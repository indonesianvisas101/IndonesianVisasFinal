import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Residency & KITAS Indonesia for Australians 2026: Official Options Guide",
        description: "Official Indonesia KITAS (Limited Stay Permit) guide for Australian citizens. Explore Investor, Working, Retirement, and Marriage KITAS tracks for Aussies.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/australia/kitas-indonesia`,
        }
    };
}

export default async function AustraliaKitasPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Australia Hub", url: `/${locale}/australia` },
        { label: "KITAS Residency Guide", url: `/${locale}/australia/kitas-indonesia` }
    ];

    const cta = {
        title: "Ready to make Bali your permanent home?",
        desc: "From company formation (PT PMA) to Retirement visas, we provide end-to-end legal support for Australians seeking long-term residency in Indonesia.",
        buttonText: "Schedule a Residency Consultation",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "intro",
            title: "1. The Dream of Bali Residency",
            content: (
                <div className="space-y-4">
                    <p>For many Australians, the ultimate goal is to transition from a 'frequent flyer' to a full-time resident of Bali or Lombok. However, Indonesia does not have a 'Permanent Resident' visa that you can simply buy. You must enter a **KITAS (Kartu Izin Tinggal Terbatas)** track—a Limited Stay Permit that provides legal residency for 1 to 2 years at a time.</p>
                </div>
            )
        },
        {
            id: "investor",
            title: "2. Investor KITAS (Index E31A/E31B)",
            content: (
                <div className="space-y-4">
                    <p>Most Australian entrepreneurs who want to open a business (villa management, cafe, coworking space) use the <strong>Investor KITAS</strong>. This requires setting up a Foreign Owned Company (**PT PMA**). Under IA-CEPA, you can often own 100% of the equity, and the associated KITAS allows you to live and manage your business legally while avoiding the 'Work Permit' fees associated with traditional employment.</p>
                </div>
            )
        },
        {
            id: "working",
            title: "3. Working KITAS (E23) for Professionals",
            content: (
                <div className="space-y-4">
                    <p>If you have been hired by an Indonesian company (e.g., as a GM of a resort or a technical lead at a Jakarta startup), you will need a <strong>Working KITAS</strong>. This involves a much more rigorous process, including the DPKK 'Manpower Tax' of $1,200 USD/year paid to the Indonesian government. Check our specific 'Working for Australians' section for corporate placements.</p>
                </div>
            )
        },
        {
            id: "retirement",
            title: "4. Retirement KITAS (E33E) for Australians 60+",
            content: (
                <div className="space-y-4">
                    <p>Australia has a massive cohort of retirees living in Bali. The <strong>E33E Retirement Visa</strong> is the go-to option. To qualify, you must be 60+ years old, prove a monthly pension or passive income equivalent to $3,000 USD/month, and employ an Indonesian local helper/maid. This visa provides a stable, long-term legal status without the need for investment.</p>
                </div>
            )
        },
        {
            id: "spouse",
            title: "5. Spouse & Family KITAS (Marriage/Joining)",
            content: (
                <div className="space-y-4">
                    <p>For Australians married to Indonesian citizens (WNI), the <strong>Marriage-Sponsored KITAS (E31C)</strong> is available. This is one of the most stable and cost-effective visas, eventually leading to a 5-year KITAP (Permanent Stay Permit). It also allows you to perform some independent work in specific sectors under the spouse sponsorship.</p>
                </div>
            )
        },
        {
            id: "golden-visa",
            title: "6. The Indonesia Golden Visa for High Net-Worth Aussies",
            content: (
                <div className="space-y-4">
                    <p>Launched in late 2023, the <strong>Golden Visa</strong> allows Australian high-net-worth individuals to secure 5 or 10-year residency by either placing a significant deposit in a state-owned Indonesian bank or investing in specific government bonds/corporate shares. This is the 'fast-track' for those who want long-term peace of mind without annual renewals.</p>
                </div>
            )
        },
        {
            id: "benefits",
            title: "7. Long-Term Stay Benefits",
            content: (
                <div className="space-y-4">
                    <p>Holding a KITAS provides several 'local-rate' benefits:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Domestic Flight Prices:</strong> Access to local resident prices for Indonesian air travel.</li>
                        <li><strong>Indonesian Driver's License (SIM):</strong> Apply for a 5-year license using your residency status.</li>
                        <li><strong>Asset Ownership (HAK PAKAI):</strong> Use your KITAS to hold long-term land/villa leases under your own name (instead of a nominee).</li>
                    </ul>
                </div>
            )
        },
        {
            id: "application",
            title: "8. The Step-by-Step KITAS Process",
            content: (
                <div className="space-y-4">
                    <p>Applying for a KITAS as an Australian citizen generally follows this path:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>We apply for your <strong>E-Visa (VITAS)</strong> through the Jakarta portal while you are still in Australia.</li>
                        <li>Once the VITAS is approved, you fly into Indonesia.</li>
                        <li>Within 30 days of arrival, we take you to the local Immigration office for <strong>biometric scanning (fingerprints/photo)</strong>.</li>
                        <li>Immigration issues your ITAS (Electronic Stay Permit), allowing you to come and go from the country freely.</li>
                    </ol>
                </div>
            )
        },
        {
            id: "renewals",
            title: "9. Renewals & Transitioning to KITAP",
            content: (
                <div className="space-y-4">
                    <p>Most KITAS are valid for 12 months. After 2 or 3 renewals (depending on the type), you may be eligible to upgrade to a <strong>KITAP (Kartu Izin Tinggal Tetap)</strong>. This 'Permanent Permit' is valid for 5 years and provides the closest thing to permanent residency available in Indonesia.</p>
                </div>
            )
        },
        {
            id: "tax",
            title: "10. Tax Residency for Australians abroad",
            content: (
                <div className="space-y-4">
                    <p>When you hold a KITAS, you are technically an Indonesian Tax Resident. You must register for an <strong>NPWP (Taxpayer Identification Number)</strong> and file annual returns in Indonesia. Under the Indonesia-Australia tax treaty, you may be able to offset taxes paid in Indonesia against your Australian obligations.</p>
                </div>
            )
        },
        {
            id: "why-us",
            title: "11. Why Work with the Official Agency?",
            content: (
                <div className="space-y-4">
                    <p>Moving your life to a new country is stressful. We act as your legal anchor in Jakarta and Bali. From handling messy RPTKA (Manpower plans) for companies to ensuring your retirement paperwork is airtight, we provide <strong>Australian-standard transparency</strong> in a market that can often be confusing.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "12. FAQ for KITAS Holders",
            content: (
                <div className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can I work on a Retirement KITAS?</h4>
                        <p className="text-sm opacity-80">Strictly no. Retirement visas are only for those who are inactive. If you want to work, you must switch to a Working or Investor KITAS.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Residency & KITAS Indonesia for Australians 2026: Official Options Guide"
            subtitle="From Investor (PMA) setups to the E33E Retirement track, our expert residency team handles your long-term legal status in the archipelago."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
