import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle } from 'lucide-react';

/**
 * Email Subscription Widget
 * Suggestion #18: Email Subscription Widget
 */

export default function EmailSubscription() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setError('Please enter a valid email');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Replace with your actual API endpoint
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setIsSuccess(true);
                setEmail('');
                setTimeout(() => setIsSuccess(false), 5000);
            } else {
                setError('Failed to subscribe. Please try again.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl p-8 md:p-12 dark:bg-gradient-to-br dark:from-surface/60 dark:to-surface/30 bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-md border dark:border-stroke/30 border-gray-200/30 overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-light/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg dark:bg-brand-light/20 bg-brand-light/10">
                        <Mail className="dark:text-brand-light text-brand-dark" size={24} />
                    </div>
                    <h3 className="text-2xl font-display italic dark:text-text-primary text-gray-900">
                        Stay Updated
                    </h3>
                </div>

                <p className="dark:text-text-secondary text-gray-700 mb-6">
                    Get notified about new articles, projects, and insights directly in your inbox.
                </p>

                {/* Form */}
                <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 rounded-lg dark:bg-surface/80 bg-white/80 dark:text-text-primary text-gray-900 dark:placeholder-text-muted placeholder-gray-500 border dark:border-stroke border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-light disabled:opacity-50"
                        />
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-brand-light to-brand-dark text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Subscribing...' : 'Subscribe'}
                        </motion.button>
                    </div>

                    {/* Success Message */}
                    {isSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 text-green-500"
                        >
                            <CheckCircle size={20} />
                            <span>Thanks! Check your email to confirm subscription.</span>
                        </motion.div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}
                </form>

                {/* Privacy notice */}
                <p className="text-xs dark:text-text-muted text-gray-600 mt-4">
                    We respect your privacy. Unsubscribe at any time.
                </p>
            </div>
        </motion.div>
    );
}
