import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { addJsonLdSchema, faqSchema } from '../utils/jsonLdSchema';

/**
 * FAQ Section Component with JSON-LD Schema & working category filter
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
        question: 'Who is Suraj Tharu Chaudhary?',
        answer: 'Suraj Tharu Chaudhary is a Computer Engineer, GIS Researcher, and Senior Instructor from Nepal. He specializes in Machine Learning, Remote Sensing, LULC Analysis, and Full-Stack Web Development. He holds a B.E. in Computer Engineering from Himalaya College of Engineering and is currently pursuing an MSc in Information System Engineering at Purbanchal University.',
        category: 'About'
    },
    {
        id: '2',
        question: 'What GIS and Remote Sensing research has Suraj Tharu done?',
        answer: 'Suraj Tharu Chaudhary has conducted research on Land Use Land Cover (LULC) change analysis in Nawalparasi district using satellite imagery, supervised classification techniques, and Deep Learning models. His research focuses on urban sprawl simulation, hydrological modeling, and environmental impact assessments using QGIS, ArcGIS, and Python.',
        category: 'Research'
    },
    {
        id: '3',
        question: 'What subjects does Suraj Tharu Chaudhary teach?',
        answer: 'Er. Suraj Tharu Chaudhary teaches Computer Science for SEE (Grade 10) and NEB (Grade 11 & 12) students in Nepal. He also delivers Teacher Training sessions on modern pedagogy and ICT integration. His courses cover programming fundamentals, data structures, database management, and web development.',
        category: 'Education'
    },
    {
        id: '4',
        question: 'Are free study materials available for Class 10, 11, and 12?',
        answer: 'Yes! Visit the Learning Hub section of this portfolio to access free class notes, tutorials, and PDF resources for SEE Computer Science, NEB Grade 11 Computer Science, and NEB Grade 12 Computer Science. New materials are added regularly.',
        category: 'Learning'
    },
    {
        id: '5',
        question: 'Can I hire Suraj Tharu Chaudhary for freelance work?',
        answer: 'Yes, Suraj is available for freelance projects including GIS analysis, machine learning model development, full-stack web applications, and technical training programs. Reach out through the Contact section of this portfolio with your project details.',
        category: 'Services'
    },
    {
        id: '6',
        question: 'What programming languages and tools does Suraj use?',
        answer: 'Suraj Tharu Chaudhary works with Python, JavaScript, TypeScript, and SQL for development. His GIS toolkit includes QGIS, ArcGIS Pro, Google Earth Engine, and ERDAS Imagine. For machine learning, he uses TensorFlow, Keras, and scikit-learn. Web development projects use React, Node.js, Express, and PostgreSQL.',
        category: 'Technology'
    }
];

export default function FAQ({ items = defaultFAQs }: FAQProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Add JSON-LD schema on mount (useEffect = correct side-effect hook)
    useEffect(() => {
        const qaItems = items.map(item => ({
            question: item.question,
            answer: item.answer
        }));
        addJsonLdSchema(faqSchema(qaItems));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleFAQ = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const categories = ['All', ...Array.from(new Set(items.map(item => item.category || 'General')))];

    const filteredItems = selectedCategory === 'All'
        ? items
        : items.filter(item => (item.category || 'General') === selectedCategory);

    return (
        <section id="faq" className="py-8 md:py-10 relative z-20">
            <div className="max-w-4xl mx-auto px-6 md:px-10">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="hidden md:block w-8 h-px bg-stroke" />
                        <span className="text-xs font-bold uppercase tracking-[0.4em] bg-gradient-to-r from-slate-600 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent drop-shadow-sm">Questions</span>
                        <div className="hidden md:block w-8 h-px bg-stroke" />
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl text-text-primary tracking-tight mb-4">
                        Frequently <span className="font-display italic text-text-secondary">Asked</span>
                    </h2>
                    <p className="text-sm max-w-md mx-auto font-medium text-muted leading-relaxed">
                        Find answers to common questions about my work, services, and expertise
                    </p>
                </div>

                {/* Category Filter — now functional */}
                <div className="flex flex-wrap gap-2 justify-center mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setExpandedId(null); // Close any open item on filter change
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                selectedCategory === cat
                                    ? 'bg-brand-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                                    : 'bg-surface text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* FAQ Items with AnimatePresence for filter transitions */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedCategory}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        {filteredItems.length === 0 && (
                            <p className="text-center text-muted py-8">No questions in this category.</p>
                        )}
                        {filteredItems.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="bg-surface border border-stroke rounded-2xl overflow-hidden hover:border-brand-light/50 transition-colors"
                            >
                                <button
                                    onClick={() => toggleFAQ(item.id)}
                                    className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left"
                                    aria-expanded={expandedId === item.id}
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
                                            <div className="px-6 md:px-8 pb-6 text-text-secondary border-t border-stroke pt-6 leading-relaxed">
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

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
