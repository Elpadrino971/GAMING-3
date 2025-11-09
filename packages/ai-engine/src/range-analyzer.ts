/**
 * Analyseur de range
 * Estime les ranges des adversaires et analyse les ranges du joueur
 */

import { HandState, RangeAnalysis, Position, ActionType } from './types';

export class RangeAnalyzer {
  /**
   * Estime le range d'un adversaire basé sur ses actions
   */
  estimateOpponentRange(state: HandState, opponentActions: any[]): RangeAnalysis {
    // Analyse des actions de l'adversaire
    const hasRaised = opponentActions.some(a =>
      a.type === ActionType.Raise || a.type === ActionType.Bet
    );
    const hasCalledRaise = opponentActions.some(a =>
      a.type === ActionType.Call && a.previousAction === ActionType.Raise
    );

    // Estimation du range basé sur le profil d'action
    let estimatedRange: string[] = [];
    let rangeStrength = 0.5;

    if (hasRaised) {
      // Range de raise : généralement plus fort
      estimatedRange = this.getStrongRange(state.position);
      rangeStrength = 0.7;
    } else if (hasCalledRaise) {
      // Range de call à une raise : moyen-fort
      estimatedRange = this.getMediumRange(state.position);
      rangeStrength = 0.55;
    } else {
      // Range passif : plus large
      estimatedRange = this.getWideRange(state.position);
      rangeStrength = 0.45;
    }

    // Catégorisation du range
    const categorization = this.categorizeRange(estimatedRange);

    return {
      estimatedRange,
      rangeStrength,
      ...categorization
    };
  }

  /**
   * Range fort (pour raises)
   */
  private getStrongRange(position: Position): string[] {
    const premiumPairs = ['AA', 'KK', 'QQ', 'JJ', 'TT'];
    const strongBroadway = ['AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'KQs'];

    // Élargir le range en position tardive
    if (position === Position.Button || position === Position.Cutoff) {
      return [
        ...premiumPairs,
        ...strongBroadway,
        '99', '88',
        'AJo', 'ATs', 'KJs', 'KQo'
      ];
    }

    return [...premiumPairs, ...strongBroadway];
  }

  /**
   * Range moyen
   */
  private getMediumRange(position: Position): string[] {
    return [
      // Paires
      'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66',
      // Broadway
      'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'AJo', 'ATs',
      'KQs', 'KQo', 'KJs', 'KTs',
      'QJs', 'QTs',
      'JTs',
      // Suited connectors
      'T9s', '98s', '87s', '76s'
    ];
  }

  /**
   * Range large
   */
  private getWideRange(position: Position): string[] {
    // Range très large incluant bluffs et mains spéculatives
    return [
      // Toutes les paires
      'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
      // Mains à haute carte
      'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'AJo', 'ATs', 'ATo', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
      'KQs', 'KQo', 'KJs', 'KJo', 'KTs', 'KTo', 'K9s',
      'QJs', 'QJo', 'QTs', 'QTo', 'Q9s',
      'JTs', 'JTo', 'J9s',
      'T9s', 'T9o', 'T8s',
      // Suited connectors et gappers
      '98s', '87s', '76s', '65s', '54s',
      '97s', '86s', '75s', '64s'
    ];
  }

  /**
   * Catégorise un range
   */
  private categorizeRange(range: string[]): {
    topPairs: number;
    middlePairs: number;
    bottomPairs: number;
    draws: number;
    bluffs: number;
  } {
    let topPairs = 0;
    let middlePairs = 0;
    let bottomPairs = 0;
    let draws = 0;
    let bluffs = 0;

    range.forEach(hand => {
      if (this.isPremiumPair(hand)) {
        topPairs++;
      } else if (this.isMiddlePair(hand)) {
        middlePairs++;
      } else if (this.isLowPair(hand)) {
        bottomPairs++;
      } else if (this.isDrawingHand(hand)) {
        draws++;
      } else {
        bluffs++;
      }
    });

    const total = range.length;

    return {
      topPairs: topPairs / total,
      middlePairs: middlePairs / total,
      bottomPairs: bottomPairs / total,
      draws: draws / total,
      bluffs: bluffs / total
    };
  }

  /**
   * Vérifie si c'est une paire premium
   */
  private isPremiumPair(hand: string): boolean {
    return ['AA', 'KK', 'QQ', 'JJ', 'TT'].includes(hand);
  }

  /**
   * Vérifie si c'est une paire moyenne
   */
  private isMiddlePair(hand: string): boolean {
    return ['99', '88', '77', '66'].includes(hand);
  }

  /**
   * Vérifie si c'est une paire basse
   */
  private isLowPair(hand: string): boolean {
    return ['55', '44', '33', '22'].includes(hand);
  }

  /**
   * Vérifie si c'est une main à tirage
   */
  private isDrawingHand(hand: string): boolean {
    const suitedConnectors = ['T9s', '98s', '87s', '76s', '65s', '54s'];
    const suitedAces = ['A5s', 'A4s', 'A3s', 'A2s'];

    return suitedConnectors.includes(hand) || suitedAces.includes(hand);
  }

  /**
   * Calcule la polarisation d'un range
   */
  calculateRangePolarization(range: RangeAnalysis): {
    isPolarized: boolean;
    polarizationScore: number;
  } {
    // Un range polarisé a beaucoup de très fortes mains et de bluffs,
    // mais peu de mains moyennes

    const strongHands = range.topPairs;
    const weakHands = range.bluffs;
    const mediumHands = range.middlePairs + range.bottomPairs;

    const polarizationScore = (strongHands + weakHands) / (mediumHands + 0.01);

    return {
      isPolarized: polarizationScore > 2.0,
      polarizationScore
    };
  }

  /**
   * Suggère un ajustement de range basé sur les tendances de l'adversaire
   */
  suggestRangeAdjustment(opponentRange: RangeAnalysis, playerStats: any): string[] {
    const adjustments: string[] = [];

    // Si l'adversaire est trop polarisé
    const { isPolarized } = this.calculateRangePolarization(opponentRange);

    if (isPolarized) {
      adjustments.push(
        'Adversaire polarisé : exploitez avec des calls plus fréquents avec mains moyennes'
      );
    }

    // Si l'adversaire bluff trop
    if (opponentRange.bluffs > 0.3) {
      adjustments.push(
        'Adversaire bluff beaucoup : call plus souvent, raise less'
      );
    }

    // Si l'adversaire est trop tight
    if (opponentRange.rangeStrength > 0.7) {
      adjustments.push(
        'Adversaire très tight : fold vos mains moyennes face aux raises, ne bluffez pas'
      );
    }

    return adjustments;
  }
}
