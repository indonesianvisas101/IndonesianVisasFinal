import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Digital Nomad Visa Indonesia for Australians 2026 – Remote Work Guide",
        description: "The complete guide for Australian digital nomads working remotely from Bali. Learn about B211A visas, tax implications, and the best coworking hubs for Aussies.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/australia/digital-nomad`,
        }
    };
}

export default async function AustraliaDigitalNomadPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Australia Hub", url: `/${locale}/australia` },
        { label: "Digital Nomad Guide", url: `/${locale}/australia/digital-nomad` }
    ];

    const cta = {
        title: "Ready to work from the tropics?",
        desc: "We handle the sponsorship and paperwork for your 6-month B211A nomad visa. Focus on your code, we'll focus on the immigration office.",
        buttonText: "Start My Nomad Visa",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "nomad-life",
            title: "1. Why Australians Choose Bali for Remote Work",
            content: (
                <div className="space-y-4">
                    <p>For Australians, Bali is the ultimate digital nomad destination. With a timezone that overlaps perfectly with Sydney, Melbourne, and Perth, you can attend your morning stand-ups while having breakfast in <strong>Canggu or Uluwatu</strong>. The combination of low living costs, world-class cafe culture, and a massive community of fellow Australian entrepreneurs makes it the number one choice for 'work from anywhere' professionals.</p>
                </div>
            )
        },
        {
            id: "b211a",
            title: "2. The B211A: The Multi-Purpose Nomad Visa",
            content: (
                <div className="space-y-4">
                    <p>The <strong>B211A Visit Visa</strong> is the most popular choice for Australian digital nomads. It provides an initial 60 days of stay and can be extended twice for 60 days each, totaling 180 days (6 months). This visa is sponsored by our agency, meaning you don't need to leave the country to stay for half a year.</p>
                </div>
            )
        },
        {
            id: "remote-worker-visa",
            title: "3. The New Remote Worker Visa (E33G)",
            content: (
                <div className="space-y-4">
                    <p>Indonesia has recently introduced the <strong>E33G Remote Worker Visa</strong>. Designed for high-earning nomads, it requires proof of income (usually $60,000 USD+ annually) from an employer outside Indonesia. This is a more permanent solution for Australians looking to stay for a full year or more without constant renewals.</p>
                </div>
            )
        },
        {
            id: "tax",
            title: "4. Tax Implications for Aussies",
            content: (
                <div className="space-y-4">
                    <p>As an Australian citizen, you are generally taxed on your worldwide income if you are a <strong>tax resident of Australia</strong>. However, staying in Indonesia for more than 183 days in a 12-month period may trigger tax residency in Indonesia. We strongly advise consulting with a tax professional who understands the double-taxation treaty between Australia and Indonesia.</p>
                </div>
            )
        },
        {
            id: "internet",
            title: "5. Internet & Coworking Ecosystem",
            content: (
                <div className="space-y-4">
                    <p>Gone are the days of patchy Bali Wi-Fi. Most villas and coworking spaces (like <strong>Tropical Nomad, Outpost, or BWork</strong>) now feature high-speed fiber optic internet. 4G/5G coverage via Telkomsel is also excellent, allowing for seamless Zoom calls even from more remote parts of the island.</p>
                </div>
            )
        },
        {
            id: "banking",
            title: "6. Managing Finances (AUD vs IDR)",
            content: (
                <div className="space-y-4">
                    <p>To avoid high bank fees, most Australian nomads use services like <strong>Wise (formerly TransferWise) or Revolut</strong>. You can hold AUD and convert to IDR at the mid-market rate, using your card at Indonesian ATMs or for paying rent. Opening a local Indonesian bank account is possible but usually requires a KITAS.</p>
                </div>
            )
        },
        {
            id: "sponsorship",
            title: "7. Why You Need Agency Sponsorship",
            content: (
                <div className="space-y-4">
                    <p>The B211A visa requires a local sponsor who is legally responsible for you. As a licensed agency, we act as your official sponsor. This removes the need for you to find a 'local friend' to sign documents and ensures that your visa status is always 100% legal and verifiable by the Directorate General of Immigration.</p>
                </div>
            )
        },
        {
            id: "community",
            title: "8. The Australian Nomad Community",
            content: (
                <div className="space-y-4">
                    <p>You won't be alone. There are thousands of Aussies in Bali. From the 'Bali Business Network' facebook groups to the local F45 and Crossfit gyms, networking is effortless. Many Australian-founded startups have their secret 'offsite' offices tucked away in the private villas of Pererenan and Bingin.</p>
                </div>
            )
        },
        {
            id: "healthcare",
            title: "9. Healthcare & Travel Insurance",
            content: (
                <div className="space-y-4">
                    <p>Standard travel insurance is fine for short trips, but for 6-month nomad stays, we recommend <strong>Digital Nomad Health Insurance</strong> (like SafetyWing or World Nomads). These are tailored for long-term remote work and cover things that standard policies might miss once you've been out of Australia for more than 90 days.</p>
                </div>
            )
        },
        {
            id: "limits",
            title: "10. Legal Limits of 'Work'",
            content: (
                <div className="space-y-4">
                    <p>It is important to understand that on a Visit Visa (B211A), you <strong>cannot earn income from an Indonesian company</strong> or take jobs in the local Indonesian market. You must only perform work for clients or employers located outside of Indonesia. Taking a local job without a Work KITAS (E23) will result in immediate deportation.</p>
                </div>
            )
        },
        {
            id: "housing",
            title: "11. Housing & Rentals",
            content: (
                <div className="space-y-4">
                    <p>Most nomads start with an Airbnb for the first two weeks and then find monthly rentals on the ground. Facebook Marketplace and local 'Community' groups are the best places to find villa sub-lets. Be prepared to pay at least 3-6 months in advance to get the best monthly rates.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "12. FAQ for Australian Nomads",
            content: (
                <div className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can I apply for the B211A while already in Indonesia?</h4>
                        <p className="text-sm opacity-80">Yes, this is called an 'Onshore' application. If you entered on a VoA, you can switch to a B211A without leaving the country as long as the application is processed before your VoA expires.</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">What happens if my nomad visa expires?</h4>
                        <p className="text-sm opacity-80">You must either extend it (if eligible) or leave the country. We track all our clients' expiry dates and notify you 14 days in advance to ensure you never overstay.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Digital Nomad Visa Indonesia for Australians 2026 – Remote Work Guide"
            subtitle="Everything regarding B211A, Remote Worker (E33G) visas, and tax-efficient remote living for Aussie professionals in Bali."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
