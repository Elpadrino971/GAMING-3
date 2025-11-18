'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface TrainingLevel {
  id: string;
  name: string;
  difficulty: number; // 1-10
  description: string;
  aiPersonality: string;
  aiStyle: string;
  unlockRequirement: string;
  rewards: { xp: number; coins: number };
  scenarios: TrainingScenario[];
  completed: boolean;
  stars: number; // 0-3
  icon: string;
}

export interface TrainingScenario {
  id: string;
  name: string;
  description: string;
  objective: string;
  startingStack: number;
  blinds: { small: number; big: number };
  opponentCount: number;
  timeLimit?: number;
  successCondition: string;
}

export interface TrainingProgress {
  level: number;
  totalXP: number;
  completedLevels: string[];
  currentStreak: number;
  bestStreak: number;
  totalHandsPlayed: number;
  winRate: number;
  skillRating: number; // 0-2000 ELO-style
}

// AI Training Manager
export class AITrainingManager {
  private static instance: AITrainingManager;

  private constructor() {}

  static getInstance(): AITrainingManager {
    if (!AITrainingManager.instance) {
      AITrainingManager.instance = new AITrainingManager();
    }
    return AITrainingManager.instance;
  }

  getLevels(): TrainingLevel[] {
    return TRAINING_LEVELS;
  }

  evaluatePerformance(handsPlayed: number, winRate: number, mistakes: number): number {
    const baseScore = winRate * 100;
    const efficiency = Math.max(0, 100 - mistakes * 10);
    const speed = Math.min(100, (handsPlayed / 10) * 20);

    return Math.floor((baseScore + efficiency + speed) / 3);
  }

  calculateStars(score: number): number {
    if (score >= 90) return 3;
    if (score >= 70) return 2;
    if (score >= 50) return 1;
    return 0;
  }
}

// Training Levels Data
const TRAINING_LEVELS: TrainingLevel[] = [
  {
    id: 'beginner-1',
    name: 'Bases du Poker',
    difficulty: 1,
    description: 'Apprenez les règles fondamentales',
    aiPersonality: 'Friendly Teacher',
    aiStyle: 'Very Passive',
    unlockRequirement: 'Débloqué par défaut',
    rewards: { xp: 100, coins: 500 },
    scenarios: [
      {
        id: 's1',
        name: 'Mains de départ',
        description: 'Apprenez à reconnaître les bonnes mains',
        objective: 'Gagnez 3 mains avec des paires ou mieux',
        startingStack: 1000,
        blinds: { small: 5, big: 10 },
        opponentCount: 1,
        successCondition: 'Win 3 hands',
      },
    ],
    completed: false,
    stars: 0,
    icon: '📚',
  },
  {
    id: 'beginner-2',
    name: 'Position et Pot Odds',
    difficulty: 2,
    description: 'Comprenez l\'importance de la position',
    aiPersonality: 'Patient Mentor',
    aiStyle: 'Passive',
    unlockRequirement: 'Complétez Bases du Poker',
    rewards: { xp: 200, coins: 1000 },
    scenarios: [],
    completed: false,
    stars: 0,
    icon: '🎯',
  },
  {
    id: 'intermediate-1',
    name: 'Bluff et Semi-Bluff',
    difficulty: 4,
    description: 'Maîtrisez l\'art du bluff',
    aiPersonality: 'Aggressive Challenger',
    aiStyle: 'Aggressive',
    unlockRequirement: 'Skill Rating: 600+',
    rewards: { xp: 400, coins: 2500 },
    scenarios: [],
    completed: false,
    stars: 0,
    icon: '🎭',
  },
  {
    id: 'intermediate-2',
    name: 'ICM et Tournois',
    difficulty: 5,
    description: 'Stratégie de tournoi avancée',
    aiPersonality: 'Tournament Pro',
    aiStyle: 'Tight-Aggressive',
    unlockRequirement: 'Skill Rating: 800+',
    rewards: { xp: 600, coins: 5000 },
    scenarios: [],
    completed: false,
    stars: 0,
    icon: '🏆',
  },
  {
    id: 'advanced-1',
    name: 'GTO Basics',
    difficulty: 7,
    description: 'Introduction à la théorie des jeux',
    aiPersonality: 'GTO Bot',
    aiStyle: 'Game Theory Optimal',
    unlockRequirement: 'Skill Rating: 1200+',
    rewards: { xp: 1000, coins: 10000 },
    scenarios: [],
    completed: false,
    stars: 0,
    icon: '🧠',
  },
  {
    id: 'advanced-2',
    name: 'Range Analysis',
    difficulty: 8,
    description: 'Analyse avancée des ranges',
    aiPersonality: 'Range Expert',
    aiStyle: 'Exploitative',
    unlockRequirement: 'Skill Rating: 1500+',
    rewards: { xp: 1500, coins: 15000 },
    scenarios: [],
    completed: false,
    stars: 0,
    icon: '📊',
  },
  {
    id: 'expert-1',
    name: 'Multi-Street Strategy',
    difficulty: 9,
    description: 'Pensée complexe multi-tours',
    aiPersonality: 'High Stakes Pro',
    aiStyle: 'Aggressive-Exploitative',
    unlockRequirement: 'Skill Rating: 1700+',
    rewards: { xp: 2500, coins: 25000 },
    scenarios: [],
    completed: false,
    stars: 0,
    icon: '💎',
  },
  {
    id: 'master-1',
    name: 'Boss Final: Phil Ivey',
    difficulty: 10,
    description: 'Affrontez le meilleur du monde',
    aiPersonality: 'Phil Ivey Clone',
    aiStyle: 'World Champion',
    unlockRequirement: 'Skill Rating: 1900+',
    rewards: { xp: 5000, coins: 50000 },
    scenarios: [],
    completed: false,
    stars: 0,
    icon: '👑',
  },
];

