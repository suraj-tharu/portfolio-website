import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if user already dismissed or installed
    const hasDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (hasDismissed) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Optionally, show the prompt after a slight delay so it doesn't interrupt initial load
      setTimeout(() => {
        setShowPrompt(true);
      }, 10000); // 10 seconds
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-[var(--surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-2xl shadow-2xl z-[9999] overflow-hidden"
        >
          {/* Glassmorphic sheen */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          
          <div className="p-6 relative">
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--text)] transition-colors p-1"
            >
              <X size={18} />
            </button>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
                <Smartphone className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)] text-lg mb-1">Install App</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
                  Install this portfolio to your home screen for offline reading and a native app experience.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 bg-[var(--text)] text-[var(--bg)] px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <Download size={16} />
                    Install
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-2 rounded-lg font-medium text-sm text-[var(--muted)] hover:bg-[var(--surface-hover)] transition-colors border border-[var(--border)]"
                  >
                    Not Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
