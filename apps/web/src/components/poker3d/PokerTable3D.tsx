'use client';

import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import Card3D from './Card3D';
import Chip3D from './Chip3D';

interface Player {
  id: string;
  name: string;
  chips: number;
  cards?: { rank: string; suit: string }[];
  isFolded: boolean;
  isDealer: boolean;
  position: number; // 0-8 for 9-max table
}

interface PokerTable3DProps {
  players: Player[];
  communityCards?: { rank: string; suit: string }[];
  pot: number;
  showCommunityCards?: boolean;
}

// Poker Table 3D Model
function Table3DModel() {
  const tableRef = useRef<THREE.Group>(null);

  return (
    <group ref={tableRef} position={[0, -0.5, 0]}>
      {/* Table surface (felt) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[3.5, 3.5, 0.1, 64]} />
        <meshStandardMaterial
          color="#0f6636"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Table inner rail (darker green) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.051, 0]}>
        <cylinderGeometry args={[3.3, 3.3, 0.001, 64]} />
        <meshStandardMaterial
          color="#0a4d27"
          roughness={0.9}
        />
      </mesh>

      {/* Outer rail (wood) */}
      <mesh castShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <cylinderGeometry args={[3.7, 3.5, 0.2, 64]} />
        <meshStandardMaterial
          color="#4a2511"
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* Chip tray indents (decorative circles) */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const radius = 3.0;
        return (
          <mesh
            key={i}
            position={[Math.cos(rad) * radius, 0.06, Math.sin(rad) * radius]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.3, 32]} />
            <meshStandardMaterial
              color="#0a4d27"
              roughness={0.85}
            />
          </mesh>
        );
      })}

      {/* PokerMind logo in center */}
      <Text
        position={[0, 0.061, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.3}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Arial-Bold.ttf"
      >
        PokerMind
      </Text>

      {/* Dealer position marker */}
      <mesh position={[0, 0.061, -1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          roughness={0.4}
          emissive="#fbbf24"
          emissiveIntensity={0.3}
        />
      </mesh>

      <Text
        position={[0, 0.062, -1.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.08}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Arial-Bold.ttf"
      >
        D
      </Text>
    </group>
  );
}

// Rotating Dealer Button
function DealerButton({ position }: { position: [number, number, number] }) {
  const buttonRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (buttonRef.current) {
      buttonRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={buttonRef} position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          roughness={0.3}
          metalness={0.5}
          emissive="#fbbf24"
          emissiveIntensity={0.2}
        />
      </mesh>

      <Text
        position={[0, 0.026, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.08}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Arial-Bold.ttf"
      >
        D
      </Text>
    </group>
  );
}

// Main Scene
function PokerScene({ players, communityCards = [], pot, showCommunityCards = false }: PokerTable3DProps) {
  // Player positions around the table (9-max)
  const getPlayerPosition = (position: number): [number, number, number] => {
    const angle = (position * (360 / 9)) * (Math.PI / 180);
    const radius = 2.8;
    return [Math.cos(angle) * radius, -0.4, Math.sin(angle) * radius];
  };

  // Community card positions
  const getCommunityCardPosition = (index: number): [number, number, number] => {
    const spacing = 0.7;
    const startX = -1.4;
    return [startX + index * spacing, -0.38, 0];
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight
        position={[0, 5, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={0.5}
        castShadow
      />
      <pointLight position={[0, 3, 0]} intensity={0.3} color="#fbbf24" />

      {/* Environment */}
      <Environment preset="city" />

      {/* Table */}
      <Table3DModel />

      {/* Contact Shadows */}
      <ContactShadows
        position={[0, -0.49, 0]}
        opacity={0.5}
        scale={10}
        blur={2}
        far={4}
      />

      {/* Community Cards */}
      {showCommunityCards && communityCards.map((card, i) => (
        <Card3D
          key={i}
          rank={card.rank}
          suit={card.suit}
          position={getCommunityCardPosition(i)}
          rotation={[-Math.PI / 2, 0, 0]}
          animate={i === communityCards.length - 1}
        />
      ))}

      {/* Pot Chips */}
      {pot > 0 && (
        <group position={[0, -0.38, 1]}>
          <Chip3D value={100} position={[0, 0, 0]} stack={Math.min(Math.floor(pot / 100), 10)} />
          <Text
            position={[0, 0.6, 0]}
            fontSize={0.2}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Arial-Bold.ttf"
          >
            ${pot.toLocaleString()}
          </Text>
        </group>
      )}

      {/* Players */}
      {players.map((player) => {
        const pos = getPlayerPosition(player.position);
        const angle = (player.position * (360 / 9)) * (Math.PI / 180);

        return (
          <group key={player.id} position={pos}>
            {/* Player nameplate */}
            <Text
              position={[0, 0.5, 0]}
              fontSize={0.15}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Arial-Bold.ttf"
            >
              {player.name}
            </Text>

            {/* Player chips */}
            <Text
              position={[0, 0.3, 0]}
              fontSize={0.12}
              color="#22c55e"
              anchorX="center"
              anchorY="middle"
            >
              ${player.chips.toLocaleString()}
            </Text>

            {/* Dealer button */}
            {player.isDealer && (
              <DealerButton position={[0.4, 0.2, 0]} />
            )}

            {/* Player cards */}
            {player.cards && player.cards.length > 0 && (
              <>
                <Card3D
                  rank={player.cards[0].rank}
                  suit={player.cards[0].suit}
                  position={[-0.15, 0, 0]}
                  rotation={[-Math.PI / 4, 0, -angle]}
                  faceDown={player.isFolded}
                />
                <Card3D
                  rank={player.cards[1].rank}
                  suit={player.cards[1].suit}
                  position={[0.15, 0, 0]}
                  rotation={[-Math.PI / 4, 0, -angle]}
                  faceDown={player.isFolded}
                />
              </>
            )}

            {/* Player chip stack */}
            {player.chips > 0 && (
              <Chip3D
                value={player.chips >= 1000 ? 1000 : player.chips >= 100 ? 100 : 25}
                position={[-0.5, 0, 0]}
                stack={Math.min(Math.floor(player.chips / 100), 8)}
              />
            )}
          </group>
        );
      })}
    </>
  );
}

// Main Component
export default function PokerTable3D(props: PokerTable3DProps) {
  const [autoRotate, setAutoRotate] = useState(false);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="bg-gray-800/90 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition backdrop-blur-sm"
        >
          {autoRotate ? '🔄 Auto-Rotate: ON' : '🔄 Auto-Rotate: OFF'}
        </button>
      </div>

      {/* Info Panel */}
      <div className="absolute top-4 left-4 z-10 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 text-white">
        <h3 className="font-bold text-xl mb-2">🎰 PokerMind 3D</h3>
        <p className="text-sm text-gray-300">🖱️ Click + drag to rotate</p>
        <p className="text-sm text-gray-300">🖱️ Scroll to zoom</p>
        <p className="text-sm text-gray-300">⌨️ Right-click + drag to pan</p>
        {props.communityCards && props.communityCards.length > 0 && (
          <p className="text-sm text-yellow-400 mt-2">
            🃏 {props.communityCards.length}/5 community cards
          </p>
        )}
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 8, 10], fov: 50 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <PokerScene {...props} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            minDistance={5}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