// Training Hub
export function TrainingHub() {
  const [progress, setProgress] = useState<TrainingProgress>({
    level: 1,
    totalXP: 0,
    completedLevels: [],
    currentStreak: 0,
    bestStreak: 0,
    totalHandsPlayed: 0,
    winRate: 0,
    skillRating: 400,
  });

  const levels = AITrainingManager.getInstance().getLevels();

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'from-green-500 to-emerald-500';
    if (difficulty <= 4) return 'from-blue-500 to-cyan-500';
    if (difficulty <= 6) return 'from-purple-500 to-pink-500';
    if (difficulty <= 8) return 'from-orange-500 to-red-500';
    return 'from-red-600 to-red-900';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-white font-bold text-5xl mb-2">🤖 AI Training Academy</h1>
        <div className="text-blue-300 text-xl">Améliorez vos compétences avec l'IA</div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 border-2 border-blue-400">
          <div className="text-blue-300 text-sm mb-1">Skill Rating</div>
          <div className="text-white text-4xl font-bold">{progress.skillRating}</div>
        </div>

        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-6 border-2 border-green-400">
          <div className="text-green-300 text-sm mb-1">Win Rate</div>
          <div className="text-white text-4xl font-bold">{progress.winRate.toFixed(1)}%</div>
        </div>

        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-6 border-2 border-purple-400">
          <div className="text-purple-300 text-sm mb-1">Niveaux Complétés</div>
          <div className="text-white text-4xl font-bold">{progress.completedLevels.length}/8</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-900 to-orange-800 rounded-xl p-6 border-2 border-yellow-400">
          <div className="text-yellow-300 text-sm mb-1">Meilleure Série</div>
          <div className="text-white text-4xl font-bold">🔥 {progress.bestStreak}</div>
        </div>
      </div>

      {/* Training Levels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {levels.map((level) => (
          <TrainingLevelCard key={level.id} level={level} progress={progress} />
        ))}
      </div>
    </div>
  );
}

// Training Level Card
function TrainingLevelCard({ level, progress }: { level: TrainingLevel; progress: TrainingProgress }) {
  const isUnlocked = level.id === 'beginner-1' || progress.completedLevels.includes(level.id);
  const isLocked = !isUnlocked;

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'from-green-500 to-emerald-500';
    if (difficulty <= 4) return 'from-blue-500 to-cyan-500';
    if (difficulty <= 6) return 'from-purple-500 to-pink-500';
    if (difficulty <= 8) return 'from-orange-500 to-red-500';
    return 'from-red-600 to-red-900';
  };

  return (
    <motion.div
      whileHover={isUnlocked ? { scale: 1.05 } : {}}
      className={`bg-gradient-to-br ${getDifficultyColor(level.difficulty)} rounded-2xl p-1 ${
        isLocked ? 'opacity-50' : ''
      }`}
    >
      <div className="bg-gray-900 rounded-xl p-6">
        {/* Icon & Lock */}
        <div className="text-center mb-4 relative">
          <div className="text-6xl">{isLocked ? '🔒' : level.icon}</div>
          {level.completed && (
            <div className="absolute top-0 right-0 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
              ✓
            </div>
          )}
        </div>

        {/* Name */}
        <div className="text-white font-bold text-xl mb-2 text-center">{level.name}</div>

        {/* Difficulty */}
        <div className="flex justify-center mb-3">
          <div className={`px-4 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(level.difficulty)} text-white text-sm font-bold`}>
            {'★'.repeat(level.difficulty)}
          </div>
        </div>

        {/* Description */}
        <div className="text-gray-400 text-sm mb-4 text-center">{level.description}</div>

        {/* AI Info */}
        <div className="bg-gray-800 rounded-lg p-3 mb-4">
          <div className="text-gray-400 text-xs mb-1">Adversaire:</div>
          <div className="text-white text-sm font-semibold">{level.aiPersonality}</div>
          <div className="text-purple-400 text-xs">{level.aiStyle}</div>
        </div>

        {/* Rewards */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-blue-900/50 rounded-lg p-2 text-center">
            <div className="text-blue-400 text-xs">XP</div>
            <div className="text-white font-bold">+{level.rewards.xp}</div>
          </div>
          <div className="flex-1 bg-yellow-900/50 rounded-lg p-2 text-center">
            <div className="text-yellow-400 text-xs">Coins</div>
            <div className="text-white font-bold">{level.rewards.coins}</div>
          </div>
        </div>

        {/* Stars */}
        {level.completed && (
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3].map((star) => (
              <div key={star} className={`text-2xl ${star <= level.stars ? 'text-yellow-400' : 'text-gray-600'}`}>
                ★
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        {isUnlocked ? (
          <button className={`w-full py-3 rounded-xl font-bold transition ${
            level.completed
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
          }`}>
            {level.completed ? '🔄 Rejouer' : '▶️ Commencer'}
          </button>
        ) : (
          <div className="text-center">
            <div className="text-gray-500 text-sm mb-2">{level.unlockRequirement}</div>
            <div className="bg-gray-700 text-gray-400 py-3 rounded-xl font-bold">🔒 Verrouillé</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Training Session Screen
export function TrainingSession({ level }: { level: TrainingLevel }) {
  const [sessionActive, setSessionActive] = useState(true);
  const [hints, setHints] = useState<string[]>([]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-purple-900 z-50">
      {/* Top Bar */}
      <div className="bg-black/50 backdrop-blur-sm p-4 flex justify-between items-center">
        <div>
          <div className="text-white font-bold text-xl">{level.name}</div>
          <div className="text-gray-400 text-sm">{level.aiPersonality}</div>
        </div>

        <div className="flex gap-4">
          <div className="bg-blue-900 px-4 py-2 rounded-lg">
            <div className="text-blue-300 text-xs">Objectif</div>
            <div className="text-white font-bold">Gagnez 3 mains</div>
          </div>

          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold">
            ❌ Quitter
          </button>
        </div>
      </div>

      {/* Training Hints */}
      <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 border-4 border-blue-400 rounded-2xl p-6">
          <div className="text-blue-300 font-bold mb-2">💡 Conseil de l'IA:</div>
          <div className="text-white text-lg">
            Avec une paire d'As, vous devriez toujours relancer en pré-flop pour construire le pot.
          </div>
        </div>
      </div>
    </div>
  );
}

// Practice Mode (Free Play)
export function PracticeMode() {
  return (
    <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-400">
      <h3 className="text-green-400 font-bold text-2xl mb-4">🎮 Mode Pratique</h3>

      <div className="space-y-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-white font-semibold mb-2">Partie Rapide</div>
          <div className="text-gray-400 text-sm mb-3">Jouez contre l'IA sans limites</div>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold">
            Démarrer
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-white font-semibold mb-2">Situation Personnalisée</div>
          <div className="text-gray-400 text-sm mb-3">Créez votre propre scénario</div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold">
            Créer
          </button>
        </div>
      </div>
    </div>
  );
}
