"use client";

import React, { useEffect, useState } from 'react';
import SectionWrapper from "@/components/layout/SectionWrapper";
import { ArrowRight, CheckCircle, Globe, Loader2, MessageSquare, CreditCard, X } from "lucide-react";
import Link from "next/link";

interface CompanyService {
    id: string;
    category: string;
    name: string;
    package: string;
    price: string;
    description: string;
    features: string[];
}

const CompanyFormationContent = ({ dict }: { dict?: any }) => {
    const t = dict?.company_formation_page || {};
    const [services, setServices] = useState<CompanyService[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<CompanyService | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch('/api/company-services')
            .then(res => res.json())
            .then(data => {
                setServices(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load services", err);
                setLoading(false);
            });
    }, []);

    const groupedServices = services.reduce((acc, service) => {
        if (!acc[service.category]) acc[service.category] = [];
        acc[service.category].push(service);
        return acc;
    }, {} as Record<string, CompanyService[]>);

    const handleOrder = (service: CompanyService) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(price));
    };

    return (
        <section className="bg-slate-50 dark:bg-black/20 pb-24">
            <div className="container mx-auto px-4">
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-40 gap-4">
                        <Loader2 className="animate-spin text-primary" size={48} />
                        <p className="text-lg font-bold mode-aware-subtext animate-pulse">Loading Premium Packages...</p>
                    </div>
                ) : (
                    <div className="space-y-32">
                        {Object.entries(groupedServices).map(([category, items]) => (
                            <div key={category} className="scroll-mt-24" id={category.replace(/\s+/g, '-').toLowerCase()}>
                                <div className="text-center mb-16 space-y-4">
                                    <h2 className="text-4xl font-black mode-aware-text tracking-tight">{category}</h2>
                                    <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
                                </div>

                                <div className={`grid gap-8 ${items.length > 2 ? 'lg:grid-cols-3' : (items.length === 2 ? 'md:grid-cols-2 max-w-5xl mx-auto' : 'max-w-xl mx-auto')}`}>
                                    {items.map((service) => (
                                        <div
                                            key={service.id}
                                            className="glass-card p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-primary/50 transition-all duration-500 flex flex-col relative group hover:-translate-y-2"
                                        >
                                            {service.name.includes('Full') && (
                                                <div className="absolute -top-4 right-8 bg-primary text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg shadow-primary/20 tracking-widest uppercase">
                                                    PREMIUM
                                                </div>
                                            )}

                                            <div className="mb-8">
                                                <div className="flex items-baseline gap-2 mb-4">
                                                    <span className="text-4xl font-black mode-aware-text tracking-tighter">{formatPrice(service.price)}</span>
                                                    <span className="text-xs font-bold mode-aware-subtext uppercase tracking-widest opacity-60">/ complete</span>
                                                </div>
                                                <p className="text-base mode-aware-subtext leading-relaxed font-medium line-clamp-2">{service.description}</p>
                                            </div>

                                            <ul className="space-y-4 mb-10 flex-grow">
                                                {service.features.map((feature, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                            <CheckCircle className="text-primary" size={12} />
                                                        </div>
                                                        <span className="text-sm font-semibold mode-aware-subtext">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="space-y-3 pt-4">
                                                <button
                                                    onClick={() => handleOrder(service)}
                                                    className="w-full py-4 text-white font-black rounded-2xl shadow-xl shadow-[#9155FD]/20 transition-all flex items-center justify-center gap-3 active:scale-95 hover:opacity-90"
                                                    style={{ backgroundColor: '#9155FD' }}
                                                >
                                                    {t.order_button || "Secure Package"} <ArrowRight size={20} />
                                                </button>

                                                <Link
                                                    href="https://balihelp.id"
                                                    target="_blank"
                                                    className="w-full py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                                                >
                                                    {t.learn_more_balihelp || "Deep Dive at BaliHelp.id"} <Globe size={16} className="opacity-60" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="bg-white dark:bg-[#0f172a] rounded-[3.5rem] w-full max-w-lg p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] relative animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-white/10">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-8 right-8 p-3 bg-slate-100 dark:bg-white/5 rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-90"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-10 space-y-2">
                            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6">
                                <MessageSquare size={32} />
                            </div>
                            <h3 className="text-3xl font-black mode-aware-text tracking-tight">Begin Enrollment</h3>
                            <p className="text-lg mode-aware-subtext font-medium">{selectedService.name}</p>
                            <div className="bg-primary/5 py-3 px-6 rounded-2xl inline-block mt-4">
                                <span className="text-2xl font-black text-primary">{formatPrice(selectedService.price)}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Link
                                href={`https://wa.me/6285727041992?text=I would like to order ${selectedService.name}`}
                                target="_blank"
                                className="w-full py-5 bg-[#25D366] text-white font-black rounded-2xl shadow-xl shadow-[#25D366]/20 hover:opacity-90 transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                <MessageSquare size={24} />
                                Order via WhatsApp
                            </Link>

                            <button
                                className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 active:scale-95"
                                onClick={() => {
                                    alert("Online payment gateway integration coming soon! Please use WhatsApp for now.");
                                }}
                            >
                                <CreditCard size={24} />
                                Pay Online (Credit Card)
                            </button>

                            <p className="text-center text-xs font-bold mode-aware-subtext opacity-60 mt-6 uppercase tracking-widest">
                                Instant confirmation within 15 minutes
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default CompanyFormationContent;
