import React, { lazy, Suspense } from 'react';

const Home = lazy(() => import('../pages/Home'));
const ResearchDashboard = lazy(() => import('../pages/ResearchDashboard'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
  </div>
);

export interface Route {
  path: string;
  component: React.ComponentType;
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
];

interface ProtectedRouteProps {
  route: Route;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ route }) => {
  const Component = route.component;
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );
};

export const getRouteByPath = (path: string): Route | undefined => {
  return routes.find(route => route.path === path);
};

export const getNavigationRoutes = (): Route[] => {
  return routes.filter(r => r.label);
};

export const setupRoutePreloading = () => {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const path = entry.target.getAttribute('data-preload-route');
        if (path) {
          getRouteByPath(path);
        }
      }
    });
  });

  document.querySelectorAll('[data-preload-route]').forEach(el => {
    observer.observe(el);
  });

  return observer;
};
