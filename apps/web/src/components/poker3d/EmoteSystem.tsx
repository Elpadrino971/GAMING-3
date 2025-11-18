'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

export interface Emote {
  id: string;
  name: string;
  emoji: string;
  animation: 'bounce' | 'spin' | 'pulse' | 'float' | 'shake' | 'grow';
  sound?: string;
  duration: number;
}

export const EMOTES: Emote[] = [
  { id: 'gg', name: 'GG', emoji: '😎', animation: 'bounce', duration: 2 },
  { id: 'lol', name: 'LOL', emoji: '😂', animation: 'shake', duration: 2 },
  { id: 'cry', name: 'Cry', emoji: '😭', animation: 'shake', duration: 2 },
  { id: 'angry', name: 'Angry', emoji: '😠', animation: 'shake', duration: 2 },
  { id: 'fire', name: 'Fire', emoji: '🔥', animation: 'pulse', duration: 2 },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', animation: 'float', duration: 3 },
  { id: 'money', name: 'Money', emoji: '💰', animation: 'spin', duration: 2 },
  { id: 'skull', name: 'Skull', emoji: '💀', animation: 'spin', duration: 2 },
  { id: 'clap', name: 'Clap', emoji: '👏', animation: 'bounce', duration: 2 },
  { id: 'thinking', name: 'Think', emoji: '🤔', animation: 'pulse', duration: 3 },
  { id: 'shocked', name: 'Shocked', emoji: '😱', animation: 'grow', duration: 2 },
  { id: 'party', name: 'Party', emoji: '🎉', animation: 'spin', duration: 3 },
  { id: 'heart', name: 'Love', emoji: '❤️', animation: 'pulse', duration: 2 },
  { id: 'thumbsup', name: 'Nice', emoji: '👍', animation: 'bounce', duration: 2 },
  { id: 'thumbsdown', name: 'Bad', emoji: '👎', animation: 'bounce', duration: 2 },
];

// 3D Emote floating above player
export function Emote3D({
  emote,
  position,
  onComplete,
}: {
  emote: Emote;
  position: [number, number, number];
  onComplete?: () => void;
}) {
  const emoteRef = useRef<THREE.Group>(null);
  const startTime = useRef(Date.now());

  useFrame((state) => {
    if (!emoteRef.current) return;

    const elapsed = (Date.now() - startTime.current) / 1000;

    if (elapsed > emote.duration) {
      onComplete?.();
      return;
    }

    const t = elapsed / emote.duration;

    switch (emote.animation) {
      case 'bounce':
        emoteRef.current.position.y = position[1] + Math.abs(Math.sin(state.clock.elapsedTime * 5)) * 0.5;
        break;

      case 'spin':
        emoteRef.current.rotation.y = state.clock.elapsedTime * 3;
        emoteRef.current.position.y = position[1] + t * 2;
        break;

      case 'pulse':
        const scale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.3;
        emoteRef.current.scale.set(scale, scale, scale);
        break;

      case 'float':
        emoteRef.current.position.y = position[1] + t * 3;
        emoteRef.current.rotation.y = t * Math.PI * 2;
        break;

      case 'shake':
        emoteRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 20) * 0.1;
        emoteRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.2;
        break;

      case 'grow':
        const growScale = 1 + t * 2;
        emoteRef.current.scale.set(growScale, growScale, growScale);
        emoteRef.current.material.opacity = 1 - t;
        break;
    }

    // Fade out at end
    if (emoteRef.current.children[0] && 'opacity' in emoteRef.current.children[0].material) {
      (emoteRef.current.children[0].material as any).opacity = 1 - Math.pow(t, 2);
    }
  });

  return (
    <group ref={emoteRef} position={position}>
      <Text
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {emote.emoji}
      </Text>

      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}

// Emote selector UI
export function EmoteSelector({
  onSelect,
  visible,
  onClose,
}: {
  onSelect: (emote: Emote) => void;
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-40 bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 border-4 border-yellow-400 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-yellow-400 font-bold text-xl">😊 Emotes</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {EMOTES.map((emote) => (
              <motion.button
                key={emote.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  onSelect(emote);
                  onClose();
                }}
                className="bg-gray-800 hover:bg-gray-700 rounded-xl p-4 transition flex flex-col items-center gap-2 border-2 border-gray-700 hover:border-yellow-400"
              >
                <div className="text-4xl">{emote.emoji}</div>
                <div className="text-white text-xs font-semibold">{emote.name}</div>
              </motion.button>
            ))}
          </div>

          <div className="mt-4 text-center text-gray-400 text-xs">
            Click an emote to send it!
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Emote button
export function EmoteButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 px-6 py-3 rounded-full font-bold shadow-2xl border-4 border-white transition"
    >
      <span className="text-2xl mr-2">😊</span>
      Emotes
    </motion.button>
  );
}

// Emote history (chat-like)
export function EmoteHistory({
  emotes,
}: {
  emotes: Array<{ playerName: string; emote: Emote; timestamp: number }>;
}) {
  return (
    <div className="fixed top-48 right-4 z-30 w-64 space-y-2">
      {emotes.slice(-5).map((item, i) => (
        <motion.div
          key={item.timestamp}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700"
        >
          <div className="flex items-center gap-2">
            <div className="text-2xl">{item.emote.emoji}</div>
            <div className="flex-1">
              <div className="text-yellow-400 text-sm font-semibold">{item.playerName}</div>
              <div className="text-gray-400 text-xs">{item.emote.name}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Hook to manage emotes
export function useEmotes() {
  const [activeEmotes, setActiveEmotes] = React.useState<
    Array<{ id: string; emote: Emote; position: [number, number, number] }>
  >([]);
  const [emoteHistory, setEmoteHistory] = React.useState<
    Array<{ playerName: string; emote: Emote; timestamp: number }>
  >([]);

  const playEmote = (emote: Emote, playerName: string, position: [number, number, number]) => {
    const id = `${Date.now()}-${Math.random()}`;

    setActiveEmotes((prev) => [...prev, { id, emote, position }]);
    setEmoteHistory((prev) => [...prev.slice(-4), { playerName, emote, timestamp: Date.now() }]);

    setTimeout(() => {
      setActiveEmotes((prev) => prev.filter((e) => e.id !== id));
    }, emote.duration * 1000);
  };

  return {
    activeEmotes,
    emoteHistory,
    playEmote,
  };
}
