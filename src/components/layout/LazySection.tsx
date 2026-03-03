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
    const isIntersecting = useIntersectionObserver(ref, { rootMargin, threshold: 0 });

    return (
        <div ref={ref} style={{ minHeight: isIntersecting ? 'auto' : minHeight }} className={className}>
            {isIntersecting ? children : null}
        </div>
    );
}
