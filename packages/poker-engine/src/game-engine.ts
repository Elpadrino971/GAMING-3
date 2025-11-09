import { Deck } from './deck';
import { HandEvaluator } from './hand-evaluator';
import {
  GameState,
  GameConfig,
  Player,
  PlayerAction,
  PlayerStatus,
  Position,
  Street,
  Pot,
  ActionRecord,
  ActionResult,
  GameStateUtils
} from './game-state';

/**
 * Moteur de jeu de poker
 */
export class GameEngine {
  private state: GameState;
  private deck: Deck;
  private handEvaluator: HandEvaluator;

  constructor(config: GameConfig) {
    this.deck = new Deck();
    this.handEvaluator = new HandEvaluator();
    this.state = this.initializeGame(config);
  }

  /**
   * Initialise une nouvelle partie
   */
  private initializeGame(config: GameConfig): GameState {
    const players: Player[] = [];

    // Créer le joueur humain
    players.push({
      id: 'human',
      name: 'You',
      stack: config.startingStack,
      position: Position.BTN,
      holeCards: [],
      status: PlayerStatus.ACTIVE,
      currentBet: 0,
      totalBet: 0,
      isDealer: true,
      isAI: false
    });

    // Créer les joueurs IA
    const positions = [Position.SMALL_BLIND, Position.BIG_BLIND, Position.UTG, Position.MP, Position.CO];

    for (let i = 0; i < config.aiCount; i++) {
      const personality = config.aiPersonalities[i] || 'tag';
      players.push({
        id: `ai_${i}`,
        name: this.getAIName(personality, i),
        stack: config.startingStack,
        position: positions[i],
        holeCards: [],
        status: PlayerStatus.ACTIVE,
        currentBet: 0,
        totalBet: 0,
        isDealer: false,
        isAI: true,
        aiPersonality: personality
      });
    }

    return {
      id: `game_${Date.now()}`,
      players,
      deck: [],
      communityCards: [],
      currentStreet: Street.PRE_FLOP,
      dealerPosition: 0,
      activePlayerIndex: -1,
      smallBlind: config.smallBlind,
      bigBlind: config.bigBlind,
      pots: [],
      currentBet: config.bigBlind,
      minRaise: config.bigBlind,
      actionHistory: [],
      handNumber: 1
    };
  }

  /**
   * Génère un nom pour l'IA basé sur sa personnalité
   */
  private getAIName(personality: string, index: number): string {
    const names: Record<string, string[]> = {
      nit: ['Rock', 'Fortress', 'Guardian'],
      tag: ['Strategist', 'Calculator', 'Tactician'],
      lag: ['Aggressor', 'Shark', 'Hunter'],
      maniac: ['Wildcard', 'Chaos', 'Blitz'],
      calling_station: ['Caller', 'Sticky', 'Tank']
    };

    const nameList = names[personality] || names.tag;
    return nameList[index % nameList.length];
  }

  /**
   * Démarre une nouvelle main
   */
  startNewHand(): GameState {
    // Reset des joueurs
    this.state.players.forEach(player => {
      player.holeCards = [];
      player.currentBet = 0;
      player.totalBet = 0;
      if (player.stack > 0) {
        player.status = PlayerStatus.ACTIVE;
      } else {
        player.status = PlayerStatus.SITTING_OUT;
      }
    });

    // Rotation du dealer
    this.state.dealerPosition = (this.state.dealerPosition + 1) % this.state.players.length;
    this.state.players.forEach((p, i) => {
      p.isDealer = i === this.state.dealerPosition;
    });

    // Reset state
    this.state.communityCards = [];
    this.state.currentStreet = Street.PRE_FLOP;
    this.state.pots = [{ amount: 0, eligiblePlayers: this.state.players.map(p => p.id), type: 'main' }];
    this.state.actionHistory = [];
    this.state.currentBet = this.state.bigBlind;
    this.state.minRaise = this.state.bigBlind;

    // Nouveau deck
    this.deck.shuffle();

    // Poster les blinds
    this.postBlinds();

    // Distribuer les cartes
    this.dealHoleCards();

    // Premier joueur après les blinds (UTG)
    const bigBlindIndex = (this.state.dealerPosition + 2) % this.state.players.length;
    this.state.activePlayerIndex = (bigBlindIndex + 1) % this.state.players.length;

    // Trouver le prochain joueur actif
    this.state.activePlayerIndex = GameStateUtils.getNextActivePlayer(this.state);

    this.state.handNumber++;

    return this.getState();
  }

