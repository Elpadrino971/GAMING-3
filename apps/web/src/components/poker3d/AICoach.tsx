'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface HandAnalysis {
  handStrength: number; // 0-100
  recommendation: 'fold' | 'call' | 'raise' | 'all-in' | 'check';
  confidence: number; // 0-100
  reasoning: string;
  potOdds: number;
  equity: number;
  expectedValue: number;
  mistakes: string[];
  improvements: string[];
}

export interface PlayerHand {
  cards: string[];
  position: string;
  stack: number;
  pot: number;
  toCall: number;
  communityCards: string[];
  opponents: number;
  street: 'preflop' | 'flop' | 'turn' | 'river';
}

// AI Poker Coach Engine
export class PokerCoachAI {
  private static instance: PokerCoachAI;

  private constructor() {}

  static getInstance(): PokerCoachAI {
    if (!PokerCoachAI.instance) {
      PokerCoachAI.instance = new PokerCoachAI();
    }
    return PokerCoachAI.instance;
  }

  // Analyze hand and provide recommendation
  analyzeHand(hand: PlayerHand): HandAnalysis {
    const handStrength = this.calculateHandStrength(hand);
    const potOdds = hand.toCall / (hand.pot + hand.toCall);
    const equity = this.calculateEquity(hand);
    const expectedValue = this.calculateEV(hand, equity, potOdds);

    const recommendation = this.getRecommendation(
      handStrength,
      equity,
      potOdds,
      hand.position,
      hand.street
    );

    const reasoning = this.generateReasoning(
      hand,
      handStrength,
      equity,
      potOdds,
      recommendation
    );

    const mistakes = this.identifyMistakes(hand, recommendation);
    const improvements = this.suggestImprovements(hand);

    return {
      handStrength,
      recommendation,
      confidence: this.calculateConfidence(handStrength, equity),
      reasoning,
      potOdds: potOdds * 100,
      equity: equity * 100,
      expectedValue,
      mistakes,
      improvements,
    };
  }

  private calculateHandStrength(hand: PlayerHand): number {
    // Simplified hand strength calculation
    const cardRanks: Record<string, number> = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
      '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14,
    };

    if (hand.cards.length < 2) return 0;

    const card1Rank = cardRanks[hand.cards[0].slice(0, -1)] || 0;
    const card2Rank = cardRanks[hand.cards[1].slice(0, -1)] || 0;

    const isPair = card1Rank === card2Rank;
    const isSuited = hand.cards[0].slice(-1) === hand.cards[1].slice(-1);
    const highCard = Math.max(card1Rank, card2Rank);
    const lowCard = Math.min(card1Rank, card2Rank);

    let strength = 0;

    // Premium pairs
    if (isPair && highCard >= 10) strength = 95;
    else if (isPair && highCard >= 7) strength = 75;
    else if (isPair) strength = 60;

    // High cards
    else if (highCard === 14 && lowCard >= 10) strength = isSuited ? 85 : 75;
    else if (highCard >= 13 && lowCard >= 10) strength = isSuited ? 70 : 60;
    else if (highCard >= 11) strength = isSuited ? 55 : 45;
    else strength = isSuited ? 40 : 30;

    // Adjust for community cards
    if (hand.communityCards.length > 0) {
      strength += this.calculateBoardConnection(hand) * 20;
    }

