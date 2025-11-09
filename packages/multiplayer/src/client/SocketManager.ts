import { io, Socket } from 'socket.io-client';
import {
  SocketEvent,
  JoinTableRequest,
  PlayerActionRequest,
  MatchmakingRequest,
  Table,
  SocketError,
} from '../types';

/**
 * SocketManager - Client-side Socket.io manager
 * Use this in web and mobile apps to connect to multiplayer server
 */
export class SocketManager {
  private socket: Socket | null = null;
  private serverUrl: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(serverUrl: string = 'http://localhost:3001') {
    this.serverUrl = serverUrl;
  }

  /**
   * Connect to multiplayer server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(this.serverUrl, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
      });

      this.socket.on(SocketEvent.CONNECT, () => {
        console.log('✅ Connected to multiplayer server');
        this.reconnectAttempts = 0;
        resolve();
      });

      this.socket.on(SocketEvent.DISCONNECT, () => {
        console.log('❌ Disconnected from server');
      });

      this.socket.on(SocketEvent.RECONNECT, (attempt: number) => {
        console.log(`🔄 Reconnected after ${attempt} attempts`);
        this.reconnectAttempts = 0;
      });

      this.socket.on('connect_error', (error: Error) => {
        console.error('Connection error:', error);
        this.reconnectAttempts++;

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(new Error('Failed to connect to server'));
        }
      });
    });
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Get list of available tables
   */
  getTables(callback: (tables: Table[]) => void): void {
    this.emit(SocketEvent.GET_TABLES);
    this.on(SocketEvent.TABLES_LIST, callback);
  }

  /**
   * Join a table
   */
  joinTable(request: JoinTableRequest): void {
    this.emit(SocketEvent.JOIN_TABLE, request);
  }

  /**
   * Leave current table
   */
  leaveTable(playerId: string): void {
    this.emit(SocketEvent.LEAVE_TABLE, playerId);
  }

  /**
   * Find a match (matchmaking)
   */
  findMatch(request: MatchmakingRequest): void {
    this.emit(SocketEvent.FIND_MATCH, request);
  }

  /**
   * Cancel matchmaking
   */
  cancelMatchmaking(playerId: string): void {
    this.emit(SocketEvent.CANCEL_MATCHMAKING, playerId);
  }

  /**
   * Send player action
   */
  sendAction(request: PlayerActionRequest): void {
    this.emit(SocketEvent.PLAYER_ACTION, request);
  }

  /**
   * Send chat message
   */
  sendMessage(tableId: string, playerId: string, message: string): void {
    this.emit(SocketEvent.SEND_MESSAGE, { tableId, playerId, message });
  }

  /**
   * Listen for player joined
   */
  onPlayerJoined(callback: (data: any) => void): void {
    this.on(SocketEvent.PLAYER_JOINED, callback);
  }

  /**
   * Listen for player left
   */
  onPlayerLeft(callback: (data: any) => void): void {
    this.on(SocketEvent.PLAYER_LEFT, callback);
  }

  /**
   * Listen for game state updates
   */
  onGameStateUpdate(callback: (gameState: any) => void): void {
    this.on(SocketEvent.GAME_STATE_UPDATE, callback);
  }

  /**
   * Listen for hand complete
   */
  onHandComplete(callback: (data: any) => void): void {
    this.on(SocketEvent.HAND_COMPLETE, callback);
  }

  /**
   * Listen for game started
   */
  onGameStarted(callback: (data: any) => void): void {
    this.on(SocketEvent.GAME_STARTED, callback);
  }

  /**
   * Listen for match found
   */
  onMatchFound(callback: (data: any) => void): void {
    this.on(SocketEvent.MATCH_FOUND, callback);
  }

  /**
   * Listen for new chat messages
   */
  onNewMessage(callback: (data: any) => void): void {
    this.on(SocketEvent.NEW_MESSAGE, callback);
  }

  /**
   * Listen for errors
   */
  onError(callback: (error: SocketError) => void): void {
    this.on(SocketEvent.ERROR, callback);
  }

  /**
   * Generic emit
   */
  private emit(event: string, data?: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.error('Socket not connected');
    }
  }

  /**
   * Generic listener
   */
  private on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  /**
   * Remove listener
   */
  off(event: string): void {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  /**
   * Check connection status
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get socket ID
   */
  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

// Singleton instance
let instance: SocketManager | null = null;

export function getSocketManager(serverUrl?: string): SocketManager {
  if (!instance) {
    instance = new SocketManager(serverUrl);
  }
  return instance;
}
