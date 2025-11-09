'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Disable static generation
export const dynamic = 'force-dynamic';

interface OmahaTable {
  id: string;
  name: string;
  variant: 'PLO' | 'PLO5' | 'PLO Hi-Lo';
  stake: string;
  smallBlind: number;
  bigBlind: number;
  minBuyIn: number;
  maxBuyIn: number;
  players: number;
  maxPlayers: number;
  avgPot: number;
  format: 'cash' | 'tournament' | 'sit-n-go';
  speed?: 'regular' | 'fast-fold';
}

export default function OmahaPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [selectedVariant, setSelectedVariant] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('cash');

  // Omaha Tables
  const OMAHA_TABLES: OmahaTable[] = [
    {
      id: 'plo10-1',
      name: 'PLO Micro Stakes',
      variant: 'PLO',
      stake: 'PLO10',
      smallBlind: 0.05,
      bigBlind: 0.10,
      minBuyIn: 4.00,
      maxBuyIn: 10.00,
      players: 5,
      maxPlayers: 6,
      avgPot: 2.80,
      format: 'cash',
      speed: 'regular',
    },
    {
      id: 'plo25-1',
      name: 'PLO Action Table',
      variant: 'PLO',
      stake: 'PLO25',
      smallBlind: 0.10,
      bigBlind: 0.25,
      minBuyIn: 10.00,
      maxBuyIn: 25.00,
      players: 4,
      maxPlayers: 6,
      avgPot: 6.50,
      format: 'cash',
      speed: 'regular',
    },
    {
      id: 'plo50-zoom',
      name: 'Zoom PLO50',
      variant: 'PLO',
      stake: 'PLO50',
      smallBlind: 0.25,
      bigBlind: 0.50,
      minBuyIn: 20.00,
      maxBuyIn: 50.00,
      players: 156,
      maxPlayers: 999,
      avgPot: 12.50,
      format: 'cash',
      speed: 'fast-fold',
    },
    {
      id: 'plo100-1',
      name: 'High Stakes PLO',
      variant: 'PLO',
      stake: 'PLO100',
      smallBlind: 0.50,
      bigBlind: 1.00,
      minBuyIn: 40.00,
      maxBuyIn: 100.00,
      players: 3,
      maxPlayers: 6,
      avgPot: 28.00,
      format: 'cash',
      speed: 'regular',
    },
    {
      id: 'plo5-10-1',
      name: '5-Card PLO Action',
      variant: 'PLO5',
      stake: 'PLO5-10',
      smallBlind: 0.05,
      bigBlind: 0.10,
      minBuyIn: 4.00,
      maxBuyIn: 10.00,
      players: 4,
      maxPlayers: 6,
      avgPot: 3.20,
      format: 'cash',
      speed: 'regular',
    },
    {
      id: 'plo5-50-1',
      name: '5-Card PLO50',
      variant: 'PLO5',
      stake: 'PLO5-50',
      smallBlind: 0.25,
      bigBlind: 0.50,
      minBuyIn: 20.00,
      maxBuyIn: 50.00,
      players: 5,
      maxPlayers: 6,
      avgPot: 15.80,
      format: 'cash',
      speed: 'regular',
    },
    {
      id: 'plohilo-25',
      name: 'PLO Hi-Lo Split',
      variant: 'PLO Hi-Lo',
      stake: 'PLO Hi-Lo 25',
      smallBlind: 0.10,
      bigBlind: 0.25,
      minBuyIn: 10.00,
      maxBuyIn: 25.00,
      players: 6,
      maxPlayers: 6,
      avgPot: 5.50,
      format: 'cash',
      speed: 'regular',
    },
    // Tournaments
    {
      id: 'plo-tourney-1',
      name: 'PLO Tournament',
      variant: 'PLO',
      stake: '$50 Buy-in',
      smallBlind: 0,
      bigBlind: 0,
      minBuyIn: 50,
      maxBuyIn: 50,
      players: 45,
      maxPlayers: 180,
      avgPot: 0,
      format: 'tournament',
    },
    {
      id: 'plo5-tourney-1',
      name: '5-Card PLO Championship',
      variant: 'PLO5',
      stake: '$100 Buy-in',
      smallBlind: 0,
      bigBlind: 0,
      minBuyIn: 100,
      maxBuyIn: 100,
      players: 67,
      maxPlayers: 200,
      avgPot: 0,
      format: 'tournament',
    },
    // Sit & Go
    {
      id: 'plo-sng-1',
      name: 'PLO Sit & Go',
      variant: 'PLO',
      stake: '$20 Buy-in',
      smallBlind: 0,
      bigBlind: 0,
      minBuyIn: 20,
      maxBuyIn: 20,
      players: 7,
      maxPlayers: 9,
      avgPot: 0,
      format: 'sit-n-go',
    },
  ];

  const filteredTables = OMAHA_TABLES.filter((table) => {
    const matchesVariant = selectedVariant === 'all' || table.variant === selectedVariant;
    const matchesFormat = table.format === selectedFormat;
    return matchesVariant && matchesFormat;
  });

  const handleJoinTable = (table: OmahaTable) => {
    alert(`🃏 Rejoindre: ${table.name}\n\nVariant: ${table.variant}\nStake: ${table.stake}\n\nBonne chance !`);
  };

  const getVariantColor = (variant: string) => {
    switch (variant) {
      case 'PLO':
        return 'text-orange-400 bg-orange-900';
      case 'PLO5':
        return 'text-purple-400 bg-purple-900';
      case 'PLO Hi-Lo':
        return 'text-blue-400 bg-blue-900';
      default:
        return 'text-gray-400 bg-gray-900';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Retour
          </Link>
          <div className="text-center">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 mb-2">
              🃏 OMAHA POKER
            </h1>
            <p className="text-gray-300 text-lg">4 cartes = 4x plus d'action !</p>
          </div>
          <div className="bg-gray-800 rounded-full px-6 py-2">
            <span className="text-yellow-400 font-bold">
              💰 {user?.totalChips?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        {/* Intro Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-4">🔥 Bienvenue dans le monde de l'Omaha</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-10 rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">🎴</div>
              <div className="text-white font-bold">4 cartes privées</div>
              <div className="text-orange-200 text-sm">vs 2 en Hold'em</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-white font-bold">Variance élevée</div>
              <div className="text-orange-200 text-sm">Pots massifs garantis</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-white font-bold">Pot Limit</div>
              <div className="text-orange-200 text-sm">Mises limitées au pot</div>
            </div>
          </div>
        </motion.div>

        {/* Variant Selection */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Format Selection */}
            <div>
              <h3 className="text-white font-bold mb-3">🎮 Format</h3>
              <div className="flex gap-2">
                {[
                  { value: 'cash', label: '💵 Cash Game' },
                  { value: 'tournament', label: '🏆 Tournois' },
                  { value: 'sit-n-go', label: '🎯 Sit & Go' },
                ].map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setSelectedFormat(format.value)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedFormat === format.value
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {format.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Variant Selection */}
            <div>
              <h3 className="text-white font-bold mb-3">🃏 Variante</h3>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'Toutes' },
                  { value: 'PLO', label: 'PLO (4 cards)' },
                  { value: 'PLO5', label: 'PLO5 (5 cards)' },
                  { value: 'PLO Hi-Lo', label: 'PLO Hi-Lo' },
                ].map((variant) => (
                  <button
                    key={variant.value}
                    onClick={() => setSelectedVariant(variant.value)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedVariant === variant.value
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tables List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            🎲 {selectedFormat === 'cash' ? 'Tables Cash' : selectedFormat === 'tournament' ? 'Tournois' : 'Sit & Go'} ({filteredTables.length})
          </h2>

          {filteredTables.map((table, index) => (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 hover:border-orange-500 transition cursor-pointer"
              onClick={() => handleJoinTable(table)}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Table Info */}
                <div className="flex items-center space-x-6">
                  <div className={`rounded-xl px-6 py-4 min-w-[140px] text-center ${getVariantColor(table.variant)}`}>
                    <div className="text-2xl font-bold">{table.variant}</div>
                    <div className="text-sm opacity-90">{table.stake}</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{table.name}</h3>
                    <div className="flex items-center space-x-3">
                      {table.speed && (
                        <span className={`${table.speed === 'fast-fold' ? 'bg-purple-600' : 'bg-blue-600'} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                          {table.speed === 'fast-fold' ? '⚡ Zoom' : '⏱️ Regular'}
                        </span>
                      )}
                      <span className="bg-gray-900 text-gray-400 px-3 py-1 rounded-full text-xs capitalize">
                        {table.format}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                {selectedFormat === 'cash' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-900 rounded-xl p-3 text-center">
                      <div className="text-gray-400 text-xs mb-1">Joueurs</div>
                      <div className="text-green-400 font-bold">
                        {table.speed === 'fast-fold' ? table.players : `${table.players}/${table.maxPlayers}`}
                      </div>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-3 text-center">
                      <div className="text-gray-400 text-xs mb-1">Pot Moyen</div>
                      <div className="text-yellow-400 font-bold">${table.avgPot.toFixed(2)}</div>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-3 text-center">
                      <div className="text-gray-400 text-xs mb-1">Buy-in</div>
                      <div className="text-white font-bold text-sm">
                        ${table.minBuyIn} - ${table.maxBuyIn}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900 rounded-xl p-3 text-center">
                      <div className="text-gray-400 text-xs mb-1">Inscrits</div>
                      <div className="text-green-400 font-bold">{table.players}/{table.maxPlayers}</div>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-3 text-center">
                      <div className="text-gray-400 text-xs mb-1">Buy-in</div>
                      <div className="text-yellow-400 font-bold">${table.minBuyIn}</div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinTable(table);
                  }}
                  className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-orange-600 to-red-700 text-white hover:from-orange-700 hover:to-red-800 transition"
                >
                  ▶️ Rejoindre
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rules & Strategy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Rules */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-white mb-4">📜 Règles Omaha</h3>
            <div className="space-y-3 text-gray-300">
              <div className="bg-gray-900 rounded-xl p-4">
                <div className="text-orange-400 font-bold mb-2">🎴 Cartes Privées</div>
                <p className="text-sm">Chaque joueur reçoit 4 cartes privées (vs 2 en Hold'em)</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-4">
                <div className="text-orange-400 font-bold mb-2">🤝 Obligation 2/3</div>
                <p className="text-sm">Vous DEVEZ utiliser exactement 2 de vos cartes + 3 du board</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-4">
                <div className="text-orange-400 font-bold mb-2">💰 Pot Limit</div>
                <p className="text-sm">Mise max = taille du pot actuel</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-4">
                <div className="text-orange-400 font-bold mb-2">🔄 Hi-Lo Split</div>
                <p className="text-sm">En Hi-Lo: pot divisé entre meilleure et pire main (8-or-better)</p>
              </div>
            </div>
          </div>

          {/* Strategy */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-white mb-4">🎯 Stratégie Omaha</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-orange-400 font-bold">•</span>
                <p><strong>Starting Hands</strong>: Cherchez les "double suited" (deux paires de couleurs) et cartes connectées (ex: A♥ K♥ Q♠ J♠)</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-orange-400 font-bold">•</span>
                <p><strong>Nuts ou Rien</strong>: Top pair est souvent perdante. Visez les nuts (meilleure main possible)</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-orange-400 font-bold">•</span>
                <p><strong>Tirages Monstres</strong>: Avec 4 cartes, vous aurez souvent 13-20 outs. Jouez agressif vos gros tirages</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-orange-400 font-bold">•</span>
                <p><strong>Position++</strong>: Encore plus importante qu'en Hold'em. Ne jouez que des mains premium hors position</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-orange-400 font-bold">•</span>
                <p><strong>Bankroll</strong>: Variance 3x plus élevée qu'en Hold'em. Gardez 50-100 buy-ins minimum</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-orange-400 font-bold">•</span>
                <p><strong>PLO5</strong>: Avec 5 cartes, action encore plus wild. Mains premium uniquement !</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Example Hands */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-2xl font-bold text-white mb-4">🃏 Exemples de Mains Premium</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-orange-900 to-red-900 rounded-xl p-4 border-2 border-orange-400">
              <div className="text-orange-200 text-sm mb-2">🏆 The Nuts</div>
              <div className="text-white font-bold text-lg mb-2">A♠ A♥ K♠ K♥</div>
              <p className="text-orange-200 text-xs">Double paire d'As-Rois double suited = monster</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-xl p-4 border-2 border-purple-400">
              <div className="text-purple-200 text-sm mb-2">⚡ Action Hand</div>
              <div className="text-white font-bold text-lg mb-2">Q♥ J♥ T♠ 9♠</div>
              <p className="text-purple-200 text-xs">Double suited connecteurs = gros potentiel de tirages</p>
            </div>
            <div className="bg-gradient-to-br from-blue-900 to-cyan-900 rounded-xl p-4 border-2 border-blue-400">
              <div className="text-blue-200 text-sm mb-2">💎 Premium Rundown</div>
              <div className="text-white font-bold text-lg mb-2">A♣ K♦ Q♣ J♦</div>
              <p className="text-blue-200 text-xs">Broadway rundown double suited = très jouable</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
