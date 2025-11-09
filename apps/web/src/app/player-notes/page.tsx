'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Disable static generation
export const dynamic = 'force-dynamic';

interface PlayerNote {
  id: string;
  username: string;
  avatar: string;
  tags: ('fish' | 'shark' | 'aggressive' | 'passive' | 'bluffer' | 'tight' | 'loose' | 'tilting')[];
  color: string; // Color coding for quick recognition
  notes: string;
  lastSeen: Date;
  tablesPlayed: number;
  handsPlayed: number;
  vpip: number;
  pfr: number;
  aggression: number;
  winRate: number;
  profit: number;
}

export default function PlayerNotesPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerNote | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Sample player notes data
  const [playerNotes, setPlayerNotes] = useState<PlayerNote[]>([
    {
      id: 'player-1',
      username: 'SharkMaster99',
      avatar: '🦈',
      tags: ['shark', 'aggressive', 'tight'],
      color: '#ef4444', // red
      notes: 'Très bon joueur. 3-bet beaucoup en position. Ne pas le bluffer sur la river. Respecte les grosses mises.',
      lastSeen: new Date('2025-11-09T14:30:00'),
      tablesPlayed: 12,
      handsPlayed: 340,
      vpip: 22,
      pfr: 18,
      aggression: 3.8,
      winRate: 8.5,
      profit: 2400,
    },
    {
      id: 'player-2',
      username: 'CallStation88',
      avatar: '📞',
      tags: ['fish', 'passive', 'loose'],
      color: '#22c55e', // green
      notes: 'Call station classique. Ne fold jamais sur le flop. Value bet thin sur river. Cible parfaite pour extraire de la value.',
      lastSeen: new Date('2025-11-09T10:15:00'),
      tablesPlayed: 8,
      handsPlayed: 256,
      vpip: 48,
      pfr: 8,
      aggression: 0.9,
      winRate: -12.3,
      profit: -1850,
    },
    {
      id: 'player-3',
      username: 'BluffKing777',
      avatar: '🃏',
      tags: ['bluffer', 'aggressive', 'loose'],
      color: '#f59e0b', // orange
      notes: 'Bluff énormément, surtout en position. C-bet 90% du temps. Peut être exploité en le callant down léger.',
      lastSeen: new Date('2025-11-08T22:45:00'),
      tablesPlayed: 15,
      handsPlayed: 420,
      vpip: 38,
      pfr: 32,
      aggression: 5.2,
      winRate: 3.2,
      profit: 680,
    },
    {
      id: 'player-4',
      username: 'RockSolid',
      avatar: '🗿',
      tags: ['tight', 'passive'],
      color: '#6b7280', // gray
      notes: 'Ne joue que les nuts. Si il mise gros, il a la main. Facile à lire. Peut être bluffé facilement.',
      lastSeen: new Date('2025-11-07T18:20:00'),
      tablesPlayed: 6,
      handsPlayed: 145,
      vpip: 14,
      pfr: 10,
      aggression: 1.5,
      winRate: 2.1,
      profit: 180,
    },
    {
      id: 'player-5',
      username: 'TiltMaster',
      avatar: '😤',
      tags: ['tilting', 'aggressive', 'loose'],
      color: '#8b5cf6', // purple
      notes: 'Tilt très vite après un bad beat. Commence à jouer n\'importe quoi. Attendre qu\'il soit en tilt puis l\'exploiter.',
      lastSeen: new Date('2025-11-09T16:00:00'),
      tablesPlayed: 10,
      handsPlayed: 298,
      vpip: 42,
      pfr: 28,
      aggression: 4.5,
      winRate: -5.8,
      profit: -920,
    },
  ]);

  const availableTags = [
    { value: 'fish', label: '🐟 Fish', color: 'bg-green-600' },
    { value: 'shark', label: '🦈 Shark', color: 'bg-red-600' },
    { value: 'aggressive', label: '🔥 Agressif', color: 'bg-orange-600' },
    { value: 'passive', label: '💤 Passif', color: 'bg-blue-600' },
    { value: 'bluffer', label: '🃏 Bluffeur', color: 'bg-purple-600' },
    { value: 'tight', label: '🔒 Tight', color: 'bg-gray-600' },
    { value: 'loose', label: '🎲 Loose', color: 'bg-yellow-600' },
    { value: 'tilting', label: '😤 Tilteur', color: 'bg-pink-600' },
  ];

  const filteredPlayers = playerNotes.filter((player) => {
    const matchesSearch = player.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = filterTag === 'all' || player.tags.includes(filterTag as any);
    return matchesSearch && matchesTag;
  });

  const handleSaveNote = (playerId: string, newNotes: string, newTags: string[], newColor: string) => {
    setPlayerNotes((prev) =>
      prev.map((player) =>
        player.id === playerId
          ? { ...player, notes: newNotes, tags: newTags as any, color: newColor }
          : player
      )
    );
    setIsEditMode(false);
    setSelectedPlayer(null);
  };

  const handleDeleteNote = (playerId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      setPlayerNotes((prev) => prev.filter((player) => player.id !== playerId));
      setSelectedPlayer(null);
    }
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'À l\'instant';
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Retour
          </Link>
          <h1 className="text-4xl font-bold text-white">📝 Notes sur Joueurs</h1>
          <div className="bg-gray-800 rounded-full px-6 py-2">
            <span className="text-yellow-400 font-bold">
              💰 {user?.totalChips?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <div className="text-gray-400 text-sm mb-1">Joueurs Trackés</div>
              <div className="text-3xl font-bold text-white">{playerNotes.length}</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <div className="text-gray-400 text-sm mb-1">Fish Identifiés</div>
              <div className="text-3xl font-bold text-green-400">
                {playerNotes.filter((p) => p.tags.includes('fish')).length}
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <div className="text-gray-400 text-sm mb-1">Sharks Repérés</div>
              <div className="text-3xl font-bold text-red-400">
                {playerNotes.filter((p) => p.tags.includes('shark')).length}
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <div className="text-gray-400 text-sm mb-1">Profit Total</div>
              <div className="text-3xl font-bold text-yellow-400">
                {playerNotes.reduce((sum, p) => sum + p.profit, 0).toLocaleString()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Rechercher un joueur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterTag('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filterTag === 'all'
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Tous
              </button>
              {availableTags.map((tag) => (
                <button
                  key={tag.value}
                  onClick={() => setFilterTag(tag.value)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    filterTag === tag.value
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Players List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedPlayer(player)}
              className="bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-700 hover:border-yellow-400 transition cursor-pointer"
              style={{ borderLeftWidth: '8px', borderLeftColor: player.color }}
            >
              {/* Player Header */}
              <div className="bg-gray-900 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{player.avatar}</div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{player.username}</h3>
                      <p className="text-gray-400 text-sm">{formatLastSeen(player.lastSeen)}</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {player.tags.map((tag) => {
                    const tagInfo = availableTags.find((t) => t.value === tag);
                    return (
                      <span
                        key={tag}
                        className={`${tagInfo?.color} text-white px-2 py-1 rounded-full text-xs font-bold`}
                      >
                        {tagInfo?.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Stats */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-gray-900 rounded-lg p-2 text-center">
                    <div className="text-gray-400 text-xs">VPIP</div>
                    <div className="text-white font-bold text-sm">{player.vpip}%</div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-2 text-center">
                    <div className="text-gray-400 text-xs">PFR</div>
                    <div className="text-white font-bold text-sm">{player.pfr}%</div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-2 text-center">
                    <div className="text-gray-400 text-xs">AGG</div>
                    <div className="text-white font-bold text-sm">{player.aggression}</div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-2 text-center">
                    <div className="text-gray-400 text-xs">WR</div>
                    <div
                      className={`font-bold text-sm ${
                        player.winRate > 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {player.winRate > 0 ? '+' : ''}{player.winRate}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-400 text-xs">Profit</div>
                    <div
                      className={`font-bold ${player.profit > 0 ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {player.profit > 0 ? '+' : ''}{player.profit}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs">Mains</div>
                    <div className="text-white font-bold">{player.handsPlayed}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs">Tables</div>
                    <div className="text-white font-bold">{player.tablesPlayed}</div>
                  </div>
                </div>

                {/* Notes Preview */}
                <div className="bg-gray-900 rounded-lg p-3">
                  <p className="text-gray-300 text-sm line-clamp-2">{player.notes}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPlayers.length === 0 && (
          <div className="bg-gray-800 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-3">Aucun joueur trouvé</h2>
            <p className="text-gray-400">
              Essayez de modifier vos filtres ou votre recherche
            </p>
          </div>
        )}

        {/* Player Detail Modal */}
        <AnimatePresence>
          {selectedPlayer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedPlayer(null);
                setIsEditMode(false);
              }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="bg-gray-900 p-6 sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-5xl">{selectedPlayer.avatar}</div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{selectedPlayer.username}</h2>
                        <p className="text-gray-400">{formatLastSeen(selectedPlayer.lastSeen)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPlayer(null);
                        setIsEditMode(false);
                      }}
                      className="text-gray-400 hover:text-white transition text-2xl"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Complete Stats */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Statistiques Complètes</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">VPIP</div>
                        <div className="text-2xl font-bold text-white">{selectedPlayer.vpip}%</div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">PFR</div>
                        <div className="text-2xl font-bold text-white">{selectedPlayer.pfr}%</div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Aggression</div>
                        <div className="text-2xl font-bold text-white">{selectedPlayer.aggression}</div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Win Rate</div>
                        <div
                          className={`text-2xl font-bold ${
                            selectedPlayer.winRate > 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {selectedPlayer.winRate > 0 ? '+' : ''}{selectedPlayer.winRate}%
                        </div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Profit</div>
                        <div
                          className={`text-2xl font-bold ${
                            selectedPlayer.profit > 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {selectedPlayer.profit > 0 ? '+' : ''}{selectedPlayer.profit}
                        </div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Mains Jouées</div>
                        <div className="text-2xl font-bold text-white">{selectedPlayer.handsPlayed}</div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Tables</div>
                        <div className="text-2xl font-bold text-white">{selectedPlayer.tablesPlayed}</div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Couleur</div>
                        <div
                          className="w-12 h-12 rounded-full mt-1"
                          style={{ backgroundColor: selectedPlayer.color }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlayer.tags.map((tag) => {
                        const tagInfo = availableTags.find((t) => t.value === tag);
                        return (
                          <span
                            key={tag}
                            className={`${tagInfo?.color} text-white px-4 py-2 rounded-full text-sm font-bold`}
                          >
                            {tagInfo?.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Notes</h3>
                    {isEditMode ? (
                      <textarea
                        defaultValue={selectedPlayer.notes}
                        className="w-full bg-gray-900 text-white p-4 rounded-xl min-h-32 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Ajoutez vos notes sur ce joueur..."
                      />
                    ) : (
                      <div className="bg-gray-900 rounded-xl p-4">
                        <p className="text-gray-300">{selectedPlayer.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    {!isEditMode ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsEditMode(true)}
                          className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 py-3 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition"
                        >
                          ✏️ Modifier
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteNote(selectedPlayer.id)}
                          className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition"
                        >
                          🗑️
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            handleSaveNote(
                              selectedPlayer.id,
                              selectedPlayer.notes,
                              selectedPlayer.tags,
                              selectedPlayer.color
                            );
                          }}
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition"
                        >
                          💾 Sauvegarder
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsEditMode(false)}
                          className="bg-gray-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-600 transition"
                        >
                          Annuler
                        </motion.button>
                      </>
                    )}
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
