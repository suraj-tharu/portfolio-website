import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    staggerDuration?: number;
    splitBy?: 'word' | 'character';
}

export const TextReveal = ({
    text,
    className = "",
    delay = 0,
    staggerDuration = 0.05,
    splitBy = 'word'
}: TextRevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

    // Handle split
    let items: string[] = [];
    if (splitBy === 'word') {
        items = text.split(' ');
    } else {
        items = text.split('');
    }

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDuration,
                delayChildren: delay,
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: 'spring',
                damping: 20,
                stiffness: 100,
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`inline-flex flex-wrap ${className}`}
        >
            {items.map((item, index) => (
                <motion.span
                    key={index}
                    variants={itemVariants}
                    className="inline-block whitespace-pre"
                >
                    {item}{splitBy === 'word' && index !== items.length - 1 ? ' ' : ''}
                </motion.span>
            ))}
        </motion.div>
    );
};
