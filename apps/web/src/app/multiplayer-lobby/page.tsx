'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getSocketManager } from '@pokermind/multiplayer';
import type { Table } from '@pokermind/multiplayer';

// Disable static generation
export const dynamic = 'force-dynamic';

type GameMode = 'solo' | 'multiplayer';
type MultiplayerMode = 'quick' | 'browse';

const STAKES_OPTIONS = [
  { value: 'micro', label: 'Micro', smallBlind: 1, bigBlind: 2, minBuyIn: 40 },
  { value: 'low', label: 'Low', smallBlind: 5, bigBlind: 10, minBuyIn: 200 },
  { value: 'medium', label: 'Medium', smallBlind: 10, bigBlind: 20, minBuyIn: 400 },
  { value: 'high', label: 'High', smallBlind: 25, bigBlind: 50, minBuyIn: 1000 },
];

export default function MultiplayerLobbyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [gameMode, setGameMode] = useState<GameMode>('solo');
  const [multiplayerMode, setMultiplayerMode] = useState<MultiplayerMode>('quick');
  const [selectedStakes, setSelectedStakes] = useState(STAKES_OPTIONS[0]);
  const [buyInAmount, setBuyInAmount] = useState(200);
  const [searching, setSearching] = useState(false);
  const [availableTables, setAvailableTables] = useState<Table[]>([]);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const socketManager = getSocketManager(process.env.NEXT_PUBLIC_MULTIPLAYER_SERVER || 'http://localhost:3001');

  // Connect to multiplayer server
  useEffect(() => {
    if (gameMode === 'multiplayer' && !connected) {
      connectToServer();
    }

    return () => {
      if (searching) {
        socketManager.cancelMatchmaking(user?.id || '');
      }
    };
  }, [gameMode]);

  const connectToServer = async () => {
    try {
      await socketManager.connect();
      setConnected(true);
      setConnectionError(null);

      // Listen for match found
      socketManager.onMatchFound((data) => {
        if (data.matched) {
          // Navigate to multiplayer game
          router.push(`/play-multiplayer?tableId=${data.tableId}`);
        } else if (data.searching) {
          setSearching(true);
        }
      });

      // Listen for errors
      socketManager.onError((error) => {
        console.error('Socket error:', error);
        setConnectionError(error.message);
      });

      // Get available tables if browsing
      if (multiplayerMode === 'browse') {
        refreshTables();
      }
    } catch (error) {
      console.error('Failed to connect:', error);
      setConnectionError('Unable to connect to multiplayer server');
      setConnected(false);
    }
  };

  const refreshTables = () => {
    socketManager.getTables((tables) => {
      setAvailableTables(tables);
    });
  };

  const handleQuickMatch = () => {
    if (!user) return;

    if (user.totalChips < buyInAmount) {
      alert(`You need at least ${buyInAmount} chips to play.`);
      return;
    }

    setSearching(true);

    socketManager.findMatch({
      playerId: user.id,
      username: user.username,
      gameType: 'cash',
      stakes: selectedStakes.value as any,
      buyIn: buyInAmount,
    });
  };

  const handleCancelSearch = () => {
    if (user) {
      socketManager.cancelMatchmaking(user.id);
      setSearching(false);
    }
  };

  const handleJoinTable = (tableId: string) => {
    if (!user) return;

    const table = availableTables.find(t => t.id === tableId);
    if (!table) return;

    if (user.totalChips < table.minBuyIn) {
      alert(`You need at least ${table.minBuyIn} chips to join this table.`);
      return;
    }

    socketManager.joinTable({
      tableId,
      playerId: user.id,
      username: user.username,
      buyIn: Math.max(buyInAmount, table.minBuyIn),
    });

    router.push(`/play-multiplayer?tableId=${tableId}`);
  };

  const handleSoloPlay = () => {
    // Redirect to original lobby for solo play
    router.push('/lobby');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-poker-green to-green-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white">Game Lobby</h1>
          <div className="bg-gray-800 rounded-full px-6 py-2">
            <span className="text-yellow-400 font-bold">💰 {user?.totalChips || 0}</span>
          </div>
        </div>

        {/* Game Mode Selection */}
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setGameMode('solo')}
            className={`p-6 rounded-xl font-bold text-lg transition ${
              gameMode === 'solo'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            🤖 Solo vs AI
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setGameMode('multiplayer')}
            className={`p-6 rounded-xl font-bold text-lg transition ${
              gameMode === 'multiplayer'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            👥 Multiplayer
          </motion.button>
        </div>

        {/* Solo Mode */}
        {gameMode === 'solo' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <p className="text-white text-xl mb-6">
                Play against AI opponents and improve your skills
              </p>
              <button
                onClick={handleSoloPlay}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-yellow-600 transition"
              >
                Continue to Solo Lobby →
              </button>
            </div>
          </motion.div>
        )}

        {/* Multiplayer Mode */}
        {gameMode === 'multiplayer' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Connection Status */}
            {!connected && (
              <div className="bg-yellow-500 text-gray-900 rounded-xl p-4 mb-6 text-center">
                {connectionError ? (
                  <>
                    <p className="font-bold">⚠️ {connectionError}</p>
                    <button
                      onClick={connectToServer}
                      className="mt-2 bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800"
                    >
                      Retry Connection
                    </button>
                  </>
                ) : (
                  <p className="font-bold">🔄 Connecting to multiplayer server...</p>
                )}
              </div>
            )}

            {connected && (
              <>
                {/* Multiplayer Mode Selection */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => setMultiplayerMode('quick')}
                    className={`p-4 rounded-xl font-semibold transition ${
                      multiplayerMode === 'quick'
                        ? 'bg-green-700 text-white'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    ⚡ Quick Match
                  </button>
                  <button
                    onClick={() => {
                      setMultiplayerMode('browse');
                      refreshTables();
                    }}
                    className={`p-4 rounded-xl font-semibold transition ${
                      multiplayerMode === 'browse'
                        ? 'bg-green-700 text-white'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    📋 Browse Tables
                  </button>
                </div>

                {/* Quick Match */}
                {multiplayerMode === 'quick' && (
                  <div className="bg-gray-800 rounded-xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Quick Match</h2>

                    {!searching ? (
                      <>
                        {/* Stakes Selection */}
                        <div className="mb-6">
                          <label className="block text-white font-semibold mb-3">Stakes</label>
                          <div className="grid grid-cols-4 gap-3">
                            {STAKES_OPTIONS.map((stakes) => (
                              <button
                                key={stakes.value}
                                onClick={() => {
                                  setSelectedStakes(stakes);
                                  setBuyInAmount(stakes.minBuyIn);
                                }}
                                className={`p-4 rounded-lg font-semibold transition ${
                                  selectedStakes.value === stakes.value
                                    ? 'bg-green-700 text-white'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                                }`}
                              >
                                <div className="text-sm">{stakes.label}</div>
                                <div className="text-xs opacity-75">
                                  {stakes.smallBlind}/{stakes.bigBlind}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Buy-in Amount */}
                        <div className="mb-6">
                          <label className="block text-white font-semibold mb-3">
                            Buy-in: {buyInAmount} chips
                          </label>
                          <input
                            type="range"
                            min={selectedStakes.minBuyIn}
                            max={selectedStakes.minBuyIn * 5}
                            step={selectedStakes.minBuyIn}
                            value={buyInAmount}
                            onChange={(e) => setBuyInAmount(parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-400 mt-2">
                            <span>Min: {selectedStakes.minBuyIn}</span>
                            <span>Max: {selectedStakes.minBuyIn * 5}</span>
                          </div>
                        </div>

                        {/* Find Match Button */}
                        <button
                          onClick={handleQuickMatch}
                          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 py-4 rounded-xl font-bold text-xl hover:from-yellow-500 hover:to-yellow-600 transition"
                        >
                          Find Match
                        </button>
                      </>
                    ) : (
                      /* Searching Animation */
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4 animate-bounce">🔍</div>
                        <h3 className="text-2xl font-bold text-white mb-2">Searching for players...</h3>
                        <p className="text-gray-400 mb-6">
                          Stakes: {selectedStakes.label} | Buy-in: {buyInAmount}
                        </p>
                        <button
                          onClick={handleCancelSearch}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                          Cancel Search
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Browse Tables */}
                {multiplayerMode === 'browse' && (
                  <div className="bg-gray-800 rounded-xl p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-white">Available Tables</h2>
                      <button
                        onClick={refreshTables}
                        className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        🔄 Refresh
                      </button>
                    </div>

                    {availableTables.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No tables available</p>
                        <p className="text-gray-500 text-sm mt-2">Try Quick Match instead!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {availableTables.map((table) => (
                          <div
                            key={table.id}
                            className="bg-gray-700 rounded-lg p-6 flex justify-between items-center"
                          >
                            <div>
                              <h3 className="text-white font-bold text-lg">{table.name}</h3>
                              <p className="text-gray-400 text-sm">
                                Blinds: {table.smallBlind}/{table.bigBlind} |
                                Players: {table.players.length}/{table.maxPlayers} |
                                Buy-in: {table.minBuyIn}-{table.maxBuyIn}
                              </p>
                            </div>
                            <button
                              onClick={() => handleJoinTable(table.id)}
                              disabled={table.players.length >= table.maxPlayers}
                              className={`px-6 py-3 rounded-lg font-bold transition ${
                                table.players.length >= table.maxPlayers
                                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                  : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                              }`}
                            >
                              {table.players.length >= table.maxPlayers ? 'Full' : 'Join Table'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
