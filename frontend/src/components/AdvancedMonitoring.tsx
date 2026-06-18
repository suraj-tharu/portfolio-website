import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Performance Monitoring Dashboard (Suggestion #27)
 * Real-time performance metrics tracking
 */
interface PerformanceMetrics {
    fcp?: number; // First Contentful Paint
    lcp?: number; // Largest Contentful Paint
    cls?: number; // Cumulative Layout Shift
    ttfb?: number; // Time to First Byte
    inp?: number; // Interaction to Next Paint
    fid?: number; // First Input Delay (deprecated)
    memory?: number;
    fps?: number;
}

export const PerformanceMonitor: React.FC = () => {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({});
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Collect Core Web Vitals
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list: PerformanceObserverEntryList) => {
                    for (const entry of list.getEntries()) {
                        if (entry.name === 'first-contentful-paint') {
                            setMetrics(prev => ({ ...prev, fcp: Math.round(entry.startTime) }));
                        }
                    }
                });
                observer.observe({ entryTypes: ['paint', 'measure', 'navigation'] });
            } catch {
                // PerformanceObserver not available in this environment
            }
        }

        // Memory usage (Chrome only — non-standard API)
        if ('memory' in performance) {
            const memMetrics = (performance as Performance & { memory: { usedJSHeapSize: number } }).memory;
            setMetrics(prev => ({
                ...prev,
                memory: Math.round(memMetrics.usedJSHeapSize / 1048576),
            }));
        }

        // Calculate FPS — track the latest RAF id so cleanup always cancels the running frame
        let frameCount = 0;
        let lastTime = performance.now();
        let fpsFrameId = 0;

        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();

            if (currentTime - lastTime >= 1000) {
                setMetrics(prev => ({ ...prev, fps: frameCount }));
                frameCount = 0;
                lastTime = currentTime;
            }

            fpsFrameId = requestAnimationFrame(measureFPS);
        };

        fpsFrameId = requestAnimationFrame(measureFPS);

        return () => cancelAnimationFrame(fpsFrameId);
    }, []);

    const metricsList = [
        { label: 'FCP', value: metrics.fcp, unit: 'ms', good: 1800 },
        { label: 'LCP', value: metrics.lcp, unit: 'ms', good: 2500 },
        { label: 'CLS', value: metrics.cls, unit: '', good: 0.1 },
        { label: 'TTFb', value: metrics.ttfb, unit: 'ms', good: 600 },
        { label: 'INP', value: metrics.inp, unit: 'ms', good: 200 },
        { label: 'Memory', value: metrics.memory, unit: 'MB', good: 100 },
        { label: 'FPS', value: metrics.fps, unit: 'fps', good: 60 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-4 right-4 z-50"
        >
            <motion.button
                onClick={() => setIsVisible(!isVisible)}
                className="mb-2 px-4 py-2 bg-violet-600 text-white rounded-lg shadow-lg hover:bg-violet-700 transition-colors"
            >
                Performance
            </motion.button>

            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-4 w-72 space-y-2"
                >
                    {metricsList.map(metric => (
                        <div key={metric.label} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">{metric.label}</span>
                            <motion.span
                                animate={{
                                    color: metric.value && metric.value <= metric.good ? '#10b981' : '#ef4444',
                                }}
                                className="font-semibold"
                            >
                                {metric.value !== undefined ? `${metric.value}${metric.unit}` : '—'}
                            </motion.span>
                        </div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

/**
 * Analytics Dashboard (Suggestion #23)
 * Real-time visitor analytics and insights
 */
interface AnalyticsData {
    pageViews: number;
    uniqueVisitors: number;
    sessionDuration: number;
    bounceRate: number;
    topPages: Array<{ path: string; views: number }>;
    deviceTypes: Record<string, number>;
    trafficSources: Record<string, number>;
}

export const AnalyticsDashboard: React.FC = () => {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
        pageViews: 0,
        uniqueVisitors: 0,
        sessionDuration: 0,
        bounceRate: 0,
        topPages: [],
        deviceTypes: {},
        trafficSources: {},
    });

    useEffect(() => {
        // Fetch analytics data from localStorage or API
        try {
            const storedAnalytics = localStorage.getItem('siteAnalytics');
            if (storedAnalytics) {
                setAnalyticsData(JSON.parse(storedAnalytics) as AnalyticsData);
            }
        } catch {
            // Ignore malformed or tampered localStorage data
        }
    }, []);

    const StatCard: React.FC<{ label: string; value: number | string; unit?: string }> = ({
        label,
        value,
        unit = '',
    }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-lg"
        >
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{label}</p>
            <motion.p className="text-2xl font-bold text-violet-600">
                {value}
                {unit}
            </motion.p>
        </motion.div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Page Views" value={analyticsData.pageViews} />
            <StatCard label="Unique Visitors" value={analyticsData.uniqueVisitors} />
            <StatCard label="Avg. Session Duration" value={analyticsData.sessionDuration} unit="s" />
            <StatCard label="Bounce Rate" value={analyticsData.bounceRate} unit="%" />
        </div>
    );
};

/**
 * Print to PDF Export (Suggestion #26)
 */
/**
 * Exports an element to a print-ready window using a Blob URL.
 * Avoids document.write() and does NOT interpolate raw innerHTML into a string,
 * preventing XSS via deprecated APIs.
 */
export const exportToPDF = (elementId: string, filename: string = 'export.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const styles = Array.from(document.styleSheets)
        .map(sheet => {
            try {
                return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
            } catch {
                return '';
            }
        })
        .join('\n');

    // Safe filename: strip characters that could break HTML attribute context
    const safeFilename = filename.replace(/[<>"'&]/g, '_');

    // Clone the target element to avoid mutating the live DOM
    const cloned = element.cloneNode(true) as HTMLElement;

    // Build the HTML string from cloned DOM (trusted, not user input)
    const html = [
        '<!DOCTYPE html><html><head>',
        `<title>${safeFilename}</title>`,
        `<style>${styles}</style>`,
        '</head><body>',
        cloned.outerHTML,
        '</body></html>',
    ].join('');

    // Use Blob URL instead of deprecated document.write
    const blob = new Blob([html], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    const printWindow = window.open(blobUrl, '_blank', 'width=900,height=700');
    if (!printWindow) {
        URL.revokeObjectURL(blobUrl);
        return;
    }

    printWindow.addEventListener('load', () => {
        printWindow.print();
        setTimeout(() => {
            printWindow.close();
            URL.revokeObjectURL(blobUrl);
        }, 1000);
    });
};

/**
 * Toast Notification Provider Enhancement (Suggestion #25)
 * Advanced notification system with rich UI
 */
export interface AdvancedToastProps {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
    icon?: React.ReactNode;
}

export const AdvancedToast: React.FC<AdvancedToastProps> = ({
    message,
    type,
    duration = 4000,
    action,
    icon,
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (duration === Infinity) return;

        const timer = setTimeout(() => setIsVisible(false), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    const colors = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    };

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`border rounded-lg p-4 shadow-lg flex items-center justify-between gap-4 ${colors[type]}`}
        >
            <div className="flex items-center gap-3">
                {icon && <div>{icon}</div>}
                <p>{message}</p>
            </div>
            {action && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.onClick}
                    className="font-semibold hover:opacity-75"
                >
                    {action.label}
                </motion.button>
            )}
        </motion.div>
    );
};
