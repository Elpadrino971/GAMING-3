'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Disable static generation
export const dynamic = 'force-dynamic';

interface Table {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  blinds: string;
  pot: number;
  yourStack: number;
  position: 'dealer' | 'sb' | 'bb' | 'utg' | 'mp' | 'co' | null;
  action: 'your_turn' | 'waiting' | 'folded';
  timeLeft?: number;
}

export default function MultiTablesPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  // Simulated tables
  const [activeTables, setActiveTables] = useState<Table[]>([
    {
      id: 'table-1',
      name: 'Table Turbo #1',
      players: 6,
      maxPlayers: 9,
      blinds: '50/100',
      pot: 450,
      yourStack: 2500,
      position: 'dealer',
      action: 'your_turn',
      timeLeft: 15,
    },
    {
      id: 'table-2',
      name: 'Table High Stakes #2',
      players: 8,
      maxPlayers: 9,
      blinds: '100/200',
      pot: 1200,
      yourStack: 5400,
      position: 'bb',
      action: 'waiting',
    },
    {
      id: 'table-3',
      name: 'Table Micro #3',
      players: 5,
      maxPlayers: 6,
      blinds: '10/20',
      pot: 80,
      yourStack: 980,
      position: 'co',
      action: 'folded',
    },
  ]);

  const [layout, setLayout] = useState<'grid' | 'cascade' | 'tile'>('grid');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const handleOpenTable = (tableId: string) => {
    router.push(`/play-multiplayer?tableId=${tableId}`);
  };

  const handleCloseTable = (tableId: string) => {
    setActiveTables(prev => prev.filter(t => t.id !== tableId));
  };

  const getTotalPot = () => {
    return activeTables.reduce((sum, table) => sum + table.pot, 0);
  };

  const getTotalStack = () => {
    return activeTables.reduce((sum, table) => sum + table.yourStack, 0);
  };

  const getActionTables = () => {
    return activeTables.filter(t => t.action === 'your_turn').length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/multiplayer-lobby" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Retour au Lobby
          </Link>
          <h1 className="text-3xl font-bold text-white">🎰 Multi-Tables</h1>
          <div className="flex items-center space-x-3">
            <div className="bg-gray-800 rounded-full px-4 py-2">
              <span className="text-yellow-400 font-bold">
                💰 {user?.totalChips?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 rounded-xl p-4 border-2 border-blue-500"
          >
            <div className="text-blue-400 text-sm mb-1">Tables Actives</div>
            <div className="text-2xl font-bold text-white">{activeTables.length}</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 rounded-xl p-4 border-2 border-yellow-500"
          >
            <div className="text-yellow-400 text-sm mb-1">Pot Total</div>
            <div className="text-2xl font-bold text-white">{getTotalPot().toLocaleString()}</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 rounded-xl p-4 border-2 border-green-500"
          >
            <div className="text-green-400 text-sm mb-1">Stack Total</div>
            <div className="text-2xl font-bold text-white">{getTotalStack().toLocaleString()}</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 rounded-xl p-4 border-2 border-red-500"
          >
            <div className="text-red-400 text-sm mb-1">Action Requise</div>
            <div className="text-2xl font-bold text-white animate-pulse">{getActionTables()}</div>
          </motion.div>
        </div>

        {/* Layout Selector */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setLayout('grid')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                layout === 'grid'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              🔲 Grille
            </button>
            <button
              onClick={() => setLayout('cascade')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                layout === 'cascade'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              📊 Cascade
            </button>
            <button
              onClick={() => setLayout('tile')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                layout === 'tile'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              🗂️ Tuiles
            </button>
          </div>

          <button
            onClick={() => router.push('/multiplayer-lobby')}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition"
          >
            ➕ Rejoindre une Table
          </button>
        </div>

        {/* Tables Display */}
        {activeTables.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🎰</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Aucune Table Active
            </h2>
            <p className="text-gray-400 mb-6">
              Rejoignez une table pour commencer à jouer
            </p>
            <button
              onClick={() => router.push('/multiplayer-lobby')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-3 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition"
            >
              Trouver une Table
            </button>
          </div>
        ) : (
          <div
            className={`
              ${layout === 'grid' ? 'grid grid-cols-2 lg:grid-cols-3 gap-4' : ''}
              ${layout === 'cascade' ? 'space-y-4' : ''}
              ${layout === 'tile' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : ''}
            `}
          >
            {activeTables.map((table, index) => (
              <motion.div
                key={table.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`bg-gray-800 rounded-xl overflow-hidden border-4 ${
                  table.action === 'your_turn'
                    ? 'border-yellow-400 shadow-[0_0_30px_rgba(251,191,36,0.6)]'
                    : 'border-gray-700'
                }`}
              >
                {/* Table Header */}
                <div className="bg-gray-900 p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-bold">{table.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {table.players}/{table.maxPlayers} joueurs • Blindes {table.blinds}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCloseTable(table.id)}
                    className="text-gray-400 hover:text-red-400 transition"
                  >
                    ❌
                  </button>
                </div>

                {/* Table Preview (Simplified) */}
                <div
                  className="relative h-48 bg-gradient-to-br from-green-700 to-green-900 cursor-pointer"
                  onClick={() => handleOpenTable(table.id)}
                >
                  {/* Pot */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold">
                      POT: {table.pot}
                    </div>
                  </div>

                  {/* Position Indicator */}
                  {table.position && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {table.position.toUpperCase()}
                      </div>
                    </div>
                  )}

                  {/* Action Indicator */}
                  {table.action === 'your_turn' && table.timeLeft && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold"
                    >
                      ⏱️ {table.timeLeft}s
                    </motion.div>
                  )}
                </div>

                {/* Table Footer */}
                <div className="bg-gray-900 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="text-gray-400 text-xs">Votre Stack</div>
                      <div className="text-green-400 font-bold">
                        💰 {table.yourStack.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Statut</div>
                      <div
                        className={`font-bold ${
                          table.action === 'your_turn'
                            ? 'text-yellow-400'
                            : table.action === 'waiting'
                            ? 'text-blue-400'
                            : 'text-gray-400'
                        }`}
                      >
                        {table.action === 'your_turn'
                          ? '⚡ Votre Tour'
                          : table.action === 'waiting'
                          ? '⏳ En Attente'
                          : '🚫 Couché'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenTable(table.id)}
                    className={`w-full py-2 rounded-lg font-bold transition ${
                      table.action === 'your_turn'
                        ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 animate-pulse'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {table.action === 'your_turn' ? '⚡ JOUER MAINTENANT' : '👁️ Voir la Table'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {activeTables.length > 0 && (
          <div className="mt-6 bg-gray-800 rounded-xl p-6">
            <h3 className="text-white font-bold mb-4">Actions Rapides</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition">
                🔕 Tout Mettre en Sourdine
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition">
                👁️ Masquer Toutes les Tables
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition">
                📊 Statistiques Globales
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition">
                🚪 Quitter Toutes les Tables
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
