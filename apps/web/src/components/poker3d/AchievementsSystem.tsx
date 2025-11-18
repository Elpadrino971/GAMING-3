'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'wins' | 'hands' | 'special' | 'skill' | 'social';
  requirement: number;
  progress: number;
  unlocked: boolean;
  xp: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface PlayerProgress {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  achievements: Achievement[];
  titles: string[];
  currentTitle: string;
}

// XP calculation
export function calculateLevel(totalXP: number): { level: number; currentXP: number; xpToNextLevel: number } {
  let level = 1;
  let xpNeeded = 100;
  let currentXP = totalXP;

  while (currentXP >= xpNeeded) {
    currentXP -= xpNeeded;
    level++;
    xpNeeded = Math.floor(xpNeeded * 1.5); // Exponential scaling
  }

  return { level, currentXP, xpToNextLevel: xpNeeded };
}

// Sample achievements
export const ALL_ACHIEVEMENTS: Achievement[] = [
  // Wins
  {
    id: 'first-win',
    name: 'First Blood',
    description: 'Win your first hand',
    icon: '🎯',
    category: 'wins',
    requirement: 1,
    progress: 0,
    unlocked: false,
    xp: 50,
    rarity: 'common',
  },
  {
    id: 'win-10',
    name: 'Hot Streak',
    description: 'Win 10 hands',
    icon: '🔥',
    category: 'wins',
    requirement: 10,
    progress: 0,
    unlocked: false,
    xp: 200,
    rarity: 'common',
  },
  {
    id: 'win-100',
    name: 'Centurion',
    description: 'Win 100 hands',
    icon: '💯',
    category: 'wins',
    requirement: 100,
    progress: 0,
    unlocked: false,
    xp: 1000,
    rarity: 'rare',
  },

  // Hands
  {
    id: 'royal-flush',
    name: 'Royal Treatment',
    description: 'Get a Royal Flush',
    icon: '👑',
    category: 'hands',
    requirement: 1,
    progress: 0,
    unlocked: false,
    xp: 500,
    rarity: 'legendary',
  },
  {
    id: 'quad-aces',
    name: 'Four Horsemen',
    description: 'Get Four Aces',
    icon: '🃏',
    category: 'hands',
    requirement: 1,
    progress: 0,
    unlocked: false,
    xp: 300,
    rarity: 'epic',
  },

  // Special
  {
    id: 'all-in-win',
    name: 'Risk Taker',
    description: 'Win an all-in',
    icon: '🚀',
    category: 'special',
    requirement: 1,
    progress: 0,
    unlocked: false,
    xp: 150,
    rarity: 'rare',
  },
  {
    id: 'bluff-master',
    name: 'Bluff Master',
    description: 'Win 20 hands by bluffing',
    icon: '🎭',
    category: 'special',
    requirement: 20,
    progress: 0,
    unlocked: false,
    xp: 400,
    rarity: 'epic',
  },
  {
    id: 'shark-hunter',
    name: 'Shark Hunter',
    description: 'Beat Phil Ivey AI 10 times',
    icon: '🦈',
    category: 'special',
    requirement: 10,
    progress: 0,
    unlocked: false,
    xp: 600,
    rarity: 'epic',
  },

  // Skill
  {
    id: 'perfect-fold',
    name: 'Perfect Fold',
    description: 'Fold a hand that would have lost',
    icon: '🧠',
    category: 'skill',
    requirement: 1,
    progress: 0,
    unlocked: false,
    xp: 100,
    rarity: 'rare',
  },
  {
    id: 'comeback-king',
    name: 'Comeback King',
    description: 'Win after being down to last 100 chips',
    icon: '👑',
    category: 'skill',
    requirement: 1,
    progress: 0,
    unlocked: false,
    xp: 500,
    rarity: 'legendary',
  },

  // Social
  {
    id: 'friendly',
    name: 'Social Butterfly',
    description: 'Play 10 games with friends',
    icon: '🦋',
    category: 'social',
    requirement: 10,
    progress: 0,
    unlocked: false,
    xp: 200,
    rarity: 'common',
  },
];

// Achievement notification
export function AchievementUnlock({ achievement }: { achievement: Achievement }) {
  const rarityColors = {
    common: 'from-gray-600 to-gray-700',
    rare: 'from-blue-600 to-blue-700',
    epic: 'from-purple-600 to-purple-700',
    legendary: 'from-yellow-600 to-orange-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.5 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5 }}
      className={`bg-gradient-to-r ${rarityColors[achievement.rarity]} border-4 border-yellow-400 rounded-xl p-6 shadow-2xl max-w-md`}
    >
      <div className="flex items-center gap-4">
        <div className="text-6xl">{achievement.icon}</div>
        <div className="flex-1">
          <div className="text-yellow-400 text-xs font-bold uppercase">Achievement Unlocked!</div>
          <div className="text-white text-2xl font-bold">{achievement.name}</div>
          <div className="text-gray-300 text-sm">{achievement.description}</div>
          <div className="text-yellow-300 text-lg font-bold mt-2">+{achievement.xp} XP</div>
        </div>
      </div>
    </motion.div>
  );
}

