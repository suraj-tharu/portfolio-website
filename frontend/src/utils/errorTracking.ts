/**
 * Sentry-like error tracking for frontend
 * Can be replaced with actual Sentry SDK
 */

export interface ErrorLog {
    timestamp: Date;
    message: string;
    stack?: string;
    level: 'error' | 'warning' | 'info';
    context?: Record<string, any>;
    url: string;
    userAgent: string;
}

const errorLogs: ErrorLog[] = [];

/**
 * Initialize error tracking
 */
export function initErrorTracking(sentryDsn?: string) {
    if (sentryDsn) {
        console.info('[ErrorTracking] Sentry DSN provided; install @sentry/react to enable remote reporting.');
    }

    // Global error handler
    window.addEventListener('error', (event) => {
        captureError(event.error);
    });

    // Unhandled promise rejection
    window.addEventListener('unhandledrejection', (event) => {
        captureError(event.reason);
    });
}

/**
 * Capture error for tracking
 */
export function captureError(
    error: Error | string,
    level: 'error' | 'warning' | 'info' = 'error',
    context?: Record<string, any>
) {
    const errorLog: ErrorLog = {
        timestamp: new Date(),
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        level,
        context,
        url: window.location.href,
        userAgent: navigator.userAgent,
    };

    errorLogs.push(errorLog);

    // Log to console in development
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.error('[Error Tracking]', errorLog);
    }

    // Send to backend (optional)
    if (errorLogs.length % 5 === 0) {
        sendErrorLogsToBackend();
    }
}

/**
 * Send error logs to backend
 */
async function sendErrorLogsToBackend() {
    if (errorLogs.length === 0) return;

    try {
        // Replace with your actual backend endpoint
        await fetch('/api/logs/errors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ errors: errorLogs }),
        });
        errorLogs.length = 0; // Clear after sending
    } catch (e) {
        console.error('Failed to send error logs:', e);
    }
}

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
    private static marks: Map<string, number> = new Map();

    static startMeasure(label: string) {
        this.marks.set(label, performance.now());
    }

    static endMeasure(label: string) {
        const startTime = this.marks.get(label);
        if (!startTime) {
            console.warn(`No start mark found for ${label}`);
            return;
        }

        const duration = performance.now() - startTime;
        console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
        this.marks.delete(label);
        return duration;
    }

    static measure(label: string, fn: () => void) {
        this.startMeasure(label);
        try {
            fn();
        } finally {
            this.endMeasure(label);
        }
    }

    static async measureAsync(label: string, fn: () => Promise<void>) {
        this.startMeasure(label);
        try {
            await fn();
        } finally {
            this.endMeasure(label);
        }
    }

    static getMetrics() {
        return {
            navigation: performance.getEntriesByType('navigation'),
            resource: performance.getEntriesByType('resource'),
            paint: performance.getEntriesByType('paint'),
            measure: performance.getEntriesByType('measure'),
        };
    }
}

/**
 * Console spy for tracking console errors
 */
export function enableConsoleSpy() {
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = function (...args: any[]) {
        if (args.length > 0) {
            captureError(args.join(' '), 'error');
        }
        originalError.apply(console, args);
    };

    console.warn = function (...args: any[]) {
        if (args.length > 0) {
            captureError(args.join(' '), 'warning');
        }
        originalWarn.apply(console, args);
    };
}
