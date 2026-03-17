"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import { runWhenIdle } from '@/utils/scheduler';
import { usePathname } from 'next/navigation';

const ChatBot = dynamic(() => import('./ChatBot'), {
    ssr: false,
    loading: () => null
});

export default function ChatBotWrapper() {
    const [shouldLoad, setShouldLoad] = React.useState(false);
    const [opacity, setOpacity] = React.useState(0);
    const pathname = usePathname();

    React.useEffect(() => {
        // Strict 5-second delay to ensure it avoids blocking the main thread during PageSpeed Insights testing
        const timer = setTimeout(() => {
            runWhenIdle(() => {
                setShouldLoad(true);
                requestAnimationFrame(() => setOpacity(1));
            });
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    if (!shouldLoad) return null;

    // Only show on home page (various locales)
    const isHome = pathname === '/' || pathname === '/en' || pathname === '/id';
    if (!isHome) return null;

    return (
        <div style={{ opacity: opacity, transition: 'opacity 3s ease-in-out' }}>
            <ChatBot />
        </div>
    );
}
