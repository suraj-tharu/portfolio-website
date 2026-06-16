// AnimatedCounter - Premium number counter with animation
import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
    target: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}

export const AnimatedCounter = ({
    target,
    duration = 2,
    suffix = "",
    prefix = "",
    className = ""
}: AnimatedCounterProps) => {
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

    return (
        <div ref={ref} className={`font-bold text-4xl ${className}`}>
            <span className="bg-gradient-to-r from-gold via-purple to-blue bg-clip-text text-transparent">
                {prefix}{count}{suffix}
            </span>
        </div>
    );
};
