// Accordion - Premium accordion component with smooth animations
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
    title: string;
    content: ReactNode;
}

interface AccordionProps {
    items: AccordionItem[];
    allowMultiple?: boolean;
    className?: string;
}

export const Accordion = ({ items, allowMultiple = false, className = "" }: AccordionProps) => {
    const [expanded, setExpanded] = useState<number | number[] | null>(allowMultiple ? [] : null);

    const toggleItem = (index: number) => {
        if (allowMultiple) {
            const current = Array.isArray(expanded) ? expanded : [];
            setExpanded(
                current.includes(index)
                    ? current.filter(i => i !== index)
                    : [...current, index]
            );
        } else {
            setExpanded(expanded === index ? null : index);
        }
    };

    const isExpanded = (index: number) => {
        if (allowMultiple) {
            return Array.isArray(expanded) && expanded.includes(index);
        }
        return expanded === index;
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {items.map((item, index) => (
                <motion.div
                    key={index}
                    className="border border-black/5 dark:border-white/10 rounded-lg overflow-hidden"
                    animate={{
                        backgroundColor: isExpanded(index) ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                    }}
                >
                    <motion.button
                        onClick={() => toggleItem(index)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
                        whileHover={{ paddingLeft: 20 }}
                    >
                        <span className="font-medium text-[var(--text)]">{item.title}</span>
                        <motion.div
                            animate={{ rotate: isExpanded(index) ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronDown size={20} className="text-[#D4AF37]" />
                        </motion.div>
                    </motion.button>

                    <AnimatePresence>
                        {isExpanded(index) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-t border-black/5 dark:border-white/10 px-4 py-3 text-sm text-[var(--text-secondary)]"
                            >
                                {item.content}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
    );
};
