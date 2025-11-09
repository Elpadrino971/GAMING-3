import { Card } from './types';

/**
 * Position à la table
 */
export enum Position {
  SMALL_BLIND = 'SMALL_BLIND',
  BIG_BLIND = 'BIG_BLIND',
  UTG = 'UTG', // Under the gun
  MP = 'MP',   // Middle position
  CO = 'CO',   // Cutoff
  BTN = 'BTN'  // Button
}

/**
 * Actions possibles
 */
export enum PlayerAction {
  FOLD = 'fold',
  CHECK = 'check',
  CALL = 'call',
  RAISE = 'raise',
  ALL_IN = 'all_in'
}

/**
 * Streets du poker
 */
export enum Street {
  PRE_FLOP = 'PRE_FLOP',
  FLOP = 'FLOP',
  TURN = 'TURN',
  RIVER = 'RIVER',
  SHOWDOWN = 'SHOWDOWN'
}

/**
 * Statut du joueur
 */
export enum PlayerStatus {
  ACTIVE = 'active',       // Peut jouer
  FOLDED = 'folded',       // A fold
  ALL_IN = 'all_in',       // All-in
  SITTING_OUT = 'sitting_out'
}

/**
 * Joueur à la table
 */
export interface Player {
  id: string;
  name: string;
  stack: number;
  position: Position;
  holeCards: Card[];
  status: PlayerStatus;
  currentBet: number;      // Mise actuelle dans ce tour
  totalBet: number;        // Total misé dans cette main
  isDealer: boolean;
  isAI: boolean;
  aiPersonality?: string;  // 'nit', 'tag', 'lag', 'maniac', 'calling_station'
}

/**
 * Action d'un joueur
 */
export interface ActionRecord {
  playerId: string;
  playerName: string;
  action: PlayerAction;
  amount: number;
  street: Street;
  timestamp: number;
  potBefore: number;
  potAfter: number;
}

/**
 * Pot (main ou side)
 */
export interface Pot {
  amount: number;
  eligiblePlayers: string[]; // Player IDs
  type: 'main' | 'side';
}

/**
 * État du jeu
 */
export interface GameState {
  id: string;
  players: Player[];
  deck: Card[];
  communityCards: Card[];
  currentStreet: Street;
  dealerPosition: number;  // Index du dealer
  activePlayerIndex: number; // Index du joueur actif
  smallBlind: number;
  bigBlind: number;
  pots: Pot[];
  currentBet: number;      // Mise à égaler
  minRaise: number;        // Raise minimum
  actionHistory: ActionRecord[];
  handNumber: number;
  winners?: {
    playerId: string;
    playerName: string;
    amount: number;
    handRank: string;
  }[];
}

/**
 * Configuration d'une partie
 */
export interface GameConfig {
  mode: 'cash' | 'sng';    // Cash game ou Sit & Go
  smallBlind: number;
  bigBlind: number;
  startingStack: number;
  maxPlayers: number;
  aiCount: number;         // Nombre d'IA
  aiPersonalities: string[]; // Personnalités des IA
}

/**
 * Options d'action disponibles pour un joueur
 */
export interface ActionOptions {
  canFold: boolean;
  canCheck: boolean;
  canCall: boolean;
  callAmount: number;
  canRaise: boolean;
  minRaise: number;
  maxRaise: number;
  canAllIn: boolean;
}

/**
 * Résultat d'une action
 */
export interface ActionResult {
  success: boolean;
  newState: GameState;
  message?: string;
  error?: string;
  streetComplete?: boolean;
  handComplete?: boolean;
}

/**
 * Stats d'une session
 */
export interface SessionStats {
  handsPlayed: number;
  handsWon: number;
  biggestPot: number;
  totalWinnings: number;
  vpip: number;            // % mains jouées
  pfr: number;             // % raises pré-flop
  aggressionFactor: number;
  currentStack: number;
  startingStack: number;
}

/**
 * Utilitaires pour le GameState
 */
