import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, FileText, Mail, Settings, Code2, Linkedin as LinkedinIcon } from 'lucide-react';
import { useKeyboardShortcut } from '../hooks/useAccessibility';

interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon: React.ReactNode;
    action: () => void;
    category?: string;
}

const commands: CommandItem[] = [
    {
        id: 'home',
        label: 'Go Home',
        icon: <Home size={18} />,
        action: () => window.location.href = '/',
        category: 'Navigation',
    },
    {
        id: 'about',
        label: 'About Me',
        icon: <FileText size={18} />,
        action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }),
        category: 'Navigation',
    },
    {
        id: 'contact',
        label: 'Contact',
        icon: <Mail size={18} />,
        action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }),
        category: 'Navigation',
    },
    {
        id: 'github',
        label: 'GitHub',
        icon: <Code2 size={18} />,
        action: () => window.open('https://github.com/surajchaudhary', '_blank'),
        category: 'Social',
    },
    {
        id: 'linkedin',
        label: 'LinkedIn',
        icon: <LinkedinIcon size={18} />,
        action: () => window.open('https://linkedin.com/in/surajchaudhary', '_blank'),
        category: 'Social',
    },
    {
        id: 'theme-toggle',
        label: 'Toggle Theme',
        icon: <Settings size={18} />,
        action: () => {
            const event = new CustomEvent('toggleTheme');
            window.dispatchEvent(event);
        },
        category: 'Settings',
    },
];

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [filtered, setFiltered] = useState(commands);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useKeyboardShortcut('k', () => setIsOpen(true), 'ctrl');

    useEffect(() => {
        const filtered = commands.filter((cmd) =>
            cmd.label.toLowerCase().includes(query.toLowerCase()) ||
            cmd.description?.toLowerCase().includes(query.toLowerCase())
        );
        setFiltered(filtered);
        setSelectedIndex(0);
    }, [query]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape':
                    setIsOpen(false);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev + 1) % filtered.length);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (filtered[selectedIndex]) {
                        filtered[selectedIndex].action();
                        setIsOpen(false);
                        setQuery('');
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filtered, selectedIndex]);

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 z-[8000] hidden md:flex items-center gap-2 px-4 py-2.5 bg-surface/80 backdrop-blur-md border border-stroke rounded-lg hover:border-stroke-strong transition-colors group"
                aria-label="Open command palette"
            >
                <Search size={16} className="text-muted" />
                <span className="text-sm text-muted">Cmd + K</span>
            </button>

            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-[8999] bg-black/50 backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9000] w-full max-w-md"
                    >
                        <div className="bg-surface border border-stroke rounded-lg shadow-2xl overflow-hidden">
                            {/* Search Input */}
                            <div className="p-4 border-b border-stroke flex items-center gap-3">
                                <Search size={20} className="text-muted flex-shrink-0" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search commands..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder-muted"
                                />
                            </div>

                            {/* Command List */}
                            <div className="max-h-96 overflow-y-auto">
                                {filtered.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <p className="text-muted text-sm">No commands found</p>
                                    </div>
                                ) : (
                                    <div className="p-2">
                                        {filtered.map((cmd, index) => (
                                            <motion.button
                                                key={cmd.id}
                                                onClick={() => {
                                                    cmd.action();
                                                    setIsOpen(false);
                                                    setQuery('');
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${index === selectedIndex
                                                        ? 'bg-brand-500/20 text-text-primary'
                                                        : 'text-text-secondary hover:bg-surface-2'
                                                    }`}
                                                onHoverStart={() => setSelectedIndex(index)}
                                            >
                                                <span className="text-brand-light flex-shrink-0">{cmd.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium truncate">{cmd.label}</div>
                                                    {cmd.description && (
                                                        <div className="text-xs text-muted truncate">{cmd.description}</div>
                                                    )}
                                                </div>
                                                {cmd.category && (
                                                    <span className="text-xs bg-surface-2 px-2 py-1 rounded text-muted flex-shrink-0">
                                                        {cmd.category}
                                                    </span>
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-3 bg-surface-2 border-t border-stroke text-xs text-muted flex items-center justify-between">
                                <div className="flex gap-3">
                                    <span>↑↓ Navigate</span>
                                    <span>⏎ Select</span>
                                    <span>ESC Close</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
