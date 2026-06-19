import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function VisitorCounter() {
    const [visitors, setVisitors] = useState(0);

    useEffect(() => {
        // Initialize visitor count from localStorage
        const storedVisitors = localStorage.getItem('portfolio-visitors');
        const currentVisitors = storedVisitors ? parseInt(storedVisitors, 10) : 0;
        const newVisitors = currentVisitors + 1;

        localStorage.setItem('portfolio-visitors', newVisitors.toString());
        setVisitors(newVisitors);
    }, []);

    if (!visitors) return null;

    return (
        <motion.div
            className="flex items-center gap-2 text-xs md:text-sm text-text-secondary/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex items-center gap-1">
                <span className="text-brand-light">👁️</span>
                <span>Visitors:</span>
            </div>
            <motion.span
                className="font-semibold text-brand-light"
                key={visitors}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                {visitors.toLocaleString()}
            </motion.span>
        </motion.div>
    );
}
