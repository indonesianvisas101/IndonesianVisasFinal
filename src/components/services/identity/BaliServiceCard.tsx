"use client";

import React, { useState } from "react";
import { ExternalLink, CheckCircle2, ArrowRight } from "lucide-react";
import ServiceFormPopup from "./ServiceFormPopup";
import Link from "next/link";

interface BaliServiceCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
}

const BaliServiceCard: React.FC<BaliServiceCardProps> = ({ title, description, icon: Icon }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    return (
        <>
            <div className="glass-card group p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between h-full bg-white/50 dark:bg-white/5">
                <div className="space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                        <Icon size={28} />
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-2xl font-black mode-aware-text tracking-tight uppercase leading-none">{title}</h4>
                        <p className="mode-aware-subtext text-sm leading-relaxed font-medium">{description}</p>
                    </div>
                </div>

                <div className="mt-10 space-y-3">
                    <button 
                        onClick={() => setIsPopupOpen(true)}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        Apply Now <ArrowRight size={16} />
                    </button>
                    
                    <Link 
                        href="https://balihelp.id"
                        target="_blank"
                        className="w-full py-4 bg-slate-100 dark:bg-white/5 mode-aware-text rounded-2xl font-black text-sm border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        See More on Bali Help <ExternalLink size={14} />
                    </Link>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                        Verified
                    </div>
                </div>
            </div>

            <ServiceFormPopup 
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                serviceName={title}
            />
        </>
    );
};

export default BaliServiceCard;
