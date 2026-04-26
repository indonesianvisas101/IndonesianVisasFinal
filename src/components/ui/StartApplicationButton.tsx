"use client";

import { useApplication } from "@/components/application/ApplicationContext";

export default function StartApplicationButton() {
    const { openPanel } = useApplication();

    return (
        <button
            onClick={() => openPanel()}
            className="cta-primary text-lg px-12 py-5 shadow-xl shadow-primary/25"
        >
            Start Application Now
        </button>
    );
}
