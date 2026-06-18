/**
 * Analytics & Heatmap Integration
 * Suggestion #19: Analytics & Heatmap Integration
 * Integrates with LogRocket and Hotjar for user behavior tracking
 */

// Minimal LogRocket interface to satisfy TypeScript
interface LogRocketInstance {
    init(appId: string): void;
    identify(uid: string, traits?: Record<string, unknown>): void;
    getSessionURL(callback: (url: string) => void): void;
    captureException(err: Error): void;
}

// Initialize LogRocket
export const initLogRocket = (userId?: string) => {
    if (typeof window !== 'undefined' && !window.__logRocketInitialized) {
        try {
            const script = document.createElement('script');
            script.src = 'https://cdn.lr-ingest.com/LogRocket.min.js';
            script.onload = () => {
                if (window.LogRocket) {
                    window.LogRocket.init('your-logrocket-id');

                    if (userId) {
                        window.LogRocket.identify(userId, {
                            name: 'User Name',
                            email: 'user@example.com'
                        });
                    }

                    window.LogRocket.getSessionURL((_sessionURL: string) => {
                        // Session URL captured — available via LogRocket dashboard
                    });

                    window.__logRocketInitialized = true;
                }
            };
            document.head.appendChild(script);
        } catch (error) {
            console.error('Failed to initialize LogRocket:', error);
        }
    }
};

// Initialize Hotjar
export const initHotjar = () => {
    if (typeof window !== 'undefined' && !window.__hotjarInitialized) {
        try {
            // Initialize Hotjar queue function on window
            if (!window.hj) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                window.hj = function (...args: any[]) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (window.hj!.q = window.hj!.q || []).push(args as any);
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (window.hj as any).q = [];
            }

            const hjsTag = document.createElement('script');
            hjsTag.async = true;
            hjsTag.src = 'https://static.hotjar.com/c/hotjar-2109999.js?sv=6';
            document.head.appendChild(hjsTag);

            window.__hotjarInitialized = true;
        } catch (error) {
            console.error('Failed to initialize Hotjar:', error);
        }
    }
};

export function isObject(item: unknown): item is Record<string, unknown> {
    return item !== null && typeof item === 'object' && !Array.isArray(item);
}

// Track custom events
export const trackEvent = (eventName: string, data?: Record<string, unknown>) => {
    try {
        if (window.gtag) {
            window.gtag('event', eventName, data);
        }

        // Event tracking recorded — accessible via analytics dashboard
    } catch (error) {
        console.error('Error tracking event:', error);
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
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) *
            100;

        if (scrollPercentage > maxScroll) {
            maxScroll = scrollPercentage;

            // Track milestones
            if (
                [25, 50, 75, 100].includes(Math.round(scrollPercentage))
            ) {
                trackEvent('scroll_depth', {
                    percentage: Math.round(scrollPercentage)
                });
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
        trackEvent('time_on_page', {
            seconds: timeSpent,
            page: window.location.pathname
        });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
};

// Track form interactions
export const trackFormInteraction = (formName: string, action: string) => {
    trackEvent('form_interaction', {
        form: formName,
        action, // 'started', 'completed', 'abandoned'
        page: window.location.pathname
    });
};

// Setup analytics on app initialization
export const initializeAnalytics = (options?: {
    enableLogRocket?: boolean;
    enableHotjar?: boolean;
    userId?: string;
}) => {
    const {
        enableLogRocket = true,
        enableHotjar = true,
        userId
    } = options || {};

    if (enableLogRocket) {
        initLogRocket(userId);
    }

    if (enableHotjar) {
        initHotjar();
    }

    // Track scroll depth
    trackScrollDepth();

    // Track time on page
    trackTimeOnPage();

    // Track clicks on external links
    const handleExternalLinkClick = (e: MouseEvent) => {
        const target = e.target as HTMLAnchorElement;
        if (target.href && target.href.includes(window.location.host) === false) {
            trackEvent('external_link_click', {
                url: target.href,
                text: target.textContent
            });
        }
    };

    document.addEventListener('click', handleExternalLinkClick);

    return () => {
        document.removeEventListener('click', handleExternalLinkClick);
    };
};

// Declare window types for analytics
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        gtag?: (...args: any[]) => void;
        LogRocket?: LogRocketInstance;
        __logRocketInitialized?: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hj?: ((...args: any[]) => void) & { q?: unknown[][] };
        __hotjarInitialized?: boolean;
    }
}
