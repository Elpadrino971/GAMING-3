'use client';

import { motion } from 'framer-motion';
import { Card as CardType } from '@pokermind/poker-engine';

interface CardProps {
  card: CardType | null;
  faceDown?: boolean;
  className?: string;
  delay?: number;
}

/**
 * Composant pour afficher une carte de poker
 */
export default function Card({ card, faceDown = false, className = '', delay = 0 }: CardProps) {
  if (!card && !faceDown) return null;

  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case 'h': return '♥';
      case 'd': return '♦';
      case 'c': return '♣';
      case 's': return '♠';
      default: return '';
    }
  };

  const getSuitColor = (suit: string) => {
    return suit === 'h' || suit === 'd' ? 'text-red-600' : 'text-gray-900';
  };

  const getRankDisplay = (rank: string) => {
    return rank === 'T' ? '10' : rank;
  };

  return (
    <motion.div
      initial={{ scale: 0, rotateY: 180 }}
      animate={{ scale: 1, rotateY: faceDown ? 180 : 0 }}
      transition={{ duration: 0.3, delay }}
      className={`relative ${className}`}
    >
      <div className="w-16 h-24 rounded-lg shadow-xl">
        {faceDown || !card ? (
          // Dos de carte
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg border-2 border-blue-400 flex items-center justify-center">
            <div className="text-blue-300 text-4xl">🂠</div>
          </div>
        ) : (
          // Face de carte
          <div className="w-full h-full bg-white rounded-lg border-2 border-gray-300 p-2 flex flex-col">
            {/* Rank en haut à gauche */}
            <div className={`text-2xl font-bold leading-none ${getSuitColor(card.suit)}`}>
              {getRankDisplay(card.rank)}
            </div>

            {/* Symbole au centre */}
            <div className={`flex-1 flex items-center justify-center text-5xl ${getSuitColor(card.suit)}`}>
              {getSuitSymbol(card.suit)}
            </div>

            {/* Rank en bas à droite (inversé) */}
            <div className={`text-2xl font-bold leading-none text-right transform rotate-180 ${getSuitColor(card.suit)}`}>
              {getRankDisplay(card.rank)}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
