import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-9xl text-brand-500 font-extrabold mb-4 font-display">404</h1>
        <h2 className="text-3xl font-semibold mb-6 text-text-primary">Page Not Found</h2>
        <p className="text-muted mb-8 max-w-md mx-auto">
          The page you are looking for could not be found.
        </p>
        <a href="/" className="bg-brand-500 hover:bg-brand-400 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block">
          Return Home
        </a>
      </motion.div>
    </div>
  );
}
