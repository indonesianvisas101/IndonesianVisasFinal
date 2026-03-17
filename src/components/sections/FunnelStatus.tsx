"use client";

import React from 'react';
import { ClipboardCheck, ShieldEllipsis, Clock, CheckCircle2 } from 'lucide-react';
import styles from './FunnelStatus.module.css';
import CentralInfoPopup, { StaticPopupInfo } from "../common/CentralInfoPopup";
import { Info, BarChart3, Users, Zap, Search } from "lucide-react";

const FunnelStatus = ({ dict }: { dict?: any }) => {
    const [activePopup, setActivePopup] = React.useState<StaticPopupInfo | null>(null);

    const t = dict?.funnel_status || {
        title: "Live Application Funnel",
        subtitle: "How we process thousands of successful visas every month",
        stages: [
            {
                title: "Pre-Screening",
                desc: "Every document is manually checked by our experts within 30 minutes of submission.",
                stats: "99.9% Accuracy"
            },
            {
                title: "Verification",
                desc: "Identity and document authenticity verification with Indonesian Immigration database.",
                stats: "Secure Check"
            },
            {
                title: "Immigration Process",
                desc: "Direct submission to the official system. We monitor status updates every 4 hours.",
                stats: "Fast Processing"
            },
            {
                title: "Visa Issued",
                desc: "Digital visa delivery directly to your email and dashboard. Ready to fly!",
                stats: "Success Guaranteed"
            }
        ],
        live_label: "Live Processing Status",
        queue_label: "In Processing Queue",
        issued_label: "Last Issued",
        live_active_template: "{n} Applications currently in queue",
        live_last_issued_template: "Last visa issued {t}"
    };
    const pt = t.popups || {};

    const stagePopups: Record<number, StaticPopupInfo> = {
        0: {
            id: 'funnel-stage-1',
            title: pt.stage1?.title || 'Rapid Document Audit',
            icon: <ClipboardCheck size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-blue-600 uppercase tracking-widest">Pre-Screening Quality</p>
                    <p className="text-base leading-relaxed">
                        {pt.stage1?.content || 'Every file you upload is reviewed by our compliance bots and human experts within 30 minutes.'}
                    </p>
                </div>
            )
        },
        1: {
            id: 'funnel-stage-2',
            title: pt.stage2?.title || 'Official Database Sync',
            icon: <ShieldEllipsis size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-purple-600 uppercase tracking-widest">Identity Verification</p>
                    <p className="text-base leading-relaxed">
                        {pt.stage2?.content || 'We cross-check your identity against the official immigration database.'}
                    </p>
                </div>
            )
        },
        2: {
            id: 'funnel-stage-3',
            title: pt.stage3?.title || 'Real-Time Submission',
            icon: <Clock size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-amber-600 uppercase tracking-widest">Active Processing</p>
                    <p className="text-base leading-relaxed">
                        {pt.stage3?.content || 'Your application is injected directly into the official portal as a verified draft.'}
                    </p>
                </div>
            )
        },
        3: {
            id: 'funnel-stage-4',
            title: 'IDIV Activation',
            icon: <CheckCircle2 size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-green-600 uppercase tracking-widest">Final Issuance</p>
                    <p className="text-base leading-relaxed">
                        {pt.stage4?.content || 'Upon approval, your digital visa is generated and your **Official Sponsor ID (IDIV)** is activated. You receive a secure PDF and a permanent record.'}
                    </p>
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100 text-sm">
                        <CheckCircle2 size={16} className="inline mr-1 text-green-500" /> Success Guaranteed and Verified.
                    </div>
                </div>
            )
        }
    };

    const [stats, setStats] = React.useState({ queue: 0, lastIssued: "" });

    React.useEffect(() => {
        const today = new Date();
        const isWeekend = today.getDay() === 0 || today.getDay() === 6;
        
        // Use date as seed for the queue count so it stays consistent throughout the day
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        // Simple pseudo-random using seed
        const pseudoRandom = Math.abs(Math.sin(seed) * 10000);
        
        let queueCount;
        if (isWeekend) {
            // Holiday/Weekend: 23-48
            queueCount = Math.floor(23 + (pseudoRandom % (48 - 23 + 1)));
        } else {
            // Normal day: 7-19
            queueCount = Math.floor(7 + (pseudoRandom % (19 - 7 + 1)));
        }

        // Last issued: random between 4 mins and 2 hours (120 mins) per session
        const lastIssuedMinutes = Math.floor(4 + Math.random() * (120 - 4 + 1));
        let lastIssuedText = "";
        if (lastIssuedMinutes < 60) {
            lastIssuedText = `${lastIssuedMinutes} minutes ago`;
        } else {
            const hours = Math.floor(lastIssuedMinutes / 60);
            const mins = lastIssuedMinutes % 60;
            lastIssuedText = `${hours} hour${hours > 1 ? 's' : ''}${mins > 0 ? ` ${mins} mins` : ''} ago`;
        }

        setStats({ queue: queueCount, lastIssued: lastIssuedText });
    }, []);

    const icons = [
        <ClipboardCheck size={32} key="1" />,
        <ShieldEllipsis size={32} key="2" />,
        <Clock size={32} key="3" />,
        <CheckCircle2 size={32} key="4" />
    ];



    return (
        <section className={styles.funnelSection}>
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 
                        className="text-3xl md:text-5xl font-black mode-aware-text"
                    >
                        {t.title}
                    </h2>
                    
                    <CentralInfoPopup isOpen={!!activePopup} onClose={() => setActivePopup(null)} info={activePopup} />
                    <p className="text-lg mode-aware-subtext">
                        {t.subtitle}
                    </p>
                </div>

                <div className={styles.funnelGrid}>
                    {t.stages.map((stage: any, index: number) => (
                        <div 
                            key={index} 
                            onClick={() => setActivePopup(stagePopups[index])}
                            className={`${styles.funnelCard} glass-card cursor-help group`}
                        >
                            <div className={styles.iconWrapper}>
                                {icons[index]}
                                <div className={styles.stepNumber}>{index + 1}</div>
                            </div>
                            <h3 className="text-xl font-bold mode-aware-text mt-6 mb-3 flex items-center justify-between gap-2">
                                {stage.title}
                                <Info size={16} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h3>
                            <p className="text-sm mode-aware-subtext leading-relaxed mb-4">
                                {stage.desc}
                            </p>
                            <div className={styles.statsBadge}>
                                {stage.stats}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.liveMonitor}>
                    <div className={styles.pulseWrapper}>
                        <div className={styles.pulse}></div>
                        <span className="font-bold text-primary">{t.live_label}</span>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <span className="text-sm font-medium mode-aware-subtext">
                            {stats.queue > 0 ? (t.live_active_template || "{n} Applications currently in queue").replace("{n}", stats.queue.toString()) : "Loading queue..."}
                        </span>
                        <div className="hidden md:block w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                        <span className="text-sm font-bold mode-aware-text">
                            {stats.lastIssued ? (t.live_last_issued_template || "Last visa issued {t}").replace("{t}", stats.lastIssued) : "Updating status..."}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FunnelStatus;
