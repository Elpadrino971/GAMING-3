'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Disable static generation
export const dynamic = 'force-dynamic';

interface Tournament {
  id: string;
  name: string;
  type: 'SNG' | 'MTT' | 'Satellite';
  speed: 'Turbo' | 'Normal' | 'Deep';
  buyIn: number;
  prizePool: number;
  registered: number;
  maxPlayers: number;
  status: 'registering' | 'running' | 'late-reg' | 'completed';
  startTime: Date;
  blindLevel?: string;
  avgStack?: number;
  guarantee?: number;
}

const TOURNAMENTS: Tournament[] = [
  {
    id: 'mtt-1',
    name: '🏆 Sunday Million',
    type: 'MTT',
    speed: 'Normal',
    buyIn: 1000,
    prizePool: 50000,
    registered: 156,
    maxPlayers: 500,
    status: 'registering',
    startTime: new Date(Date.now() + 3600000),
    guarantee: 50000,
  },
  {
    id: 'turbo-1',
    name: '⚡ Turbo Knockout',
    type: 'MTT',
    speed: 'Turbo',
    buyIn: 500,
    prizePool: 15000,
    registered: 42,
    maxPlayers: 180,
    status: 'running',
    startTime: new Date(Date.now() - 1800000),
    blindLevel: '50/100',
    avgStack: 8500,
  },
  {
    id: 'sng-1',
    name: '🎯 Sit & Go Turbo',
    type: 'SNG',
    speed: 'Turbo',
    buyIn: 100,
    prizePool: 900,
    registered: 8,
    maxPlayers: 9,
    status: 'registering',
    startTime: new Date(Date.now() + 600000),
  },
  {
    id: 'deep-1',
    name: '📚 Deep Stack',
    type: 'MTT',
    speed: 'Deep',
    buyIn: 2000,
    prizePool: 80000,
    registered: 78,
    maxPlayers: 200,
    status: 'late-reg',
    startTime: new Date(Date.now() - 900000),
    blindLevel: '25/50',
    avgStack: 15000,
    guarantee: 100000,
  },
  {
    id: 'sat-1',
    name: '🎟️ Satellite to Main Event',
    type: 'Satellite',
    speed: 'Turbo',
    buyIn: 50,
    prizePool: 5000,
    registered: 89,
    maxPlayers: 100,
    status: 'registering',
    startTime: new Date(Date.now() + 1200000),
  },
  {
    id: 'freeroll-1',
    name: '🎁 Freeroll Débutant',
    type: 'MTT',
    speed: 'Turbo',
    buyIn: 0,
    prizePool: 1000,
    registered: 234,
    maxPlayers: 500,
    status: 'registering',
    startTime: new Date(Date.now() + 2400000),
  },
];

