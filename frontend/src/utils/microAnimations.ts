/**
 * Micro-interactions Library (Suggestion #9)
 * Reusable animation patterns for common interactions
 */

export const microInteractionPatterns = {
    // Button Hover - Scale + Shadow
    buttonHover: {
        initial: { scale: 1, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
        hover: { scale: 1.05, boxShadow: '0 12px 24px rgba(0,0,0,0.15)' },
        tap: { scale: 0.95 },
    },

    // Card Hover - Lift + Shadow
    cardHover: {
        initial: { y: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
        hover: { y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
    },

    // Link Hover - Underline
    linkHover: {
        initial: { scaleX: 0, originX: 0 },
        hover: { scaleX: 1 },
    },

    // Icon Hover - Rotate + Scale
    iconHover: {
        initial: { rotate: 0, scale: 1 },
        hover: { rotate: 12, scale: 1.1 },
    },

    // Input Focus - Border Color + Shadow
    inputFocus: {
        initial: { borderColor: '#e5e7eb', boxShadow: 'none' },
        focus: { borderColor: '#7b6ef6', boxShadow: '0 0 0 3px rgba(123,110,246,0.1)' },
    },

    // Loading Spinner
    spinner: {
        rotate: [0, 360],
        transition: { duration: 1, repeat: Infinity, ease: 'linear' },
    },

    // Bouncing Dot
    bounce: {
        y: [0, -10, 0],
        transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
    },

    // Fade In
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 },
    },

    // Slide In from Left
    slideInLeft: {
        initial: { x: -20, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        transition: { duration: 0.3 },
    },

    // Slide In from Right
    slideInRight: {
        initial: { x: 20, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        transition: { duration: 0.3 },
    },

    // Slide In from Top
    slideInUp: {
        initial: { y: -20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.3 },
    },

    // Slide In from Bottom
    slideInDown: {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.3 },
    },

    // Scale In
    scaleIn: {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.3 },
    },

    // Rotate In
    rotateIn: {
        initial: { rotate: -10, opacity: 0 },
        animate: { rotate: 0, opacity: 1 },
        transition: { duration: 0.3 },
    },

    // Pulse Effect
    pulse: {
        scale: [1, 1.05, 1],
        transition: { duration: 2, repeat: Infinity },
    },

    // Glow Effect
    glow: {
        boxShadow: [
            '0 0 5px rgba(123, 110, 246, 0.5)',
            '0 0 20px rgba(123, 110, 246, 0.8)',
            '0 0 5px rgba(123, 110, 246, 0.5)',
        ],
        transition: { duration: 2, repeat: Infinity },
    },

    // Shake Effect (for errors)
    shake: {
        x: [-5, 5, -5, 5, 0],
        transition: { duration: 0.3 },
    },

    // Color Transition
    colorTransition: {
        color: ['#7b6ef6', '#ec4899', '#f59e0b', '#7b6ef6'],
        transition: { duration: 4, repeat: Infinity },
    },

    // Gradient Animation
    gradientAnimation: {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        transition: { duration: 6, repeat: Infinity, ease: 'linear' },
    },

    // Stagger Children
    staggerContainer: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    },

    staggerItem: {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 },
        },
    },
};

/**
 * CSS-based Animation Helper
 */
export const createKeyframeAnimation = (
    name: string,
    frames: Record<string, string>
): string => {
    const keyframes = Object.entries(frames)
        .map(([key, value]) => `${key} { ${value} }`)
        .join('\n');
    return `@keyframes ${name} { ${keyframes} }`;
};

/**
 * Animation Duration Presets
 */
export const animationDurations = {
    fast: 200, // ms
    normal: 300,
    slow: 500,
    slowest: 800,
    extraSlow: 1200,
};

/**
 * Easing Functions
 */
export const easingFunctions = {
    easeIn: [0.42, 0, 1, 1],
    easeOut: [0, 0, 0.58, 1],
    easeInOut: [0.42, 0, 0.58, 1],
    easeInQuad: [0.55, 0.085, 0.68, 0.53],
    easeOutQuad: [0.25, 0.46, 0.45, 0.94],
    easeInCubic: [0.55, 0.055, 0.675, 0.19],
    easeOutCubic: [0.215, 0.61, 0.355, 1],
    easeInQuart: [0.895, 0.03, 0.685, 0.22],
    easeOutQuart: [0.165, 0.84, 0.44, 1],
    easeInQuint: [0.755, 0.05, 0.855, 0.06],
    easeOutQuint: [0.23, 1, 0.32, 1],
    easeInExpo: [0.95, 0.05, 0.795, 0.035],
    easeOutExpo: [0.19, 1, 0.22, 1],
    easeInCirc: [0.6, 0.04, 0.98, 0.335],
    easeOutCirc: [0.075, 0.82, 0.165, 1],
    easeInBack: [0.6, -0.28, 0.735, 0.045],
    easeOutBack: [0.175, 0.885, 0.32, 1.275],
};

/**
 * Transition Presets
 */
export const transitionPresets = {
    smooth: {
        type: 'tween',
        duration: 0.3,
        ease: 'easeInOut',
    },
    spring: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        mass: 1,
    },
    bouncy: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
        mass: 0.5,
    },
    snappy: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
    },
};

/**
 * Delay utilities for staggered animations
 */
export const getDelayForIndex = (index: number, baseDelay: number = 0.05): number => {
    return index * baseDelay;
};

/**
 * Animation completion callback utility
 */
export const onAnimationComplete = (callback: () => void, delay: number = 0) => {
    return new Promise(resolve => {
        setTimeout(() => {
            callback();
            resolve(null);
        }, delay);
    });
};

/**
 * Conditional animation based on device
 */
export const shouldAnimateBasedOnDevice = (): boolean => {
    // Disable animations on low-end devices
    const isLowEndDevice =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        (navigator as any).deviceMemory < 4; // Less than 4GB RAM

    return !isLowEndDevice;
};

/**
 * Performance-safe animation initialization
 */
export const safeAnimateOnScroll = (element: HTMLElement, _animation: any) => {
    if (!('IntersectionObserver' in window)) {
        return; // Fallback for older browsers
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger animation
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    observer.observe(element);
};
