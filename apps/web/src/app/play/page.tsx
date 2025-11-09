'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameEngine, GameConfig, GameState, PlayerAction } from '@pokermind/poker-engine';
import { AIPlayer } from '@pokermind/ai-engine';
import PokerTable from '@/components/poker/PokerTable';
import InGameProComparison from '@/components/InGameProComparison';
import { useMyCoaches } from '@/hooks/useProComparison';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

/**
 * Page principale du jeu de poker
 */
export default function PlayPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const userId = user?.id || 'human';
  const { activeCoach } = useMyCoaches(userId);

  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [aiPlayers, setAIPlayers] = useState<Map<string, AIPlayer>>(new Map());
  const [isProcessing, setIsProcessing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [lastHandId, setLastHandId] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string>('');

  // Check auth
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Initialize game
  useEffect(() => {
    if (isAuthenticated) {
      startNewGame();
    }
  }, [isAuthenticated]);

  const startNewGame = () => {
    // Try to load config from lobby
    const storedConfig = localStorage.getItem('pokermind_game_config');
    let stakes = { smallBlind: 10, bigBlind: 20 };

    if (storedConfig) {
      try {
        const gameConfig = JSON.parse(storedConfig);
        if (gameConfig.stakes) {
          stakes = gameConfig.stakes;
        }
      } catch (e) {
        console.error('Failed to parse game config:', e);
      }
    }

    const config: GameConfig = {
      mode: 'cash',
      smallBlind: stakes.smallBlind,
      bigBlind: stakes.bigBlind,
      startingStack: 1000,
      maxPlayers: 6,
      aiCount: 5,
      aiPersonalities: ['nit', 'tag', 'lag', 'maniac', 'calling_station']
    };

    const engine = new GameEngine(config);
    const initialState = engine.startNewHand();

    // Create AI players
    const aiMap = new Map<string, AIPlayer>();
    initialState.players.forEach(player => {
      if (player.isAI && player.aiPersonality) {
        aiMap.set(player.id, new AIPlayer(player.aiPersonality, player.id));
      }
    });

    setGameEngine(engine);
    setGameState(initialState);
    setAIPlayers(aiMap);

    // Start AI decision loop
    setTimeout(() => processAIActions(engine, initialState, aiMap), 1000);
  };

  const processAIActions = useCallback(async (
    engine: GameEngine,
    state: GameState,
    aiMap: Map<string, AIPlayer>
  ) => {
    const activePlayer = state.players[state.activePlayerIndex];

    if (!activePlayer || !activePlayer.isAI) {
      return; // Human turn or no active player
    }

    const aiPlayer = aiMap.get(activePlayer.id);
    if (!aiPlayer) return;

    // AI thinks for a moment
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // AI makes decision
    const decision = aiPlayer.makeDecision(state);

    // Process the action
    const result = engine.processAction(
      activePlayer.id,
      decision.action,
      decision.amount
    );

    if (!result.success) {
      console.error('AI action failed:', result.error);
      return;
    }

    setGameState(result.newState);

    // Check if hand complete
    if (result.handComplete) {
      // Show winner, then start new hand
      setTimeout(() => {
        const newState = engine.startNewHand();
        setGameState(newState);
        setTimeout(() => processAIActions(engine, newState, aiMap), 1000);
      }, 3000);
      return;
    }

    // Continue with next player
    setTimeout(() => processAIActions(engine, result.newState, aiMap), 500);
  }, []);

  const handlePlayerAction = useCallback((action: PlayerAction, amount: number = 0) => {
    if (!gameEngine || !gameState || isProcessing) return;

    setIsProcessing(true);

    // Process human action
    const result = gameEngine.processAction(userId, action, amount);

    if (!result.success) {
      console.error('Action failed:', result.error);
      setIsProcessing(false);
      return;
    }

    setGameState(result.newState);
    setLastHandId(result.newState.id);
    setLastAction(action);

    // Show pro comparison if coach is active
    if (activeCoach && ['raise', 'call', 'fold'].includes(action)) {
      setTimeout(() => setShowComparison(true), 500);
    }

    // Check if hand complete
    if (result.handComplete) {
      setTimeout(() => {
        const newState = gameEngine.startNewHand();
        setGameState(newState);
        setIsProcessing(false);
        setTimeout(() => processAIActions(gameEngine, newState, aiPlayers), 1000);
      }, 3000);
      return;
    }

    setIsProcessing(false);

    // Continue with AI
    setTimeout(() => processAIActions(gameEngine, result.newState, aiPlayers), 1000);
  }, [gameEngine, gameState, aiPlayers, activeCoach, isProcessing, processAIActions]);

  const handleNewHand = () => {
    if (!gameEngine) return;

    const newState = gameEngine.startNewHand();
    setGameState(newState);
    setTimeout(() => processAIActions(gameEngine, newState, aiPlayers), 1000);
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading poker table...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Poker Table */}
      <PokerTable
        gameState={gameState}
        onAction={handlePlayerAction}
        userId={userId}
      />

      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        {/* Back button */}
        <a
          href="/"
          className="bg-gray-900/90 backdrop-blur-sm hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg border border-gray-700"
        >
          ← Back to Menu
        </a>

        {/* Active coach indicator */}
        {activeCoach && (
          <div className="bg-gradient-to-r from-poker-gold to-yellow-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="font-semibold">🏆 {activeCoach.name} Coaching</span>
          </div>
        )}

        {/* New hand button */}
        {gameState.winners && (
          <button
            onClick={handleNewHand}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg"
          >
            Next Hand →
          </button>
        )}
      </div>

      {/* Pro comparison overlay */}
      {showComparison && lastHandId && activeCoach && (
        <InGameProComparison
          handId={lastHandId}
          playerAction={lastAction}
          userId={userId}
          activeProId={activeCoach.id}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Controls hint (bottom right) */}
      <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm text-gray-300 text-xs px-4 py-2 rounded-lg">
        <div className="space-y-1">
          <div>👋 Your turn will be highlighted</div>
          <div>🎮 Use action buttons or keyboard shortcuts</div>
          {activeCoach && <div>🏆 Coach will analyze your plays</div>}
        </div>
      </div>
    </div>
  );
}
