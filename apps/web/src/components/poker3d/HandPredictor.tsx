'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface HandPrediction {
  playerId: string;
  playerName: string;
  predictedRange: string[];
  probability: number;
  confidence: number;
  reasoning: string;
  topHands: { hand: string; probability: number }[];
}

// AI Hand Predictor Engine
export class HandPredictorAI {
  private static instance: HandPredictorAI;

  private constructor() {}

  static getInstance(): HandPredictorAI {
    if (!HandPredictorAI.instance) {
      HandPredictorAI.instance = new HandPredictorAI();
    }
    return HandPredictorAI.instance;
  }

  // Predict opponent's hand based on actions
  predictHand(
    actions: string[],
    position: string,
    boardCards: string[],
    pot: number
  ): HandPrediction {
    // Analyze betting pattern
    const aggression = this.calculateAggression(actions);
    const range = this.estimateRange(actions, position, boardCards);
    const topHands = this.getTopProbableHands(range, boardCards);

    return {
      playerId: 'opp-1',
      playerName: 'Adversaire',
      predictedRange: range,
      probability: this.calculateProbability(range, boardCards),
      confidence: this.calculateConfidence(actions, boardCards),
      reasoning: this.generateReasoning(actions, position, aggression),
      topHands,
    };
  }

  private calculateAggression(actions: string[]): number {
    const aggressive = actions.filter((a) => a === 'raise' || a === 'all-in').length;
    return aggressive / actions.length;
  }

  private estimateRange(actions: string[], position: string, board: string[]): string[] {
    const range: string[] = [];

    // Premium hands always possible
    if (actions.includes('raise') || actions.includes('all-in')) {
      range.push('AA', 'KK', 'QQ', 'JJ', 'AK');
    }

    // Medium hands if calls
    if (actions.includes('call')) {
      range.push('TT', '99', '88', 'AQ', 'AJ', 'KQ');
    }

    // Speculative hands if position good
    if (position === 'button' || position === 'cutoff') {
      range.push('77', '66', '55', 'AT', 'KJ', 'QJ');
    }

    // Draws if board is connected
    if (board.length >= 3) {
      range.push('Flush Draw', 'Straight Draw', 'Combo Draw');
    }

    return range.slice(0, 12);
  }

  private getTopProbableHands(
    range: string[],
    board: string[]
  ): { hand: string; probability: number }[] {
    return range.slice(0, 6).map((hand, i) => ({
      hand,
      probability: 100 - i * 10 - Math.random() * 15,
    })).sort((a, b) => b.probability - a.probability);
  }

  private calculateProbability(range: string[], board: string[]): number {
    // Simplified probability calculation
    const baseProb = 100 / range.length;
    const boardFactor = board.length / 5;
    return Math.min(95, baseProb * (1 + boardFactor));
  }

  private calculateConfidence(actions: string[], board: string[]): number {
    const actionCount = actions.length;
    const boardInfo = board.length / 5;
    return Math.min(95, (actionCount * 15 + boardInfo * 30));
  }

  private generateReasoning(actions: string[], position: string, aggression: number): string {
    const reasons: string[] = [];

    if (aggression > 0.5) {
      reasons.push('Joueur très agressif - probable main forte ou bluff');
    } else {
      reasons.push('Joueur passif - main moyenne ou en attente');
    }

    if (position === 'button' || position === 'cutoff') {
      reasons.push('Position favorable - range élargi');
    } else {
      reasons.push('Position précoce - range serré');
    }

    if (actions.includes('all-in')) {
      reasons.push('All-in indique premium main ou désespoir');
    }

    return reasons.join('. ') + '.';
  }
}

