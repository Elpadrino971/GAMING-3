'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Disable static generation
export const dynamic = 'force-dynamic';

interface HandHistory {
  id: string;
  date: Date;
  gameType: 'Cash Game' | 'Tournament' | 'SNG';
  result: 'win' | 'loss' | 'tie';
  amount: number;
  cards: string[];
  position: string;
  actions: string[];
  opponentsCount: number;
  biggestPot: number;
}

const HAND_HISTORY: HandHistory[] = [
  {
    id: 'hand-1',
    date: new Date(Date.now() - 3600000),
    gameType: 'Cash Game',
    result: 'win',
    amount: 1250,
    cards: ['A♠', 'K♠'],
    position: 'Button',
    actions: ['Raise Pre-flop', 'Bet Flop', 'Check Turn', 'All-in River'],
    opponentsCount: 5,
    biggestPot: 2500,
  },
  {
    id: 'hand-2',
    date: new Date(Date.now() - 7200000),
    gameType: 'Tournament',
    result: 'loss',
    amount: -500,
    cards: ['Q♥', 'Q♦'],
    position: 'UTG',
    actions: ['Raise Pre-flop', 'Call Flop', 'Fold Turn'],
    opponentsCount: 8,
    biggestPot: 1200,
  },
  {
    id: 'hand-3',
    date: new Date(Date.now() - 10800000),
    gameType: 'Cash Game',
    result: 'win',
    amount: 850,
    cards: ['9♣', '9♠'],
    position: 'SB',
    actions: ['Call Pre-flop', 'Bet Flop', 'Raise Turn', 'Call River'],
    opponentsCount: 3,
    biggestPot: 1700,
  },
  {
    id: 'hand-4',
    date: new Date(Date.now() - 14400000),
    gameType: 'SNG',
    result: 'win',
    amount: 2100,
    cards: ['A♥', 'A♦'],
    position: 'CO',
    actions: ['Raise Pre-flop', 'Re-raise Flop', 'All-in Turn'],
    opponentsCount: 6,
    biggestPot: 4200,
  },
  {
    id: 'hand-5',
    date: new Date(Date.now() - 18000000),
    gameType: 'Cash Game',
    result: 'loss',
    amount: -300,
    cards: ['J♠', 'T♠'],
    position: 'BB',
    actions: ['Check Pre-flop', 'Bet Flop', 'Fold Turn'],
    opponentsCount: 4,
    biggestPot: 600,
  },
];

