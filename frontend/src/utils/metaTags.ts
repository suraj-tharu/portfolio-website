/**
 * Utility functions for dynamic meta tags and OG tags
 * Suggestion #11: Dynamic Meta Tags & OG Tags
 */

interface MetaTagConfig {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'profile';
    author?: string;
    keywords?: string[];
}

export const setMetaTags = (config: MetaTagConfig) => {
    const {
        title,
        description,
        image,
        url = window.location.href,
        type = 'website',
        author,
        keywords = []
    } = config;

    // Set title
    if (title) {
        document.title = `${title} | Suraj Tharu Chaudhary`;
        updateMetaTag('og:title', title);
        updateMetaTag('twitter:title', title);
    }

    // Set description
    if (description) {
        updateMetaTag('description', description);
        updateMetaTag('og:description', description);
        updateMetaTag('twitter:description', description);
    }

    // Set image
    if (image) {
        updateMetaTag('og:image', image);
        updateMetaTag('twitter:image', image);
        updateMetaTag('twitter:card', 'summary_large_image');
    }

    // Set URL
    updateMetaTag('og:url', url);
    updateMetaTag('og:type', type);

    // Set author
    if (author) {
        updateMetaTag('author', author);
    }

    // Set keywords
    if (keywords.length > 0) {
        updateMetaTag('keywords', keywords.join(', '));
    }
};

export const updateMetaTag = (name: string, content: string) => {
    let element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);

    if (!element) {
        element = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
            element.setAttribute('property', name);
        } else {
            element.setAttribute('name', name);
        }
        document.head.appendChild(element);
    }

    element.setAttribute('content', content);
};

// Default meta tags for homepage
export const defaultMetaTags: MetaTagConfig = {
    title: 'Portfolio - Engineer, Educator & Researcher',
    description: 'Welcome to my portfolio. I am a full-stack engineer, educator, and researcher passionate about building innovative solutions.',
    image: 'https://your-domain.com/og-image.jpg',
    type: 'website',
    author: 'Suraj Tharu Chaudhary',
    keywords: ['engineer', 'educator', 'researcher', 'portfolio', 'full-stack']
};

// Preset configurations for different pages
export const pageMetaTags = {
    home: {
        title: 'Home',
        description: 'Welcome to my portfolio. Full-stack engineer, educator, and researcher.',
        keywords: ['portfolio', 'engineer', 'educator', 'researcher']
    },
    research: {
        title: 'Research & Projects',
        description: 'Explore my research projects, innovations, and technical contributions.',
        keywords: ['research', 'projects', 'innovations', 'technical']
    },
    learning: {
        title: 'Learning Hub',
        description: 'Educational resources and tutorials for aspiring engineers and developers.',
        keywords: ['learning', 'tutorials', 'education', 'courses']
    }
};