export default function TournamentsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [filter, setFilter] = useState<'all' | 'SNG' | 'MTT' | 'Satellite'>('all');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const filteredTournaments = TOURNAMENTS.filter(
    (tournament) => filter === 'all' || tournament.type === filter
  );

  const handleRegister = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setShowRegisterModal(true);
  };

  const confirmRegister = () => {
    if (!selectedTournament || !user) return;

    if (user.totalChips < selectedTournament.buyIn) {
      alert('❌ Jetons insuffisants. Visitez la boutique pour en acheter!');
      router.push('/store');
      return;
    }

    alert(`✅ Inscrit au tournoi: ${selectedTournament.name}`);
    setShowRegisterModal(false);
    setSelectedTournament(null);
  };

  const getStatusBadge = (status: Tournament['status']) => {
    switch (status) {
      case 'registering':
        return <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">📝 Inscription</span>;
      case 'running':
        return <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">▶️ En Cours</span>;
      case 'late-reg':
        return <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold">⏰ Late Reg</span>;
      case 'completed':
        return <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-bold">✅ Terminé</span>;
    }
  };

  const getSpeedIcon = (speed: Tournament['speed']) => {
    switch (speed) {
      case 'Turbo':
        return '⚡';
      case 'Deep':
        return '📚';
      default:
        return '🎲';
    }
  };

  const formatTimeUntilStart = (startTime: Date) => {
    const diff = startTime.getTime() - Date.now();
    if (diff < 0) return 'Commencé';

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/multiplayer-lobby" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Retour
          </Link>
          <h1 className="text-4xl font-bold text-white">🏆 Tournois</h1>
          <div className="bg-gray-800 rounded-full px-6 py-2">
            <span className="text-yellow-400 font-bold">💰 {user?.totalChips?.toLocaleString() || 0}</span>
          </div>
        </div>

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl p-6 mb-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🎰 Prize Pool Total: 152,900 jetons
          </h2>
          <p className="text-gray-800">
            {TOURNAMENTS.filter(t => t.status === 'registering').length} tournois en inscription
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex space-x-3 mb-6 overflow-x-auto pb-2">
          {['all', 'MTT', 'SNG', 'Satellite'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType as any)}
              className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition ${
                filter === filterType
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {filterType === 'all' ? '🎯 Tous' : filterType === 'MTT' ? '🏆 MTT' : filterType === 'SNG' ? '🎯 SNG' : '🎟️ Satellite'}
            </button>
          ))}
        </div>

        {/* Tournaments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTournaments.map((tournament, index) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-700 hover:border-yellow-400 transition"
            >
              {/* Tournament Header */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-bold text-white">{tournament.name}</h3>
                    <span className="text-2xl">{getSpeedIcon(tournament.speed)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(tournament.status)}
                    <span className="text-gray-400 text-sm">{tournament.type}</span>
                  </div>
                </div>
              </div>

              {/* Tournament Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Buy-in */}
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Buy-in</div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {tournament.buyIn === 0 ? 'GRATUIT' : `${tournament.buyIn.toLocaleString()} 🪙`}
                    </div>
                  </div>

                  {/* Prize Pool */}
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Prize Pool</div>
                    <div className="text-2xl font-bold text-green-400">
                      {tournament.prizePool.toLocaleString()} 🪙
                    </div>
                    {tournament.guarantee && (
                      <div className="text-xs text-purple-400 mt-1">
                        GTD: {tournament.guarantee.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Players */}
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Joueurs</div>
                    <div className="text-lg font-bold text-white">
                      {tournament.registered}/{tournament.maxPlayers}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${(tournament.registered / tournament.maxPlayers) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Start Time / Blind Level */}
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">
                      {tournament.status === 'registering' ? 'Début' : 'Blindes'}
                    </div>
                    <div className="text-lg font-bold text-white">
                      {tournament.status === 'registering'
                        ? formatTimeUntilStart(tournament.startTime)
                        : tournament.blindLevel || 'N/A'}
                    </div>
                    {tournament.avgStack && (
                      <div className="text-xs text-blue-400 mt-1">
                        Stack moy: {tournament.avgStack.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Structure Info */}
                <div className="bg-gray-900 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Structure:</span>
                    <span className="text-white font-semibold">{tournament.speed}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-400">Format:</span>
                    <span className="text-white font-semibold">{tournament.type}</span>
                  </div>
                </div>

                {/* Register Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRegister(tournament)}
                  disabled={
                    tournament.status === 'completed' ||
                    tournament.registered >= tournament.maxPlayers
                  }
                  className={`w-full py-3 rounded-xl font-bold text-lg transition shadow-lg ${
                    tournament.status === 'completed' || tournament.registered >= tournament.maxPlayers
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : tournament.buyIn === 0
                      ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                      : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900'
                  }`}
                >
                  {tournament.status === 'completed'
                    ? '✅ Terminé'
                    : tournament.registered >= tournament.maxPlayers
                    ? '🔒 Complet'
                    : tournament.status === 'running'
                    ? '⚡ Rejoindre (Late Reg)'
                    : tournament.buyIn === 0
                    ? '🎁 S\'inscrire Gratuitement'
                    : `💳 S'inscrire (${tournament.buyIn.toLocaleString()} 🪙)`}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-white font-bold mb-2">Multi-Table Tournaments</h3>
            <p className="text-gray-400 text-sm">
              Affrontez des centaines de joueurs pour des prize pools massifs
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-white font-bold mb-2">Formats Variés</h3>
            <p className="text-gray-400 text-sm">
              Turbo, Deep Stack, Satellite - Trouvez votre style
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-white font-bold mb-2">Prize Pools Garantis</h3>
            <p className="text-gray-400 text-sm">
              Des gains garantis même avec peu de joueurs
            </p>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegisterModal && selectedTournament && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border-4 border-yellow-400"
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                🏆 Inscription au Tournoi
              </h2>

              <div className="bg-gray-900 rounded-xl p-6 mb-6">
                <div className="text-center mb-4">
                  <div className="text-yellow-400 font-bold text-lg">
                    {selectedTournament.name}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    {selectedTournament.type} • {selectedTournament.speed}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Buy-in:</span>
                    <span className="text-white font-bold">
                      {selectedTournament.buyIn === 0
                        ? 'GRATUIT'
                        : `${selectedTournament.buyIn.toLocaleString()} 🪙`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Prize Pool:</span>
                    <span className="text-green-400 font-bold">
                      {selectedTournament.prizePool.toLocaleString()} 🪙
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Joueurs:</span>
                    <span className="text-white font-bold">
                      {selectedTournament.registered}/{selectedTournament.maxPlayers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Début:</span>
                    <span className="text-blue-400 font-bold">
                      {formatTimeUntilStart(selectedTournament.startTime)}
                    </span>
                  </div>
                </div>

                {selectedTournament.buyIn > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Votre solde:</span>
                      <span className={`font-bold ${
                        (user?.totalChips || 0) >= selectedTournament.buyIn
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}>
                        {user?.totalChips?.toLocaleString() || 0} 🪙
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmRegister}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition"
                >
                  ✅ Confirmer l'Inscription
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowRegisterModal(false);
                    setSelectedTournament(null);
                  }}
                  className="w-full bg-gray-700 text-white py-4 rounded-xl font-bold hover:bg-gray-600 transition"
                >
                  Annuler
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
