/**
 * Calculateur GTO (Game Theory Optimal)
 * Implémentation des stratégies théoriquement optimales
 */

import { HandState, GTORecommendation, ActionType, Street, Position } from './types';

export class GTOCalculator {
  /**
   * Calcule la recommandation GTO pour une situation donnée
   */
  calculateGTOAction(state: HandState): GTORecommendation {
    // Calcul de l'équité
    const equity = this.calculateEquity(state);
    const potOdds = this.calculatePotOdds(state);

    // Analyse de la situation
    const isInPosition = this.isInPosition(state.position);
    const effectiveStackSize = state.stackSize / state.pot; // SPR (Stack-to-Pot Ratio)

    // Détermination de l'action GTO
    let action: ActionType;
    let amount: number | undefined;
    let frequency = 1.0;
    let reasoning = '';

    if (state.street === Street.PreFlop) {
      ({ action, amount, frequency, reasoning } = this.calculatePreFlopGTO(state, equity));
    } else {
      ({ action, amount, frequency, reasoning } = this.calculatePostFlopGTO(state, equity, potOdds, isInPosition, effectiveStackSize));
    }

    // Calcul des alternatives
    const alternatives = this.calculateAlternatives(state, equity);

    return {
      action,
      amount,
      frequency,
      reasoning,
      alternatives
    };
  }

  /**
   * Calcule l'équité de la main
   */
  private calculateEquity(state: HandState): number {
    // Simulation Monte Carlo pour calculer l'équité
    // Pour l'instant, estimation basique

    const handStrength = this.evaluateHandStrength(state);
    const boardTexture = this.analyzeBoardTexture(state);

    // Ajustement basé sur le nombre de joueurs
    const playerAdjustment = 1 - (state.numPlayers - 2) * 0.05;

    return Math.min(Math.max(handStrength * boardTexture * playerAdjustment, 0), 1);
  }

  /**
   * Évalue la force de la main
   */
  private evaluateHandStrength(state: HandState): number {
    // Évaluation simplifiée de la force de main
    // Dans une vraie implémentation, utiliser pokersolver ou un moteur dédié

    const { holeCards, communityCards } = state;

    // Cartes premium pre-flop
    if (communityCards.length === 0) {
      return this.evaluatePreFlopStrength(holeCards);
    }

    // Post-flop : évaluation de la combinaison
    return this.evaluatePostFlopStrength(holeCards, communityCards);
  }

  /**
   * Évalue la force pre-flop
   */
  private evaluatePreFlopStrength(holeCards: any[]): number {
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const card1Rank = ranks.indexOf(holeCards[0].rank);
    const card2Rank = ranks.indexOf(holeCards[1].rank);

    const isPair = card1Rank === card2Rank;
    const isSuited = holeCards[0].suit === holeCards[1].suit;
    const maxRank = Math.max(card1Rank, card2Rank);
    const minRank = Math.min(card1Rank, card2Rank);
    const gap = maxRank - minRank;

    let strength = 0;

    // Paires
    if (isPair) {
      strength = 0.5 + (card1Rank / ranks.length) * 0.5;
    } else {
      // Cartes hautes
      strength = (maxRank / ranks.length) * 0.4 + (minRank / ranks.length) * 0.2;

      // Bonus pour suited
      if (isSuited) strength += 0.1;

      // Bonus pour connecteurs
      if (gap <= 1) strength += 0.05;
    }

    return Math.min(strength, 1);
  }

  /**
   * Évalue la force post-flop
   */
  private evaluatePostFlopStrength(holeCards: any[], communityCards: any[]): number {
    // Utilisation de pokersolver pour évaluer la main réelle
    // Pour l'instant, estimation simplifiée

    // Cette fonction devrait utiliser une vraie évaluation de main de poker
    // ex: paire, double paire, brelan, suite, couleur, full, carré, quinte flush

    return 0.5; // Placeholder
  }

  /**
   * Analyse la texture du board
   */
  private analyzeBoardTexture(state: HandState): number {
    if (state.communityCards.length === 0) return 1.0;

    const suits = state.communityCards.map(c => c.suit);
    const ranks = state.communityCards.map(c => c.rank);

    // Détection de flush possible
    const flushPossible = suits.some(suit =>
      suits.filter(s => s === suit).length >= 3
    );

    // Détection de straight possible
    const straightPossible = this.isStraightPossible(ranks);

    // Texture connectée ou non
    let textureMultiplier = 1.0;
    if (flushPossible) textureMultiplier *= 0.9;
    if (straightPossible) textureMultiplier *= 0.9;

    return textureMultiplier;
  }

  /**
   * Vérifie si une suite est possible
   */
  private isStraightPossible(ranks: string[]): boolean {
    const rankValues: { [key: string]: number } = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
      '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };

    const values = ranks.map(r => rankValues[r]).sort((a, b) => a - b);

    for (let i = 0; i < values.length - 1; i++) {
      if (values[i + 1] - values[i] <= 2) {
        return true;
      }
    }

    return false;
  }

  /**
   * Calcule les cotes du pot
   */
  private calculatePotOdds(state: HandState): number {
    if (state.toCall === 0) return 0;
    return state.toCall / (state.pot + state.toCall);
  }

