'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Player, PlayerStatus } from '@pokermind/poker-engine';
import Card from './Card';

interface PlayerSeatProps {
  player: Player;
  isActive: boolean;
  isHuman: boolean;
  showCards?: boolean;
}

/**
 * Composant pour afficher un siège de joueur
 */
export default function PlayerSeat({ player, isActive, isHuman, showCards = false }: PlayerSeatProps) {
  const getStatusBadge = () => {
    switch (player.status) {
      case PlayerStatus.FOLDED:
        return <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">Fold</div>;
      case PlayerStatus.ALL_IN:
        return <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">All-In</div>;
      default:
        return null;
    }
  };

  const displayCards = isHuman || showCards;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      {/* Container du joueur */}
      <div
        className={`
          relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-3 min-w-[160px]
          transition-all duration-300 border-2
          ${isActive ? 'border-yellow-400 shadow-xl shadow-yellow-400/50' : 'border-gray-600'}
          ${player.status === PlayerStatus.FOLDED ? 'opacity-50' : 'opacity-100'}
        `}
      >
        {/* Status badge */}
        {getStatusBadge()}

        {/* Dealer button */}
        {player.isDealer && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-yellow-400 shadow-lg">
            D
          </div>
        )}

        {/* Avatar & Name */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold">
            {player.name[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm truncate">{player.name}</p>
            {player.aiPersonality && (
              <p className="text-gray-400 text-xs capitalize">{player.aiPersonality.replace('_', ' ')}</p>
            )}
          </div>
        </div>

        {/* Stack */}
        <div className="bg-gray-700 rounded-lg px-3 py-1 mb-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">Stack:</span>
            <span className="text-yellow-400 font-bold text-sm">
              {player.stack.toLocaleString()} chips
            </span>
          </div>
        </div>

        {/* Current bet */}
        {player.currentBet > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-green-600 rounded-lg px-3 py-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-white text-xs">Bet:</span>
              <span className="text-white font-bold text-sm">
                {player.currentBet.toLocaleString()}
              </span>
            </div>
          </motion.div>
        )}

        {/* Cards */}
        {player.holeCards.length > 0 && player.status !== PlayerStatus.FOLDED && (
          <div className="flex justify-center space-x-1 mt-2">
            <Card
              card={displayCards ? player.holeCards[0] : null}
              faceDown={!displayCards}
              className="scale-75"
              delay={0.1}
            />
            <Card
              card={displayCards ? player.holeCards[1] : null}
              faceDown={!displayCards}
              className="scale-75"
              delay={0.2}
            />
          </div>
        )}

        {/* Active indicator glow */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl border-2 border-yellow-400 animate-pulse"
              style={{ pointerEvents: 'none' }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
