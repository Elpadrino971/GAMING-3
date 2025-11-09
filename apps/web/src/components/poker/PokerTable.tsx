'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, PlayerAction, Player, GameStateUtils } from '@pokermind/poker-engine';
import PlayerSeat from './PlayerSeat';
import Card from './Card';
import ActionButtons from './ActionButtons';

interface PokerTableProps {
  gameState: GameState;
  onAction: (action: PlayerAction, amount?: number) => void;
  userId: string;
}

/**
 * Composant principal de la table de poker
 */
export default function PokerTable({ gameState, onAction, userId }: PokerTableProps) {
  const [showdown, setShowdown] = useState(false);

  useEffect(() => {
    if (gameState.winners && gameState.winners.length > 0) {
      setShowdown(true);
      setTimeout(() => setShowdown(false), 5000);
    }
  }, [gameState.winners]);

  const humanPlayer = gameState.players.find(p => p.id === userId);
  const aiPlayers = gameState.players.filter(p => p.id !== userId);
  const activePlayer = GameStateUtils.getActivePlayer(gameState);
  const totalPot = GameStateUtils.getTotalPot(gameState);
  const isHumanTurn = activePlayer?.id === userId;

  // Positions des joueurs autour de la table
  const getPlayerPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radius = 200;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-green-800 via-green-700 to-green-900 flex items-center justify-center overflow-hidden">
      {/* Table background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Poker table */}
      <div className="relative">
        {/* Felt (tapis vert) */}
        <div className="w-[800px] h-[500px] bg-gradient-to-br from-green-600 to-green-800 rounded-[250px] border-[12px] border-amber-900 shadow-2xl relative">
          {/* Inner felt line */}
          <div className="absolute inset-4 border-2 border-green-500/30 rounded-[240px]" />

          {/* Logo au centre */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-700/20 font-bold text-6xl">
            POKERMIND
          </div>

          {/* Community cards */}
          {gameState.communityCards.length > 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-2 mt-12">
              {gameState.communityCards.map((card, index) => (
                <Card
                  key={index}
                  card={card}
                  faceDown={false}
                  delay={index * 0.1}
                />
              ))}
            </div>
          )}

          {/* Pot display */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-16"
          >
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900 font-bold px-6 py-3 rounded-full shadow-xl border-4 border-yellow-300">
              <div className="text-center">
                <div className="text-xs opacity-80">POT</div>
                <div className="text-2xl">{totalPot.toLocaleString()}</div>
              </div>
            </div>
          </motion.div>

          {/* Players */}
          <div className="absolute inset-0">
            {/* Human player (bottom center) */}
            {humanPlayer && (
              <div className="absolute bottom-[-80px] left-1/2 transform -translate-x-1/2">
                <PlayerSeat
                  player={humanPlayer}
                  isActive={activePlayer?.id === humanPlayer.id}
                  isHuman={true}
                  showCards={true}
                />
              </div>
            )}

            {/* AI players */}
            {aiPlayers.map((player, index) => {
              const pos = getPlayerPosition(index, aiPlayers.length);
              return (
                <div
                  key={player.id}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${pos.x}px)`,
                    top: `calc(50% + ${pos.y}px)`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <PlayerSeat
                    player={player}
                    isActive={activePlayer?.id === player.id}
                    isHuman={false}
                    showCards={showdown}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons (bottom) */}
        {isHumanTurn && humanPlayer && (
          <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2">
            <ActionButtons
              gameState={gameState}
              playerId={userId}
              onAction={onAction}
            />
          </div>
        )}

        {/* Game info (top right) */}
        <div className="absolute -top-4 -right-4 bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 min-w-[200px] shadow-xl border border-gray-700">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Hand #:</span>
              <span className="text-white font-bold">{gameState.handNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Blinds:</span>
              <span className="text-yellow-400 font-bold">
                {gameState.smallBlind}/{gameState.bigBlind}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Street:</span>
              <span className="text-blue-400 font-bold capitalize">
                {gameState.currentStreet.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Winner announcement */}
        <AnimatePresence>
          {gameState.winners && gameState.winners.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-4"
            >
              <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-gray-900 font-bold px-8 py-4 rounded-2xl shadow-2xl border-4 border-yellow-300">
                <div className="text-center">
                  <div className="text-2xl mb-1">🏆 {gameState.winners[0].playerName} Wins!</div>
                  <div className="text-xl">{gameState.winners[0].amount.toLocaleString()} chips</div>
                  <div className="text-sm opacity-80 mt-1">{gameState.winners[0].handRank}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Waiting for action indicator */}
      {!isHumanTurn && activePlayer && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            <span className="font-semibold">Waiting for {activePlayer.name}...</span>
          </div>
        </div>
      )}
    </div>
  );
}
