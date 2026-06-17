import React from 'react';

interface GlassmorphicProps {
    children: React.ReactNode;
    className?: string;
    blur?: 'sm' | 'md' | 'lg' | 'xl';
    opacity?: 'low' | 'medium' | 'high';
}

/**
 * Glassmorphism Component
 * Suggestion #10: Glassmorphism Effects
 */
export const Glassmorphic: React.FC<GlassmorphicProps> = ({
    children,
    className = '',
    blur = 'md',
    opacity = 'medium'
}) => {
    const blurValues = {
        sm: 'backdrop-blur-sm',
        md: 'backdrop-blur-md',
        lg: 'backdrop-blur-lg',
        xl: 'backdrop-blur-xl'
    };

    const opacityValues = {
        low: 'bg-white/5 dark:bg-white/5',
        medium: 'bg-white/10 dark:bg-white/10',
        high: 'bg-white/20 dark:bg-white/20'
    };

    return (
        <div
            className={`
        ${blurValues[blur]}
        ${opacityValues[opacity]}
        border border-white/20 dark:border-white/10
        rounded-2xl
        transition-all duration-300
        hover:border-white/40 dark:hover:border-white/20
        ${className}
      `}
        >
            {children}
        </div>
    );
};

/**
 * Glassmorphic Card Component
 */
export const GlassmorphicCard: React.FC<{
    title?: string;
    children: React.ReactNode;
    className?: string;
}> = ({ title, children, className = '' }) => {
    return (
        <Glassmorphic className={`p-6 md:p-8 ${className}`}>
            {title && (
                <h3 className="text-xl font-semibold mb-4 dark:text-text-primary text-gray-900">
                    {title}
                </h3>
            )}
            {children}
        </Glassmorphic>
    );
};

/**
 * Glassmorphic Button
 */
export const GlassmorphicButton: React.FC<
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        children: React.ReactNode;
    }
> = ({ children, className = '', ...props }) => {
    return (
        <button
            className={`
        px-6 py-3
        backdrop-blur-md
        bg-white/10 dark:bg-white/10
        border border-white/20 dark:border-white/10
        rounded-lg
        font-semibold
        text-white
        hover:bg-white/20 dark:hover:bg-white/20
        hover:border-white/40 dark:hover:border-white/20
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2
        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
};

export default Glassmorphic;
