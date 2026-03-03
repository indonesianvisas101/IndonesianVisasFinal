import { useEffect, useState, RefObject } from 'react';

export function useIntersectionObserver(
    ref: RefObject<Element | null>,
    options: IntersectionObserverInit = { threshold: 0, rootMargin: '200px' }
) {
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const target = ref.current;
        if (!target) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsIntersecting(true);
                // Only load once, then keep it around
                observer.disconnect();
            }
        }, options);

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [ref, options]);

    return isIntersecting;
}
