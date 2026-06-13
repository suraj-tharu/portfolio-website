import { useState, useEffect } from 'react';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import TerminalResume from './components/TerminalResume';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import SelectedWorks from './components/SelectedWorks';
import Explorations from './components/Explorations';
import AutomationHero from './components/AutomationHero';
import Journal from './components/Journal';
import Stats from './components/Stats';
import Footer from './components/Footer';

// New Ultimate Components
import AcademicTimeline from './components/AcademicTimeline';
import SkillsVisualization from './components/SkillsVisualization';
import TeachingExperience from './components/TeachingExperience';
import ResearchPublications from './components/ResearchPublications';
import ResearchGallery from './components/ResearchGallery';
import StudentResources from './components/StudentResources';
import Certifications from './components/Certifications';
import AwardsAchievements from './components/AwardsAchievements';
import InteractiveResume from './components/InteractiveResume';

// Master Features
import Contact from './components/Contact';
import ChatWidget from './components/ChatWidget';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  useTheme(); // Initialize theme

  useEffect(() => {
    const handleHashClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (href?.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleHashClick);
    return () => document.removeEventListener('click', handleHashClick);
  }, []);

  return (
    <SmoothScroll>
      <div className="bg-bg min-h-screen text-text-primary transition-colors duration-300">
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
          <main>
            <Hero />
            
            <AcademicTimeline />
            <SkillsVisualization />
            <AboutMe />
            
            <TeachingExperience />
            
            <AutomationHero />
            <SelectedWorks />
            
            <ResearchPublications />
            <ResearchGallery />
            
            <Explorations />
            
            <StudentResources />
            <Certifications />
            <AwardsAchievements />
            
            <Journal />
            <Stats />
            
            <InteractiveResume />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </SmoothScroll>
  );
}