    return Math.min(100, strength);
  }

  private calculateBoardConnection(hand: PlayerHand): number {
    // Simplified board connection calculation
    // In real implementation, check for pairs, flush draws, straight draws, etc.
    return Math.random() * 0.5; // 0-0.5 bonus
  }

  private calculateEquity(hand: PlayerHand): number {
    // Simplified equity calculation
    const baseEquity = hand.handStrength / 100;
    const opponentFactor = 1 / (hand.opponents + 1);
    return baseEquity * (0.5 + opponentFactor * 0.5);
  }

  private calculateEV(hand: PlayerHand, equity: number, potOdds: number): number {
    const winAmount = hand.pot * equity;
    const loseAmount = hand.toCall * (1 - equity);
    return winAmount - loseAmount;
  }

  private getRecommendation(
    handStrength: number,
    equity: number,
    potOdds: number,
    position: string,
    street: string
  ): 'fold' | 'call' | 'raise' | 'all-in' | 'check' {
    // Premium hands
    if (handStrength >= 90) return 'raise';

    // Strong hands
    if (handStrength >= 70) {
      if (position === 'button' || position === 'cutoff') return 'raise';
      return 'call';
    }

    // Medium hands
    if (handStrength >= 50) {
      if (equity > potOdds) return 'call';
      return 'fold';
    }

    // Weak hands
    if (handStrength >= 30) {
      if (position === 'button' && street === 'preflop') return 'call';
      return 'fold';
    }

    return 'fold';
  }

  private generateReasoning(
    hand: PlayerHand,
    handStrength: number,
    equity: number,
    potOdds: number,
    recommendation: string
  ): string {
    const reasons: string[] = [];

    if (handStrength >= 80) {
      reasons.push('Main très forte');
    } else if (handStrength >= 60) {
      reasons.push('Main solide');
    } else if (handStrength >= 40) {
      reasons.push('Main moyenne');
    } else {
      reasons.push('Main faible');
    }

    if (equity > potOdds) {
      reasons.push(`Equity (${(equity * 100).toFixed(1)}%) > Pot Odds (${(potOdds * 100).toFixed(1)}%)`);
    } else {
      reasons.push(`Equity (${(equity * 100).toFixed(1)}%) < Pot Odds (${(potOdds * 100).toFixed(1)}%)`);
    }

    if (hand.position === 'button' || hand.position === 'cutoff') {
      reasons.push('Position favorable');
    } else if (hand.position === 'small blind' || hand.position === 'big blind') {
      reasons.push('Position défavorable');
    }

    if (recommendation === 'raise') {
      reasons.push('Relancez pour prendre le contrôle');
    } else if (recommendation === 'call') {
      reasons.push('Suivez pour voir la suite');
    } else if (recommendation === 'fold') {
      reasons.push('Couchez pour économiser vos jetons');
    }

    return reasons.join('. ') + '.';
  }

  private calculateConfidence(handStrength: number, equity: number): number {
    // Higher confidence for clearer situations
    if (handStrength >= 90 || handStrength <= 20) return 95;
    if (handStrength >= 70 || handStrength <= 30) return 80;
    if (handStrength >= 60 || handStrength <= 40) return 65;
    return 50;
  }

  private identifyMistakes(hand: PlayerHand, recommendation: string): string[] {
    const mistakes: string[] = [];

    // Common mistakes
    if (hand.position === 'early' && hand.handStrength < 60 && recommendation !== 'fold') {
      mistakes.push('❌ Jouer trop de mains en position précoce');
    }

    if (hand.toCall > hand.stack * 0.3 && hand.handStrength < 70) {
      mistakes.push('❌ Risquer trop de jetons avec une main moyenne');
    }

    if (hand.street === 'river' && hand.handStrength < 40 && recommendation === 'call') {
      mistakes.push('❌ Payer trop souvent à la river avec une main faible');
    }

    return mistakes;
  }

  private suggestImprovements(hand: PlayerHand): string[] {
    const improvements: string[] = [];

    improvements.push('✅ Étudiez les ranges de départ pour votre position');
    improvements.push('✅ Calculez toujours vos pot odds avant de payer');
    improvements.push('✅ Soyez plus agressif en position favorable');
    improvements.push('✅ Évitez de slowplay vos grosses mains');

    return improvements.slice(0, 2); // Return top 2
  }
}

