// AnimatedCodeBlock - Code snippets with typing animation and syntax highlighting
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

interface AnimatedCodeBlockProps {
    code: string;
    language?: string;
    showLineNumbers?: boolean;
    animated?: boolean;
}

export const AnimatedCodeBlock = ({
    code,
    language = 'typescript',
    showLineNumbers = true,
    animated = true
}: AnimatedCodeBlockProps) => {
    const [displayedCode, setDisplayedCode] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!animated) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDisplayedCode(code);
            return;
        }

        let index = 0;
        const interval = setInterval(() => {
            if (index < code.length) {
                setDisplayedCode(code.slice(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
            }
        }, 20);

        return () => clearInterval(interval);
    }, [code, animated]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const lines = displayedCode.split('\n');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/80 border border-slate-700 rounded-xl overflow-hidden"
        >
            {/* Header */}
            <div className="bg-slate-800 px-4 py-3 flex justify-between items-center">
                <span className="text-sm text-text-secondary dark:text-slate-400">{language}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-text-secondary dark:text-slate-400 hover:text-slate-200 transition-colors"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>

            {/* Code */}
            <pre className="p-4 overflow-x-auto">
                <code className="text-slate-300 font-mono text-sm">
                    {lines.map((line, i) => (
                        <div key={i} className="flex gap-4">
                            {showLineNumbers && (
                                <span className="text-slate-600 select-none" style={{ minWidth: '2em' }}>
                                    {i + 1}
                                </span>
                            )}
                            <span>{line}</span>
                        </div>
                    ))}
                    {animated && <span className="animate-pulse">_</span>}
                </code>
            </pre>
        </motion.div>
    );
};
