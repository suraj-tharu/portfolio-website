import { useEffect, useRef, useState } from 'react';

/**
 * Hook for lazy loading images and components
 * Suggestion #2: Lazy Load Images & Components
 */
export function useLazyLoad<T extends HTMLElement = HTMLElement>(options?: IntersectionObserverInit) {
    const ref = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, {
            threshold: 0.1,
            ...options
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [options]);

    return { ref, isVisible };
}

/**
 * Progressive Image Loading with blur-up effect
 * Suggestion #3: Progressive Image Loading
 */
export function useProgressiveImage(src: string, placeholder?: string) {
    const [imageSrc, setImageSrc] = useState(placeholder || src);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const img = new Image();

        img.onload = () => {
            setImageSrc(src);
            setIsLoading(false);
        };

        img.onerror = () => {
            setIsLoading(false);
        };

        img.src = src;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src]);

    return { imageSrc, isLoading };
}
