import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { addJsonLdSchema, faqSchema } from '../utils/jsonLdSchema';

/**
 * FAQ Section Component with JSON-LD Schema
 * Suggestion #15: FAQ Section
 */

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category?: string;
}

interface FAQProps {
    items?: FAQItem[];
}

const defaultFAQs: FAQItem[] = [
    {
        id: '1',
        question: 'What are your areas of expertise?',
        answer: 'I specialize in full-stack web development, system design, cloud architecture, and educational technology. My expertise spans backend technologies (Node.js, Python), frontend frameworks (React, Vue), and DevOps practices.',
        category: 'Skills'
    },
    {
        id: '2',
        question: 'Do you offer freelance services?',
        answer: 'Yes, I am available for freelance projects. I work with startups and organizations on custom solutions, consulting, and technical training. Please contact me for project details and timeline.',
        category: 'Services'
    },
    {
        id: '3',
        question: 'What is your teaching background?',
        answer: 'I have been an instructor since 2021, teaching computer engineering fundamentals, web development, and system design. I believe in practical, hands-on learning approaches.',
        category: 'Education'
    },
    {
        id: '4',
        question: 'Can I access your learning resources?',
        answer: 'Yes! Visit the Learning Hub section for free tutorials, articles, and resources on web development, programming, and software engineering concepts.',
        category: 'Learning'
    },
    {
        id: '5',
        question: 'How do I stay updated with your latest work?',
        answer: 'Subscribe to my newsletter to receive updates on new articles, projects, and research. You can also follow me on GitHub, LinkedIn, and Twitter for regular updates.',
        category: 'Updates'
    },
    {
        id: '6',
        question: 'What technologies do you use?',
        answer: 'I work with modern tech stacks including React, Node.js, TypeScript, Tailwind CSS, PostgreSQL, Docker, and AWS. I stay updated with emerging technologies and best practices.',
        category: 'Technology'
    }
];

export default function FAQ({ items = defaultFAQs }: FAQProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Add JSON-LD schema on mount
    useState(() => {
        const qaItems = items.map(item => ({
            question: item.question,
            answer: item.answer
        }));
        addJsonLdSchema(faqSchema(qaItems));
    });

    const toggleFAQ = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const categories = Array.from(new Set(items.map(item => item.category || 'General')));

    return (
        <section id="faq" className="py-20 md:py-32 relative z-20">
            <div className="max-w-4xl mx-auto px-6 md:px-10">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-16">
                    <span className="text-xs dark:text-muted text-gray-600 uppercase tracking-[0.3em] mb-4">
                        Questions
                    </span>
                    <h2 className="text-4xl md:text-6xl dark:text-text-primary text-gray-900 tracking-tight font-display italic mb-6">
                        Frequently Asked
                    </h2>
                    <p className="text-lg dark:text-text-secondary text-gray-700 max-w-2xl">
                        Find answers to common questions about my work, services, and expertise
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 justify-center mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className="px-4 py-2 rounded-full text-sm font-medium dark:bg-surface dark:text-text-secondary bg-gray-100 text-gray-700 hover:dark:bg-surface/80 hover:bg-gray-200 transition-colors"
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={false}
                            animate={{ opacity: 1 }}
                            className="dark:bg-surface/40 bg-white/40 backdrop-blur-md dark:border-stroke/20 border-gray-200/30 border rounded-2xl overflow-hidden hover:dark:bg-surface/60 hover:bg-white/60 transition-colors"
                        >
                            <button
                                onClick={() => toggleFAQ(item.id)}
                                className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left"
                            >
                                <span className="dark:text-text-primary text-gray-900 font-semibold text-lg md:text-xl">
                                    {item.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: expandedId === item.id ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-shrink-0 ml-4"
                                >
                                    <ChevronDown
                                        size={24}
                                        className="dark:text-brand-light text-brand-dark"
                                    />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {expandedId === item.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 md:px-8 pb-6 dark:text-text-secondary text-gray-700 border-t dark:border-stroke/20 border-gray-200/30 pt-6">
                                            {item.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16 p-8 md:p-12 rounded-2xl dark:bg-gradient-to-r dark:from-brand-dark/20 dark:to-brand-light/20 bg-gradient-to-r from-brand-dark/10 to-brand-light/10 border dark:border-brand/30 border-brand/10 text-center">
                    <h3 className="text-2xl md:text-3xl font-display italic dark:text-text-primary text-gray-900 mb-4">
                        Still have questions?
                    </h3>
                    <p className="dark:text-text-secondary text-gray-700 mb-6">
                        Can't find the answer you're looking for? Let's chat!
                    </p>
                    <a
                        href="#contact"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-brand-light to-brand-dark text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                        Get in Touch
                    </a>
                </div>
            </div>
        </section>
    );
}
