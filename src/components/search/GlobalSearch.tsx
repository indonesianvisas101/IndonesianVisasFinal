"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, FileText, Globe, DollarSign, Building } from "lucide-react";
import { useRouter } from "next/navigation";
import { VISA_DATABASE } from "@/constants/visas";
import { COUNTRY_DATA } from "@/constants/countries";
import styles from "./GlobalSearch.module.css"; // Optional, but using Tailwind is faster usually.

interface SearchResult {
    type: 'VISA' | 'COUNTRY' | 'PRICING' | 'COMPANY';
    title: string;
    description: string;
    link: string;
    icon: React.ReactNode;
}

const GlobalSearch = ({ isOpen, onClose, locale = 'en' }: { isOpen: boolean; onClose: () => void; locale?: string }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setQuery(""); // Reset on close
        }
    }, [isOpen]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const searchResults: SearchResult[] = [];

        // 1. Search VISAS (Advanced: Direct Redirect)
        VISA_DATABASE.forEach((visa) => {
            const matchName = visa.name.toLowerCase().includes(lowerQuery);
            const matchId = visa.id.toLowerCase().includes(lowerQuery);
            const matchCategory = visa.category?.toLowerCase().includes(lowerQuery);

            if (matchName || matchId || matchCategory) {
                searchResults.push({
                    type: 'VISA',
                    title: visa.name,
                    description: `Visa ID: ${visa.id} • ${visa.category}`,
                    link: `/${locale}/services/${visa.id}`, // DIRECT REDIRECT
                    icon: <FileText size={18} />
                });
            }
        });

        // 2. Search COUNTRIES
        COUNTRY_DATA.forEach((c) => {
            if (c.name.toLowerCase().includes(lowerQuery)) {
                searchResults.push({
                    type: 'COUNTRY',
                    title: c.name,
                    description: "Check eligibility for Indonesia visa types",
                    link: `/${locale}/services`,
                    icon: <Globe size={18} />
                });
            }
        });

        // 3. Search PRICING
        if ("pricing".includes(lowerQuery) || "cost".includes(lowerQuery) || "fee".includes(lowerQuery)) {
            searchResults.push({
                type: 'PRICING',
                title: "Visa Pricing & Fees",
                description: "View competitive rates for all services.",
                link: `/${locale}/services`,
                icon: <DollarSign size={18} />
            });
        }

        // 4. Search COMPANY FORMATION (Advanced: Target Company Page)
        const services = [
            { id: "establishment", name: "PT PMA Establishment", desc: "Foreign Owned Company Registration" },
            { id: "local-pt", name: "Local PT Company", desc: "Indonesian Local Company Setup" },
            { id: "virtual-office", name: "Virtual Office", desc: "Professional Business Address" },
            { id: "kitas-worker", name: "Working KITAS", desc: "Work Permit for Employees" }
        ];

        services.forEach(s => {
            if (s.name.toLowerCase().includes(lowerQuery) || lowerQuery.includes("company") || lowerQuery.includes("formation")) {
                searchResults.push({
                    type: 'COMPANY',
                    title: s.name,
                    description: s.desc,
                    link: `/${locale}/company-formation`, // Direct specifically to company page
                    icon: <Building size={18} />
                });
            }
        });

        setResults(searchResults.slice(0, 8)); // Limit to 8 results

    }, [query]);

    if (!isOpen) return null;

    const handleSelect = (link: string) => {
        router.push(link);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Spotlight Container */}
            <div className="w-full max-w-xl relative z-10 flex flex-col gap-2">

                {/* Search Bar - Glassmorphism */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-white/10"></div>
                    <div className="relative flex items-center p-4 gap-3">
                        <Search className="text-gray-500 dark:text-gray-400" size={24} />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search Visas, Countries, Services..."
                            className="flex-1 bg-transparent border-none outline-none text-xl font-medium text-gray-800 dark:text-gray-100 placeholder:text-gray-500/50"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Results List - Appears only when typing */}
                {query && (
                    <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="max-h-[60vh] overflow-y-auto p-2">
                            {results.length > 0 ? (
                                <div className="space-y-1">
                                    {results.map((result, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handleSelect(result.link)}
                                            className="flex items-center gap-4 p-3 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl cursor-pointer group transition-colors"
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${result.type === 'VISA' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                                                result.type === 'COUNTRY' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                                                    result.type === 'COMPANY' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                                                        'bg-green-500/10 text-green-600 dark:text-green-400'
                                                }`}>
                                                {result.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary transition-colors">{result.title}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{result.description}</p>
                                            </div>
                                            <ArrowRight size={16} className="text-gray-300 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                    No results found for "{query}"
                                </div>
                            )}
                        </div>
                        <div className="px-4 py-2 bg-black/5 dark:bg-white/5 border-t border-black/5 dark:border-white/5 text-[10px] text-gray-400 flex justify-between">
                            <span>Search by **Name**, **ID**, **Topic**</span>
                            <span>{results.length} results</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalSearch;
