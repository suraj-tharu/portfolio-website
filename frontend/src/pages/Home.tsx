import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import CredentialsStrip from '../components/CredentialsStrip';
import Testimonials from '../components/Testimonials';
import AboutMe from '../components/AboutMe';
import SelectedWorks from '../components/SelectedWorks';
import Explorations from '../components/Explorations';
import Journal from '../components/Journal';

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

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Hero />
      <CredentialsStrip />
      <div className="section-divider" />
      <AcademicTimeline />
      <div className="section-divider" />
      <SkillsVisualization />
      <div className="section-divider" />
      <AboutMe />
      <div className="section-divider" />
      <TeachingExperience />
      <div className="section-divider" />
      <SelectedWorks />
      <div className="section-divider" />
      <ResearchPublications />
      <div className="section-divider" />
      <GISShowcase />
      <div className="section-divider" />
      <Explorations />
      <div className="section-divider" />
      <StudentResources />
      <div className="section-divider" />
      <Certifications />
      <div className="section-divider" />
      <AwardsAchievements />
      <div className="section-divider" />
      <Journal />
      <div className="section-divider" />
      <Testimonials />
      <div className="section-divider" />

      <InteractiveResume />
      <div className="section-divider" />
      <FAQ />
      <div className="section-divider" />
      <Contact />
    </motion.main>
  );
}
