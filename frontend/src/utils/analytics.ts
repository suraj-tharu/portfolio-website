/**
 * Analytics & Tracking Utilities
 * LogRocket and Hotjar have been disabled — CSP violations in production.
 * Re-enable only when valid API keys and proper CSP nonces are configured.
 */

// Minimal LogRocket interface to satisfy TypeScript
interface LogRocketInstance {
    init(appId: string): void;
    identify(uid: string, traits?: Record<string, unknown>): void;
    getSessionURL(callback: (url: string) => void): void;
    captureException(err: Error): void;
}

// Stub — disabled to prevent CSP violations
export const initLogRocket = (_userId?: string) => {
    // LogRocket is disabled — configure a valid app ID and CSP nonce to re-enable.
};

// Stub — disabled to prevent CSP violations
export const initHotjar = () => {
    // Hotjar is disabled — configure a valid site ID and CSP nonce to re-enable.
};

export function isObject(item: unknown): item is Record<string, unknown> {
    return item !== null && typeof item === 'object' && !Array.isArray(item);
}

// Track custom events (gracefully no-ops if gtag is absent)
export const trackEvent = (eventName: string, data?: Record<string, unknown>) => {
    try {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', eventName, data);
        }
    } catch {
        // silently ignore analytics errors
    }
};

// Track user interactions (clicks, form submissions, etc.)
export const trackUserInteraction = (action: string, target: string) => {
    trackEvent('user_interaction', {
        action,
        target,
        timestamp: new Date().toISOString()
    });
};

// Track page scroll depth
export const trackScrollDepth = () => {
    let maxScroll = 0;
    const handleScroll = () => {
        const scrollPercentage =
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercentage > maxScroll) {
            maxScroll = scrollPercentage;
            if ([25, 50, 75, 100].includes(Math.round(scrollPercentage))) {
                trackEvent('scroll_depth', { percentage: Math.round(scrollPercentage) });
            }
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
};

// Track time on page
export const trackTimeOnPage = () => {
    const startTime = Date.now();
    const handleBeforeUnload = () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', { seconds: timeSpent, page: window.location.pathname });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
};

// Track form interactions
export const trackFormInteraction = (formName: string, action: string) => {
    trackEvent('form_interaction', { form: formName, action, page: window.location.pathname });
};

// Setup analytics on app initialization — LogRocket/Hotjar are disabled
export const initializeAnalytics = (_options?: {
    enableLogRocket?: boolean;
    enableHotjar?: boolean;
    userId?: string;
}) => {
    trackScrollDepth();
    trackTimeOnPage();

    const handleExternalLinkClick = (e: MouseEvent) => {
        const target = e.target as HTMLAnchorElement;
        if (target.href && !target.href.includes(window.location.host)) {
            trackEvent('external_link_click', { url: target.href, text: target.textContent });
        }
    };
    document.addEventListener('click', handleExternalLinkClick);
    return () => document.removeEventListener('click', handleExternalLinkClick);
};

// Declare window types unique to this module
declare global {
    interface Window {
        LogRocket?: LogRocketInstance;
        __logRocketInitialized?: boolean;
        __hotjarInitialized?: boolean;
    }
}
