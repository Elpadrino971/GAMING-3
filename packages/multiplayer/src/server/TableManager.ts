import { v4 as uuidv4 } from 'uuid';
import { Table, TableConfig, Player } from '../types';
import { GameEngine } from '@pokermind/poker-engine/src/game-engine';

/**
 * TableManager - Manages all poker tables
 */
export class TableManager {
  private tables: Map<string, Table> = new Map();
  private playerToTable: Map<string, string> = new Map();
  private gameEngines: Map<string, GameEngine> = new Map();

  /**
   * Create a new table
   */
  createTable(config: Omit<TableConfig, 'id'>): Table {
    const table: Table = {
      id: uuidv4(),
      ...config,
      players: [],
      gameState: null,
      createdAt: Date.now(),
      status: 'waiting',
    };

    this.tables.set(table.id, table);
    console.log(`✅ Table created: ${table.id} (${table.name})`);

    return table;
  }

  /**
   * Get all available tables
   */
  getTables(): Table[] {
    return Array.from(this.tables.values());
  }

  /**
   * Get a specific table
   */
  getTable(tableId: string): Table | undefined {
    return this.tables.get(tableId);
  }

  /**
   * Add player to table
   */
  addPlayer(
    tableId: string,
    playerId: string,
    socketId: string,
    username: string,
    buyIn: number
  ): { success: boolean; error?: string } {
    const table = this.tables.get(tableId);

    if (!table) {
      return { success: false, error: 'Table not found' };
    }

    if (table.players.length >= table.maxPlayers) {
      return { success: false, error: 'Table is full' };
    }

    if (buyIn < table.minBuyIn || buyIn > table.maxBuyIn) {
      return { success: false, error: 'Invalid buy-in amount' };
    }

    // Check if player already at another table
    if (this.playerToTable.has(playerId)) {
      return { success: false, error: 'Already at a table' };
    }

    const player: Player = {
      id: playerId,
      socketId,
      username,
      chips: buyIn,
      isReady: false,
      isConnected: true,
    };

    table.players.push(player);
    this.playerToTable.set(playerId, tableId);

    console.log(`✅ Player ${username} joined table ${tableId}`);

    // Auto-start if table is full
    if (table.players.length === table.maxPlayers) {
      this.startGame(tableId);
    }

    return { success: true };
  }

  /**
   * Remove player from table
   */
  removePlayer(playerId: string): { success: boolean; tableId?: string } {
    const tableId = this.playerToTable.get(playerId);

    if (!tableId) {
      return { success: false };
    }

    const table = this.tables.get(tableId);
    if (!table) {
      return { success: false };
    }

    table.players = table.players.filter(p => p.id !== playerId);
    this.playerToTable.delete(playerId);

    console.log(`❌ Player ${playerId} left table ${tableId}`);

    // Delete table if empty
    if (table.players.length === 0) {
      this.tables.delete(tableId);
      this.gameEngines.delete(tableId);
      console.log(`🗑️  Table ${tableId} deleted (empty)`);
    }

    return { success: true, tableId };
  }

  /**
   * Start game on table
   */
  startGame(tableId: string): { success: boolean; error?: string } {
    const table = this.tables.get(tableId);

    if (!table) {
      return { success: false, error: 'Table not found' };
    }

    if (table.players.length < 2) {
      return { success: false, error: 'Need at least 2 players' };
    }

    // Create game engine
    const players = table.players.map((player, index) => ({
      id: player.id,
      name: player.username,
      stack: player.chips,
      position: index,
    }));

    const gameEngine = new GameEngine({
      players,
      smallBlind: table.smallBlind,
      bigBlind: table.bigBlind,
    });

    this.gameEngines.set(tableId, gameEngine);
    table.gameState = gameEngine.getState();
    table.status = 'playing';

    console.log(`🎮 Game started on table ${tableId}`);

    return { success: true };
  }

  /**
   * Process player action
   */
  processAction(
    tableId: string,
    playerId: string,
    action: any,
    amount?: number
  ): { success: boolean; gameState?: any; error?: string } {
    const gameEngine = this.gameEngines.get(tableId);
    const table = this.tables.get(tableId);

    if (!gameEngine || !table) {
      return { success: false, error: 'Game not found' };
    }

    const result = gameEngine.processAction(playerId, action, amount || 0);

    if (result.success) {
      table.gameState = result.state;

      // Check if hand is complete
      if (result.state.winners && result.state.winners.length > 0) {
        console.log(`🏆 Hand complete on table ${tableId}`);
      }

      return { success: true, gameState: result.state };
    }

    return { success: false, error: result.error };
  }

  /**
   * Start new hand
   */
  startNewHand(tableId: string): { success: boolean; gameState?: any; error?: string } {
    const gameEngine = this.gameEngines.get(tableId);
    const table = this.tables.get(tableId);

    if (!gameEngine || !table) {
      return { success: false, error: 'Game not found' };
    }

    gameEngine.startNewHand();
    table.gameState = gameEngine.getState();

    console.log(`🆕 New hand started on table ${tableId}`);

    return { success: true, gameState: table.gameState };
  }

  /**
   * Handle player disconnect
   */
  handleDisconnect(playerId: string): { tableId?: string; remainingPlayers: number } {
    const result = this.removePlayer(playerId);

    if (result.tableId) {
      const table = this.tables.get(result.tableId);
      return {
        tableId: result.tableId,
        remainingPlayers: table?.players.length || 0,
      };
    }

    return { remainingPlayers: 0 };
  }

  /**
   * Get player's current table
   */
  getPlayerTable(playerId: string): Table | undefined {
    const tableId = this.playerToTable.get(playerId);
    return tableId ? this.tables.get(tableId) : undefined;
  }
}
