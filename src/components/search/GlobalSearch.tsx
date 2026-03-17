"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, X, ArrowRight, FileText, Globe, DollarSign, Building, Sparkles, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { SITE_KNOWLEDGE, SiteKnowledgeEntry } from "@/utils/siteKnowledge";
import Fuse from "fuse.js";
import Link from "next/link";

const GlobalSearch = ({ isOpen, onClose, locale = 'en' }: { isOpen: boolean; onClose: () => void; locale?: string }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SiteKnowledgeEntry[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Initialize Fuse.js for fuzzy search
    const fuse = useMemo(() => {
        return new Fuse(SITE_KNOWLEDGE, {
            keys: [
                { name: 'title', weight: 0.7 },
                { name: 'keywords', weight: 0.5 },
                { name: 'description', weight: 0.3 }
            ],
            threshold: 0.4,
            includeScore: true,
            shouldSort: true
        });
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setQuery(""); 
        }
    }, [isOpen]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const fuseResults = fuse.search(query);
        setResults(fuseResults.map(r => r.item).slice(0, 10));
    }, [query, fuse]);

    if (!isOpen) return null;

    const handleSelect = (link: string) => {
        router.push(link.startsWith('/') ? `/${locale}${link === '/' ? '' : link}` : link);
        onClose();
    };

    const getIcon = (category: string) => {
        switch (category) {
            case 'Visa': return <FileText size={18} />;
            case 'Country': return <Globe size={18} />;
            case 'Company': return <Building size={18} />;
            case 'Service': return <DollarSign size={18} />;
            default: return <Sparkles size={18} />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Visa': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
            case 'Country': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
            case 'Company': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
            case 'Service': return 'bg-green-500/10 text-green-600 dark:text-green-400';
            default: return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            <div className="w-full max-w-2xl relative z-10 flex flex-col gap-3">
                <div className="relative group p-[2px] rounded-2xl bg-gradient-to-r from-primary/20 via-primary to-primary/20 shadow-2xl">
                    <div className="relative bg-white dark:bg-slate-900 rounded-[14px] flex items-center p-4 gap-4">
                        <Search className="text-primary" size={24} />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Find visas, guides, countries or company formation..."
                            className="flex-1 bg-transparent border-none outline-none text-xl font-medium text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
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
                        <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-white/10 rounded text-[10px] font-bold text-gray-400">
                            ESC
                        </div>
                    </div>
                </div>

                {query && (
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="max-h-[60vh] overflow-y-auto p-3">
                            {results.length > 0 ? (
                                <div className="space-y-1">
                                    {results.map((result, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSelect(result.link)}
                                            className="w-full flex items-center gap-4 p-3 hover:bg-primary/5 dark:hover:bg-primary/10 rounded-xl cursor-pointer group transition-all text-left"
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${getCategoryColor(result.category)}`}>
                                                {getIcon(result.category)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary transition-colors">{result.title}</h4>
                                                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-400 font-bold">{result.category}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{result.description}</p>
                                            </div>
                                            <ArrowRight size={16} className="text-gray-300 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 text-center">
                                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Sparkles className="text-gray-300" size={32} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No direct matches found</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try searching for broader terms or categories.</p>
                                </div>
                            )}
                        </div>

                        {/* AI Fallback / Action Area */}
                        <div className="px-5 py-4 bg-primary/5 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <Sparkles size={14} className="text-primary" />
                                <span>Can't find what you're looking for? **Our AI is ready to help.**</span>
                            </div>
                            <button 
                                onClick={() => {
                                    // Logic to trigger chat will depend on implementation, but Redirecting to Home/Chat is standard
                                    router.push(`/${locale}`);
                                    onClose();
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-xs font-bold hover:scale-105 transition-all shadow-lg"
                            >
                                <MessageSquare size={14} />
                                Ask AI Expert
                            </button>
                        </div>
                    </div>
                )}
                
                {!query && (
                    <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center animate-in fade-in zoom-in-95 duration-500">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Search for **B211A**, **Bali Visa**, **Company Registration** or **Prices**
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalSearch;
