'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Disable static generation
export const dynamic = 'force-dynamic';

interface Freeroll {
  id: string;
  name: string;
  description: string;
  icon: string;
  prizePool: number;
  prizeCurrency: 'chips' | 'cash' | 'tickets' | 'mixed';
  registered: number;
  maxPlayers: number;
  startTime: Date;
  duration: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'special';
  eligibility: 'all' | 'newbie' | 'vip' | 'pro';
  status: 'upcoming' | 'registering' | 'running' | 'completed';
  prizes: FreerollPrize[];
  sponsored?: string;
  requirements?: string[];
}

interface FreerollPrize {
  position: string;
  amount: number;
  type: 'chips' | 'cash' | 'ticket' | 'trophy';
  description: string;
}

export default function FreerollsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [filterFrequency, setFilterFrequency] = useState<string>('all');
  const [selectedFreeroll, setSelectedFreeroll] = useState<Freeroll | null>(null);

  // Freeroll Tournaments
  const FREEROLLS: Freeroll[] = [
    {
      id: 'daily-mega',
      name: '💰 Mega Freeroll Quotidien',
      description: 'Le plus gros freeroll quotidien avec 50 000$ de prize pool !',
      icon: '💎',
      prizePool: 50000,
      prizeCurrency: 'mixed',
      registered: 2847,
      maxPlayers: 5000,
      startTime: new Date('2025-11-09T20:00:00'),
      duration: '3-4 heures',
      frequency: 'daily',
      eligibility: 'all',
      status: 'registering',
      sponsored: 'PokerStars',
      prizes: [
        { position: '1st', amount: 10000, type: 'cash', description: '10 000$ Cash Prize' },
        { position: '2nd', amount: 5000, type: 'cash', description: '5 000$ Cash Prize' },
        { position: '3rd', amount: 2500, type: 'cash', description: '2 500$ Cash Prize' },
        { position: '4-10', amount: 1000, type: 'cash', description: '1 000$ chacun' },
        { position: '11-50', amount: 500000, type: 'chips', description: '500K jetons chacun' },
        { position: '51-100', amount: 250000, type: 'chips', description: '250K jetons chacun' },
      ],
    },
    {
      id: 'newbie-welcome',
      name: '🆕 Freeroll des Débutants',
      description: 'Exclusivement pour les nouveaux joueurs ! Apprenez et gagnez.',
      icon: '🌟',
      prizePool: 10000,
      prizeCurrency: 'chips',
      registered: 456,
      maxPlayers: 1000,
      startTime: new Date('2025-11-09T18:00:00'),
      duration: '2 heures',
      frequency: 'daily',
      eligibility: 'newbie',
      status: 'registering',
      requirements: ['Moins de 30 jours d\'inscription', 'Moins de 100 mains jouées'],
      prizes: [
        { position: '1st', amount: 2000000, type: 'chips', description: '2M de jetons + Trophée' },
        { position: '2nd', amount: 1000000, type: 'chips', description: '1M de jetons' },
        { position: '3rd', amount: 500000, type: 'chips', description: '500K jetons' },
        { position: '4-20', amount: 200000, type: 'chips', description: '200K jetons chacun' },
        { position: '21-50', amount: 50000, type: 'chips', description: '50K jetons chacun' },
      ],
    },
    {
      id: 'sunday-million',
      name: '🏆 Sunday Million Freeroll',
      description: 'Le freeroll le plus prestigieux de la semaine. 1M$ en jeu !',
      icon: '👑',
      prizePool: 1000000,
      prizeCurrency: 'cash',
      registered: 8234,
      maxPlayers: 10000,
      startTime: new Date('2025-11-10T16:00:00'),
      duration: '6-8 heures',
      frequency: 'weekly',
      eligibility: 'all',
      status: 'upcoming',
      sponsored: 'PokerMind Pro',
      prizes: [
        { position: '1st', amount: 200000, type: 'cash', description: '200 000$ + Trophée Or' },
        { position: '2nd', amount: 100000, type: 'cash', description: '100 000$ + Trophée Argent' },
        { position: '3rd', amount: 50000, type: 'cash', description: '50 000$ + Trophée Bronze' },
        { position: '4-10', amount: 20000, type: 'cash', description: '20 000$ chacun' },
        { position: '11-50', amount: 5000, type: 'cash', description: '5 000$ chacun' },
        { position: '51-100', amount: 2000, type: 'cash', description: '2 000$ chacun' },
        { position: '101-500', amount: 500, type: 'cash', description: '500$ chacun' },
      ],
    },
    {
      id: 'vip-exclusive',
      name: '💎 VIP Exclusive Freeroll',
      description: 'Réservé aux membres VIP. Prizes exceptionnels !',
      icon: '🌟',
      prizePool: 100000,
      prizeCurrency: 'mixed',
      registered: 234,
      maxPlayers: 500,
      startTime: new Date('2025-11-09T21:00:00'),
      duration: '3 heures',
      frequency: 'weekly',
      eligibility: 'vip',
      status: 'registering',
      requirements: ['Statut VIP Gold ou supérieur'],
      prizes: [
        { position: '1st', amount: 25000, type: 'cash', description: '25 000$ Cash' },
        { position: '2nd', amount: 15000, type: 'cash', description: '15 000$ Cash' },
        { position: '3rd', amount: 10000, type: 'cash', description: '10 000$ Cash' },
        { position: '4-10', amount: 3000, type: 'cash', description: '3 000$ chacun' },
        { position: '11-30', amount: 1000, type: 'ticket', description: 'Ticket tournoi 1000$' },
      ],
    },
    {
      id: 'pro-championship',
      name: '🎯 Championship Freeroll Pro',
      description: 'Pour les joueurs pros enregistrés. Qualification pour les Worlds !',
      icon: '🏅',
      prizePool: 500000,
      prizeCurrency: 'mixed',
      registered: 567,
      maxPlayers: 1000,
      startTime: new Date('2025-11-15T14:00:00'),
      duration: '5-7 heures',
      frequency: 'monthly',
      eligibility: 'pro',
      status: 'upcoming',
      sponsored: 'WSOP',
      requirements: ['Statut Pro vérifié', 'Minimum 1000 mains jouées', 'Win rate positif'],
      prizes: [
        { position: '1st', amount: 100000, type: 'cash', description: '100 000$ + Siège WSOP Main Event (10 000$)' },
        { position: '2nd', amount: 50000, type: 'cash', description: '50 000$ + Siège WPT (5 000$)' },
        { position: '3rd', amount: 30000, type: 'cash', description: '30 000$ + Siège EPT (3 000$)' },
        { position: '4-10', amount: 10000, type: 'cash', description: '10 000$ chacun' },
        { position: '11-50', amount: 3000, type: 'cash', description: '3 000$ + Ticket 1K' },
      ],
    },
    {
      id: 'bounty-hunter',
      name: '🎯 Bounty Hunter Freeroll',
      description: 'Éliminez des joueurs pour gagner des bounties instantanés !',
      icon: '🎪',
      prizePool: 75000,
      prizeCurrency: 'mixed',
      registered: 1523,
      maxPlayers: 3000,
      startTime: new Date('2025-11-11T19:00:00'),
      duration: '4 heures',
      frequency: 'weekly',
      eligibility: 'all',
      status: 'upcoming',
      prizes: [
        { position: '1st', amount: 15000, type: 'cash', description: '15 000$ + Bounties collectées' },
        { position: '2nd', amount: 10000, type: 'cash', description: '10 000$ + Bounties' },
        { position: '3rd', amount: 5000, type: 'cash', description: '5 000$ + Bounties' },
        { position: 'Chaque KO', amount: 50, type: 'cash', description: '50$ par élimination' },
      ],
    },
    {
      id: 'satellite-wsop',
      name: '🚀 Satellite WSOP Main Event',
      description: 'Gagnez votre siège pour le WSOP Main Event (valeur 10 000$) !',
      icon: '🎰',
      prizePool: 50000,
      prizeCurrency: 'tickets',
      registered: 892,
      maxPlayers: 2000,
      startTime: new Date('2025-11-12T17:00:00'),
      duration: '4-5 heures',
      frequency: 'monthly',
      eligibility: 'all',
      status: 'upcoming',
      sponsored: 'WSOP Official',
      prizes: [
        { position: '1st', amount: 10000, type: 'ticket', description: 'Siège WSOP Main Event + 5 000$ Travel Package' },
        { position: '2nd', amount: 5000, type: 'ticket', description: 'Siège tournoi 5 000$' },
        { position: '3rd', amount: 3000, type: 'ticket', description: 'Siège tournoi 3 000$' },
        { position: '4-10', amount: 1000, type: 'ticket', description: 'Ticket tournoi 1 000$' },
      ],
    },
    {
      id: 'friday-fever',
      name: '🔥 Friday Fever Freeroll',
      description: 'Commencez le week-end avec style ! Prizes garantis.',
      icon: '🎉',
      prizePool: 30000,
      prizeCurrency: 'mixed',
      registered: 1876,
      maxPlayers: 4000,
      startTime: new Date('2025-11-08T20:00:00'),
      duration: '3 heures',
      frequency: 'weekly',
      eligibility: 'all',
      status: 'completed',
      prizes: [
        { position: '1st', amount: 5000, type: 'cash', description: '5 000$ Cash' },
        { position: '2nd', amount: 3000, type: 'cash', description: '3 000$ Cash' },
        { position: '3rd', amount: 2000, type: 'cash', description: '2 000$ Cash' },
        { position: '4-20', amount: 500, type: 'cash', description: '500$ chacun' },
        { position: '21-100', amount: 100000, type: 'chips', description: '100K jetons chacun' },
      ],
    },
  ];

  const filteredFreerolls = FREEROLLS.filter((freeroll) => {
    if (filterFrequency === 'all') return true;
    return freeroll.frequency === filterFrequency;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'registering':
        return { label: 'INSCRIPTION OUVERTE', color: 'bg-green-600 text-white', pulse: true };
      case 'upcoming':
        return { label: 'À VENIR', color: 'bg-blue-600 text-white', pulse: false };
      case 'running':
        return { label: 'EN COURS', color: 'bg-yellow-600 text-white', pulse: true };
      case 'completed':
        return { label: 'TERMINÉ', color: 'bg-gray-600 text-white', pulse: false };
      default:
        return { label: 'INCONNU', color: 'bg-gray-600 text-white', pulse: false };
    }
  };

  const getEligibilityBadge = (eligibility: string) => {
    switch (eligibility) {
      case 'all':
        return { label: '👥 Tous', color: 'bg-blue-600' };
      case 'newbie':
        return { label: '🆕 Débutants', color: 'bg-green-600' };
      case 'vip':
        return { label: '💎 VIP', color: 'bg-purple-600' };
      case 'pro':
        return { label: '🏅 Pro', color: 'bg-yellow-600' };
      default:
        return { label: '?', color: 'bg-gray-600' };
    }
  };

  const formatPrizePool = (amount: number, currency: string) => {
    if (currency === 'cash' || currency === 'mixed') {
      return `${(amount / 1000).toFixed(0)}K $`;
    }
    return `${(amount / 1000).toFixed(0)}K jetons`;
  };

  const getTimeUntilStart = (startTime: Date) => {
    const now = new Date();
    const diff = startTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (diff < 0) return 'Commencé';
    if (hours > 24) return `Dans ${Math.floor(hours / 24)}j`;
    if (hours > 0) return `Dans ${hours}h ${minutes}m`;
    return `Dans ${minutes}m`;
  };

  const handleRegister = (freeroll: Freeroll) => {
    alert(`✅ Inscription confirmée pour: ${freeroll.name}!\n\nRendez-vous le ${freeroll.startTime.toLocaleString('fr-FR')}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Retour
          </Link>
          <div className="text-center">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-400 to-yellow-400 mb-2">
              🎁 TOURNOIS GRATUITS
            </h1>
            <p className="text-gray-300 text-lg">Jouez Gratuitement, Gagnez Réellement</p>
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
          className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 mb-8 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-2">💎 Prize Pool Total Mensuel</h2>
          <div className="text-5xl font-bold text-yellow-300 mb-2">2.8M $</div>
          <p className="text-green-100">
            Plus de 50 tournois gratuits chaque mois avec des prizes garantis en argent réel !
          </p>
        </motion.div>

        {/* Frequency Filter */}
        <div className="flex justify-center space-x-4 mb-8 flex-wrap gap-y-2">
          {[
            { value: 'all', label: '🌍 Tous', count: FREEROLLS.length },
            { value: 'daily', label: '📅 Quotidiens', count: FREEROLLS.filter(f => f.frequency === 'daily').length },
            { value: 'weekly', label: '📆 Hebdomadaires', count: FREEROLLS.filter(f => f.frequency === 'weekly').length },
            { value: 'monthly', label: '🗓️ Mensuels', count: FREEROLLS.filter(f => f.frequency === 'monthly').length },
            { value: 'special', label: '⭐ Spéciaux', count: FREEROLLS.filter(f => f.frequency === 'special').length },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterFrequency(filter.value)}
              className={`px-6 py-3 rounded-xl font-bold transition ${
                filterFrequency === filter.value
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {/* Freeroll List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFreerolls.map((freeroll, index) => {
            const statusBadge = getStatusBadge(freeroll.status);
            const eligibilityBadge = getEligibilityBadge(freeroll.eligibility);

            return (
              <motion.div
                key={freeroll.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-700 hover:border-yellow-400 transition"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 relative">
                  {statusBadge.pulse && (
                    <div className="absolute top-4 right-4">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="text-6xl">{freeroll.icon}</div>
                    <div className="text-right">
                      <span className={`${statusBadge.color} px-3 py-1 rounded-full text-xs font-bold`}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{freeroll.name}</h3>
                  <p className="text-gray-400 mb-3">{freeroll.description}</p>

                  {freeroll.sponsored && (
                    <div className="bg-yellow-900 bg-opacity-30 border border-yellow-500 rounded-lg px-3 py-1 inline-block">
                      <span className="text-yellow-300 text-sm font-semibold">
                        🤝 Sponsorisé par {freeroll.sponsored}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  {/* Prize Pool */}
                  <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 text-center">
                    <div className="text-green-100 text-sm mb-1">Prize Pool</div>
                    <div className="text-3xl font-bold text-white">
                      {formatPrizePool(freeroll.prizePool, freeroll.prizeCurrency)}
                    </div>
                    <div className="text-green-100 text-xs mt-1">
                      {freeroll.prizeCurrency === 'cash' && '💵 Cash Réel'}
                      {freeroll.prizeCurrency === 'chips' && '🪙 Jetons'}
                      {freeroll.prizeCurrency === 'tickets' && '🎫 Tickets Tournois'}
                      {freeroll.prizeCurrency === 'mixed' && '💎 Cash + Jetons + Tickets'}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-900 rounded-xl p-3">
                      <div className="text-gray-400 text-xs mb-1">Inscrits</div>
                      <div className="text-white font-bold">
                        {freeroll.registered} / {freeroll.maxPlayers}
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(freeroll.registered / freeroll.maxPlayers) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-3">
                      <div className="text-gray-400 text-xs mb-1">Début</div>
                      <div className="text-yellow-400 font-bold">
                        {getTimeUntilStart(freeroll.startTime)}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">{freeroll.duration}</div>
                    </div>
                  </div>

                  {/* Eligibility & Frequency */}
                  <div className="flex justify-between items-center">
                    <span className={`${eligibilityBadge.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                      {eligibilityBadge.label}
                    </span>
                    <span className="text-gray-400 text-sm capitalize">
                      {freeroll.frequency === 'daily' && '📅 Quotidien'}
                      {freeroll.frequency === 'weekly' && '📆 Hebdomadaire'}
                      {freeroll.frequency === 'monthly' && '🗓️ Mensuel'}
                      {freeroll.frequency === 'special' && '⭐ Spécial'}
                    </span>
                  </div>

                  {/* Top Prizes Preview */}
                  <div className="bg-gray-900 rounded-xl p-3">
                    <div className="text-gray-400 text-xs mb-2">Top Prizes</div>
                    <div className="space-y-1">
                      {freeroll.prizes.slice(0, 3).map((prize, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-300">{prize.position}</span>
                          <span className="text-yellow-400 font-bold">{prize.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedFreeroll(freeroll)}
                      className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-bold hover:bg-gray-600 transition"
                    >
                      📋 Détails
                    </motion.button>
                    {freeroll.status === 'registering' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRegister(freeroll)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition"
                      >
                        ✅ S'inscrire
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Freeroll Detail Modal */}
        <AnimatePresence>
          {selectedFreeroll && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFreeroll(null)}
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
                <div className="bg-gradient-to-r from-blue-900 to-gray-900 p-8 relative">
                  <button
                    onClick={() => setSelectedFreeroll(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl"
                  >
                    ✕
                  </button>
                  <div className="flex items-center space-x-6">
                    <div className="text-8xl">{selectedFreeroll.icon}</div>
                    <div>
                      <h2 className="text-4xl font-bold text-white mb-2">{selectedFreeroll.name}</h2>
                      <p className="text-gray-300 text-lg mb-3">{selectedFreeroll.description}</p>
                      {selectedFreeroll.sponsored && (
                        <div className="bg-yellow-900 bg-opacity-50 border border-yellow-500 rounded-lg px-4 py-2 inline-block">
                          <span className="text-yellow-300 font-semibold">
                            🤝 Sponsorisé par {selectedFreeroll.sponsored}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-8 space-y-6">
                  {/* Tournament Info */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">ℹ️ Informations</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Début</div>
                        <div className="text-white font-bold">
                          {selectedFreeroll.startTime.toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-yellow-400 text-sm">
                          {selectedFreeroll.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Durée</div>
                        <div className="text-white font-bold">{selectedFreeroll.duration}</div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Inscrits</div>
                        <div className="text-white font-bold">
                          {selectedFreeroll.registered} / {selectedFreeroll.maxPlayers}
                        </div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Fréquence</div>
                        <div className="text-white font-bold capitalize">{selectedFreeroll.frequency}</div>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  {selectedFreeroll.requirements && (
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4">✅ Conditions d'Éligibilité</h3>
                      <div className="bg-blue-900 bg-opacity-30 border border-blue-500 rounded-xl p-4">
                        <ul className="space-y-2">
                          {selectedFreeroll.requirements.map((req, idx) => (
                            <li key={idx} className="text-blue-200 flex items-start">
                              <span className="text-blue-400 mr-2">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Prize Structure */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">🏆 Structure des Prix</h3>
                    <div className="bg-gradient-to-r from-green-900 to-green-800 rounded-xl p-6 mb-4 text-center">
                      <div className="text-green-200 mb-2">Prize Pool Total</div>
                      <div className="text-5xl font-bold text-white">
                        {formatPrizePool(selectedFreeroll.prizePool, selectedFreeroll.prizeCurrency)}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedFreeroll.prizes.map((prize, idx) => (
                        <div
                          key={idx}
                          className={`rounded-xl p-4 flex justify-between items-center ${
                            idx < 3
                              ? 'bg-gradient-to-r from-yellow-900 to-yellow-800 border-2 border-yellow-400'
                              : 'bg-gray-900'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            {idx === 0 && <span className="text-4xl">🥇</span>}
                            {idx === 1 && <span className="text-4xl">🥈</span>}
                            {idx === 2 && <span className="text-4xl">🥉</span>}
                            <div>
                              <div className={`font-bold ${idx < 3 ? 'text-yellow-100' : 'text-white'}`}>
                                {prize.position}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold text-lg ${idx < 3 ? 'text-yellow-300' : 'text-green-400'}`}>
                              {prize.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Register Button */}
                  {selectedFreeroll.status === 'registering' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRegister(selectedFreeroll)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-xl hover:from-green-700 hover:to-green-800 transition"
                    >
                      ✅ S'inscrire Maintenant - C'est GRATUIT !
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
