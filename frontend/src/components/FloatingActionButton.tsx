import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Mail, Phone, X } from 'lucide-react';

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
                const chatWidget = document.querySelector('[data-chat-widget]');
                if (chatWidget) chatWidget.dispatchEvent(new CustomEvent('open'));
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
        <div className="fixed bottom-8 right-8 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-24 right-0 flex flex-col gap-4"
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
                                initial={{ scale: 0, y: 10 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0, y: 10 }}
                                transition={{ delay: index * 0.05 }}
                                className={`w-14 h-14 rounded-full ${item.color} flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 group relative`}
                                title={item.label}
                            >
                                <item.icon size={24} />
                                <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                    {item.label}
                                </span>
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
                className="w-16 h-16 rounded-full bg-gradient-to-r from-brand-light to-brand-dark flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <motion.div
                    animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
                </motion.div>
            </motion.button>

            {/* Notification Badge (optional) */}
            <motion.div
                className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
            >
                3
            </motion.div>
        </div>
    );
}
