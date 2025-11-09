import { GameState, Player, PlayerAction, Street, GameStateUtils } from '@pokermind/poker-engine';

/**
 * Profil de personnalité IA
 */
export interface AIPersonality {
  name: string;
  vpip: number;          // % de mains jouées (0-100)
  pfr: number;           // % de raises pré-flop (0-100)
  aggression: number;    // Facteur d'aggression (0-5)
  threebet: number;      // % de 3-bets (0-100)
  cbet: number;          // % de continuation bets (0-100)
  bluffFrequency: number; // Fréquence de bluff (0-1)
  callDownFrequency: number; // Tendance à call jusqu'au bout (0-1)
}

/**
 * Personnalités prédéfinies
 */
export const AI_PERSONALITIES: Record<string, AIPersonality> = {
  nit: {
    name: 'Nit (Ultra Tight)',
    vpip: 15,
    pfr: 12,
    aggression: 1.5,
    threebet: 3,
    cbet: 50,
    bluffFrequency: 0.1,
    callDownFrequency: 0.2
  },

  tag: {
    name: 'TAG (Tight-Aggressive)',
    vpip: 25,
    pfr: 20,
    aggression: 3.0,
    threebet: 8,
    cbet: 70,
    bluffFrequency: 0.3,
    callDownFrequency: 0.4
  },

  lag: {
    name: 'LAG (Loose-Aggressive)',
    vpip: 35,
    pfr: 28,
    aggression: 4.0,
    threebet: 12,
    cbet: 80,
    bluffFrequency: 0.5,
    callDownFrequency: 0.5
  },

  maniac: {
    name: 'Maniac',
    vpip: 60,
    pfr: 45,
    aggression: 5.0,
    threebet: 25,
    cbet: 90,
    bluffFrequency: 0.7,
    callDownFrequency: 0.6
  },

  calling_station: {
    name: 'Calling Station',
    vpip: 50,
    pfr: 10,
    aggression: 0.8,
    threebet: 2,
    cbet: 30,
    bluffFrequency: 0.05,
    callDownFrequency: 0.9
  }
};

/**
 * Force de la main (approximation simple)
 */
interface HandStrength {
  score: number; // 0-1000
  category: 'premium' | 'strong' | 'medium' | 'weak' | 'trash';
}

/**
 * Décision IA
 */
export interface AIDecision {
  action: PlayerAction;
  amount: number;
  reasoning: string;
  confidence: number; // 0-1
}

/**
 * Moteur de décision IA pour le poker
 */
export class AIPlayer {
  private personality: AIPersonality;
  private playerId: string;

  constructor(personalityType: string, playerId: string) {
    this.personality = AI_PERSONALITIES[personalityType] || AI_PERSONALITIES.tag;
    this.playerId = playerId;
  }

  /**
   * Prend une décision basée sur l'état du jeu
   */
  makeDecision(state: GameState): AIDecision {
    const player = state.players.find(p => p.id === this.playerId);

    if (!player) {
      return {
        action: PlayerAction.FOLD,
        amount: 0,
        reasoning: 'Player not found',
        confidence: 1.0
      };
    }

    const handStrength = this.evaluateHandStrength(player, state);
    const position = this.getPosition(player, state);
    const potOdds = this.calculatePotOdds(state, player);
    const options = GameStateUtils.getActionOptions(state, this.playerId);

    // Décision basée sur la street
    switch (state.currentStreet) {
      case Street.PRE_FLOP:
        return this.decidePreflopAction(handStrength, position, options, state, player);

      case Street.FLOP:
      case Street.TURN:
      case Street.RIVER:
        return this.decidePostflopAction(handStrength, potOdds, options, state, player);

      default:
        return {
          action: PlayerAction.FOLD,
          amount: 0,
          reasoning: 'Invalid street',
          confidence: 1.0
        };
    }
  }

