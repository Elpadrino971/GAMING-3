'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Disable static generation
export const dynamic = 'force-dynamic';

// Dynamically import the 3D component (must be client-side only)
const PokerTable3D = dynamic(
  () => import('@/components/poker3d/PokerTable3D'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎰</div>
          <h2 className="text-2xl font-bold text-white mb-2">Chargement de la Table 3D...</h2>
          <p className="text-gray-400">Initialisation de Three.js et WebGL</p>
        </div>
      </div>
    ),
  }
);

interface Player {
  id: string;
  name: string;
  chips: number;
  cards?: { rank: string; suit: string }[];
  isFolded: boolean;
  isDealer: boolean;
  position: number;
}

export default function Poker3DPage() {
  // Demo players
  const [players] = useState<Player[]>([
    {
      id: '1',
      name: 'Vous',
      chips: 2500,
      cards: [
        { rank: 'A', suit: 'h' },
        { rank: 'K', suit: 'h' },
      ],
      isFolded: false,
      isDealer: false,
      position: 0,
    },
    {
      id: '2',
      name: 'Phil Ivey',
      chips: 3200,
      cards: [
        { rank: 'Q', suit: 'd' },
        { rank: 'Q', suit: 'c' },
      ],
      isFolded: false,
      isDealer: true,
      position: 1,
    },
    {
      id: '3',
      name: 'Daniel',
      chips: 1800,
      cards: [
        { rank: 'J', suit: 's' },
        { rank: '10', suit: 's' },
      ],
      isFolded: false,
      isDealer: false,
      position: 2,
    },
    {
      id: '4',
      name: 'Vanessa',
      chips: 4100,
      cards: [
        { rank: '9', suit: 'h' },
        { rank: '9', suit: 'd' },
      ],
      isFolded: false,
      isDealer: false,
      position: 3,
    },
    {
      id: '5',
      name: 'Tom',
      chips: 950,
      cards: [
        { rank: 'A', suit: 'c' },
        { rank: '7', suit: 'c' },
      ],
      isFolded: true,
      isDealer: false,
      position: 4,
    },
    {
      id: '6',
      name: 'Sarah',
      chips: 2750,
      cards: [
        { rank: 'K', suit: 's' },
        { rank: 'J', suit: 'h' },
      ],
      isFolded: false,
      isDealer: false,
      position: 5,
    },
  ]);

  const [communityCards] = useState([
    { rank: 'A', suit: 'd' },
    { rank: 'K', suit: 'c' },
    { rank: 'Q', suit: 'h' },
    { rank: '9', suit: 's' },
    { rank: '2', suit: 'h' },
  ]);

  const [pot] = useState(4500);
  const [showCommunityCards, setShowCommunityCards] = useState(true);
  const [show3D, setShow3D] = useState(true);

  return (
    <div className="relative">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-gray-900/90 to-transparent p-6">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-yellow-400 hover:text-yellow-300 font-semibold transition"
          >
            ← Retour au Menu
          </Link>
          <h1 className="text-3xl font-bold text-white">🎰 PokerMind 3D</h1>
          <div className="w-32"></div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-gray-800/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl border-2 border-yellow-400">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCommunityCards(!showCommunityCards)}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              showCommunityCards
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-700 hover:bg-gray-600'
            } text-white`}
          >
            {showCommunityCards ? '🃏 Cartes Visibles' : '🃏 Cartes Cachées'}
          </button>

          <div className="h-10 w-px bg-gray-600"></div>

          <div className="text-center">
            <div className="text-yellow-400 text-sm mb-1">Pot</div>
            <div className="text-white font-bold text-xl">${pot.toLocaleString()}</div>
          </div>

          <div className="h-10 w-px bg-gray-600"></div>

          <div className="text-center">
            <div className="text-blue-400 text-sm mb-1">Joueurs</div>
            <div className="text-white font-bold text-xl">{players.filter(p => !p.isFolded).length}/{players.length}</div>
          </div>

          <div className="h-10 w-px bg-gray-600"></div>

          <button
            onClick={() => setShow3D(!show3D)}
            className="px-6 py-3 rounded-lg font-bold bg-purple-600 hover:bg-purple-700 text-white transition"
          >
            {show3D ? '3️⃣ Mode 3D' : '2️⃣ Mode 2D'}
          </button>
        </div>
      </div>

      {/* Features Info */}
      <div className="absolute bottom-24 left-4 z-10 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 max-w-xs">
        <h3 className="text-yellow-400 font-bold mb-2">✨ Fonctionnalités 3D</h3>
        <ul className="text-white text-sm space-y-1">
          <li>✅ Table de poker réaliste avec feutre vert</li>
          <li>✅ Cartes 3D avec flip animations</li>
          <li>✅ Jetons 3D empilables</li>
          <li>✅ Éclairage dynamique et ombres</li>
          <li>✅ Caméra orbital interactive</li>
          <li>✅ 6 joueurs avec cartes visibles</li>
          <li>✅ Bouton dealer rotatif</li>
          <li>✅ Affichage du pot et des stacks</li>
        </ul>
      </div>

      {/* Performance Info */}
      <div className="absolute bottom-24 right-4 z-10 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 max-w-xs">
        <h3 className="text-green-400 font-bold mb-2">⚡ Performance</h3>
        <ul className="text-white text-sm space-y-1">
          <li>🎮 WebGL avec Three.js</li>
          <li>🎨 Rendu 60 FPS</li>
          <li>🔆 Shadows en temps réel</li>
          <li>🌍 Environment mapping</li>
          <li>📱 Compatible mobile (tactile)</li>
          <li>🖱️ Contrôles souris/trackpad</li>
        </ul>
      </div>

      {/* LA BOUCHERIE Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="bg-gradient-to-r from-red-900 to-red-950 border-2 border-red-500 rounded-xl px-6 py-3 shadow-2xl">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🔪</span>
            <div>
              <div className="text-red-400 text-xs font-bold">NOUVELLE VARIANTE EXCLUSIVE</div>
              <div className="text-white font-bold">LA BOUCHERIE disponible en 3D</div>
            </div>
            <span className="text-3xl">🩸</span>
          </div>
        </div>
      </motion.div>

      {/* 3D Table */}
      {show3D && (
        <PokerTable3D
          players={players}
          communityCards={communityCards}
          pot={pot}
          showCommunityCards={showCommunityCards}
        />
      )}

      {/* 2D Fallback */}
      {!show3D && (
        <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎰</div>
            <h2 className="text-2xl font-bold text-white mb-2">Mode 2D</h2>
            <p className="text-gray-400 mb-4">Activez le mode 3D pour voir la table</p>
            <button
              onClick={() => setShow3D(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-xl font-bold transition"
            >
              Activer la 3D
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
