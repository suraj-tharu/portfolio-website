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
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="hidden md:block w-8 h-px bg-stroke" />
                        <span className="text-xs font-bold uppercase tracking-[0.4em] bg-gradient-to-r from-slate-600 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent drop-shadow-sm">Questions</span>
                        <div className="hidden md:block w-8 h-px bg-stroke" />
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl text-text-primary tracking-tight mb-4">
                        Frequently <span className="font-display italic text-text-secondary">Asked</span>
                    </h2>
                    <p className="text-sm max-w-md mx-auto font-medium bg-gradient-to-r from-slate-600 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent leading-relaxed">
                        Find answers to common questions about my work, services, and expertise
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 justify-center mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className="px-4 py-2 rounded-full text-sm font-medium bg-surface text-text-secondary hover:bg-surface-2 transition-colors"
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
                            className="bg-surface border border-stroke rounded-2xl overflow-hidden hover:border-brand-light/50 transition-colors"
                        >
                            <button
                                onClick={() => toggleFAQ(item.id)}
                                className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left"
                            >
                                <span className="text-text-primary font-semibold text-lg md:text-xl">
                                    {item.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: expandedId === item.id ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-shrink-0 ml-4"
                                >
                                    <ChevronDown
                                        size={24}
                                        className="text-brand-light"
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
                                        <div className="px-6 md:px-8 pb-6 text-text-secondary border-t border-stroke pt-6">
                                            {item.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16 p-8 md:p-12 rounded-3xl bg-surface border border-stroke text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl text-text-primary tracking-tight mb-4">
                            Still have <span className="font-display italic text-text-secondary">questions?</span>
                        </h3>
                        <p className="text-sm text-muted mb-8">
                            Can't find the answer you're looking for? Let's chat!
                        </p>
                        <a
                            href="#contact"
                            className="inline-flex group relative items-center justify-center rounded-full px-8 py-3 text-sm bg-bg border border-stroke hover:border-transparent transition-colors overflow-hidden"
                        >
                            <span className="absolute inset-[-200%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_50%,rgba(137,170,204,1)_100%)] opacity-0 group-hover:opacity-100 group-hover:animate-[spin_2s_linear_infinite] transition-opacity duration-300" />
                            <div className="absolute inset-[2px] bg-bg rounded-full" />
                            <span className="relative z-10 flex items-center gap-2 text-text-primary">Get in Touch &rarr;</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
