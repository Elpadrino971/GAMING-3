/**
 * Calculateur d'équité utilisant la simulation Monte Carlo
 * Plus précis que les estimations simplifiées
 */

import { Deck } from './deck';
import { HandEvaluator } from './hand-evaluator';
import { Card, EquityResult } from './types';

export class EquityCalculator {
  private evaluator: HandEvaluator;

  constructor() {
    this.evaluator = new HandEvaluator();
  }

  /**
   * Calcule l'équité d'une main via simulation Monte Carlo
   *
   * @param holeCards - Vos 2 cartes
   * @param communityCards - Cartes du board (0-5)
   * @param numOpponents - Nombre d'adversaires
   * @param iterations - Nombre de simulations (default: 10000)
   * @returns Équité entre 0 et 1
   */
  calculateEquity(
    holeCards: Card[],
    communityCards: Card[],
    numOpponents: number,
    iterations: number = 10000
  ): EquityResult {
    let wins = 0;
    let ties = 0;
    let losses = 0;

    for (let i = 0; i < iterations; i++) {
      const result = this.simulateHand(holeCards, communityCards, numOpponents);

      if (result === 1) wins++;
      else if (result === 0) ties++;
      else losses++;
    }

    return {
      equity: (wins + ties * 0.5) / iterations,
      wins,
      ties,
      losses,
      iterations
    };
  }

  /**
   * Simule une main complète
   * @returns 1 si on gagne, 0 si tie, -1 si on perd
   */
  private simulateHand(
    holeCards: Card[],
    communityCards: Card[],
    numOpponents: number
  ): number {
    // Créer un nouveau deck
    const deck = new Deck();
    deck.shuffle();

    // Retirer les cartes connues
    deck.removeCards([...holeCards, ...communityCards]);

    // Compléter le board jusqu'à 5 cartes
    const board = [...communityCards];
    const cardsNeeded = 5 - board.length;
    const additionalBoard = deck.dealMany(cardsNeeded);
    board.push(...additionalBoard);

    // Distribuer les cartes aux adversaires
    const opponentHands: Card[][] = [];
    for (let i = 0; i < numOpponents; i++) {
      const opponentCards = deck.dealMany(2);
      if (opponentCards.length === 2) {
        opponentHands.push(opponentCards);
      }
    }

    // Évaluer notre main
    const myFullHand = [...holeCards, ...board];
    const myStrength = this.evaluator.evaluateHand(myFullHand);

    // Évaluer les mains des adversaires
    let bestOpponentStrength: any = null;

    for (const opponentHole of opponentHands) {
      const opponentFullHand = [...opponentHole, ...board];
      const opponentStrength = this.evaluator.evaluateHand(opponentFullHand);

      if (!bestOpponentStrength || opponentStrength.rank > bestOpponentStrength.rank) {
        bestOpponentStrength = opponentStrength;
      }
    }

    if (!bestOpponentStrength) {
      return 1; // On gagne par défaut si pas d'adversaires
    }

    // Comparer
    const comparison = this.evaluator.compareHands(myFullHand,
      [...opponentHands[0], ...board]
    );

    return comparison;
  }

  /**
   * Calcule l'équité rapide (moins d'itérations pour le temps réel)
   */
  calculateQuickEquity(
    holeCards: Card[],
    communityCards: Card[],
    numOpponents: number
  ): number {
    const result = this.calculateEquity(holeCards, communityCards, numOpponents, 1000);
    return result.equity;
  }

  /**
   * Calcule l'équité pré-flop basée sur des tables pré-calculées
   * Ultra rapide pour l'analyse en temps réel
   */
  calculatePreFlopEquity(holeCards: Card[], numOpponents: number): number {
    // Tables d'équité pré-flop simplifiées
    const isPair = holeCards[0].rank === holeCards[1].rank;
    const isSuited = holeCards[0].suit === holeCards[1].suit;

    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const rank1 = ranks.indexOf(holeCards[0].rank);
    const rank2 = ranks.indexOf(holeCards[1].rank);
    const maxRank = Math.max(rank1, rank2);
    const minRank = Math.min(rank1, rank2);

    let baseEquity = 0;

    if (isPair) {
      // Paires : équité basée sur la hauteur de la paire
      baseEquity = 0.50 + (rank1 / ranks.length) * 0.35;
    } else {
      // Cartes non appairées
      baseEquity = 0.30 + (maxRank / ranks.length) * 0.25 + (minRank / ranks.length) * 0.10;

      // Bonus suited
      if (isSuited) {
        baseEquity += 0.05;
      }

      // Bonus connecteurs
      const gap = maxRank - minRank;
      if (gap === 1) {
        baseEquity += 0.03; // Connecteurs directs
      } else if (gap === 2) {
        baseEquity += 0.02; // One gapper
      }
    }

    // Ajustement selon le nombre d'adversaires
    const opponentAdjustment = 1 - (numOpponents - 1) * 0.08;
    baseEquity *= Math.max(0.3, opponentAdjustment);

    return Math.min(Math.max(baseEquity, 0), 1);
  }

  /**
   * Calcule les outs (cartes qui améliorent la main)
   */
  calculateOuts(holeCards: Card[], communityCards: Card[]): {
    outs: number;
    outsCards: Card[];
    description: string;
  } {
    if (communityCards.length === 0) {
      return { outs: 0, outsCards: [], description: 'Pre-flop' };
    }

    const deck = new Deck();
    deck.removeCards([...holeCards, ...communityCards]);

    const currentStrength = this.evaluator.evaluateHand([...holeCards, ...communityCards]);

    let outs = 0;
    const outsCards: Card[] = [];

    // Tester chaque carte restante
    const remainingCards = [...Array(deck.remaining)].map(() => deck.dealOne()).filter(Boolean) as Card[];

    for (const card of remainingCards) {
      const testHand = [...holeCards, ...communityCards, card];
      const newStrength = this.evaluator.evaluateHand(testHand);

      // Si la main s'améliore
      if (newStrength.rank > currentStrength.rank) {
        outs++;
        outsCards.push(card);
      }
    }

    return {
      outs,
      outsCards,
      description: `${outs} outs pour améliorer`
    };
  }

  /**
   * Convertit les outs en pourcentage d'équité (règle du 2 et 4)
   */
  outsToEquity(outs: number, street: 'flop' | 'turn'): number {
    if (street === 'flop') {
      // Règle du 4 (2 cartes à venir)
      return Math.min(outs * 4, 100) / 100;
    } else {
      // Règle du 2 (1 carte à venir)
      return Math.min(outs * 2, 100) / 100;
    }
  }
}
