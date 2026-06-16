import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
    count?: number;
}

export function SkeletonText({ className = 'h-4 w-full', count = 1 }: SkeletonProps) {
    return (
        <div className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    className={`${className} bg-surface-2 rounded animate-pulse`}
                    animate={{ opacity: [0.5, 0.7, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            ))}
        </div>
    );
}

export function SkeletonImage({ className = 'w-full h-48' }: SkeletonProps) {
    return (
        <motion.div
            className={`${className} bg-surface-2 rounded-lg animate-pulse`}
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
    );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <div className={`bg-surface border border-stroke rounded-lg p-6 space-y-4 ${className}`}>
            <SkeletonImage className="w-full h-32" />
            <SkeletonText count={3} />
            <motion.div
                className="h-10 w-24 bg-surface-2 rounded"
                animate={{ opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
        </div>
    );
}

export function SkeletonAvatar({ className = 'w-12 h-12' }: { className?: string }) {
    return (
        <motion.div
            className={`${className} bg-surface-2 rounded-full animate-pulse`}
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
    );
}

export function SkeletonCircle({ className = 'w-16 h-16' }: { className?: string }) {
    return (
        <motion.div
            className={`${className} bg-surface-2 rounded-full animate-pulse`}
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
    );
}

export function SkeletonButton({ className = 'h-10 w-32' }: { className?: string }) {
    return (
        <motion.div
            className={`${className} bg-surface-2 rounded animate-pulse`}
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
    );
}
