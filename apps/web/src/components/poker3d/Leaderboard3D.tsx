'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export interface LeaderboardPlayer {
  rank: number;
  name: string;
  avatar: string;
  level: number;
  totalWinnings: number;
  handsPlayed: number;
  winRate: number;
}

// 3D Podium for top 3
export function Podium3D({ players }: { players: LeaderboardPlayer[] }) {
  const podiumRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (podiumRef.current) {
      podiumRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const podiumHeights = [2, 3, 1.5]; // 2nd, 1st, 3rd
  const podiumColors = ['#C0C0C0', '#FFD700', '#CD7F32']; // Silver, Gold, Bronze
  const positions: [number, number, number][] = [
    [-2, 0, 0], // 2nd place
    [0, 0, 0],  // 1st place
    [2, 0, 0],  // 3rd place
  ];

  return (
    <group ref={podiumRef}>
      {players.slice(0, 3).map((player, i) => {
        const actualIndex = i === 0 ? 1 : i === 1 ? 0 : 2; // Reorder for podium
        const height = podiumHeights[actualIndex];
        const color = podiumColors[actualIndex];
        const position = positions[actualIndex];

        return (
          <group key={player.rank} position={position}>
            {/* Podium base */}
            <mesh position={[0, height / 2, 0]} castShadow>
              <boxGeometry args={[1.5, height, 1.5]} />
              <meshStandardMaterial
                color={color}
                roughness={0.3}
                metalness={0.7}
                emissive={color}
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Rank number on front */}
            <Text
              position={[0, height / 2, 0.76]}
              fontSize={0.8}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Arial-Bold.ttf"
            >
              {player.rank}
            </Text>

            {/* Player avatar (emoji) on top */}
            <Text
              position={[0, height + 0.5, 0]}
              fontSize={0.6}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {player.avatar}
            </Text>

            {/* Player name */}
            <Text
              position={[0, height + 1.2, 0]}
              fontSize={0.25}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              maxWidth={1.4}
            >
              {player.name}
            </Text>

            {/* Level badge */}
            <mesh position={[0, height + 1.6, 0]}>
              <circleGeometry args={[0.15, 32]} />
              <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
            </mesh>
            <Text
              position={[0, height + 1.6, 0.01]}
              fontSize={0.12}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {player.level}
            </Text>

            {/* Winnings */}
            <Text
              position={[0, height + 1.9, 0]}
              fontSize={0.2}
              color="#22c55e"
              anchorX="center"
              anchorY="middle"
            >
              ${(player.totalWinnings / 1000).toFixed(1)}K
            </Text>

            {/* Floating particles for 1st place */}
            {player.rank === 1 && (
              <group>
                {Array.from({ length: 20 }).map((_, i) => {
                  const angle = (i / 20) * Math.PI * 2;
                  const radius = 1;
                  return (
                    <mesh
                      key={i}
                      position={[
                        Math.cos(angle + Date.now() * 0.001) * radius,
                        height + 2 + Math.sin(Date.now() * 0.002 + i) * 0.5,
                        Math.sin(angle + Date.now() * 0.001) * radius,
                      ]}
                    >
                      <sphereGeometry args={[0.05, 8, 8]} />
                      <meshStandardMaterial
                        color="#fbbf24"
                        emissive="#fbbf24"
                        emissiveIntensity={1}
                      />
                    </mesh>
                  );
                })}
              </group>
            )}

            {/* Crown for 1st place */}
            {player.rank === 1 && (
              <Text
                position={[0, height + 2.3, 0]}
                fontSize={0.4}
                color="#fbbf24"
                anchorX="center"
                anchorY="middle"
              >
                👑
              </Text>
            )}
          </group>
        );
      })}

      {/* Platform base */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[4, 4, 0.2, 32]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} />
      </mesh>

      {/* Leaderboard title */}
      <Text
        position={[0, 4.5, 0]}
        fontSize={0.5}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Arial-Bold.ttf"
      >
        🏆 TOP PLAYERS 🏆
      </Text>
    </group>
  );
}