  /**
   * Décision pré-flop
   */
  private decidePreflopAction(
    handStrength: HandStrength,
    position: 'early' | 'middle' | 'late',
    options: any,
    state: GameState,
    player: Player
  ): AIDecision {
    const random = Math.random() * 100;

    // Trash hand
    if (handStrength.category === 'trash') {
      // Nit/TAG fold presque toujours
      if (this.personality.vpip < 30 && random > this.personality.vpip) {
        return {
          action: PlayerAction.FOLD,
          amount: 0,
          reasoning: 'Trash hand, folding',
          confidence: 0.9
        };
      }

      // Maniac/LAG peut bluff en position tardive
      if (position === 'late' && random < this.personality.bluffFrequency * 100) {
        return this.decideRaise(options, state, 'Bluff raise from late position');
      }

      // Calling station call souvent
      if (this.personality.callDownFrequency > 0.7 && options.canCall) {
        return {
          action: PlayerAction.CALL,
          amount: options.callAmount,
          reasoning: 'Calling station tendency',
          confidence: 0.5
        };
      }

      return {
        action: PlayerAction.FOLD,
        amount: 0,
        reasoning: 'Weak hand, folding',
        confidence: 0.8
      };
    }

    // Premium/Strong hands
    if (handStrength.category === 'premium' || handStrength.category === 'strong') {
      // Raise en fonction du PFR
      if (random < this.personality.pfr) {
        return this.decideRaise(options, state, `Strong hand (${handStrength.category}), raising`);
      }

      // Sinon call
      if (options.canCall) {
        return {
          action: PlayerAction.CALL,
          amount: options.callAmount,
          reasoning: 'Strong hand, calling',
          confidence: 0.8
        };
      }

      if (options.canCheck) {
        return {
          action: PlayerAction.CHECK,
          amount: 0,
          reasoning: 'Strong hand, checking',
          confidence: 0.7
        };
      }
    }

    // Medium hands
    if (handStrength.category === 'medium') {
      // Position tardive : plus agressif
      if (position === 'late' && random < this.personality.vpip) {
        if (random < this.personality.pfr && options.canRaise) {
          return this.decideRaise(options, state, 'Medium hand, late position raise');
        }

        if (options.canCall) {
          return {
            action: PlayerAction.CALL,
            amount: options.callAmount,
            reasoning: 'Medium hand, late position call',
            confidence: 0.6
          };
        }
      }

      // Position early/middle : plus prudent
      if (options.canCheck) {
        return {
          action: PlayerAction.CHECK,
          amount: 0,
          reasoning: 'Medium hand, checking',
          confidence: 0.6
        };
      }

      if (options.canCall && random < this.personality.vpip / 2) {
        return {
          action: PlayerAction.CALL,
          amount: options.callAmount,
          reasoning: 'Medium hand, calling',
          confidence: 0.5
        };
      }
    }

    // Default : fold
    return {
      action: PlayerAction.FOLD,
      amount: 0,
      reasoning: 'No good action, folding',
      confidence: 0.7
    };
  }

  /**
   * Décision post-flop
   */
  private decidePostflopAction(
    handStrength: HandStrength,
    potOdds: number,
    options: any,
    state: GameState,
    player: Player
  ): AIDecision {
    const random = Math.random();

    // Premium hand : toujours agressif
    if (handStrength.category === 'premium') {
      if (options.canRaise && random < this.personality.aggression / 5) {
        return this.decideRaise(options, state, 'Premium hand, raising for value');
      }

      if (options.canCall) {
        return {
          action: PlayerAction.CALL,
          amount: options.callAmount,
          reasoning: 'Premium hand, calling',
          confidence: 0.9
        };
      }

      if (options.canCheck) {
        return {
          action: PlayerAction.CHECK,
          amount: 0,
          reasoning: 'Premium hand, slow playing',
          confidence: 0.8
        };
      }
    }

    // Strong hand
    if (handStrength.category === 'strong') {
      // C-bet si on a été l'agresseur pré-flop
      const wasAggressor = this.wasLastAggressor(state, player);

      if (wasAggressor && random < this.personality.cbet / 100) {
        if (options.canRaise) {
          return this.decideRaise(options, state, 'Continuation bet');
        }
      }

      if (options.canCall && potOdds > 2.0) {
        return {
          action: PlayerAction.CALL,
          amount: options.callAmount,
          reasoning: 'Strong hand with good pot odds',
          confidence: 0.7
        };
      }

      if (options.canCheck) {
        return {
          action: PlayerAction.CHECK,
          amount: 0,
          reasoning: 'Strong hand, checking',
          confidence: 0.6
        };
      }
    }

    // Medium hand : dépend des pot odds
    if (handStrength.category === 'medium') {
      if (options.canCheck) {
        return {
          action: PlayerAction.CHECK,
          amount: 0,
          reasoning: 'Medium hand, checking',
          confidence: 0.6
        };
      }

      if (options.canCall && potOdds > 3.0) {
        return {
          action: PlayerAction.CALL,
          amount: options.callAmount,
          reasoning: 'Medium hand with decent pot odds',
          confidence: 0.5
        };
      }

      // Bluff occasionnel
      if (random < this.personality.bluffFrequency && options.canRaise) {
        return this.decideRaise(options, state, 'Bluff with medium hand');
      }
    }

    // Weak/trash : fold sauf calling station
    if (this.personality.callDownFrequency > 0.7 && options.canCall) {
      return {
        action: PlayerAction.CALL,
        amount: options.callAmount,
        reasoning: 'Calling station never folds',
        confidence: 0.4
      };
    }

    if (options.canCheck) {
      return {
        action: PlayerAction.CHECK,
        amount: 0,
        reasoning: 'Weak hand, checking',
        confidence: 0.6
      };
    }

    return {
      action: PlayerAction.FOLD,
      amount: 0,
      reasoning: 'Weak hand, folding',
      confidence: 0.8
    };
  }

