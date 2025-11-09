'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Disable static generation
export const dynamic = 'force-dynamic';

interface ForbesPlayer {
  rank: number;
  username: string;
  avatar: string;
  country: string;
  totalEarnings: number;
  annualEarnings: number;
  tournamentsWon: number;
  biggestWin: number;
  titlesHeld: string[];
  sponsorships: string[];
  netWorth: number;
  yearlyGrowth: number;
  age: number;
  yearsPlaying: number;
  signature: string; // Signature move or quote
}

interface AnnualAward {
  id: string;
  title: string;
  description: string;
  prize: number;
  icon: string;
  winner: string;
  winnerAvatar: string;
  year: number;
}

export default function ForbesRankingPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedCategory, setSelectedCategory] = useState<'overall' | 'tournaments' | 'cash' | 'growth'>('overall');
  const [selectedPlayer, setSelectedPlayer] = useState<ForbesPlayer | null>(null);

  // Forbes Top Players 2025
  const FORBES_PLAYERS: ForbesPlayer[] = [
    {
      rank: 1,
      username: 'PhilTheKing',
      avatar: '👑',
      country: '🇺🇸',
      totalEarnings: 125000000,
      annualEarnings: 28500000,
      tournamentsWon: 187,
      biggestWin: 18000000,
      titlesHeld: ['World Champion 2024', 'WSOP Main Event', 'EPT Grand Final'],
      sponsorships: ['PokerStars Pro', 'Rolex', 'Tesla'],
      netWorth: 180000000,
      yearlyGrowth: 35.2,
      age: 34,
      yearsPlaying: 15,
      signature: '"Fold is not in my vocabulary"',
    },
    {
      rank: 2,
      username: 'DanielNegreanu',
      avatar: '🧠',
      country: '🇨🇦',
      totalEarnings: 112000000,
      annualEarnings: 22800000,
      tournamentsWon: 156,
      biggestWin: 15500000,
      titlesHeld: ['Poker Hall of Fame', 'WSOP Player of the Year', 'WPT Champion'],
      sponsorships: ['PokerStars Team Pro', 'MasterClass', 'GGPoker'],
      netWorth: 165000000,
      yearlyGrowth: 28.7,
      age: 50,
      yearsPlaying: 28,
      signature: '"Small ball poker is an art"',
    },
    {
      rank: 3,
      username: 'VanessaRousseau',
      avatar: '💎',
      country: '🇫🇷',
      totalEarnings: 98500000,
      annualEarnings: 21200000,
      tournamentsWon: 142,
      biggestWin: 12000000,
      titlesHeld: ['EPT Champion', 'WSOP Europe Winner', 'Female Poker Icon'],
      sponsorships: ['Winamax Ambassador', 'Chanel', 'Veuve Clicquot'],
      netWorth: 145000000,
      yearlyGrowth: 42.1,
      age: 31,
      yearsPlaying: 10,
      signature: '"Élégance et agressivité"',
    },
    {
      rank: 4,
      username: 'TomDurrr',
      avatar: '🔥',
      country: '🇺🇸',
      totalEarnings: 87300000,
      annualEarnings: 19500000,
      tournamentsWon: 98,
      biggestWin: 10800000,
      titlesHeld: ['High Roller Champion', 'Cash Game Legend', 'Online King'],
      sponsorships: ['Full Tilt Poker', 'Bugatti', 'Patek Philippe'],
      netWorth: 132000000,
      yearlyGrowth: 31.4,
      age: 38,
      yearsPlaying: 18,
      signature: '"High stakes or nothing"',
    },
    {
      rank: 5,
      username: 'FadorIsBack',
      avatar: '🎯',
      country: '🇸🇪',
      totalEarnings: 76800000,
      annualEarnings: 18200000,
      tournamentsWon: 124,
      biggestWin: 9200000,
      titlesHeld: ['Triple Crown Winner', 'European Champion', 'Online Legend'],
      sponsorships: ['888poker', 'Volvo', 'H&M'],
      netWorth: 118000000,
      yearlyGrowth: 25.8,
      age: 36,
      yearsPlaying: 14,
      signature: '"Calculated aggression wins"',
    },
    {
      rank: 6,
      username: 'IveyTheShark',
      avatar: '🦈',
      country: '🇺🇸',
      totalEarnings: 68500000,
      annualEarnings: 16800000,
      tournamentsWon: 178,
      biggestWin: 8500000,
      titlesHeld: ['10x WSOP Bracelet Winner', 'Poker Hall of Fame', 'The Tiger Woods of Poker'],
      sponsorships: ['Independent', 'Luxury Brands', 'Crypto Ventures'],
      netWorth: 105000000,
      yearlyGrowth: 22.3,
      age: 48,
      yearsPlaying: 25,
      signature: '"I can read your soul"',
    },
    {
      rank: 7,
      username: 'SarahLegend',
      avatar: '⭐',
      country: '🇬🇧',
      totalEarnings: 62100000,
      annualEarnings: 15900000,
      tournamentsWon: 89,
      biggestWin: 7800000,
      titlesHeld: ['WPT Champion', 'EPT Winner', 'UK Poker Queen'],
      sponsorships: ['PartyPoker', 'Burberry', 'Harrods'],
      netWorth: 94000000,
      yearlyGrowth: 38.6,
      age: 29,
      yearsPlaying: 8,
      signature: '"Breaking glass ceilings daily"',
    },
    {
      rank: 8,
      username: 'JunglemanDan',
      avatar: '🌴',
      country: '🇺🇸',
      totalEarnings: 58700000,
      annualEarnings: 14200000,
      tournamentsWon: 67,
      biggestWin: 6900000,
      titlesHeld: ['Super High Roller Winner', 'Cash Game Master', 'GTO Wizard'],
      sponsorships: ['ACR Poker', 'Blockchain Gaming', 'NFT Poker'],
      netWorth: 87000000,
      yearlyGrowth: 29.1,
      age: 35,
      yearsPlaying: 12,
      signature: '"Math never lies"',
    },
    {
      rank: 9,
      username: 'TheAsianKid',
      avatar: '🎌',
      country: '🇯🇵',
      totalEarnings: 52300000,
      annualEarnings: 13500000,
      tournamentsWon: 94,
      biggestWin: 6200000,
      titlesHeld: ['APPT Champion', 'Asia Pacific King', 'Rising Star Award'],
      sponsorships: ['Natural8', 'Sony', 'Toyota'],
      netWorth: 78000000,
      yearlyGrowth: 45.8,
      age: 27,
      yearsPlaying: 6,
      signature: '"The future is now"',
    },
    {
      rank: 10,
      username: 'LuckyBrazilian',
      avatar: '🇧🇷',
      country: '🇧🇷',
      totalEarnings: 48900000,
      annualEarnings: 12800000,
      tournamentsWon: 71,
      biggestWin: 5800000,
      titlesHeld: ['BSOP Champion', 'Latin Series Winner', 'Party Ambassador'],
      sponsorships: ['PokerStars LATAM', 'Havaianas', 'Brahma'],
      netWorth: 72000000,
      yearlyGrowth: 33.4,
      age: 32,
      yearsPlaying: 11,
      signature: '"Samba and poker, my passions"',
    },
  ];

  // Annual Awards 2025
  const ANNUAL_AWARDS: AnnualAward[] = [
    {
      id: 'player-of-year',
      title: '🏆 Joueur de l\'Année',
      description: 'Le joueur le plus dominant de l\'année',
      prize: 5000000,
      icon: '👑',
      winner: 'PhilTheKing',
      winnerAvatar: '👑',
      year: 2025,
    },
    {
      id: 'breakout-star',
      title: '⭐ Étoile Montante',
      description: 'La plus grosse progression de l\'année',
      prize: 2500000,
      icon: '🚀',
      winner: 'TheAsianKid',
      winnerAvatar: '🎌',
      year: 2025,
    },
    {
      id: 'tournament-king',
      title: '🎯 Roi des Tournois',
      description: 'Le plus grand nombre de victoires en tournois',
      prize: 3000000,
      icon: '🏅',
      winner: 'IveyTheShark',
      winnerAvatar: '🦈',
      year: 2025,
    },
    {
      id: 'cash-game-legend',
      title: '💰 Légende Cash Game',
      description: 'Les plus gros profits en cash game',
      prize: 2000000,
      icon: '💵',
      winner: 'TomDurrr',
      winnerAvatar: '🔥',
      year: 2025,
    },
    {
      id: 'biggest-bluff',
      title: '🃏 Bluff de l\'Année',
      description: 'Le bluff le plus spectaculaire',
      prize: 1000000,
      icon: '🎭',
      winner: 'DanielNegreanu',
      winnerAvatar: '🧠',
      year: 2025,
    },
    {
      id: 'comeback-player',
      title: '🔄 Retour Triomphal',
      description: 'Le meilleur comeback après une période difficile',
      prize: 1500000,
      icon: '💪',
      winner: 'FadorIsBack',
      winnerAvatar: '🎯',
      year: 2025,
    },
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M $`;
    }
    return `${(amount / 1000).toFixed(0)}K $`;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { emoji: '🥇', color: 'text-yellow-400', bg: 'bg-yellow-900' };
    if (rank === 2) return { emoji: '🥈', color: 'text-gray-300', bg: 'bg-gray-700' };
    if (rank === 3) return { emoji: '🥉', color: 'text-orange-400', bg: 'bg-orange-900' };
    return { emoji: `#${rank}`, color: 'text-gray-400', bg: 'bg-gray-800' };
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
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 mb-2">
              FORBES POKER ELITE
            </h1>
            <p className="text-gray-300 text-lg">Les Titans du Poker Mondial - {selectedYear}</p>
          </div>
          <div className="bg-gray-800 rounded-full px-6 py-2">
            <span className="text-yellow-400 font-bold">
              💰 {user?.totalChips?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        {/* Annual Awards Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">🏆 Récompenses Annuelles {selectedYear}</h2>
            <p className="text-gray-400">Prix Total: {formatCurrency(ANNUAL_AWARDS.reduce((sum, award) => sum + award.prize, 0))}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {ANNUAL_AWARDS.map((award, index) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-2xl p-6 border-2 border-yellow-400 shadow-2xl"
              >
                <div className="text-center">
                  <div className="text-6xl mb-3">{award.icon}</div>
                  <h3 className="text-xl font-bold text-yellow-100 mb-2">{award.title}</h3>
                  <p className="text-yellow-200 text-sm mb-4">{award.description}</p>

                  <div className="bg-black bg-opacity-30 rounded-xl p-4 mb-4">
                    <div className="text-4xl mb-2">{award.winnerAvatar}</div>
                    <div className="text-white font-bold text-lg">{award.winner}</div>
                  </div>

                  <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-full py-2 px-4">
                    <span className="text-white font-bold text-xl">{formatCurrency(award.prize)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Category Selector */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setSelectedCategory('overall')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              selectedCategory === 'overall'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            🏆 Classement Global
          </button>
          <button
            onClick={() => setSelectedCategory('tournaments')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              selectedCategory === 'tournaments'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            🎯 Tournois
          </button>
          <button
            onClick={() => setSelectedCategory('growth')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              selectedCategory === 'growth'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            📈 Croissance
          </button>
        </div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="order-2 md:order-1 md:mt-12"
            >
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 border-4 border-gray-300 shadow-2xl">
                <div className="text-center">
                  <div className="text-6xl mb-3">🥈</div>
                  <div className="text-7xl mb-4">{FORBES_PLAYERS[1].avatar}</div>
                  <h3 className="text-2xl font-bold text-white mb-1">{FORBES_PLAYERS[1].username}</h3>
                  <div className="text-3xl mb-2">{FORBES_PLAYERS[1].country}</div>
                  <div className="bg-gray-900 rounded-xl p-4 mb-3">
                    <div className="text-gray-400 text-sm">Gains Annuels</div>
                    <div className="text-3xl font-bold text-green-400">{formatCurrency(FORBES_PLAYERS[1].annualEarnings)}</div>
                  </div>
                  <div className="text-gray-300 text-sm italic">"{FORBES_PLAYERS[1].signature}"</div>
                </div>
              </div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="order-1 md:order-2"
            >
              <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-2xl p-8 border-4 border-yellow-400 shadow-2xl relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold text-lg">
                  CHAMPION 👑
                </div>
                <div className="text-center pt-4">
                  <div className="text-8xl mb-3">🥇</div>
                  <div className="text-9xl mb-4">{FORBES_PLAYERS[0].avatar}</div>
                  <h3 className="text-3xl font-bold text-white mb-2">{FORBES_PLAYERS[0].username}</h3>
                  <div className="text-4xl mb-3">{FORBES_PLAYERS[0].country}</div>
                  <div className="bg-gray-900 rounded-xl p-6 mb-4">
                    <div className="text-yellow-200 text-sm mb-1">Gains Annuels</div>
                    <div className="text-4xl font-bold text-green-400 mb-3">{formatCurrency(FORBES_PLAYERS[0].annualEarnings)}</div>
                    <div className="text-yellow-200 text-sm mb-1">Fortune Totale</div>
                    <div className="text-3xl font-bold text-yellow-400">{formatCurrency(FORBES_PLAYERS[0].netWorth)}</div>
                  </div>
                  <div className="text-yellow-100 italic">"{FORBES_PLAYERS[0].signature}"</div>
                </div>
              </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="order-3 md:mt-12"
            >
              <div className="bg-gradient-to-br from-orange-700 to-orange-800 rounded-2xl p-6 border-4 border-orange-400 shadow-2xl">
                <div className="text-center">
                  <div className="text-6xl mb-3">🥉</div>
                  <div className="text-7xl mb-4">{FORBES_PLAYERS[2].avatar}</div>
                  <h3 className="text-2xl font-bold text-white mb-1">{FORBES_PLAYERS[2].username}</h3>
                  <div className="text-3xl mb-2">{FORBES_PLAYERS[2].country}</div>
                  <div className="bg-gray-900 rounded-xl p-4 mb-3">
                    <div className="text-gray-400 text-sm">Gains Annuels</div>
                    <div className="text-3xl font-bold text-green-400">{formatCurrency(FORBES_PLAYERS[2].annualEarnings)}</div>
                  </div>
                  <div className="text-gray-300 text-sm italic">"{FORBES_PLAYERS[2].signature}"</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Full Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-6">📊 Top 10 Complet</h2>
          <div className="space-y-4">
            {FORBES_PLAYERS.map((player, index) => {
              const badge = getRankBadge(player.rank);
              return (
                <motion.div
                  key={player.username}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedPlayer(player)}
                  className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 hover:border-yellow-400 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    {/* Rank and Player Info */}
                    <div className="flex items-center space-x-6">
                      <div className={`${badge.bg} rounded-xl px-4 py-3 min-w-[80px] text-center`}>
                        <div className={`text-3xl font-bold ${badge.color}`}>{badge.emoji}</div>
                      </div>
                      <div className="text-6xl">{player.avatar}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{player.username}</h3>
                        <div className="flex items-center space-x-3 text-gray-400">
                          <span className="text-2xl">{player.country}</span>
                          <span>•</span>
                          <span>{player.age} ans</span>
                          <span>•</span>
                          <span>{player.yearsPlaying} ans de carrière</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-900 rounded-xl p-3 text-center">
                        <div className="text-gray-400 text-xs mb-1">Gains {selectedYear}</div>
                        <div className="text-green-400 font-bold text-lg">{formatCurrency(player.annualEarnings)}</div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-3 text-center">
                        <div className="text-gray-400 text-xs mb-1">Fortune</div>
                        <div className="text-yellow-400 font-bold text-lg">{formatCurrency(player.netWorth)}</div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-3 text-center">
                        <div className="text-gray-400 text-xs mb-1">Tournois Gagnés</div>
                        <div className="text-blue-400 font-bold text-lg">{player.tournamentsWon}</div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-3 text-center">
                        <div className="text-gray-400 text-xs mb-1">Croissance</div>
                        <div className="text-purple-400 font-bold text-lg">+{player.yearlyGrowth}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Titles */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {player.titlesHeld.map((title, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        🏆 {title}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Player Detail Modal */}
        <AnimatePresence>
          {selectedPlayer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlayer(null)}
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-8 relative">
                  <button
                    onClick={() => setSelectedPlayer(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl"
                  >
                    ✕
                  </button>
                  <div className="flex items-center space-x-6">
                    <div className="text-9xl">{selectedPlayer.avatar}</div>
                    <div>
                      <h2 className="text-4xl font-bold text-white mb-2">{selectedPlayer.username}</h2>
                      <div className="flex items-center space-x-4 text-gray-300 text-lg">
                        <span className="text-4xl">{selectedPlayer.country}</span>
                        <span>•</span>
                        <span>Rang #{selectedPlayer.rank}</span>
                      </div>
                      <p className="text-yellow-400 text-xl italic mt-2">{selectedPlayer.signature}</p>
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-8 space-y-6">
                  {/* Financial Stats */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">💰 Finances</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Fortune Totale</div>
                        <div className="text-2xl font-bold text-yellow-400">{formatCurrency(selectedPlayer.netWorth)}</div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Gains {selectedYear}</div>
                        <div className="text-2xl font-bold text-green-400">{formatCurrency(selectedPlayer.annualEarnings)}</div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Plus Grosse Victoire</div>
                        <div className="text-2xl font-bold text-blue-400">{formatCurrency(selectedPlayer.biggestWin)}</div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Croissance Annuelle</div>
                        <div className="text-2xl font-bold text-purple-400">+{selectedPlayer.yearlyGrowth}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Career Stats */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">🏆 Carrière</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Tournois Gagnés</div>
                        <div className="text-2xl font-bold text-white">{selectedPlayer.tournamentsWon}</div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Années de Jeu</div>
                        <div className="text-2xl font-bold text-white">{selectedPlayer.yearsPlaying} ans</div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Âge</div>
                        <div className="text-2xl font-bold text-white">{selectedPlayer.age} ans</div>
                      </div>
                    </div>
                  </div>

                  {/* Titles */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">🎖️ Titres</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedPlayer.titlesHeld.map((title, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-900 text-purple-100 px-4 py-2 rounded-lg text-lg font-semibold"
                        >
                          🏆 {title}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sponsorships */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">🤝 Sponsors</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedPlayer.sponsorships.map((sponsor, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-900 text-yellow-400 px-4 py-2 rounded-lg text-lg font-semibold border-2 border-yellow-400"
                        >
                          {sponsor}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
