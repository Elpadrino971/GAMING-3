'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface TournamentPlayer {
  id: string;
  name: string;
  avatar: string;
  eliminated: boolean;
  position?: number;
}

interface TournamentMatch {
  id: string;
  round: number;
  position: number;
  player1?: TournamentPlayer;
  player2?: TournamentPlayer;
  winner?: TournamentPlayer;
  inProgress: boolean;
}

// 3D Tournament Bracket Tree
export function Tournament3DBracket({
  matches,
  currentRound,
}: {
  matches: TournamentMatch[];
  currentRound: number;
}) {
  const bracketRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (bracketRef.current) {
      // Gentle rotation
      bracketRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const maxRound = Math.max(...matches.map((m) => m.round));
  const roundSpacing = 4;
  const matchSpacing = 2;

  return (
    <group ref={bracketRef}>
      {matches.map((match) => {
        const x = (match.round - 1) * roundSpacing - ((maxRound - 1) * roundSpacing) / 2;
        const matchesInRound = matches.filter((m) => m.round === match.round).length;
        const y = (match.position - matchesInRound / 2) * matchSpacing;

        return (
          <group key={match.id} position={[x, y, 0]}>
            {/* Match Container */}
            <mesh>
              <boxGeometry args={[3, 1.5, 0.1]} />
              <meshStandardMaterial
                color={match.inProgress ? '#fbbf24' : match.winner ? '#22c55e' : '#3b82f6'}
                roughness={0.3}
                metalness={0.3}
                emissive={match.inProgress ? '#fbbf24' : '#000000'}
                emissiveIntensity={match.inProgress ? 0.5 : 0}
              />
            </mesh>

            {/* Round Label */}
            <Text
              position={[0, 0.9, 0.06]}
              fontSize={0.15}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {match.round === maxRound
                ? 'FINAL'
                : match.round === maxRound - 1
                ? 'SEMI-FINAL'
                : `Round ${match.round}`}
            </Text>

            {/* Player 1 */}
            {match.player1 && (
              <group position={[0, 0.3, 0.06]}>
                <Text
                  fontSize={0.2}
                  color={match.winner?.id === match.player1.id ? '#fbbf24' : '#ffffff'}
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={2.8}
                >
                  {match.player1.avatar} {match.player1.name}
                </Text>
                {match.winner?.id === match.player1.id && (
                  <Text
                    position={[1.2, 0, 0]}
                    fontSize={0.25}
                    color="#fbbf24"
                    anchorX="center"
                    anchorY="middle"
                  >
                    👑
                  </Text>
                )}
              </group>
            )}

            {/* VS Divider */}
            <mesh position={[0, 0, 0.06]}>
              <planeGeometry args={[2.8, 0.02]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Player 2 */}
            {match.player2 && (
              <group position={[0, -0.3, 0.06]}>
                <Text
                  fontSize={0.2}
                  color={match.winner?.id === match.player2.id ? '#fbbf24' : '#ffffff'}
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={2.8}
                >
                  {match.player2.avatar} {match.player2.name}
                </Text>
                {match.winner?.id === match.player2.id && (
                  <Text
                    position={[1.2, 0, 0]}
                    fontSize={0.25}
                    color="#fbbf24"
                    anchorX="center"
                    anchorY="middle"
                  >
                    👑
                  </Text>
                )}
              </group>
            )}

            {/* Connection Lines to next round */}
            {match.winner && match.round < maxRound && (
              <mesh position={[roundSpacing / 2, 0, 0]}>
                <boxGeometry args={[roundSpacing, 0.05, 0.02]} />
                <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
              </mesh>
            )}

            {/* In Progress Indicator */}
            {match.inProgress && (
              <group>
                <Text
                  position={[0, -0.9, 0.06]}
                  fontSize={0.15}
                  color="#fbbf24"
                  anchorX="center"
                  anchorY="middle"
                >
                  ⚡ IN PROGRESS
                </Text>
              </group>
            )}
          </group>
        );
      })}

      {/* Trophy at the end */}
      <group position={[((maxRound - 1) * roundSpacing) / 2 + 3, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.4, 1, 16]} />
          <meshStandardMaterial
            color="#fbbf24"
            roughness={0.2}
            metalness={0.8}
            emissive="#fbbf24"
            emissiveIntensity={0.5}
          />
        </mesh>

        <mesh position={[0, 0.7, 0]} castShadow>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial
            color="#fbbf24"
            roughness={0.2}
            metalness={0.8}
            emissive="#fbbf24"
            emissiveIntensity={0.5}
          />
        </mesh>

        <Text position={[0, 1.3, 0]} fontSize={0.3} color="#fbbf24" anchorX="center" anchorY="middle">
          🏆
        </Text>

        <Text position={[0, -0.8, 0]} fontSize={0.2} color="#ffffff" anchorX="center" anchorY="middle">
          CHAMPION
        </Text>
      </group>
    </group>
  );
}

// Sample tournament data
export const SAMPLE_TOURNAMENT: TournamentMatch[] = [
  // Round 1 (8 players)
  {
    id: 'm1',
    round: 1,
    position: 1,
    player1: { id: 'p1', name: 'Vous', avatar: '😎', eliminated: false },
    player2: { id: 'p2', name: 'Fish Fred', avatar: '🐟', eliminated: true },
    winner: { id: 'p1', name: 'Vous', avatar: '😎', eliminated: false },
    inProgress: false,
  },
  {
    id: 'm2',
    round: 1,
    position: 2,
    player1: { id: 'p3', name: 'Le Boucher', avatar: '🔪', eliminated: false },
    player2: { id: 'p4', name: 'Lucky Lucy', avatar: '🍀', eliminated: true },
    winner: { id: 'p3', name: 'Le Boucher', avatar: '🔪', eliminated: false },
    inProgress: false,
  },
  {
    id: 'm3',
    round: 1,
    position: 3,
    player1: { id: 'p5', name: 'Phil Ivey', avatar: '🎩', eliminated: false },
    player2: { id: 'p6', name: 'Old School', avatar: '👴', eliminated: true },
    winner: { id: 'p5', name: 'Phil Ivey', avatar: '🎩', eliminated: false },
    inProgress: false,
  },
  {
    id: 'm4',
    round: 1,
    position: 4,
    player1: { id: 'p7', name: 'Ice Queen', avatar: '🧊', eliminated: false },
    player2: { id: 'p8', name: 'Maniac Mike', avatar: '🤪', eliminated: true },
    winner: { id: 'p7', name: 'Ice Queen', avatar: '🧊', eliminated: false },
    inProgress: false,
  },

  // Round 2 (Semi-Finals)
  {
    id: 'm5',
    round: 2,
    position: 1,
    player1: { id: 'p1', name: 'Vous', avatar: '😎', eliminated: false },
    player2: { id: 'p3', name: 'Le Boucher', avatar: '🔪', eliminated: false },
    winner: { id: 'p1', name: 'Vous', avatar: '😎', eliminated: false },
    inProgress: false,
  },
  {
    id: 'm6',
    round: 2,
    position: 2,
    player1: { id: 'p5', name: 'Phil Ivey', avatar: '🎩', eliminated: false },
    player2: { id: 'p7', name: 'Ice Queen', avatar: '🧊', eliminated: false },
    inProgress: true,
    winner: undefined,
  },

  // Round 3 (Final)
  {
    id: 'm7',
    round: 3,
    position: 1,
    player1: { id: 'p1', name: 'Vous', avatar: '😎', eliminated: false },
    player2: undefined,
    inProgress: false,
    winner: undefined,
  },
];
