import React from "react";
import { getMessages } from "@/i18n/getMessages";
import {
    Briefcase,
    Globe,
    Plane,
    TrendingUp,
    CheckCircle2,
    DollarSign,
    Clock,
    ShieldCheck,
    Users,
    MapPin,
    ArrowRight,
    LineChart,
    MessageSquare,
    FileText,
    Link as LinkIcon
} from "lucide-react";

export default async function AffiliatePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = await getMessages(locale);

    // Using hardcoded fallbacks with translation keys ready
    const t = dict?.affiliate || {};

    return (
        <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300">
            {/* SECTION 1 - HERO */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-transparent to-slate-50 opacity-60 dark:from-blue-900/10 dark:to-transparent" />
                <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-bold mb-8 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            Official Partner Program
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white tracking-tight leading-tight">
                            Partner With IndonesianVisas.com <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                                Earn Commission
                            </span> From Every Successful Referral
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Join the official affiliate program of PT Indonesian Visas Agency™ and earn competitive commissions by referring clients to professional Indonesia visa assistance services.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
                            <a href="#apply" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-600/25 flex items-center gap-2 group w-full sm:w-auto justify-center">
                                Apply as Affiliate
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a href="#how-it-works" className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-400 rounded-xl font-bold transition-all w-full sm:w-auto justify-center flex items-center">
                                Learn How It Works
                            </a>
                        </div>

                        {/* Bulleted Benefits */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                            {[
                                { icon: DollarSign, text: "Competitive commission per verified referral (USD $3 – $100+)", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                                { icon: Clock, text: "Monthly transparent payouts", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
                                { icon: Globe, text: "Global eligibility (country & city-based)", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
                                { icon: MessageSquare, text: "Dedicated affiliate support", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" }
                            ].map((benefit, i) => (
                                <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl bg-white dark:bg-slate-800/50 shadow-sm border border-slate-100 dark:border-slate-700/50">
                                    <div className={`w-10 h-10 rounded-full ${benefit.bg} flex items-center justify-center mb-3`}>
                                        <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{benefit.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2 - ABOUT THE PROGRAM */}
            <section className="py-20 bg-slate-50 dark:bg-[#060b18]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">What Is the IndonesianVisas Affiliate Program?</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                This program allows partners to refer clients to IndonesianVisas.com for professional visa assistance services. By becoming a partner, you provide value to your audience while earning revenue for every successful conversion.
                            </p>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                Clarification: IndonesianVisas.com operates under PT Indonesian Visas Agency™ and provides administrative visa assistance services to simplify the process for global travelers and expats.
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-6 mt-6 relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                                <div className="flex items-start gap-3 relative z-10">
                                    <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">Important Compliance Notice</h4>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                            Visa approvals are subject to Indonesian immigration authority decisions. Affiliate commissions apply only to verified completed service transactions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 h-48 flex flex-col justify-center">
                                    <Globe className="w-8 h-8 text-blue-600 mb-4" />
                                    <h3 className="font-bold text-slate-900 dark:text-white">Global Reach</h3>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 h-48 flex flex-col justify-center">
                                    <Briefcase className="w-8 h-8 text-indigo-600 mb-4" />
                                    <h3 className="font-bold text-slate-900 dark:text-white">B2B & B2C</h3>
                                </div>
                            </div>
                            <div className="space-y-4 mt-8">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 h-48 flex flex-col justify-center">
                                    <Plane className="w-8 h-8 text-emerald-600 mb-4" />
                                    <h3 className="font-bold text-slate-900 dark:text-white">Travel Integration</h3>
                                </div>
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-3xl shadow-lg h-48 flex flex-col justify-center text-white">
                                    <TrendingUp className="w-8 h-8 mb-4" />
                                    <h3 className="font-bold">High Conversion</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3 - WHO CAN JOIN */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-6xl text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Who Is This Program For?</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
                        The affiliate program applies to all country-based services and city-based services offered by IndonesianVisas.com, but collaboration is open to other qualified partners globally.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            "Travel agencies", "Immigration consultants", "Relocation companies", "Travel bloggers & content creators",
                            "Expat communities", "Tourism platforms", "Digital publishers", "Business networks"
                        ].map((audience, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl flex items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                                <span className="font-bold text-slate-800 dark:text-slate-200">{audience}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 4 - HOW IT WORKS */}
            <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-[#060b18]">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">How the Affiliate System Works</h2>
                    </div>

                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                            {[
                                { step: "01", title: "Submit Application", icon: FileText, desc: "Fill out the short partner application form." },
                                { step: "02", title: "Receive Unique Link", icon: LinkIcon, desc: "Get your personalized tracking referral link." },
                                { step: "03", title: "Share & Promote", icon: Globe, desc: "Promote our services across your channels." },
                                { step: "04", title: "Earn Commission", icon: DollarSign, desc: "Get paid for every verified transaction." }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-6 relative">
                                        <item.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center border-4 border-slate-50 dark:border-[#060b18]">
                                            {item.step}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400 italic">
                        * Tracking is monitored internally and commissions are calculated based on verified service completion.
                    </div>
                </div>
            </section>

            {/* SECTION 5 - COMMISSION STRUCTURE */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-12">Commission & Payout Structure</h2>

                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden relative text-left">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />

                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div>
                                <h3 className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-2">$8 – $300+ / Order</h3>
                                <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 font-medium">Per verified transaction, depending on visa category and service type.</p>

                                <ul className="space-y-4">
                                    {[
                                        "Monthly payout frequency",
                                        "Bank transfer / approved international methods",
                                        "No minimum traffic requirement",
                                        "Zero joining fees"
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                                            <span className="text-slate-700 dark:text-slate-300 font-medium">{text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col justify-end">
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-slate-400" />
                                        Compliance Note
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Commission applies only to completed & verified transactions. IndonesianVisas.com reserves the right to evaluate affiliate performance and compliance with ethical promotion standards.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 6 - COVERAGE */}
            <section className="py-20 bg-slate-50 dark:bg-[#060b18] overflow-hidden">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1 relative">
                            {/* Abstract Map visual representation */}
                            <div className="aspect-square max-w-md mx-auto relative group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-full animate-pulse blur-2xl" />
                                <div className="relative h-full w-full bg-white dark:bg-slate-800 rounded-[3rem] shadow-lg border border-slate-100 dark:border-slate-700 p-8 flex flex-col justify-center gap-6">
                                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                                        <Globe className="w-8 h-8 text-blue-500" />
                                        <span className="font-bold text-slate-800 dark:text-slate-200">Country-Based Visas</span>
                                    </div>
                                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl ml-8">
                                        <MapPin className="w-8 h-8 text-emerald-500" />
                                        <span className="font-bold text-slate-800 dark:text-slate-200">Local City-Based Services <br /><span className="text-xs text-slate-500 font-normal">(Bali, Jakarta, etc.)</span></span>
                                    </div>
                                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                                        <Users className="w-8 h-8 text-indigo-500" />
                                        <span className="font-bold text-slate-800 dark:text-slate-200">Centralized Portal</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 space-y-6">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">Global Reach, Local Expertise</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400">
                                Affiliates can tap into a deeply integrated service network. Whether your audience is looking to visit Indonesia from abroad or requires local extensions and business services within specific cities like Bali and Jakarta, our centralized referral system ensures you get credited for every service.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 7 - RESOURCES */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-6xl text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-12">Affiliate Resources & Support</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                        {[
                            { title: "Unique Tracking Links", desc: "Reliable referral tracking.", icon: LinkIcon },
                            { title: "Performance Reporting", desc: "Transparent conversion metrics.", icon: LineChart },
                            { title: "Marketing Banners", desc: "High-converting creative assets.", icon: Briefcase },
                            { title: "Content Guidance", desc: "Best practices for promotion.", icon: FileText },
                            { title: "Partner Communication", desc: "Direct line for support.", icon: MessageSquare },
                            { title: "Compliance Guidelines", desc: "Regulatory adherence tips.", icon: ShieldCheck }
                        ].map((resource, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all group">
                                <resource.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4 group-hover:-translate-y-1 transition-transform" />
                                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{resource.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">{resource.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 8 - APPLICATION FORM */}
            <section id="apply" className="py-20 bg-slate-50 dark:bg-[#060b18]">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Apply to Become an Official Affiliate Partner</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Submit your application below. Our team will review and contact qualified applicants.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 dark:shadow-[0_0_40px_rgba(37,99,235,0.05)]">
                        <form action="https://formspree.io/f/xbdlnjka" method="POST" className="space-y-6">
                            {/* Hidden field for context */}
                            <input type="hidden" name="subject" value="New Affiliate Application Request" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name <span className="text-red-500">*</span></label>
                                    <input type="text" name="name" required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address <span className="text-red-500">*</span></label>
                                    <input type="email" name="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Business / Website / Social Media URL <span className="text-red-500">*</span></label>
                                <input type="url" name="platformUrl" required placeholder="https://" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Country <span className="text-red-500">*</span></label>
                                    <input type="text" name="country" required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">City <span className="text-slate-400 font-normal">(Optional)</span></label>
                                    <input type="text" name="city" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">WhatsApp / Telegram <span className="text-red-500">*</span></label>
                                    <input type="text" name="contact" required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Est. Monthly Audience <span className="text-slate-400 font-normal">(Optional)</span></label>
                                    <select name="audienceSize" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
                                        <option value="">Select size...</option>
                                        <option value="Just starting (< 1k)">Just starting (&lt; 1k)</option>
                                        <option value="1k - 10k">1k - 10k</option>
                                        <option value="10k - 50k">10k - 50k</option>
                                        <option value="50k+">50k+</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Message <span className="text-slate-400 font-normal">(Tell us how you plan to promote)</span></label>
                                <textarea name="message" rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"></textarea>
                            </div>

                            <div className="bg-blue-50 dark:bg-slate-900 p-4 rounded-xl border border-blue-100 dark:border-slate-700 flex items-start gap-3">
                                <input type="checkbox" name="compliance" id="compliance" required className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <label htmlFor="compliance" className="text-sm text-slate-700 dark:text-slate-300">
                                    I confirm that I will promote IndonesianVisas.com in compliance with applicable regulations and ethical marketing standards.
                                </label>
                            </div>

                            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-600/25 flex items-center justify-center gap-2 group">
                                Submit Affiliate Application
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* LEGAL & COMPLIANCE FOOTER NOTE */}
            <div className="py-8 bg-white dark:bg-[#030712] border-t border-slate-100 dark:border-slate-800">
                <div className="container mx-auto px-4 max-w-5xl text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed uppercase tracking-wider font-semibold">
                        IndonesianVisas.com operates under PT Indonesian Visas Agency™. Visa approval remains subject to Indonesian immigration authority decisions. Affiliate commissions apply only to verified service transactions. This program does not guarantee visa approval outcomes.
                    </p>
                </div>
            </div>
        </div>
    );
}

