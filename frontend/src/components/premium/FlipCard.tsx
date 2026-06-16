// FlipCard - 3D flip card component
import { motion } from 'framer-motion';
import { useState } from 'react';


interface FlipCardProps {
    frontContent: React.ReactNode;
    backContent: React.ReactNode;
    className?: string;
}

export const FlipCard = ({ frontContent, backContent, className = "" }: FlipCardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <motion.div
            className={`h-80 cursor-pointer perspective ${className}`}
            onClick={() => setIsFlipped(!isFlipped)}
            initial={false}
        >
            <motion.div
                className="relative w-full h-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
            >
                {/* Front */}
                <motion.div
                    className="absolute w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 
            border border-white/20 backdrop-blur-xl rounded-2xl p-6 flex items-center justify-center"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    {frontContent}
                </motion.div>

                {/* Back */}
                <motion.div
                    className="absolute w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 
            border border-white/20 backdrop-blur-xl rounded-2xl p-6 flex items-center justify-center"
                    style={{ backfaceVisibility: "hidden", rotateY: 180 }}
                >
                    {backContent}
                </motion.div>
            </motion.div>
        </motion.div>
    );
};
