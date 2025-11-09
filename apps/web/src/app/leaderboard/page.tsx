'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Disable static generation
export const dynamic = 'force-dynamic';

interface Player {
  rank: number;
  username: string;
  level: number;
  totalXP: number;
  profit: number;
  handsPlayed: number;
  winRate: number;
  country: string;
  avatar: string;
}

const GLOBAL_LEADERBOARD: Player[] = [
  {
    rank: 1,
    username: 'PokerPro2024',
    level: 87,
    totalXP: 142500,
    profit: 1250000,
    handsPlayed: 5420,
    winRate: 68.5,
    country: '🇫🇷',
    avatar: '👑',
  },
  {
    rank: 2,
    username: 'BluffMaster',
    level: 82,
    totalXP: 128300,
    profit: 980000,
    handsPlayed: 4850,
    winRate: 64.2,
    country: '🇺🇸',
    avatar: '🎭',
  },
  {
    rank: 3,
    username: 'RoyalFlush',
    level: 79,
    totalXP: 115200,
    profit: 875000,
    handsPlayed: 4320,
    winRate: 62.8,
    country: '🇬🇧',
    avatar: '♠️',
  },
  {
    rank: 4,
    username: 'AllInAce',
    level: 76,
    totalXP: 105600,
    profit: 720000,
    handsPlayed: 3980,
    winRate: 61.3,
    country: '🇩🇪',
    avatar: '🃏',
  },
  {
    rank: 5,
    username: 'CardShark99',
    level: 73,
    totalXP: 98400,
    profit: 650000,
    handsPlayed: 3650,
    winRate: 59.7,
    country: '🇨🇦',
    avatar: '🦈',
  },
  {
    rank: 6,
    username: 'VegasKing',
    level: 70,
    totalXP: 89200,
    profit: 580000,
    handsPlayed: 3290,
    winRate: 58.4,
    country: '🇪🇸',
    avatar: '🎰',
  },
  {
    rank: 7,
    username: 'ChipLeader',
    level: 68,
    totalXP: 82100,
    profit: 520000,
    handsPlayed: 3050,
    winRate: 57.1,
    country: '🇮🇹',
    avatar: '💎',
  },
  {
    rank: 8,
    username: 'PokerFace',
    level: 65,
    totalXP: 75600,
    profit: 465000,
    handsPlayed: 2840,
    winRate: 55.8,
    country: '🇧🇷',
    avatar: '😎',
  },
  {
    rank: 9,
    username: 'RiverRat',
    level: 62,
    totalXP: 68900,
    profit: 410000,
    handsPlayed: 2620,
    winRate: 54.5,
    country: '🇯🇵',
    avatar: '🐀',
  },
  {
    rank: 10,
    username: 'TexasHero',
    level: 59,
    totalXP: 62400,
    profit: 360000,
    handsPlayed: 2410,
    winRate: 53.2,
    country: '🇲🇽',
    avatar: '🤠',
  },
  // User's rank (example)
  {
    rank: 42,
    username: user?.username || 'Vous',
    level: 42,
    totalXP: 28500,
    profit: 125000,
    handsPlayed: 876,
    winRate: 48.3,
    country: '🇫🇷',
    avatar: '🎯',
  },
];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [period, setPeriod] = useState<'all-time' | 'monthly' | 'weekly'>('all-time');
  const [category, setCategory] = useState<'xp' | 'profit' | 'winrate'>('xp');

  const userRank = GLOBAL_LEADERBOARD.find(p => p.username === (user?.username || 'Vous'));

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-400';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-gray-700 to-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Retour
          </Link>
          <h1 className="text-4xl font-bold text-white">🏆 Classement</h1>
          <div className="bg-gray-800 rounded-full px-6 py-2">
            <span className="text-yellow-400 font-bold">💰 {user?.totalChips?.toLocaleString() || 0}</span>
          </div>
        </div>

        {/* Your Rank Card */}
        {userRank && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 mb-8 border-4 border-yellow-400"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="text-6xl">{userRank.avatar}</div>
                <div>
                  <div className="text-white/70 text-sm mb-1">Votre Position</div>
                  <div className="text-3xl font-bold text-white">
                    #{userRank.rank}
                  </div>
                  <div className="text-purple-200 text-sm">
                    {userRank.country} {userRank.username}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/70 text-sm mb-1">Niveau</div>
                <div className="text-4xl font-bold text-white">{userRank.level}</div>
                <div className="text-purple-200 text-sm">{userRank.totalXP.toLocaleString()} XP</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Period Selector */}
          <div>
            <label className="text-white font-semibold mb-2 block">Période</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setPeriod('all-time')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                  period === 'all-time'
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setPeriod('monthly')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                  period === 'monthly'
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                Mois
              </button>
              <button
                onClick={() => setPeriod('weekly')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                  period === 'weekly'
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                Semaine
              </button>
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="text-white font-semibold mb-2 block">Catégorie</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setCategory('xp')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                  category === 'xp'
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                XP
              </button>
              <button
                onClick={() => setCategory('profit')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                  category === 'profit'
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                Profit
              </button>
              <button
                onClick={() => setCategory('winrate')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                  category === 'winrate'
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                Win Rate
              </button>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl p-6 text-center mt-8"
          >
            <div className="text-6xl mb-2">{GLOBAL_LEADERBOARD[1].avatar}</div>
            <div className="text-4xl mb-2">🥈</div>
            <div className="text-gray-900 font-bold text-lg mb-1">
              {GLOBAL_LEADERBOARD[1].username}
            </div>
            <div className="text-gray-800 text-sm mb-2">
              {GLOBAL_LEADERBOARD[1].country} Niveau {GLOBAL_LEADERBOARD[1].level}
            </div>
            <div className="bg-white/30 rounded-lg p-2 text-gray-900 font-bold">
              {GLOBAL_LEADERBOARD[1].totalXP.toLocaleString()} XP
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-6 text-center border-4 border-yellow-300"
          >
            <div className="text-7xl mb-2">{GLOBAL_LEADERBOARD[0].avatar}</div>
            <div className="text-5xl mb-2">🥇</div>
            <div className="text-gray-900 font-bold text-xl mb-1">
              {GLOBAL_LEADERBOARD[0].username}
            </div>
            <div className="text-gray-800 text-sm mb-2">
              {GLOBAL_LEADERBOARD[0].country} Niveau {GLOBAL_LEADERBOARD[0].level}
            </div>
            <div className="bg-white/30 rounded-lg p-3 text-gray-900 font-bold text-lg">
              {GLOBAL_LEADERBOARD[0].totalXP.toLocaleString()} XP
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-6 text-center mt-8"
          >
            <div className="text-6xl mb-2">{GLOBAL_LEADERBOARD[2].avatar}</div>
            <div className="text-4xl mb-2">🥉</div>
            <div className="text-gray-900 font-bold text-lg mb-1">
              {GLOBAL_LEADERBOARD[2].username}
            </div>
            <div className="text-gray-800 text-sm mb-2">
              {GLOBAL_LEADERBOARD[2].country} Niveau {GLOBAL_LEADERBOARD[2].level}
            </div>
            <div className="bg-white/30 rounded-lg p-2 text-gray-900 font-bold">
              {GLOBAL_LEADERBOARD[2].totalXP.toLocaleString()} XP
            </div>
          </motion.div>
        </div>

        {/* Full Leaderboard */}
        <div className="bg-gray-800 rounded-2xl overflow-hidden">
          <div className="bg-gray-900 p-4 border-b border-gray-700">
            <h2 className="text-white font-bold text-xl">🏆 Classement Mondial</h2>
          </div>

          <div className="divide-y divide-gray-700">
            {GLOBAL_LEADERBOARD.slice(0, 10).map((player, index) => (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 hover:bg-gray-700/50 transition ${
                  player.username === (user?.username || 'Vous') ? 'bg-purple-900/30' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Rank */}
                    <div className="w-16 text-center">
                      <div
                        className={`inline-block px-3 py-1 rounded-lg font-bold text-lg ${
                          player.rank <= 3 ? 'text-white bg-gradient-to-br ' + getRankColor(player.rank) : 'text-gray-400'
                        }`}
                      >
                        {getMedalEmoji(player.rank)}
                      </div>
                    </div>

                    {/* Player Info */}
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="text-4xl">{player.avatar}</div>
                      <div>
                        <div className="text-white font-bold flex items-center space-x-2">
                          <span>{player.username}</span>
                          {player.username === (user?.username || 'Vous') && (
                            <span className="bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs">VOUS</span>
                          )}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {player.country} • Niveau {player.level}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:flex space-x-6">
                      <div className="text-center">
                        <div className="text-gray-400 text-xs mb-1">XP</div>
                        <div className="text-white font-bold">{player.totalXP.toLocaleString()}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400 text-xs mb-1">Profit</div>
                        <div className="text-green-400 font-bold">
                          +{(player.profit / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400 text-xs mb-1">Win Rate</div>
                        <div className="text-blue-400 font-bold">{player.winRate}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400 text-xs mb-1">Mains</div>
                        <div className="text-white font-bold">{player.handsPlayed.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View More */}
          {userRank && userRank.rank > 10 && (
            <div className="p-4 bg-gray-900 border-t border-gray-700">
              <div className="text-center text-gray-400 text-sm">...</div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-purple-900/30 rounded-lg mt-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-gray-400 font-bold">#{userRank.rank}</div>
                    <div className="text-3xl">{userRank.avatar}</div>
                    <div>
                      <div className="text-white font-bold flex items-center space-x-2">
                        <span>{userRank.username}</span>
                        <span className="bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs">VOUS</span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {userRank.country} • Niveau {userRank.level}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{userRank.totalXP.toLocaleString()} XP</div>
                    <div className="text-gray-400 text-sm">{userRank.winRate}% Win Rate</div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="text-white font-bold mb-2">Classement Mondial</h3>
            <p className="text-gray-400 text-sm">
              Affrontez les meilleurs joueurs du monde entier
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-white font-bold mb-2">Plusieurs Catégories</h3>
            <p className="text-gray-400 text-sm">
              XP, Profit ou Win Rate - Choisissez votre critère
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">⏰</div>
            <h3 className="text-white font-bold mb-2">Mise à Jour en Temps Réel</h3>
            <p className="text-gray-400 text-sm">
              Classement actualisé automatiquement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