  /**
   * Poster les blinds
   */
  private postBlinds(): void {
    const activePlayers = this.state.players.filter(p => p.status === PlayerStatus.ACTIVE);

    if (activePlayers.length < 2) return;

    // Small blind (dealer + 1)
    const sbIndex = (this.state.dealerPosition + 1) % this.state.players.length;
    const sbPlayer = this.state.players[sbIndex];
    const sbAmount = Math.min(this.state.smallBlind, sbPlayer.stack);
    sbPlayer.stack -= sbAmount;
    sbPlayer.currentBet = sbAmount;
    sbPlayer.totalBet = sbAmount;
    this.state.pots[0].amount += sbAmount;

    // Big blind (dealer + 2)
    const bbIndex = (this.state.dealerPosition + 2) % this.state.players.length;
    const bbPlayer = this.state.players[bbIndex];
    const bbAmount = Math.min(this.state.bigBlind, bbPlayer.stack);
    bbPlayer.stack -= bbAmount;
    bbPlayer.currentBet = bbAmount;
    bbPlayer.totalBet = bbAmount;
    this.state.pots[0].amount += bbAmount;

    // Enregistrer les actions
    this.state.actionHistory.push({
      playerId: sbPlayer.id,
      playerName: sbPlayer.name,
      action: PlayerAction.RAISE,
      amount: sbAmount,
      street: Street.PRE_FLOP,
      timestamp: Date.now(),
      potBefore: 0,
      potAfter: sbAmount
    });

    this.state.actionHistory.push({
      playerId: bbPlayer.id,
      playerName: bbPlayer.name,
      action: PlayerAction.RAISE,
      amount: bbAmount,
      street: Street.PRE_FLOP,
      timestamp: Date.now(),
      potBefore: sbAmount,
      potAfter: sbAmount + bbAmount
    });
  }

  /**
   * Distribue les cartes fermées
   */
  private dealHoleCards(): void {
    for (let i = 0; i < 2; i++) {
      for (const player of this.state.players) {
        if (player.status === PlayerStatus.ACTIVE) {
          player.holeCards.push(this.deck.deal());
        }
      }
    }
  }

  /**
   * Traite une action joueur
   */
  processAction(playerId: string, action: PlayerAction, amount: number = 0): ActionResult {
    const player = this.state.players.find(p => p.id === playerId);

    if (!player) {
      return { success: false, newState: this.state, error: 'Player not found' };
    }

    if (this.state.activePlayerIndex !== this.state.players.indexOf(player)) {
      return { success: false, newState: this.state, error: 'Not your turn' };
    }

    const potBefore = GameStateUtils.getTotalPot(this.state);

    // Traiter l'action
    switch (action) {
      case PlayerAction.FOLD:
        player.status = PlayerStatus.FOLDED;
        break;

      case PlayerAction.CHECK:
        // Rien à faire
        break;

      case PlayerAction.CALL:
        const callAmount = Math.min(
          this.state.currentBet - player.currentBet,
          player.stack
        );
        player.stack -= callAmount;
        player.currentBet += callAmount;
        player.totalBet += callAmount;
        this.state.pots[0].amount += callAmount;

        if (player.stack === 0) {
          player.status = PlayerStatus.ALL_IN;
        }
        break;

      case PlayerAction.RAISE:
        const totalRaise = amount;
        const raiseAmount = totalRaise - player.currentBet;

        if (raiseAmount > player.stack) {
          return { success: false, newState: this.state, error: 'Insufficient chips' };
        }

        player.stack -= raiseAmount;
        player.currentBet = totalRaise;
        player.totalBet += raiseAmount;
        this.state.pots[0].amount += raiseAmount;
        this.state.currentBet = totalRaise;
        this.state.minRaise = totalRaise - (this.state.currentBet - this.state.minRaise);

        if (player.stack === 0) {
          player.status = PlayerStatus.ALL_IN;
        }
        break;

      case PlayerAction.ALL_IN:
        const allInAmount = player.stack;
        player.currentBet += allInAmount;
        player.totalBet += allInAmount;
        player.stack = 0;
        player.status = PlayerStatus.ALL_IN;
        this.state.pots[0].amount += allInAmount;

        if (player.currentBet > this.state.currentBet) {
          this.state.currentBet = player.currentBet;
        }
        break;
    }

    // Enregistrer l'action
    const potAfter = GameStateUtils.getTotalPot(this.state);
    this.state.actionHistory.push({
      playerId: player.id,
      playerName: player.name,
      action,
      amount,
      street: this.state.currentStreet,
      timestamp: Date.now(),
      potBefore,
      potAfter
    });

    // Vérifier si le tour est terminé
    const streetComplete = GameStateUtils.isStreetComplete(this.state);
    const handComplete = GameStateUtils.isHandComplete(this.state);

    if (handComplete) {
      this.determineWinners();
      return {
        success: true,
        newState: this.getState(),
        streetComplete: true,
        handComplete: true
      };
    }

    if (streetComplete) {
      this.advanceStreet();
      return {
        success: true,
        newState: this.getState(),
        streetComplete: true,
        handComplete: false
      };
    }

    // Prochain joueur
    this.state.activePlayerIndex = GameStateUtils.getNextActivePlayer(this.state);

    return {
      success: true,
      newState: this.getState(),
      streetComplete: false,
      handComplete: false
    };
  }

