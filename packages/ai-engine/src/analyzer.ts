/**
 * Analyseur principal de mains
 * Combine GTO, range analysis et statistiques
 */

import { GTOCalculator } from './gto-calculator';
import { RangeAnalyzer } from './range-analyzer';
import {
  HandState,
  HandAnalysis,
  Mistake,
  MistakeType,
  Severity,
  Action,
  ActionType
} from './types';

export class HandAnalyzer {
  private gtoCalculator: GTOCalculator;
  private rangeAnalyzer: RangeAnalyzer;

  constructor() {
    this.gtoCalculator = new GTOCalculator();
    this.rangeAnalyzer = new RangeAnalyzer();
  }

  /**
   * Analyse complète d'une main
   */
  async analyzeHand(state: HandState, playerDecision: Action): Promise<HandAnalysis> {
    // Calcul GTO
    const gtoRecommendation = this.gtoCalculator.calculateGTOAction(state);

    // Calcul de l'équité
    const equity = this.calculateEquity(state);

    // Calcul des cotes
    const potOdds = this.calculatePotOdds(state);
    const impliedOdds = this.calculateImpliedOdds(state, equity);

    // Évaluation de la décision du joueur
    const { isOptimal, optimality, mistakes } = this.evaluateDecision(
      playerDecision,
      gtoRecommendation,
      state
    );

    // Génération des suggestions
    const suggestions = this.generateSuggestions(mistakes, gtoRecommendation, state);

    // Calcul de l'EV (Expected Value)
    const expectedValue = this.calculateExpectedValue(state, playerDecision, equity);

    return {
      equity,
      potOdds,
      impliedOdds,
      gtoRecommendation,
      playerDecision,
      isOptimal,
      optimality,
      mistakes,
      suggestions,
      expectedValue
    };
  }

  /**
   * Calcule l'équité de la main
   */
  private calculateEquity(state: HandState): number {
    // Utilisation du calculateur GTO
    // Dans une vraie implémentation, simulation Monte Carlo
    return 0.5; // Placeholder
  }

  /**
   * Calcule les cotes du pot
   */
  private calculatePotOdds(state: HandState): number {
    if (state.toCall === 0) return 0;
    return state.toCall / (state.pot + state.toCall);
  }

  /**
   * Calcule les cotes implicites
   */
  private calculateImpliedOdds(state: HandState, equity: number): number {
    // Les cotes implicites prennent en compte l'argent futur qu'on peut gagner
    const potentialFutureWinnings = Math.min(
      state.stackSize * 0.3, // Maximum 30% du stack
      state.pot * 2 // Maximum 2x le pot actuel
    );

    const impliedPot = state.pot + potentialFutureWinnings;
    return state.toCall / impliedPot;
  }

  /**
   * Évalue la décision du joueur
   */
  private evaluateDecision(
    playerDecision: Action,
    gtoRecommendation: any,
    state: HandState
  ): {
    isOptimal: boolean;
    optimality: number;
    mistakes: Mistake[];
  } {
    const mistakes: Mistake[] = [];
    let optimality = 1.0;

    // Comparaison de l'action
    const isCorrectAction = playerDecision.type === gtoRecommendation.action;

    if (!isCorrectAction) {
      // L'action est différente de la recommandation GTO
      const mistake = this.identifyMistake(playerDecision, gtoRecommendation, state);
      mistakes.push(mistake);
      optimality -= mistake.severity === Severity.Critical ? 0.5 :
                     mistake.severity === Severity.Major ? 0.3 :
                     mistake.severity === Severity.Moderate ? 0.2 : 0.1;
    }

    // Vérification du sizing (pour bet/raise)
    if (
      (playerDecision.type === ActionType.Bet || playerDecision.type === ActionType.Raise) &&
      playerDecision.amount &&
      gtoRecommendation.amount
    ) {
      const sizingError = Math.abs(playerDecision.amount - gtoRecommendation.amount) / gtoRecommendation.amount;

      if (sizingError > 0.5) {
        mistakes.push({
          type: MistakeType.SizingError,
          severity: sizingError > 1.0 ? Severity.Major : Severity.Moderate,
          description: `Sizing sous-optimal : ${playerDecision.amount} au lieu de ${gtoRecommendation.amount}`,
          betterAction: playerDecision.type,
          evLoss: sizingError * state.pot * 0.1
        });
        optimality -= sizingError * 0.2;
      }
    }

    return {
      isOptimal: mistakes.length === 0,
      optimality: Math.max(optimality, 0),
      mistakes
    };
  }

