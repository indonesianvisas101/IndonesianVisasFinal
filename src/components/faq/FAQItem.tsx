"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`glass-card rounded-[2rem] overflow-hidden transition-all duration-300 ${isOpen ? 'ring-2 ring-primary/20' : ''}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-8 py-6 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                aria-expanded={isOpen}
            >
                <span className="text-lg md:text-xl font-bold mode-aware-text">{question}</span>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-slate-100 dark:bg-white/10 text-primary'}`}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </div>
            </button>
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-8 pb-8 text-base md:text-lg mode-aware-subtext leading-relaxed border-t border-slate-100 dark:border-white/5 pt-6">
                    {answer}
                </div>
            </div>
        </div>
    );
};

export default FAQItem;
