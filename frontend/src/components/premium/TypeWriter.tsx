// TypeWriter - Animated typing effect for text
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

interface TypeWriterProps {
    text: string;
    className?: string;
    speed?: number;
    onComplete?: () => void;
    cursor?: boolean;
}

export const TypeWriter = ({
    text,
    className = "",
    speed = 50,
    onComplete,
    cursor = true
}: TypeWriterProps) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, latest => Math.round(latest));
    const displayText = useTransform(rounded, latest => text.slice(0, latest));

    useEffect(() => {
        const controls = animate(count, text.length, {
            duration: text.length / (1000 / speed),
            onComplete
        });

        return () => controls.stop();
    }, [text, speed, onComplete, count]);

    return (
        <div className={className}>
            <motion.span>{displayText}</motion.span>
            {cursor && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block ml-1 text-[#D4AF37]"
                >
                    |
                </motion.span>
            )}
        </div>
    );
};
