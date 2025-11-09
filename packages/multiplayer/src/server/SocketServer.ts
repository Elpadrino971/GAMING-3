import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { TableManager } from './TableManager';
import { MatchmakingService } from './MatchmakingService';
import {
  SocketEvent,
  JoinTableRequest,
  PlayerActionRequest,
  MatchmakingRequest,
  TableConfig,
} from '../types';
import { PlayerAction } from '@pokermind/poker-engine/src/game-state';

/**
 * SocketServer - Main Socket.io server for multiplayer
 */
export class SocketServer {
  private io: Server;
  private tableManager: TableManager;
  private matchmaking: MatchmakingService;
  private socketToPlayer: Map<string, string> = new Map();

  constructor(httpServer: HTTPServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: '*', // Configure for production
        methods: ['GET', 'POST'],
      },
    });

    this.tableManager = new TableManager();
    this.matchmaking = new MatchmakingService(this.tableManager);

    this.setupEventHandlers();

    console.log('🚀 Socket.io server initialized');
  }

  private setupEventHandlers() {
    this.io.on(SocketEvent.CONNECT, (socket: Socket) => {
      console.log(`✅ Client connected: ${socket.id}`);

      // Get Tables List
      socket.on(SocketEvent.GET_TABLES, () => {
        const tables = this.tableManager.getTables();
        socket.emit(SocketEvent.TABLES_LIST, tables);
      });

      // Create Table
      socket.on(SocketEvent.CREATE_TABLE, (config: Omit<TableConfig, 'id'>) => {
        const table = this.tableManager.createTable(config);
        this.io.emit(SocketEvent.TABLE_CREATED, table);
      });

      // Join Table
      socket.on(SocketEvent.JOIN_TABLE, (request: JoinTableRequest) => {
        this.handleJoinTable(socket, request);
      });

      // Leave Table
      socket.on(SocketEvent.LEAVE_TABLE, (playerId: string) => {
        this.handleLeaveTable(socket, playerId);
      });

      // Find Match (Matchmaking)
      socket.on(SocketEvent.FIND_MATCH, (request: MatchmakingRequest) => {
        this.handleFindMatch(socket, request);
      });

      // Cancel Matchmaking
      socket.on(SocketEvent.CANCEL_MATCHMAKING, (playerId: string) => {
        this.matchmaking.removeFromQueue(playerId);
        socket.emit(SocketEvent.MATCH_FOUND, { cancelled: true });
      });

      // Player Action
      socket.on(SocketEvent.PLAYER_ACTION, (request: PlayerActionRequest) => {
        this.handlePlayerAction(socket, request);
      });

      // Start Game
      socket.on(SocketEvent.START_GAME, (tableId: string) => {
        this.handleStartGame(tableId);
      });

      // Chat Message
      socket.on(SocketEvent.SEND_MESSAGE, ({ tableId, playerId, message }) => {
        this.handleChatMessage(tableId, playerId, message);
      });

      // Disconnect
      socket.on(SocketEvent.DISCONNECT, () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private handleJoinTable(socket: Socket, request: JoinTableRequest) {
    const { tableId, playerId, username, buyIn } = request;

    const result = this.tableManager.addPlayer(
      tableId,
      playerId,
      socket.id,
      username,
      buyIn
    );

    if (result.success) {
      // Join socket room
      socket.join(tableId);
      this.socketToPlayer.set(socket.id, playerId);

      const table = this.tableManager.getTable(tableId);

      // Notify all players at table
      this.io.to(tableId).emit(SocketEvent.PLAYER_JOINED, {
        playerId,
        username,
        table,
      });

      // Send current game state to new player
      if (table?.gameState) {
        socket.emit(SocketEvent.GAME_STATE_UPDATE, table.gameState);
      }
    } else {
      socket.emit(SocketEvent.ERROR, {
        code: 'JOIN_FAILED',
        message: result.error,
      });
    }
  }

  private handleLeaveTable(socket: Socket, playerId: string) {
    const result = this.tableManager.removePlayer(playerId);

    if (result.success && result.tableId) {
      socket.leave(result.tableId);
      this.socketToPlayer.delete(socket.id);

      this.io.to(result.tableId).emit(SocketEvent.PLAYER_LEFT, {
        playerId,
      });
    }
  }

  private handleFindMatch(socket: Socket, request: MatchmakingRequest) {
    const result = this.matchmaking.addToQueue(request, socket.id);

    if (result.success) {
      socket.emit(SocketEvent.MATCH_FOUND, {
        searching: true,
        queuePosition: result.queuePosition,
      });

      // Check if player got matched
      setTimeout(() => {
        const table = this.tableManager.getPlayerTable(request.playerId);

        if (table) {
          socket.join(table.id);
          this.socketToPlayer.set(socket.id, request.playerId);

          socket.emit(SocketEvent.MATCH_FOUND, {
            matched: true,
            tableId: table.id,
            table,
          });
        }
      }, 1000);
    }
  }

  private handlePlayerAction(socket: Socket, request: PlayerActionRequest) {
    const { tableId, playerId, action, amount } = request;

    // Map string action to PlayerAction enum
    let playerAction: PlayerAction;
    if (action === 'fold') playerAction = PlayerAction.FOLD;
    else if (action === 'check') playerAction = PlayerAction.CHECK;
    else if (action === 'call') playerAction = PlayerAction.CALL;
    else playerAction = PlayerAction.RAISE;

    const result = this.tableManager.processAction(
      tableId,
      playerId,
      playerAction,
      amount
    );

    if (result.success) {
      // Broadcast game state to all players
      this.io.to(tableId).emit(SocketEvent.GAME_STATE_UPDATE, result.gameState);

      // Check for hand complete
      if (result.gameState?.winners && result.gameState.winners.length > 0) {
        this.io.to(tableId).emit(SocketEvent.HAND_COMPLETE, {
          winners: result.gameState.winners,
        });

        // Auto-start new hand after 5 seconds
        setTimeout(() => {
          const newHandResult = this.tableManager.startNewHand(tableId);
          if (newHandResult.success) {
            this.io.to(tableId).emit(SocketEvent.GAME_STATE_UPDATE, newHandResult.gameState);
          }
        }, 5000);
      }
    } else {
      socket.emit(SocketEvent.ERROR, {
        code: 'ACTION_FAILED',
        message: result.error,
      });
    }
  }

  private handleStartGame(tableId: string) {
    const result = this.tableManager.startGame(tableId);

    if (result.success) {
      const table = this.tableManager.getTable(tableId);
      this.io.to(tableId).emit(SocketEvent.GAME_STARTED, {
        gameState: table?.gameState,
      });
    }
  }

  private handleChatMessage(tableId: string, playerId: string, message: string) {
    const table = this.tableManager.getTable(tableId);

    if (table) {
      const player = table.players.find(p => p.id === playerId);

      this.io.to(tableId).emit(SocketEvent.NEW_MESSAGE, {
        playerId,
        username: player?.username || 'Unknown',
        message,
        timestamp: Date.now(),
      });
    }
  }

  private handleDisconnect(socket: Socket) {
    console.log(`❌ Client disconnected: ${socket.id}`);

    const playerId = this.socketToPlayer.get(socket.id);

    if (playerId) {
      // Remove from matchmaking
      this.matchmaking.removeFromQueue(playerId);

      // Remove from table
      const result = this.tableManager.handleDisconnect(playerId);

      if (result.tableId) {
        this.io.to(result.tableId).emit(SocketEvent.PLAYER_LEFT, {
          playerId,
          disconnected: true,
        });

        // End game if not enough players
        if (result.remainingPlayers < 2) {
          this.io.to(result.tableId).emit(SocketEvent.GAME_OVER, {
            reason: 'Not enough players',
          });
        }
      }

      this.socketToPlayer.delete(socket.id);
    }
  }

  /**
   * Get Socket.io instance
   */
  getIO(): Server {
    return this.io;
  }

  /**
   * Get stats
   */
  getStats() {
    return {
      connectedClients: this.io.sockets.sockets.size,
      activeTables: this.tableManager.getTables().length,
      matchmakingQueues: this.matchmaking.getQueueStatus(),
    };
  }
}
