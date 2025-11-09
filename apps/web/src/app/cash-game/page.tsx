'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Disable static generation
export const dynamic = 'force-dynamic';

interface CashTable {
  id: string;
  name: string;
  stake: string;
  smallBlind: number;
  bigBlind: number;
  minBuyIn: number;
  maxBuyIn: number;
  players: number;
  maxPlayers: number;
  avgPot: number;
  handsPerHour: number;
  gameType: 'No-Limit' | 'Pot-Limit' | 'Fixed-Limit';
  variant: 'Hold\'em' | 'Omaha' | 'Omaha Hi-Lo';
  speed: 'regular' | 'fast-fold' | 'turbo';
  waitingList: number;
}

export default function CashGamePage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [selectedStake, setSelectedStake] = useState<string>('all');
  const [selectedSpeed, setSelectedSpeed] = useState<string>('all');
  const [showFastFold, setShowFastFold] = useState(false);

  // Cash Game Tables
  const CASH_TABLES: CashTable[] = [
    {
      id: 'nl2-1',
      name: 'Micro Stakes #1',
      stake: 'NL2',
      smallBlind: 0.01,
      bigBlind: 0.02,
      minBuyIn: 0.40,
      maxBuyIn: 2.00,
      players: 5,
      maxPlayers: 6,
      avgPot: 0.15,
      handsPerHour: 75,
      gameType: 'No-Limit',
      variant: 'Hold\'em',
      speed: 'regular',
      waitingList: 0,
    },
    {
      id: 'nl5-1',
      name: 'Beginner Paradise',
      stake: 'NL5',
      smallBlind: 0.02,
      bigBlind: 0.05,
      minBuyIn: 1.00,
      maxBuyIn: 5.00,
      players: 6,
      maxPlayers: 6,
      avgPot: 0.35,
      handsPerHour: 70,
      gameType: 'No-Limit',
      variant: 'Hold\'em',
      speed: 'regular',
      waitingList: 2,
    },
    {
      id: 'nl10-zoom',
      name: 'Zoom NL10',
      stake: 'NL10',
      smallBlind: 0.05,
      bigBlind: 0.10,
      minBuyIn: 2.00,
      maxBuyIn: 10.00,
      players: 234,
      maxPlayers: 999,
      avgPot: 0.75,
      handsPerHour: 250,
      gameType: 'No-Limit',
      variant: 'Hold\'em',
      speed: 'fast-fold',
      waitingList: 0,
    },
    {
      id: 'nl25-1',
      name: 'Mid Stakes Action',
      stake: 'NL25',
      smallBlind: 0.10,
      bigBlind: 0.25,
      minBuyIn: 5.00,
      maxBuyIn: 25.00,
      players: 4,
      maxPlayers: 6,
      avgPot: 2.50,
      handsPerHour: 65,
      gameType: 'No-Limit',
      variant: 'Hold\'em',
      speed: 'regular',
      waitingList: 0,
    },
    {
      id: 'nl50-zoom',
      name: 'Zoom NL50',
      stake: 'NL50',
      smallBlind: 0.25,
      bigBlind: 0.50,
      minBuyIn: 10.00,
      maxBuyIn: 50.00,
      players: 156,
      maxPlayers: 999,
      avgPot: 4.20,
      handsPerHour: 280,
      gameType: 'No-Limit',
      variant: 'Hold\'em',
      speed: 'fast-fold',
      waitingList: 0,
    },
    {
      id: 'nl100-1',
      name: 'High Stakes Table',
      stake: 'NL100',
      smallBlind: 0.50,
      bigBlind: 1.00,
      minBuyIn: 20.00,
      maxBuyIn: 100.00,
      players: 5,
      maxPlayers: 6,
      avgPot: 8.50,
      handsPerHour: 60,
      gameType: 'No-Limit',
      variant: 'Hold\'em',
      speed: 'regular',
      waitingList: 1,
    },
    {
      id: 'nl200-1',
      name: 'Nosebleed Action',
      stake: 'NL200',
      smallBlind: 1.00,
      bigBlind: 2.00,
      minBuyIn: 40.00,
      maxBuyIn: 200.00,
      players: 3,
      maxPlayers: 6,
      avgPot: 18.00,
      handsPerHour: 55,
      gameType: 'No-Limit',
      variant: 'Hold\'em',
      speed: 'regular',
      waitingList: 3,
    },
    {
      id: 'nl500-1',
      name: 'Elite Players Only',
      stake: 'NL500',
      smallBlind: 2.50,
      bigBlind: 5.00,
      minBuyIn: 100.00,
      maxBuyIn: 500.00,
      players: 2,
      maxPlayers: 6,
      avgPot: 45.00,
      handsPerHour: 50,
      gameType: 'No-Limit',
      variant: 'Hold\'em',
      speed: 'regular',
      waitingList: 0,
    },
    {
      id: 'plo10-1',
      name: 'PLO Action',
      stake: 'PLO10',
      smallBlind: 0.05,
      bigBlind: 0.10,
      minBuyIn: 2.00,
      maxBuyIn: 10.00,
      players: 4,
      maxPlayers: 6,
      avgPot: 1.80,
      handsPerHour: 70,
      gameType: 'Pot-Limit',
      variant: 'Omaha',
      speed: 'regular',
      waitingList: 0,
    },
    {
      id: 'plo50-zoom',
      name: 'Zoom PLO50',
      stake: 'PLO50',
      smallBlind: 0.25,
      bigBlind: 0.50,
      minBuyIn: 10.00,
      maxBuyIn: 50.00,
      players: 89,
      maxPlayers: 999,
      avgPot: 8.50,
      handsPerHour: 260,
      gameType: 'Pot-Limit',
      variant: 'Omaha',
      speed: 'fast-fold',
      waitingList: 0,
    },
  ];

  const stakes = ['all', 'NL2', 'NL5', 'NL10', 'NL25', 'NL50', 'NL100', 'NL200', 'NL500'];

  const filteredTables = CASH_TABLES.filter((table) => {
    const matchesStake = selectedStake === 'all' || table.stake === selectedStake;
    const matchesSpeed = selectedSpeed === 'all' ||
      (selectedSpeed === 'fast-fold' && table.speed === 'fast-fold') ||
      (selectedSpeed === 'regular' && table.speed === 'regular');
    return matchesStake && matchesSpeed;
  });

  const handleJoinTable = (table: CashTable) => {
    alert(`🎲 Rejoindre la table: ${table.name}\n\nStake: ${table.stake}\nBuy-in: $${table.minBuyIn} - $${table.maxBuyIn}\n\nBonne chance !`);
  };

  const getSpeedBadge = (speed: string) => {
    switch (speed) {
      case 'fast-fold':
        return { label: '⚡ Zoom', color: 'bg-purple-600' };
      case 'turbo':
        return { label: '🚀 Turbo', color: 'bg-orange-600' };
      default:
        return { label: '⏱️ Regular', color: 'bg-blue-600' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Retour
          </Link>
          <div className="text-center">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 mb-2">
              💵 CASH GAME
            </h1>
            <p className="text-gray-300 text-lg">Tables en argent réel - Entrez et sortez quand vous voulez</p>
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
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-10 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🎰</div>
              <div className="text-white font-bold">{CASH_TABLES.length} Tables Actives</div>
              <div className="text-green-200 text-sm">En direct maintenant</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-white font-bold">
                {CASH_TABLES.reduce((sum, table) => sum + table.players, 0)} Joueurs
              </div>
              <div className="text-green-200 text-sm">En ligne</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">💵</div>
              <div className="text-white font-bold">$0.02 - $5.00</div>
              <div className="text-green-200 text-sm">Blinds disponibles</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-white font-bold">Zoom Poker</div>
              <div className="text-green-200 text-sm">Fast-fold disponible</div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stakes Filter */}
            <div>
              <h3 className="text-white font-bold mb-3">💰 Limites</h3>
              <div className="flex flex-wrap gap-2">
                {stakes.map((stake) => (
                  <button
                    key={stake}
                    onClick={() => setSelectedStake(stake)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedStake === stake
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {stake === 'all' ? 'Toutes' : stake}
                  </button>
                ))}
              </div>
            </div>

            {/* Speed Filter */}
            <div>
              <h3 className="text-white font-bold mb-3">⚡ Vitesse</h3>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'Toutes' },
                  { value: 'regular', label: '⏱️ Regular' },
                  { value: 'fast-fold', label: '⚡ Zoom' },
                ].map((speed) => (
                  <button
                    key={speed.value}
                    onClick={() => setSelectedSpeed(speed.value)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedSpeed === speed.value
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {speed.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tables List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">🎲 Tables Disponibles ({filteredTables.length})</h2>
          {filteredTables.map((table, index) => {
            const speedBadge = getSpeedBadge(table.speed);
            const isFull = table.players >= table.maxPlayers && table.speed !== 'fast-fold';
            const seatAvailable = table.maxPlayers - table.players;

            return (
              <motion.div
                key={table.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-gray-800 rounded-2xl p-6 border-2 ${
                  isFull ? 'border-red-500' : 'border-gray-700 hover:border-green-500'
                } transition cursor-pointer`}
                onClick={() => !isFull && handleJoinTable(table)}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  {/* Table Info */}
                  <div className="flex items-center space-x-6">
                    <div className="bg-green-900 rounded-xl px-6 py-4 min-w-[120px] text-center">
                      <div className="text-3xl font-bold text-green-400">{table.stake}</div>
                      <div className="text-gray-300 text-sm">
                        ${table.smallBlind.toFixed(2)}/${table.bigBlind.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{table.name}</h3>
                      <div className="flex items-center space-x-3">
                        <span className={`${speedBadge.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                          {speedBadge.label}
                        </span>
                        <span className="bg-gray-900 text-gray-400 px-3 py-1 rounded-full text-xs">
                          {table.gameType} {table.variant}
                        </span>
                        {table.waitingList > 0 && (
                          <span className="bg-yellow-900 text-yellow-400 px-3 py-1 rounded-full text-xs">
                            ⏳ {table.waitingList} en attente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-900 rounded-xl p-3 text-center">
                      <div className="text-gray-400 text-xs mb-1">Joueurs</div>
                      <div className={`font-bold ${isFull ? 'text-red-400' : 'text-green-400'}`}>
                        {table.speed === 'fast-fold' ? `${table.players}` : `${table.players}/${table.maxPlayers}`}
                      </div>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-3 text-center">
                      <div className="text-gray-400 text-xs mb-1">Pot Moyen</div>
                      <div className="text-yellow-400 font-bold">${table.avgPot.toFixed(2)}</div>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-3 text-center">
                      <div className="text-gray-400 text-xs mb-1">Mains/h</div>
                      <div className="text-blue-400 font-bold">{table.handsPerHour}</div>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-3 text-center">
                      <div className="text-gray-400 text-xs mb-1">Buy-in</div>
                      <div className="text-white font-bold text-sm">
                        ${table.minBuyIn} - ${table.maxBuyIn}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: isFull ? 1 : 1.05 }}
                    whileTap={{ scale: isFull ? 1 : 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinTable(table);
                    }}
                    disabled={isFull}
                    className={`px-8 py-3 rounded-xl font-bold transition ${
                      isFull
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                    }`}
                  >
                    {isFull ? '🔒 Complet' : `▶️ Rejoindre${table.speed === 'fast-fold' ? '' : ` (${seatAvailable} places)`}`}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-2xl font-bold text-white mb-4">💡 Guide Cash Game</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-green-400 mb-3">⚡ Zoom Poker (Fast-Fold)</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-green-400">•</span>
                  <span>Fold instantané = nouvelle main immédiatement</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-400">•</span>
                  <span>250-300 mains par heure (vs 60-80 en regular)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-400">•</span>
                  <span>Pas de table tracking - adversaires changent constamment</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-400">•</span>
                  <span>Jouez plus serré - moins de reads disponibles</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-blue-400 mb-3">🎯 Stratégie Cash Game</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400">•</span>
                  <span>Bankroll : 30-50 buy-ins minimum pour votre stake</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400">•</span>
                  <span>Table selection : cherchez les fish (VPIP &gt; 40%)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400">•</span>
                  <span>Buy-in full (100BB) pour maximiser vos edges</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400">•</span>
                  <span>Stop-loss : quittez si vous perdez 3 buy-ins</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