// AI Coach Display Component
export function AICoachDisplay() {
  const [analysis, setAnalysis] = useState<HandAnalysis | null>(null);
  const [visible, setVisible] = useState(true);
  const [mode, setMode] = useState<'minimal' | 'detailed'>('detailed');

  useEffect(() => {
    // Listen for hand analysis events
    const handleAnalysis = (event: CustomEvent<HandAnalysis>) => {
      setAnalysis(event.detail);
      setVisible(true);
    };

    window.addEventListener('poker-coach-analysis' as any, handleAnalysis);
    return () => window.removeEventListener('poker-coach-analysis' as any, handleAnalysis);
  }, []);

  if (!analysis || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed right-4 top-20 bg-gradient-to-br from-purple-900 to-indigo-900 backdrop-blur-sm rounded-2xl p-6 max-w-md border-4 border-purple-400 shadow-2xl z-40"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🤖</div>
            <div>
              <h3 className="text-purple-300 font-bold text-xl">AI Coach</h3>
              <div className="text-purple-400 text-xs">Analyse en temps réel</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMode(mode === 'minimal' ? 'detailed' : 'minimal')}
              className="text-purple-300 hover:text-white text-sm"
            >
              {mode === 'minimal' ? '📊' : '📉'}
            </button>
            <button
              onClick={() => setVisible(false)}
              className="text-purple-300 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 mb-4">
          <div className="text-white text-sm font-semibold mb-1">Recommandation:</div>
          <div className="text-white text-3xl font-bold uppercase">
            {analysis.recommendation === 'fold' && '🚫 FOLD'}
            {analysis.recommendation === 'call' && '💰 CALL'}
            {analysis.recommendation === 'raise' && '🚀 RAISE'}
            {analysis.recommendation === 'all-in' && '🔥 ALL-IN'}
            {analysis.recommendation === 'check' && '✅ CHECK'}
          </div>
          <div className="text-white text-xs mt-2">
            Confiance: {analysis.confidence.toFixed(0)}%
          </div>
        </div>

        {mode === 'detailed' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-purple-800/50 rounded-lg p-3">
                <div className="text-purple-300 text-xs mb-1">Force</div>
                <div className="text-white text-xl font-bold">
                  {analysis.handStrength.toFixed(0)}%
                </div>
              </div>
              <div className="bg-purple-800/50 rounded-lg p-3">
                <div className="text-purple-300 text-xs mb-1">Equity</div>
                <div className="text-white text-xl font-bold">
                  {analysis.equity.toFixed(1)}%
                </div>
              </div>
              <div className="bg-purple-800/50 rounded-lg p-3">
                <div className="text-purple-300 text-xs mb-1">Pot Odds</div>
                <div className="text-white text-xl font-bold">
                  {analysis.potOdds.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* EV */}
            <div className="bg-purple-800/50 rounded-lg p-3 mb-4">
              <div className="text-purple-300 text-xs mb-1">Expected Value (EV)</div>
              <div className={`text-2xl font-bold ${analysis.expectedValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {analysis.expectedValue >= 0 ? '+' : ''}{analysis.expectedValue.toFixed(2)} BB
              </div>
            </div>

            {/* Reasoning */}
            <div className="bg-purple-800/50 rounded-lg p-3 mb-4">
              <div className="text-purple-300 text-xs font-semibold mb-2">Raisonnement:</div>
              <div className="text-white text-sm">{analysis.reasoning}</div>
            </div>

            {/* Mistakes */}
            {analysis.mistakes.length > 0 && (
              <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-3 mb-4">
                <div className="text-red-400 text-xs font-semibold mb-2">Erreurs détectées:</div>
                {analysis.mistakes.map((mistake, i) => (
                  <div key={i} className="text-red-300 text-sm mb-1">
                    {mistake}
                  </div>
                ))}
              </div>
            )}

            {/* Improvements */}
            <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-3">
              <div className="text-green-400 text-xs font-semibold mb-2">Conseils:</div>
              {analysis.improvements.map((improvement, i) => (
                <div key={i} className="text-green-300 text-sm mb-1">
                  {improvement}
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to trigger AI analysis
export function useAICoach() {
  const coach = PokerCoachAI.getInstance();

  const analyzeHand = (hand: PlayerHand) => {
    const analysis = coach.analyzeHand(hand);
    window.dispatchEvent(new CustomEvent('poker-coach-analysis', { detail: analysis }));
    return analysis;
  };

  return { analyzeHand };
}

// AI Coach Settings Panel
export function AICoachSettings({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}) {
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [showMistakes, setShowMistakes] = useState(true);

  return (
    <div className="bg-purple-900/95 backdrop-blur-sm rounded-xl p-6 border-2 border-purple-400">
      <h3 className="text-purple-300 font-bold text-xl mb-4">⚙️ AI Coach Settings</h3>

      {/* Enable/Disable */}
      <div className="flex items-center justify-between mb-4 bg-purple-800/50 rounded-lg p-3">
        <div>
          <div className="text-white font-semibold">Activer le Coach IA</div>
          <div className="text-purple-300 text-xs">Recevoir des conseils en temps réel</div>
        </div>
        <button
          onClick={() => onToggle(!enabled)}
          className={`w-14 h-8 rounded-full transition ${
            enabled ? 'bg-green-500' : 'bg-gray-600'
          }`}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full transition transform ${
              enabled ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Difficulty Level */}
      <div className="mb-4">
        <div className="text-white font-semibold mb-2">Niveau de détail:</div>
        <div className="flex gap-2">
          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                difficulty === level
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-800 text-purple-300 hover:bg-purple-700'
              }`}
            >
              {level === 'beginner' && '🌱 Débutant'}
              {level === 'intermediate' && '📚 Intermédiaire'}
              {level === 'advanced' && '🎓 Avancé'}
            </button>
          ))}
        </div>
      </div>

      {/* Auto Analyze */}
      <div className="flex items-center justify-between mb-3 bg-purple-800/50 rounded-lg p-3">
        <div className="text-white text-sm">Analyse automatique</div>
        <input
          type="checkbox"
          checked={autoAnalyze}
          onChange={(e) => setAutoAnalyze(e.target.checked)}
          className="w-5 h-5"
        />
      </div>

      {/* Show Mistakes */}
      <div className="flex items-center justify-between bg-purple-800/50 rounded-lg p-3">
        <div className="text-white text-sm">Montrer les erreurs</div>
        <input
          type="checkbox"
          checked={showMistakes}
          onChange={(e) => setShowMistakes(e.target.checked)}
          className="w-5 h-5"
        />
      </div>
    </div>
  );
}
