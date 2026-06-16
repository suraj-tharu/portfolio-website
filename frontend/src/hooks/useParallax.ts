import { useEffect, useRef } from 'react';

interface ParallaxOptions {
    speed?: number;
    offset?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * Advanced Parallax Scrolling Hook (Suggestion #1)
 * Creates smooth, depth-based parallax effects on scroll
 */
export const useParallax = (options: ParallaxOptions = {}) => {
    const { speed = 0.5, offset = 0, direction = 'up' } = options;
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const handleScroll = () => {
            if (!ref.current) return;

            const scrollPos = window.scrollY;
            const elementPos = ref.current.offsetTop;
            const distance = scrollPos - elementPos + window.innerHeight;
            const parallaxOffset = distance * speed * -1;

            if (direction === 'up' || direction === 'down') {
                ref.current.style.transform = `translateY(${parallaxOffset + offset}px)`;
            } else if (direction === 'left' || direction === 'right') {
                ref.current.style.transform = `translateX(${parallaxOffset + offset}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed, offset, direction]);

    return ref;
};

/**
 * Multi-layer Parallax Effect
 * Creates depth with multiple parallax layers
 */
export const useMultiParallax = (layers: number = 3) => {
    const refs = useRef<(HTMLElement | null)[]>(Array(layers).fill(null));

    useEffect(() => {
        const handleScroll = () => {
            refs.current.forEach((el, index) => {
                if (!el) return;
                const speed = 0.3 + index * 0.15;
                const scrollPos = window.scrollY;
                el.style.transform = `translateY(${scrollPos * speed}px)`;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return refs;
};

/**
 * Perspective Parallax with Depth Calculation
 */
export const usePerspectiveParallax = (depth: number = 1000) => {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!ref.current) return;

            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;

            ref.current.style.transform = `perspective(${depth}px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [depth]);

    return ref;
};
