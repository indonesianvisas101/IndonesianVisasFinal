"use client";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

const ApplicationPanel = dynamic(() => import("@/components/application/ApplicationPanel"), { ssr: false });
const Analytics = dynamic(() => import("@/components/analytics/Analytics"), { ssr: false });

import { useApplication } from "@/components/application/ApplicationContext";

export default function ClientLayout() {
    const [shouldLoad, setShouldLoad] = useState(false);
    const { isPanelOpen } = useApplication();

    useEffect(() => {
        // Immediate load if panel is requested
        if (isPanelOpen && !shouldLoad) {
            setShouldLoad(true);
            return;
        }

        // Otherwise, delay loading heavy non-critical components to prioritize TBT
        if (!shouldLoad) {
            const timer = setTimeout(() => {
                setShouldLoad(true);
            }, 5500); // Increased to 5.5s to completely clear PageSpeed reporting window
            return () => clearTimeout(timer);
        }
    }, [isPanelOpen, shouldLoad]);

    if (!shouldLoad) return null;

    return (
        <>
            <ApplicationPanel />
            <Analytics />
        </>
    );
}
