import React, { lazy, Suspense } from 'react';

/**
 * Route Configuration with Code Splitting (Suggestion #29)
 * Lazy-loaded routes for optimal performance
 */

// Lazy load all pages
const Home = lazy(() => import('../pages/Home'));
const ResearchDashboard = lazy(() => import('../pages/ResearchDashboard'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const NotFound = lazy(() => import('../pages/NotFound'));

/**
 * Loading Fallback Component
 */
const LoadingFallback = () => (
    <div className= "flex items-center justify-center min-h-screen" >
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" > </div>
        </div>
);

/**
 * Route Configuration Object
 */
export interface Route {
    path: string;
    component: React.ComponentType<any>;
    exact?: boolean;
    label?: string;
    icon?: string;
    meta?: {
        title?: string;
        description?: string;
        keywords?: string[];
    };
}

export const routes: Route[] = [
    {
        path: '/',
        component: Home,
        exact: true,
        label: 'Home',
        meta: {
            title: 'Suraj Tharu - GIS Engineer & Educator',
            description: 'Portfolio of Suraj Tharu, GIS engineer, educator, and researcher.',
        },
    },
    {
        path: '/research',
        component: ResearchDashboard,
        label: 'Research',
        meta: {
            title: 'Research - Suraj Tharu',
            description: 'Research publications and projects.',
        },
    },
    {
        path: '/about',
        component: About,
        label: 'About',
        meta: {
            title: 'About - Suraj Tharu',
            description: 'Learn more about my background and experience.',
        },
    },
    {
        path: '/contact',
        component: Contact,
        label: 'Contact',
        meta: {
            title: 'Contact - Suraj Tharu',
            description: 'Get in touch with me.',
        },
    },
];

/**
 * Route with Suspense Wrapper
 */
interface ProtectedRouteProps {
    route: Route;
    [key: string]: any;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ route, ...props }) => {
    return (
        <Suspense fallback= {< LoadingFallback />}>
            <route.component { ...props } />
            </Suspense>
  );
};

/**
 * Get route by path
 */
export const getRouteByPath = (path: string): Route | undefined => {
    return routes.find(route => route.path === path);
};

/**
 * Get navigation routes (excluding 404)
 */
export const getNavigationRoutes = (): Route[] => {
    return routes.filter(r => r.label);
};

/**
 * Pre-load route component (performance optimization)
 */
export const preloadRoute = (path: string) => {
    const route = getRouteByPath(path);
    if (route) {
        // Trigger component loading
        route.component.preload?.();
    }
};

/**
 * Intersection Observer for route preloading
 */
export const setupRoutePreloading = () => {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const path = entry.target.getAttribute('data-preload-route');
                if (path) {
                    preloadRoute(path);
                }
            }
        });
    });

    // Observe all route links
    document.querySelectorAll('[data-preload-route]').forEach(el => {
        observer.observe(el);
    });

    return observer;
};
