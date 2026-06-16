// Animation Utilities for Premium Effects
import { gsap } from 'gsap';

export const animationConfigs = {
    microInteraction: {
        duration: 0.3,
        ease: "power2.out"
    },
    smoothScroll: {
        duration: 0.8,
        ease: "power3.inOut"
    },
    parallax: {
        duration: 1,
        ease: "none"
    }
};

// Magnetic button attraction
export const magneticAttraction = (element: HTMLElement, mouseX: number, mouseY: number) => {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = (mouseX - centerX) * 0.3;
    const distY = (mouseY - centerY) * 0.3;

    gsap.to(element, {
        x: distX,
        y: distY,
        duration: 0.6,
        ease: "power3.out",
        overwrite: 'auto'
    });
};

// Glow effect on hover
export const applyGlowEffect = (element: HTMLElement, color = "#D4AF37") => {
    gsap.to(element, {
        boxShadow: `0 0 30px ${color}, 0 0 60px ${color}80`,
        duration: 0.3,
        ease: "power2.out"
    });
};

export const removeGlowEffect = (element: HTMLElement) => {
    gsap.to(element, {
        boxShadow: "0 0 0px rgba(0,0,0,0)",
        duration: 0.3,
        ease: "power2.out"
    });
};

// Staggered animation
export const staggerAnimation = (elements: HTMLElement[], config = {}) => {
    gsap.to(elements, {
        ...config,
        stagger: 0.1
    });
};

// Number counter animation
export const animateCounter = (
    element: HTMLElement,
    start: number,
    end: number,
    duration: number = 2
) => {
    const obj = { value: start };
    gsap.to(obj, {
        value: end,
        duration,
        ease: "power2.out",
        onUpdate: () => {
            element.textContent = Math.floor(obj.value).toString();
        }
    });
};

// Smooth reveal animation
export const revealAnimation = (element: HTMLElement) => {
    gsap.fromTo(element,
        { opacity: 0, y: 30, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }
    );
};

// Parallax effect
export const parallaxEffect = (element: HTMLElement, scrollY: number, speed: number = 0.5) => {
    gsap.set(element, {
        y: scrollY * speed
    });
};

// Text gradient animation
export const animateTextGradient = (element: HTMLElement) => {
    const timeline = gsap.timeline({ repeat: -1, yoyo: true });
    timeline.to(element, {
        backgroundPosition: "200% center",
        duration: 3,
        ease: "none"
    });
};

// Flip card animation
export const flipCard = (element: HTMLElement, isFlipped: boolean) => {
    gsap.to(element, {
        rotationY: isFlipped ? 180 : 0,
        duration: 0.6,
        ease: "back.out",
        overwrite: 'auto'
    });
};
