'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCard from './AnimatedCard';
import ChipStack from './ChipStack';
import PlayerActionIndicator from './PlayerActionIndicator';

interface MultiplayerTableProps {
  players: any[];
  communityCards: any[];
  pot: number;
  dealerPosition: number;
  activePlayerIndex: number;
  humanPlayerId: string;
}

export default function MultiplayerTable({
  players,
  communityCards,
  pot,
  dealerPosition,
  activePlayerIndex,
  humanPlayerId,
}: MultiplayerTableProps) {
  // Calculate player positions around the table
  const getPlayerPosition = (playerIndex: number) => {
    const totalPlayers = players.length;

    // Find the human player's position
    const humanPlayerPos = players.findIndex(p => p.id === humanPlayerId);

    // Calculate relative position (human is always at bottom)
    let relativePosition = playerIndex - humanPlayerPos;
    if (relativePosition < 0) relativePosition += totalPlayers;

    // Position mapping for different player counts
    const positionMap: Record<number, any> = {
      2: [
        { bottom: -100, left: '50%', transform: 'translateX(-50%)' }, // Human (you)
        { top: -100, left: '50%', transform: 'translateX(-50%)' },    // Opponent
      ],
      3: [
        { bottom: -100, left: '50%', transform: 'translateX(-50%)' }, // Human
        { top: -50, left: '10%' },                                     // Left opponent
        { top: -50, right: '10%' },                                    // Right opponent
      ],
      4: [
        { bottom: -100, left: '50%', transform: 'translateX(-50%)' }, // Human
        { top: '20%', left: -150 },                                    // Left opponent
        { top: -100, left: '50%', transform: 'translateX(-50%)' },    // Top opponent
        { top: '20%', right: -150 },                                   // Right opponent
      ],
      5: [
        { bottom: -100, left: '50%', transform: 'translateX(-50%)' }, // Human
        { bottom: -50, left: -100 },                                   // Bottom-left
        { top: -50, left: -100 },                                      // Top-left
        { top: -100, left: '50%', transform: 'translateX(-50%)' },    // Top
        { top: -50, right: -100 },                                     // Top-right
      ],
      6: [
        { bottom: -100, left: '50%', transform: 'translateX(-50%)' }, // Human
        { bottom: -50, left: -100 },                                   // Bottom-left
        { top: '10%', left: -150 },                                    // Middle-left
        { top: -100, left: '50%', transform: 'translateX(-50%)' },    // Top
        { top: '10%', right: -150 },                                   // Middle-right
        { bottom: -50, right: -100 },                                  // Bottom-right
      ],
    };

    const positions = positionMap[totalPlayers] || positionMap[6];
    return positions[relativePosition] || positions[0];
  };

  // Get card suit symbol
  const getCardSuitSymbol = (suitLetter: string) => {
    const suitMap: Record<string, string> = {
      h: '♥', d: '♦', c: '♣', s: '♠',
      hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠',
    };
    return suitMap[suitLetter] || suitLetter;
  };

  return (
    <div className="relative w-full h-[700px] flex items-center justify-center">
      {/* Poker Table */}
      <div className="relative w-[900px] h-[550px]">
        {/* Table felt */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-800 to-green-900 rounded-[250px] border-[16px] border-amber-900 shadow-2xl"
        >
          {/* Inner felt line */}
          <div className="absolute inset-6 border-4 border-green-600/30 rounded-[230px]" />

          {/* Table logo/text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600/10 font-bold text-8xl pointer-events-none select-none">
            ♠ ♥ ♦ ♣
          </div>
        </motion.div>

        {/* Community Cards */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-4 z-10">
          <div className="flex space-x-3">
            {communityCards.map((card: any, index: number) => (
              <AnimatedCard
                key={index}
                rank={card.rank}
                suit={card.suit}
                faceDown={false}
                delay={index * 0.15}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Pot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-24 z-10">
          <ChipStack amount={pot} color="yellow" animate={true} />
        </div>

        {/* Players */}
        {players.map((player: any, index: number) => {
          const position = getPlayerPosition(index);
          const isActive = index === activePlayerIndex;
          const isDealer = index === dealerPosition;
          const isHuman = player.id === humanPlayerId;
          const isFolded = player.status === 'folded';

          return (
            <motion.div
              key={player.id}
              className="absolute z-20"
              style={position}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: isFolded ? 0.4 : 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Player card */}
              <div
                className={`relative bg-gray-800/95 backdrop-blur-sm rounded-2xl p-4 min-w-[180px] border-4 transition-all ${
                  isActive
                    ? 'border-yellow-400 shadow-[0_0_30px_rgba(251,191,36,0.6)]'
                    : 'border-gray-700'
                }`}
              >
                {/* Dealer button */}
                {isDealer && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 360] }}
                    transition={{ rotate: { duration: 0.5 } }}
                    className="absolute -top-3 -right-3 bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 border-yellow-400 shadow-lg"
                  >
                    D
                  </motion.div>
                )}

                {/* Player info */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {player.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">
                        {player.name} {isHuman && '(You)'}
                      </p>
                      <p className="text-yellow-400 text-xs font-semibold">
                        💰 {player.stack?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Player cards */}
                {player.cards && player.cards.length > 0 && (
                  <div className="flex space-x-2 justify-center mt-3">
                    {player.cards.map((card: any, cardIndex: number) => (
                      <div
                        key={cardIndex}
                        className="transform scale-75 origin-center"
                      >
                        <AnimatedCard
                          rank={card.rank}
                          suit={card.suit}
                          faceDown={!isHuman && !card.revealed}
                          delay={cardIndex * 0.1}
                          index={cardIndex}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Current bet */}
                {player.bet > 0 && (
                  <motion.div
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="absolute -bottom-12 left-1/2 transform -translate-x-1/2"
                  >
                    <ChipStack amount={player.bet} color="blue" animate={true} />
                  </motion.div>
                )}

                {/* Action indicator */}
                {player.lastAction && (
                  <div className="relative">
                    <PlayerActionIndicator
                      action={player.lastAction.action}
                      amount={player.lastAction.amount}
                    />
                  </div>
                )}

                {/* Active player indicator */}
                {isActive && !isFolded && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold"
                  >
                    YOUR TURN
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