  /**
   * Décide du montant d'un raise
   */
  private decideRaise(options: any, state: GameState, reasoning: string): AIDecision {
    if (!options.canRaise) {
      // Fallback to call
      if (options.canCall) {
        return {
          action: PlayerAction.CALL,
          amount: options.callAmount,
          reasoning: 'Wanted to raise but can only call',
          confidence: 0.7
        };
      }
      return {
        action: PlayerAction.CHECK,
        amount: 0,
        reasoning: 'Wanted to raise but can only check',
        confidence: 0.6
      };
    }

    // Taille du raise basée sur la personnalité
    const pot = GameStateUtils.getTotalPot(state);
    let raiseSize: number;

    if (this.personality.aggression > 4) {
      // Maniac : gros raise
      raiseSize = state.currentBet + pot * 0.8;
    } else if (this.personality.aggression > 3) {
      // LAG : raise moyen
      raiseSize = state.currentBet + pot * 0.6;
    } else {
      // TAG/Nit : raise standard
      raiseSize = state.currentBet + pot * 0.5;
    }

    // Clamp entre min et max
    raiseSize = Math.max(options.minRaise, Math.min(raiseSize, options.maxRaise));
    raiseSize = Math.floor(raiseSize);

    return {
      action: PlayerAction.RAISE,
      amount: state.currentBet + raiseSize,
      reasoning,
      confidence: 0.7
    };
  }

  /**
   * Évalue la force de la main (approximation simple)
   */
  private evaluateHandStrength(player: Player, state: GameState): HandStrength {
    if (player.holeCards.length !== 2) {
      return { score: 0, category: 'trash' };
    }

    const card1 = player.holeCards[0];
    const card2 = player.holeCards[1];

    const rankValues: Record<string, number> = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
      '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };

    const val1 = rankValues[card1.rank];
    const val2 = rankValues[card2.rank];
    const isPair = val1 === val2;
    const isSuited = card1.suit === card2.suit;
    const highCard = Math.max(val1, val2);
    const lowCard = Math.min(val1, val2);

    let score = highCard * 10 + lowCard;

    // Bonus pour paire
    if (isPair) {
      score += 100;
      if (highCard >= 10) score += 200; // Premium pairs (TT+)
      if (highCard >= 13) score += 100; // KK, AA
    }

    // Bonus pour suited
    if (isSuited) score += 20;

    // Bonus pour connecteurs
    if (Math.abs(val1 - val2) <= 2) score += 10;

    // Catégorisation
    let category: HandStrength['category'];
    if (score >= 400) category = 'premium'; // AA, KK, QQ, AKs
    else if (score >= 300) category = 'strong'; // JJ, TT, AQs, AKo
    else if (score >= 200) category = 'medium'; // Petites paires, suited connectors
    else if (score >= 100) category = 'weak';   // Face cards, marginal
    else category = 'trash';

    return { score, category };
  }

  /**
   * Détermine la position (early, middle, late)
   */
  private getPosition(player: Player, state: GameState): 'early' | 'middle' | 'late' {
    const playerIndex = state.players.indexOf(player);
    const dealerIndex = state.dealerPosition;
    const totalPlayers = state.players.length;

    const positionFromDealer = (playerIndex - dealerIndex + totalPlayers) % totalPlayers;

    if (positionFromDealer <= 2) return 'late';   // BTN, SB, BB
    if (positionFromDealer >= totalPlayers - 2) return 'early'; // UTG
    return 'middle';
  }

  /**
   * Calcule les pot odds
   */
  private calculatePotOdds(state: GameState, player: Player): number {
    const pot = GameStateUtils.getTotalPot(state);
    const toCall = state.currentBet - player.currentBet;

    if (toCall <= 0) return 999; // Pas besoin de payer

    return pot / toCall;
  }

  /**
   * Vérifie si le joueur était le dernier agresseur
   */
  private wasLastAggressor(state: GameState, player: Player): boolean {
    const lastAction = state.actionHistory
      .filter(a => a.street === state.currentStreet - 1) // Street précédente
      .reverse()
      .find(a => a.action === PlayerAction.RAISE);

    return lastAction?.playerId === player.id;
  }

  /**
   * Obtient la personnalité
   */
  getPersonality(): AIPersonality {
    return this.personality;
  }
}
