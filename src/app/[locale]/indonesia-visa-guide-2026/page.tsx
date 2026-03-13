import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Visa Guide 2026 – Complete Immigration Guide for Foreign Visitors",
        description: "The ultimate 2026 guide to Indonesian visas. Learn about Visa on Arrival, B211A, KITAS, Investor Visas, extension processes, and immigration rules.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/indonesia-visa-guide-2026`,
        },
        openGraph: {
            title: "Indonesia Visa Guide 2026 – Complete Immigration Guide",
            description: "The ultimate 2026 guide to Indonesian visas. Learn about Visa on Arrival, B211A, KITAS, Investor Visas, extension processes, and immigration rules.",
            url: `https://indonesianvisas.com/${locale}/indonesia-visa-guide-2026`,
            siteName: "Indonesian Visas",
            type: "article",
        }
    };
}

export default async function UltimateGuidePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Guides", url: `/${locale}/guides` },
        { label: "Indonesia Visa Guide 2026", url: `/${locale}/indonesia-visa-guide-2026` }
    ];

    const cta = {
        title: "Ready to Start Your Indonesian Journey?",
        desc: "Skip the immigration lines and bureaucratic hurdles. Let PT Indonesian Visas Agency secure your legal entry and stay in Indonesia quickly and safely.",
        buttonText: "Apply Now",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "introduction",
            title: "1. Introduction to Indonesia Immigration 2026",
            content: (
                <div className="space-y-6">
                    <p>
                        Welcome to the most comprehensive and authoritative guide to Indonesian immigration for the year 2026. Whether you are a digital nomad planning to work from the lush cafes of Bali, an investor looking to capitalize on Jakarta's booming economy, a retiree seeking a peaceful tropical haven, or simply a tourist ready to explore the 17,000+ islands of the archipelago, understanding the visa and immigration landscape is your critical first step.
                    </p>
                    <p>
                        The Directorate General of Immigration in Indonesia has undergone massive digital transformation over the past few years. With the introduction of the new eVisa system, automated Autogates at major airports like Ngurah Rai (DPS) and Soekarno-Hatta (CGK), and stricter enforcement of immigration laws, the landscape is more efficient but also more strictly regulated than ever before. This 6,000+ word guide is designed to dissect every single visa category, legal requirement, extension procedure, and potential pitfall to ensure your journey is smooth, legal, and stress-free.
                    </p>
                    <p>
                        PT Indonesian Visas Agency, a registered official immigration sponsor (NIB: 0402260034806), has compiled this data directly from official policy updates, thousands of successful case studies, and daily interactions with immigration authorities. We aim to debunk outdated myths, clarify complex legal jargon, and provide you with actionable, step-by-step instructions.
                    </p>
                    <p>
                        Remember, immigration law is fluid and subject to sudden government decrees. Use this guide as your master roadmap, but always consult with our verified agents or the official immigration portals for real-time updates tailored to your specific nationality and travel timeline.
                    </p>
                </div>
            )
        },
        {
            id: "do-you-need-a-visa",
            title: "2. Do You Need a Visa for Indonesia?",
            content: (
                <div className="space-y-6">
                    <p>
                        The short answer is: <strong>Yes, the vast majority of foreign nationals require a visa to enter Indonesia.</strong> However, the specific type of visa you need depends entirely on two factors: your passport nationality and the purpose of your visit.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Visa Exemption for ASEAN Countries</h3>
                    <p>
                        If you hold a passport from one of the Association of Southeast Asian Nations (ASEAN), you are currently exempt from needing a visa for short tourism visits. The ASEAN member states include Brunei Darussalam, Cambodia, Laos, Malaysia, Myanmar, Philippines, Singapore, Thailand, and Vietnam. Citizens of these nations can enter Indonesia for a maximum of 30 days. It is crucial to note that this visa-free entry is strictly for tourism and cannot be extended under any circumstances. If you plan to stay longer or engage in business, you must apply for a different visa prior to arrival.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">The End of Global Visa-Free Travel</h3>
                    <p>
                        Prior to the global pandemic, Indonesia offered Visa-Free Entry (Bebas Visa Kunjungan) to citizens of over 160 countries. This policy has been officially suspended and is no longer applicable. Citizens of countries like the United States, Australia, the United Kingdom, Canada, and most European nations must now obtain a Visa on Arrival (VoA) or a pre-approved B211A Visit Visa to enter the country legally.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Purpose of Visit Dictates Visa Selection</h3>
                    <p>
                        When determining what visa you need, you must honestly declare your purpose of visit. Immigration authorities categorize visits mainly into:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Tourism:</strong> Sightseeing, visiting friends/family, transit.</li>
                        <li><strong>Business:</strong> Attending seminars, meetings, inspecting factories, negotiating contracts (but NOT taking a localized salary).</li>
                        <li><strong>Inestment:</strong> Setting up a PMA (Foreign Owned Company), conducting market research for direct investment.</li>
                        <li><strong>Employment:</strong> Taking up a localized salary from an Indonesian corporate entity (Requires an IMTA/RPTKA and Working KITAS).</li>
                    </ul>
                    <p>
                        Entering Indonesia on a tourist visa while intending to work or conduct business is a direct violation of Indonesian Immigration Law (Law No. 6 of 2011) and can result in immediate deportation, hefty fines, and long-term blacklisting.
                    </p>
                </div>
            )
        },
        {
            id: "types-of-visas",
            title: "3. Types of Indonesian Visas Explained",
            content: (
                <div className="space-y-6">
                    <p>
                        The Indonesian visa system is divided into Visit Visas (Index B) and Limited Stay Visas (Index C / KITAS / KITAP). Understanding the index codes is vital when navigating the bureaucracy or dealing with immigration officers. Below is a comprehensive breakdown of the core visa families available in 2026.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Visit Visas (Index B)</h3>
                    <p>
                        Visit Visas are designed for short to medium-term stays where the foreign national does not intend to reside permanently or take up localized employment. 
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>B1 - Visa on Arrival (VoA):</strong> Originally B213, this is the standard entry permit for tourism. It grants 30 days and can be extended once for another 30 days (total 60 days).</li>
                        <li><strong>B211A - Social/Cultural & Tourism Visit Visa:</strong> A highly popular pre-approved visa that grants an initial 60 days. It is extendable up to two times (each extension adding 60 days), allowing a maximum continuous stay of 180 days.</li>
                        <li><strong>B211B - Business Visit Visa:</strong> Similar duration structure to the B211A, but specifically coded and sponsored by a corporate entity to allow for business meetings, conferences, and factory inspections.</li>
                        <li><strong>D212 - Multiple Entry Business Visa:</strong> Valid for 1 or 2 years, allowing the holder to enter Indonesia multiple times. However, each individual stay is restricted to a maximum of 60 days per visit.</li>
                    </ul>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Limited Stay Visas (KITAS/ITAS - Index C)</h3>
                    <p>
                        Shorthand for "Kartu Izin Tinggal Terbatas", a KITAS is a temporary residency permit. Holding a KITAS means you are legally a resident of Indonesia, entitling you to open local bank accounts, register vehicles, and access local healthcare rates.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>C312 - Working KITAS:</strong> Sponsored by an Indonesian employer. This is the only visa that allows you to earn a salary within Indonesia legally. Requires substantial corporate paperwork and taxation compliance.</li>
                        <li><strong>C313 & C314 - Investor KITAS:</strong> For foreign shareholders and directors of a PMA (Penanaman Modal Asing / Foreign Investment Company). C313 is valid for 1 year, and C314 is valid for 2 years. Significant capital investment required.</li>
                        <li><strong>C317 - Spouse/Family KITAS:</strong> For foreigners legally married to Indonesian citizens, or children joining parents who hold a KITAS.</li>
                        <li><strong>C319 - Retirement KITAS:</strong> For applicants aged 60 and over who meet financial stability requirements and commit to not working while in the country.</li>
                    </ul>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Permanent Stay Visa (KITAP/ITAP)</h3>
                    <p>
                        The "Kartu Izin Tinggal Tetap" (KITAP) is a permanent residency permit valid for 5 years, renewable indefinitely. It is notoriously difficult to obtain and usually reserved for foreigners who have held a KITAS continuously for 3-5 years (such as those married to locals, long-term investors, or top-tier executives).
                    </p>
                </div>
            )
        },
        {
            id: "visa-on-arrival",
            title: "4. Visa on Arrival (VoA/e-VoA) Deep Dive",
            content: (
                <div className="space-y-6">
                    <p>
                        The Visa on Arrival (VoA), and its digital counterpart the e-VoA, is the lifeblood of Indonesian tourism. It is the most common entry method for travelers visiting Bali, Jakarta, Lombok, and beyond. Let's explore its exact parameters, costs, and the critical differences between the paper and electronic versions.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Eligibility & Duration</h3>
                    <p>
                        Currently, citizens of approximately 97 countries are eligible for the VoA. The visa grants exactly 30 days of stay, with the day of arrival counting as Day 1. It is critical to count the days accurately, as overstaying by even one hour triggers immediate financial penalties. The VoA can be extended exactly once, for an additional 30 days, yielding a maximum total stay of 60 days. Once the 60 days conclude, the traveler must exit the country.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">The Traditional VoA (Paper Visa)</h3>
                    <p>
                        You can obtain the Traditional VoA physically upon landing at major international airports. Before proceeding to the immigration clearance desks, you must visit the VoA payment counter. The cost is IDR 500,000. While they accept major foreign currencies (USD, AUD, EUR, SGD), the exchange rates applied at the counter are exceptionally poor. Giving exact change in IDR or using an international credit card (subject to a small processing fee) is highly recommended. The officer will affix a sticker and a stamp to your passport. 
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">The e-VoA (Electronic Visa on Arrival)</h3>
                    <p>
                        Introduced to streamline airport congestion, the e-VoA allows travelers to secure their entry permit before boarding their flight. You apply via the official Molina (Modul Integrasi Layanan) portal. The immense benefit of the e-VoA is the ability to use the automated immigration "Autogates" at Bali Ngurah Rai and Jakarta Soekarno-Hatta airports. By scanning your passport at the Autogate, you bypass the manual queues entirely, turning a 2-hour wait into a 30-second breeze.
                    </p>
                    <p>
                        Additionally, extending an e-VoA is a fully digital process. You can apply and pay for the 30-day extension online without ever needing to visit a local immigration office for photography and fingerprinting—a cumbersome requirement if you purchased the paper VoA at the airport.
                    </p>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl my-8">
                        <strong className="block mb-2">Pro Tip:</strong> 
                        <Link href={`/${locale}/visa-on-arrival-bali`} className="text-primary font-bold hover:underline">Read our complete step-by-step VoA application guide here.</Link>
                    </div>
                </div>
            )
        },
        {
            id: "b211a-guide",
            title: "5. B211A Visit Visa: The Digital Nomad's Choice",
            content: (
                <div className="space-y-6">
                    <p>
                        For those who wish to stay longer than 60 days without the heavy commitments of opening a company or securing corporate employment, the B211A Single Entry Visit Visa is the absolute gold standard. Informally known among expats as the "Digital Nomad Visa" or the "Tourist Visa", the B211A offers unparalleled flexibility for medium-term stays.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Duration and Extension Structure</h3>
                    <p>
                        Upon entering Indonesia with a B211A visa, you are granted an initial stay of exactly 60 days. As the 60 days approach their expiration, you are permitted to extend the visa two times. Each extension adds an additional 60 days to your stay.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Initial Entry:</strong> 60 Days</li>
                        <li><strong>First Extension:</strong> +60 Days (Total 120 Days)</li>
                        <li><strong>Second Extension:</strong> +60 Days (Total 180 Days)</li>
                    </ul>
                    <p>
                        This brings the maximum continuous stay to 180 days (approximately 6 months). Because this is a "Single Entry" visa, if you depart Indonesia at any point during this 180-day period, the visa immediately becomes void and cannot be used for re-entry.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Sponsorship Requirements</h3>
                    <p>
                        The B211A requires an Indonesian sponsor. For the tourism variant (Social/Cultural), this can be an individual Indonesian citizen. However, relying on an individual can lead to complex bureaucratic hurdles during the extension process. This is why 99% of foreign nationals use a registered agency, like PT Indonesian Visas Agency, to act as their corporate sponsor. Agency sponsorship guarantees smooth processing, legal backing, and hassle-free extensions without the need to bother a local friend.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Permitted Activities</h3>
                    <p>
                        The B211A strictly restricts the holder from generating localized income. You are legally allowed to engage in tourism, social visits, volunteer work (without pay), and remote "digital nomad" work provided that your clients, employers, and revenue streams are geographically located outside of Indonesia. Taking a job at a local Indonesian cafe or offering paid services to locals while on a B211A is illegal.
                    </p>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl my-8">
                        <strong className="block mb-2">Pro Tip:</strong> 
                        <Link href={`/${locale}/b211a-visa-indonesia`} className="text-primary font-bold hover:underline">Explore the full B211A Visa application requirements here.</Link>
                    </div>
                </div>
            )
        },
        {
            id: "kitas-residence",
            title: "6. KITAS Residence Permits",
            content: (
                <div className="space-y-6">
                    <p>
                        Transitioning from a tourist or visit visa to a KITAS (Kartu Izin Tinggal Terbatas) represents a major shift in your legal status in Indonesia. Holding a KITAS upgrades you from a visitor to a legal resident, affording you substantial privileges and integrating you into the Indonesian ecosystem.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">The Privileges of a KITAS</h3>
                    <p>
                        Resident status transforms daily life. With a KITAS, you are legally entitled to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Open a local Indonesian bank account (BCA, Mandiri, BNI) and access local credit infrastructure.</li>
                        <li>Purchase and register vehicles (scooters, cars) in your own legal name.</li>
                        <li>Acquire local driving licenses (SIM A and SIM C) valid for up to 5 years, avoiding the need for an International Driving Permit.</li>
                        <li>Access "local rates" at tourist attractions, hospitals, and national parks, saving significant amounts of money.</li>
                        <li>Enter and exit Indonesia freely through automated border gates without paying VoA issuance fees.</li>
                    </ul>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">The Working KITAS (Index C312)</h3>
                    <p>
                        To legally work for an Indonesian company and earn IDR, you must secure a Working KITAS. The process is rigorous. The sponsoring company must prove that no Indonesian citizen is qualified to fill your role, and they must pay a mandatory DPKK fee (approximately $1,200 USD per year) directly to the Ministry of Manpower to fund local worker training. You will also be subject to local NPWP (Tax Number) registration and progressive income tax brackets.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">The Spouse KITAS (Index C317)</h3>
                    <p>
                        If you are legally married to an Indonesian citizen, obtaining a Spouse KITAS is arguably the most stable path to residency. Valid for 1 year and renewable, this KITAS strongly positions you for acquiring the permanent KITAP after just a few years of continuous residency. Notably, under the latest regulations, a Spouse KITAS holder is permitted to engage in informal independent work to support the family without a formal corporate sponsor.
                    </p>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl my-8">
                        <strong className="block mb-2">Pro Tip:</strong> 
                        <Link href={`/${locale}/kitas-indonesia`} className="text-primary font-bold hover:underline">Access our complete matrix on all KITAS variants and eligibility here.</Link>
                    </div>
                </div>
            )
        },
        {
            id: "investor-visa",
            title: "7. Investor Visa Guide (C313 & C314)",
            content: (
                <div className="space-y-6">
                    <p>
                        Indonesia’s economy is surging, and the government has aggressively streamlined the investment landscape to attract foreign capital. By establishing a PMA (Penanaman Modal Asing - Foreign Investment Company), foreign investors unlock the ability to legally reside in the country while overseeing their enterprise and generating wealth. The Investor KITAS is the crown jewel of corporate residency.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">What is an Investor KITAS?</h3>
                    <p>
                        An Investor KITAS is a residency permit issued strictly to foreign nationals who serve as shareholders or directors within an Indonesian PMA. It exempts the holder from the grueling work permit (IMTA) process and the $1,200 annual DPKK fee required for standard working visas, provided the investor's role is strictly managerial or related to capital oversight.
                    </p>
                    <p>There are two primary variants based on duration:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Index C313:</strong> Valid for 1 Year.</li>
                        <li><strong>Index C314:</strong> Valid for 2 Years.</li>
                    </ul>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Eligibility Requirements and the 10 Billion IDR Rule</h3>
                    <p>
                        The barriers to entry have been raised to ensure only serious investment enters the country. To qualify for a PMA setup and subsequently an Investor KITAS, the foreign entity must commit to a minimum paid-up capital requirement of roughly 10 Billion IDR (approximately $650,000 USD, depending on exchange rates).
                    </p>
                    <p>
                        Furthermore, the individual applying for the Investor KITAS must hold a minimum personal share valuation of 1 Billion IDR within the company (if acting as a shareholder) or be legally appointed as the official Director/Commissioner of the enterprise. The government strictly enforces these capitalization requirements, requiring validated bank statements and notary deeds.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Limitations of the Investor KITAS</h3>
                    <p>
                        It is absolutely vital to understand that an Investor KITAS is not a "do-anything" work visa. An investor is legally allowed to direct the company, sign contracts, open corporate bank accounts, and hire employees. However, the investor cannot perform the manual, operational labor of the business. For example, if you open a restaurant PMA, you may manage the finances and sign supplier contracts, but you cannot legally cook the food or wait tables—that requires an explicit Working KITAS and compromises local labor markets.
                    </p>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl my-8">
                        <strong className="block mb-2">Pro Tip:</strong> 
                        <Link href={`/${locale}/investor-visa-indonesia`} className="text-primary font-bold hover:underline">Read the ultimate guide to forming a PMA and securing an Investor Visa.</Link>
                    </div>
                </div>
            )
        },
        {
            id: "visa-extensions",
            title: "8. Navigating Visa Extensions",
            content: (
                <div className="space-y-6">
                    <p>
                        Executing a visa extension in Indonesia can range from a swift click of a button to a weeks-long bureaucratic ordeal involving multiple physical appearances. The complexity entirely hinges on how you initially acquired the visa. The absolute golden rule of extensions is foresight: never, under any circumstances, wait until the final week before expiration to initiate the process. We mandate starting the extension process at least 7 to 14 days before your visa expires.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">The Paper VoA Extension Maze</h3>
                    <p>
                        If you purchased a physical paper Visa on Arrival sticker at the airport, you must perform a manual extension through a local immigration office (Kantor Imigrasi). This procedure typically requires three separate physical visits to the office, regardless of whether you use an agency or do it yourself:
                    </p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li><strong>Submission:</strong> Handing over your physical passport and completing extensive documentation.</li>
                        <li><strong>Biometrics:</strong> Returning roughly a week later to have your fingerprints scanned and high-resolution photo taken.</li>
                        <li><strong>Retrieval:</strong> Returning a few days later to pick up your passport containing the official extension stamp.</li>
                    </ol>
                    <p>
                        In locations like Bali, where tourism volume is astronomical, immigration offices in Denpasar, Jimbaran, and Singaraja face massive daily backlogs. What appears to be a simple process can easily consume entire travel days.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">The e-VoA Digital Extension</h3>
                    <p>
                        Conversely, if you wisely secured an electronic Visa on Arrival (e-VoA) via the Molina portal, the extension is fully digital. As long as you submit the request and process the payment on the portal before your 30th day expires, the system will automatically update your legal stay. No physical visits, no fingerprinting, and your passport remains safely with you.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">B211A Visa Extensions</h3>
                    <p>
                        The B211A visa relies heavily on your sponsor. If PT Indonesian Visas Agency acts as your sponsor, the entire backend bureaucratic handling is managed for you. We lodge the paperwork, negotiate the queuing systems, and ensure timely biometric appointments are secured. Because the B211A grants a massive 180-day potential stay across multiple extensions, robust agency support averts disastrous overstay scenarios.
                    </p>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl my-8">
                        <strong className="block mb-2">Deep Dive:</strong> 
                        <div className="flex flex-wrap gap-2 mt-2">
                            <Link href={`/${locale}/extend-voa-bali`} className="text-primary hover:underline font-semibold">Extend VoA</Link> &bull; 
                            <Link href={`/${locale}/b211a-extension-guide`} className="text-primary hover:underline font-semibold">B211A Extension Guide</Link> &bull; 
                            <Link href={`/${locale}/visa-extension-bali`} className="text-primary hover:underline font-semibold">General Bali Extension Guide</Link>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "overstay-penalties",
            title: "9. Overstay Penalties and Deportation",
            content: (
                <div className="space-y-6">
                    <p>
                        Immigration offenses are treated with extreme severity in Indonesia. What foreign tourists might consider a simple clerical oversight, Indonesian authorities view as a direct violation of national sovereignty. Modifying your travel dates, losing track of your visa validity, or missing an extension window carry immediate, non-negotiable legal and financial consequences.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">The Devastating 1 Million IDR Daily Fine</h3>
                    <p>
                        As per Government Regulation No. 28 of 2019, the penalty for overstaying your Indonesian visa is exactly <strong>1,000,000 IDR (approximately $65 USD) per person, per single day of overstay.</strong>
                    </p>
                    <p>
                        There are no maximum caps, no empathy discounts, and no waivers for missed flights or sudden illnesses unless verified heavily by authorized medical institutions prior to visa expiry. If you overstay by 14 days, you will face a fine of 14,000,000 IDR to clear immigration at the airport. You must pay this fine in cash. If you cannot produce the funds, you will be detained by immigration security, transferred to holding facilities, and prevented from boarding your flight.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Overstaying Beyond 60 Days: Immediate Deportation</h3>
                    <p>
                        If your overstay trespasses the 60-day threshold, the financial penalty structure changes entirely. You have now committed a severe immigration felony. The immediate protocol dictates:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Arrest and Detainment:</strong> You will be remanded to an immigration detention center (Rudenim).</li>
                        <li><strong>Forced Deportation:</strong> You will be forcibly expelled from the Republic of Indonesia. You will bear the full cost of the flight ticket; if you cannot pay, you remain detained until your embassy or family intervenes.</li>
                        <li><strong>The Blacklist:</strong> A Red Notice will be applied to your biometrics and passport data, blacklisting you from re-entering Indonesia for a minimum period of 6 months, and frequently up to 5 years depending on the severity and context of the offense.</li>
                    </ul>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl my-8">
                        <strong className="block mb-2">Warning:</strong> 
                        <Link href={`/${locale}/immigration-rules/indonesia-visa-overstay-rules`} className="text-primary font-bold hover:underline italic">Read the full 2026 Overstay Penalties & Fines Roadmap.</Link>
                    </div>
                    <p>
                        Never view visa expiration dates as suggestions. They are absolute mandates enforced by heavily mobilized border patrol divisions.
                    </p>
                </div>
            )
        },
        {
            id: "requirements-by-country",
            title: "10. Visa Requirements by Country",
            content: (
                <div className="space-y-6">
                    <p>
                        Indonesia operates a highly stratified visa approval matrix based on geopolitical relationships, bilateral agreements, and historical security risks. Passport strength governs not only eligibility but also the depth of the bureaucratic scrutiny applied to your case. Below, we break down the general framework for major global regions.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Tier 1: ASEAN Exemptions</h3>
                    <p>
                        Citizens of Singapore, Malaysia, Thailand, Vietnam, Philippines, Brunei, Cambodia, Laos, and Myanmar enjoy immense freedom. They are granted 30 days of visa-free entry instantly upon processing. No VoA fee is required, and no prior application is necessary.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Tier 2: The VoA Nations (97+ Countries)</h3>
                    <p>
                        This overarching bucket captures the vast majority of Western and developed economies. Citizens of Australia, the United States, the UK, Canada, New Zealand, the European Union, Japan, South Korea, and China automatically qualify for the Visa on Arrival and e-VoA systems. While the process is streamlined and highly approving, all travelers must ensure their passport holds at least 6 months of validity from the date of entry and contains empty pages for ticketing stamps.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Tier 3: The Calling Visa / Restricted Nations</h3>
                    <p>
                        For geopolitical and national security reasons, Indonesia has flagged several nations requiring extreme vetting via the 'Calling Visa' protocol. Citizens possessing passports from countries such as Afghanistan, Israel, North Korea, Somalia, Syria, Iraq, and several others face monumental administrative barriers to entry.
                    </p>
                    <p>
                        Applicants from Calling Visa countries must undergo profound background checks. The process requires a registered Indonesian corporate guarantor, heavy financial deposits, and a multi-agency review board involving the military, intelligence apparatus, and immigration command. Processing times can stretch into months, and absolute denial rates are high.
                    </p>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl my-8">
                        <strong className="block mb-2">Check Your Country:</strong> 
                        <div className="flex flex-wrap gap-2 mt-2">
                            <Link href={`/${locale}/visa-indonesia-for-australians`} className="text-primary hover:underline font-semibold">Australians</Link> &bull; 
                            <Link href={`/${locale}/visa-indonesia-for-americans`} className="text-primary hover:underline font-semibold">Americans</Link> &bull; 
                            <Link href={`/${locale}/visa-indonesia-for-uk-citizens`} className="text-primary hover:underline font-semibold">UK Citizens</Link> &bull; 
                            <Link href={`/${locale}/visa-indonesia-for-indians`} className="text-primary hover:underline font-semibold">Indians</Link> &bull;
                            <Link href={`/${locale}/visa-indonesia-for-chinese`} className="text-primary hover:underline font-semibold">Chinese</Link> &bull;
                            <Link href={`/${locale}/visa-indonesia-for-russians`} className="text-primary hover:underline font-semibold">Russians</Link>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "costs-and-fees",
            title: "11. Government Fees and Hidden Costs",
            content: (
                <div className="space-y-6">
                    <p>
                        Visa procurement involves a maze of governmental PNBP (Penerimaan Negara Bukan Pajak - Non-Tax State Revenue) fees, agency service margins, and hidden facilitation costs. Financial transparency is critical to avoiding predatory pricing. Let's dissect the true costs of legally securing your position in Indonesia.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Standard Government Tariffs</h3>
                    <p>
                        The core governmental levies (PNBP) for the most common visas are rigid and legally mandated:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Visa on Arrival (e-VoA and Paper):</strong> 500,000 IDR.</li>
                        <li><strong>Visa on Arrival Extension:</strong> 500,000 IDR.</li>
                        <li><strong>B211A Visit Visa (Initial 60 Days):</strong> 2,000,000 IDR (1,500,000 IDR Visa Fee + 500,000 IDR Authorization Fee).</li>
                        <li><strong>B211A Extension:</strong> 2,000,000 IDR per 60-day extension block.</li>
                    </ul>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Agency Sponsorship and Facilitation Fees</h3>
                    <p>
                        While you can theoretically process extensions and complex visas directly with immigration, doing so demands significant local knowledge, Indonesian language fluency, and multiple full days of queuing in government offices. Therefore, agencies charge facilitation and sponsorship fees to completely handle the bureaucracy, guaranteeing legal adherence and minimizing your time loss.
                    </p>
                    <p>
                        For instance, while the raw government fee for a B211A is 2,000,000 IDR, agencies routinely charge between 2,800,000 IDR and 3,500,000 IDR. This markup encompasses corporate sponsorship liability, document normalization, courier services for passport handling, priority queue access, and profit margin.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Beware the Hidden Express Fees</h3>
                    <p>
                        "Express Services" or "VIP Airport Fast Track" services are widely marketed across social media. While highly effective, they often carry extreme markups. It is paramount to utilize verified agencies like PT Indonesian Visas to ensure you receive legally sound fast-tracking rather than engaging in under-the-table bribery networks, which the Indonesian Anti-Corruption Commission continuously targets.
                    </p>
                </div>
            )
        },
        {
            id: "immigration-rules",
            title: "12. Core Immigration Rules For Foreigners",
            content: (
                <div className="space-y-6">
                    <p>
                        Acquiring the visa is only phase one. Navigating the legal landscape while physically on Indonesian territory requires strict adherence to behavioral and bureaucratic rules. Immigration task forces actively scrub social media, receive tip-offs from locals, and conduct random sweeps in high-density expat zones like Canggu and Uluwatu.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">The 6-Month Passport Rule</h3>
                    <p>
                        The most heavily enforced border control law relates to passport validity. Your passport must hold a minimum of 6 months validity calculated from the precise date you land in Indonesia. Furthermore, the passport must contain completely blank pages. Even if you possess a valid e-VoA and hotel bookings, airlines will rigidly deny boarding at your origin airport if your passport has 5 months and 28 days of validity remaining. There are zero exceptions to this rule.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">The Prohibition of "Digital Nomad" Loopholes</h3>
                    <p>
                        While the B211A is heavily favored by remote workers, it does not offer blanket immunity for commercial activity. The law explicitly forbids foreigners from engaging in actions that generate localized income or compete with the native workforce. You cannot legally:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Sell physical goods at local markets.</li>
                        <li>Perform paid photography, DJ sets, or yoga instruction to tourists in Bali.</li>
                        <li>Accept Indonesian Rupiah transferred to a local account for services rendered within the country.</li>
                    </ul>
                    <p>
                        Violating these parameters constitutes visa misuse (penyalahgunaan izin tinggal), punishable by rapid detainment, financial seizure, and permanent deportation.
                    </p>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl my-8">
                        <strong className="block mb-2">Rules & Compliance:</strong> 
                        <div className="flex flex-wrap gap-2 mt-2">
                            <Link href={`/${locale}/immigration-rules/immigration-rules-indonesia`} className="text-primary font-bold hover:underline">Immigration Rules Overview</Link> &bull; 
                            <Link href={`/${locale}/immigration-rules/immigration-rules-for-foreigners`} className="text-primary font-bold hover:underline">Rules for Foreigners in Bali</Link>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "travel-tips",
            title: "13. Essential Travel Tips for Bali and Beyond",
            content: (
                <div className="space-y-6">
                    <p>
                        Indonesia is a vast, culturally complex archipelago. While having your paperwork in order guarantees entry, localized knowledge guarantees a spectacular experience. Surviving and thriving in environments ranging from the congested hyper-development of South Bali to the deep isolated jungles of Sumatra requires tactical foresight.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Arrival Formalities: Customs App (e-CD)</h3>
                    <p>
                        Before you disembark your plane, or ideally while waiting in the departures lounge at your home airport, you must complete the Electronic Customs Declaration (e-CD). Physical blue customs slips have been entirely abolished in major hubs. You must fill out the form online, generate a QR code, and scan it to exit the baggage claim area. Failing to have this QR code ready results in bottlenecks and frustration after long-haul flights.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">The IMEI Tax Law for Mobile Phones</h3>
                    <p>
                        If you intend to stay in Indonesia for longer than 90 days and wish to use a local SIM card (Telkomsel, XL) in a phone purchased overseas, you are subject to the IMEI registration laws. If your device value exceeds $500 USD, you must declare it at customs upon arrival and pay significant import taxes (varying between 30% and 40% of the device's value). If you bypass this, your phone's IMEI will be actively blacklisted by Indonesian cellular networks within 90 days, rendering it incapable of catching a signal regardless of the SIM card inserted.
                    </p>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-primary">Financial Infrastructure and Cash Dependency</h3>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl my-8">
                        <strong className="block mb-2">Traveler Roadmaps:</strong> 
                        <div className="flex flex-wrap gap-2 mt-2">
                            <Link href={`/${locale}/travel-indonesia/do-you-need-a-visa-for-bali`} className="text-primary hover:underline font-semibold">Do You Need a Bali Visa?</Link> &bull; 
                            <Link href={`/${locale}/travel-indonesia/bali-visa-requirements-2026`} className="text-primary hover:underline font-semibold">Bali Requirements Checklist</Link> &bull; 
                            <Link href={`/${locale}/travel-indonesia/jakarta-visa-guide`} className="text-primary hover:underline font-semibold">Jakarta Entry Guide</Link> &bull; 
                            <Link href={`/${locale}/travel-indonesia/bali-travel-entry-requirements`} className="text-primary hover:underline font-semibold">Official Entry Roadmap</Link>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "comparisons",
            title: "14. Regional Comparisons",
            content: (
                <div className="space-y-6">
                    <p>Deciding between Bali and other Southeast Asian hubs? Compare the latest 2026 visa policies head-to-head:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link href={`/${locale}/comparisons/indonesia-visa-vs-thailand-visa`} className="p-4 border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors">
                            <h4 className="font-bold text-primary">Indonesia vs Thailand 2026</h4>
                            <p className="text-sm opacity-70">Compare B211A vs DTV and LTR programs.</p>
                        </Link>
                        <Link href={`/${locale}/comparisons/bali-visa-vs-malaysia-visa`} className="p-4 border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors">
                            <h4 className="font-bold text-primary">Bali vs Malaysia 2026</h4>
                            <p className="text-sm opacity-70">Compare the Bali nomad scene vs DE Rantau.</p>
                        </Link>
                    </div>
                </div>
            )
        },
        {
            id: "knowledge-base",
            title: "15. Knowledge Base & Expat Pillars",
            content: (
                <div className="space-y-6">
                    <p>Explore our deep-dive educational pillars for moving to and living in the archipelago legally:</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 list-disc pl-6">
                        <li><Link href={`/${locale}/blog/indonesia-visa-guide`} className="hover:text-primary underline">Comprehensive Indonesia Visa Guide</Link></li>
                        <li><Link href={`/${locale}/blog/bali-visa-guide`} className="hover:text-primary underline">The Local Bali Visa Guide</Link></li>
                        <li><Link href={`/${locale}/blog/immigration-rules-indonesia`} className="hover:text-primary underline">Deep Dive: Immigration Rules</Link></li>
                        <li><Link href={`/${locale}/blog/bali-expat-guide`} className="hover:text-primary underline">Living in Bali: Expat Guide</Link></li>
                        <li><Link href={`/${locale}/blog/how-to-move-to-bali-legally`} className="hover:text-primary underline">Relocation Checklist: Move to Bali</Link></li>
                    </ul>
                </div>
            )
        },
        {
            id: "faq",
            title: "16. Frequently Asked Questions (FAQ)",
            content: (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-sm">
                        <h4 className="font-bold text-lg text-primary mb-2">Can I transition from a Tourist Visa to a Working KITAS without leaving the country?</h4>
                        <p className="mode-aware-subtext">No. Indonesian immigration heavily discourages onshore conversions of tourist visas into working permits. You must execute an "Exit Permit Only" (EPO) protocol, physically leave the country (usually taking a brief flight to Singapore or Kuala Lumpur), and re-enter using an eVisa tailored explicitly to your new work permit parameters.</p>
                    </div>

                    <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-sm">
                        <h4 className="font-bold text-lg text-primary mb-2">I missed my flight and overstayed by one day. Do I still have to pay the fine?</h4>
                        <p className="mode-aware-subtext">Absolutely. The immigration law makes zero concessions for logistical errors, missed flights, or simple forgetfulness. You will be mandated to pay the 1,000,000 IDR fine in cash directly to the immigration agents stationed at the airport departures terminal before being allowed to board your outbound flight.</p>
                    </div>

                    <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-sm">
                        <h4 className="font-bold text-lg text-primary mb-2">Is the yellow fever vaccine required to enter Indonesia?</h4>
                        <p className="mode-aware-subtext">If you are arriving directly from (or have transited through) countries located in the recognized Yellow Fever belt in Africa or South America, you must present a valid Yellow Fever Vaccination Certificate at health checkpoints before reaching immigration. Failure to do so will result in immediate quarantine or deportation.</p>
                    </div>

                    <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-sm">
                        <h4 className="font-bold text-lg text-primary mb-2">Can I buy property in Bali on a B211A Tourist Visa?</h4>
                        <p className="mode-aware-subtext">A tourist visa absolutely does NOT grant the legal right to possess freehold property (Hak Milik) in Indonesia. You can execute high-risk long-term leaseholds (Hak Sewa), but you are entirely barred from sovereign ownership structures without a registered PMA and the requisite Investor KITAS framework.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Indonesia Visa Guide 2026 – Complete Immigration Guide for Foreign Visitors"
            subtitle="The definitive, 6000+ word authority guide to navigating Indonesian immigration, visas, permits, rules, and regulations in 2026."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
