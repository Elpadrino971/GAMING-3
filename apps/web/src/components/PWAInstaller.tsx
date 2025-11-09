'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PWA Installer Component
 * Registers service worker and provides install prompt
 */
export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed in session
    if (typeof window !== 'undefined') {
      const isDismissed = sessionStorage.getItem('install-prompt-dismissed') === 'true';
      setDismissed(isDismissed);
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ Service Worker registered:', registration);
          })
          .catch((error) => {
            console.log('❌ Service Worker registration failed:', error);
          });
      });
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent default install prompt
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
      // Show custom install button after 3 seconds
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('✅ Running as installed PWA');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('✅ User accepted the install prompt');
    } else {
      console.log('❌ User dismissed the install prompt');
    }

    // Clear the prompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDismissed(true);
    // Don't show again for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('install-prompt-dismissed', 'true');
    }
  };

  // Don't show if already dismissed this session
  if (dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      {showInstallPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-gradient-to-br from-poker-green to-emerald-800 rounded-2xl shadow-2xl border-2 border-yellow-400 p-6">
            <div className="flex items-start space-x-3">
              <div className="text-4xl">🎰</div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1">
                  Install PokerMind
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Install our app for the best experience. Play offline, get notifications, and quick access!
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg transition"
                  >
                    Install
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                  >
                    Not now
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
