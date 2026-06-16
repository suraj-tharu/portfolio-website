import { useEffect } from 'react';

interface AnalyticsConfig {
    trackingId?: string;
    debug?: boolean;
}

/**
 * Google Analytics 4 initialization and tracking
 * Replace with your own GA4 tracking ID
 */
export function useGoogleAnalytics(config?: AnalyticsConfig) {
    const trackingId = config?.trackingId || 'G-XXXXXXXXXX'; // Replace with your GA4 ID
    const debug = config?.debug || false;

    useEffect(() => {
        // Initialize GA4
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) {
            window.dataLayer.push(args);
        }
        (window as any).gtag = gtag;
        gtag('js', new Date());
        gtag('config', trackingId, {
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
    eventData?: Record<string, any>
) {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', eventName, eventData);
    }
}

/**
 * Track page views
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'page_view', {
            page_path: pagePath,
            page_title: pageTitle || document.title,
        });
    }
}

/**
 * Track conversions
 */
export function trackConversion(conversionName: string, value?: number) {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', conversionName, {
            value: value || 1,
            currency: 'USD',
        });
    }
}

/**
 * Web Vitals tracking for Core Web Vitals
 */
export function useWebVitals() {
    useEffect(() => {
        // Load Web Vitals
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/web-vitals@3/dist/web-vitals.iife.js';
        script.onload = () => {
            if ((window as any).webVitals) {
                const vitals = (window as any).webVitals;

                // Track FCP
                vitals.onFCP((metric: any) => {
                    trackEvent('web_vital_fcp', {
                        value: Math.round(metric.value),
                        label: metric.name,
                    });
                });

                // Track LCP
                vitals.onLCP((metric: any) => {
                    trackEvent('web_vital_lcp', {
                        value: Math.round(metric.value),
                        label: metric.name,
                    });
                });

                // Track CLS
                vitals.onCLS((metric: any) => {
                    trackEvent('web_vital_cls', {
                        value: Math.round(metric.value * 1000) / 1000,
                        label: metric.name,
                    });
                });

                // Track TTFB
                vitals.onTTFB((metric: any) => {
                    trackEvent('web_vital_ttfb', {
                        value: Math.round(metric.value),
                        label: metric.name,
                    });
                });

                // Track INP
                if (vitals.onINP) {
                    vitals.onINP((metric: any) => {
                        trackEvent('web_vital_inp', {
                            value: Math.round(metric.value),
                            label: metric.name,
                        });
                    });
                }
            }
        };
        document.head.appendChild(script);
    }, []);
}

/**
 * Heatmap tracking integration (Hotjar or Clarity)
 */
export function useHeatmapTracking(trackingId: string, service: 'hotjar' | 'clarity' = 'hotjar') {
    useEffect(() => {
        if (service === 'hotjar') {
            // Hotjar integration
            const script = document.createElement('script');
            script.innerHTML = `
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${trackingId},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');
          r.async=1;
          r.src=t+h._hjSettings.hjid;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `;
            document.head.appendChild(script);
        } else if (service === 'clarity') {
            // Microsoft Clarity integration
            const script = document.createElement('script');
            script.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${trackingId}");
      `;
            document.head.appendChild(script);
        }
    }, [trackingId, service]);
}

// Type augmentation
declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
        webVitals?: any;
    }
}
