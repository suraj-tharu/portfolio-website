import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import TerminalResume from './components/TerminalResume';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import CommandPalette from './components/CommandPalette';
import { ToastProvider } from './components/Toast';
import { useTheme } from './hooks/useTheme';
import { useGoogleAnalytics, useWebVitals, trackPageView } from './hooks/useAnalytics';
import { useSkipToContent, usePrefersColorScheme } from './hooks/useAccessibility';
import { initErrorTracking, enableConsoleSpy } from './utils/errorTracking';
import { MagneticCursor, ParticleBackground, ChatWidget as PremiumChatWidget, EnhancedThemeToggle, FloatingNav } from './components/premium';

import Home from './pages/Home';
import ResearchDashboard from './pages/ResearchDashboard';

// Initialize error tracking on app load
initErrorTracking(); // Add your Sentry DSN here if available
enableConsoleSpy();

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
  const { theme, setTheme } = useTheme();
  const systemColorScheme = usePrefersColorScheme();

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

  // Handle theme toggle from command palette
  useEffect(() => {
    const handleToggleTheme = () => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    window.addEventListener('toggleTheme', handleToggleTheme);
    return () => window.removeEventListener('toggleTheme', handleToggleTheme);
  }, [theme, setTheme]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <SmoothScroll>
        <div className="bg-[var(--bg)] min-h-screen text-[var(--text)] transition-colors duration-300">
          {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

          <CustomCursor />
          <MagneticCursor />
          <ParticleBackground count={40} speed={0.5} />
          <TerminalResume />
          <ChatWidget />
          <PremiumChatWidget />
          <CommandPalette />

          {/* Premium Floating Navigation & Theme Toggle */}
          <FloatingNav
            links={[
              { label: 'Home', href: '/' },
              { label: 'Projects', href: '#work' },
              { label: 'About', href: '#about' },
              { label: 'Contact', href: '#contact' }
            ]}
            position="top"
          />
          <div className="fixed top-6 right-6 z-40">
            <EnhancedThemeToggle />
          </div>

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
