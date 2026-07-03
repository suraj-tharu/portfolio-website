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
    url: 'https://your-domain.com',
    image: 'https://your-domain.com/profile.jpg',
    description: 'Full-stack engineer, educator, and researcher',
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
        'https://github.com/yourprofile',
        'https://linkedin.com/in/yourprofile',
        'https://twitter.com/yourprofile'
    ],
    contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+977-1234567890',
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
    url: 'https://your-domain.com',
    logo: 'https://your-domain.com/logo.png',
    description: 'Portfolio of Full-stack Engineer, Educator & Researcher',
    sameAs: [
        'https://github.com/yourprofile',
        'https://linkedin.com/in/yourprofile',
        'https://twitter.com/yourprofile'
    ],
    contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+977-1234567890',
        contactType: 'Customer Service'
    }
};
