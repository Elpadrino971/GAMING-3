import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';

interface GameState {
  players: Map<string, any>;
  deck: any[];
  communityCards: any[];
  pot: number;
  currentPlayer: string;
  dealer: string;
}

const activeGames = new Map<string, GameState>();

export function setupGameSocket(io: Server) {
  const gameNamespace = io.of('/game');

  gameNamespace.on('connection', (socket: Socket) => {
    logger.info(`Client connecté au game socket: ${socket.id}`);

    // Rejoindre une table
    socket.on('join:table', ({ tableId, userId, username }) => {
      socket.join(tableId);

      logger.info(`${username} a rejoint la table ${tableId}`);

      // Initialiser la partie si nécessaire
      if (!activeGames.has(tableId)) {
        activeGames.set(tableId, {
          players: new Map(),
          deck: [],
          communityCards: [],
          pot: 0,
          currentPlayer: '',
          dealer: ''
        });
      }

      const game = activeGames.get(tableId)!;
      game.players.set(socket.id, {
        id: userId,
        username,
        chips: 1000,
        cards: [],
        position: game.players.size
      });

      // Notifier tous les joueurs
      gameNamespace.to(tableId).emit('player:joined', {
        userId,
        username,
        playerCount: game.players.size
      });

      // Envoyer l'état de la partie au nouveau joueur
      socket.emit('game:state', {
        players: Array.from(game.players.values()),
        communityCards: game.communityCards,
        pot: game.pot,
        currentPlayer: game.currentPlayer
      });
    });

    // Quitter une table
    socket.on('leave:table', ({ tableId, userId }) => {
      const game = activeGames.get(tableId);
      if (game) {
        game.players.delete(socket.id);

        gameNamespace.to(tableId).emit('player:left', {
          userId,
          playerCount: game.players.size
        });

        // Supprimer la partie si plus de joueurs
        if (game.players.size === 0) {
          activeGames.delete(tableId);
        }
      }

      socket.leave(tableId);
    });

    // Action du joueur
    socket.on('player:action', ({ tableId, action, amount }) => {
      const game = activeGames.get(tableId);
      if (!game) return;

      const player = game.players.get(socket.id);
      if (!player) return;

      logger.info(`${player.username} a joué: ${action} ${amount || ''}`);

      // Traiter l'action
      switch (action) {
        case 'fold':
          player.folded = true;
          break;
        case 'check':
          // Rien à faire
          break;
        case 'call':
          player.chips -= amount;
          game.pot += amount;
          break;
        case 'bet':
        case 'raise':
          player.chips -= amount;
          game.pot += amount;
          player.currentBet = amount;
          break;
      }

      // Diffuser l'action à tous les joueurs
      gameNamespace.to(tableId).emit('action:performed', {
        playerId: player.id,
        username: player.username,
        action,
        amount,
        pot: game.pot,
        playerChips: player.chips
      });

      // Passer au joueur suivant
      const activePlayers = Array.from(game.players.values()).filter(p => !p.folded);
      const currentIndex = activePlayers.findIndex(p => p.id === player.id);
      const nextPlayer = activePlayers[(currentIndex + 1) % activePlayers.length];

      game.currentPlayer = nextPlayer.id;

      gameNamespace.to(tableId).emit('turn:changed', {
        currentPlayer: nextPlayer.id,
        username: nextPlayer.username
      });
    });

    // Démarrer une nouvelle main
    socket.on('hand:start', ({ tableId }) => {
      const game = activeGames.get(tableId);
      if (!game) return;

      // Réinitialiser pour une nouvelle main
      game.communityCards = [];
      game.pot = 0;

      // Distribuer les cartes (simulation)
      game.players.forEach(player => {
        player.cards = [
          { rank: 'A', suit: 'spades' },
          { rank: 'K', suit: 'hearts' }
        ];
        player.folded = false;
        player.currentBet = 0;
      });

      gameNamespace.to(tableId).emit('hand:started', {
        players: Array.from(game.players.values()).map(p => ({
          id: p.id,
          username: p.username,
          chips: p.chips
        }))
      });

      // Envoyer les cartes privées à chaque joueur
      game.players.forEach((player, socketId) => {
        gameNamespace.to(socketId).emit('cards:dealt', {
          cards: player.cards
        });
      });
    });

    // Gérer la déconnexion
    socket.on('disconnect', () => {
      logger.info(`Client déconnecté: ${socket.id}`);

      // Retirer le joueur de toutes les tables
      activeGames.forEach((game, tableId) => {
        if (game.players.has(socket.id)) {
          const player = game.players.get(socket.id);
          game.players.delete(socket.id);

          gameNamespace.to(tableId).emit('player:disconnected', {
            userId: player?.id,
            username: player?.username
          });

          if (game.players.size === 0) {
            activeGames.delete(tableId);
          }
        }
      });
    });
  });
}
