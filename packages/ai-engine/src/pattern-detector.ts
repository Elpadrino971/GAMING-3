/**
 * Pattern Detector - Détecte les leaks et patterns de jeu
 * Analyse l'historique pour identifier les faiblesses exploitables
 */

import { ActionType, Position, Street } from './types';

export interface Leak {
  type: LeakType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  frequency: number; // 0-1
  evLoss: number; // BB/100 hands
  solution: string;
  examples: string[];
}

export enum LeakType {
  // Pre-flop leaks
  OVER_FOLDING_TO_RAISES = 'over_folding_to_raises',
  UNDER_FOLDING_TO_RAISES = 'under_folding_to_raises',
  TOO_LOOSE_PREFLOP = 'too_loose_preflop',
  TOO_TIGHT_PREFLOP = 'too_tight_preflop',
  NOT_RAISING_ENOUGH = 'not_raising_enough',
  OVER_CALLING = 'over_calling',

  // Post-flop leaks
  OVER_CBET = 'over_cbet',
  UNDER_CBET = 'under_cbet',
  FOLDING_TOO_MUCH_TO_CBET = 'folding_too_much_to_cbet',
  MISSED_VALUE_BETS = 'missed_value_bets',
  OVER_BLUFFING = 'over_bluffing',
  UNDER_BLUFFING = 'under_bluffing',

  // Positional leaks
  OUT_OF_POSITION_AGGRESSION = 'oop_aggression',
  NOT_USING_POSITION = 'not_using_position',

  // Bet sizing leaks
  INCONSISTENT_SIZING = 'inconsistent_sizing',
  PREDICTABLE_SIZING = 'predictable_sizing',

  // Mental game leaks
  TILT_PATTERN = 'tilt_pattern',
  RESULTS_ORIENTED = 'results_oriented'
}

export interface HandData {
  id: string;
  position: Position;
  street: Street;
  actions: Array<{
    type: ActionType;
    amount?: number;
    position: Position;
  }>;
  holeCards: any[];
  communityCards: any[];
  isOptimal: boolean;
  equity: number;
  potOdds: number;
  wonAmount?: number;
  finalPot: number;
}

export class PatternDetector {
  /**
   * Analyse un historique de mains et détecte les leaks
   */
  detectLeaks(hands: HandData[]): Leak[] {
    if (hands.length < 20) {
      return []; // Pas assez de données
    }

    const leaks: Leak[] = [];

    // Analyse pre-flop
    leaks.push(...this.detectPreFlopLeaks(hands));

    // Analyse post-flop
    leaks.push(...this.detectPostFlopLeaks(hands));

    // Analyse positionnelle
    leaks.push(...this.detectPositionalLeaks(hands));

    // Analyse de bet sizing
    leaks.push(...this.detectSizingLeaks(hands));

    // Analyse de tilt
    leaks.push(...this.detectTiltPatterns(hands));

    // Trier par sévérité et EV loss
    return leaks.sort((a, b) => {
      const severityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;
      return b.evLoss - a.evLoss;
    });
  }

