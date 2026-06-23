import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Mail, Phone, X } from 'lucide-react';
import { openChatWidget } from './chatWidgetEvents';

/**
 * Floating Action Button Component
 * Suggestion #9: Floating Action Button (FAB)
 */
export default function FloatingActionButton() {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        {
            icon: MessageCircle,
            label: 'Chat',
            color: 'bg-blue-500',
            href: '#chat',
            action: () => {
                openChatWidget();
            }
        },
        {
            icon: Mail,
            label: 'Email',
            color: 'bg-red-500',
            href: 'mailto:suraj@example.com'
        },
        {
            icon: Phone,
            label: 'Call',
            color: 'bg-green-500',
            href: 'tel:+977-1234567890'
        }
    ];

    return (
        <div
            className="pointer-events-none"
            style={{
                position: 'fixed',
                bottom: '6rem',
                right: '2rem',
                zIndex: 198
            }}
            role="region"
            aria-label="Quick contact actions menu"
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-24 right-0 flex flex-col gap-4 pointer-events-auto"
                        role="menu"
                        aria-label="Contact options menu"
                    >
                        {menuItems.map((item, index) => (
                            <motion.a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => {
                                    if (item.action) {
                                        e.preventDefault();
                                        item.action();
                                    }
                                }}
                                initial={{ scale: 0, y: 20, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0, y: 20, opacity: 0 }}
                                transition={{ delay: index * 0.08, type: 'spring', stiffness: 300, damping: 20 }}
                                className={`w-14 h-14 rounded-full ${item.color} flex items-center justify-center text-text-primary dark:text-white shadow-lg hover:shadow-xl hover:scale-110 group relative pointer-events-auto cursor-pointer transition-shadow duration-200`}
                                title={item.label}
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                role="menuitem"
                                aria-label={item.label}
                            >
                                <item.icon size={24} />
                                <motion.span
                                    className="absolute right-full mr-3 bg-surface dark:bg-gray-900 text-text-primary dark:text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 0, x: 10 }}
                                    whileHover={{ opacity: 1, x: 0 }}
                                >
                                    {item.label}
                                </motion.span>
                            </motion.a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main FAB Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                initial={false}
                animate={isOpen ? 'open' : 'closed'}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-brand-light to-brand-dark flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 pointer-events-auto cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                aria-label={isOpen ? 'Close quick contact menu' : 'Open quick contact menu'}
                title="Quick contact actions"
                role="button"
                aria-expanded={isOpen}
                aria-controls="fab-menu"
            >
                <motion.div
                    animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
                    transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
                >
                    {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
                </motion.div>
            </motion.button>

            {/* Notification Badge (optional) */}
            <motion.div
                className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-text-primary dark:text-white text-xs font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                aria-label="3 unread messages"
            >
                3
            </motion.div>
        </div>
    );
}
