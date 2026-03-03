"use client";

import React from "react";
import { Info, Phone, AlertTriangle, MapPin, Building, Globe } from "lucide-react";

// Emergency Contacts Data
const EMERGENCIES = [
    { label: "Police", number: "110", icon: <AlertTriangle size={20} className="text-red-500" /> },
    { label: "Ambulance", number: "118", icon: <Phone size={20} className="text-green-500" /> },
    { label: "Fire Station", number: "113", icon: <AlertTriangle size={20} className="text-orange-500" /> },
    { label: "Search & Rescue", number: "115", icon: <AlertTriangle size={20} className="text-yellow-500" /> },
];

// Immigration Offices
const OFFICES = [
    { city: "Jakarta (Headquarters)", address: "Jl. H.R. Rasuna Said Kav. X-6 Kuningan", phone: "(021) 5224658" },
    { city: "Bali (Ngurah Rai)", address: "Jl. Raya Taman Jimbaran, Kuta Selatan", phone: "(0361) 9351038" },
    { city: "Surabaya", address: "Jl. Jend. S. Parman No. 58A, Waru", phone: "(031) 8531866" },
    { city: "Medan", address: "Jl. Gatot Subroto KM 6,2 No. 268", phone: "(061) 8452112" },
];

const AboutExtended = () => {
    return (
        <div className="space-y-12">
            {/* System Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-6 md:p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                            <Info size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mode-aware-text">System Information</h3>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-4">
                        Our integrated dashboard allows you to track visa applications in real-time.
                        Once registered, you can access your personal secure vault where all your documents are stored encrypted.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm font-medium mode-aware-subtext">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                            Real-time Status Tracking
                        </li>
                        <li className="flex items-center gap-3 text-sm font-medium mode-aware-subtext">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                            Encrypted Document Vault
                        </li>
                        <li className="flex items-center gap-3 text-sm font-medium mode-aware-subtext">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                            Direct Chat with Legal Team
                        </li>
                    </ul>
                </div>

                <div className="glass-card p-6 md:p-8 rounded-3xl bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-red-100 rounded-xl text-red-600">
                            <Phone size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-red-900 dark:text-red-400">Emergency Contacts</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {EMERGENCIES.map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-black/20 p-4 rounded-xl flex items-center justify-between shadow-sm">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">{item.label}</p>
                                    <p className="text-xl font-bold text-gray-800 dark:text-white">{item.number}</p>
                                </div>
                                {item.icon}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Immigration Directory */}
            <div className="glass-card p-6 md:p-10 rounded-[3rem]">
                <div className="text-center mb-10">
                    <h3 className="text-3xl font-bold mb-4 mode-aware-text">Immigration Offices Directory</h3>
                    <p className="text-text-secondary">Key contact points across major Indonesian regions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {OFFICES.map((office, idx) => (
                        <div key={idx} className="border border-gray-100 dark:border-white/5 p-6 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-2 mb-3 text-primary">
                                <Building size={18} />
                                <h4 className="font-bold">{office.city}</h4>
                            </div>
                            <div className="flex gap-2 text-sm text-gray-500 mb-2">
                                <MapPin size={14} className="mt-1 shrink-0" />
                                <p>{office.address}</p>
                            </div>
                            <div className="flex gap-2 text-sm text-gray-500">
                                <Phone size={14} className="mt-1 shrink-0" />
                                <p>{office.phone}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutExtended;
