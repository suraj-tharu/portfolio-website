// EnhancedThemeToggle - Premium theme switcher with color preview
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export const EnhancedThemeToggle = ({ className = "" }: { className?: string }) => {
    const [isDark, setIsDark] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const themes = [
        { name: 'dark', colors: ['#0a0a0a', '#1a1a1a', '#D4AF37'], icon: Moon },
        { name: 'light', colors: ['#f5f5f5', '#ffffff', '#D4AF37'], icon: Sun },
        { name: 'midnight', colors: ['#001a33', '#0033cc', '#00ffff'], icon: Moon },
        { name: 'aurora', colors: ['#1a0033', '#ff00ff', '#00ffff'], icon: Sun }
    ];

    const handleThemeChange = (theme: typeof themes[0]) => {
        setIsDark(theme.name === 'dark' || theme.name === 'midnight');
        document.documentElement.classList.toggle('dark', !isDark);

        // Apply theme colors
        const root = document.documentElement;
        root.style.setProperty('--bg', theme.colors[0]);
        root.style.setProperty('--accent', theme.colors[2]);

        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`}>
            {/* Theme Toggle Button */}
            <motion.button
                className="p-3 rounded-full bg-[var(--bg)]/50 backdrop-blur-xl border border-black/5 dark:border-white/10 hover:border-[#D4AF37]/30 transition-all"
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.9 }}
            >
                <AnimatePresence mode="wait">
                    {isDark ? (
                        <motion.div key="moon" initial={{ rotate: -180, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 180, opacity: 0 }}>
                            <Moon size={20} className="text-[#D4AF37]" />
                        </motion.div>
                    ) : (
                        <motion.div key="sun" initial={{ rotate: -180, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 180, opacity: 0 }}>
                            <Sun size={20} className="text-[#D4AF37]" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Theme Selector */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute top-full mt-2 right-0 bg-[var(--bg)]/80 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl p-4 shadow-2xl"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <div className="grid grid-cols-2 gap-3">
                            {themes.map((theme) => (
                                <motion.button
                                    key={theme.name}
                                    onClick={() => handleThemeChange(theme)}
                                    className="p-3 rounded-lg hover:bg-white/10 transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex gap-1">
                                            {theme.colors.map((color, i) => (
                                                <div
                                                    key={i}
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs capitalize text-[var(--text)]">{theme.name}</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