  /**
   * Passe à la street suivante
   */
  private advanceStreet(): void {
    // Reset des mises
    this.state.players.forEach(p => {
      p.currentBet = 0;
    });
    this.state.currentBet = 0;
    this.state.minRaise = this.state.bigBlind;

    // Distribuer les cartes
    switch (this.state.currentStreet) {
      case Street.PRE_FLOP:
        // Flop : 3 cartes
        this.state.communityCards = [
          this.deck.deal(),
          this.deck.deal(),
          this.deck.deal()
        ];
        this.state.currentStreet = Street.FLOP;
        break;

      case Street.FLOP:
        // Turn : 1 carte
        this.state.communityCards.push(this.deck.deal());
        this.state.currentStreet = Street.TURN;
        break;

      case Street.TURN:
        // River : 1 carte
        this.state.communityCards.push(this.deck.deal());
        this.state.currentStreet = Street.RIVER;
        break;

      case Street.RIVER:
        this.state.currentStreet = Street.SHOWDOWN;
        break;
    }

    // Premier joueur après le dealer
    const firstPlayerIndex = (this.state.dealerPosition + 1) % this.state.players.length;
    this.state.activePlayerIndex = firstPlayerIndex;
    this.state.activePlayerIndex = GameStateUtils.getNextActivePlayer(this.state);
  }

  /**
   * Détermine les gagnants
   */
  private determineWinners(): void {
    const activePlayers = GameStateUtils.getActivePlayers(this.state);

    if (activePlayers.length === 1) {
      // Un seul joueur reste, il gagne tout
      const winner = activePlayers[0];
      const totalPot = GameStateUtils.getTotalPot(this.state);
      winner.stack += totalPot;

      this.state.winners = [{
        playerId: winner.id,
        playerName: winner.name,
        amount: totalPot,
        handRank: 'Opponents folded'
      }];
      return;
    }

    // Showdown : évaluer les mains
    const playersWithHands = activePlayers.map(player => {
      const allCards = [...player.holeCards, ...this.state.communityCards];
      const handResult = this.handEvaluator.evaluateHand(allCards);

      return {
        player,
        handResult
      };
    });

    // Trier par force de main (du meilleur au pire)
    playersWithHands.sort((a, b) => b.handResult.rank - a.handResult.rank);

    // Le meilleur gagne le pot principal
    const winner = playersWithHands[0].player;
    const totalPot = GameStateUtils.getTotalPot(this.state);
    winner.stack += totalPot;

    this.state.winners = [{
      playerId: winner.id,
      playerName: winner.name,
      amount: totalPot,
      handRank: playersWithHands[0].handResult.name
    }];

    this.state.currentStreet = Street.SHOWDOWN;
  }

  /**
   * Obtient l'état actuel du jeu
   */
  getState(): GameState {
    return GameStateUtils.createSnapshot(this.state);
  }

  /**
   * Obtient les options d'action pour un joueur
   */
  getActionOptions(playerId: string) {
    return GameStateUtils.getActionOptions(this.state, playerId);
  }
}