// Full leaderboard list (4th place onwards)
export function LeaderboardList({ players }: { players: LeaderboardPlayer[] }) {
  return (
    <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 border-2 border-yellow-400 max-w-4xl">
      <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
        🏆 Global Leaderboard
      </h2>

      {/* Top 3 highlight */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {players.slice(0, 3).map((player, i) => {
          const colors = [
            'from-gray-500 to-gray-600',   // 2nd
            'from-yellow-500 to-orange-500', // 1st
            'from-amber-700 to-amber-800',   // 3rd
          ];
          const order = i === 1 ? 0 : i === 0 ? 1 : 2;

          return (
            <div
              key={player.rank}
              className={`bg-gradient-to-br ${colors[i]} rounded-xl p-4 border-4 ${
                player.rank === 1 ? 'border-yellow-400' : 'border-gray-600'
              } ${player.rank === 1 ? 'transform scale-110' : ''}`}
            >
              <div className="text-center">
                <div className="text-6xl mb-2">{player.avatar}</div>
                <div className="text-white font-bold text-xl mb-1">{player.name}</div>
                <div className="text-sm text-white/80 mb-2">Level {player.level}</div>
                <div className="text-2xl font-bold text-white mb-1">
                  #{player.rank}
                </div>
                <div className="text-green-400 font-bold">
                  ${player.totalWinnings.toLocaleString()}
                </div>
                <div className="text-white/60 text-xs">
                  {player.handsPlayed.toLocaleString()} hands • {player.winRate}% WR
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest of leaderboard */}
      <div className="space-y-2">
        {players.slice(3, 20).map((player) => (
          <div
            key={player.rank}
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 flex items-center gap-4 transition"
          >
            <div className="text-2xl font-bold text-yellow-400 w-12 text-center">
              #{player.rank}
            </div>
            <div className="text-3xl">{player.avatar}</div>
            <div className="flex-1">
              <div className="text-white font-bold">{player.name}</div>
              <div className="text-gray-400 text-sm">
                Level {player.level} • {player.handsPlayed.toLocaleString()} hands played
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-400 font-bold text-lg">
                ${player.totalWinnings.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">{player.winRate}% win rate</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sample leaderboard data
export const SAMPLE_LEADERBOARD: LeaderboardPlayer[] = [
  {
    rank: 1,
    name: 'Le Boucher',
    avatar: '🔪',
    level: 99,
    totalWinnings: 5420000,
    handsPlayed: 125000,
    winRate: 68.5,
  },
  {
    rank: 2,
    name: 'Ice Queen',
    avatar: '🧊',
    level: 87,
    totalWinnings: 3850000,
    handsPlayed: 98000,
    winRate: 65.2,
  },
  {
    rank: 3,
    name: 'Phil Ivey',
    avatar: '🎩',
    level: 82,
    totalWinnings: 3120000,
    handsPlayed: 87000,
    winRate: 63.8,
  },
  {
    rank: 4,
    name: 'Maniac Mike',
    avatar: '🤪',
    level: 76,
    totalWinnings: 2450000,
    handsPlayed: 156000,
    winRate: 52.3,
  },
  {
    rank: 5,
    name: 'Vous',
    avatar: '😎',
    level: 45,
    totalWinnings: 1890000,
    handsPlayed: 42000,
    winRate: 58.7,
  },
  {
    rank: 6,
    name: 'Gambler Gary',
    avatar: '🎲',
    level: 62,
    totalWinnings: 1650000,
    handsPlayed: 78000,
    winRate: 54.1,
  },
  {
    rank: 7,
    name: 'Old School Sam',
    avatar: '👴',
    level: 71,
    totalWinnings: 1420000,
    handsPlayed: 112000,
    winRate: 51.9,
  },
  {
    rank: 8,
    name: 'Lucky Lucy',
    avatar: '🍀',
    level: 38,
    totalWinnings: 980000,
    handsPlayed: 34000,
    winRate: 49.2,
  },
  {
    rank: 9,
    name: 'Fish Fred',
    avatar: '🐟',
    level: 22,
    totalWinnings: 450000,
    handsPlayed: 67000,
    winRate: 38.5,
  },
  {
    rank: 10,
    name: 'Shark Hunter',
    avatar: '🦈',
    level: 54,
    totalWinnings: 890000,
    handsPlayed: 45000,
    winRate: 56.3,
  },
];
