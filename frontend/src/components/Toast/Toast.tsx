import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    onClose: () => void;
}

const toastConfig = {
    success: {
        bgColor: 'bg-emerald-500/20',
        borderColor: 'border-emerald-500/30',
        textColor: 'text-emerald-100',
        icon: CheckCircle,
        accentColor: 'bg-emerald-500',
    },
    error: {
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30',
        textColor: 'text-red-100',
        icon: AlertCircle,
        accentColor: 'bg-red-500',
    },
    info: {
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/30',
        textColor: 'text-blue-100',
        icon: Info,
        accentColor: 'bg-blue-500',
    },
    warning: {
        bgColor: 'bg-amber-500/20',
        borderColor: 'border-amber-500/30',
        textColor: 'text-amber-100',
        icon: AlertTriangle,
        accentColor: 'bg-amber-500',
    },
};

export default function Toast({ id, type, message, onClose }: ToastProps) {
    const config = toastConfig[type];
    const Icon = config.icon;

    return (
        <motion.div
            key={id}
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`
        pointer-events-auto
        flex items-start gap-3
        ${config.bgColor} 
        ${config.borderColor}
        border rounded-lg p-4
        backdrop-blur-md
        max-w-sm
        shadow-lg
        group
      `}
        >
            <div className="flex-shrink-0 mt-1">
                <Icon className={`w-5 h-5 ${config.textColor}`} />
            </div>

            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${config.textColor} break-words`}>
                    {message}
                </p>
            </div>

            <button
                onClick={onClose}
                className={`
          flex-shrink-0 mt-0.5
          text-current opacity-60 hover:opacity-100
          transition-opacity duration-200
          p-1
        `}
                aria-label="Close notification"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Progress bar */}
            <motion.div
                className={`absolute bottom-0 left-0 h-1 ${config.accentColor}`}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
                onAnimationComplete={onClose}
            />
        </motion.div>
    );
}
