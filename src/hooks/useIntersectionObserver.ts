import { useEffect, useState, useMemo, RefObject } from 'react';

export function useIntersectionObserver(
    ref: RefObject<Element | null>,
    options: IntersectionObserverInit = { threshold: 0, rootMargin: '200px' }
) {
    const [isIntersecting, setIsIntersecting] = useState(false);

    // Stabilize options reference to prevent re-creating the observer on every render
    const stableOptions = useMemo(() => ({
        threshold: options.threshold ?? 0,
        rootMargin: options.rootMargin ?? '200px',
        root: options.root ?? null,
    }), [options.threshold, options.rootMargin, options.root]);

    useEffect(() => {
        const target = ref.current;
        if (!target) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsIntersecting(true);
                // Only load once, then keep it around
                observer.disconnect();
            }
        }, stableOptions);

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [ref, stableOptions]);

    return isIntersecting;
}
