import React from 'react';
import { useProgressiveImage } from '../hooks/useLazyLoad';

interface ProgressiveImageProps {
    src: string;
    placeholder?: string;
    alt: string;
    className?: string;
    containerClassName?: string;
}

/**
 * Progressive Image Loading Component
 * Suggestion #3: Progressive Image Loading with blur-up LQIP effect
 */
export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
    src,
    placeholder,
    alt,
    className = '',
    containerClassName = ''
}) => {
    const { imageSrc, isLoading } = useProgressiveImage(src, placeholder);

    return (
        <div className={`relative overflow-hidden ${containerClassName}`}>
            <img
                src={imageSrc}
                alt={alt}
                className={`transition-all duration-500 ${isLoading ? 'blur-md scale-110' : 'blur-0 scale-100'
                    } ${className}`}
            />
        </div>
    );
};

export default ProgressiveImage;