  /**
   * Identifie le type d'erreur commise
   */
  private identifyMistake(
    playerDecision: Action,
    gtoRecommendation: any,
    state: HandState
  ): Mistake {
    const equity = this.calculateEquity(state);
    const potOdds = this.calculatePotOdds(state);

    // Fold quand on devrait call/raise
    if (playerDecision.type === ActionType.Fold &&
        (gtoRecommendation.action === ActionType.Call || gtoRecommendation.action === ActionType.Raise)) {
      return {
        type: MistakeType.PoorFold,
        severity: equity > 0.6 ? Severity.Critical : Severity.Major,
        description: `Fold avec ${(equity * 100).toFixed(1)}% d'équité`,
        betterAction: gtoRecommendation.action,
        evLoss: equity * state.pot
      };
    }

    // Call quand on devrait fold
    if (playerDecision.type === ActionType.Call &&
        gtoRecommendation.action === ActionType.Fold) {
      return {
        type: MistakeType.PoorCall,
        severity: equity < 0.2 ? Severity.Critical : Severity.Moderate,
        description: `Call avec seulement ${(equity * 100).toFixed(1)}% d'équité et ${(potOdds * 100).toFixed(1)}% de pot odds`,
        betterAction: ActionType.Fold,
        evLoss: state.toCall * (1 - equity)
      };
    }

    // Call quand on devrait raise (missed value)
    if (playerDecision.type === ActionType.Call &&
        gtoRecommendation.action === ActionType.Raise) {
      return {
        type: MistakeType.MissedValue,
        severity: Severity.Moderate,
        description: `Call au lieu de raise avec main forte`,
        betterAction: ActionType.Raise,
        evLoss: state.pot * 0.3
      };
    }

    // Bet/Raise quand on devrait fold (bluff excessif)
    if ((playerDecision.type === ActionType.Bet || playerDecision.type === ActionType.Raise) &&
        gtoRecommendation.action === ActionType.Fold) {
      return {
        type: MistakeType.OverBluff,
        severity: Severity.Major,
        description: `Bluff avec main trop faible`,
        betterAction: ActionType.Fold,
        evLoss: playerDecision.amount || state.pot * 0.5
      };
    }

    // Check/Call quand on devrait bet (under-bluff ou missed value)
    if ((playerDecision.type === ActionType.Check || playerDecision.type === ActionType.Call) &&
        gtoRecommendation.action === ActionType.Bet) {
      return {
        type: equity > 0.6 ? MistakeType.MissedValue : MistakeType.UnderBluff,
        severity: Severity.Minor,
        description: `Passivité excessive`,
        betterAction: ActionType.Bet,
        evLoss: state.pot * 0.2
      };
    }

    // Erreur générique
    return {
      type: MistakeType.PoorCall,
      severity: Severity.Minor,
      description: `Décision sous-optimale`,
      betterAction: gtoRecommendation.action,
      evLoss: 0
    };
  }

  /**
   * Génère des suggestions d'amélioration
   */
  private generateSuggestions(
    mistakes: Mistake[],
    gtoRecommendation: any,
    state: HandState
  ): string[] {
    const suggestions: string[] = [];

    if (mistakes.length === 0) {
      suggestions.push('✓ Décision optimale ! Continue comme ça.');
      return suggestions;
    }

    mistakes.forEach(mistake => {
      switch (mistake.type) {
        case MistakeType.PoorFold:
          suggestions.push(
            `Tu as fold une main rentable. ${gtoRecommendation.reasoning}`
          );
          break;

        case MistakeType.PoorCall:
          suggestions.push(
            `Ce call n'était pas rentable. Tu n'avais pas les bonnes cotes du pot.`
          );
          suggestions.push(
            `Pot odds: ${(this.calculatePotOdds(state) * 100).toFixed(1)}% < Équité nécessaire`
          );
          break;

        case MistakeType.MissedValue:
          suggestions.push(
            `Tu as manqué de l'EV en ne bet/raise pas une main forte.`
          );
          suggestions.push(
            `Avec une main forte, il faut construire le pot pour maximiser les gains.`
          );
          break;

        case MistakeType.OverBluff:
          suggestions.push(
            `Bluff trop fréquent ou dans une mauvaise situation.`
          );
          suggestions.push(
            `Assure-toi d'avoir une story cohérente et des fold equity suffisantes.`
          );
          break;

        case MistakeType.UnderBluff:
          suggestions.push(
            `Tu pourrais bluffer plus souvent dans cette situation.`
          );
          suggestions.push(
            `La texture du board et ta range permettent un bluff profitable.`
          );
          break;

        case MistakeType.SizingError:
          suggestions.push(
            `Ton sizing n'est pas optimal. ${gtoRecommendation.reasoning}`
          );
          break;

        default:
          suggestions.push(
            `Revois cette décision. ${gtoRecommendation.reasoning}`
          );
      }
    });

    return suggestions;
  }

  /**
   * Calcule l'Expected Value d'une action
   */
  private calculateExpectedValue(
    state: HandState,
    action: Action,
    equity: number
  ): number {
    switch (action.type) {
      case ActionType.Fold:
        return 0;

      case ActionType.Check:
        return equity * state.pot;

      case ActionType.Call:
        return equity * (state.pot + state.toCall) - state.toCall;

      case ActionType.Bet:
      case ActionType.Raise:
        const betAmount = action.amount || state.pot * 0.5;
        // EV simplifié (assume une fréquence de fold de l'adversaire)
        const foldFrequency = 0.3; // Placeholder
        const callFrequency = 1 - foldFrequency;

        const evWhenFolds = state.pot;
        const evWhenCalls = equity * (state.pot + betAmount * 2) - betAmount;

        return foldFrequency * evWhenFolds + callFrequency * evWhenCalls;

      default:
        return 0;
    }
  }
}
