"use client";

import React, { useState, useEffect } from "react";
import { Check, Info } from "lucide-react";
import VisaActionButtons from "./VisaActionButtons";

interface PricingRow {
    label: string;
    value: string;
    isTotal?: boolean;
}

interface PricingOption {
    title: string;
    rows: PricingRow[];
}

interface VisaPricingSelectorProps {
    options: PricingOption[];
    visaId: string;
    visaName: string;
}

const formatPrice = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
};

export default function VisaPricingSelector({ options, visaId, visaName }: VisaPricingSelectorProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Safety check
    if (!options || options.length === 0) return null;

    const currentOption = options[selectedIndex];
    const totalRow = currentOption.rows.find(r => r.isTotal);
    const totalPriceDisplay = totalRow ? totalRow.value : "Contact Us";

    return (
        <div className="space-y-8">
            {/* Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedIndex(idx)}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden ${
                            selectedIndex === idx
                                ? "border-purple-600 bg-purple-50 shadow-md ring-2 ring-purple-600/20"
                                : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm"
                        }`}
                    >
                        {selectedIndex === idx && (
                            <div className="absolute top-0 right-0 p-2 text-purple-600">
                                <Check size={20} strokeWidth={3} />
                            </div>
                        )}
                        <span className={`block text-sm font-bold uppercase tracking-wider mb-2 ${
                            selectedIndex === idx ? "text-purple-700" : "text-gray-500"
                        }`}>
                            Duration
                        </span>
                        <h4 className="text-xl font-bold text-black mb-1">
                            {option.title}
                        </h4>
                        <p className={`text-lg font-bold ${selectedIndex === idx ? "text-purple-600" : "text-gray-900"}`}>
                            {option.rows.find(r => r.isTotal)?.value || "Enquire"}
                        </p>
                    </button>
                ))}
            </div>

            {/* Detailed Breakdown Card */}
            <div className="bg-white p-8 rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden animate-fadeIn">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <Info className="text-purple-600" size={24} />
                    <h3 className="text-xl font-bold text-black">
                        Pricing Details: {currentOption.title}
                    </h3>
                </div>

                <table className="w-full">
                    <tbody>
                        {currentOption.rows.map((row, rIdx) => (
                            <tr 
                                key={rIdx} 
                                className={`${
                                    row.isTotal 
                                        ? "border-t-2 border-gray-900 bg-gray-50/50" 
                                        : "border-b border-gray-100 last:border-0"
                                }`}
                            >
                                <td className={`py-4 px-2 text-black ${row.isTotal ? "text-lg font-bold pt-6" : "font-semibold"}`}>
                                    {row.label}
                                </td>
                                <td className={`py-4 px-2 text-right text-black ${row.isTotal ? "text-xl font-bold pt-6" : "font-bold"}`}>
                                    {row.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Integration with Action Buttons */}
                <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-1">Total to Pay</p>
                        <p className="text-3xl font-black text-black">{totalPriceDisplay}</p>
                    </div>
                    <VisaActionButtons 
                        visaId={visaId}
                        visaName={`${visaName} (${currentOption.title})`}
                        price={totalPriceDisplay}
                    />
                </div>
            </div>
        </div>
    );
}
