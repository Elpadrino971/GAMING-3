/**
 * Multiplayer Types & Interfaces
 */

export interface Player {
  id: string;
  socketId: string;
  username: string;
  chips: number;
  avatar?: string;
  isReady: boolean;
  isConnected: boolean;
}

export interface TableConfig {
  id: string;
  name: string;
  maxPlayers: number;
  smallBlind: number;
  bigBlind: number;
  minBuyIn: number;
  maxBuyIn: number;
  gameType: 'cash' | 'tournament';
}

export interface Table extends TableConfig {
  players: Player[];
  gameState: any; // GameState from poker-engine
  createdAt: number;
  status: 'waiting' | 'playing' | 'finished';
}

export interface RoomState {
  tableId: string;
  players: Player[];
  gameState: any;
  spectators: string[];
}

export interface JoinTableRequest {
  tableId: string;
  playerId: string;
  username: string;
  buyIn: number;
}

export interface PlayerActionRequest {
  tableId: string;
  playerId: string;
  action: 'fold' | 'check' | 'call' | 'raise';
  amount?: number;
}

export interface MatchmakingRequest {
  playerId: string;
  username: string;
  gameType: 'cash' | 'tournament';
  stakes: 'micro' | 'low' | 'medium' | 'high';
  buyIn: number;
}

// Socket.io Events
export enum SocketEvent {
  // Connection
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  RECONNECT = 'reconnect',

  // Lobby
  GET_TABLES = 'getTables',
  TABLES_LIST = 'tablesList',
  CREATE_TABLE = 'createTable',
  TABLE_CREATED = 'tableCreated',

  // Matchmaking
  FIND_MATCH = 'findMatch',
  MATCH_FOUND = 'matchFound',
  CANCEL_MATCHMAKING = 'cancelMatchmaking',

  // Table/Room
  JOIN_TABLE = 'joinTable',
  LEAVE_TABLE = 'leaveTable',
  PLAYER_JOINED = 'playerJoined',
  PLAYER_LEFT = 'playerLeft',
  TABLE_FULL = 'tableFull',

  // Game
  START_GAME = 'startGame',
  GAME_STARTED = 'gameStarted',
  PLAYER_ACTION = 'playerAction',
  GAME_STATE_UPDATE = 'gameStateUpdate',
  HAND_COMPLETE = 'handComplete',
  GAME_OVER = 'gameOver',

  // Chat
  SEND_MESSAGE = 'sendMessage',
  NEW_MESSAGE = 'newMessage',

  // Errors
  ERROR = 'error',
}

export interface SocketError {
  code: string;
  message: string;
}
