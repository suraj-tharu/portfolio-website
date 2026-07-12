/**
 * Utility for Structured Data (JSON-LD)
 * Suggestion #12: Structured Data (JSON-LD)
 */

export const addJsonLdSchema = (schema: Record<string, unknown>) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
};

// Person Schema
export const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Suraj Tharu Chaudhary',
    url: 'https://portfolio-website-vto2.onrender.com',
    image: 'https://portfolio-website-vto2.onrender.com/IMG_20250922_201902.jpg',
    description: 'Computer Engineer specializing in Machine Learning, Remote Sensing, Geospatial Analysis, and Full-Stack Development.',
    jobTitle: 'Senior Instructor & MSc Student',
    worksFor: {
        '@type': 'Organization',
        name: 'Trishahid Namuna Ma. Vi.'
    },
    alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'Purbanchal University'
    },
    sameAs: [
        'https://github.com/suraj-tharu',
        'https://www.linkedin.com/in/suraj-tharu/',
        'https://scholar.google.com'
    ],
    contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+977-9800000000',
        contactType: 'General Contact'
    }
};

// Educational Organization Schema
export const educationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationEvent',
    name: 'Education Timeline',
    organizer: {
        '@type': 'Organization',
        name: 'Personal Portfolio'
    },
    events: [
        {
            '@type': 'Event',
            name: 'B.E. Computer Engineering',
            startDate: '2017',
            endDate: '2021',
            location: 'Mid-West University (Himalaya College of Engineering)'
        },
        {
            '@type': 'Event',
            name: 'MSc Information System Engineering',
            startDate: '2024',
            location: 'Purbanchal University'
        }
    ]
};

// Certificate/Credential Schema
export const certificationSchema = (cert: {
    name: string;
    issuer: string;
    url?: string;
    date: string;
}) => ({
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    name: cert.name,
    issuedBy: {
        '@type': 'Organization',
        name: cert.issuer
    },
    dateIssued: cert.date,
    url: cert.url
});

// FAQPage Schema
export const faqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
        }
    }))
});

// Article/BlogPost Schema
export const articleSchema = (article: {
    title: string;
    description: string;
    image?: string;
    datePublished: string;
    author?: string;
    url?: string;
}) => ({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    author: {
        '@type': 'Person',
        name: article.author || 'Suraj Tharu Chaudhary'
    },
    url: article.url
});

// Organization Schema
export const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Suraj Tharu Chaudhary',
    url: 'https://portfolio-website-vto2.onrender.com',
    logo: 'https://portfolio-website-vto2.onrender.com/favicon.svg',
    description: 'Portfolio of Full-stack Engineer, Educator & Researcher',
    sameAs: [
        'https://github.com/suraj-tharu',
        'https://www.linkedin.com/in/suraj-tharu/',
        'https://scholar.google.com'
    ],
    contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+977-9800000000',
        contactType: 'Customer Service'
    }
};
