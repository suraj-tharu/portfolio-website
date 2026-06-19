import clsx from 'clsx';
import type { ReactNode } from 'react';

/* ═══════════════════════════════════════════════════════════
   PREMIUM GRADIENT SYSTEM
═══════════════════════════════════════════════════════════ */

const gradientPresets = {
    brand: 'from-violet-600 via-violet-500 to-violet-400',
    brandReverse: 'from-violet-400 to-violet-600',
    sunset: 'from-orange-500 via-red-500 to-pink-500',
    ocean: 'from-cyan-500 via-blue-500 to-indigo-600',
    forest: 'from-emerald-500 via-green-500 to-teal-500',
    midnight: 'from-slate-900 via-purple-900 to-slate-900',
    aurora: 'from-violet-500 via-pink-500 to-orange-400',
    cosmic: 'from-indigo-600 via-purple-500 to-pink-400',
    luxe: 'from-amber-400 via-orange-500 to-red-600',
    ethereal: 'from-cyan-300 via-blue-500 to-purple-600',
    blaze: 'from-red-600 via-orange-400 to-yellow-300',
    frost: 'from-slate-300 via-cyan-400 to-blue-500',
    subtleViolet: 'from-violet-950/50 to-violet-900/30',
    subtlePink: 'from-pink-950/50 to-red-900/30',
    subtleBlue: 'from-blue-950/50 to-cyan-900/30',
};

interface GradientBoxProps {
    children?: ReactNode;
    gradient: keyof typeof gradientPresets;
    className?: string;
    intensity?: 'light' | 'medium' | 'strong';
    animated?: boolean;
    borderGradient?: boolean;
}

export const GradientBox = ({
    children,
    gradient,
    className = '',
    intensity = 'medium',
    animated = false,
    borderGradient = false,
}: GradientBoxProps) => {
    const intensityClasses = {
        light: 'opacity-60',
        medium: 'opacity-100',
        strong: 'opacity-100',
    };

    return (
        <div
            className={clsx(
                'bg-gradient-to-br',
                gradientPresets[gradient],
                intensityClasses[intensity],
                animated && 'animate-gradient-shift',
                borderGradient && 'p-px rounded-lg bg-gradient-to-br from-violet-500 to-pink-500',
                className
            )}
        >
            {borderGradient && (
                <div className="bg-surface rounded-lg p-6">{children}</div>
            )}
            {!borderGradient && children}
        </div>
    );
};

interface GradientTextProps {
    text: string;
    gradient: keyof typeof gradientPresets;
    size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    weight?: 'normal' | 'semibold' | 'bold';
    className?: string;
    animated?: boolean;
}

export const GradientTextComponent = ({
    text,
    gradient,
    size = 'lg',
    weight = 'bold',
    className = '',
    animated = false,
}: GradientTextProps) => {
    const sizeClasses = {
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
    };

    return (
        <span
            className={clsx(
                'bg-gradient-to-r',
                gradientPresets[gradient],
                'bg-clip-text text-transparent',
                sizeClasses[size],
                `font-${weight}`,
                animated && 'animate-gradient-shift',
                className
            )}
        >
            {text}
        </span>
    );
};

interface GradientBorderProps {
    children: ReactNode;
    gradient: keyof typeof gradientPresets;
    borderRadius?: string;
    className?: string;
}

export const GradientBorder = ({
    children,
    gradient,
    borderRadius = 'rounded-lg',
    className = '',
}: GradientBorderProps) => (
    <div
        className={clsx(
            `bg-gradient-to-r ${gradientPresets[gradient]} p-px ${borderRadius}`,
            className
        )}
    >
        <div className={`bg-surface ${borderRadius} p-6`}>{children}</div>
    </div>
);

interface GradientButtonProps {
    children: ReactNode;
    gradient: keyof typeof gradientPresets;
    onClick?: () => void;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
}

const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
};

export const GradientButton = ({
    children,
    gradient,
    onClick,
    className = '',
    size = 'md',
    disabled = false,
}: GradientButtonProps) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={clsx(
            `bg-gradient-to-r ${gradientPresets[gradient]}`,
            'text-white font-semibold rounded-lg',
            'transition-all duration-300 hover:shadow-lg hover:scale-105',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
            sizeClasses[size],
            className
        )}
    >
        {children}
    </button>
);

interface GradientBgProps {
    children: ReactNode;
    gradient: keyof typeof gradientPresets;
    opacity?: number;
    className?: string;
}

export const GradientBackground = ({
    children,
    gradient,
    opacity = 0.1,
    className = '',
}: GradientBgProps) => (
    <div
        className={clsx(`bg-gradient-to-br ${gradientPresets[gradient]}`, className)}
        style={{ opacity }}
    >
        {children}
    </div>
);

export const PaletteExample = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(gradientPresets).map(([name, classes]) => (
            <div key={name} className="flex flex-col gap-2">
                <div
                    className={clsx(
                        `bg-gradient-to-br ${classes}`,
                        'h-24 rounded-lg border border-stroke',
                        'flex items-end justify-end p-3'
                    )}
                >
                    <span className="text-xs font-semibold text-white drop-shadow">{name}</span>
                </div>
            </div>
        ))}
    </div>
);

interface AnimatedGradientBgProps {
    children: ReactNode;
    colors?: string[];
    className?: string;
    duration?: number;
}

export const AnimatedGradientBackground = ({
    children,
    colors = ['#8B5CF6', '#EC4899', '#F59E0B'],
    className = '',
    duration = 8,
}: AnimatedGradientBgProps) => {
    const gradientString = colors.join(', ');

    return (
        <div
            className={clsx('animate-gradient-shift', className)}
            style={{
                background: `linear-gradient(-45deg, ${gradientString})`,
                backgroundSize: '400% 400%',
                animation: `gradient-shift ${duration}s ease infinite`,
            }}
        >
            {children}
        </div>
    );
};

interface GradientMeshProps {
    children?: ReactNode;
    className?: string;
}

export const GradientMesh = ({ children, className = '' }: GradientMeshProps) => (
    <div className={clsx('relative overflow-hidden', className)}>
        <div className="absolute inset-0">
            <div
                className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
                style={{ animation: 'blob 7s infinite' }}
            />
            <div
                className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
                style={{ animation: 'blob 7s infinite 2s' }}
            />
            <div
                className="absolute bottom-0 left-1/3 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
                style={{ animation: 'blob 7s infinite 4s' }}
            />
        </div>
        <div className="relative z-10">{children}</div>
    </div>
);

interface DualGradientProps {
    children: ReactNode;
    className?: string;
}

export const DualGradient = ({ children, className = '' }: DualGradientProps) => (
    <div
        className={clsx(className)}
        style={{
            background: `linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)`,
        }}
    >
        {children}
    </div>
);

export default {
    GradientBox,
    GradientTextComponent,
    GradientBorder,
    GradientButton,
    GradientBackground,
    AnimatedGradientBackground,
    GradientMesh,
    DualGradient,
    PaletteExample,
    gradientPresets,
};
