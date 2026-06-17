import Hero from '../components/Hero';
import AboutMe from '../components/AboutMe';
import SelectedWorks from '../components/SelectedWorks';
import Explorations from '../components/Explorations';
import AutomationHero from '../components/AutomationHero';
import Journal from '../components/Journal';
import Stats from '../components/Stats';
import AcademicTimeline from '../components/AcademicTimeline';
import SkillsVisualization from '../components/SkillsVisualization';
import TeachingExperience from '../components/TeachingExperience';
import ResearchPublications from '../components/ResearchPublications';
import GISShowcase from '../components/GISShowcase';
import StudentResources from '../components/StudentResources';
import Certifications from '../components/Certifications';
import AwardsAchievements from '../components/AwardsAchievements';
import InteractiveResume from '../components/InteractiveResume';
import Contact from '../components/Contact';
import FAQ from '../components/FAQ';
import EmailSubscription from '../components/EmailSubscription';

export default function Home() {
  return (
    <main>
      <Hero />
      <AcademicTimeline />
      <SkillsVisualization />
      <AboutMe />
      <TeachingExperience />
      <AutomationHero />
      <SelectedWorks />
      <ResearchPublications />
      <GISShowcase />
      <Explorations />
      <StudentResources />
      <Certifications />
      <AwardsAchievements />
      <Journal />
      <Stats />
      <InteractiveResume />
      <div className="px-6 md:px-10 pb-20">
        <EmailSubscription />
      </div>
      <FAQ />
      <Contact />
    </main>
  );
}
