import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GreetingBanner() {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();
            const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
            setGreeting(greet);
        };

        // Initialize greeting immediately
        updateGreeting();

        // Update greeting every hour
        const interval = setInterval(updateGreeting, 3600000);
        return () => clearInterval(interval);
    }, []);

    if (!greeting) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center pt-6 px-4 pointer-events-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="text-center text-sm md:text-base text-text-secondary font-medium">
                {greeting} 👋
            </div>
        </motion.div>
    );
}
