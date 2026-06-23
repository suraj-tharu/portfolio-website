import { motion } from 'framer-motion';

export default function VisitorCounter() {
    return (
        <motion.div
            className="flex items-center gap-2 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <img 
              src="https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fsuraj-tharu-portfolio.com&countColor=%237B6EF6&style=flat-square" 
              alt="Global Visitor Count" 
              className="h-5 opacity-80 hover:opacity-100 transition-opacity"
            />
        </motion.div>
    );
}
