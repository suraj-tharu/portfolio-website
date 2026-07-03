import { useEffect, useRef, useState } from 'react';

interface IntersectionOptions {
    threshold?: number | number[];
    margin?: string;
    triggerOnce?: boolean;
}

/**
 * Hook for observing element visibility
 */
export function useIntersectionObserver(options: IntersectionOptions = {}) {
    const { threshold = 0.1, margin = '0px', triggerOnce = false } = options;
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const hasBeenTriggered = useRef(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    hasBeenTriggered.current = true;
                    if (triggerOnce && ref.current) {
                        observer.unobserve(ref.current);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            {
                threshold,
                rootMargin: margin,
            }
        );

        const currentRef = ref.current;
        observer.observe(currentRef);

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold, margin, triggerOnce]);

    return { ref, isVisible };
}

/**
 * Hook for lazy loading images
 */
export function useLazyImage(src: string, fallbackSrc?: string) {
    const [imageSrc, setImageSrc] = useState(fallbackSrc || src);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const { ref: observerRef, isVisible } = useIntersectionObserver({ margin: '50px' });

    useEffect(() => {
        if (!isVisible) return;

        const img = new Image();
        img.src = src;

        img.onload = () => {
            setImageSrc(src);
            setIsLoading(false);
        };

        img.onerror = () => {
            setError(true);
            setIsLoading(false);
        };
    }, [isVisible, src]);

    return { ref: observerRef, imageSrc, isLoading, error };
}

/**
 * Hook for triggering animations when element comes into view
 */
export function useAnimateOnView(options: IntersectionOptions = {}) {
    const { ref, isVisible } = useIntersectionObserver(options);
    return { ref, animate: isVisible };
}

/**
 * Hook for scroll position tracking
 */
export function useScrollPosition() {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isScrollingDown, setIsScrollingDown] = useState(false);
    const previousScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollPosition(currentScrollY);
            setIsScrollingDown(currentScrollY > previousScrollY.current);
            previousScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return { scrollPosition, isScrollingDown };
}

/**
 * Hook for performance monitoring
 */
export function usePerformanceMonitor(componentName: string) {
    useEffect(() => {
        const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name.includes(componentName)) {
                    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
                        console.debug(`[Performance] ${componentName}:`, {
                            duration: entry.duration,
                            startTime: entry.startTime,
                            name: entry.name,
                        });
                    }
                }
            }
        });

        try {
            perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
        } catch {
            // Fallback for browsers that don't support PerformanceObserver
        }

        return () => perfObserver.disconnect();
    }, [componentName]);
}
