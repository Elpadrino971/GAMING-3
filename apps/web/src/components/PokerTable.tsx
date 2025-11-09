'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Card {
  rank: string;
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
}

interface Player {
  id: string;
  name: string;
  chips: number;
  position: number;
  cards?: Card[];
  isActive: boolean;
  currentBet: number;
}

interface PokerTableProps {
  players: Player[];
  communityCards: Card[];
  pot: number;
  currentPlayer?: string;
  onAction?: (action: string, amount?: number) => void;
}

export default function PokerTable({
  players,
  communityCards,
  pot,
  currentPlayer,
  onAction
}: PokerTableProps) {
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [betAmount, setBetAmount] = useState<number>(0);

  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case 'hearts':
        return '♥';
      case 'diamonds':
        return '♦';
      case 'clubs':
        return '♣';
      case 'spades':
        return '♠';
      default:
        return '';
    }
  };

  const getSuitClass = (suit: string) => {
    return suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-gray-900';
  };

  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action, action === 'bet' || action === 'raise' ? betAmount : undefined);
    }
    setSelectedAction('');
    setBetAmount(0);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Table */}
      <div className="poker-table aspect-[2/1] p-8">
        {/* Pot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white/90 rounded-lg px-6 py-3 shadow-xl">
            <p className="text-sm text-gray-600 text-center">Pot</p>
            <p className="text-2xl font-bold text-gray-900 text-center">
              ${pot.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Community Cards */}
        {communityCards.length > 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-24">
            <div className="flex space-x-2">
              {communityCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`card ${getSuitClass(card.suit)}`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold">{card.rank}</div>
                    <div className="text-3xl">{getSuitSymbol(card.suit)}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Players */}
        {players.map((player, index) => {
          const totalPlayers = players.length;
          const angle = (index / totalPlayers) * 2 * Math.PI - Math.PI / 2;
          const radiusX = 45; // percentage
          const radiusY = 35; // percentage
          const x = 50 + radiusX * Math.cos(angle);
          const y = 50 + radiusY * Math.sin(angle);

          return (
            <div
              key={player.id}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div
                className={`bg-white rounded-lg p-3 shadow-lg min-w-[120px] ${
                  currentPlayer === player.id ? 'ring-4 ring-poker-gold' : ''
                }`}
              >
                <p className="text-sm font-bold text-gray-900">{player.name}</p>
                <p className="text-xs text-gray-600">${player.chips.toLocaleString()}</p>
                {player.currentBet > 0 && (
                  <p className="text-xs text-green-600 font-medium">
                    Bet: ${player.currentBet}
                  </p>
                )}

                {/* Player Cards */}
                {player.cards && (
                  <div className="flex space-x-1 mt-2">
                    {player.cards.map((card, cardIndex) => (
                      <div
                        key={cardIndex}
                        className={`card scale-75 ${getSuitClass(card.suit)}`}
                      >
                        <div className="text-center">
                          <div className="text-lg font-bold">{card.rank}</div>
                          <div className="text-xl">{getSuitSymbol(card.suit)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => handleAction('fold')}
          className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
        >
          Fold
        </button>
        <button
          onClick={() => handleAction('check')}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors"
        >
          Check
        </button>
        <button
          onClick={() => handleAction('call')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          Call
        </button>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-32 px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
            placeholder="Montant"
          />
          <button
            onClick={() => handleAction('raise')}
            className="px-6 py-3 bg-poker-gold text-gray-900 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
          >
            Raise
          </button>
        </div>
      </div>
    </div>
  );
}
