// Custom Hooks for Premium Features
import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { magneticAttraction, applyGlowEffect, removeGlowEffect } from '../utils/premiumAnimations';

// Hook for magnetic button effect
export const useMagneticButton = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;

        const handleMouseMove = (e: MouseEvent) => {
            magneticAttraction(button, e.clientX, e.clientY);
        };

        const handleMouseLeave = () => {
            button.style.transform = 'translate(0, 0)';
        };

        button.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            button.removeEventListener('mousemove', handleMouseMove);
            button.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return buttonRef;
};

// Hook for glow effect on hover
export const useGlowEffect = (color = "#D4AF37") => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        element.addEventListener('mouseenter', () => applyGlowEffect(element, color));
        element.addEventListener('mouseleave', () => removeGlowEffect(element));

        return () => {
            element.removeEventListener('mouseenter', () => applyGlowEffect(element, color));
            element.removeEventListener('mouseleave', () => removeGlowEffect(element));
        };
    }, [color]);

    return elementRef;
};

// Hook for parallax effect
export const useParallax = (speed: number = 0.5) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, 500 * speed]);

    return [ref, y] as const;
};

// Hook for animated counter
export const useCounter = (target: number, duration: number = 2) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const hasStarted = useRef(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasStarted.current) {
                hasStarted.current = true;
                const startTime = Date.now();
                const animate = () => {
                    const elapsed = (Date.now() - startTime) / 1000;
                    const progress = Math.min(elapsed / duration, 1);
                    setCount(Math.floor(progress * target));

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };
                animate();
            }
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, [target, duration]);

    return { ref, count };
};

// Hook for scroll-triggered animations
export const useScrollReveal = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["0 1", "1.33 1"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.9], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 0.9], [40, 0]);

    return { ref, opacity, y };
};

// Hook for 3D flip card
export const useFlipCard = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const toggleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return { cardRef, isFlipped, toggleFlip };
};

// Hook for mobile touch gestures
export const useTouchGestures = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let initialDistance = 0;

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                initialDistance = Math.sqrt(
                    (touch1.clientX - touch2.clientX) ** 2 +
                    (touch1.clientY - touch2.clientY) ** 2
                );
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.sqrt(
                    (touch1.clientX - touch2.clientX) ** 2 +
                    (touch1.clientY - touch2.clientY) ** 2
                );
                const newScale = currentDistance / initialDistance;
                setScale(Math.max(0.5, Math.min(newScale, 2)));
            }
        };

        element.addEventListener('touchstart', handleTouchStart);
        element.addEventListener('touchmove', handleTouchMove);

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    return { ref, scale };
};

// Hook for theme detection and animation
export const useThemeAnimation = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        setTheme(currentTheme);
    }, []);

    return { containerRef, theme };
};
