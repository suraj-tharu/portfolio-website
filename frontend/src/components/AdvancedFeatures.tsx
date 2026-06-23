import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

/**
 * Advanced Search Component (Suggestion #19)
 * AI-powered search with instant results and fuzzy matching
 */
interface SearchItem {
    id: string;
    title: string;
    description: string;
    category: string;
    tags?: string[];
    url?: string;
}

interface AdvancedSearchProps {
    items: SearchItem[];
    onSelect?: (item: SearchItem) => void;
}

const fuzzyMatch = (search: string, text: string): number => {
    const searchLower = search.toLowerCase();
    const textLower = text.toLowerCase();

    if (textLower.includes(searchLower)) return 100;

    let score = 0;
    let searchIndex = 0;

    for (let i = 0; i < textLower.length && searchIndex < searchLower.length; i++) {
        if (textLower[i] === searchLower[searchIndex]) {
            score += 10;
            searchIndex++;
        }
    }

    return searchIndex === searchLower.length ? score : 0;
};

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ items, onSelect }) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const results = useMemo(() => {
        if (!search) return [];

        return items
            .map(item => ({
                item,
                score: Math.max(
                    fuzzyMatch(search, item.title),
                    fuzzyMatch(search, item.description),
                    item.tags?.some(tag => fuzzyMatch(search, tag) > 0) ? 50 : 0,
                ),
            }))
            .filter(result => result.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8)
            .map(result => result.item);
    }, [search, items]);

    return (
        <div className="relative w-full max-w-md mx-auto">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted dark:text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
            </div>

            <AnimatePresence>
                {isOpen && search && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                    >
                        {results.map((item, index) => (
                            <motion.button
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => {
                                    onSelect?.(item);
                                    setSearch('');
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b last:border-b-0 transition-colors"
                            >
                                <div className="font-semibold text-sm">{item.title}</div>
                                <div className="text-xs text-gray-500">{item.category}</div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/**
 * Data Visualization Charts (Suggestion #21)
 */
interface DataPoint {
    label: string;
    value: number;
}

interface BarChartProps {
    data: DataPoint[];
    title?: string;
    maxValue?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
    data,
    title,
    maxValue = Math.max(...data.map(d => d.value)),
}) => {
    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-lg">
            {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
            <div className="space-y-4">
                {data.map((item, index) => (
                    <motion.div key={item.label} initial={{ width: 0 }} animate={{ width: '100%' }}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{item.label}</span>
                            <span className="text-sm text-gray-600">{item.value}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                                transition={{ delay: index * 0.1, duration: 0.8, ease: 'easeOut' }}
                                className="h-2 bg-gradient-to-r from-violet-500 to-purple-600"
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

/**
 * Portfolio Filter System (Suggestion #20)
 */
interface Portfolio {
    id: string;
    title: string;
    category: string;
    tags: string[];
    image: string;
}

interface PortfolioFilterProps {
    items: Portfolio[];
    categories: string[];
}

export const PortfolioFilter: React.FC<PortfolioFilterProps> = ({ items, categories }) => {
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

    const filtered = useMemo(
        () =>
            selectedCategories.size === 0
                ? items
                : items.filter(item => selectedCategories.has(item.category)),
        [items, selectedCategories],
    );

    const toggleCategory = (category: string) => {
        const newSelected = new Set(selectedCategories);
        if (newSelected.has(category)) {
            newSelected.delete(category);
        } else {
            newSelected.add(category);
        }
        setSelectedCategories(newSelected);
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(category => (
                    <motion.button
                        key={category}
                        onClick={() => toggleCategory(category)}
                        animate={{
                            scale: selectedCategories.has(category) ? 1.05 : 1,
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategories.has(category)
                                ? 'bg-violet-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {category}
                    </motion.button>
                ))}
            </div>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filtered.map(item => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="font-semibold mb-2">{item.title}</h3>
                                <div className="flex flex-wrap gap-1">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

/**
 * Optimized Image Component with Blur-up (Suggestion #8)
 */
interface OptimizedImageProps {
    src: string;
    alt: string;
    placeholder?: string;
    className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    placeholder,
    className = '',
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Placeholder/blur-up version */}
            {!imageLoaded && placeholder && (
                <motion.img
                    src={placeholder}
                    alt={alt}
                    className="w-full h-full object-cover blur-xl"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: imageLoaded ? 0 : 1 }}
                />
            )}

            {/* Actual image */}
            <motion.img
                src={src}
                alt={alt}
                onLoad={() => setImageLoaded(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
            />
        </div>
    );
};
