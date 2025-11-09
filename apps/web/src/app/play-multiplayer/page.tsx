'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getSocketManager } from '@pokermind/multiplayer';
import MultiplayerTable from '@/components/poker/MultiplayerTable';
import WinnerCelebration from '@/components/poker/WinnerCelebration';
import TableLoadingAnimation from '@/components/poker/TableLoadingAnimation';
import ActionButtons from '@/components/poker/ActionButtons';
import { PlayerAction } from '@pokermind/poker-engine/src/game-state';

// Disable static generation
export const dynamic = 'force-dynamic';

export default function PlayMultiplayerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const tableId = searchParams.get('tableId');

  const [gameState, setGameState] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [winners, setWinners] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');

  const socketManager = getSocketManager(process.env.NEXT_PUBLIC_MULTIPLAYER_SERVER || 'http://localhost:3001');

  useEffect(() => {
    if (!tableId || !user) {
      router.push('/multiplayer-lobby');
      return;
    }

    setupMultiplayer();

    return () => {
      // Leave table on unmount
      if (user) {
        socketManager.leaveTable(user.id);
      }
    };
  }, [tableId, user]);

  const setupMultiplayer = async () => {
    try {
      // Connect if not already connected
      if (!socketManager.isConnected()) {
        await socketManager.connect();
      }

      setConnected(true);

      // Listen for game state updates
      socketManager.onGameStateUpdate((newGameState) => {
        console.log('Game state updated:', newGameState);
        setGameState(newGameState);
        setPlayers(newGameState.players || []);

        // Check for winners
        if (newGameState.winners && newGameState.winners.length > 0) {
          setWinners(newGameState.winners);
          setShowWinner(true);
        }
      });

      // Listen for hand complete
      socketManager.onHandComplete((data) => {
        console.log('Hand complete:', data);
        setWinners(data.winners);
        setShowWinner(true);
      });

      // Listen for player joined
      socketManager.onPlayerJoined((data) => {
        console.log('Player joined:', data.username);
        setChatMessages(prev => [...prev, {
          type: 'system',
          message: `${data.username} joined the table`,
          timestamp: Date.now(),
        }]);
      });

      // Listen for player left
      socketManager.onPlayerLeft((data) => {
        console.log('Player left:', data.playerId);
        setChatMessages(prev => [...prev, {
          type: 'system',
          message: 'A player left the table',
          timestamp: Date.now(),
        }]);
      });

      // Listen for chat messages
      socketManager.onNewMessage((data) => {
        setChatMessages(prev => [...prev, {
          type: 'chat',
          username: data.username,
          message: data.message,
          timestamp: data.timestamp,
        }]);
      });

      // Listen for game started
      socketManager.onGameStarted((data) => {
        console.log('Game started:', data);
        setGameState(data.gameState);
      });

    } catch (error) {
      console.error('Failed to setup multiplayer:', error);
      alert('Failed to connect to multiplayer server');
      router.push('/multiplayer-lobby');
    }
  };

  const handlePlayerAction = (action: 'fold' | 'check' | 'call' | 'raise', amount?: number) => {
    if (!user || !tableId) return;

    socketManager.sendAction({
      tableId,
      playerId: user.id,
      action,
      amount,
    });
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !user || !tableId) return;

    socketManager.sendMessage(tableId, user.id, chatInput);
    setChatInput('');
  };

  const handleLeaveTable = () => {
    if (confirm('Are you sure you want to leave the table?')) {
      if (user) {
        socketManager.leaveTable(user.id);
      }
      router.push('/multiplayer-lobby');
    }
  };

  const handleNextHand = () => {
    setShowWinner(false);
    setWinners([]);
  };

  if (!connected || !gameState) {
    return <TableLoadingAnimation />;
  }

  const humanPlayer = players.find(p => p.id === user?.id);
  const isHumanTurn = gameState.players[gameState.activePlayerIndex]?.id === user?.id;

  // Get action options
  const actionOptions = {
    canCheck: gameState.currentBet === humanPlayer?.bet,
    canCall: gameState.currentBet > humanPlayer?.bet,
    canRaise: humanPlayer?.stack > (gameState.currentBet - humanPlayer?.bet),
    canFold: true,
    callAmount: gameState.currentBet - (humanPlayer?.bet || 0),
    minRaise: gameState.minRaise,
    maxRaise: humanPlayer?.stack || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleLeaveTable}
            className="text-yellow-400 hover:text-yellow-300 font-semibold"
          >
            ← Leave Table
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Multiplayer Table</h1>
            <p className="text-gray-400 text-sm">
              🟢 {players.length} players online
            </p>
          </div>
          <div className="bg-gray-800 rounded-full px-6 py-2">
            <span className="text-yellow-400 font-bold">💰 {humanPlayer?.stack || 0}</span>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-4 gap-4">
          {/* Poker Table (3 columns) */}
          <div className="col-span-3">
            <MultiplayerTable
              players={players}
              communityCards={gameState.communityCards || []}
              pot={gameState.pots?.reduce((sum: number, pot: any) => sum + pot.amount, 0) || 0}
              dealerPosition={gameState.dealerPosition}
              activePlayerIndex={gameState.activePlayerIndex}
              humanPlayerId={user?.id || ''}
            />

            {/* Action Buttons */}
            {isHumanTurn && !showWinner && (
              <div className="mt-4">
                <ActionButtons
                  options={actionOptions}
                  onAction={handlePlayerAction}
                  pot={gameState.pots?.reduce((sum: number, pot: any) => sum + pot.amount, 0) || 0}
                />
              </div>
            )}
          </div>

          {/* Chat Sidebar (1 column) */}
          <div className="col-span-1 bg-gray-800 rounded-xl p-4 flex flex-col h-[700px]">
            <h3 className="text-white font-bold mb-4">💬 Chat</h3>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`text-sm ${msg.type === 'system' ? 'text-gray-400 italic' : 'text-white'}`}>
                  {msg.type === 'system' ? (
                    <span>{msg.message}</span>
                  ) : (
                    <>
                      <span className="font-bold text-yellow-400">{msg.username}:</span>
                      <span className="ml-2">{msg.message}</span>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                onClick={handleSendMessage}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-semibold transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Winner Celebration */}
        {showWinner && winners.length > 0 && (
          <WinnerCelebration
            winner={{
              playerName: winners[0].playerName,
              amount: winners[0].amount,
              handRank: winners[0].handRank,
            }}
            onComplete={handleNextHand}
          />
        )}
      </div>
    </div>
  );
}
