import { useEffect, useRef, useState } from 'react';

/**
 * Magnetic Button Hook (Suggestion #2)
 * Makes elements follow/attract to cursor with magnetic effect
 */
export const useMagneticButton = () => {
    const ref = useRef<HTMLElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
            const magneticRadius = 100;

            if (distance < magneticRadius) {
                const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                const force = (magneticRadius - distance) / magneticRadius;
                const strength = 30;

                const x = Math.cos(angle) * force * strength;
                const y = Math.sin(angle) * force * strength;

                setPosition({ x, y });
            } else {
                setPosition({ x: 0, y: 0 });
            }
        };

        const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return { ref, position };
};

/**
 * Scroll Reveal Hook (Suggestion #6)
 * Reveals elements with animation as they enter viewport
 */
export const useScrollReveal = (options = { threshold: 0.2, margin: '0px' }) => {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, {
            threshold: options.threshold,
            rootMargin: options.margin,
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [options]);

    return { ref, isVisible };
};

/**
 * Mobile Gesture Support Hook (Suggestion #24)
 * Handles swipe, pinch, tap gestures
 */
interface GestureHandlers {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    onPinch?: (scale: number) => void;
    onTap?: () => void;
}

export const useGestures = (handlers: GestureHandlers = {}) => {
    const ref = useRef<HTMLElement>(null);
    const touchStartRef = useRef({ x: 0, y: 0, distance: 0 });

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let touchStart: Touch;
        let lastTapTime = 0;

        const handleTouchStart = (e: TouchEvent) => {
            touchStart = e.touches[0];
            touchStartRef.current = { x: touchStart.clientX, y: touchStart.clientY, distance: 0 };

            if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                touchStartRef.current.distance = Math.sqrt(dx * dx + dy * dy);
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEnd = e.changedTouches[0];
            const deltaX = touchEnd.clientX - touchStartRef.current.x;
            const deltaY = touchEnd.clientY - touchStartRef.current.y;
            const threshold = 50;

            if (Math.abs(deltaX) > threshold) {
                if (deltaX > 0 && handlers.onSwipeRight) handlers.onSwipeRight();
                if (deltaX < 0 && handlers.onSwipeLeft) handlers.onSwipeLeft();
            }

            if (Math.abs(deltaY) > threshold) {
                if (deltaY > 0 && handlers.onSwipeDown) handlers.onSwipeDown();
                if (deltaY < 0 && handlers.onSwipeUp) handlers.onSwipeUp();
            }

            // Double tap detection
            const now = Date.now();
            if (now - lastTapTime < 300 && handlers.onTap) {
                handlers.onTap();
            }
            lastTapTime = now;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2 && handlers.onPinch) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const scale = distance / touchStartRef.current.distance;
                handlers.onPinch(scale);
            }
        };

        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchend', handleTouchEnd, { passive: true });
        element.addEventListener('touchmove', handleTouchMove, { passive: true });

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchend', handleTouchEnd);
            element.removeEventListener('touchmove', handleTouchMove);
        };
    }, [handlers]);

    return ref;
};
