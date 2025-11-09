'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  gameType: 'No-Limit Hold\'em' | 'PLO' | 'Omaha Hi-Lo' | 'LA BOUCHERIE';
  stakes: string;
  handsPlayed: number;
  profit: number;
}

interface MultiTableSettings {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  hotkeysEnabled: boolean;
  autoFold: boolean;
  autoCheckFold: boolean;
  showProfit: boolean;
  tableOpacity: number;
}

export default function MultiTablesPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  // Simulated tables with extended data
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
      gameType: 'No-Limit Hold\'em',
      stakes: 'NL100',
      handsPlayed: 47,
      profit: 350,
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
      gameType: 'No-Limit Hold\'em',
      stakes: 'NL200',
      handsPlayed: 63,
      profit: -120,
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
      gameType: 'PLO',
      stakes: 'PLO20',
      handsPlayed: 31,
      profit: 85,
    },
    {
      id: 'table-4',
      name: 'LA BOUCHERIE #1',
      players: 6,
      maxPlayers: 9,
      blinds: '25/50',
      pot: 650,
      yourStack: 1850,
      position: 'utg',
      action: 'waiting',
      gameType: 'LA BOUCHERIE',
      stakes: 'NL50',
      handsPlayed: 22,
      profit: -200,
    },
  ]);

  const [layout, setLayout] = useState<'grid' | 'cascade' | 'tile' | 'stack'>('grid');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'action' | 'waiting'>('all');
  const [showSettings, setShowSettings] = useState(false);

  const [settings, setSettings] = useState<MultiTableSettings>({
    soundEnabled: true,
    notificationsEnabled: true,
    hotkeysEnabled: true,
    autoFold: false,
    autoCheckFold: false,
    showProfit: true,
    tableOpacity: 100,
  });

  // Hotkey support
  useEffect(() => {
    if (!settings.hotkeysEnabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();

      // Action hotkeys (F=Fold, C=Call, R=Raise, A=All-in)
      if (key === 'f') {
        console.log('Hotkey: FOLD');
        playSound('action');
      } else if (key === 'c') {
        console.log('Hotkey: CALL');
        playSound('action');
      } else if (key === 'r') {
        console.log('Hotkey: RAISE');
        playSound('action');
      } else if (key === 'a') {
        console.log('Hotkey: ALL-IN');
        playSound('action');
      }

      // Table focus hotkeys (1-9)
      const num = parseInt(key);
      if (num >= 1 && num <= 9 && activeTables[num - 1]) {
        setSelectedTable(activeTables[num - 1].id);
        playSound('select');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [settings.hotkeysEnabled, activeTables]);

  // Desktop notifications
  useEffect(() => {
    if (settings.notificationsEnabled && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [settings.notificationsEnabled]);

  // Check for action required tables
  useEffect(() => {
    const actionTables = activeTables.filter(t => t.action === 'your_turn');

    if (actionTables.length > 0 && settings.notificationsEnabled) {
      playSound('alert');

      if (Notification.permission === 'granted') {
        actionTables.forEach(table => {
          new Notification('⚡ Action Required!', {
            body: `It's your turn at ${table.name}`,
            icon: '/poker-chip.png',
            tag: table.id,
          });
        });
      }
    }
  }, [activeTables, settings.notificationsEnabled]);

  const playSound = (type: 'alert' | 'action' | 'select') => {
    if (!settings.soundEnabled) return;

    // In a real app, this would play actual audio files
    console.log(`🔊 Playing sound: ${type}`);
  };

  const handleOpenTable = (tableId: string) => {
    router.push(`/play-multiplayer?tableId=${tableId}`);
  };

  const handleCloseTable = (tableId: string) => {
    setActiveTables(prev => prev.filter(t => t.id !== tableId));
    playSound('action');
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

  const getTotalProfit = () => {
    return activeTables.reduce((sum, table) => sum + table.profit, 0);
  };

  const getTotalHands = () => {
    return activeTables.reduce((sum, table) => sum + table.handsPlayed, 0);
  };

  const getAvgProfit = () => {
    const totalHands = getTotalHands();
    return totalHands > 0 ? (getTotalProfit() / totalHands).toFixed(2) : '0.00';
  };

  const filteredTables = activeTables.filter(table => {
    if (filter === 'all') return true;
    if (filter === 'action') return table.action === 'your_turn';
    if (filter === 'waiting') return table.action === 'waiting';
    return true;
  });

  const toggleSetting = (key: keyof MultiTableSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: typeof prev[key] === 'boolean' ? !prev[key] : prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <Link href="/multiplayer-lobby" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Retour au Lobby
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">🎰 Multi-Tables Manager</h1>
            <p className="text-gray-400 text-sm mt-1">
              Jouez sur plusieurs tables simultanément comme un pro
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
            >
              ⚙️ Paramètres
            </button>
            <div className="bg-gray-800 rounded-full px-4 py-2">
              <span className="text-yellow-400 font-bold">
                💰 {user?.totalChips?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-800 rounded-xl p-6 mb-6 overflow-hidden"
            >
              <h3 className="text-white font-bold mb-4 text-xl">⚙️ Paramètres Multi-Tables</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                  <span className="text-white">🔊 Sons</span>
                  <button
                    onClick={() => toggleSetting('soundEnabled')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      settings.soundEnabled ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    {settings.soundEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                  <span className="text-white">🔔 Notifications</span>
                  <button
                    onClick={() => toggleSetting('notificationsEnabled')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      settings.notificationsEnabled ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    {settings.notificationsEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                  <span className="text-white">⌨️ Raccourcis Clavier</span>
                  <button
                    onClick={() => toggleSetting('hotkeysEnabled')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      settings.hotkeysEnabled ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    {settings.hotkeysEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                  <span className="text-white">📊 Afficher Profit</span>
                  <button
                    onClick={() => toggleSetting('showProfit')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      settings.showProfit ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    {settings.showProfit ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                  <span className="text-white">🚫 Auto-Fold</span>
                  <button
                    onClick={() => toggleSetting('autoFold')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      settings.autoFold ? 'bg-red-600' : 'bg-gray-600'
                    }`}
                  >
                    {settings.autoFold ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                  <span className="text-white">✅ Auto Check/Fold</span>
                  <button
                    onClick={() => toggleSetting('autoCheckFold')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      settings.autoCheckFold ? 'bg-orange-600' : 'bg-gray-600'
                    }`}
                  >
                    {settings.autoCheckFold ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              {settings.hotkeysEnabled && (
                <div className="mt-6 bg-gray-900 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-bold mb-3">⌨️ Raccourcis Clavier</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="text-white"><span className="bg-gray-700 px-2 py-1 rounded">F</span> = Fold</div>
                    <div className="text-white"><span className="bg-gray-700 px-2 py-1 rounded">C</span> = Call</div>
                    <div className="text-white"><span className="bg-gray-700 px-2 py-1 rounded">R</span> = Raise</div>
                    <div className="text-white"><span className="bg-gray-700 px-2 py-1 rounded">A</span> = All-in</div>
                    <div className="text-white"><span className="bg-gray-700 px-2 py-1 rounded">1-9</span> = Focus Table</div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Stats Bar - 6 cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
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

          {settings.showProfit && (
            <>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`bg-gray-800 rounded-xl p-4 border-2 ${
                  getTotalProfit() >= 0 ? 'border-green-400' : 'border-red-400'
                }`}
              >
                <div className={`text-sm mb-1 ${getTotalProfit() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  Profit Total
                </div>
                <div className={`text-2xl font-bold ${getTotalProfit() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {getTotalProfit() >= 0 ? '+' : ''}{getTotalProfit().toLocaleString()}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 rounded-xl p-4 border-2 border-purple-500"
              >
                <div className="text-purple-400 text-sm mb-1">Mains Jouées</div>
                <div className="text-2xl font-bold text-white">{getTotalHands()}</div>
                <div className="text-xs text-gray-400 mt-1">Avg: {getAvgProfit()}/hand</div>
              </motion.div>
            </>
          )}
        </div>

        {/* Layout & Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-wrap gap-2">
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
            <button
              onClick={() => setLayout('stack')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                layout === 'stack'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              📚 Stack
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              Toutes ({activeTables.length})
            </button>
            <button
              onClick={() => setFilter('action')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'action'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              Action ({getActionTables()})
            </button>
            <button
              onClick={() => setFilter('waiting')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'waiting'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              En Attente
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
        {filteredTables.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🎰</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              {activeTables.length === 0 ? 'Aucune Table Active' : 'Aucune Table Correspondante'}
            </h2>
            <p className="text-gray-400 mb-6">
              {activeTables.length === 0
                ? 'Rejoignez une table pour commencer à jouer'
                : 'Aucune table ne correspond à ce filtre'
              }
            </p>
            {activeTables.length === 0 && (
              <button
                onClick={() => router.push('/multiplayer-lobby')}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-3 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition"
              >
                Trouver une Table
              </button>
            )}
          </div>
        ) : (
          <div
            className={`
              ${layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : ''}
              ${layout === 'cascade' ? 'space-y-4' : ''}
              ${layout === 'tile' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : ''}
              ${layout === 'stack' ? 'grid grid-cols-1 gap-3' : ''}
            `}
          >
            {filteredTables.map((table, index) => (
              <motion.div
                key={table.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: layout === 'stack' ? 1.01 : 1.02 }}
                className={`bg-gray-800 rounded-xl overflow-hidden border-4 ${
                  table.action === 'your_turn'
                    ? 'border-yellow-400 shadow-[0_0_30px_rgba(251,191,36,0.6)]'
                    : 'border-gray-700'
                }`}
                style={{ opacity: settings.tableOpacity / 100 }}
              >
                {/* Table Header */}
                <div className="bg-gray-900 p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold">{table.name}</h3>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                        #{index + 1}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {table.gameType} • {table.stakes}
                    </p>
                    <p className="text-gray-500 text-xs">
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

                {/* Table Preview */}
                <div
                  className={`relative ${layout === 'stack' ? 'h-32' : 'h-48'} bg-gradient-to-br ${
                    table.gameType === 'LA BOUCHERIE'
                      ? 'from-red-900 to-red-950'
                      : 'from-green-700 to-green-900'
                  } cursor-pointer`}
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
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="text-gray-400 text-xs">Votre Stack</div>
                      <div className="text-green-400 font-bold">
                        💰 {table.yourStack.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Statut</div>
                      <div
                        className={`font-bold text-sm ${
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
                    {settings.showProfit && (
                      <>
                        <div>
                          <div className="text-gray-400 text-xs">Mains</div>
                          <div className="text-white font-bold">{table.handsPlayed}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs">Profit</div>
                          <div className={`font-bold ${table.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {table.profit >= 0 ? '+' : ''}{table.profit}
                          </div>
                        </div>
                      </>
                    )}
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
            <h3 className="text-white font-bold mb-4">⚡ Actions Rapides</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => toggleSetting('soundEnabled')}
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
              >
                {settings.soundEnabled ? '🔕' : '🔊'} Son
              </button>
              <button
                onClick={() => setLayout(layout === 'grid' ? 'tile' : 'grid')}
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
              >
                🔄 Changer Layout
              </button>
              <button
                onClick={() => toggleSetting('showProfit')}
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
              >
                📊 Stats {settings.showProfit ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir quitter toutes les tables?')) {
                    setActiveTables([]);
                    router.push('/multiplayer-lobby');
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
              >
                🚪 Quitter Tout
              </button>
            </div>
          </div>
        )}

        {/* Help Info */}
        {settings.hotkeysEnabled && activeTables.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6 border-2 border-blue-500">
            <h3 className="text-white font-bold mb-3">💡 Guide Multi-Tables</h3>
            <div className="text-white text-sm space-y-2">
              <p>• Utilisez <span className="bg-gray-700 px-2 py-1 rounded">F/C/R/A</span> pour Fold/Call/Raise/All-in</p>
              <p>• Appuyez sur <span className="bg-gray-700 px-2 py-1 rounded">1-9</span> pour focus une table</p>
              <p>• Les tables avec action clignotent en jaune ⚡</p>
              <p>• Le multi-tabling permet de jouer 300-800 mains/heure (vs 60-80 sur une seule table)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