  /**
   * Vérifie si le joueur est en position
   */
  private isInPosition(position: Position): boolean {
    return position === Position.Button || position === Position.Cutoff;
  }

  /**
   * Calcule la stratégie GTO pre-flop
   */
  private calculatePreFlopGTO(state: HandState, equity: number): {
    action: ActionType;
    amount?: number;
    frequency: number;
    reasoning: string;
  } {
    const hasRaise = state.actions.some(a =>
      a.type === ActionType.Raise || a.type === ActionType.Bet
    );

    // Stratégie basée sur l'équité et la position
    if (equity > 0.7) {
      // Main premium : toujours raise/3-bet
      return {
        action: hasRaise ? ActionType.Raise : ActionType.Raise,
        amount: hasRaise ? state.toCall * 3 : state.pot * 3,
        frequency: 1.0,
        reasoning: 'Main premium - Raise pour construire le pot et isoler'
      };
    } else if (equity > 0.5) {
      // Main forte : raise ou call selon la position
      if (this.isInPosition(state.position)) {
        return {
          action: hasRaise ? ActionType.Call : ActionType.Raise,
          amount: hasRaise ? undefined : state.pot * 3,
          frequency: 0.8,
          reasoning: 'Main forte en position - Raise ou call pour garder la position'
        };
      } else {
        return {
          action: ActionType.Call,
          frequency: 0.7,
          reasoning: 'Main forte hors position - Call pour voir le flop'
        };
      }
    } else if (equity > 0.3) {
      // Main moyenne : call ou fold selon le prix
      const potOdds = this.calculatePotOdds(state);
      if (equity > potOdds) {
        return {
          action: ActionType.Call,
          frequency: 0.6,
          reasoning: 'Main moyenne avec bonnes cotes - Call'
        };
      }
    }

    // Main faible : fold
    return {
      action: ActionType.Fold,
      frequency: 1.0,
      reasoning: 'Main trop faible pour continuer'
    };
  }

  /**
   * Calcule la stratégie GTO post-flop
   */
  private calculatePostFlopGTO(
    state: HandState,
    equity: number,
    potOdds: number,
    isInPosition: boolean,
    spr: number
  ): {
    action: ActionType;
    amount?: number;
    frequency: number;
    reasoning: string;
  } {
    const lastAction = state.actions[state.actions.length - 1];
    const facingBet = lastAction && (lastAction.type === ActionType.Bet || lastAction.type === ActionType.Raise);

    // Très forte main
    if (equity > 0.8) {
      if (facingBet) {
        return {
          action: ActionType.Raise,
          amount: state.toCall * 3,
          frequency: 0.9,
          reasoning: 'Main très forte - Raise pour maximiser la value'
        };
      } else {
        return {
          action: ActionType.Bet,
          amount: state.pot * 0.66,
          frequency: 0.95,
          reasoning: 'Main très forte - Bet pour extraire de la value'
        };
      }
    }

    // Main forte
    if (equity > 0.6) {
      if (facingBet) {
        if (equity > potOdds + 0.1) {
          return {
            action: ActionType.Call,
            frequency: 0.8,
            reasoning: 'Main forte avec bonnes cotes implicites - Call'
          };
        }
      } else {
        return {
          action: ActionType.Bet,
          amount: state.pot * 0.5,
          frequency: 0.7,
          reasoning: 'Main forte - Bet pour construire le pot'
        };
      }
    }

    // Main moyenne/tirage
    if (equity > 0.35) {
      if (facingBet) {
        if (equity > potOdds) {
          return {
            action: ActionType.Call,
            frequency: 0.6,
            reasoning: 'Tirage avec bonnes cotes du pot - Call'
          };
        }
      } else if (isInPosition) {
        // Bluff possible en position
        return {
          action: ActionType.Bet,
          amount: state.pot * 0.5,
          frequency: 0.3,
          reasoning: 'Bluff semi-bluff en position'
        };
      }
    }

    // Main faible
    if (facingBet) {
      return {
        action: ActionType.Fold,
        frequency: 1.0,
        reasoning: 'Main trop faible face à une mise'
      };
    } else {
      return {
        action: ActionType.Check,
        frequency: 1.0,
        reasoning: 'Main faible - Check pour voir la carte gratuite'
      };
    }
  }

  /**
   * Calcule les actions alternatives avec leurs EV
   */
  private calculateAlternatives(state: HandState, equity: number) {
    // Calcul simplifié des EV pour chaque action possible
    const alternatives = [];

    // Fold
    alternatives.push({
      action: ActionType.Fold,
      frequency: 0,
      ev: 0
    });

    // Call
    if (state.toCall > 0) {
      const callEV = equity * (state.pot + state.toCall) - state.toCall;
      alternatives.push({
        action: ActionType.Call,
        amount: state.toCall,
        frequency: 0,
        ev: callEV
      });
    }

    // Bet/Raise
    const betSize = state.pot * 0.66;
    const raiseEV = equity * (state.pot + betSize * 2) - betSize;
    alternatives.push({
      action: state.toCall > 0 ? ActionType.Raise : ActionType.Bet,
      amount: betSize,
      frequency: 0,
      ev: raiseEV
    });

    return alternatives.sort((a, b) => b.ev - a.ev);
  }
}
