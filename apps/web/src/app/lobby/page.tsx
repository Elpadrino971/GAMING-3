'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Disable static generation for this auth-required page
export const dynamic = 'force-dynamic';

type GameMode = 'cash' | 'sng';

interface Stakes {
  name: string;
  smallBlind: number;
  bigBlind: number;
  minBuyIn: number;
  maxBuyIn: number;
}

const CASH_GAME_STAKES: Stakes[] = [
  { name: 'Micro', smallBlind: 1, bigBlind: 2, minBuyIn: 40, maxBuyIn: 200 },
  { name: 'Low', smallBlind: 5, bigBlind: 10, minBuyIn: 200, maxBuyIn: 1000 },
  { name: 'Medium', smallBlind: 10, bigBlind: 20, minBuyIn: 400, maxBuyIn: 2000 },
  { name: 'High', smallBlind: 25, bigBlind: 50, minBuyIn: 1000, maxBuyIn: 5000 },
];

const SNG_BUY_INS = [
  { name: 'Beginner', buyIn: 100, prize: 500 },
  { name: 'Amateur', buyIn: 250, prize: 1250 },
  { name: 'Intermediate', buyIn: 500, prize: 2500 },
  { name: 'Advanced', buyIn: 1000, prize: 5000 },
  { name: 'Pro', buyIn: 2000, prize: 10000 },
];

/**
 * Lobby page - Choisir le mode de jeu
 */
