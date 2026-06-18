import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import FloatingActionButton from './components/FloatingActionButton';
import { ToastProvider } from './components/Toast';
import { useTheme } from './hooks/useTheme';
import { useGoogleAnalytics, useWebVitals, trackPageView } from './hooks/useAnalytics';
import { useSkipToContent, usePrefersColorScheme } from './hooks/useAccessibility';
import { useThemeAnimation, usePageTransition, useScrollSpy } from './hooks/useThemeAnimation';
import { initErrorTracking, enableConsoleSpy } from './utils/errorTracking';
import { initializeAnalytics } from './utils/analytics';
import { setMetaTags, defaultMetaTags } from './utils/metaTags';
import { addJsonLdSchema, organizationSchema } from './utils/jsonLdSchema';
import { ParticleBackground } from './components/premium';

import Home from './pages/Home';
import ResearchDashboard from './pages/ResearchDashboard';

// Initialize error tracking on app load
initErrorTracking(); // Add your Sentry DSN here if available
enableConsoleSpy();

// Initialize analytics (LogRocket & Hotjar)
initializeAnalytics({
  enableLogRocket: true,
  enableHotjar: true
});

// Set default meta tags and JSON-LD schema
setMetaTags(defaultMetaTags);
addJsonLdSchema(organizationSchema);

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // Track page view on route change
    trackPageView(pathname, document.title);
  }, [pathname]);
  return null;
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { setTheme } = useTheme();
  const systemColorScheme = usePrefersColorScheme();

  // Initialize premium hooks
  useThemeAnimation(); // Smooth theme transitions
  usePageTransition(); // Smooth page transitions
  useScrollSpy(); // Scroll-spy for navbar

  // Initialize analytics
  useGoogleAnalytics({ debug: false }); // Replace with your GA4 ID
  useWebVitals();
  useSkipToContent();

  // Apply system color scheme preference on first load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      setTheme(systemColorScheme);
    }
  }, [systemColorScheme, setTheme]);


  return (
    <BrowserRouter>
      <ScrollToTop />
      <SmoothScroll>
        <div className="bg-[var(--bg)] min-h-screen text-[var(--text)] transition-colors duration-300">
          {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

          <CustomCursor />
          <ParticleBackground count={30} speed={0.3} />
          <ChatWidget />
          <FloatingActionButton />

          <div
            className="transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: isLoading ? 0 : 1,
              height: isLoading ? '100vh' : 'auto',
              overflow: isLoading ? 'hidden' : 'visible'
            }}
          >
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/research" element={<ResearchDashboard />} />
            </Routes>
            <Footer />
          </div>
        </div>
      </SmoothScroll>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
