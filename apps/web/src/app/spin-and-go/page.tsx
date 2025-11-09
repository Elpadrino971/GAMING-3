'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Disable static generation
export const dynamic = 'force-dynamic';

interface SpinAndGo {
  id: string;
  buyIn: number;
  prizePool: number;
  multiplier: number;
  speed: 'hyper-turbo' | 'ultra-turbo' | 'turbo';
  players: number; // Always 3 for Spin & Go
  status: 'waiting' | 'starting' | 'running';
  jackpot?: boolean;
}

interface MultiplierChance {
  multiplier: number;
  prizePool: number;
  probability: number;
  color: string;
  icon: string;
}

export default function SpinAndGoPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [selectedBuyIn, setSelectedBuyIn] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState<number | null>(null);

  // Available buy-ins
  const BUY_INS = [1, 5, 10, 25, 50, 100, 250, 500];

  // Multiplier probability table
  const MULTIPLIERS: MultiplierChance[] = [
    { multiplier: 12000, prizePool: 0, probability: 0.00001, color: 'from-yellow-400 to-yellow-600', icon: '💎' },
    { multiplier: 240, prizePool: 0, probability: 0.001, color: 'from-purple-500 to-pink-500', icon: '🌟' },
    { multiplier: 120, prizePool: 0, probability: 0.005, color: 'from-red-500 to-orange-500', icon: '🔥' },
    { multiplier: 25, prizePool: 0, probability: 0.02, color: 'from-orange-500 to-yellow-500', icon: '⚡' },
    { multiplier: 10, prizePool: 0, probability: 0.1, color: 'from-blue-500 to-cyan-500', icon: '💫' },
    { multiplier: 5, prizePool: 0, probability: 0.3, color: 'from-green-500 to-emerald-500', icon: '✨' },
    { multiplier: 3, prizePool: 0, probability: 0.5, color: 'from-teal-500 to-green-500', icon: '⭐' },
    { multiplier: 2, prizePool: 0, probability: 0.074, color: 'from-gray-500 to-slate-500', icon: '🎯' },
  ];

  // Active Spin & Go tables
  const ACTIVE_SPINS: SpinAndGo[] = [
    {
      id: 'spin-1',
      buyIn: 10,
      prizePool: 300,
      multiplier: 10,
      speed: 'hyper-turbo',
      players: 2,
      status: 'waiting',
    },
    {
      id: 'spin-2',
      buyIn: 25,
      prizePool: 1500,
      multiplier: 20,
      speed: 'hyper-turbo',
      players: 3,
      status: 'running',
    },
    {
      id: 'spin-3',
      buyIn: 50,
      prizePool: 2500,
      multiplier: 5,
      speed: 'ultra-turbo',
      players: 1,
      status: 'waiting',
    },
    {
      id: 'spin-4',
      buyIn: 100,
      prizePool: 120000,
      multiplier: 120,
      speed: 'hyper-turbo',
      players: 3,
      status: 'running',
      jackpot: true,
    },
  ];

  const handleSpin = () => {
    setIsSpinning(true);

    // Simulate random multiplier selection
    setTimeout(() => {
      const random = Math.random();
      let cumulativeProbability = 0;

      for (const mult of MULTIPLIERS) {
        cumulativeProbability += mult.probability;
        if (random <= cumulativeProbability) {
          setCurrentMultiplier(mult.multiplier);
          break;
        }
      }

      setIsSpinning(false);
    }, 3000);
  };

  const calculatePrizePool = (buyIn: number, multiplier: number) => {
    return buyIn * 3 * multiplier; // 3 players
  };

  const getPrizeDistribution = (prizePool: number, multiplier: number) => {
    if (multiplier >= 25) {
      // Winner takes all for high multipliers
      return {
        first: prizePool,
        second: 0,
        third: 0,
      };
    } else {
      // Standard distribution
      return {
        first: prizePool * 0.75,
        second: prizePool * 0.25,
        third: 0,
      };
    }
  };

  const handleRegister = (buyIn: number) => {
    alert(`🎰 Inscription au Spin & Go ${buyIn}$ !\n\nEn attente de 2 autres joueurs...\nLancement dans quelques secondes !`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Retour
          </Link>
          <div className="text-center">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 mb-2">
              🎰 SPIN & GO
            </h1>
            <p className="text-gray-300 text-lg">Tournois 3-Max Ultra-Rapides - Gagnez jusqu'à 12 000x votre buy-in !</p>
          </div>
          <div className="bg-gray-800 rounded-full px-6 py-2">
            <span className="text-yellow-400 font-bold">
              💰 {user?.totalChips?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-6 mb-8 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-3">⚡ Format Hyper-Turbo 3 Joueurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-white font-bold">3-5 minutes</div>
              <div className="text-pink-200 text-sm">Durée moyenne</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <div className="text-3xl mb-2">🎲</div>
              <div className="text-white font-bold">Multiplicateur Aléatoire</div>
              <div className="text-pink-200 text-sm">x2 à x12 000</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-white font-bold">3 Joueurs</div>
              <div className="text-pink-200 text-sm">Winner takes all*</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <div className="text-3xl mb-2">💎</div>
              <div className="text-white font-bold">Jackpot</div>
              <div className="text-pink-200 text-sm">Jusqu'à $120 000+</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Multiplier Wheel */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-2xl p-8"
            >
              <h2 className="text-3xl font-bold text-white text-center mb-6">🎡 Table des Multiplicateurs</h2>

              {/* Multiplier Display */}
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-12 text-center border-4 border-yellow-400">
                  <AnimatePresence mode="wait">
                    {isSpinning ? (
                      <motion.div
                        key="spinning"
                        initial={{ opacity: 0, rotate: 0 }}
                        animate={{ opacity: 1, rotate: 360 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                        className="text-8xl mb-4"
                      >
                        🎰
                      </motion.div>
                    ) : currentMultiplier ? (
                      <motion.div
                        key="result"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="space-y-4"
                      >
                        <div className="text-7xl font-bold text-yellow-400">
                          x{currentMultiplier}
                        </div>
                        <div className="text-3xl text-white">
                          Prize Pool: ${calculatePrizePool(selectedBuyIn, currentMultiplier).toLocaleString()}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="ready"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="text-6xl mb-4">🎲</div>
                        <div className="text-2xl text-white">Prêt à tenter votre chance ?</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isSpinning && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSpin}
                      className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-12 py-4 rounded-xl font-bold text-xl hover:from-yellow-500 hover:to-orange-600 transition"
                    >
                      🎰 SPIN !
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Probability Table */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white mb-4">📊 Probabilités</h3>
                {MULTIPLIERS.map((mult, index) => (
                  <motion.div
                    key={mult.multiplier}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-gradient-to-r ${mult.color} rounded-xl p-4 flex items-center justify-between`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{mult.icon}</div>
                      <div>
                        <div className="text-2xl font-bold text-white">x{mult.multiplier}</div>
                        <div className="text-white text-opacity-90 text-sm">
                          Prize Pool: ${calculatePrizePool(selectedBuyIn, mult.multiplier).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{(mult.probability * 100).toFixed(mult.probability < 0.01 ? 4 : 2)}%</div>
                      <div className="text-white text-opacity-75 text-sm">
                        1 sur {Math.round(1 / mult.probability).toLocaleString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Buy-in Selection & Active Tables */}
          <div className="space-y-6">
            {/* Buy-in Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-2xl p-6"
            >
              <h3 className="text-2xl font-bold text-white mb-4">💵 Sélectionnez votre Buy-in</h3>
              <div className="grid grid-cols-2 gap-3">
                {BUY_INS.map((buyIn) => (
                  <button
                    key={buyIn}
                    onClick={() => setSelectedBuyIn(buyIn)}
                    className={`p-4 rounded-xl font-bold transition ${
                      selectedBuyIn === buyIn
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    ${buyIn}
                  </button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRegister(selectedBuyIn)}
                className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition"
              >
                ▶️ Jouer ${selectedBuyIn} Spin & Go
              </motion.button>
            </motion.div>

            {/* Active Tables */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-2xl p-6"
            >
              <h3 className="text-2xl font-bold text-white mb-4">🔴 Tables Actives</h3>
              <div className="space-y-3">
                {ACTIVE_SPINS.map((spin) => (
                  <div
                    key={spin.id}
                    className={`bg-gray-900 rounded-xl p-4 border-2 ${
                      spin.jackpot ? 'border-yellow-400' : 'border-gray-700'
                    }`}
                  >
                    {spin.jackpot && (
                      <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">
                        💎 JACKPOT
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-white font-bold">${spin.buyIn} Spin & Go</div>
                        <div className="text-gray-400 text-sm">x{spin.multiplier} Multiplier</div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold text-lg">
                          ${spin.prizePool.toLocaleString()}
                        </div>
                        <div className="text-gray-400 text-xs">{spin.players}/3 joueurs</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          spin.status === 'running'
                            ? 'bg-green-600 text-white'
                            : spin.status === 'starting'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {spin.status === 'running' && '▶️ En cours'}
                        {spin.status === 'starting' && '⏱️ Démarre'}
                        {spin.status === 'waiting' && '⏳ En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">💡 Stratégie Spin & Go</h3>
              <div className="space-y-3 text-gray-300 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-400 font-bold">•</span>
                  <p>Jouez agressif dès le début (blinds montent vite)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-400 font-bold">•</span>
                  <p>Push or fold stratégie à partir de 10BB</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-400 font-bold">•</span>
                  <p>Position = clé pour voler les blinds</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-400 font-bold">•</span>
                  <p>Variance élevée, gérez votre bankroll !</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Prize Distribution Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-2xl font-bold text-white mb-4 text-center">🏆 Distribution des Prix</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-xl p-6">
              <h4 className="text-lg font-bold text-yellow-400 mb-3">Multiplicateurs x2 à x10</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>🥇 1ère place:</span>
                  <span className="font-bold text-green-400">75% du prize pool</span>
                </div>
                <div className="flex justify-between">
                  <span>🥈 2ème place:</span>
                  <span className="font-bold text-blue-400">25% du prize pool</span>
                </div>
                <div className="flex justify-between">
                  <span>🥉 3ème place:</span>
                  <span className="font-bold text-gray-400">0</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6">
              <h4 className="text-lg font-bold text-pink-400 mb-3">Multiplicateurs x25+</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>🥇 1ère place:</span>
                  <span className="font-bold text-yellow-400">100% du prize pool (Winner Takes All!)</span>
                </div>
                <div className="flex justify-between">
                  <span>🥈 2ème place:</span>
                  <span className="font-bold text-gray-400">0</span>
                </div>
                <div className="flex justify-between">
                  <span>🥉 3ème place:</span>
                  <span className="font-bold text-gray-400">0</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
