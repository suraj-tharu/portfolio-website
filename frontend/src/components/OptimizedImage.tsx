import { ImgHTMLAttributes, useState, useEffect, useRef } from 'react';
import { useLazyImage } from '../hooks/useIntersectionObserver';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    placeholder?: string;
    width?: number;
    height?: number;
    quality?: number;
    srcSet?: string;
    sizes?: string;
}

/**
 * Optimized image component with lazy loading and blur-up effect
 */
export default function OptimizedImage({
    src,
    alt,
    placeholder,
    width,
    height,
    quality = 75,
    srcSet,
    sizes,
    className = '',
    ...props
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const { imageSrc, isLoading } = useLazyImage(src, placeholder);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!imgRef.current) return;

        const img = imgRef.current;
        if (img.complete) {
            setIsLoaded(true);
        }
    }, [imageSrc]);

    return (
        <div
            className={`overflow-hidden ${className}`}
            style={{
                width: width ? `${width}px` : '100%',
                height: height ? `${height}px` : 'auto',
                aspectRatio: width && height ? `${width}/${height}` : undefined,
            }}
        >
            {/* Placeholder skeleton while loading */}
            {isLoading && !isLoaded && (
                <div className="w-full h-full bg-surface-2 animate-pulse" />
            )}

            {/* Main image */}
            <img
                ref={imgRef}
                src={imageSrc}
                alt={alt}
                srcSet={srcSet}
                sizes={sizes}
                loading="lazy"
                decoding="async"
                onLoad={() => setIsLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-300 ${isLoaded ? 'blur-up loaded' : 'blur-up'
                    }`}
                width={width}
                height={height}
                {...props}
            />
        </div>
    );
}

/**
 * Responsive image component with multiple resolutions
 */
export function ResponsiveImage({
    src,
    alt,
    sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw',
    className = '',
    ...props
}: OptimizedImageProps) {
    const baseUrl = src.split('.').slice(0, -1).join('.');
    const extension = src.split('.').pop();

    // Generate srcset with different resolutions
    const srcSet = `
    ${baseUrl}-320.${extension} 320w,
    ${baseUrl}-640.${extension} 640w,
    ${baseUrl}-1024.${extension} 1024w,
    ${baseUrl}-1920.${extension} 1920w
  `;

    return (
        <OptimizedImage
            src={src}
            alt={alt}
            srcSet={srcSet}
            sizes={sizes}
            className={className}
            {...props}
        />
    );
}

/**
 * Background image component with optimization
 */
export function OptimizedBackgroundImage({
    src,
    children,
    className = '',
}: {
    src: string;
    children: React.ReactNode;
    className?: string;
}) {
    const [bgImage, setBgImage] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            setBgImage(`url('${src}')`);
        };
    }, [src]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                backgroundImage: bgImage || undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {children}
        </div>
    );
}
