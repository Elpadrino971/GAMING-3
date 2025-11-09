'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Disable static generation
export const dynamic = 'force-dynamic';

interface PokerVariant {
  id: string;
  name: string;
  shortName: string;
  description: string;
  rules: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  icon: string;
  color: string;
  activeTables: number;
  activePlayers: number;
  popularStakes: string[];
}

export default function PokerVariantsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [selectedVariant, setSelectedVariant] = useState<PokerVariant | null>(null);

  // Poker Variants
  const VARIANTS: PokerVariant[] = [
    {
      id: 'stud',
      name: '7-Card Stud',
      shortName: 'Stud',
      description: 'Le poker classique d\'avant le Hold\'em. Pas de cartes communes, 7 cartes par joueur.',
      rules: [
        'Chaque joueur reçoit 7 cartes au total (3 fermées, 4 ouvertes)',
        'Pas de cartes communes au board',
        '5 tours de mises: 3rd street, 4th, 5th, 6th, 7th (river)',
        'Meilleure main de 5 cartes gagne',
        'Limite fixe (Fixed Limit) généralement',
      ],
      difficulty: 'intermediate',
      icon: '🎩',
      color: 'from-indigo-600 to-purple-600',
      activeTables: 12,
      activePlayers: 67,
      popularStakes: ['$0.50/$1', '$1/$2', '$5/$10'],
    },
    {
      id: 'horse',
      name: 'HORSE',
      shortName: 'HORSE',
      description: 'Rotation de 5 variantes : Hold\'em, Omaha Hi-Lo, Razz, Stud, Stud Eight-or-Better.',
      rules: [
        'H = Hold\'em (Limit)',
        'O = Omaha Hi-Lo (Limit)',
        'R = Razz (7-Card Stud Low)',
        'S = 7-Card Stud (High)',
        'E = 7-Card Stud Eight-or-Better (Hi-Lo)',
        'Change de variante toutes les X mains (orbit)',
        'Teste toutes vos compétences poker !',
      ],
      difficulty: 'expert',
      icon: '🐴',
      color: 'from-yellow-600 to-orange-600',
      activeTables: 8,
      activePlayers: 43,
      popularStakes: ['$1/$2', '$2/$4', '$10/$20'],
    },
    {
      id: 'razz',
      name: 'Razz',
      shortName: 'Razz',
      description: '7-Card Stud, mais la PIRE main gagne (Lowball). A-2-3-4-5 est la nuts.',
      rules: [
        'Format 7-Card Stud mais inversé',
        'La plus MAUVAISE main gagne',
        'A est toujours low (A-2-3-4-5 = roue/wheel = nuts)',
        'Pas de straights/flushs (A-2-3-4-5 n\'est PAS une quinte)',
        'Idéal: toutes cartes différentes sous le 8',
      ],
      difficulty: 'advanced',
      icon: '⬇️',
      color: 'from-red-600 to-pink-600',
      activeTables: 5,
      activePlayers: 28,
      popularStakes: ['$0.25/$0.50', '$1/$2', '$5/$10'],
    },
    {
      id: '8game',
      name: '8-Game Mix',
      shortName: '8-Game',
      description: 'HORSE + 3 variantes : No-Limit Hold\'em, Pot-Limit Omaha, 2-7 Triple Draw.',
      rules: [
        'Toutes les variantes de HORSE',
        'Plus: No-Limit Hold\'em',
        'Plus: Pot-Limit Omaha',
        'Plus: 2-7 Triple Draw Lowball',
        'Le test ultime de compétences mixtes',
        'Rotation toutes les 6-8 mains',
      ],
      difficulty: 'expert',
      icon: '🎲',
      color: 'from-purple-600 to-pink-600',
      activeTables: 3,
      activePlayers: 18,
      popularStakes: ['$2/$4', '$5/$10', '$20/$40'],
    },
    {
      id: '27tripledraw',
      name: '2-7 Triple Draw',
      shortName: '2-7 TD',
      description: 'Lowball avec 3 tours de tirage. La pire main (2-3-4-5-7) gagne.',
      rules: [
        '5 cartes fermées distribuées',
        '3 tours de tirage (échange de cartes)',
        'La plus MAUVAISE main gagne',
        'A est HIGH (mauvais en lowball)',
        'Straights et flushs COMPTENT (mauvais)',
        'Nuts = 7-5-4-3-2 (pas de couleur, pas de suite)',
      ],
      difficulty: 'expert',
      icon: '🔄',
      color: 'from-teal-600 to-cyan-600',
      activeTables: 4,
      activePlayers: 21,
      popularStakes: ['$0.50/$1', '$1/$2', '$5/$10'],
    },
    {
      id: 'badugi',
      name: 'Badugi',
      shortName: 'Badugi',
      description: 'Poker asiatique. 4 cartes, 4 couleurs différentes, toutes différentes. A-2-3-4 rainbow = nuts.',
      rules: [
        '4 cartes fermées',
        '3 tours de tirage',
        'Objectif: 4 cartes de COULEURS différentes',
        'Objectif: 4 cartes de RANGS différents',
        'Plus basses cartes = mieux',
        'Nuts = A♠ 2♥ 3♦ 4♣ (rainbow badugi)',
      ],
      difficulty: 'advanced',
      icon: '🌈',
      color: 'from-pink-600 to-rose-600',
      activeTables: 6,
      activePlayers: 32,
      popularStakes: ['$0.10/$0.25', '$0.50/$1', '$2/$4'],
    },
    {
      id: '5carddraw',
      name: '5-Card Draw',
      shortName: '5-Draw',
      description: 'Le poker le plus simple et classique. 5 cartes, 1 tirage, meilleure main gagne.',
      rules: [
        '5 cartes fermées distribuées',
        '1 tour de mise',
        '1 tour de tirage (échange 0 à 5 cartes)',
        '1 dernier tour de mise',
        'Showdown',
        'Le poker que tout le monde connaît !',
      ],
      difficulty: 'beginner',
      icon: '🖐️',
      color: 'from-green-600 to-emerald-600',
      activeTables: 9,
      activePlayers: 48,
      popularStakes: ['$0.25/$0.50', '$1/$2', '$5/$10'],
    },
    {
      id: 'studhilo',
      name: '7-Stud Hi-Lo Eight-or-Better',
      shortName: 'Stud Hi-Lo',
      description: 'Stud avec pot partagé entre meilleure high et meilleure low (8-or-better).',
      rules: [
        'Même format que 7-Card Stud',
        'Pot divisé: High / Low',
        'Low qualifie avec 8-or-better (5 cartes sous le 8)',
        'Si pas de low qualifié, high prend tout',
        'Possibilité de "scoop" (gagner high ET low)',
        'A compte comme high ET low',
      ],
      difficulty: 'advanced',
      icon: '🔀',
      color: 'from-blue-600 to-indigo-600',
      activeTables: 7,
      activePlayers: 39,
      popularStakes: ['$0.50/$1', '$2/$4', '$10/$20'],
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-400 bg-green-900';
      case 'intermediate':
        return 'text-yellow-400 bg-yellow-900';
      case 'advanced':
        return 'text-orange-400 bg-orange-900';
      case 'expert':
        return 'text-red-400 bg-red-900';
      default:
        return 'text-gray-400 bg-gray-900';
    }
  };

  const handlePlayVariant = (variant: PokerVariant) => {
    alert(`🎮 Lancement de ${variant.name}!\n\nBonne chance à la table !`);
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
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-2">
              🎭 VARIANTES POKER
            </h1>
            <p className="text-gray-300 text-lg">Explorez les variantes classiques du poker</p>
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
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-8 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-3">🌟 Maîtrisez Toutes les Variantes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <div className="text-3xl mb-2">🎲</div>
              <div className="text-white font-bold">{VARIANTS.length} Variantes</div>
              <div className="text-purple-200 text-sm">Disponibles</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <div className="text-3xl mb-2">🎰</div>
              <div className="text-white font-bold">
                {VARIANTS.reduce((sum, v) => sum + v.activeTables, 0)} Tables
              </div>
              <div className="text-purple-200 text-sm">Actives</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-white font-bold">
                {VARIANTS.reduce((sum, v) => sum + v.activePlayers, 0)} Joueurs
              </div>
              <div className="text-purple-200 text-sm">En ligne</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-white font-bold">Mixed Games</div>
              <div className="text-purple-200 text-sm">HORSE, 8-Game</div>
            </div>
          </div>
        </motion.div>

        {/* Variants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VARIANTS.map((variant, index) => (
            <motion.div
              key={variant.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedVariant(variant)}
              className={`bg-gradient-to-br ${variant.color} rounded-2xl p-6 cursor-pointer border-2 border-transparent hover:border-white transition`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-6xl">{variant.icon}</div>
                <span className={`${getDifficultyColor(variant.difficulty)} px-3 py-1 rounded-full text-xs font-bold`}>
                  {variant.difficulty.toUpperCase()}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{variant.name}</h3>
              <p className="text-white text-opacity-90 text-sm mb-4">{variant.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-black bg-opacity-30 rounded-lg p-2 text-center">
                  <div className="text-white text-opacity-75 text-xs">Tables</div>
                  <div className="text-white font-bold">{variant.activeTables}</div>
                </div>
                <div className="bg-black bg-opacity-30 rounded-lg p-2 text-center">
                  <div className="text-white text-opacity-75 text-xs">Joueurs</div>
                  <div className="text-white font-bold">{variant.activePlayers}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {variant.popularStakes.map((stake) => (
                  <span key={stake} className="bg-black bg-opacity-30 text-white px-2 py-1 rounded text-xs">
                    {stake}
                  </span>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayVariant(variant);
                }}
                className="w-full bg-white text-gray-900 py-2 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                ▶️ Jouer
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Variant Detail Modal */}
        <AnimatePresence>
          {selectedVariant && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVariant(null)}
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className={`bg-gradient-to-r ${selectedVariant.color} p-8 relative`}>
                  <button
                    onClick={() => setSelectedVariant(null)}
                    className="absolute top-4 right-4 text-white hover:text-gray-200 text-3xl"
                  >
                    ✕
                  </button>
                  <div className="flex items-center space-x-6">
                    <div className="text-8xl">{selectedVariant.icon}</div>
                    <div>
                      <h2 className="text-4xl font-bold text-white mb-2">{selectedVariant.name}</h2>
                      <p className="text-white text-opacity-90 text-lg">{selectedVariant.description}</p>
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-8 space-y-6">
                  {/* Rules */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">📜 Règles</h3>
                    <div className="space-y-2">
                      {selectedVariant.rules.map((rule, idx) => (
                        <div key={idx} className="bg-gray-900 rounded-xl p-4 flex items-start space-x-3">
                          <span className="text-purple-400 font-bold">{idx + 1}.</span>
                          <span className="text-gray-300">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">📊 Statistiques</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Tables Actives</div>
                        <div className="text-3xl font-bold text-white">{selectedVariant.activeTables}</div>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Joueurs en Ligne</div>
                        <div className="text-3xl font-bold text-white">{selectedVariant.activePlayers}</div>
                      </div>
                    </div>
                  </div>

                  {/* Stakes */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">💰 Stakes Populaires</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedVariant.popularStakes.map((stake) => (
                        <span key={stake} className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold">
                          {stake}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Play Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePlayVariant(selectedVariant)}
                    className={`w-full bg-gradient-to-r ${selectedVariant.color} text-white py-4 rounded-xl font-bold text-xl hover:opacity-90 transition`}
                  >
                    ▶️ Rejoindre une Table {selectedVariant.shortName}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-2xl font-bold text-white mb-4 text-center">💡 Pourquoi jouer aux variantes ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">🧠</div>
              <h4 className="text-lg font-bold text-purple-400 mb-2">Développez vos Compétences</h4>
              <p className="text-gray-300 text-sm">
                Chaque variante teste différentes compétences. Devenez un joueur complet !
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">💰</div>
              <h4 className="text-lg font-bold text-green-400 mb-2">Moins de Concurrence</h4>
              <p className="text-gray-300 text-sm">
                Moins de joueurs = tables plus soft. Profitez d'un edge énorme !
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">🎭</div>
              <h4 className="text-lg font-bold text-pink-400 mb-2">Variété et Fun</h4>
              <p className="text-gray-300 text-sm">
                Évitez la monotonie du Hold'em. Chaque variante est une nouvelle aventure !
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
