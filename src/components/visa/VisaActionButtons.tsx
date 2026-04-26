"use client";

import React, { useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import VisaInquiryModal from "@/components/visa/VisaInquiryModal";
import { useApplication } from "@/components/application/ApplicationContext";

interface VisaActionButtonsProps {
    visaId: string;
    visaName: string;
    price: string;
}

const VisaActionButtons = ({ visaId, visaName, price }: VisaActionButtonsProps) => {
    const { openPanel } = useApplication();
    const [isInquiryOpen, setIsInquiryOpen] = useState(false);

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={() => openPanel({ visaId, isLocked: true })}
                    className="px-8 py-4 rounded-full font-bold text-lg text-white shadow-xl shadow-[#9155FD]/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #9155FD 0%, #6A38CC 100%)' }}
                >
                    Order Now <ArrowRight size={20} />
                </button>
                <button
                    onClick={() => setIsInquiryOpen(true)}
                    className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
                >
                    Send Request
                </button>
            </div>

            <VisaInquiryModal
                isOpen={isInquiryOpen}
                onClose={() => setIsInquiryOpen(false)}
                visaName={visaName}
            />
        </>
    );
};

export default VisaActionButtons;
