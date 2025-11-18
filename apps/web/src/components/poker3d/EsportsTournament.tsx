'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface EsportsPlayer {
  id: string;
  name: string;
  avatar: string;
  team?: string;
  country: string;
  ranking: number;
  earnings: number;
  winRate: number;
  isLive: boolean;
}

export interface EsportsTournament {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  prizePool: number;
  buyIn: number;
  players: EsportsPlayer[];
  maxPlayers: number;
  format: 'single-elimination' | 'double-elimination' | 'round-robin' | 'swiss';
  status: 'upcoming' | 'registration' | 'live' | 'completed';
  featured: boolean;
  sponsor?: string;
  stream?: string;
}

export interface EsportsMatch {
  id: string;
  tournamentId: string;
  round: number;
  table: number;
  player1: EsportsPlayer;
  player2: EsportsPlayer;
  winner?: EsportsPlayer;
  status: 'upcoming' | 'live' | 'completed';
  viewers: number;
  streamUrl?: string;
}

// Esports Tournament Hub
export function EsportsTournamentHub() {
  const [selectedTab, setSelectedTab] = useState<'featured' | 'upcoming' | 'live' | 'results'>('featured');

  const featuredTournaments: EsportsTournament[] = [
    {
      id: 'pokermind-championship-2025',
      name: 'PokerMind World Championship 2025',
      startDate: new Date('2025-12-15'),
      endDate: new Date('2025-12-20'),
      prizePool: 10000000,
      buyIn: 25000,
      players: [],
      maxPlayers: 1000,
      format: 'single-elimination',
      status: 'registration',
      featured: true,
      sponsor: 'PokerStars',
      stream: 'twitch.tv/pokermind',
    },
    {
      id: 'cyber-series-spring',
      name: 'Cyber Poker Series - Spring Edition',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-04-07'),
      prizePool: 5000000,
      buyIn: 10000,
      players: [],
      maxPlayers: 500,
      format: 'double-elimination',
      status: 'upcoming',
      featured: true,
      sponsor: 'Red Bull',
      stream: 'youtube.com/pokermind',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-white font-bold text-5xl mb-2">🏆 PokerMind Esports</h1>
        <div className="text-purple-300 text-xl">Compétitions Professionnelles de Poker</div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-3 mb-8">
        {(['featured', 'upcoming', 'live', 'results'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition ${
              selectedTab === tab
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tab === 'featured' && '⭐ Featured'}
            {tab === 'upcoming' && '📅 À venir'}
            {tab === 'live' && '🔴 LIVE'}
            {tab === 'results' && '🏅 Résultats'}
          </button>
        ))}
      </div>

      {/* Tournament Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {featuredTournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>
    </div>
  );
}

// Tournament Card
function TournamentCard({ tournament }: { tournament: EsportsTournament }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border-4 border-purple-500 shadow-2xl"
    >
      {/* Banner */}
      <div className="relative h-48 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-white text-3xl font-bold text-center px-6">{tournament.name}</div>
        {tournament.status === 'live' && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2 animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full" />
            <span className="font-bold">LIVE</span>
          </div>
        )}
        {tournament.featured && (
          <div className="absolute top-4 left-4 bg-yellow-500 text-gray-900 px-4 py-2 rounded-full font-bold">
            ⭐ FEATURED
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Prize Pool */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 mb-4">
          <div className="text-yellow-900 text-sm font-semibold">Prize Pool</div>
          <div className="text-white text-4xl font-bold">${(tournament.prizePool / 1000000).toFixed(1)}M</div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs">Buy-in</div>
            <div className="text-white font-bold">${tournament.buyIn.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs">Joueurs</div>
            <div className="text-white font-bold">{tournament.players.length}/{tournament.maxPlayers}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs">Format</div>
            <div className="text-white font-bold text-sm">{tournament.format}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs">Dates</div>
            <div className="text-white font-bold text-sm">
              {tournament.startDate.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Sponsor */}
        {tournament.sponsor && (
          <div className="bg-purple-900/50 rounded-lg p-3 mb-4 text-center">
            <div className="text-purple-300 text-xs mb-1">Présenté par</div>
            <div className="text-white font-bold text-lg">{tournament.sponsor}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {tournament.status === 'registration' && (
            <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-bold transition">
              📝 S'inscrire
            </button>
          )}
          {tournament.status === 'live' && tournament.stream && (
            <button className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold transition">
              📺 Regarder LIVE
            </button>
          )}
          <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-bold transition">
            📊 Détails
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Live Match Display
export function LiveMatchDisplay({ match }: { match: EsportsMatch }) {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl p-8 border-4 border-red-500">
      {/* Live Indicator */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        <div className="text-red-500 font-bold text-2xl">🔴 MATCH EN DIRECT</div>
        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
      </div>

      {/* Match Info */}
      <div className="bg-black/50 rounded-xl p-4 mb-6">
        <div className="text-center text-gray-400 mb-2">Table {match.table} - Round {match.round}</div>
        <div className="text-center text-white text-xl">
          ⏱️ {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Players */}
      <div className="grid grid-cols-3 gap-4 items-center mb-6">
        {/* Player 1 */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6">
          <div className="text-6xl text-center mb-3">{match.player1.avatar}</div>
          <div className="text-white font-bold text-xl text-center mb-1">{match.player1.name}</div>
          <div className="text-blue-300 text-sm text-center">#{match.player1.ranking}</div>
          <div className="text-blue-200 text-xs text-center mt-2">{match.player1.country}</div>
        </div>

        {/* VS */}
        <div className="text-center">
          <div className="text-white font-bold text-5xl mb-2">VS</div>
          <div className="text-gray-400 text-sm">{match.viewers.toLocaleString()} spectateurs</div>
        </div>

        {/* Player 2 */}
        <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-xl p-6">
          <div className="text-6xl text-center mb-3">{match.player2.avatar}</div>
          <div className="text-white font-bold text-xl text-center mb-1">{match.player2.name}</div>
          <div className="text-red-300 text-sm text-center">#{match.player2.ranking}</div>
          <div className="text-red-200 text-xs text-center mt-2">{match.player2.country}</div>
        </div>
      </div>

      {/* Stream Button */}
      {match.streamUrl && (
        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-xl transition">
          📺 Regarder le Stream
        </button>
      )}
    </div>
  );
}

// Tournament Leaderboard
export function TournamentLeaderboard({ players }: { players: EsportsPlayer[] }) {
  const sortedPlayers = [...players].sort((a, b) => b.earnings - a.earnings);

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-yellow-400">
      <h3 className="text-yellow-400 font-bold text-2xl mb-6">🏅 Classement</h3>

      <div className="space-y-3">
        {sortedPlayers.slice(0, 10).map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-4 p-4 rounded-xl ${
              index === 0
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600'
                : index === 1
                ? 'bg-gradient-to-r from-gray-400 to-gray-500'
                : index === 2
                ? 'bg-gradient-to-r from-orange-700 to-orange-800'
                : 'bg-gray-800'
            }`}
          >
            {/* Rank */}
            <div className={`text-3xl font-bold ${index < 3 ? 'text-white' : 'text-gray-400'}`}>
              {index + 1}
              {index === 0 && '🥇'}
              {index === 1 && '🥈'}
              {index === 2 && '🥉'}
            </div>

            {/* Avatar */}
            <div className="text-4xl">{player.avatar}</div>

            {/* Info */}
            <div className="flex-1">
              <div className={`font-bold text-lg ${index < 3 ? 'text-white' : 'text-white'}`}>
                {player.name}
              </div>
              <div className={`text-sm ${index < 3 ? 'text-white/80' : 'text-gray-400'}`}>
                {player.country} • Win Rate: {player.winRate.toFixed(1)}%
              </div>
            </div>

            {/* Earnings */}
            <div className="text-right">
              <div className={`font-bold text-xl ${index < 3 ? 'text-white' : 'text-green-400'}`}>
                ${player.earnings.toLocaleString()}
              </div>
              <div className={`text-xs ${index < 3 ? 'text-white/70' : 'text-gray-500'}`}>
                Rank #{player.ranking}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Upcoming Matches Schedule
export function MatchSchedule({ matches }: { matches: EsportsMatch[] }) {
  return (
    <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 border-2 border-purple-400">
      <h3 className="text-purple-400 font-bold text-xl mb-4">📅 Prochains Matchs</h3>

      <div className="space-y-3">
        {matches.map((match) => (
          <div key={match.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-400 text-sm">Table {match.table} - Round {match.round}</div>
              {match.status === 'live' && (
                <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  LIVE
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="text-white font-semibold">{match.player1.name}</div>
                <div className="text-gray-400 text-xs">#{match.player1.ranking}</div>
              </div>

              <div className="text-gray-500 font-bold">VS</div>

              <div className="flex-1 text-right">
                <div className="text-white font-semibold">{match.player2.name}</div>
                <div className="text-gray-400 text-xs">#{match.player2.ranking}</div>
              </div>
            </div>

            {match.viewers > 0 && (
              <div className="text-purple-400 text-xs mt-2 text-center">
                👁️ {match.viewers.toLocaleString()} spectateurs
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Caster Commentary Overlay
export function CasterCommentary() {
  const [comments, setComments] = useState<string[]>([
    '🎙️ "Quelle tension dans ce match!"',
    '🎙️ "Il va all-in! C\'est risqué!"',
    '🎙️ "Royal Flush! INCROYABLE!"',
  ]);

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 max-w-2xl z-40">
      <AnimatePresence>
        {comments.slice(-1).map((comment, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-gradient-to-r from-purple-900 to-pink-900 border-4 border-white rounded-2xl p-6 shadow-2xl"
          >
            <div className="text-white text-2xl font-bold text-center">{comment}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Sample Data
export const SAMPLE_PLAYERS: EsportsPlayer[] = [
  { id: '1', name: 'Phil "The Pro" Ivey', avatar: '🎩', country: '🇺🇸', ranking: 1, earnings: 2500000, winRate: 68.5, isLive: true },
  { id: '2', name: 'Daniel "KidPoker" Negreanu', avatar: '😎', country: '🇨🇦', ranking: 2, earnings: 2200000, winRate: 65.2, isLive: false },
  { id: '3', name: 'Vanessa "Lady Maverick" Selbst', avatar: '👑', country: '🇺🇸', ranking: 3, earnings: 1800000, winRate: 63.8, isLive: true },
];

export const SAMPLE_MATCH: EsportsMatch = {
  id: 'm1',
  tournamentId: 't1',
  round: 4,
  table: 1,
  player1: SAMPLE_PLAYERS[0],
  player2: SAMPLE_PLAYERS[2],
  status: 'live',
  viewers: 15243,
  streamUrl: 'https://twitch.tv/pokermind',
};
