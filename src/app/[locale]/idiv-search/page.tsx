import React from "react";
import SearchClient from "./SearchClient";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "IDiv Card Public Verification | Indonesian Visas",
        description: "Official public search portal for Indonesian Visas IDiv verification records. Track your visa status and access your digital stay permit.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/idiv-search`,
        },
    };
}

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] transition-colors duration-300">
            <SearchClient locale={locale} />
        </div>
    );
}
