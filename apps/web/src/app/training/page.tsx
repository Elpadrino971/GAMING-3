'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Disable static generation
export const dynamic = 'force-dynamic';

interface AIOpponent {
  id: string;
  name: string;
  avatar: string;
  style: 'tight-aggressive' | 'loose-aggressive' | 'tight-passive' | 'loose-passive';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'legend';
  vpip: number; // Voluntarily Put $ In Pot
  pfr: number; // Pre-Flop Raise
  aggression: number; // Aggression Factor
  description: string;
  winRate: string;
  handsPlayed: number;
}

interface TrainingScenario {
  id: string;
  name: string;
  description: string;
  category: 'preflop' | 'flop' | 'turn' | 'river' | 'all-in' | 'tournament';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  icon: string;
  xpReward: number;
  completed: boolean;
}

interface TrainingStats {
  sessionsPlayed: number;
  handsPlayed: number;
  winRate: number;
  profitBB: number; // Profit in Big Blinds per 100 hands
  strongestSkill: string;
  weakestSkill: string;
}

export default function TrainingPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [selectedMode, setSelectedMode] = useState<'opponents' | 'scenarios' | 'analysis'>('opponents');
  const [selectedOpponent, setSelectedOpponent] = useState<AIOpponent | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<TrainingScenario | null>(null);

  // AI Opponents
  const AI_OPPONENTS: AIOpponent[] = [
    {
      id: 'doyle',
      name: 'Doyle "Texas Dolly"',
      avatar: '🤠',
      style: 'tight-aggressive',
      difficulty: 'legend',
      vpip: 22,
      pfr: 18,
      aggression: 3.2,
      description: 'Légende du poker, style Old School agressif et imprévisible',
      winRate: '8.5 BB/100',
      handsPlayed: 50000,
    },
    {
      id: 'phil',
      name: 'Phil "The Poker Brat"',
      avatar: '😎',
      style: 'tight-aggressive',
      difficulty: 'legend',
      vpip: 20,
      pfr: 17,
      aggression: 4.5,
      description: 'Champion du monde, lit les âmes et applique une pression maximale',
      winRate: '9.2 BB/100',
      handsPlayed: 75000,
    },
    {
      id: 'daniel',
      name: 'Daniel "KidPoker"',
      avatar: '🧠',
      style: 'loose-aggressive',
      difficulty: 'expert',
      vpip: 28,
      pfr: 22,
      aggression: 3.8,
      description: 'Joueur agressif et analytique, excellent en lecture d\'adversaires',
      winRate: '7.8 BB/100',
      handsPlayed: 60000,
    },
    {
      id: 'vanessa',
      name: 'Vanessa "Lady Maverick"',
      avatar: '👑',
      style: 'tight-aggressive',
      difficulty: 'expert',
      vpip: 21,
      pfr: 18,
      aggression: 3.5,
      description: 'Joueuse tactique et patiente, excellente en position',
      winRate: '7.5 BB/100',
      handsPlayed: 45000,
    },
    {
      id: 'tom',
      name: 'Tom "Durrrr"',
      avatar: '🎯',
      style: 'loose-aggressive',
      difficulty: 'expert',
      vpip: 32,
      pfr: 25,
      aggression: 4.2,
      description: 'Ultra agressif, maître du High Stakes et des grosses mises',
      winRate: '8.1 BB/100',
      handsPlayed: 55000,
    },
    {
      id: 'sarah',
      name: 'Sarah "The Shark"',
      avatar: '🦈',
      style: 'tight-aggressive',
      difficulty: 'advanced',
      vpip: 23,
      pfr: 19,
      aggression: 3.3,
      description: 'Joueuse calculatrice, spécialiste des tournois',
      winRate: '6.5 BB/100',
      handsPlayed: 35000,
    },
    {
      id: 'mike',
      name: 'Mike "The Maniac"',
      avatar: '🔥',
      style: 'loose-aggressive',
      difficulty: 'intermediate',
      vpip: 42,
      pfr: 35,
      aggression: 5.0,
      description: 'Joueur ultra agressif, bluff constant et imprévisible',
      winRate: '4.2 BB/100',
      handsPlayed: 28000,
    },
    {
      id: 'jenny',
      name: 'Jenny "The Rock"',
      avatar: '🗿',
      style: 'tight-passive',
      difficulty: 'beginner',
      vpip: 15,
      pfr: 8,
      aggression: 1.5,
      description: 'Joueuse très serrée, ne joue que les mains premium',
      winRate: '2.5 BB/100',
      handsPlayed: 15000,
    },
    {
      id: 'chris',
      name: 'Chris "Calling Station"',
      avatar: '📞',
      style: 'loose-passive',
      difficulty: 'beginner',
      vpip: 48,
      pfr: 12,
      aggression: 0.8,
      description: 'Joueur passif qui call trop souvent, facile à exploiter',
      winRate: '-1.5 BB/100',
      handsPlayed: 12000,
    },
  ];

  // Training Scenarios
  const TRAINING_SCENARIOS: TrainingScenario[] = [
    {
      id: 'preflop-basics',
      name: 'Bases du Pré-Flop',
      description: 'Apprenez les ranges de starting hands et le positionnement',
      category: 'preflop',
      difficulty: 'easy',
      icon: '📚',
      xpReward: 100,
      completed: true,
    },
    {
      id: 'cbet-situations',
      name: 'Continuation Bet',
      description: 'Maîtrisez le C-Bet sur différentes textures de flop',
      category: 'flop',
      difficulty: 'medium',
      icon: '🎯',
      xpReward: 250,
      completed: true,
    },
    {
      id: 'bluff-catching',
      name: 'Attraper les Bluffs',
      description: 'Identifiez quand caller avec des mains moyennes',
      category: 'river',
      difficulty: 'hard',
      icon: '🎣',
      xpReward: 400,
      completed: false,
    },
    {
      id: 'threebar-spots',
      name: 'Situations de 3-Bet',
      description: 'Quand et comment 3-better efficacement',
      category: 'preflop',
      difficulty: 'medium',
      icon: '🔺',
      xpReward: 300,
      completed: false,
    },
    {
      id: 'river-decisions',
      name: 'Décisions Rivière',
      description: 'Les spots les plus difficiles : value bet ou fold ?',
      category: 'river',
      difficulty: 'expert',
      icon: '🌊',
      xpReward: 500,
      completed: false,
    },
    {
      id: 'short-stack',
      name: 'Jeu en Short Stack',
      description: 'Stratégies pour jouer avec moins de 20BB',
      category: 'tournament',
      difficulty: 'hard',
      icon: '📉',
      xpReward: 450,
      completed: false,
    },
    {
      id: 'bubble-play',
      name: 'Jeu à la Bulle',
      description: 'Exploitez la bulle d\'un tournoi pour accumuler des jetons',
      category: 'tournament',
      difficulty: 'hard',
      icon: '💭',
      xpReward: 400,
      completed: false,
    },
    {
      id: 'heads-up',
      name: 'Heads-Up Mastery',
      description: 'Dominez en tête-à-tête avec des ranges adaptés',
      category: 'all-in',
      difficulty: 'expert',
      icon: '🎭',
      xpReward: 600,
      completed: false,
    },
  ];

  // Training Stats
  const trainingStats: TrainingStats = {
    sessionsPlayed: 47,
    handsPlayed: 3420,
    winRate: 6.2,
    profitBB: 212.4,
    strongestSkill: 'Pré-Flop',
    weakestSkill: 'River Decisions',
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
      case 'easy':
        return 'text-green-400 border-green-400';
      case 'intermediate':
      case 'medium':
        return 'text-yellow-400 border-yellow-400';
      case 'advanced':
      case 'hard':
        return 'text-orange-400 border-orange-400';
      case 'expert':
        return 'text-red-400 border-red-400';
      case 'legend':
        return 'text-purple-400 border-purple-400';
      default:
        return 'text-gray-400 border-gray-400';
    }
  };

  const getStyleBadge = (style: string) => {
    switch (style) {
      case 'tight-aggressive':
        return { label: 'TAG', color: 'bg-red-600' };
      case 'loose-aggressive':
        return { label: 'LAG', color: 'bg-orange-600' };
      case 'tight-passive':
        return { label: 'TP', color: 'bg-blue-600' };
      case 'loose-passive':
        return { label: 'LP', color: 'bg-green-600' };
      default:
        return { label: 'N/A', color: 'bg-gray-600' };
    }
  };

  const startTrainingWithOpponent = (opponent: AIOpponent) => {
    // TODO: Navigate to training game with selected opponent
    alert(`🎮 Démarrage de la session d'entraînement contre ${opponent.name}!`);
  };

  const startScenario = (scenario: TrainingScenario) => {
    // TODO: Navigate to scenario training
    alert(`📖 Démarrage du scénario: ${scenario.name}!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Retour
          </Link>
          <h1 className="text-4xl font-bold text-white">🎓 Entraînement IA</h1>
          <div className="bg-gray-800 rounded-full px-6 py-2">
            <span className="text-yellow-400 font-bold">
              💰 {user?.totalChips?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        {/* Training Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">📊 Vos Statistiques d'Entraînement</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Sessions</div>
              <div className="text-2xl font-bold text-white">{trainingStats.sessionsPlayed}</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Mains Jouées</div>
              <div className="text-2xl font-bold text-white">{trainingStats.handsPlayed.toLocaleString()}</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Win Rate</div>
              <div className="text-2xl font-bold text-green-400">{trainingStats.winRate}%</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Profit BB/100</div>
              <div className="text-2xl font-bold text-yellow-400">+{trainingStats.profitBB}</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Point Fort</div>
              <div className="text-lg font-bold text-green-400">{trainingStats.strongestSkill}</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">À Améliorer</div>
              <div className="text-lg font-bold text-red-400">{trainingStats.weakestSkill}</div>
            </div>
          </div>
        </motion.div>

        {/* Mode Selector */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setSelectedMode('opponents')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              selectedMode === 'opponents'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            🤖 Adversaires IA
          </button>
          <button
            onClick={() => setSelectedMode('scenarios')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              selectedMode === 'scenarios'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            📖 Scénarios
          </button>
          <button
            onClick={() => setSelectedMode('analysis')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              selectedMode === 'analysis'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            📈 Analyse
          </button>
        </div>

        {/* AI Opponents Mode */}
        {selectedMode === 'opponents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_OPPONENTS.map((opponent, index) => {
              const styleBadge = getStyleBadge(opponent.style);
              return (
                <motion.div
                  key={opponent.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-700 hover:border-yellow-400 transition"
                >
                  {/* Opponent Header */}
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-5xl">{opponent.avatar}</div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getDifficultyColor(opponent.difficulty)}`}>
                          {opponent.difficulty.toUpperCase()}
                        </span>
                        <span className={`${styleBadge.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                          {styleBadge.label}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{opponent.name}</h3>
                    <p className="text-gray-400 text-sm">{opponent.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="p-6 space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <div className="text-gray-400 text-xs mb-1">VPIP</div>
                        <div className="text-white font-bold">{opponent.vpip}%</div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <div className="text-gray-400 text-xs mb-1">PFR</div>
                        <div className="text-white font-bold">{opponent.pfr}%</div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <div className="text-gray-400 text-xs mb-1">AGG</div>
                        <div className="text-white font-bold">{opponent.aggression}</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <div className="text-gray-400 text-xs">Win Rate</div>
                        <div className="text-green-400 font-bold">{opponent.winRate}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs">Mains</div>
                        <div className="text-white font-bold">{(opponent.handsPlayed / 1000).toFixed(0)}k</div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => startTrainingWithOpponent(opponent)}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 py-3 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition"
                    >
                      🎮 S'entraîner
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Training Scenarios Mode */}
        {selectedMode === 'scenarios' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRAINING_SCENARIOS.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className={`bg-gray-800 rounded-2xl p-6 border-2 ${
                  scenario.completed ? 'border-green-500' : 'border-gray-700'
                } hover:border-yellow-400 transition`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{scenario.icon}</div>
                  <div className="flex flex-col items-end space-y-2">
                    {scenario.completed && (
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        ✓ TERMINÉ
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getDifficultyColor(scenario.difficulty)}`}>
                      {scenario.difficulty.toUpperCase()}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{scenario.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{scenario.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gray-900 rounded-lg px-3 py-2">
                    <span className="text-gray-400 text-xs">Catégorie: </span>
                    <span className="text-yellow-400 font-bold text-sm">{scenario.category}</span>
                  </div>
                  <div className="text-yellow-400 font-bold">
                    +{scenario.xpReward} XP
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startScenario(scenario)}
                  className={`w-full py-3 rounded-xl font-bold transition ${
                    scenario.completed
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-500 hover:to-yellow-600'
                  }`}
                >
                  {scenario.completed ? '🔄 Rejouer' : '▶️ Commencer'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Analysis Mode */}
        {selectedMode === 'analysis' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">📈 Analyse de Performance</h2>
              <p className="text-gray-400 mb-6">
                Visualisez votre progression et identifiez les domaines à améliorer
              </p>

              {/* Skills Radar Chart Placeholder */}
              <div className="bg-gray-900 rounded-xl p-8 mb-6">
                <h3 className="text-xl font-bold text-white mb-4 text-center">Compétences par Catégorie</h3>
                <div className="flex justify-center items-center h-64">
                  <div className="text-6xl">📊</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">Pré-Flop</div>
                    <div className="text-2xl font-bold text-green-400">85%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">Post-Flop</div>
                    <div className="text-2xl font-bold text-yellow-400">72%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">Bluff</div>
                    <div className="text-2xl font-bold text-orange-400">68%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">River</div>
                    <div className="text-2xl font-bold text-red-400">54%</div>
                  </div>
                </div>
              </div>

              {/* Recent Sessions */}
              <h3 className="text-xl font-bold text-white mb-4">Dernières Sessions</h3>
              <div className="space-y-3">
                {[
                  { opponent: 'Phil "The Poker Brat"', result: 'Victoire', profit: +450, hands: 125 },
                  { opponent: 'Tom "Durrrr"', result: 'Défaite', profit: -280, hands: 98 },
                  { opponent: 'Daniel "KidPoker"', result: 'Victoire', profit: +320, hands: 142 },
                  { opponent: 'Mike "The Maniac"', result: 'Victoire', profit: +580, hands: 87 },
                ].map((session, index) => (
                  <div key={index} className="bg-gray-900 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`text-2xl ${session.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {session.profit > 0 ? '✓' : '✗'}
                      </div>
                      <div>
                        <div className="text-white font-bold">{session.opponent}</div>
                        <div className="text-gray-400 text-sm">{session.hands} mains jouées</div>
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${session.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {session.profit > 0 ? '+' : ''}{session.profit}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
