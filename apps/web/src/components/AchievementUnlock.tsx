'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Achievement, getTierColor, getTierBadge } from '@/lib/achievements';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface AchievementUnlockProps {
  achievement: Achievement;
  onClose: () => void;
}

/**
 * Notification animée quand un achievement est débloqué
 */
export default function AchievementUnlock({ achievement, onClose }: AchievementUnlockProps) {
  useEffect(() => {
    // Confetti animation !
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 3,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#FF6347']
      });
    }, 50);

    // Auto-close après 5 secondes
    const timeout = setTimeout(onClose, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: -100 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        className="fixed bottom-8 right-8 z-50 max-w-md"
      >
        <div className={`bg-gradient-to-br ${getTierColor(achievement.tier)} rounded-2xl p-6 shadow-2xl border-4 border-white`}>
          {/* Header */}
          <div className="text-center mb-4">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-6xl mb-2"
            >
              {achievement.icon}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-white text-sm font-semibold mb-1 flex items-center justify-center space-x-2">
                <span>ACHIEVEMENT UNLOCKED</span>
                <span>{getTierBadge(achievement.tier)}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {achievement.name}
              </h3>
              <p className="text-white/90 text-sm">
                {achievement.description}
              </p>
            </motion.div>
          </div>

          {/* Rewards */}
          {(achievement.reward.chips || achievement.reward.xp) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex justify-center space-x-4"
            >
              {achievement.reward.chips && (
                <div className="text-center">
                  <div className="text-white font-bold text-lg">
                    +{achievement.reward.chips}
                  </div>
                  <div className="text-white/80 text-xs">Chips</div>
                </div>
              )}
              {achievement.reward.xp && (
                <div className="text-center">
                  <div className="text-white font-bold text-lg">
                    +{achievement.reward.xp}
                  </div>
                  <div className="text-white/80 text-xs">XP</div>
                </div>
              )}
            </motion.div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white transition"
          >
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