export default function LobbyPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<GameMode>('cash');
  const [selectedStakes, setSelectedStakes] = useState(0);
  const [buyIn, setBuyIn] = useState(100);

  if (!isAuthenticated || !user) {
    router.push('/');
    return null;
  }

  const currentStakes = selectedMode === 'cash' ? CASH_GAME_STAKES[selectedStakes] : null;
  const currentSNG = selectedMode === 'sng' ? SNG_BUY_INS[selectedStakes] : null;

  const canAfford = selectedMode === 'cash'
    ? user.totalChips >= (currentStakes?.minBuyIn || 0)
    : user.totalChips >= (currentSNG?.buyIn || 0);

  const handlePlay = () => {
    if (!canAfford) return;

    // Store game config in localStorage
    const gameConfig = {
      mode: selectedMode,
      stakes: selectedMode === 'cash' ? currentStakes : currentSNG,
      buyIn: selectedMode === 'cash' ? buyIn : currentSNG?.buyIn
    };

    localStorage.setItem('pokermind_game_config', JSON.stringify(gameConfig));

    // Navigate to play
    router.push('/play');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-poker-green via-emerald-800 to-green-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              🎰
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">PokerMind</h1>
              <p className="text-yellow-400 text-xs">Lobby</p>
            </div>
          </Link>

          {/* User info */}
          <div className="flex items-center space-x-4">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-700">
              <div className="text-right">
                <p className="text-white font-semibold">{user.username}</p>
                <p className="text-yellow-400 text-sm">
                  💰 {user.totalChips.toLocaleString()} chips
                </p>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user.username[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Choose Your Game</h2>
            <p className="text-gray-300">Select a mode and start playing!</p>
          </div>

          {/* Mode selector */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMode('cash')}
              className={`
                p-6 rounded-2xl border-2 transition
                ${selectedMode === 'cash'
                  ? 'bg-green-600 border-green-400'
                  : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                }
              `}
            >
              <div className="text-center">
                <div className="text-5xl mb-3">💵</div>
                <h3 className="text-2xl font-bold text-white mb-2">Cash Game</h3>
                <p className="text-gray-300 text-sm">
                  Play with chips, leave anytime
                </p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMode('sng')}
              className={`
                p-6 rounded-2xl border-2 transition
                ${selectedMode === 'sng'
                  ? 'bg-purple-600 border-purple-400'
                  : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                }
              `}
            >
              <div className="text-center">
                <div className="text-5xl mb-3">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-2">Sit & Go</h3>
                <p className="text-gray-300 text-sm">
                  Tournament, winner takes all
                </p>
              </div>
            </motion.button>
          </div>

          {/* Stakes selector */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">
              {selectedMode === 'cash' ? 'Select Stakes' : 'Select Buy-In'}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(selectedMode === 'cash' ? CASH_GAME_STAKES : SNG_BUY_INS).map((item, index) => {
                const affordable = selectedMode === 'cash'
                  ? user.totalChips >= (item as Stakes).minBuyIn
                  : user.totalChips >= (item as any).buyIn;

                return (
                  <motion.button
                    key={index}
                    whileHover={affordable ? { scale: 1.05 } : {}}
                    whileTap={affordable ? { scale: 0.95 } : {}}
                    onClick={() => affordable && setSelectedStakes(index)}
                    disabled={!affordable}
                    className={`
                      p-4 rounded-xl border-2 transition
                      ${selectedStakes === index
                        ? 'bg-yellow-600 border-yellow-400'
                        : affordable
                          ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                          : 'bg-gray-900 border-gray-800 opacity-50 cursor-not-allowed'
                      }
                    `}
                  >
                    <div className="text-center">
                      <div className="text-sm font-semibold text-white mb-1">
                        {item.name}
                      </div>
                      {selectedMode === 'cash' ? (
                        <div className="text-yellow-400 text-xs">
                          {(item as Stakes).smallBlind}/{(item as Stakes).bigBlind}
                        </div>
                      ) : (
                        <div className="text-yellow-400 text-xs">
                          {(item as any).buyIn} chips
                        </div>
                      )}
                      {!affordable && (
                        <div className="text-red-400 text-xs mt-1">Not enough chips</div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Game details */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Game Details</h3>

            {selectedMode === 'cash' && currentStakes && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Blinds</p>
                    <p className="text-white font-bold text-lg">
                      {currentStakes.smallBlind}/{currentStakes.bigBlind}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Min / Max Buy-In</p>
                    <p className="text-white font-bold text-lg">
                      {currentStakes.minBuyIn} - {currentStakes.maxBuyIn}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-2">
                    Your Buy-In: {buyIn} chips
                  </label>
                  <input
                    type="range"
                    min={currentStakes.minBuyIn}
                    max={Math.min(currentStakes.maxBuyIn, user.totalChips)}
                    step={currentStakes.bigBlind}
                    value={buyIn}
                    onChange={(e) => setBuyIn(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Min: {currentStakes.minBuyIn}</span>
                    <span>Max: {Math.min(currentStakes.maxBuyIn, user.totalChips)}</span>
                  </div>
                </div>
              </div>
            )}

            {selectedMode === 'sng' && currentSNG && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Buy-In:</span>
                  <span className="text-white font-bold">{currentSNG.buyIn} chips</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Prize Pool:</span>
                  <span className="text-yellow-400 font-bold">{currentSNG.prize} chips</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Players:</span>
                  <span className="text-white font-bold">6 players</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payout:</span>
                  <span className="text-white font-bold">Winner takes all</span>
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
              <p className="text-blue-300 text-sm">
                🤖 You'll face 5 AI opponents with different playing styles
              </p>
            </div>
          </div>

          {/* Play button */}
          <motion.button
            whileHover={canAfford ? { scale: 1.02 } : {}}
            whileTap={canAfford ? { scale: 0.98 } : {}}
            onClick={handlePlay}
            disabled={!canAfford}
            className={`
              w-full py-6 rounded-2xl font-bold text-2xl transition shadow-2xl
              ${canAfford
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {canAfford ? '🎮 Start Playing' : '❌ Not Enough Chips'}
          </motion.button>

          {!canAfford && (
            <p className="text-center text-red-400 mt-4">
              You need at least {selectedMode === 'cash' ? currentStakes?.minBuyIn : currentSNG?.buyIn} chips to play this game.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
