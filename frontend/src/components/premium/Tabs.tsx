// Tabs - Premium tabs component with smooth animations
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { ReactNode } from 'react';

interface TabItem {
    label: string;
    content: ReactNode;
    icon?: ReactNode;
}

interface TabsProps {
    items: TabItem[];
    defaultIndex?: number;
    className?: string;
    variant?: 'default' | 'pills' | 'underline';
}

export const Tabs = ({
    items,
    defaultIndex = 0,
    className = "",
    variant = 'default'
}: TabsProps) => {
    const [activeTab, setActiveTab] = useState(defaultIndex);

    return (
        <div className={className}>
            {/* Tab buttons */}
            <div className={`flex gap-2 mb-6 ${variant === 'underline' ? 'border-b border-white/10' : ''
                }`}>
                {items.map((item, index) => (
                    <motion.button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors relative
              ${activeTab === index ? 'text-[#D4AF37]' : 'text-[var(--text-secondary)] hover:text-[var(--text)]'}
              ${variant === 'pills' ? `${activeTab === index ? 'bg-[#D4AF37]/20' : 'hover:bg-white/5'}` : ''}
            `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {item.icon}
                        {item.label}
                        {activeTab === index && variant === 'underline' && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]"
                                layoutId="underline"
                            />
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Tab content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                {items[activeTab].content}
            </motion.div>
        </div>
    );
};
