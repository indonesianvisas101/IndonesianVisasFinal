import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check, Info } from 'lucide-react';
import { VISA_DETAILS, VisaDetail } from '@/constants/visaDetails';
import { VISA_DATABASE, VisaType } from '@/constants/visas';
import VisaActionButtons from '@/components/visa/VisaActionButtons';
import VisaPricingSelector from '@/components/visa/VisaPricingSelector';
import { parseCurrency } from '@/lib/utils';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export function generateStaticParams() {
    return Object.keys(VISA_DETAILS).map((id) => ({
        id: id,
    }));
}

const formatPrice = (value: number | string) => {
    if (typeof value === 'number') {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    }
    return value;
};

// Helper to convert DB pricing to UI structure
const getPricingOptions = (dbVisa: VisaType) => {
    const options: { title: string; rows: { label: string; value: string; isTotal?: boolean }[] }[] = [];

    // Helper to extract the actual price (now using robust centralized utility)
    const parsePrice = (priceStr: string) => parseCurrency(priceStr);

    // Case 1: Simple Price (String)
    if (typeof dbVisa.price === 'string') {
        const isDescriptive = dbVisa.price.includes(':') || (typeof dbVisa.fee === 'string' && dbVisa.fee.includes(':'));

        if (isDescriptive) {
            // Treat as multiple options
            const processDescriptive = (str: string) => {
                if (!str || str === "0") return;
                let durationName = "Standard Option";
                let priceStr = str;
                if (str.includes(':')) {
                    const parts = str.split(':');
                    durationName = parts[0].trim();
                    priceStr = parts[1].trim();
                }
                const taxVal = parsePrice(priceStr);
                options.push({
                    title: durationName,
                    rows: [
                        { label: "Limited Stay Visa Tax", value: priceStr },
                        { label: "Visa Fee", value: "Rp 0,00" },
                        { label: "TOTAL", value: formatPrice(taxVal), isTotal: true }
                    ]
                });
            };

            processDescriptive(dbVisa.price);
            if (typeof dbVisa.fee === 'string' && dbVisa.fee) {
                processDescriptive(dbVisa.fee);
            } else if (typeof dbVisa.fee === 'number' && dbVisa.fee > 0) {
                // If it has a static fee attached to varying durations, add it as a separate block or fee item
                options.push({
                    title: "Additional Processing Fee",
                    rows: [
                        { label: "Visa Fee", value: formatPrice(dbVisa.fee) },
                        { label: "TOTAL", value: formatPrice(dbVisa.fee), isTotal: true }
                    ]
                });
            }
        } else {
            const taxVal = parsePrice(dbVisa.price);
            const feeVal = typeof dbVisa.fee === 'number' ? dbVisa.fee : parsePrice(String(dbVisa.fee || "0"));
            const total = taxVal + feeVal;

            options.push({
                title: "Standard Fee",
                rows: [
                    { label: "Visa Tax", value: dbVisa.price },
                    { label: "Visa Fee", value: typeof dbVisa.fee === 'string' ? dbVisa.fee : formatPrice(feeVal) },
                    { label: "TOTAL", value: formatPrice(total), isTotal: true }
                ]
            });
        }
    }
    // Case 2: Dictionary Price (Object)
    else if (typeof dbVisa.price === 'object' && dbVisa.price !== null) {
        Object.entries(dbVisa.price).forEach(([duration, priceVal]) => {
            const taxVal = parsePrice(String(priceVal));
            let feeValForDuration = 0;
            let rawFeeDisplay: string | number = 0;

            if (typeof dbVisa.fee === 'object' && dbVisa.fee !== null && duration in dbVisa.fee) {
                const feeRaw = (dbVisa.fee as Record<string, any>)[duration];
                feeValForDuration = typeof feeRaw === 'number' ? feeRaw : parsePrice(String(feeRaw || "0"));
                rawFeeDisplay = feeRaw;
            } else if (typeof dbVisa.fee === 'number') {
                feeValForDuration = dbVisa.fee;
                rawFeeDisplay = dbVisa.fee;
            } else if (typeof dbVisa.fee === 'string') {
                feeValForDuration = parsePrice(dbVisa.fee);
                rawFeeDisplay = dbVisa.fee;
            }
            const total = taxVal + feeValForDuration;

            options.push({
                title: duration.includes("Year") ? `${duration} Stay` : duration,
                rows: [
                    { label: "Limited Stay Visa Tax", value: String(priceVal) },
                    { label: "Visa Fee", value: typeof rawFeeDisplay === 'string' ? rawFeeDisplay : formatPrice(feeValForDuration) },
                    { label: "TOTAL", value: formatPrice(total), isTotal: true }
                ]
            });
        });
    }

    return options;
};

