"use client";

import React from "react";
import dynamic from "next/dynamic";

// Force client-side only to prevent MUI/Hydration errors
const SearchClient = dynamic(() => import("./SearchClient"), { ssr: false });

export default function SearchContainer({ locale }: { locale: string }) {
    return <SearchClient locale={locale} />;
}
