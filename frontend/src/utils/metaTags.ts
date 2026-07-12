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
    title: 'Suraj Tharu Chaudhary — Computer Engineer & GIS Researcher',
    description: 'Official portfolio of Suraj Tharu Chaudhary — Computer Engineer, Senior Instructor, and GIS Researcher. Expert in Machine Learning, Remote Sensing, LULC Analysis, and Full-Stack Development.',
    image: 'https://portfolio-website-vto2.onrender.com/IMG_20250922_201902.jpg',
    type: 'website',
    author: 'Suraj Tharu Chaudhary',
    keywords: ['Suraj Tharu Chaudhary', 'Computer Engineer Nepal', 'GIS Researcher Nepal', 'Remote Sensing Expert', 'LULC Analysis', 'Machine Learning Nepal', 'Educator Nepal', 'Portfolio', 'Full Stack Developer', 'Data Science', 'MSc Information System Engineering', 'Purbanchal University']
};

// Preset configurations for different pages
export const pageMetaTags = {
    home: defaultMetaTags,
    research: {
        title: 'Research & Projects | Suraj Tharu Chaudhary',
        description: 'Explore Suraj Tharu Chaudhary\'s research in GIS, Remote Sensing, LULC Analysis, and Deep Learning for environmental engineering and sustainable development.',
        keywords: ['GIS Research Nepal', 'Remote Sensing', 'LULC Analysis', 'Machine Learning Research', 'Suraj Tharu Chaudhary Projects'],
        url: 'https://portfolio-website-vto2.onrender.com/research',
        image: 'https://portfolio-website-vto2.onrender.com/IMG_20250922_201902.jpg',
        type: 'website' as const,
        author: 'Suraj Tharu Chaudhary'
    },
    learning: {
        title: 'Learning Hub | Suraj Tharu Chaudhary',
        description: 'Educational resources, tutorials, and class notes for Computer Engineering, GIS, and high school students in Nepal curated by Er. Suraj Tharu Chaudhary.',
        keywords: ['Computer Engineering Notes Nepal', 'GIS Tutorials', 'SEE Computer Science', 'NEB Computer Notes', 'Teacher Training Nepal'],
        url: 'https://portfolio-website-vto2.onrender.com/learning-hub',
        image: 'https://portfolio-website-vto2.onrender.com/IMG_20250922_201902.jpg',
        type: 'website' as const,
        author: 'Suraj Tharu Chaudhary'
    }
};
