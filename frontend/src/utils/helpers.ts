/**
 * Debounce function to limit function calls
 * Used for search, resize events, etc.
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit function calls
 * Used for scroll, mouse movement, etc.
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Request animation frame throttle
 * More efficient for animation-related throttling
 */
export function rafThrottle<T extends (...args: any[]) => any>(
    func: T
): (...args: Parameters<T>) => void {
    let animationFrameId: number | null = null;

    return function executedFunction(...args: Parameters<T>) {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
        }

        animationFrameId = requestAnimationFrame(() => {
            func(...args);
            animationFrameId = null;
        });
    };
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as any;
    if (obj instanceof Array) {
        return obj.map((item) => deepClone(item)) as any;
    }
    if (obj instanceof Object) {
        const clonedObj = {} as T;
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
    return obj;
}

/**
 * Merge objects deeply
 */
export function deepMerge<T extends Record<string, any>>(
    target: T,
    ...sources: Partial<T>[]
): T {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                deepMerge(target[key] as any, source[key] as any);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return deepMerge(target, ...sources);
}

function isObject(item: any): item is Record<string, any> {
    return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    initialDelay = 1000
): Promise<T> {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            const delay = initialDelay * Math.pow(2, i);
            if (i < maxRetries - 1) {
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError || new Error('Max retries exceeded');
}

/**
 * Check if device is touch-enabled
 */
export function isTouchDevice(): boolean {
    return (
        typeof window !== 'undefined' &&
        (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.maxTouchPoints > 0))
    );
}

/**
 * Check if browser supports specific feature
 */
export function supportsFeature(feature: string): boolean {
    const features: Record<string, () => boolean> = {
        backdrop: () => CSS.supports('backdrop-filter', 'blur(10px)'),
        webp: () => {
            const canvas = document.createElement('canvas');
            return canvas.toDataURL('image/webp').includes('image/webp');
        },
        scrollBehavior: () => CSS.supports('scroll-behavior', 'smooth'),
        grid: () => CSS.supports('display', 'grid'),
        flex: () => CSS.supports('display', 'flex'),
        css3: () => document.documentElement.style.setProperty !== undefined,
    };

    return features[feature] ? features[feature]() : false;
}

/**
 * Get scroll position
 */
export function getScrollPosition(): { x: number; y: number } {
    return {
        x: window.scrollX || document.documentElement.scrollLeft || 0,
        y: window.scrollY || document.documentElement.scrollTop || 0,
    };
}

/**
 * Scroll to element smoothly
 */
export function scrollToElement(element: HTMLElement, behavior: 'smooth' | 'auto' = 'smooth') {
    element.scrollIntoView({ behavior, block: 'start' });
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }

        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}
