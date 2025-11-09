'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Disable static generation
export const dynamic = 'force-dynamic';

interface BoucherieTable {
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
  biggestPot: number;
  format: 'cash' | 'tournament';
}

export default function LaBoucheriePage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [showRules, setShowRules] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  // La Boucherie Tables
  const BOUCHERIE_TABLES: BoucherieTable[] = [
    {
      id: 'bouch-micro',
      name: 'Boucherie Micro',
      stake: 'Bouch10',
      smallBlind: 0.05,
      bigBlind: 0.10,
      minBuyIn: 4.00,
      maxBuyIn: 10.00,
      players: 6,
      maxPlayers: 6,
      avgPot: 8.50,
      biggestPot: 47.80,
      format: 'cash',
    },
    {
      id: 'bouch-25',
      name: 'Boucherie Carnage',
      stake: 'Bouch25',
      smallBlind: 0.10,
      bigBlind: 0.25,
      minBuyIn: 10.00,
      maxBuyIn: 25.00,
      players: 5,
      maxPlayers: 6,
      avgPot: 18.75,
      biggestPot: 124.50,
      format: 'cash',
    },
    {
      id: 'bouch-50',
      name: 'Boucherie Massacre',
      stake: 'Bouch50',
      smallBlind: 0.25,
      bigBlind: 0.50,
      minBuyIn: 20.00,
      maxBuyIn: 50.00,
      players: 4,
      maxPlayers: 6,
      avgPot: 42.30,
      biggestPot: 298.90,
      format: 'cash',
    },
    {
      id: 'bouch-100',
      name: 'Boucherie Apocalypse',
      stake: 'Bouch100',
      smallBlind: 0.50,
      bigBlind: 1.00,
      minBuyIn: 40.00,
      maxBuyIn: 100.00,
      players: 3,
      maxPlayers: 6,
      avgPot: 87.60,
      biggestPot: 587.20,
      format: 'cash',
    },
    {
      id: 'bouch-tourney',
      name: 'Tournoi La Boucherie',
      stake: '$50 Buy-in',
      smallBlind: 0,
      bigBlind: 0,
      minBuyIn: 50,
      maxBuyIn: 50,
      players: 34,
      maxPlayers: 100,
      avgPot: 0,
      biggestPot: 0,
      format: 'tournament',
    },
  ];

  const CRAZY_EXAMPLES = [
    {
      title: '🔪 Le Massacre du Flop',
      scenario: 'Vous avez: A♥ A♠ K♥ Q♥',
      flop: 'Flop: K♠ K♦ K♣',
      situation: 'Vous avez QUAD ROIS (K-K-K-K-A) en utilisant 3 cartes du board + votre A+K de la main !',
      vs: 'Votre adversaire avec 7♠ 8♠ 9♠ T♠ a aussi QUAD ROIS (K-K-K-K-T) ! Le kicker décide. Pot de 245BB !',
      icon: '💀',
    },
    {
      title: '🩸 La Full House Trap',
      scenario: 'Vous avez: Q♦ Q♣ J♦ J♣',
      flop: 'Board: Q♥ J♥ 9♠ 3♦ 2♣',
      situation: 'Vous avez FULL QUEENS par JACKS (Q-Q-Q-J-J) en utilisant vos 4 cartes !',
      vs: 'Mais votre adversaire a 9♣ 9♦ 3♥ 3♠ = FULL NINES par THREES (9-9-9-3-3). Il utilise aussi ses 4 cartes. Vous gagnez !',
      icon: '🔥',
    },
    {
      title: '⚡ Le Board Joue Seul',
      scenario: 'Vous avez: 2♥ 3♣ 5♦ 7♠',
      flop: 'Board: A♠ K♠ Q♠ J♠ T♠',
      situation: 'ROYAL FLUSH au board ! Vous utilisez 0 carte de votre main.',
      vs: 'N\'importe qui avec un ♠ dans sa main bat le board. Quelqu\'un a 9♠ = Straight Flush to the King. CARNAGE !',
      icon: '💥',
    },
  ];

  const handleJoinTable = (table: BoucherieTable) => {
    alert(`🔪 Bienvenue à LA BOUCHERIE !\n\nTable: ${table.name}\nStake: ${table.stake}\n\n⚠️ ATTENTION: Variance EXTRÊME !\n💰 Pot moyen: $${table.avgPot.toFixed(2)}\n🔥 Plus gros pot de la session: $${table.biggestPot.toFixed(2)}\n\nC'est parti pour le CARNAGE ! 🩸`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Retour
          </Link>
          <div className="text-center">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-400 to-red-600 mb-2"
            >
              🔪 LA BOUCHERIE 🩸
            </motion.h1>
            <p className="text-red-300 text-xl font-bold">La Variante la Plus SAUVAGE du Poker !</p>
          </div>
          <div className="bg-gray-800 rounded-full px-6 py-2">
            <span className="text-yellow-400 font-bold">
              💰 {user?.totalChips?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        {/* Warning Banner */}
        <AnimatePresence>
          {showWarning && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-red-900 to-red-800 border-4 border-red-500 rounded-2xl p-6 mb-8 relative"
            >
              <button
                onClick={() => setShowWarning(false)}
                className="absolute top-4 right-4 text-white hover:text-red-200 text-2xl"
              >
                ✕
              </button>
              <div className="flex items-start space-x-4">
                <div className="text-6xl">⚠️</div>
                <div>
                  <h2 className="text-3xl font-bold text-yellow-400 mb-3">🚨 AVERTISSEMENT VARIANCE EXTRÊME 🚨</h2>
                  <div className="text-red-100 space-y-2">
                    <p className="text-lg font-bold">
                      💀 La Boucherie n'est PAS pour les âmes sensibles !
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li>🔥 Variance 10x plus élevée que le Hold'em</li>
                      <li>💥 Pots moyens 4x plus gros que Omaha classique</li>
                      <li>🎲 Les nuts changent à CHAQUE carte du board</li>
                      <li>💰 Bankroll recommandée : 100+ buy-ins MINIMUM</li>
                      <li>🩸 Swings de +/- 50 buy-ins en une session = NORMAL</li>
                      <li>⚡ Action ALL-IN sur presque chaque main</li>
                    </ul>
                    <p className="text-yellow-300 font-bold mt-3">
                      Si vous cherchez un jeu stable et prévisible, FUYEZ ! 🏃‍♂️💨
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rules Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-red-900 to-gray-900 rounded-2xl p-8 mb-8 border-4 border-red-600"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl font-bold text-white flex items-center">
              <span className="text-5xl mr-3">🔪</span> Règles de La Boucherie
            </h2>
            <button
              onClick={() => setShowRules(!showRules)}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition"
            >
              {showRules ? '👁️ Masquer' : '👁️ Voir les Règles'}
            </button>
          </div>

          <AnimatePresence>
            {showRules && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4"
              >
                <div className="bg-black bg-opacity-50 rounded-xl p-6 border-2 border-red-500">
                  <h3 className="text-2xl font-bold text-red-400 mb-4">📜 Comment Jouer</h3>
                  <div className="space-y-3 text-red-100">
                    <div className="flex items-start space-x-3">
                      <span className="text-red-400 font-bold text-xl">1.</span>
                      <p>
                        <strong className="text-red-300">4 cartes privées</strong> comme en Omaha classique
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-red-400 font-bold text-xl">2.</span>
                      <p>
                        <strong className="text-red-300">5 cartes communes</strong> au board (Flop, Turn, River)
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-red-400 font-bold text-xl">3.</span>
                      <div>
                        <p className="text-yellow-300 font-bold text-lg mb-2">🔥 LA DIFFÉRENCE MORTELLE :</p>
                        <p>
                          Vous pouvez utiliser <strong className="text-yellow-400">0, 1, 2, 3 OU 4 cartes</strong> de votre main !
                        </p>
                        <div className="mt-2 space-y-1 text-sm bg-red-950 p-3 rounded-lg">
                          <p>✅ 0 carte de votre main + 5 du board = VALIDE</p>
                          <p>✅ 1 carte de votre main + 4 du board = VALIDE</p>
                          <p>✅ 2 cartes de votre main + 3 du board = VALIDE (comme Omaha)</p>
                          <p>✅ 3 cartes de votre main + 2 du board = VALIDE</p>
                          <p>✅ 4 cartes de votre main + 1 du board = VALIDE</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-red-400 font-bold text-xl">4.</span>
                      <p>
                        <strong className="text-red-300">Pot Limit</strong> : Vous pouvez miser jusqu'à la taille du pot
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-black bg-opacity-50 rounded-xl p-6 border-2 border-yellow-500">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">💡 Pourquoi c'est FOU ?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-red-100">
                    <div className="bg-red-950 rounded-lg p-4">
                      <div className="text-3xl mb-2">🎲</div>
                      <p className="font-bold text-yellow-300 mb-1">Flexibilité Totale</p>
                      <p className="text-sm">
                        Jouez le board, votre main, ou un mix. Adaptez-vous à CHAQUE situation !
                      </p>
                    </div>
                    <div className="bg-red-950 rounded-lg p-4">
                      <div className="text-3xl mb-2">💥</div>
                      <p className="font-bold text-yellow-300 mb-1">Combos Infinies</p>
                      <p className="text-sm">
                        Avec 4 cartes et flexibilité, vous avez 10x plus de combos possibles qu'en Omaha !
                      </p>
                    </div>
                    <div className="bg-red-950 rounded-lg p-4">
                      <div className="text-3xl mb-2">🔥</div>
                      <p className="font-bold text-yellow-300 mb-1">Action Garantie</p>
                      <p className="text-sm">
                        Presque tout le monde a un gros tirage ou une grosse main. ALL-IN à chaque main !
                      </p>
                    </div>
                    <div className="bg-red-950 rounded-lg p-4">
                      <div className="text-3xl mb-2">🎰</div>
                      <p className="font-bold text-yellow-300 mb-1">Lecture Impossible</p>
                      <p className="text-sm">
                        Impossible de mettre l'adversaire sur une range précise. Pure chaos !
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Crazy Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            🩸 Exemples de CARNAGE à La Boucherie
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CRAZY_EXAMPLES.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-gradient-to-br from-red-900 to-gray-900 rounded-2xl p-6 border-2 border-red-600"
              >
                <div className="text-6xl text-center mb-4">{example.icon}</div>
                <h3 className="text-xl font-bold text-yellow-400 text-center mb-4">{example.title}</h3>
                <div className="space-y-3 text-red-100 text-sm">
                  <div className="bg-black bg-opacity-50 rounded-lg p-3">
                    <p className="text-yellow-300 font-bold mb-1">Votre Main:</p>
                    <p>{example.scenario}</p>
                  </div>
                  <div className="bg-black bg-opacity-50 rounded-lg p-3">
                    <p className="text-green-300 font-bold mb-1">Board:</p>
                    <p>{example.flop}</p>
                  </div>
                  <div className="bg-red-950 rounded-lg p-3 border border-red-500">
                    <p className="text-white font-bold mb-2">💀 Le Massacre:</p>
                    <p className="mb-2">{example.situation}</p>
                    <p className="text-red-300">{example.vs}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Active Tables */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">
            🔪 Tables de La Boucherie ({BOUCHERIE_TABLES.length})
          </h2>

          {BOUCHERIE_TABLES.map((table, index) => (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-red-900 to-gray-900 rounded-2xl p-6 border-4 border-red-600 hover:border-yellow-400 transition cursor-pointer"
              onClick={() => handleJoinTable(table)}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Table Info */}
                <div className="flex items-center space-x-6">
                  <div className="bg-black rounded-xl px-6 py-4 min-w-[140px] text-center border-2 border-red-500">
                    <div className="text-3xl font-bold text-red-400">{table.stake}</div>
                    {table.format === 'cash' && (
                      <div className="text-red-200 text-sm">
                        ${table.smallBlind.toFixed(2)}/${table.bigBlind.toFixed(2)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{table.name}</h3>
                    <div className="flex items-center space-x-3">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        🔥 ULTRA WILD
                      </span>
                      <span className="bg-gray-900 text-gray-400 px-3 py-1 rounded-full text-xs capitalize">
                        {table.format === 'cash' ? 'Cash Game' : 'Tournoi'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                {table.format === 'cash' ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black rounded-xl p-3 text-center border border-red-500">
                      <div className="text-gray-400 text-xs mb-1">Joueurs</div>
                      <div className="text-red-400 font-bold">{table.players}/{table.maxPlayers}</div>
                    </div>
                    <div className="bg-black rounded-xl p-3 text-center border border-red-500">
                      <div className="text-gray-400 text-xs mb-1">Pot Moyen</div>
                      <div className="text-yellow-400 font-bold">${table.avgPot.toFixed(2)}</div>
                    </div>
                    <div className="bg-black rounded-xl p-3 text-center border border-red-500">
                      <div className="text-gray-400 text-xs mb-1">Plus Gros Pot</div>
                      <div className="text-green-400 font-bold">${table.biggestPot.toFixed(2)}</div>
                    </div>
                    <div className="bg-black rounded-xl p-3 text-center border border-red-500">
                      <div className="text-gray-400 text-xs mb-1">Buy-in</div>
                      <div className="text-white font-bold text-sm">
                        ${table.minBuyIn} - ${table.maxBuyIn}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black rounded-xl p-3 text-center border border-red-500">
                      <div className="text-gray-400 text-xs mb-1">Inscrits</div>
                      <div className="text-red-400 font-bold">{table.players}/{table.maxPlayers}</div>
                    </div>
                    <div className="bg-black rounded-xl p-3 text-center border border-red-500">
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
                  className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 transition border-2 border-yellow-400"
                >
                  🔪 ENTRER DANS LA BOUCHERIE
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Strategy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-br from-gray-900 to-red-900 rounded-2xl p-6 border-2 border-red-600"
        >
          <h3 className="text-3xl font-bold text-white mb-6 text-center">
            🎯 Stratégie de Survie à La Boucherie
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xl font-bold text-red-400 mb-4">✅ À FAIRE</h4>
              <div className="space-y-2 text-red-100 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 font-bold">•</span>
                  <p><strong>Mains Connectées</strong>: J-T-9-8, Q-J-T-9 sont des MONSTRES</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 font-bold">•</span>
                  <p><strong>Double/Triple Suited</strong>: Plus de couleurs possibles = plus de nuts</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 font-bold">•</span>
                  <p><strong>Jouer Agressif</strong>: Avec autant de tirages, raise/reraise constamment</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 font-bold">•</span>
                  <p><strong>Draw Heavy</strong>: 15-20 outs = favori même contre made hand</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 font-bold">•</span>
                  <p><strong>Bankroll Massif</strong>: 100+ buy-ins MINIMUM pour survivre</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold text-red-400 mb-4">❌ À ÉVITER</h4>
              <div className="space-y-2 text-red-100 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-red-400 font-bold">•</span>
                  <p><strong>Mains Isolées</strong>: A-A-7-2 rainbow = poubelle totale</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-400 font-bold">•</span>
                  <p><strong>Jouer Scared</strong>: Si vous jouez tight, vous perdrez. Point final.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-400 font-bold">•</span>
                  <p><strong>Overvaluer Top Pair</strong>: C'est du VENT. Visez les nuts.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-400 font-bold">•</span>
                  <p><strong>Short Stack</strong>: Buy-in full (max) ou ne joue pas</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-400 font-bold">•</span>
                  <p><strong>Jouer Tilté</strong>: En tilt à La Boucherie = ruine garantie en 10 minutes</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-red-950 border-2 border-yellow-400 rounded-xl p-4 text-center">
            <p className="text-yellow-300 font-bold text-lg">
              💀 RÈGLE D'OR : À La Boucherie, soit tu massacres, soit tu te fais massacrer. Il n'y a pas de juste milieu ! 🔪
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