  /**
   * Détecte les leaks pre-flop
   */
  private detectPreFlopLeaks(hands: HandData[]): Leak[] {
    const leaks: Leak[] = [];
    const preFlopHands = hands.filter(h => h.street === Street.PreFlop || h.actions.length <= 2);

    // Calcul du VPIP (Voluntary Put In Pot)
    const vpip = this.calculateVPIP(preFlopHands);

    if (vpip > 0.35) {
      leaks.push({
        type: LeakType.TOO_LOOSE_PREFLOP,
        severity: 'HIGH',
        description: `VPIP trop élevé (${(vpip * 100).toFixed(1)}%)`,
        frequency: vpip,
        evLoss: (vpip - 0.28) * 50, // Estimation d'EV loss
        solution: 'Resserre ton range pre-flop. Fold plus de mains marginales hors position.',
        examples: this.getExamples(preFlopHands, h => this.isLoosePlay(h))
      });
    }

    if (vpip < 0.15) {
      leaks.push({
        type: LeakType.TOO_TIGHT_PREFLOP,
        severity: 'MEDIUM',
        description: `VPIP trop serré (${(vpip * 100).toFixed(1)}%)`,
        frequency: 1 - vpip,
        evLoss: (0.20 - vpip) * 30,
        solution: 'Élargis ton range, surtout en position tardive. Tu laisses passer de la value.',
        examples: []
      });
    }

    // Fold to raise
    const foldToRaise = this.calculateFoldToRaise(preFlopHands);

    if (foldToRaise > 0.75) {
      leaks.push({
        type: LeakType.OVER_FOLDING_TO_RAISES,
        severity: 'CRITICAL',
        description: `Tu folds ${(foldToRaise * 100).toFixed(1)}% du temps face aux raises`,
        frequency: foldToRaise,
        evLoss: (foldToRaise - 0.60) * 80,
        solution: 'Défends plus face aux raises avec des mains moyennes. Tu es trop exploitable.',
        examples: this.getExamples(preFlopHands, h => this.isFoldToRaise(h))
      });
    }

    // PFR/VPIP ratio
    const pfr = this.calculatePFR(preFlopHands);
    const pfrVpipRatio = pfr / vpip;

    if (pfrVpipRatio < 0.5 && vpip > 0.15) {
      leaks.push({
        type: LeakType.OVER_CALLING,
        severity: 'HIGH',
        description: `Tu calls trop et raise pas assez (ratio PFR/VPIP: ${pfrVpipRatio.toFixed(2)})`,
        frequency: vpip - pfr,
        evLoss: (0.7 - pfrVpipRatio) * 60,
        solution: 'Raise plus, call moins. Le call est souvent la pire option pre-flop.',
        examples: this.getExamples(preFlopHands, h => this.isOverCalling(h))
      });
    }

    return leaks;
  }

  /**
   * Détecte les leaks post-flop
   */
  private detectPostFlopLeaks(hands: HandData[]): Leak[] {
    const leaks: Leak[] = [];
    const postFlopHands = hands.filter(h =>
      h.street !== Street.PreFlop && h.communityCards.length >= 3
    );

    if (postFlopHands.length === 0) return leaks;

    // C-Bet analysis
    const cBetFrequency = this.calculateCBetFrequency(postFlopHands);

    if (cBetFrequency > 0.75) {
      leaks.push({
        type: LeakType.OVER_CBET,
        severity: 'HIGH',
        description: `C-bet trop fréquent (${(cBetFrequency * 100).toFixed(1)}%)`,
        frequency: cBetFrequency,
        evLoss: (cBetFrequency - 0.60) * 45,
        solution: 'Réduis tes c-bets. Check plus souvent sur les boards défavorables.',
        examples: this.getExamples(postFlopHands, h => this.isOverCBet(h))
      });
    }

    // Fold to C-Bet
    const foldToCBet = this.calculateFoldToCBet(postFlopHands);

    if (foldToCBet > 0.70) {
      leaks.push({
        type: LeakType.FOLDING_TOO_MUCH_TO_CBET,
        severity: 'CRITICAL',
        description: `Tu folds ${(foldToCBet * 100).toFixed(1)}% face aux c-bets`,
        frequency: foldToCBet,
        evLoss: (foldToCBet - 0.50) * 70,
        solution: 'Défends plus face aux c-bets. Call ou raise avec tes tirages et paires moyennes.',
        examples: this.getExamples(postFlopHands, h => this.isFoldToCBet(h))
      });
    }

    // Missed value bets
    const missedValueFreq = this.calculateMissedValue(postFlopHands);

    if (missedValueFreq > 0.30) {
      leaks.push({
        type: LeakType.MISSED_VALUE_BETS,
        severity: 'HIGH',
        description: `Tu rates de la value betting ${(missedValueFreq * 100).toFixed(1)}% du temps`,
        frequency: missedValueFreq,
        evLoss: missedValueFreq * 55,
        solution: 'Bet plus thin sur la river avec tes bonnes mains. N\'aie pas peur d\'extraire de la value.',
        examples: this.getExamples(postFlopHands, h => this.isMissedValue(h))
      });
    }

    return leaks;
  }

