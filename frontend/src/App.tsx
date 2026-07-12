import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SmoothScroll from './components/SmoothScroll';
import MagneticCursor from './components/premium/MagneticCursor';
import CinematicIntro from './components/CinematicIntro';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import FloatingActionButton from './components/FloatingActionButton';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { ToastProvider } from './components/Toast';
import { useTheme } from './hooks/useTheme';
import { useGoogleAnalytics, useWebVitals, trackPageView } from './hooks/useAnalytics';
import { useSkipToContent, usePrefersColorScheme } from './hooks/useAccessibility';
import { useThemeAnimation, usePageTransition, useScrollSpy } from './hooks/useThemeAnimation';
import { initErrorTracking, enableConsoleSpy } from './utils/errorTracking';
import { initializeAnalytics } from './utils/analytics';
import { setMetaTags, defaultMetaTags } from './utils/metaTags';
import { addJsonLdSchema, organizationSchema } from './utils/jsonLdSchema';
import { FluidBackground } from './components/premium';
import { DeveloperMode } from './components/DeveloperMode';
import NoiseTexture from './components/NoiseTexture';
import PageWrapper from './components/PageWrapper';

import Home from './pages/Home';

// Lazy loaded pages to reduce initial bundle size (>500kb fix)
const ResearchDashboard = lazy(() => import('./pages/ResearchDashboard'));
const LearningHub = lazy(() => import('./pages/LearningHub'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Initialize error tracking on app load
initErrorTracking();
enableConsoleSpy();

// Initialize analytics (LogRocket & Hotjar)
initializeAnalytics();

// Set default meta tags and JSON-LD schema
setMetaTags(defaultMetaTags);
addJsonLdSchema(organizationSchema);

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(pathname, document.title);
  }, [pathname]);
  return null;
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { setTheme } = useTheme();
  const systemColorScheme = usePrefersColorScheme();
  const location = useLocation();

  // Initialize premium hooks
  useThemeAnimation();
  usePageTransition();
  useScrollSpy();

  // Initialize analytics
  useGoogleAnalytics({ debug: false });
  useWebVitals();
  useSkipToContent();

  // Apply system color scheme preference on first load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      setTheme(systemColorScheme);
    }
  }, [systemColorScheme, setTheme]);

  // Hard safety timeout — content ALWAYS renders after 5s max
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(safetyTimer);
  }, []);

  return (
    <>
      <ScrollToTop />
      <SmoothScroll>
        <div className="bg-[var(--bg)] min-h-screen text-[var(--text)] transition-colors duration-300">
          {isLoading && <CinematicIntro onComplete={() => setIsLoading(false)} />}

          {/* Global premium overlays — z-index safe stack */}
          <MagneticCursor />
          <NoiseTexture />
          {/* ScrollProgress is rendered inside Navbar.tsx (z-index: 200) */}
          <FluidBackground />
          <DeveloperMode />
          <ChatWidget />
          <FloatingActionButton />
          <PWAInstallPrompt />

          <div
            className="transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: isLoading ? 0 : 1,
              height: isLoading ? '100vh' : 'auto',
              overflow: isLoading ? 'hidden' : 'visible'
            }}
          >
            <Navbar />
            <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-brand-500">Loading…</div>}>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                  <Route path="/research" element={<PageWrapper><ResearchDashboard /></PageWrapper>} />
                  <Route path="/learning-hub" element={<PageWrapper><LearningHub /></PageWrapper>} />
                  <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
                </Routes>
              </AnimatePresence>
            </Suspense>
            <Footer />
          </div>
        </div>
      </SmoothScroll>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </BrowserRouter>
  );
}
