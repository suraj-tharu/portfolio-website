/**
 * Color Harmony System (Suggestion #14)
 * Generates algorithmically harmonious color palettes
 */

interface ColorPalette {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
    complementary: string;
    analogous1: string;
    analogous2: string;
}

function hexToHSL(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let r = parseInt(result?.[1] || '0', 16) / 255;
    let g = parseInt(result?.[2] || '0', 16) / 255;
    let b = parseInt(result?.[3] || '0', 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    return `#${[
        Math.round(f(0) * 255).toString(16).padStart(2, '0'),
        Math.round(f(8) * 255).toString(16).padStart(2, '0'),
        Math.round(f(4) * 255).toString(16).padStart(2, '0'),
    ].join('')}`;
}

/**
 * Generate complementary color harmony
 */
export const generateComplementaryPalette = (baseColor: string): ColorPalette => {
    const [h, s, l] = hexToHSL(baseColor);

    return {
        primary: baseColor,
        secondary: hslToHex((h + 30) % 360, s, l),
        tertiary: hslToHex((h + 60) % 360, s, l),
        accent: hslToHex((h + 180) % 360, s, Math.max(l - 10, 20)),
        complementary: hslToHex((h + 180) % 360, s, l),
        analogous1: hslToHex((h + 30) % 360, s, l),
        analogous2: hslToHex((h - 30 + 360) % 360, s, l),
    };
};

/**
 * Generate triadic color harmony
 */
export const generateTriadicPalette = (baseColor: string): ColorPalette => {
    const [h, s, l] = hexToHSL(baseColor);

    return {
        primary: baseColor,
        secondary: hslToHex((h + 120) % 360, s, l),
        tertiary: hslToHex((h + 240) % 360, s, l),
        accent: hslToHex((h + 90) % 360, s, l + 10),
        complementary: hslToHex((h + 180) % 360, s, l),
        analogous1: hslToHex((h + 30) % 360, s, l),
        analogous2: hslToHex((h - 30 + 360) % 360, s, l),
    };
};

/**
 * Advanced Typography System (Suggestion #12)
 * Fluid, responsive font scaling
 */
export const typographySystem = {
    // Fluid font sizes that scale between min and max viewport widths
    fluidSize: (minSize: number, maxSize: number, minViewport: number = 320, maxViewport: number = 1920) => {
        const vwValue = ((maxSize - minSize) / (maxViewport - minViewport)) * 100;
        const baseSize = minSize - ((minViewport * vwValue) / 100);
        return `calc(${baseSize}px + ${vwValue}vw)`;
    },

    // Heading styles with hierarchy
    heading1: {
        fontSize: 'clamp(2rem, 5vw, 4rem)',
        lineHeight: '1.1',
        fontWeight: 700,
        letterSpacing: '-0.02em',
    },
    heading2: {
        fontSize: 'clamp(1.5rem, 4vw, 3rem)',
        lineHeight: '1.2',
        fontWeight: 600,
        letterSpacing: '-0.01em',
    },
    heading3: {
        fontSize: 'clamp(1.25rem, 3vw, 2rem)',
        lineHeight: '1.3',
        fontWeight: 600,
    },
    body: {
        fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
        lineHeight: '1.6',
        fontWeight: 400,
    },
    small: {
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        lineHeight: '1.5',
        fontWeight: 400,
    },
};

/**
 * Image Optimization Pipeline (Suggestion #28)
 */
export const imageOptimization = {
    /**
     * Generate responsive image srcset
     */
    generateSrcset: (baseUrl: string, sizes: number[] = [320, 640, 960, 1280, 1920]) => {
        return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
    },

    /**
     * Get optimized image URL with transformation
     */
    getOptimizedUrl: (url: string, options = { width: 800, quality: 80, format: 'webp' }) => {
        const params = new URLSearchParams({
            w: options.width.toString(),
            q: options.quality.toString(),
            f: options.format,
        });
        return `${url}?${params.toString()}`;
    },

    /**
     * Generate multiple format URLs (WebP, AVIF, fallback)
     */
    generateMultiFormatUrls: (url: string) => ({
        avif: `${url}?f=avif`,
        webp: `${url}?f=webp`,
        jpeg: `${url}?f=jpeg`,
    }),
};

/**
 * Advanced SEO Optimization (Suggestion #30)
 */
export const seoOptimization = {
    /**
     * Generate meta tags for a page
     */
    generateMetaTags: (config: {
        title: string;
        description: string;
        image?: string;
        url?: string;
        author?: string;
        keywords?: string[];
    }) => ({
        og: {
            title: config.title,
            description: config.description,
            image: config.image,
            url: config.url,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: config.title,
            description: config.description,
            image: config.image,
        },
        basic: {
            description: config.description,
            keywords: config.keywords?.join(', '),
            author: config.author,
            'theme-color': '#7B6EF6',
        },
    }),

    /**
     * Generate Schema.org structured data
     */
    generateSchema: (config: any) => ({
        '@context': 'https://schema.org',
        '@type': config.type || 'Person',
        name: config.name,
        url: config.url,
        image: config.image,
        description: config.description,
        sameAs: config.social || [],
    }),

    /**
     * Generate robots.txt content
     */
    generateRobotsTxt: () => `User-agent: *
Allow: /
Disallow: /admin
Disallow: /private
Crawl-delay: 1

Sitemap: /sitemap.xml
`,
};
