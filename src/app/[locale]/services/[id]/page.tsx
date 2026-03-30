import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check, Info } from 'lucide-react';
import { VISA_DETAILS, VisaDetail } from '@/constants/visaDetails';
import { VISA_DATABASE, VisaType } from '@/constants/visas';
import { REGIONAL_HUBS } from '@/constants/locations';
import VisaActionButtons from '@/components/visa/VisaActionButtons';
import VisaPricingSelector from '@/components/visa/VisaPricingSelector';
import { parseCurrency } from '@/lib/utils';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import { Globe, MapPin, Shield, Star, Users, Zap } from 'lucide-react';

interface PageProps {
    params: Promise<{
        locale: string;
        id: string;
    }>;
}

export function generateStaticParams() {
    const visaIds = Object.keys(VISA_DETAILS).map((id) => ({ id }));
    const hubIds = Object.keys(REGIONAL_HUBS).map((id) => ({ id }));
    return [...visaIds, ...hubIds];
}

export async function generateMetadata(props: PageProps) {
    const params = await props.params;
    const { id } = params;

    const hub = REGIONAL_HUBS[id];
    if (hub) {
        return {
            title: `${hub.displayName} Visa Hub | Indonesian Visas`,
            description: hub.description,
        };
    }

    const visaDetails = VISA_DETAILS[id];
    if (visaDetails) {
        return {
            title: `${visaDetails.badge} | Official Indonesian Visa`,
            description: visaDetails.intro,
        };
    }

    return {
        title: "Visa Services | Indonesian Visas",
    };
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
    const { locale, id: rawId } = await props.params;
    const id = decodeURIComponent(rawId);

    // --- CHECK FOR REGIONAL HUB FIRST (Fix for /services/Bali) ---
    const hub = REGIONAL_HUBS[id];
    if (hub) {
        return (
            <SEOPageLayout title={hub.heading} description={hub.description}>
                <div className="min-h-screen bg-slate-950 text-white font-sans pt-32 pb-24">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-3 text-primary mb-8 font-black uppercase tracking-widest text-sm italic">
                                <MapPin size={20} />
                                Regional Visa Hub
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter leading-tight italic">
                                {hub.displayName}
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-400 font-medium mb-16 leading-relaxed max-w-2xl">
                                {hub.description}
                            </p>

                            <div className="grid md:grid-cols-2 gap-12 mb-24">
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black flex items-center gap-3">
                                        <Zap className="text-primary" />
                                        Fast Entry
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        Direct e-visa processing for arrivals at Ngurah Rai and more.
                                    </p>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black flex items-center gap-3">
                                        <Shield className="text-primary" />
                                        Legal Safety
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        Official PT Indonesian Visas Agency sponsorship for every stay.
                                    </p>
                                </div>
                            </div>

                            <h2 className="text-3xl font-black mb-10 uppercase tracking-tight">Available Visas for {hub.name}</h2>
                            <div className="grid gap-6">
                                {hub.visas.map((vId) => (
                                    <Link 
                                        key={vId} 
                                        href={`/en/services/${vId}`}
                                        className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary transition-all duration-500 flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest italic">Official Visa</p>
                                            <h4 className="text-2xl font-black group-hover:translate-x-2 transition-transform duration-300">{vId.replace(/-/g, ' ')}</h4>
                                        </div>
                                        <ArrowRight className="text-white/20 group-hover:text-primary group-hover:translate-x-2 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </SEOPageLayout>
        );
    }

    // --- CONTINUE WITH NORMAL VISA LOGIC ---
    // 1. Fetch from Database (Dynamic Data) with Error Handling
    let rawVisa = null;
    try {
        const { default: prisma } = await import('@/lib/prisma');
        rawVisa = await prisma.visa.findUnique({
            where: { id: id }
        });
    } catch (error) {
        console.warn(`[Build Warning] Could not fetch visa ${id} from DB (using static data):`, error);
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
        <SEOPageLayout
            title={visaDetails.badge}
            description={visaDetails.intro}
        >
            <div className="min-h-screen bg-slate-50 dark:bg-[#030712] font-sans pt-32 pb-24 transition-colors duration-500">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        
                        {/* PREMIUM HEADER */}
                        <header className="mb-16">
                            <div className="flex items-center gap-3 text-primary mb-6 font-black uppercase tracking-widest text-xs italic">
                                <Shield size={18} />
                                Verified Official Visa
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-10 italic">
                                {visaDetails.badge}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 mb-10">
                                <span className="px-5 py-2 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                                    {visaDetails.type}
                                </span>
                                <span className="px-5 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                                    <Star size={10} className="fill-primary text-primary" />
                                    Premium Service
                                </span>
                            </div>
                            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
                                {visaDetails.intro}
                            </p>
                        </header>

                        {/* CONTENT GRID */}
                        <div className="space-y-24">
                            
                            {/* DESCRIPTION & ACTIVITIES */}
                            <section className="grid md:grid-cols-2 gap-12">
                                <div className="p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 shadow-xl">
                                    <h2 className="text-2xl font-black mb-6 italic text-slate-900 dark:text-white uppercase tracking-tight">
                                        {visaDetails.description.title}
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-medium">
                                        {visaDetails.description.text}
                                    </p>
                                </div>
                                <div className="p-10 rounded-[2.5rem] bg-slate-900 dark:bg-primary/10 border border-slate-800 dark:border-primary/20 shadow-2xl">
                                    <h2 className="text-2xl font-black mb-6 italic text-white uppercase tracking-tight">
                                        {visaDetails.allowed.title}
                                    </h2>
                                    <p className="text-slate-300 dark:text-slate-200 leading-relaxed text-lg font-medium">
                                        {visaDetails.allowed.text}
                                    </p>
                                </div>
                            </section>

                            {/* SPONSOR & PERIOD */}
                            <section className="grid md:grid-cols-2 gap-8">
                                <div className="flex gap-6 p-8 rounded-3xl bg-blue-500/5 border border-blue-500/10">
                                    <Info className="text-blue-500 shrink-0" size={24} />
                                    <div>
                                        <h3 className="font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{visaDetails.sponsor.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{visaDetails.sponsor.text}</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 p-8 rounded-3xl bg-primary/5 border border-primary/10">
                                    <Calendar className="text-primary shrink-0" size={24} />
                                    <div>
                                        <h3 className="font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{visaDetails.period.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{visaDetails.period.text}</p>
                                    </div>
                                </div>
                            </section>

                            {/* PRICING SELECTOR */}
                            <section>
                                <h2 className="text-3xl font-black mb-10 italic text-slate-900 dark:text-white uppercase tracking-tight">
                                    {visaDetails.pricing.title}
                                </h2>
                                {finalPricingOptions.length > 1 || (dbVisa && typeof dbVisa.price === 'object') ? (
                                    <VisaPricingSelector 
                                        options={finalPricingOptions} 
                                        visaId={visaDetails.id}
                                        visaName={visaDetails.badge}
                                    />
                                ) : (
                                    <div className="grid gap-8">
                                        {finalPricingOptions.map((option, idx) => (
                                            <div key={idx} className="bg-white dark:bg-white/5 p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl">
                                                {option.title && <h3 className="text-xl font-black mb-8 text-primary uppercase tracking-widest italic">{option.title}</h3>}
                                                <div className="space-y-6">
                                                    {option.rows.map((row, rIdx) => (
                                                        <div key={rIdx} className={`flex justify-between items-center ${row.isTotal ? "pt-6 border-t-2 border-primary/20" : "pb-4 border-b border-slate-200 dark:border-white/5 opacity-80"}`}>
                                                            <span className={`text-slate-600 dark:text-slate-400 uppercase tracking-widest text-[10px] font-black ${row.isTotal ? "text-primary text-sm" : ""}`}>
                                                                {row.label}
                                                            </span>
                                                            <span className={`text-slate-900 dark:text-white font-black text-lg ${row.isTotal ? "text-3xl text-primary" : ""}`}>
                                                                {row.value}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* REQUIREMENTS */}
                            <section className="p-12 rounded-[3.5rem] bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 shadow-2xl">
                                <h2 className="text-3xl font-black mb-12 italic text-slate-900 dark:text-white uppercase tracking-tight">
                                    {visaDetails.requirements.title}
                                </h2>
                                <div className="grid md:grid-cols-2 gap-8">
                                    {visaDetails.requirements.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-start p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                            <div className="bg-primary/20 text-primary rounded-full p-1 mt-1 shrink-0">
                                                <Check size={14} strokeWidth={4} />
                                            </div>
                                            <span className="text-slate-700 dark:text-slate-300 font-bold leading-tight">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* CTA PANEL */}
                            <div className="bg-slate-900 dark:bg-white rounded-[4rem] p-16 text-center shadow-3xl relative overflow-hidden group">
                                <div className="relative z-10 text-white dark:text-black">
                                    <h2 className="text-5xl font-black mb-4 italic tracking-tighter">{visaDetails.cta.title}</h2>
                                    <p className="text-white/60 dark:text-black/60 text-xl mb-12 max-w-xl mx-auto font-medium">{visaDetails.cta.subtitle}</p>

                                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                        {(() => {
                                            const currentDbVisa = dbVisa;
                                            let totalPriceStr = "Contact Us";
                                            // ... logic remained same ...
                                            if (currentDbVisa) {
                                                let tax = 0; let fee = 0;
                                                if (typeof currentDbVisa.price === 'string') {
                                                    tax = parseInt(currentDbVisa.price.replace(/[^0-9]/g, ''), 10) || 0;
                                                    fee = typeof currentDbVisa.fee === 'number' ? currentDbVisa.fee : 0;
                                                } else if (typeof currentDbVisa.price === 'object' && currentDbVisa.price) {
                                                    const priceValues = Object.values(currentDbVisa.price);
                                                    const firstVal = priceValues[0] as string;
                                                    if (firstVal) tax = parseInt(firstVal.replace(/[^0-9]/g, ''), 10) || 0;
                                                    if (typeof currentDbVisa.fee === 'number') fee = currentDbVisa.fee;
                                                    else if (typeof currentDbVisa.fee === 'object' && currentDbVisa.fee) fee = Object.values(currentDbVisa.fee)[0] as number;
                                                }
                                                if (tax > 0) totalPriceStr = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(tax + fee);
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
                                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent group-hover:scale-110 transition-transform duration-1000" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-white/5 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest italic opacity-50">
                    <p>© Indonesian Visas by PT Indonesian Visas Agency™ Research Lab • Navigation Pillar</p>
                </footer>
            </div>
        </SEOPageLayout>
    );
};

export default VisaDetailPage;
