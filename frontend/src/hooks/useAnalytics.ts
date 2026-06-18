import { useEffect } from 'react';

interface AnalyticsConfig {
    trackingId?: string;
    debug?: boolean;
}

interface WebVitalMetric {
    name: string;
    value: number;
}

type WebVitalsLib = {
    onFCP: (cb: (m: WebVitalMetric) => void) => void;
    onLCP: (cb: (m: WebVitalMetric) => void) => void;
    onCLS: (cb: (m: WebVitalMetric) => void) => void;
    onTTFB: (cb: (m: WebVitalMetric) => void) => void;
    onINP?: (cb: (m: WebVitalMetric) => void) => void;
};

// Type augmentation for third-party globals
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataLayer: any[];
        gtag?: (...args: unknown[]) => void;
        webVitals?: WebVitalsLib;
        hj?: ((...args: unknown[]) => void) & { q?: unknown[]; };
        _hjSettings?: { hjid: number; hjsv: number };
        clarity?: ((...args: unknown[]) => void) & { q?: unknown[][]; };
    }
}

/**
 * Google Analytics 4 initialization and tracking.
 * Set VITE_GA_TRACKING_ID in your .env file.
 */
export function useGoogleAnalytics(config?: AnalyticsConfig) {
    const trackingId = config?.trackingId || import.meta.env.VITE_GA_TRACKING_ID || 'G-XXXXXXXXXX';
    const debug = config?.debug || false;

    useEffect(() => {
        // Prevent duplicate injection on hot-reload
        const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`);
        if (existingScript) return;

        // Initialize GA4
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(trackingId)}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.gtag = function (...args: any[]) {
            window.dataLayer.push(args);
        };
        window.gtag('js', new Date());
        window.gtag('config', trackingId, {
            debug_mode: debug,
            send_page_view: true,
        });
    }, [trackingId, debug]);
}

/**
 * Track custom events
 */
export function trackEvent(
    eventName: string,
    eventData?: Record<string, unknown>
) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', eventName, eventData);
    }
}

/**
 * Track page views
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', {
            page_path: pagePath,
            page_title: pageTitle || document.title,
        });
    }
}

/**
 * Track conversions
 */
export function trackConversion(conversionName: string, value?: number) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', conversionName, {
            value: value ?? 1,
            currency: 'USD',
        });
    }
}

/**
 * Web Vitals tracking for Core Web Vitals.
 * Loads web-vitals from CDN only once.
 */
export function useWebVitals() {
    useEffect(() => {
        // Prevent duplicate injection
        const existing = document.querySelector('script[src*="web-vitals"]');
        if (existing) return;

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/web-vitals@3/dist/web-vitals.iife.js';
        script.onload = () => {
            const vitals = window.webVitals;
            if (!vitals) return;

            const report = (name: string) => (metric: WebVitalMetric) =>
                trackEvent(`web_vital_${name}`, { value: Math.round(metric.value * 1000) / 1000, label: metric.name });

            vitals.onFCP(report('fcp'));
            vitals.onLCP(report('lcp'));
            vitals.onCLS(report('cls'));
            vitals.onTTFB(report('ttfb'));
            vitals.onINP?.(report('inp'));
        };
        document.head.appendChild(script);
    }, []);
}

/**
 * Heatmap tracking — uses script.src (not innerHTML) to prevent XSS.
 * trackingId is validated as a numeric ID before use.
 */
export function useHeatmapTracking(trackingId: string, service: 'hotjar' | 'clarity' = 'hotjar') {
    useEffect(() => {
        // Validate trackingId is numeric to prevent injection
        const numericId = parseInt(trackingId, 10);
        if (isNaN(numericId)) {
            if (import.meta.env.DEV) {
                console.warn('[Analytics] Invalid heatmap trackingId — must be numeric.');
            }
            return;
        }

        if (service === 'hotjar') {
            // Prevent duplicate injection
            if (document.querySelector('script[src*="hotjar.com"]')) return;

            // Initialize Hotjar queue safely — no user-controlled strings in innerHTML
            window.hj = window.hj || Object.assign(
                function (...args: unknown[]) { window.hj!.q = window.hj!.q || []; window.hj!.q.push(args); },
                { q: [] as unknown[] }
            );
            window._hjSettings = { hjid: numericId, hjsv: 6 };

            const script = document.createElement('script');
            script.async = true;
            // numericId is a validated integer — safe to interpolate
            script.src = `https://static.hotjar.com/c/hotjar-${numericId}.js?sv=6`;
            document.head.appendChild(script);

        } else if (service === 'clarity') {
            // Prevent duplicate injection
            if (document.querySelector('script[src*="clarity.ms"]')) return;

            type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][]; };
            const clarityFn: ClarityFn = window.clarity || Object.assign(
                function (...args: unknown[]) {
                    clarityFn.q = clarityFn.q || [];
                    clarityFn.q.push(args);
                },
                { q: [] as unknown[][] }
            );
            window.clarity = clarityFn;

            const script = document.createElement('script');
            script.async = true;
            // encodeURIComponent ensures the id is URL-safe
            script.src = `https://www.clarity.ms/tag/${encodeURIComponent(String(numericId))}`;
            document.head.appendChild(script);
        }
    }, [trackingId, service]);
}