// XP Bar
export function XPBar({ progress }: PlayerProgress) {
  const percentage = (progress.currentXP / progress.xpToNextLevel) * 100;

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 border-2 border-yellow-400">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold text-yellow-400">LVL {progress.level}</div>
          <div className="text-white">
            <div className="text-sm text-gray-400">XP</div>
            <div className="font-bold">
              {progress.currentXP} / {progress.xpToNextLevel}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-gray-400 text-xs">Total XP</div>
          <div className="text-yellow-400 font-bold">{progress.totalXP.toLocaleString()}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
        />
      </div>

      {/* Current title */}
      {progress.currentTitle && (
        <div className="mt-2 text-center">
          <span className="text-purple-400 text-sm">
            ✨ {progress.currentTitle} ✨
          </span>
        </div>
      )}
    </div>
  );
}

// Achievements Grid
export function AchievementsGrid({ achievements }: { achievements: Achievement[] }) {
  const [filter, setFilter] = useState<Achievement['category'] | 'all'>('all');

  const filtered = filter === 'all' ? achievements : achievements.filter((a) => a.category === filter);

  const categoryIcons = {
    all: '🏆',
    wins: '🎯',
    hands: '🃏',
    special: '⭐',
    skill: '🧠',
    social: '👥',
  };

  return (
    <div>
      {/* Category filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all', 'wins', 'hands', 'special', 'skill', 'social'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === cat
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            {categoryIcons[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((achievement) => {
          const progress = (achievement.progress / achievement.requirement) * 100;
          const rarityColors = {
            common: 'border-gray-500',
            rare: 'border-blue-500',
            epic: 'border-purple-500',
            legendary: 'border-yellow-500',
          };

          return (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.05 }}
              className={`bg-gray-800 rounded-xl p-4 border-2 ${
                achievement.unlocked ? rarityColors[achievement.rarity] : 'border-gray-700'
              } ${!achievement.unlocked && 'opacity-50 grayscale'}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-4xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="text-white font-bold">{achievement.name}</div>
                  <div className="text-gray-400 text-xs mb-2">{achievement.description}</div>

                  {/* Progress */}
                  {!achievement.unlocked && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>
                          {achievement.progress} / {achievement.requirement}
                        </span>
                        <span>{Math.floor(progress)}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Rewards */}
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 text-sm font-bold">+{achievement.xp} XP</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        achievement.rarity === 'legendary'
                          ? 'bg-yellow-900 text-yellow-300'
                          : achievement.rarity === 'epic'
                          ? 'bg-purple-900 text-purple-300'
                          : achievement.rarity === 'rare'
                          ? 'bg-blue-900 text-blue-300'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {achievement.rarity}
                    </span>
                  </div>

                  {achievement.unlocked && (
                    <div className="mt-2 text-green-400 text-sm font-bold flex items-center gap-1">
                      ✓ Unlocked
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Level up animation
export function LevelUpAnimation({ newLevel }: { newLevel: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
      transition={{ duration: 1, type: 'spring' }}
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 border-8 border-white rounded-3xl p-12 shadow-2xl">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce">🎉</div>
          <div className="text-white text-6xl font-bold mb-4">LEVEL UP!</div>
          <div className="text-yellow-200 text-8xl font-bold">{newLevel}</div>
        </div>
      </div>
    </motion.div>
  );
}

// Hook to manage achievements
export function useAchievements() {
  const [progress, setProgress] = useState<PlayerProgress>({
    level: 1,
    currentXP: 0,
    xpToNextLevel: 100,
    totalXP: 0,
    achievements: ALL_ACHIEVEMENTS,
    titles: [],
    currentTitle: '',
  });

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);

  const addXP = (amount: number) => {
    const newTotalXP = progress.totalXP + amount;
    const { level, currentXP, xpToNextLevel } = calculateLevel(newTotalXP);

    if (level > progress.level) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }

    setProgress((prev) => ({
      ...prev,
      level,
      currentXP,
      xpToNextLevel,
      totalXP: newTotalXP,
    }));
  };

  const unlockAchievement = (achievementId: string) => {
    const achievement = progress.achievements.find((a) => a.id === achievementId);
    if (!achievement || achievement.unlocked) return;

    achievement.unlocked = true;
    setUnlockedAchievements((prev) => [...prev, achievement]);
    addXP(achievement.xp);

    setTimeout(() => {
      setUnlockedAchievements((prev) => prev.filter((a) => a.id !== achievementId));
    }, 5000);
  };

  return {
    progress,
    addXP,
    unlockAchievement,
    showLevelUp,
    unlockedAchievements,
  };
}