// Safe JSON parse helper
const safeParse = (value: any) => {
    if (typeof value !== 'string') return value;
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

const VisaDetailPage = async (props: PageProps) => {
    const params = await props.params;
    const { id } = params;

    // Safety check - if id is missing
    if (!id) return notFound();

    // 1. Fetch from Database (Dynamic Data) with Error Handling
    let rawVisa = null;
    try {
        const { default: prisma } = await import('@/lib/prisma');
        rawVisa = await prisma.visa.findUnique({
            where: { id: id }
        });
    } catch (error) {
        console.warn(`[Build Warning] Could not fetch visa ${id} from DB (using static data):`, error);
        // Continue to fallback
    }

    // 2. Fallback to Static Data
    const staticDetails = VISA_DETAILS[id];

    if (!rawVisa && !staticDetails) {
        return notFound();
    }

    // Process DB Visa if exists
    let dbVisa: VisaType | undefined;
    if (rawVisa) {
        dbVisa = {
            ...rawVisa,
            requirements: JSON.parse(rawVisa.requirements),
            price: safeParse(rawVisa.price),
            fee: safeParse(rawVisa.fee),
            details: (rawVisa as any).details ? JSON.parse((rawVisa as any).details) : undefined // NEW: Parse rich details
        };
    } else {
        dbVisa = VISA_DATABASE.find(v => v.id === id);
    }

    // Prepare default values
    const defaultDetails: VisaDetail = {
        id: id,
        badge: 'New Visa',
        type: 'General',
        intro: '',
        description: { title: 'Description', text: '' },
        allowed: { title: 'Allowed Activities', text: '' },
        sponsor: { title: 'Sponsor', text: '' },
        period: { title: 'Period of Stay', text: '' },
        pricing: { title: 'Pricing', options: [] },
        requirements: { title: 'Requirements', items: [] },
        provisions: { title: 'Provisions', text: '' },
        processing: { title: 'Processing', text: '' },
        cta: { title: 'Apply Now', subtitle: 'Contact us to get started' },
    };

    // Merge: Defaults -> Static -> DB Overrides -> Rich Details Override
    const visaDetails: VisaDetail = {
        ...defaultDetails,
        ...staticDetails,

        // Standard DB overrides (prioritize DB columns)
        id: dbVisa?.id || staticDetails?.id || id,
        badge: dbVisa?.name || staticDetails?.badge || 'Unknown Visa',
        type: dbVisa?.category || staticDetails?.type || 'Visa',
        intro: dbVisa?.description || staticDetails?.intro || '',
        
        description: {
            title: staticDetails?.description?.title || "Description",
            text: dbVisa?.description || staticDetails?.description?.text || ''
        },
        
        period: {
            title: staticDetails?.period?.title || "Period of Stay",
            text: dbVisa?.validity || staticDetails?.period?.text || ''
        },
        
        requirements: {
            title: staticDetails?.requirements?.title || "Requirements",
            items: dbVisa?.requirements || staticDetails?.requirements?.items || []
        },

        // Deep merge from dbVisa.details if any specific section overrides exist
        ...(dbVisa?.details || {})
    };

    // Price Logic: Database is the source of truth for prices/fees
    const pricingOptions = dbVisa ? getPricingOptions(dbVisa) : (staticDetails?.pricing?.options || []);

    // If DB pricing generated valid options, use them. Otherwise use fallback.
    const finalPricingOptions = pricingOptions.length > 0 ? pricingOptions : (staticDetails?.pricing?.options || []);


    return (
        <div className="min-h-screen font-sans bg-white text-black" id="child-page-root">
            <div className="max-w-4xl mx-auto px-6 py-12">

                {/* Header */}
                <header className="text-center mb-16 border-b border-gray-200 pb-10">
                    <div className="text-sm font-bold tracking-widest mb-6 uppercase text-gray-900">
                        INDONESIAN VISAS by PT INDONESIAN VISAS AGENCY
                    </div>
                    <div className="inline-block bg-purple-700 text-white px-6 py-2 rounded-full text-sm font-bold mb-6 tracking-wide shadow-lg">
                        {visaDetails.badge}
                    </div>

                    <div className="bg-gray-100 border-l-4 border-black p-8 max-w-2xl mx-auto mb-8 text-left rounded-r-lg shadow-md">
                        <strong className="block text-black mb-2 text-lg">VISA TYPE</strong>
                        <span className="text-black font-bold text-xl">{visaDetails.type}</span>
                    </div>

                    <p className="text-lg text-black leading-relaxed max-w-2xl mx-auto font-medium">
                        {visaDetails.intro}
                    </p>
                </header>

                <div className="space-y-16">
                    {/* Description */}
                    <section className="border-b border-gray-200 pb-12">
                        <h2 className="text-2xl font-bold mb-6 text-black">{visaDetails.description.title}</h2>
                        <p className="text-black leading-loose text-lg font-medium">{visaDetails.description.text}</p>
                    </section>

                    {/* Allowed */}
                    <section className="border-b border-gray-200 pb-12">
                        <h2 className="text-2xl font-bold mb-6 text-black">{visaDetails.allowed.title}</h2>
                        <p className="text-black leading-loose text-lg font-medium">{visaDetails.allowed.text}</p>
                    </section>

                    {/* Sponsor */}
                    <section className="border-b border-gray-200 pb-12">
                        <h2 className="text-2xl font-bold mb-6 text-black">{visaDetails.sponsor.title}</h2>
                        <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 flex gap-4 items-start shadow-sm">
                            <Info className="text-blue-800 shrink-0 mt-1" size={24} />
                            <p className="text-blue-950 leading-relaxed text-lg font-medium">{visaDetails.sponsor.text}</p>
                        </div>
                    </section>

                    {/* Period */}
                    <section className="border-b border-gray-200 pb-12">
                        <h2 className="text-2xl font-bold mb-6 text-black">{visaDetails.period.title}</h2>
                        <p className="text-black leading-loose text-lg font-medium">{visaDetails.period.text}</p>
                    </section>

                    {/* Pricing - Using Dynamic/Mixed Logic */}
                    <section className="border-b border-gray-200 pb-12">
                        <h2 className="text-2xl font-bold mb-8 text-black">{visaDetails.pricing.title}</h2>
                        
                        {finalPricingOptions.length > 1 || (dbVisa && typeof dbVisa.price === 'object') ? (
                            <VisaPricingSelector 
                                options={finalPricingOptions} 
                                visaId={visaDetails.id}
                                visaName={visaDetails.badge}
                            />
                        ) : (
                            <div className="grid gap-8">
                                {finalPricingOptions.map((option, idx) => (
                                    <div key={idx} className="bg-white p-8 rounded-2xl border-2 border-gray-300 hover:border-black transition-colors duration-300 shadow-xl">
                                        {option.title && <h3 className="text-xl font-bold mb-6 text-black border-b border-gray-200 pb-4">{option.title}</h3>}
                                        <table className="w-full">
                                            <tbody>
                                                {option.rows.map((row, rIdx) => (
                                                    <tr key={rIdx} className={row.isTotal ? "border-t-2 border-gray-400" : "border-b border-gray-200 last:border-0"}>
                                                        <td className={`py-4 text-black ${row.isTotal ? "text-lg font-bold pt-6" : "font-semibold"}`}>
                                                            {row.label}
                                                        </td>
                                                        <td className={`py-4 text-right text-black ${row.isTotal ? "text-xl font-bold pt-6" : "font-bold"}`}>
                                                            {row.value}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        )}

                        {visaDetails.pricing.note && (
                            <p className="text-sm text-black mt-6 italic bg-gray-100 inline-block px-4 py-2 rounded-lg font-medium border border-gray-300">
                                * {visaDetails.pricing.note}
                            </p>
                        )}
                    </section>

                    {/* Requirements */}
                    <section className="border-b border-gray-200 pb-12">
                        <h2 className="text-2xl font-bold mb-8 text-black">{visaDetails.requirements.title}</h2>
                        <ul className="space-y-4 mb-8">
                            {visaDetails.requirements.items.map((item, idx) => (
                                <li key={idx} className="flex gap-4 items-start text-lg text-black font-medium">
                                    <div className="bg-green-100 text-green-800 rounded-full p-1 mt-1 shrink-0">
                                        <Check size={16} strokeWidth={3} />
                                    </div>
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                        {visaDetails.requirements.note && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg border-y border-r border-yellow-200">
                                <p className="text-yellow-900 text-sm font-bold">{visaDetails.requirements.note}</p>
                            </div>
                        )}
                    </section>

                    {/* Special */}
                    {visaDetails.special && (
                        <section className="border-b border-gray-200 pb-12">
                            <h2 className="text-2xl font-bold mb-6 text-black">{visaDetails.special?.title}</h2>
                            <p className="text-black leading-loose text-lg font-medium">{visaDetails.special?.text}</p>
                        </section>
                    )}

                    {/* Provisions */}
                    <section className="border-b border-gray-200 pb-12">
                        <h2 className="text-2xl font-bold mb-6 text-black">{visaDetails.provisions.title}</h2>
                        <p className="text-black leading-loose text-base bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                            {visaDetails.provisions.text}
                        </p>
                    </section>

                    {/* Processing */}
                    <section className="pb-12">
                        <h2 className="text-2xl font-bold mb-6 text-black">{visaDetails.processing.title}</h2>
                        <p className="text-black leading-loose text-lg font-medium">{visaDetails.processing.text}</p>
                    </section>

                    {/* CTA */}
                    <div className="bg-slate-900 text-white p-12 rounded-3xl text-center shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-4">{visaDetails.cta.title}</h2>
                            <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">{visaDetails.cta.subtitle}</p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {/* Calculate Total Price for Modal */}
                                {(() => {
                                    let totalPriceStr = "Contact Us";
                                    const currentDbVisa = dbVisa; // Local alias to satisfy TS
                                    if (currentDbVisa) {
                                        // Simplified calculation for the primary option (1st one or simple string)
                                        let tax = 0;
                                        let fee = 0;
                                        if (typeof currentDbVisa.price === 'string') {
                                            tax = parseInt(currentDbVisa.price.replace(/[^0-9]/g, ''), 10) || 0;
                                            fee = typeof currentDbVisa.fee === 'number' ? currentDbVisa.fee : 0;
                                        } else if (typeof currentDbVisa.price === 'object' && currentDbVisa.price) {
                                            const priceValues = Object.values(currentDbVisa.price);
                                            const firstVal = (priceValues[0] as string) || null;
                                            // Guard: firstVal may be undefined if price object is empty
                                            if (firstVal && typeof firstVal === 'string') {
                                                tax = parseInt(firstVal.replace(/[^0-9]/g, ''), 10) || 0;
                                            }
                                            // Handle fee object/number
                                            if (typeof currentDbVisa.fee === 'number') fee = currentDbVisa.fee;
                                            else if (typeof currentDbVisa.fee === 'object' && currentDbVisa.fee) {
                                                const firstFee = Object.values(currentDbVisa.fee)[0] as number;
                                                fee = typeof firstFee === 'number' ? firstFee : 0;
                                            }
                                        }
                                        if (tax > 0) {
                                            totalPriceStr = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(tax + fee);
                                        }
                                    }

                                    return (
                                        <VisaActionButtons
                                            visaId={visaDetails.id}
                                            visaName={visaDetails.badge}
                                            price={totalPriceStr}
                                        />
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Decorative */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 pointer-events-none opacity-50 dark:opacity-80"></div>
                    </div>
                </div>

                {/* Footer Note */}
                <footer className="mt-20 pt-10 border-t border-gray-200 dark:border-white/10 text-center text-gray-500 dark:text-gray-400 text-sm">
                    <p>© Indonesian Visas by PT Indonesian Visas Agency™. All Rights Reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default VisaDetailPage;
