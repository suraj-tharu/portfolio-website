import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

// Basic Dictionary for Hero Section
const dictionary = {
  en: {
    'hero.role.educator': 'An Educator',
    'hero.role.engineer': 'A Computer Engineer',
    'hero.role.researcher': 'A GIS Researcher',
    'hero.role.gis': 'A GIS Analyst',
    'hero.location': 'from Nawalparasi West, Nepal.',
    'hero.description': 'Applying machine learning and geospatial analysis to drive sustainable development and engineering solutions.',
    'nav.home': 'Home',
    'nav.expertise': 'Expertise',
    'nav.work': 'Work',
    'nav.academia': 'Academia',
    'nav.learninghub': 'Learning Hub',
    'nav.contact': 'Contact',
    'teaching.pedagogy': 'Pedagogy',
    'teaching.title': '5+ Years of Teaching',
    'teaching.institutions': 'Institutions',
    'teaching.courses': 'Courses Taught',
    'teaching.philosophy': 'Philosophy',
  },
  ne: {
    'hero.role.educator': 'एक शिक्षक',
    'hero.role.engineer': 'एक कम्प्युटर इन्जिनियर',
    'hero.role.researcher': 'एक GIS अनुसन्धानकर्ता',
    'hero.role.gis': 'एक GIS विश्लेषक',
    'hero.location': 'नवलपरासी पश्चिम, नेपालबाट।',
    'hero.description': 'दिगो विकास र इन्जिनियरिङ समाधानहरू अघि बढाउन मेसिन लर्निङ र भू-स्थानिक विश्लेषण लागू गर्दै।',
    'nav.home': 'गृह पृष्ठ',
    'nav.expertise': 'दक्षता',
    'nav.work': 'काम',
    'nav.academia': 'शैक्षिक',
    'nav.learninghub': 'सिकाइ केन्द्र',
    'nav.contact': 'सम्पर्क',
    'teaching.pedagogy': 'शिक्षण विधि',
    'teaching.title': '५+ वर्षको शिक्षण अनुभव',
    'teaching.institutions': 'संस्थाहरु',
    'teaching.courses': 'पढाइएको पाठ्यक्रम',
    'teaching.philosophy': 'दर्शन',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ne';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    // Optional: Add a class to body for font family switching if needed
    if (language === 'ne') {
      document.body.classList.add('font-nepali');
    } else {
      document.body.classList.remove('font-nepali');
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ne' : 'en');
  };

  const t = (key: string): string => {
    const translation = dictionary[language][key as keyof typeof dictionary['en']];
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
