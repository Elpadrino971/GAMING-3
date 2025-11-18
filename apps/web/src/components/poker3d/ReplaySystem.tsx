'use client';

import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export interface HandAction {
  timestamp: number;
  playerId: string;
  action: 'fold' | 'call' | 'raise' | 'all-in' | 'check';
  amount?: number;
  cards?: string[];
}

export interface HandReplay {
  id: string;
  players: Array<{
    id: string;
    name: string;
    position: number;
    startingStack: number;
    cards: string[];
  }>;
  actions: HandAction[];
  communityCards: {
    preflop: string[];
    flop: string[];
    turn: string[];
    river: string[];
  };
  pot: number;
  winner: string;
  winningHand: string;
  timestamp: Date;
}

// Replay Controller
export function ReplayController({
  replay,
  onTimeUpdate,
}: {
  replay: HandReplay;
  onTimeUpdate: (time: number) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const timeRef = useRef(0);

  const totalDuration = replay.actions[replay.actions.length - 1]?.timestamp || 60000;

  useFrame((state, delta) => {
    if (isPlaying) {
      timeRef.current += delta * 1000 * playbackSpeed;
      if (timeRef.current >= totalDuration) {
        timeRef.current = totalDuration;
        setIsPlaying(false);
      }
      setCurrentTime(timeRef.current);
      onTimeUpdate(timeRef.current);
    }
  });

  const handleSeek = (time: number) => {
    timeRef.current = time;
    setCurrentTime(time);
    onTimeUpdate(time);
  };

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 w-[600px] border-2 border-yellow-400 z-30">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
        <div
          className="w-full h-2 bg-gray-700 rounded-full cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = x / rect.width;
            handleSeek(percent * totalDuration);
          }}
        >
          <div
            className="h-full bg-yellow-400 rounded-full transition-all"
            style={{ width: `${(currentTime / totalDuration) * 100}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 w-12 h-12 rounded-full font-bold text-xl transition flex items-center justify-center"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>

        {/* Speed Control */}
        <div className="flex gap-2">
          {[0.25, 0.5, 1, 2, 4].map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-3 py-2 rounded-lg font-semibold transition ${
                playbackSpeed === speed
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Skip Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSeek(0)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
          >
            ⏮️ Start
          </button>
          <button
            onClick={() => handleSeek(totalDuration)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
          >
            End ⏭️
          </button>
        </div>
      </div>

      {/* Action Timeline */}
      <div className="mt-4 max-h-32 overflow-y-auto">
        <div className="text-xs text-gray-400 mb-2">Actions:</div>
        {replay.actions.map((action, i) => (
          <div
            key={i}
            className={`text-sm py-1 px-2 rounded ${
              currentTime >= action.timestamp ? 'text-yellow-400' : 'text-gray-600'
            }`}
          >
            {formatTime(action.timestamp)} - {action.playerId}: {action.action.toUpperCase()}
            {action.amount && ` $${action.amount}`}
          </div>
        ))}
      </div>
    </div>
  );
}

// Director Mode - Auto camera switching
export function DirectorMode({
  replay,
  currentTime,
  onCameraChange,
}: {
  replay: HandReplay;
  currentTime: number;
  onCameraChange: (cameraView: string, focusPlayer?: string) => void;
}) {
  const [lastActionTime, setLastActionTime] = useState(0);

  useFrame(() => {
    // Find current action
    const currentAction = replay.actions.find(
      (action) => action.timestamp <= currentTime && action.timestamp > lastActionTime
    );

    if (currentAction) {
      setLastActionTime(currentAction.timestamp);

      // Switch camera based on action
      if (currentAction.action === 'all-in') {
        // Dramatic close-up on all-in player
        onCameraChange('closeup', currentAction.playerId);
      } else if (currentAction.action === 'raise') {
        // Focus on raiser
        onCameraChange('focus', currentAction.playerId);
      } else {
        // Default TV view
        onCameraChange('tv');
      }
    }
  });

  return null;
}

// Slow Motion for key moments
export function SlowMotionMoments({
  currentAction,
  trigger,
}: {
  currentAction?: HandAction;
  trigger: boolean;
}) {
  const [slowMo, setSlowMo] = useState(false);

  React.useEffect(() => {
    if (trigger && currentAction?.action === 'all-in') {
      setSlowMo(true);
      setTimeout(() => setSlowMo(false), 3000);
    }
  }, [trigger, currentAction]);

  return null; // Used by parent to adjust clock speed
}

// Hand History Display
export function HandHistoryDisplay({ replay }: { replay: HandReplay }) {
  return (
    <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 border-2 border-yellow-400 max-w-2xl">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">📊 Hand History</h2>

      {/* Players */}
      <div className="mb-4">
        <h3 className="text-white font-bold mb-2">Players:</h3>
        <div className="grid grid-cols-2 gap-2">
          {replay.players.map((player) => (
            <div key={player.id} className="bg-gray-800 rounded-lg p-3">
              <div className="text-white font-semibold">{player.name}</div>
              <div className="text-gray-400 text-sm">Stack: ${player.startingStack}</div>
              <div className="text-blue-400 text-sm">
                Cards: {player.cards.join(' ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Cards */}
      <div className="mb-4">
        <h3 className="text-white font-bold mb-2">Board:</h3>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex gap-2 flex-wrap">
            {replay.communityCards.flop.length > 0 && (
              <div>
                <span className="text-gray-400 text-xs">Flop: </span>
                <span className="text-white">{replay.communityCards.flop.join(' ')}</span>
              </div>
            )}
            {replay.communityCards.turn.length > 0 && (
              <div>
                <span className="text-gray-400 text-xs">Turn: </span>
                <span className="text-white">{replay.communityCards.turn.join(' ')}</span>
              </div>
            )}
            {replay.communityCards.river.length > 0 && (
              <div>
                <span className="text-gray-400 text-xs">River: </span>
                <span className="text-white">{replay.communityCards.river.join(' ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-4">
        <h3 className="text-white font-bold mb-2">Actions:</h3>
        <div className="bg-gray-800 rounded-lg p-3 max-h-48 overflow-y-auto">
          {replay.actions.map((action, i) => (
            <div key={i} className="text-sm text-gray-300 py-1">
              <span className="text-yellow-400">{action.playerId}</span> {action.action}
              {action.amount && <span className="text-green-400"> ${action.amount}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="bg-gradient-to-r from-green-900 to-green-800 rounded-lg p-4">
        <div className="text-2xl font-bold text-green-400 mb-2">
          🏆 Winner: {replay.winner}
        </div>
        <div className="text-white text-lg">{replay.winningHand}</div>
        <div className="text-green-300 text-xl font-bold">Pot: ${replay.pot}</div>
      </div>
    </div>
  );
}

// Export Hand Replay as video
export function ExportReplayButton({ replay }: { replay: HandReplay }) {
  const handleExport = () => {
    // In production, this would trigger video encoding
    console.log('📹 Exporting replay...', replay);
    alert('🎬 Export started! Your clip will be ready in a few seconds.');
  };

  return (
    <button
      onClick={handleExport}
      className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
    >
      🎥 Export Replay
    </button>
  );
}

// Utilities
function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Sample replay data
export const SAMPLE_REPLAY: HandReplay = {
  id: 'hand-001',
  players: [
    { id: 'player-1', name: 'Vous', position: 0, startingStack: 5000, cards: ['A♥', 'K♥'] },
    { id: 'player-2', name: 'Le Boucher', position: 2, startingStack: 12000, cards: ['Q♦', 'Q♣'] },
    { id: 'player-3', name: 'Phil', position: 4, startingStack: 3500, cards: ['J♠', '10♠'] },
  ],
  actions: [
    { timestamp: 1000, playerId: 'Vous', action: 'raise', amount: 300 },
    { timestamp: 3000, playerId: 'Le Boucher', action: 'call', amount: 300 },
    { timestamp: 5000, playerId: 'Phil', action: 'fold' },
    { timestamp: 10000, playerId: 'Vous', action: 'raise', amount: 600 },
    { timestamp: 12000, playerId: 'Le Boucher', action: 'all-in', amount: 12000 },
    { timestamp: 15000, playerId: 'Vous', action: 'call', amount: 5000 },
  ],
  communityCards: {
    preflop: [],
    flop: ['A♦', 'K♣', 'Q♥'],
    turn: ['9♠'],
    river: ['2♥'],
  },
  pot: 17000,
  winner: 'Vous',
  winningHand: 'Royal Flush',
  timestamp: new Date(),
};
