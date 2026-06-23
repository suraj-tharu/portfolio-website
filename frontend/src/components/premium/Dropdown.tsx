// Dropdown - Premium dropdown menu component
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownItem {
    label: string;
    value: string;
    icon?: ReactNode;
}

interface DropdownProps {
    trigger: ReactNode;
    items: DropdownItem[];
    onSelect: (value: string) => void;
    className?: string;
}

export const Dropdown = ({
    trigger,
    items,
    onSelect,
    className = ""
}: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`relative inline-block ${className}`}>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-black/5 dark:border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {trigger}
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={16} />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute top-full mt-2 left-0 bg-[var(--bg)] border border-black/5 dark:border-white/10 rounded-lg shadow-xl overflow-hidden z-50 min-w-[200px]"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {items.map((item) => (
                            <motion.button
                                key={item.value}
                                onClick={() => {
                                    onSelect(item.value);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left"
                                whileHover={{ paddingLeft: 20 }}
                            >
                                {item.icon && <span className="text-[#D4AF37]">{item.icon}</span>}
                                <span className="text-[var(--text)]">{item.label}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
