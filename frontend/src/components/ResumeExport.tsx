import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Menu } from 'lucide-react';
import type { ResumeData } from '../utils/resumeExport';
import { exportToPDF, exportToWord, exportAsJSON, exportAsATS } from '../utils/resumeExport';

interface ResumeExportProps {
    resumeData: ResumeData;
}

/**
 * Dynamic Resume Export Component
 * Suggestion #20: Dynamic Resume Export
 */
export default function ResumeExport({ resumeData }: ResumeExportProps) {
    const [isOpen, setIsOpen] = useState(false);

    const exportOptions = [
        {
            label: 'Download PDF',
            icon: FileText,
            action: () => exportToPDF(resumeData),
            color: 'text-red-500'
        },
        {
            label: 'Download Word',
            icon: FileText,
            action: () => exportToWord(resumeData),
            color: 'text-blue-500'
        },
        {
            label: 'Download JSON',
            icon: Download,
            action: () => exportAsJSON(resumeData),
            color: 'text-yellow-500'
        },
        {
            label: 'ATS Format',
            icon: FileText,
            action: () => exportAsATS(resumeData),
            color: 'text-green-500'
        }
    ];

    return (
        <div className="fixed bottom-24 right-8 z-40 md:bottom-auto md:top-24">
            <div className="relative">
                {/* Menu Items */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute bottom-16 right-0 bg-surface rounded-lg shadow-2xl overflow-hidden border border-stroke/30 backdrop-blur-md"
                        >
                            <div className="p-2 space-y-2">
                                {exportOptions.map((option, index) => (
                                    <motion.button
                                        key={option.label}
                                        onClick={() => {
                                            option.action();
                                            setIsOpen(false);
                                        }}
                                        initial={{ x: 10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="w-full px-4 py-2 flex items-center gap-3 rounded-lg hover:bg-surface/80 transition-colors text-left"
                                    >
                                        <option.icon size={18} className={option.color} />
                                        <span className="text-sm font-medium text-text-primary">
                                            {option.label}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Button */}
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-full bg-surface border border-stroke/30 backdrop-blur-md hover:bg-surface/80 transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
                    title="Export Resume"
                >
                    <motion.div
                        animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isOpen ? <Menu size={20} /> : <Download size={20} />}
                    </motion.div>
                </motion.button>
            </div>
        </div>
    );
}