  /**
   * Détecte les leaks positionnels
   */
  private detectPositionalLeaks(hands: HandData[]): Leak[] {
    const leaks: Leak[] = [];

    const inPosition = hands.filter(h =>
      h.position === Position.Button || h.position === Position.Cutoff
    );
    const outOfPosition = hands.filter(h =>
      h.position === Position.SmallBlind || h.position === Position.BigBlind
    );

    if (inPosition.length > 0 && outOfPosition.length > 0) {
      const ipAggression = this.calculateAggression(inPosition);
      const oopAggression = this.calculateAggression(outOfPosition);

      // Devrait être plus agressif en position
      if (ipAggression < oopAggression * 1.3) {
        leaks.push({
          type: LeakType.NOT_USING_POSITION,
          severity: 'MEDIUM',
          description: 'Tu n\'utilises pas assez ton avantage positionnel',
          frequency: 0.5,
          evLoss: 25,
          solution: 'Sois plus agressif en position. Bet, raise et bluff plus.',
          examples: []
        });
      }

      // Ne devrait pas être trop agressif hors position
      if (oopAggression > 2.5) {
        leaks.push({
          type: LeakType.OUT_OF_POSITION_AGGRESSION,
          severity: 'HIGH',
          description: 'Trop agressif hors position',
          frequency: 0.4,
          evLoss: 35,
          solution: 'Joue plus prudemment hors position. Check-call plus, bet moins.',
          examples: []
        });
      }
    }

    return leaks;
  }

  /**
   * Détecte les leaks de bet sizing
   */
  private detectSizingLeaks(hands: HandData[]): Leak[] {
    const leaks: Leak[] = [];

    const bets = hands.flatMap(h =>
      h.actions.filter(a => a.type === ActionType.Bet || a.type === ActionType.Raise)
    );

    if (bets.length < 10) return leaks;

    // Analyse de la variance des sizings
    const sizings = bets.map(b => b.amount || 0).filter(a => a > 0);
    const avgSizing = sizings.reduce((a, b) => a + b, 0) / sizings.length;
    const variance = sizings.reduce((sum, s) => sum + Math.pow(s - avgSizing, 2), 0) / sizings.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev < avgSizing * 0.2) {
      leaks.push({
        type: LeakType.PREDICTABLE_SIZING,
        severity: 'MEDIUM',
        description: 'Tes sizings sont trop prévisibles',
        frequency: 0.6,
        evLoss: 20,
        solution: 'Varie tes sizings pour être moins lisible. Mix entre 1/3, 1/2, 2/3, et 1x pot.',
        examples: []
      });
    }

