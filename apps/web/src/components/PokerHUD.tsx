'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PlayerHUDStats {
  playerId: string;
  username: string;
  position: number; // 0-8 for 9-max table
  vpip?: number;
  pfr?: number;
  aggression?: number;
  hands?: number;
  note?: string;
  color?: string;
}

interface PokerHUDProps {
  players: PlayerHUDStats[];
  pot: number;
  yourStack: number;
  bigBlind: number;
  potOdds?: number;
  showStats?: boolean;
  showNotes?: boolean;
  showPotOdds?: boolean;
  compactMode?: boolean;
}

export default function PokerHUD({
  players,
  pot,
  yourStack,
  bigBlind,
  potOdds,
  showStats = true,
  showNotes = true,
  showPotOdds = true,
  compactMode = false,
}: PokerHUDProps) {
  const getPositionStyle = (position: number) => {
    // Position players around the table (percentage positioning)
    const positions = [
      { top: '70%', left: '50%' }, // 0: Hero (bottom center)
      { top: '60%', left: '75%' }, // 1: Left of hero
      { top: '40%', left: '85%' }, // 2
      { top: '15%', left: '75%' }, // 3
      { top: '5%', left: '50%' }, // 4: Top center
      { top: '15%', left: '25%' }, // 5
      { top: '40%', left: '15%' }, // 6
      { top: '60%', left: '25%' }, // 7: Right of hero
      { top: '70%', left: '35%' }, // 8
    ];

    return positions[position] || positions[0];
  };

  const getStatColor = (value: number | undefined, type: 'vpip' | 'pfr' | 'aggression') => {
    if (!value) return 'text-gray-400';

    if (type === 'vpip') {
      if (value < 20) return 'text-blue-400'; // Tight
      if (value < 30) return 'text-green-400'; // Normal
      if (value < 40) return 'text-yellow-400'; // Loose
      return 'text-red-400'; // Very loose
    }

    if (type === 'pfr') {
      if (value < 15) return 'text-blue-400'; // Passive
      if (value < 25) return 'text-green-400'; // Normal
      return 'text-red-400'; // Aggressive
    }

    if (type === 'aggression') {
      if (value < 2) return 'text-blue-400'; // Passive
      if (value < 3) return 'text-green-400'; // Normal
      if (value < 4) return 'text-yellow-400'; // Aggressive
      return 'text-red-400'; // Very aggressive
    }

    return 'text-gray-400';
  };

  return (
    <div className="relative w-full h-full">
      {/* Player HUD Overlays */}
      {players.map((player) => {
        const posStyle = getPositionStyle(player.position);
        return (
          <motion.div
            key={player.playerId}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: posStyle.top, left: posStyle.left }}
          >
            <div
              className={`bg-gray-900 bg-opacity-90 rounded-lg ${
                compactMode ? 'p-1' : 'p-2'
              } border-2 ${player.color ? '' : 'border-gray-700'} shadow-lg min-w-max`}
              style={{ borderColor: player.color || undefined }}
            >
              {/* Username */}
              <div
                className={`text-white font-bold text-center mb-1 ${
                  compactMode ? 'text-xs' : 'text-sm'
                }`}
              >
                {player.username}
              </div>

              {/* Stats */}
              {showStats && player.hands && player.hands > 10 && (
                <div
                  className={`flex ${
                    compactMode ? 'space-x-1' : 'space-x-2'
                  } justify-center mb-1`}
                >
                  <div className="text-center">
                    <div className="text-gray-400 text-xs">VPIP</div>
                    <div
                      className={`font-bold ${
                        compactMode ? 'text-xs' : 'text-sm'
                      } ${getStatColor(player.vpip, 'vpip')}`}
                    >
                      {player.vpip || '-'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-xs">PFR</div>
                    <div
                      className={`font-bold ${
                        compactMode ? 'text-xs' : 'text-sm'
                      } ${getStatColor(player.pfr, 'pfr')}`}
                    >
                      {player.pfr || '-'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-xs">AGG</div>
                    <div
                      className={`font-bold ${
                        compactMode ? 'text-xs' : 'text-sm'
                      } ${getStatColor(player.aggression, 'aggression')}`}
                    >
                      {player.aggression?.toFixed(1) || '-'}
                    </div>
                  </div>
                </div>
              )}

              {/* Hands Sample */}
              {showStats && player.hands && (
                <div className="text-gray-400 text-xs text-center mb-1">
                  {player.hands} mains
                </div>
              )}

              {/* Note */}
              {showNotes && player.note && !compactMode && (
                <div className="bg-yellow-900 bg-opacity-50 rounded px-2 py-1 max-w-xs">
                  <p className="text-yellow-200 text-xs line-clamp-2">{player.note}</p>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Pot Display */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold shadow-lg">
          POT: {pot.toLocaleString()}
        </div>
      </motion.div>

      {/* Pot Odds Display */}
      {showPotOdds && potOdds && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-1/2 left-4"
        >
          <div className="bg-gray-900 bg-opacity-90 rounded-lg p-3 border-2 border-purple-500 shadow-lg">
            <div className="text-gray-400 text-xs mb-1">Pot Odds</div>
            <div className="text-purple-400 font-bold text-lg">{potOdds.toFixed(1)}%</div>
          </div>
        </motion.div>
      )}

      {/* Your Stack Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-4 right-4"
      >
        <div className="bg-gray-900 bg-opacity-90 rounded-lg p-3 border-2 border-green-500 shadow-lg">
          <div className="text-gray-400 text-xs mb-1">Votre Stack</div>
          <div className="text-green-400 font-bold text-lg">{yourStack.toLocaleString()}</div>
          <div className="text-gray-400 text-xs">{(yourStack / bigBlind).toFixed(1)} BB</div>
        </div>
      </motion.div>
    </div>
  );
}