export default function HistoryPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [filter, setFilter] = useState<'all' | 'win' | 'loss'>('all');
  const [selectedHand, setSelectedHand] = useState<HandHistory | null>(null);

  const filteredHands = HAND_HISTORY.filter(
    (hand) => filter === 'all' || hand.result === filter
  );

  // Calculate statistics
  const totalHands = HAND_HISTORY.length;
  const wins = HAND_HISTORY.filter((h) => h.result === 'win').length;
  const losses = HAND_HISTORY.filter((h) => h.result === 'loss').length;
  const winRate = totalHands > 0 ? ((wins / totalHands) * 100).toFixed(1) : '0';
  const totalProfit = HAND_HISTORY.reduce((sum, hand) => sum + hand.amount, 0);
  const biggestWin = Math.max(...HAND_HISTORY.filter(h => h.result === 'win').map((h) => h.amount), 0);
  const biggestLoss = Math.min(...HAND_HISTORY.filter(h => h.result === 'loss').map((h) => h.amount), 0);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Il y a ${days}j`;
    if (hours > 0) return `Il y a ${hours}h`;
    return 'À l'instant';
  };

  const getCardSuitColor = (card: string) => {
    if (card.includes('♥') || card.includes('♦')) return 'text-red-500';
    return 'text-gray-900';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Retour
          </Link>
          <h1 className="text-4xl font-bold text-white">📊 Historique & Stats</h1>
          <div className="bg-gray-800 rounded-full px-6 py-2">
            <span className="text-yellow-400 font-bold">💰 {user?.totalChips?.toLocaleString() || 0}</span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 rounded-xl p-6 border-2 border-blue-500"
          >
            <div className="text-blue-400 text-sm mb-2">Total Mains</div>
            <div className="text-3xl font-bold text-white">{totalHands}</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 rounded-xl p-6 border-2 border-green-500"
          >
            <div className="text-green-400 text-sm mb-2">Win Rate</div>
            <div className="text-3xl font-bold text-white">{winRate}%</div>
            <div className="text-xs text-gray-400 mt-1">{wins}W / {losses}L</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`bg-gray-800 rounded-xl p-6 border-2 ${
              totalProfit >= 0 ? 'border-green-500' : 'border-red-500'
            }`}
          >
            <div className={`text-sm mb-2 ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              Profit Total
            </div>
            <div className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 rounded-xl p-6 border-2 border-yellow-500"
          >
            <div className="text-yellow-400 text-sm mb-2">Plus Gros Gain</div>
            <div className="text-3xl font-bold text-white">+{biggestWin.toLocaleString()}</div>
          </motion.div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">📈 Évolution du Profit</h2>
          <div className="h-48 bg-gray-900 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-gray-400">Graphique de progression</p>
              <p className="text-gray-500 text-sm">(À implémenter avec Chart.js)</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              filter === 'all'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            🎯 Toutes ({totalHands})
          </button>
          <button
            onClick={() => setFilter('win')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              filter === 'win'
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            ✅ Victoires ({wins})
          </button>
          <button
            onClick={() => setFilter('loss')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              filter === 'loss'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            ❌ Défaites ({losses})
          </button>
        </div>

        {/* Hand History List */}
        <div className="space-y-4">
          {filteredHands.map((hand, index) => (
            <motion.div
              key={hand.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedHand(hand)}
              className={`bg-gray-800 rounded-xl p-6 border-2 cursor-pointer hover:border-yellow-400 transition ${
                hand.result === 'win'
                  ? 'border-green-500/30'
                  : hand.result === 'loss'
                  ? 'border-red-500/30'
                  : 'border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  {/* Cards */}
                  <div className="flex space-x-1">
                    {hand.cards.map((card, i) => (
                      <div
                        key={i}
                        className={`bg-white rounded-lg px-3 py-2 font-bold text-lg shadow-lg ${getCardSuitColor(
                          card
                        )}`}
                      >
                        {card}
                      </div>
                    ))}
                  </div>

                  {/* Info */}
                  <div>
                    <div className="text-white font-bold">{hand.gameType}</div>
                    <div className="text-gray-400 text-sm">{hand.position} • {hand.opponentsCount} joueurs</div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-2xl font-bold ${
                      hand.result === 'win' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {hand.result === 'win' ? '+' : ''}{hand.amount.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">{formatDate(hand.date)}</div>
                </div>
              </div>

              {/* Actions Preview */}
              <div className="flex flex-wrap gap-2">
                {hand.actions.slice(0, 3).map((action, i) => (
                  <span
                    key={i}
                    className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs"
                  >
                    {action}
                  </span>
                ))}
                {hand.actions.length > 3 && (
                  <span className="text-gray-500 text-xs px-2 py-1">
                    +{hand.actions.length - 3} actions
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredHands.length === 0 && (
          <div className="bg-gray-800 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🎴</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Aucune main trouvée
            </h2>
            <p className="text-gray-400">
              Essayez un autre filtre ou jouez quelques mains!
            </p>
          </div>
        )}
      </div>

      {/* Hand Detail Modal */}
      <AnimatePresence>
        {selectedHand && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
            onClick={() => setSelectedHand(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full border-4 border-yellow-400 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                🎴 Détails de la Main
              </h2>

              {/* Cards Display */}
              <div className="flex justify-center space-x-3 mb-6">
                {selectedHand.cards.map((card, i) => (
                  <div
                    key={i}
                    className={`bg-white rounded-xl px-6 py-4 font-bold text-3xl shadow-2xl ${getCardSuitColor(
                      card
                    )}`}
                  >
                    {card}
                  </div>
                ))}
              </div>

              {/* Result */}
              <div className="bg-gray-900 rounded-xl p-6 mb-6 text-center">
                <div
                  className={`text-4xl font-bold mb-2 ${
                    selectedHand.result === 'win' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {selectedHand.result === 'win' ? '✅ VICTOIRE' : '❌ DÉFAITE'}
                </div>
                <div
                  className={`text-5xl font-bold ${
                    selectedHand.result === 'win' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {selectedHand.result === 'win' ? '+' : ''}{selectedHand.amount.toLocaleString()} 🪙
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between bg-gray-900 rounded-lg p-3">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white font-bold">{selectedHand.gameType}</span>
                </div>
                <div className="flex justify-between bg-gray-900 rounded-lg p-3">
                  <span className="text-gray-400">Position:</span>
                  <span className="text-white font-bold">{selectedHand.position}</span>
                </div>
                <div className="flex justify-between bg-gray-900 rounded-lg p-3">
                  <span className="text-gray-400">Adversaires:</span>
                  <span className="text-white font-bold">{selectedHand.opponentsCount} joueurs</span>
                </div>
                <div className="flex justify-between bg-gray-900 rounded-lg p-3">
                  <span className="text-gray-400">Plus Gros Pot:</span>
                  <span className="text-yellow-400 font-bold">
                    {selectedHand.biggestPot.toLocaleString()} 🪙
                  </span>
                </div>
                <div className="flex justify-between bg-gray-900 rounded-lg p-3">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white font-bold">{formatDate(selectedHand.date)}</span>
                </div>
              </div>

              {/* Actions Timeline */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">📋 Actions</h3>
                <div className="space-y-2">
                  {selectedHand.actions.map((action, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="bg-yellow-400 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        {i + 1}
                      </div>
                      <div className="bg-gray-800 flex-1 rounded-lg p-3 text-white">
                        {action}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedHand(null)}
                className="w-full bg-gray-700 text-white py-4 rounded-xl font-bold hover:bg-gray-600 transition mt-6"
              >
                Fermer
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
