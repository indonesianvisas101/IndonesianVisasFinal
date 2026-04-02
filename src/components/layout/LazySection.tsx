"use client";

import React, { useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazySectionProps {
    children: React.ReactNode;
    minHeight?: string;
    rootMargin?: string;
    className?: string;
}

export default function LazySection({ children, minHeight = '300px', rootMargin = '400px', className = '' }: LazySectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = React.useState(false);
    const isIntersecting = useIntersectionObserver(ref, { rootMargin, threshold: 0 });

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const shouldShow = isMounted && isIntersecting;

    return (
        <div ref={ref} style={{ minHeight: shouldShow ? 'auto' : minHeight }} className={className}>
            {shouldShow ? children : null}
        </div>
    );
}