// Hand Prediction Display
export function HandPredictionDisplay({ prediction }: { prediction: HandPrediction }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed right-4 top-1/3 bg-gradient-to-br from-indigo-900 to-purple-900 backdrop-blur-sm rounded-2xl p-6 max-w-md border-4 border-indigo-400 shadow-2xl z-40"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-5xl">🔮</div>
        <div>
          <h3 className="text-indigo-300 font-bold text-xl">AI Predictor</h3>
          <div className="text-indigo-400 text-sm">{prediction.playerName}</div>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-indigo-300">Confiance:</span>
          <span className="text-white font-bold">{prediction.confidence.toFixed(0)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
            style={{ width: `${prediction.confidence}%` }}
          />
        </div>
      </div>

      {/* Top Predicted Hands */}
      <div className="bg-indigo-950/50 rounded-xl p-4 mb-4">
        <div className="text-indigo-300 text-sm font-semibold mb-3">Mains Probables:</div>
        <div className="space-y-2">
          {prediction.topHands.map((hand, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white font-bold">{hand.hand}</span>
                  <span className="text-indigo-400 text-sm">{hand.probability.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      i === 0
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        : i === 1
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    }`}
                    style={{ width: `${hand.probability}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Range */}
      <div className="bg-indigo-950/50 rounded-xl p-4 mb-4">
        <div className="text-indigo-300 text-sm font-semibold mb-2">Range Estimé:</div>
        <div className="flex flex-wrap gap-2">
          {prediction.predictedRange.map((hand, i) => (
            <div
              key={i}
              className="bg-indigo-700 px-3 py-1 rounded-lg text-white text-sm font-bold"
            >
              {hand}
            </div>
          ))}
        </div>
      </div>

      {/* Reasoning */}
      <div className="bg-purple-950/50 rounded-xl p-4">
        <div className="text-purple-300 text-sm font-semibold mb-2">Analyse:</div>
        <div className="text-white text-sm">{prediction.reasoning}</div>
      </div>
    </motion.div>
  );
}

// Hand Range Matrix (visual representation)
export function HandRangeMatrix({ range }: { range: string[] }) {
  const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

  const isInRange = (r1: string, r2: string): boolean => {
    const combo = r1 + r2;
    return range.some((h) => h.includes(combo) || h.includes(r2 + r1));
  };

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 border-2 border-indigo-400">
      <div className="text-indigo-400 font-bold mb-3">📊 Range Matrix</div>
      <div className="grid grid-cols-13 gap-1">
        {ranks.map((r1, i) =>
          ranks.map((r2, j) => {
            const inRange = isInRange(r1, r2);
            const isPair = i === j;
            const isSuited = i < j;

            return (
              <div
                key={`${r1}${r2}`}
                className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded ${
                  inRange
                    ? isPair
                      ? 'bg-yellow-500 text-gray-900'
                      : isSuited
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-500'
                }`}
              >
                {r1 === r2 ? r1 : `${r1}${r2}`}
              </div>
            );
          })
        )}
      </div>
      <div className="mt-3 flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-yellow-500 rounded" />
          <span className="text-gray-300">Paires</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span className="text-gray-300">Suited</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-500 rounded" />
          <span className="text-gray-300">Offsuit</span>
        </div>
      </div>
    </div>
  );
}

// Probability Calculator
export function ProbabilityCalculator() {
  const [outs, setOuts] = useState(9);
  const [street, setStreet] = useState<'flop' | 'turn'>('flop');

  const calculateProbability = () => {
    if (street === 'flop') {
      // 2 cards to come
      return (1 - (47 - outs) / 47 * (46 - outs) / 46) * 100;
    } else {
      // 1 card to come
      return (outs / 46) * 100;
    }
  };

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 border-2 border-green-400">
      <div className="text-green-400 font-bold mb-3">🎯 Calculateur d'Outs</div>

      <div className="mb-3">
        <div className="text-white text-sm mb-1">Nombre d'outs:</div>
        <input
          type="number"
          min="0"
          max="47"
          value={outs}
          onChange={(e) => setOuts(Number(e.target.value))}
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-600"
        />
      </div>

      <div className="mb-4">
        <div className="text-white text-sm mb-2">Street:</div>
        <div className="flex gap-2">
          <button
            onClick={() => setStreet('flop')}
            className={`flex-1 py-2 rounded-lg font-semibold ${
              street === 'flop'
                ? 'bg-green-500 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            Flop
          </button>
          <button
            onClick={() => setStreet('turn')}
            className={`flex-1 py-2 rounded-lg font-semibold ${
              street === 'turn'
                ? 'bg-green-500 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            Turn
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg p-4">
        <div className="text-green-300 text-sm mb-1">Probabilité de toucher:</div>
        <div className="text-white text-4xl font-bold">{calculateProbability().toFixed(1)}%</div>
      </div>

      <div className="mt-3 text-gray-400 text-xs">
        Common outs: Flush draw (9), OESD (8), Gutshot (4), Pair (2)
      </div>
    </div>
  );
}