    return leaks;
  }

  /**
   * Détecte les patterns de tilt
   */
  private detectTiltPatterns(hands: HandData[]): Leak[] {
    const leaks: Leak[] = [];

    // Analyser les sessions où on perd
    const losingStreaks = this.findLosingStreaks(hands);

    for (const streak of losingStreaks) {
      const streakHands = hands.slice(streak.start, streak.end + 1);
      const normalHands = hands.filter((_, i) => i < streak.start || i > streak.end);

      const streakAggression = this.calculateAggression(streakHands);
      const normalAggression = this.calculateAggression(normalHands);

      // Si beaucoup plus agressif en losing streak = tilt
      if (streakAggression > normalAggression * 1.5) {
        leaks.push({
          type: LeakType.TILT_PATTERN,
          severity: 'CRITICAL',
          description: 'Pattern de tilt détecté - aggression excessive après des pertes',
          frequency: losingStreaks.length / 10,
          evLoss: 100, // Tilt est très coûteux
          solution: 'Prends une pause après 2-3 bad beats. Respire. Reset mental.',
          examples: [`Session du ${new Date(streakHands[0].id).toLocaleDateString()}`]
        });
        break; // Un seul leak de tilt suffit
      }
    }

    return leaks;
  }

  // Fonctions utilitaires de calcul

  private calculateVPIP(hands: HandData[]): number {
    const voluntaryPuts = hands.filter(h =>
      h.actions.some(a => a.type !== ActionType.Fold && a.type !== ActionType.Check)
    );
    return voluntaryPuts.length / hands.length;
  }

  private calculatePFR(hands: HandData[]): number {
    const raises = hands.filter(h =>
      h.actions.some(a => a.type === ActionType.Raise || a.type === ActionType.Bet)
    );
    return raises.length / hands.length;
  }

  private calculateFoldToRaise(hands: HandData[]): number {
    const facedRaise = hands.filter(h =>
      h.actions.some(a => a.type === ActionType.Raise)
    );
    if (facedRaise.length === 0) return 0;

    const folded = facedRaise.filter(h =>
      h.actions[h.actions.length - 1].type === ActionType.Fold
    );

    return folded.length / facedRaise.length;
  }

  private calculateCBetFrequency(hands: HandData[]): number {
    // Hands où on a raise pre-flop et on est premier à agir au flop
    const cBetSpots = hands.filter(h =>
      h.actions.length > 0 && h.communityCards.length >= 3
    );

    if (cBetSpots.length === 0) return 0;

    const actualCBets = cBetSpots.filter(h =>
      h.actions.some(a => a.type === ActionType.Bet)
    );

    return actualCBets.length / cBetSpots.length;
  }

  private calculateFoldToCBet(hands: HandData[]): number {
    const facedCBet = hands.filter(h =>
      h.actions.some(a => a.type === ActionType.Bet) && h.communityCards.length >= 3
    );

    if (facedCBet.length === 0) return 0;

    const folded = facedCBet.filter(h =>
      h.actions[h.actions.length - 1].type === ActionType.Fold
    );

    return folded.length / facedCBet.length;
  }

  private calculateMissedValue(hands: HandData[]): number {
    // Hands où on a une bonne main mais on a check sur la river
    const riverHands = hands.filter(h => h.communityCards.length === 5);

    const missedValue = riverHands.filter(h =>
      h.equity > 0.7 && // Bonne main
      h.wonAmount && h.wonAmount > 0 && // On a gagné
      h.actions[h.actions.length - 1].type === ActionType.Check // Mais on a check
    );

    return missedValue.length / Math.max(riverHands.length, 1);
  }

  private calculateAggression(hands: HandData[]): number {
    const bets = hands.filter(h =>
      h.actions.some(a => a.type === ActionType.Bet || a.type === ActionType.Raise)
    ).length;

    const calls = hands.filter(h =>
      h.actions.some(a => a.type === ActionType.Call)
    ).length;

    return calls === 0 ? bets : bets / calls;
  }

  private findLosingStreaks(hands: HandData[]): Array<{ start: number; end: number }> {
    const streaks: Array<{ start: number; end: number }> = [];
    let currentStreak: { start: number; end: number } | null = null;

    for (let i = 0; i < hands.length; i++) {
      const isLoss = !hands[i].wonAmount || hands[i].wonAmount < 0;

      if (isLoss) {
        if (!currentStreak) {
          currentStreak = { start: i, end: i };
        } else {
          currentStreak.end = i;
        }
      } else if (currentStreak) {
        if (currentStreak.end - currentStreak.start >= 2) {
          streaks.push(currentStreak);
        }
        currentStreak = null;
      }
    }

    return streaks;
  }

  private getExamples(hands: HandData[], filter: (h: HandData) => boolean): string[] {
    return hands
      .filter(filter)
      .slice(0, 3)
      .map(h => `Main #${h.id.slice(0, 8)}...`);
  }

  private isLoosePlay(hand: HandData): boolean {
    return hand.equity < 0.3 && hand.actions.some(a => a.type !== ActionType.Fold);
  }

  private isFoldToRaise(hand: HandData): boolean {
    return hand.actions.some(a => a.type === ActionType.Raise) &&
           hand.actions[hand.actions.length - 1].type === ActionType.Fold;
  }

  private isOverCalling(hand: HandData): boolean {
    return hand.actions.filter(a => a.type === ActionType.Call).length > 1;
  }

  private isOverCBet(hand: HandData): boolean {
    return hand.communityCards.length === 3 &&
           hand.actions.some(a => a.type === ActionType.Bet) &&
           hand.equity < 0.4;
  }

  private isFoldToCBet(hand: HandData): boolean {
    return hand.communityCards.length >= 3 &&
           hand.actions.some(a => a.type === ActionType.Bet) &&
           hand.actions[hand.actions.length - 1].type === ActionType.Fold;
  }

  private isMissedValue(hand: HandData): boolean {
    return hand.communityCards.length === 5 &&
           hand.equity > 0.7 &&
           hand.actions[hand.actions.length - 1].type === ActionType.Check;
  }
}
