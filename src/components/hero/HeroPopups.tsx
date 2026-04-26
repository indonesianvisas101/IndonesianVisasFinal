
import React from "react";
import { Globe, Lock, RefreshCcw, Zap, Clock, Star } from "lucide-react";

export const getStepPopups = (pt: any) => ({
    1: {
        id: 'step-1-info',
        title: pt.step1?.title || 'Global Eligibility & Filtering',
        icon: <Globe size={32} />,
        content: (
            <div className="space-y-4">
                <p className="font-bold text-sm text-primary uppercase tracking-widest">{pt.step1?.subtitle || 'Step 1: Universal Access'}</p>
                <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    {pt.step1?.content || 'We support travelers from over **97 countries**. Our system automatically filters the latest immigration regulations based on your nationality and travel purpose.'}
                </p>
            </div>
        )
    },
    2: {
        id: 'step-2-info',
        title: pt.step2?.title || 'Secure Data Handling',
        icon: <Lock size={32} />,
        content: (
            <div className="space-y-4">
                <p className="font-bold text-sm text-primary uppercase tracking-widest">{pt.step2?.subtitle || 'Step 2: Privacy First'}</p>
                <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    {pt.step2?.content || 'Your personal information is protected by industry-standard **AES-256 bit encryption**. We collect only what is legally required for your visa sponsorship.'}
                </p>
            </div>
        )
    },
    3: {
        id: 'step-3-info',
        title: pt.step3?.title || 'AI Pre-Verification',
        icon: <RefreshCcw size={32} />,
        content: (
            <div className="space-y-4">
                <p className="font-bold text-sm text-primary uppercase tracking-widest">{pt.step3?.subtitle || 'Step 3: Document Accuracy'}</p>
                <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    {pt.step3?.content || 'Once uploaded, our **AI Agent** perform a pre-screening of your passport and documents to ensure 100% compliance with Indonesian Immigration standards.'}
                </p>
            </div>
        )
    },
    4: {
        id: 'step-4-info',
        title: pt.step4?.title || 'Payment & ID Activation',
        icon: <Zap size={32} />,
        content: (
            <div className="space-y-4">
                <p className="font-bold text-sm text-primary uppercase tracking-widest">{pt.step4?.subtitle || 'Step 4: Final Confirmation'}</p>
                <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    {pt.step4?.content || 'Complete your transaction via world-class secure payment gateways. The moment payment is verified, your **ID Tracker** is activated.'}
                </p>
                <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/20">
                    <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        <li className="flex gap-2"><strong>+</strong> Receive Your email Confirmation</li>
                        <li className="flex gap-2"><strong>+</strong> Unique ID Tracker Order Activation</li>
                        <li className="flex gap-2"><strong>+</strong> Official Sponsor Guarantee</li>
                    </ul>
                </div>
            </div>
        )
    }
});

export const getStatPopups = () => ({
    company: {
        id: 'stat-company',
        title: 'No. 1 Visa Agency',
        icon: <Globe size={32} />,
        content: (
            <div className="space-y-4">
                <p className="font-bold text-sm text-primary uppercase tracking-widest">Industry Leadership</p>
                <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    IndonesianVisas.com is recognized as a leader in digital visa facilitation. Since 2010, we have pioneered smooth immigration pathways for global travelers.
                </p>
                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                    <p className="text-sm">
                        We utilize an **Advanced Verification System** integrated with dedicated legal support to ensure absolute document accuracy and speed.
                    </p>
                </div>
                <p className="text-xs text-slate-400 italic">Your Registered Legal Gateway to Indonesia - Built for Trust.</p>
            </div>
        )
    },
    processed: {
        id: 'stat-processed',
        title: '10K+ Applications',
        icon: <Clock size={32} />,
        content: (
            <div className="space-y-4">
                <p className="font-bold text-sm text-primary uppercase tracking-widest">Deep Experience</p>
                <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    With over **16 years of experience** (2010-2026), we've seen it all. Our journey through the industry's evolution allows us to navigate complex regulatory changes with ease.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    We've processed tens of thousands of visas, learning from every uniquely challenging case to provide you with the most reliable path to Indonesia.
                </p>
            </div>
        )
    },
    success: {
        id: 'stat-success',
        title: '99% Success Rate',
        icon: <Star size={32} />,
        content: (
            <div className="space-y-4">
                <p className="font-bold text-sm text-primary uppercase tracking-widest">The Draft System™</p>
                <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    Our proprietary **Draft System** and **Dual-Review Cycle** ensure the highest success rates in the industry.
                </p>
                <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/20">
                    <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        <li className="flex gap-2"><strong>1.</strong> We work directly within the Immigration system draft layer.</li>
                        <li className="flex gap-2"><strong>2.</strong> Your application is submitted as a pre-verified draft.</li>
                        <li className="flex gap-2"><strong>3.</strong> If the system flags an issue, our agent resolve it *immediately*.</li>
                        <li className="flex gap-2"><strong>4.</strong> We only proceed to official submission once approval is verified.</li>
                    </ul>
                </div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">This methodology ensures zero financial loss for our clients and a 99% guaranteed result.</p>
            </div>
        )
    }
});