export class GameStateUtils {
  /**
   * Trouve le prochain joueur actif
   */
  static getNextActivePlayer(state: GameState): number {
    const startIndex = (state.activePlayerIndex + 1) % state.players.length;
    let currentIndex = startIndex;

    do {
      const player = state.players[currentIndex];
      if (player.status === PlayerStatus.ACTIVE) {
        return currentIndex;
      }
      currentIndex = (currentIndex + 1) % state.players.length;
    } while (currentIndex !== startIndex);

    return -1; // Aucun joueur actif
  }

  /**
   * Compte les joueurs encore en jeu
   */
  static getActivePlayers(state: GameState): Player[] {
    return state.players.filter(
      p => p.status === PlayerStatus.ACTIVE || p.status === PlayerStatus.ALL_IN
    );
  }

  /**
   * Vérifie si un tour d'enchères est terminé
   */
  static isStreetComplete(state: GameState): boolean {
    const activePlayers = this.getActivePlayers(state);

    // Si moins de 2 joueurs, la street est terminée
    if (activePlayers.length < 2) {
      return true;
    }

    // Tous les joueurs actifs (non all-in) ont misé le même montant
    const playersCanBet = activePlayers.filter(p => p.status === PlayerStatus.ACTIVE);

    if (playersCanBet.length === 0) {
      return true; // Tous all-in
    }

    // Vérifier que tous ont misé le currentBet
    const allBetsEqual = playersCanBet.every(p => p.currentBet === state.currentBet);

    // Et qu'au moins tout le monde a agi une fois
    const allPlayersActed = playersCanBet.every(p => {
      const playerActions = state.actionHistory.filter(
        a => a.playerId === p.id && a.street === state.currentStreet
      );
      return playerActions.length > 0;
    });

    return allBetsEqual && allPlayersActed;
  }

  /**
   * Vérifie si la main est terminée
   */
  static isHandComplete(state: GameState): boolean {
    const activePlayers = this.getActivePlayers(state);

    // Si un seul joueur reste, main terminée
    if (activePlayers.length === 1) {
      return true;
    }

    // Si on est à la river et le tour est fini
    if (state.currentStreet === Street.RIVER && this.isStreetComplete(state)) {
      return true;
    }

    return false;
  }

  /**
   * Calcule le pot total
   */
  static getTotalPot(state: GameState): number {
    return state.pots.reduce((sum, pot) => sum + pot.amount, 0);
  }

  /**
   * Crée un snapshot du state pour l'historique
   */
  static createSnapshot(state: GameState): GameState {
    return JSON.parse(JSON.stringify(state));
  }

  /**
   * Obtient le joueur actif
   */
  static getActivePlayer(state: GameState): Player | null {
    if (state.activePlayerIndex < 0 || state.activePlayerIndex >= state.players.length) {
      return null;
    }
    return state.players[state.activePlayerIndex];
  }

  /**
   * Calcule les options d'action disponibles
   */
  static getActionOptions(state: GameState, playerId: string): ActionOptions {
    const player = state.players.find(p => p.id === playerId);

    if (!player || player.status !== PlayerStatus.ACTIVE) {
      return {
        canFold: false,
        canCheck: false,
        canCall: false,
        callAmount: 0,
        canRaise: false,
        minRaise: 0,
        maxRaise: 0,
        canAllIn: false
      };
    }

    const amountToCall = state.currentBet - player.currentBet;
    const canCheck = amountToCall === 0;
    const canCall = amountToCall > 0 && amountToCall < player.stack;
    const canRaise = player.stack > amountToCall + state.minRaise;
    const canAllIn = player.stack > 0;

    return {
      canFold: state.currentBet > player.currentBet,
      canCheck,
      canCall,
      callAmount: Math.min(amountToCall, player.stack),
      canRaise,
      minRaise: state.minRaise,
      maxRaise: player.stack - amountToCall,
      canAllIn
    };
  }
}
