'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GameState, PlayerAction, GameStateUtils } from '@pokermind/poker-engine';

interface ActionButtonsProps {
  gameState: GameState;
  playerId: string;
  onAction: (action: PlayerAction, amount?: number) => void;
}

/**
 * Boutons d'action pour le joueur humain
 */
export default function ActionButtons({ gameState, playerId, onAction }: ActionButtonsProps) {
  const [raiseAmount, setRaiseAmount] = useState(0);
  const [showRaiseSlider, setShowRaiseSlider] = useState(false);

  const options = GameStateUtils.getActionOptions(gameState, playerId);
  const player = gameState.players.find(p => p.id === playerId);

  if (!player || !options) return null;

  const handleRaise = () => {
    if (showRaiseSlider) {
      // Confirmer le raise
      const totalRaise = gameState.currentBet + raiseAmount;
      onAction(PlayerAction.RAISE, totalRaise);
      setShowRaiseSlider(false);
      setRaiseAmount(0);
    } else {
      // Afficher le slider
      setRaiseAmount(options.minRaise);
      setShowRaiseSlider(true);
    }
  };

  const quickRaises = [
    { label: '2x Pot', multiplier: 2 },
    { label: '3x Pot', multiplier: 3 },
    { label: 'Pot', multiplier: 1 },
  ];

  const pot = GameStateUtils.getTotalPot(gameState);

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Raise slider */}
      {showRaiseSlider && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-gray-700 min-w-[400px]"
        >
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Raise Amount:</span>
              <span className="text-yellow-400 font-bold">
                {(gameState.currentBet + raiseAmount).toLocaleString()} chips
              </span>
            </div>

            <input
              type="range"
              min={options.minRaise}
              max={options.maxRaise}
              step={gameState.bigBlind}
              value={raiseAmount}
              onChange={(e) => setRaiseAmount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
            />

            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min: {options.minRaise}</span>
              <span>Max: {options.maxRaise}</span>
            </div>
          </div>

          {/* Quick raise buttons */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {quickRaises.map((quick) => {
              const quickAmount = Math.min(pot * quick.multiplier, options.maxRaise);
              return (
                <button
                  key={quick.label}
                  onClick={() => setRaiseAmount(Math.floor(quickAmount))}
                  className="bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 rounded-lg transition"
                >
                  {quick.label}
                </button>
              );
            })}
          </div>

          {/* Confirm/Cancel */}
          <div className="flex space-x-2">
            <button
              onClick={() => setShowRaiseSlider(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleRaise}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 rounded-lg transition shadow-lg"
            >
              Confirm Raise
            </button>
          </div>
        </motion.div>
      )}

      {/* Main action buttons */}
      <div className="flex space-x-3">
        {/* Fold */}
        {options.canFold && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction(PlayerAction.FOLD)}
            className="bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold px-8 py-4 rounded-xl shadow-xl transition border-2 border-red-400"
          >
            <div className="text-center">
              <div className="text-xl">FOLD</div>
            </div>
          </motion.button>
        )}

        {/* Check */}
        {options.canCheck && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction(PlayerAction.CHECK)}
            className="bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-xl shadow-xl transition border-2 border-blue-400"
          >
            <div className="text-center">
              <div className="text-xl">CHECK</div>
            </div>
          </motion.button>
        )}

        {/* Call */}
        {options.canCall && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction(PlayerAction.CALL, options.callAmount)}
            className="bg-gradient-to-br from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-bold px-8 py-4 rounded-xl shadow-xl transition border-2 border-yellow-400"
          >
            <div className="text-center">
              <div className="text-xl">CALL</div>
              <div className="text-sm opacity-90">{options.callAmount.toLocaleString()}</div>
            </div>
          </motion.button>
        )}

        {/* Raise */}
        {options.canRaise && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRaise}
            className="bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold px-8 py-4 rounded-xl shadow-xl transition border-2 border-green-400"
          >
            <div className="text-center">
              <div className="text-xl">RAISE</div>
              <div className="text-sm opacity-90">
                {showRaiseSlider ? '▼' : `Min: ${options.minRaise}`}
              </div>
            </div>
          </motion.button>
        )}

        {/* All-In */}
        {options.canAllIn && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction(PlayerAction.ALL_IN)}
            className="bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-bold px-8 py-4 rounded-xl shadow-xl transition border-2 border-purple-400"
          >
            <div className="text-center">
              <div className="text-xl">ALL-IN</div>
              <div className="text-sm opacity-90">{player.stack.toLocaleString()}</div>
            </div>
          </motion.button>
        )}
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="text-gray-400 text-xs text-center bg-gray-900/50 px-4 py-2 rounded-lg">
        Shortcuts: F = Fold | C = Check/Call | R = Raise | A = All-In
      </div>
    </div>
  );
}
