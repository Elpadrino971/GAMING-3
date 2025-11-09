import { MatchmakingRequest, Player } from '../types';
import { TableManager } from './TableManager';

interface QueuedPlayer {
  playerId: string;
  username: string;
  socketId: string;
  request: MatchmakingRequest;
  timestamp: number;
}

/**
 * MatchmakingService - Matches players and creates tables
 */
export class MatchmakingService {
  private queue: Map<string, QueuedPlayer[]> = new Map();
  private tableManager: TableManager;

  constructor(tableManager: TableManager) {
    this.tableManager = tableManager;
  }

  /**
   * Add player to matchmaking queue
   */
  addToQueue(
    request: MatchmakingRequest,
    socketId: string
  ): { success: boolean; queuePosition?: number } {
    const queueKey = this.getQueueKey(request);

    if (!this.queue.has(queueKey)) {
      this.queue.set(queueKey, []);
    }

    const queue = this.queue.get(queueKey)!;

    // Check if player already in queue
    if (queue.some(p => p.playerId === request.playerId)) {
      return { success: false };
    }

    const queuedPlayer: QueuedPlayer = {
      playerId: request.playerId,
      username: request.username,
      socketId,
      request,
      timestamp: Date.now(),
    };

    queue.push(queuedPlayer);

    console.log(`🔍 Player ${request.username} joined matchmaking (${queueKey})`);
    console.log(`   Queue size: ${queue.length}`);

    // Try to match players
    this.tryMatch(queueKey);

    return { success: true, queuePosition: queue.length };
  }

  /**
   * Remove player from queue
   */
  removeFromQueue(playerId: string): boolean {
    for (const [queueKey, queue] of this.queue.entries()) {
      const index = queue.findIndex(p => p.playerId === playerId);
      if (index !== -1) {
        queue.splice(index, 1);
        console.log(`❌ Player ${playerId} left matchmaking`);

        // Clean up empty queues
        if (queue.length === 0) {
          this.queue.delete(queueKey);
        }

        return true;
      }
    }

    return false;
  }

  /**
   * Try to match players in queue
   */
  private tryMatch(queueKey: string): void {
    const queue = this.queue.get(queueKey);

    if (!queue || queue.length < 2) {
      return; // Need at least 2 players
    }

    // Match first N players (2-6 players per table)
    const matchSize = Math.min(queue.length, 6);

    if (matchSize >= 2) {
      const matched = queue.splice(0, matchSize);
      this.createMatchedTable(matched);
    }
  }

  /**
   * Create table for matched players
   */
  private createMatchedTable(players: QueuedPlayer[]): void {
    const firstPlayer = players[0];
    const request = firstPlayer.request;

    // Determine stakes based on game type
    let smallBlind = 1;
    let bigBlind = 2;
    let minBuyIn = 100;
    let maxBuyIn = 500;

    if (request.stakes === 'low') {
      smallBlind = 5;
      bigBlind = 10;
      minBuyIn = 200;
      maxBuyIn = 1000;
    } else if (request.stakes === 'medium') {
      smallBlind = 10;
      bigBlind = 20;
      minBuyIn = 400;
      maxBuyIn = 2000;
    } else if (request.stakes === 'high') {
      smallBlind = 25;
      bigBlind = 50;
      minBuyIn = 1000;
      maxBuyIn = 5000;
    }

    // Create table
    const table = this.tableManager.createTable({
      name: `${request.stakes.toUpperCase()} ${request.gameType} - ${players.length}P`,
      maxPlayers: players.length,
      smallBlind,
      bigBlind,
      minBuyIn,
      maxBuyIn,
      gameType: request.gameType,
    });

    // Add all players to table
    players.forEach((player) => {
      this.tableManager.addPlayer(
        table.id,
        player.playerId,
        player.socketId,
        player.username,
        player.request.buyIn
      );
    });

    console.log(`✅ Match found! Created table ${table.id} with ${players.length} players`);
  }

  /**
   * Get queue key for grouping players
   */
  private getQueueKey(request: MatchmakingRequest): string {
    return `${request.gameType}_${request.stakes}`;
  }

  /**
   * Get queue status
   */
  getQueueStatus(): Record<string, number> {
    const status: Record<string, number> = {};

    for (const [key, queue] of this.queue.entries()) {
      status[key] = queue.length;
    }

    return status;
  }
}
