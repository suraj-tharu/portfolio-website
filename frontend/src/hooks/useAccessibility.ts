import { useEffect, useRef } from 'react';

/**
 * Hook for managing ARIA live regions
 */
export function useAriaLive(
    message: string,
    polite: 'polite' | 'assertive' = 'polite',
    clear = true
) {
    const liveRegionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (liveRegionRef.current) {
            liveRegionRef.current.textContent = message;
            if (clear) {
                const timeout = setTimeout(() => {
                    if (liveRegionRef.current) {
                        liveRegionRef.current.textContent = '';
                    }
                }, 3000);
                return () => clearTimeout(timeout);
            }
        }
    }, [message, clear]);

    return { liveRegionRef, props: { role: 'status', 'aria-live': polite } };
}

/**
 * Hook for managing focus trap (for modals, dialogs)
 */
export function useFocusTrap(isOpen: boolean) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen || !containerRef.current) return;

        const focusableElements = containerRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        firstElement?.focus();
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    return containerRef;
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcut(key: string, callback: () => void, modifier: 'ctrl' | 'cmd' | 'alt' | 'shift' = 'ctrl') {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isModifierPressed =
                modifier === 'ctrl' ? e.ctrlKey :
                    modifier === 'cmd' ? e.metaKey :
                        modifier === 'alt' ? e.altKey :
                            modifier === 'shift' ? e.shiftKey : false;

            if (isModifierPressed && e.key.toLowerCase() === key.toLowerCase()) {
                e.preventDefault();
                callback();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [key, callback, modifier]);
}

/**
 * Hook for reduced motion preference
 */
export function usePrefersReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const listener = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
    }, []);

    return prefersReducedMotion;
}

/**
 * Hook for color scheme preference
 */
export function usePrefersColorScheme(): 'light' | 'dark' {
    const [scheme, setScheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setScheme(mediaQuery.matches ? 'dark' : 'light');

        const listener = (e: MediaQueryListEvent) => {
            setScheme(e.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
    }, []);

    return scheme;
}

/**
 * Generate unique ID for accessibility attributes
 */
export function useId(prefix = 'id'): string {
    const idRef = useRef<string | null>(null);

    if (idRef.current === null) {
        idRef.current = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    }

    return idRef.current;
}

/**
 * Skip to main content functionality
 */
export function useSkipToContent() {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab' && e.ctrlKey) {
                const skipLink = document.querySelector('a[href="#main-content"]') as HTMLAnchorElement;
                if (skipLink) {
                    skipLink.focus();
                    skipLink.click();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
}

// Import useState if not already imported
import { useState } from 'react';
