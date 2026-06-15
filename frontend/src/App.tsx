import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import TerminalResume from './components/TerminalResume';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import { useTheme } from './hooks/useTheme';

import Home from './pages/Home';
import ResearchDashboard from './pages/ResearchDashboard';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  useTheme(); // Initialize theme

  return (
    <BrowserRouter>
      <ScrollToTop />
      <SmoothScroll>
        <div className="bg-[var(--bg)] min-h-screen text-[var(--text)] transition-colors duration-300">
          {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
          
          <CustomCursor />
          <TerminalResume />
          <ChatWidget />

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
