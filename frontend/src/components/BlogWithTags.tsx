import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Blog with Categories & Tags
 * Suggestion #14: Blog Categories & Tags with filtering
 */

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    readTime: number;
    category: string;
    tags: string[];
    image?: string;
    slug: string;
}

interface BlogWithTagsProps {
    posts: BlogPost[];
    onPostSelect?: (post: BlogPost) => void;
}

export default function BlogWithTags({ posts, onPostSelect }: BlogWithTagsProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');

    // Extract unique categories and tags
    const categories = useMemo(
        () => Array.from(new Set(posts.map(p => p.category))),
        [posts]
    );

    const allTags = useMemo(
        () => Array.from(new Set(posts.flatMap(p => p.tags))),
        [posts]
    );

    // Filter posts
    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesCategory = !selectedCategory || post.category === selectedCategory;
            const matchesTags = selectedTags.size === 0 || post.tags.some(tag => selectedTags.has(tag));
            const matchesSearch =
                searchQuery === '' ||
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCategory && matchesTags && matchesSearch;
        });
    }, [posts, selectedCategory, selectedTags, searchQuery]);

    const toggleTag = (tag: string) => {
        const newTags = new Set(selectedTags);
        if (newTags.has(tag)) {
            newTags.delete(tag);
        } else {
            newTags.add(tag);
        }
        setSelectedTags(newTags);
    };

    return (
        <section className="py-8 md:py-10 relative z-20">
            <div className="max-w-6xl mx-auto px-6 md:px-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-6xl font-display italic dark:text-text-primary text-gray-900 mb-4">
                        Learning Hub
                    </h2>
                    <p className="text-lg dark:text-text-secondary text-gray-700">
                        Explore articles, tutorials, and insights on software engineering and technology
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg dark:bg-surface bg-white dark:text-text-primary text-gray-900 border dark:border-stroke border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-light"
                    />
                </div>

                {/* Filters */}
                <div className="space-y-6 mb-12">
                    {/* Categories */}
                    <div>
                        <h3 className="text-sm font-semibold dark:text-text-primary text-gray-900 mb-3">
                            Categories
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === null
                                        ? 'dark:bg-brand-light bg-brand-dark dark:text-bg text-white'
                                        : 'dark:bg-surface bg-gray-200 dark:text-text-primary text-gray-900 hover:dark:bg-surface/80'
                                    }`}
                            >
                                All
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                                            ? 'dark:bg-brand-light bg-brand-dark dark:text-bg text-white'
                                            : 'dark:bg-surface bg-gray-200 dark:text-text-primary text-gray-900 hover:dark:bg-surface/80'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <h3 className="text-sm font-semibold dark:text-text-primary text-gray-900 mb-3">
                            Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedTags.has(tag)
                                            ? 'dark:bg-brand-light bg-brand-dark dark:text-bg text-white'
                                            : 'dark:bg-surface/40 bg-gray-100 dark:text-text-secondary text-gray-700 hover:dark:bg-surface/60'
                                        }`}
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Counter */}
                <p className="text-sm dark:text-text-muted text-text-secondary dark:text-gray-400 mb-8">
                    Showing {filteredPosts.length} of {posts.length} articles
                </p>

                {/* Posts Grid */}
                {filteredPosts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => onPostSelect?.(post)}
                                className="cursor-pointer group"
                            >
                                <div className="dark:bg-surface/40 bg-white/40 backdrop-blur-md dark:border-stroke/20 border-gray-200/30 border rounded-2xl p-6 h-full hover:dark:bg-surface/60 hover:bg-white/60 transition-all hover:shadow-lg">
                                    {post.image && (
                                        <div className="mb-4 rounded-lg overflow-hidden h-48 bg-gradient-to-br from-brand-light/20 to-brand-dark/20">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold dark:bg-brand-light/20 bg-brand-light/10 dark:text-brand-light text-brand-dark">
                                            {post.category}
                                        </span>
                                        <span className="text-xs dark:text-text-muted text-text-secondary dark:text-gray-400">
                                            {post.readTime} min read
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-semibold dark:text-text-primary text-gray-900 mb-2 line-clamp-2 group-hover:dark:text-brand-light group-hover:text-brand-dark transition-colors">
                                        {post.title}
                                    </h3>

                                    <p className="dark:text-text-secondary text-gray-700 mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between text-xs dark:text-text-muted text-text-secondary dark:text-gray-400">
                                        <span>{new Date(post.date).toLocaleDateString()}</span>
                                        <span>by {post.author}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mt-4 pt-4 border-t dark:border-stroke/20 border-gray-200/30">
                                        {post.tags.slice(0, 3).map(tag => (
                                            <span
                                                key={tag}
                                                className="text-xs dark:text-text-muted text-text-secondary dark:text-gray-400"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="dark:text-text-secondary text-gray-700">
                            No articles found. Try adjusting your filters.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
