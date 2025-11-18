'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface Card3DProps {
  rank: string;
  suit: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  faceDown?: boolean;
  animate?: boolean;
}

const SUIT_SYMBOLS: Record<string, string> = {
  h: '♥',
  d: '♦',
  c: '♣',
  s: '♠',
};

const SUIT_COLORS: Record<string, string> = {
  h: '#ef4444',
  d: '#ef4444',
  c: '#1f2937',
  s: '#1f2937',
};

export default function Card3D({
  rank,
  suit,
  position,
  rotation = [0, 0, 0],
  faceDown = false,
  animate = false,
}: Card3DProps) {
  const cardRef = useRef<THREE.Group>(null);
  const suitSymbol = SUIT_SYMBOLS[suit];
  const suitColor = SUIT_COLORS[suit];

  useFrame((state) => {
    if (animate && cardRef.current) {
      cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      cardRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.02;
    }
  });

  return (
    <group ref={cardRef} position={position} rotation={rotation}>
      {/* Card body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.85, 0.01]} />
        <meshStandardMaterial
          color={faceDown ? '#1e3a8a' : '#ffffff'}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Card border */}
      <mesh position={[0, 0, 0.006]}>
        <boxGeometry args={[0.62, 0.87, 0.001]} />
        <meshStandardMaterial
          color={faceDown ? '#fbbf24' : '#e5e7eb'}
          roughness={0.5}
        />
      </mesh>

      {!faceDown && (
        <>
          {/* Rank - Top Left */}
          <Text
            position={[-0.2, 0.3, 0.011]}
            fontSize={0.12}
            color={suitColor}
            anchorX="center"
            anchorY="middle"
            font="/fonts/Arial-Bold.ttf"
          >
            {rank}
          </Text>

          {/* Suit - Top Left */}
          <Text
            position={[-0.2, 0.18, 0.011]}
            fontSize={0.1}
            color={suitColor}
            anchorX="center"
            anchorY="middle"
          >
            {suitSymbol}
          </Text>

          {/* Center Suit */}
          <Text
            position={[0, 0, 0.011]}
            fontSize={0.2}
            color={suitColor}
            anchorX="center"
            anchorY="middle"
          >
            {suitSymbol}
          </Text>

          {/* Rank - Bottom Right (rotated 180) */}
          <Text
            position={[0.2, -0.3, 0.011]}
            fontSize={0.12}
            color={suitColor}
            anchorX="center"
            anchorY="middle"
            rotation={[0, 0, Math.PI]}
          >
            {rank}
          </Text>

          {/* Suit - Bottom Right (rotated 180) */}
          <Text
            position={[0.2, -0.18, 0.011]}
            fontSize={0.1}
            color={suitColor}
            anchorX="center"
            anchorY="middle"
            rotation={[0, 0, Math.PI]}
          >
            {suitSymbol}
          </Text>
        </>
      )}

      {faceDown && (
        <>
          {/* Back pattern - Logo */}
          <Text
            position={[0, 0, 0.011]}
            fontSize={0.15}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
          >
            🎰
          </Text>

          <Text
            position={[0, -0.2, 0.011]}
            fontSize={0.06}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
          >
            PokerMind
          </Text>
        </>
      )}
    </group>
  );
}
