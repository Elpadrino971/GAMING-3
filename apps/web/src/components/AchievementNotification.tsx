'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Target, TrendingUp } from 'lucide-react';

interface Achievement {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementNotification({
  achievement,
  onClose
}: AchievementNotificationProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-600';
      case 'rare':
        return 'from-blue-400 to-blue-600';
      case 'epic':
        return 'from-purple-400 to-purple-600';
      case 'legendary':
        return 'from-yellow-400 to-orange-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'HANDS_PLAYED':
        return <Trophy className="w-12 h-12" />;
      case 'IDI_MILESTONE':
        return <Star className="w-12 h-12" />;
      case 'PERFECT_SESSION':
        return <Target className="w-12 h-12" />;
      case 'WINNINGS':
        return <TrendingUp className="w-12 h-12" />;
      default:
        return <Trophy className="w-12 h-12" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0, scale: 0.8 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: 400, opacity: 0, scale: 0.8 }}
        className="fixed top-4 right-4 z-50 max-w-sm"
      >
        <div className={`bg-gradient-to-br ${getRarityColor(achievement.rarity)} p-1 rounded-xl shadow-2xl`}>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`bg-gradient-to-br ${getRarityColor(achievement.rarity)} p-3 rounded-full text-white`}>
                {getIcon(achievement.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Achievement Unlocked!
                </p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {achievement.name}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {achievement.description}
            </p>

            {/* Rarity badge */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}>
                {achievement.rarity.toUpperCase()}
              </span>

              <button
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Fermer
              </button>
            </div>

            {/* Confetti effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-poker-gold rounded-full"
                  initial={{
                    x: '50%',
                    y: '50%',
                    scale: 0
                  }}
                  animate={{
                    x: `${Math.random() * 200 - 100}%`,
                    y: `${Math.random() * 200 - 100}%`,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.05
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
