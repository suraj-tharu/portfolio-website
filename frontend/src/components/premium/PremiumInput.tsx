// PremiumInput - Enhanced text input with floating label and validation
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface PremiumInputProps {
    label: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    type?: string;
    error?: string;
    success?: boolean;
    className?: string;
    icon?: React.ReactNode;
}

export const PremiumInput = ({
    label,
    placeholder = "",
    value = "",
    onChange,
    type = "text",
    error,
    success,
    className = "",
    icon
}: PremiumInputProps) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setHasValue(!!newValue);
        onChange?.(newValue);
    };

    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]">{icon}</div>}
                <motion.input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={`w-full px-4 py-3 ${icon ? 'pl-12' : ''} bg-white/5 border border-white/10 rounded-lg outline-none transition-all
            ${error ? 'border-red-500/50' : success ? 'border-green-500/50' : 'border-white/10'}
            ${focused ? 'border-[#D4AF37] bg-white/10' : ''}
          `}
                    animate={{
                        boxShadow: focused ? `0 0 20px rgba(212, 175, 55, 0.2)` : 'none'
                    }}
                />
                <motion.label
                    className={`absolute left-4 transition-colors pointer-events-none ${icon ? 'left-12' : ''}`}
                    animate={{
                        y: focused || hasValue ? -24 : 10,
                        scale: focused || hasValue ? 0.85 : 1,
                        color: error ? '#ef4444' : success ? '#22c55e' : focused ? '#D4AF37' : '#9ca3af'
                    }}
                >
                    {label}
                </motion.label>
            </div>

            {/* Error message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-2 text-red-400 text-sm"
                >
                    <AlertCircle size={16} />
                    {error}
                </motion.div>
            )}

            {/* Success message */}
            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-2 text-green-400 text-sm"
                >
                    <Check size={16} />
                    Valid input
                </motion.div>
            )}
        </div>
    );
};
