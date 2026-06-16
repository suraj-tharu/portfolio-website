// FloatingNav - Floating navigation menu with smart scroll behavior
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavLink {
    label: string;
    href: string;
    icon?: React.ReactNode;
}

interface FloatingNavProps {
    links: NavLink[];
    position?: 'top' | 'bottom';
    className?: string;
}

export const FloatingNav = ({
    links,
    position = 'top',
    className = ""
}: FloatingNavProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (position === 'top') {
                // Hide when scrolling down, show when scrolling up
                setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
            } else {
                // Show when scrolling down
                setIsVisible(currentScrollY > lastScrollY + 50 || currentScrollY < 100);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, position]);

    return (
        <motion.nav
            className={`fixed ${position === 'top' ? 'top-6' : 'bottom-6'} left-1/2 -translate-x-1/2 z-40 ${className}`}
            animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : (position === 'top' ? -50 : 50)
            }}
            transition={{ duration: 0.3 }}
        >
            {/* Desktop Menu */}
            <div className="hidden sm:flex bg-[var(--bg)]/80 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 gap-6">
                {links.map((link) => (
                    <motion.a
                        key={link.label}
                        href={link.href}
                        className="text-sm font-medium text-[var(--text)] hover:text-[#D4AF37] transition-colors duration-200 flex items-center gap-2"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {link.icon}
                        {link.label}
                    </motion.a>
                ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
                className="sm:hidden fixed right-6 bg-[#D4AF37] text-black p-3 rounded-full shadow-lg z-50"
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.9 }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                            <X size={24} />
                        </motion.div>
                    ) : (
                        <motion.div key="open" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                            <Menu size={24} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="sm:hidden fixed inset-0 top-20 bg-[var(--bg)]/95 backdrop-blur-xl z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="flex flex-col items-center justify-center gap-6 py-12">
                            {links.map((link, i) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    className="text-2xl font-semibold text-[#D4AF37] hover:text-white transition-colors"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};
