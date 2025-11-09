'use client';

import { useState, useEffect } from 'react';
import { Brain, X, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CoachAdvice {
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  timestamp: Date;
}

interface CoachOverlayProps {
  mode: 'light' | 'pro' | 'mentor';
  advice: CoachAdvice[];
  onClose?: () => void;
  isMinimized?: boolean;
}

export default function CoachOverlay({
  mode,
  advice,
  onClose,
  isMinimized = false
}: CoachOverlayProps) {
  const [minimized, setMinimized] = useState(isMinimized);
  const [currentAdvice, setCurrentAdvice] = useState<CoachAdvice | null>(null);

  useEffect(() => {
    // Affiche le dernier conseil avec la priorité la plus élevée
    if (advice.length > 0) {
      const highPriority = advice.find(a => a.priority === 'critical' || a.priority === 'high');
      setCurrentAdvice(highPriority || advice[advice.length - 1]);
    }
  }, [advice]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case 'medium':
        return <TrendingUp className="w-6 h-6 text-yellow-500" />;
      default:
        return <Brain className="w-6 h-6 text-green-500" />;
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'light':
        return '🥉 Coaching Léger';
      case 'pro':
        return '🥈 Analyse Pro';
      case 'mentor':
        return '🥇 Mentor Live';
    }
  };

  if (minimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <button
          onClick={() => setMinimized(false)}
          className="p-4 bg-poker-gold rounded-full shadow-xl hover:scale-110 transition-transform"
        >
          <Brain className="w-6 h-6 text-gray-900" />
        </button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        className={`coach-overlay ${currentAdvice ? getPriorityColor(currentAdvice.priority) : 'border-poker-gold bg-white dark:bg-gray-800'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-poker-gold" />
            <h3 className="font-bold text-gray-900 dark:text-white">
              {getModeLabel()}
            </h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setMinimized(true)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              _
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Current Advice */}
        {currentAdvice && (
          <div className="mb-4">
            <div className="flex items-start space-x-3">
              {getPriorityIcon(currentAdvice.priority)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {currentAdvice.category}
                </p>
                <p className="text-gray-900 dark:text-white">
                  {currentAdvice.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Advice History */}
        {advice.length > 1 && (
          <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Conseils récents
            </p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {advice.slice(-3).reverse().map((item, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-600 dark:text-gray-300 p-2 rounded bg-gray-100 dark:bg-gray-700"
                >
                  {item.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mode Indicator */}
        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>PokerMind AI</span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              En ligne
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
