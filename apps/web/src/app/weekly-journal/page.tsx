'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Disable static generation
export const dynamic = 'force-dynamic';

interface WeeklyProgressPlayer {
  username: string;
  avatar: string;
  country: string;
  progressionXP: number;
  progressionProfit: number;
  handsPlayed: number;
  currentRank: number;
  previousRank: number;
  badge: 'rising-star' | 'comeback' | 'grinder' | 'hot-streak';
}

interface PokerTip {
  id: string;
  category: 'preflop' | 'postflop' | 'psychology' | 'bankroll' | 'tournament';
  title: string;
  content: string;
  author: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
}

interface Anecdote {
  id: string;
  title: string;
  story: string;
  player: string;
  year: number;
  tournament: string;
  icon: string;
}

interface LexiqueEntry {
  term: string;
  definition: string;
  example: string;
  category: 'hand' | 'action' | 'position' | 'concept' | 'slang';
}

interface RegionalNews {
  id: string;
  region: string;
  title: string;
  description: string;
  date: Date;
  prizePool: number;
  location: string;
  icon: string;
}

export default function WeeklyJournalPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [selectedTab, setSelectedTab] = useState<'progression' | 'tips' | 'anecdotes' | 'lexique' | 'regional'>('progression');

  const currentWeek = 'Semaine du 4 au 10 Novembre 2025';

  // Top Progressions
  const TOP_PROGRESSIONS: WeeklyProgressPlayer[] = [
    {
      username: 'RisingPhoenix',
      avatar: '🔥',
      country: '🇫🇷',
      progressionXP: 45800,
      progressionProfit: 125000,
      handsPlayed: 1250,
      currentRank: 42,
      previousRank: 187,
      badge: 'rising-star',
    },
    {
      username: 'TheComeback',
      avatar: '💪',
      country: '🇧🇷',
      progressionXP: 38200,
      progressionProfit: 98500,
      handsPlayed: 980,
      currentRank: 67,
      previousRank: 234,
      badge: 'comeback',
    },
    {
      username: 'GrindMaster',
      avatar: '⚙️',
      country: '🇨🇦',
      progressionXP: 35600,
      progressionProfit: 87200,
      handsPlayed: 2340,
      currentRank: 89,
      previousRank: 178,
      badge: 'grinder',
    },
    {
      username: 'HotStreak99',
      avatar: '🎯',
      country: '🇺🇸',
      progressionXP: 32100,
      progressionProfit: 76800,
      handsPlayed: 845,
      currentRank: 103,
      previousRank: 256,
      badge: 'hot-streak',
    },
    {
      username: 'SilentKiller',
      avatar: '🥷',
      country: '🇯🇵',
      progressionXP: 29800,
      progressionProfit: 68900,
      handsPlayed: 1120,
      currentRank: 125,
      previousRank: 289,
      badge: 'rising-star',
    },
  ];

  // Poker Tips
  const POKER_TIPS: PokerTip[] = [
    {
      id: 'tip-1',
      category: 'preflop',
      title: 'La Position est Reine',
      content: 'Jouez plus de mains en position tardive (cutoff, bouton) et resserrez votre range en position précoce. Un 7-8 suited au bouton peut être profitable, mais en UTG c\'est un fold automatique.',
      author: 'Daniel Negreanu',
      difficulty: 'beginner',
      icon: '📍',
    },
    {
      id: 'tip-2',
      category: 'postflop',
      title: 'Le C-Bet Sélectif',
      content: 'Ne c-bet pas automatiquement. Sur un flop K-Q-J multicolore, votre A-A en position précoce devrait plutôt check-call que bet-fold. Choisissez vos spots.',
      author: 'Phil Ivey',
      difficulty: 'intermediate',
      icon: '🎯',
    },
    {
      id: 'tip-3',
      category: 'psychology',
      title: 'Gérez le Tilt Avant qu\'il Arrive',
      content: 'Prenez une pause après 2 bad beats consécutifs. Le tilt coûte plus cher que n\'importe quelle main perdue. Définissez vos "stop-loss" mentaux.',
      author: 'Vanessa Selbst',
      difficulty: 'beginner',
      icon: '🧠',
    },
    {
      id: 'tip-4',
      category: 'bankroll',
      title: 'La Règle des 100 Buy-ins',
      content: 'Pour le cash game, gardez minimum 100 buy-ins pour votre stake. Si vous jouez NL100, votre bankroll devrait être de $10,000. Cela absorbe la variance.',
      author: 'Chris Ferguson',
      difficulty: 'intermediate',
      icon: '💰',
    },
    {
      id: 'tip-5',
      category: 'tournament',
      title: 'ICM à la Bulle',
      content: 'À la bulle d\'un tournoi, les short stacks ne peuvent pas se permettre de vous caller. Utilisez cette pression pour voler les blinds agressivement avec n\'importe quelles cartes.',
      author: 'Fedor Holz',
      difficulty: 'advanced',
      icon: '🏆',
    },
  ];

  // Anecdotes
  const ANECDOTES: Anecdote[] = [
    {
      id: 'anec-1',
      title: 'Le Bluff Légendaire de Phil Ivey',
      story: 'Au High Stakes Poker, Phil Ivey a réussi le bluff du siècle en forçant Tom Dwan à folder une quinte avec seulement 7-high. Sa lecture parfaite et son timing impeccable ont fait de cette main une légende. Dwan a dit après : "Je savais qu\'il bluffait, mais je ne pouvais pas caller."',
      player: 'Phil Ivey',
      year: 2009,
      tournament: 'High Stakes Poker',
      icon: '🎭',
    },
    {
      id: 'anec-2',
      title: 'Le Bad Beat à $1 Million',
      story: 'Lors du WSOP Main Event 2019, un joueur amateur avait quad Aces contre quad Rois. Le pot dépassait $1M. Les deux joueurs ont mis all-in preflop avec A-A vs K-K, et le board a donné A-A-K-K-7. Probabilité : 0.0001%.',
      player: 'Amateur Legend',
      year: 2019,
      tournament: 'WSOP Main Event',
      icon: '💥',
    },
    {
      id: 'anec-3',
      title: 'Doyle Brunson et sa Main Fétiche',
      story: 'Doyle Brunson a gagné le WSOP Main Event 2 fois consécutives (1976-1977) avec 10-2, la même main. Depuis, 10-2 est appelée "Doyle Brunson" dans le monde du poker. Il a dit : "Cette main m\'a rendu riche, mais elle a ruiné beaucoup de gens qui essayent de la jouer."',
      player: 'Doyle Brunson',
      year: 1977,
      tournament: 'WSOP Main Event',
      icon: '👑',
    },
    {
      id: 'anec-4',
      title: 'Le Comeback de Stu Ungar',
      story: 'En 1997, après 16 ans sans victoire majeure et des problèmes personnels, Stu Ungar a gagné son 3ème WSOP Main Event à 43 ans. Il a dominé la table finale comme dans ses jeunes années. Malheureusement, il est décédé un an plus tard. Un génie tragique.',
      player: 'Stu Ungar',
      year: 1997,
      tournament: 'WSOP Main Event',
      icon: '⚡',
    },
  ];

  // Lexique Poker
  const LEXIQUE: LexiqueEntry[] = [
    {
      term: 'GTO (Game Theory Optimal)',
      definition: 'Stratégie mathématiquement optimale qui ne peut pas être exploitée. Basée sur l\'équilibre de Nash.',
      example: 'Une stratégie GTO bet 66% pot avec un range équilibré de value et bluff.',
      category: 'concept',
    },
    {
      term: 'Cooler',
      definition: 'Situation où deux mains très fortes se rencontrent (ex: AA vs KK). Impossible à éviter.',
      example: 'Flopper full house et perdre contre quad est un cooler classique.',
      category: 'slang',
    },
    {
      term: 'ICM (Independent Chip Model)',
      definition: 'Modèle de calcul de la valeur des jetons en tournoi basé sur les payout structure.',
      example: 'À la bulle, vos jetons valent moins en ICM qu\'en chips.',
      category: 'concept',
    },
    {
      term: 'Floating',
      definition: 'Caller un bet au flop avec l\'intention de bluffer plus tard (turn ou river).',
      example: 'Je float son c-bet avec middle pair pour bluffer si il check la turn.',
      category: 'action',
    },
    {
      term: 'Backdoor',
      definition: 'Tirage qui nécessite les deux cartes suivantes (turn et river).',
      example: 'J\'ai backdoor flush draw avec deux piques en main sur flop unpaired.',
      category: 'hand',
    },
    {
      term: 'Donk Bet',
      definition: 'Miser en étant out of position sans être le dernier agresseur pré-flop.',
      example: 'Il fait un donk bet sur le flop après avoir callé ma raise pré-flop.',
      category: 'action',
    },
    {
      term: 'Rainbow',
      definition: 'Flop avec trois couleurs différentes (aucun tirage couleur possible).',
      example: 'Le flop K♠ 8♥ 3♦ est rainbow, pas de flush draw possible.',
      category: 'hand',
    },
    {
      term: 'Polarisé (Range)',
      definition: 'Range composé uniquement de très bonnes mains et de bluffs, sans mains moyennes.',
      example: 'Sa range river est polarisée : nuts ou air, jamais middle strength.',
      category: 'concept',
    },
  ];

  // Regional News
  const REGIONAL_NEWS: RegionalNews[] = [
    {
      id: 'reg-1',
      region: 'France',
      title: 'Winamax Poker Tour - Paris',
      description: 'Le WPT arrive à Paris avec un Main Event à 500€. Prize pool garanti : 500 000€. Qualification online disponible dès 20€.',
      date: new Date('2025-11-20'),
      prizePool: 500000,
      location: 'Aviation Club de France, Paris',
      icon: '🇫🇷',
    },
    {
      id: 'reg-2',
      region: 'Canada',
      title: 'Montreal Poker Festival',
      description: 'Plus grand festival de poker du Québec. 25 tournois sur 2 semaines. High Roller à 5 000$ CAD.',
      date: new Date('2025-11-15'),
      prizePool: 2000000,
      location: 'Playground Poker Club, Montreal',
      icon: '🇨🇦',
    },
    {
      id: 'reg-3',
      region: 'Belgique',
      title: 'Brussels Poker Festival',
      description: 'Main Event à 1 100€ avec 1M€ garanti. Satellites quotidiens. Side events à partir de 150€.',
      date: new Date('2025-12-01'),
      prizePool: 1000000,
      location: 'Grand Casino Brussels Viage',
      icon: '🇧🇪',
    },
    {
      id: 'reg-4',
      region: 'Suisse',
      title: 'Swiss Poker Championship',
      description: 'Championnat national avec 50 000 CHF garantis. Format deepstack avec 40 000 jetons de départ.',
      date: new Date('2025-11-25'),
      prizePool: 50000,
      location: 'Casino Barrière, Montreux',
      icon: '🇨🇭',
    },
  ];

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'rising-star':
        return { label: '⭐ Étoile Montante', color: 'bg-yellow-600' };
      case 'comeback':
        return { label: '💪 Comeback', color: 'bg-green-600' };
      case 'grinder':
        return { label: '⚙️ Grinder', color: 'bg-blue-600' };
      case 'hot-streak':
        return { label: '🔥 Hot Streak', color: 'bg-red-600' };
      default:
        return { label: '📈 Progression', color: 'bg-gray-600' };
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-400 bg-green-900';
      case 'intermediate':
        return 'text-yellow-400 bg-yellow-900';
      case 'advanced':
        return 'text-red-400 bg-red-900';
      default:
        return 'text-gray-400 bg-gray-900';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Retour
          </Link>
          <div className="text-center">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 mb-2">
              📰 JOURNAL HEBDOMADAIRE
            </h1>
            <p className="text-gray-300 text-lg">{currentWeek}</p>
          </div>
          <div className="bg-gray-800 rounded-full px-6 py-2">
            <span className="text-yellow-400 font-bold">
              💰 {user?.totalChips?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-4 mb-8 flex-wrap gap-y-2">
          {[
            { value: 'progression', label: '📈 Progressions', icon: '📈' },
            { value: 'tips', label: '💡 Trucs & Astuces', icon: '💡' },
            { value: 'anecdotes', label: '🎭 Anecdotes', icon: '🎭' },
            { value: 'lexique', label: '📖 Lexique', icon: '📖' },
            { value: 'regional', label: '🌍 Tournois Régionaux', icon: '🌍' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedTab(tab.value as any)}
              className={`px-6 py-3 rounded-xl font-bold transition ${
                selectedTab === tab.value
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Progressions Tab */}
        {selectedTab === 'progression' && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-2">🚀 Top 5 Progressions de la Semaine</h2>
              <p className="text-blue-100">Les joueurs qui ont le plus progressé cette semaine</p>
            </motion.div>

            <div className="space-y-6">
              {TOP_PROGRESSIONS.map((player, index) => {
                const badge = getBadgeStyle(player.badge);
                const rankChange = player.previousRank - player.currentRank;
                return (
                  <motion.div
                    key={player.username}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 hover:border-purple-500 transition"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      {/* Rank and Player */}
                      <div className="flex items-center space-x-6">
                        <div className="bg-purple-900 rounded-xl px-4 py-3 min-w-[80px] text-center">
                          <div className="text-3xl font-bold text-purple-400">#{index + 1}</div>
                        </div>
                        <div className="text-6xl">{player.avatar}</div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">{player.username}</h3>
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{player.country}</span>
                            <span className={`${badge.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                              {badge.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-900 rounded-xl p-3 text-center">
                          <div className="text-gray-400 text-xs mb-1">XP Gagné</div>
                          <div className="text-green-400 font-bold text-lg">+{player.progressionXP.toLocaleString()}</div>
                        </div>
                        <div className="bg-gray-900 rounded-xl p-3 text-center">
                          <div className="text-gray-400 text-xs mb-1">Profit</div>
                          <div className="text-yellow-400 font-bold text-lg">+{player.progressionProfit.toLocaleString()}</div>
                        </div>
                        <div className="bg-gray-900 rounded-xl p-3 text-center">
                          <div className="text-gray-400 text-xs mb-1">Mains</div>
                          <div className="text-blue-400 font-bold text-lg">{player.handsPlayed}</div>
                        </div>
                        <div className="bg-gray-900 rounded-xl p-3 text-center">
                          <div className="text-gray-400 text-xs mb-1">Rang</div>
                          <div className="text-purple-400 font-bold text-lg">
                            #{player.currentRank}
                            <span className="text-green-400 text-sm ml-1">↑{rankChange}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tips Tab */}
        {selectedTab === 'tips' && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-6 mb-8 text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-2">💡 Trucs & Astuces de la Semaine</h2>
              <p className="text-yellow-100">Conseils des plus grands pros pour améliorer votre jeu</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {POKER_TIPS.map((tip, index) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 hover:border-yellow-500 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{tip.icon}</div>
                    <span className={`${getDifficultyColor(tip.difficulty)} px-3 py-1 rounded-full text-xs font-bold`}>
                      {tip.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{tip.title}</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">{tip.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-semibold">- {tip.author}</span>
                    <span className="bg-gray-900 text-gray-400 px-3 py-1 rounded-full text-xs">
                      {tip.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Anecdotes Tab */}
        {selectedTab === 'anecdotes' && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-6 mb-8 text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-2">🎭 Anecdotes Légendaires</h2>
              <p className="text-pink-100">Les histoires les plus folles du monde du poker</p>
            </motion.div>

            <div className="space-y-6">
              {ANECDOTES.map((anecdote, index) => (
                <motion.div
                  key={anecdote.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 rounded-2xl p-8 border-2 border-gray-700 hover:border-pink-500 transition"
                >
                  <div className="flex items-start space-x-6">
                    <div className="text-7xl">{anecdote.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-3">{anecdote.title}</h3>
                      <p className="text-gray-300 text-lg leading-relaxed mb-4">{anecdote.story}</p>
                      <div className="flex items-center space-x-6 text-sm">
                        <span className="bg-pink-900 text-pink-200 px-4 py-2 rounded-full font-semibold">
                          👤 {anecdote.player}
                        </span>
                        <span className="bg-purple-900 text-purple-200 px-4 py-2 rounded-full font-semibold">
                          🏆 {anecdote.tournament}
                        </span>
                        <span className="bg-gray-900 text-gray-400 px-4 py-2 rounded-full font-semibold">
                          📅 {anecdote.year}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Lexique Tab */}
        {selectedTab === 'lexique' && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 mb-8 text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-2">📖 Lexique du Poker</h2>
              <p className="text-teal-100">Apprenez le vocabulaire essentiel du poker moderne</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {LEXIQUE.map((entry, index) => (
                <motion.div
                  key={entry.term}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 hover:border-teal-500 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-teal-400">{entry.term}</h3>
                    <span className="bg-gray-900 text-gray-400 px-3 py-1 rounded-full text-xs">
                      {entry.category}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{entry.definition}</p>
                  <div className="bg-teal-900 bg-opacity-30 border border-teal-500 rounded-lg p-3">
                    <div className="text-teal-300 text-sm">
                      <span className="font-semibold">Exemple:</span> {entry.example}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Regional Tournaments Tab */}
        {selectedTab === 'regional' && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-8 text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-2">🌍 Tournois Régionaux</h2>
              <p className="text-green-100">Les événements poker à ne pas manquer près de chez vous</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {REGIONAL_NEWS.map((news, index) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-700 hover:border-green-500 transition"
                >
                  <div className="bg-gradient-to-r from-green-900 to-emerald-900 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-5xl">{news.icon}</div>
                      <span className="bg-green-700 text-white px-4 py-2 rounded-full font-bold">
                        {news.region}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{news.title}</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-gray-300">{news.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-900 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1">Prize Pool</div>
                        <div className="text-green-400 font-bold">
                          {(news.prizePool / 1000).toFixed(0)}K €
                        </div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1">Date</div>
                        <div className="text-white font-bold">
                          {news.date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-1">📍 Lieu</div>
                      <div className="text-white font-semibold">{news.location}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
