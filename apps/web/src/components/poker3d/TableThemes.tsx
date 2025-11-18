'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export interface TableTheme {
  id: string;
  name: string;
  description: string;
  feltColor: string;
  railColor: string;
  emissiveColor: string;
  emissiveIntensity: number;
  roughness: number;
  metalness: number;
  particleColor?: string;
  ambientColor: string;
  accentColor: string;
  textColor: string;
  icon: string;
  premium: boolean;
  animated: boolean;
}

export const TABLE_THEMES: TableTheme[] = [
  {
    id: 'classic',
    name: 'Classic Green',
    description: 'Traditional poker table feel',
    feltColor: '#1e7a1e',
    railColor: '#4a2511',
    emissiveColor: '#000000',
    emissiveIntensity: 0,
    roughness: 0.8,
    metalness: 0.1,
    ambientColor: '#ffffff',
    accentColor: '#fbbf24',
    textColor: '#ffffff',
    icon: '🎰',
    premium: false,
    animated: false,
  },
  {
    id: 'vegas-gold',
    name: 'Vegas Gold',
    description: 'Luxurious golden casino experience',
    feltColor: '#1a1a2e',
    railColor: '#d4af37',
    emissiveColor: '#ffd700',
    emissiveIntensity: 0.3,
    roughness: 0.3,
    metalness: 0.8,
    particleColor: '#ffd700',
    ambientColor: '#ffd700',
    accentColor: '#ffd700',
    textColor: '#ffd700',
    icon: '👑',
    premium: true,
    animated: true,
  },
  {
    id: 'space',
    name: 'Space Nebula',
    description: 'Cosmic poker among the stars',
    feltColor: '#0f0f23',
    railColor: '#1a1a3e',
    emissiveColor: '#8b5cf6',
    emissiveIntensity: 0.5,
    roughness: 0.5,
    metalness: 0.5,
    particleColor: '#8b5cf6',
    ambientColor: '#8b5cf6',
    accentColor: '#a78bfa',
    textColor: '#c4b5fd',
    icon: '🌌',
    premium: true,
    animated: true,
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'Futuristic neon-lit table',
    feltColor: '#0a0a0a',
    railColor: '#1a1a1a',
    emissiveColor: '#00ffff',
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.9,
    particleColor: '#00ffff',
    ambientColor: '#ff00ff',
    accentColor: '#00ffff',
    textColor: '#00ffff',
    icon: '🤖',
    premium: true,
    animated: true,
  },
  {
    id: 'underwater',
    name: 'Underwater Ocean',
    description: 'Play poker under the sea',
    feltColor: '#1e3a5f',
    railColor: '#2c5f8d',
    emissiveColor: '#06b6d4',
    emissiveIntensity: 0.3,
    roughness: 0.6,
    metalness: 0.4,
    particleColor: '#06b6d4',
    ambientColor: '#0ea5e9',
    accentColor: '#06b6d4',
    textColor: '#67e8f9',
    icon: '🌊',
    premium: true,
    animated: true,
  },
  {
    id: 'medieval',
    name: 'Medieval Castle',
    description: 'Play like royalty in the Middle Ages',
    feltColor: '#450a0a',
    railColor: '#78350f',
    emissiveColor: '#dc2626',
    emissiveIntensity: 0.2,
    roughness: 0.9,
    metalness: 0.2,
    particleColor: '#dc2626',
    ambientColor: '#fbbf24',
    accentColor: '#dc2626',
    textColor: '#fbbf24',
    icon: '🏰',
    premium: true,
    animated: false,
  },
  {
    id: 'halloween',
    name: 'Halloween Spooky',
    description: 'Spooky scary poker night',
    feltColor: '#1a0a00',
    railColor: '#2d1b00',
    emissiveColor: '#f97316',
    emissiveIntensity: 0.4,
    roughness: 0.7,
    metalness: 0.3,
    particleColor: '#f97316',
    ambientColor: '#f97316',
    accentColor: '#f97316',
    textColor: '#fdba74',
    icon: '🎃',
    premium: false,
    animated: true,
  },
  {
    id: 'christmas',
    name: 'Christmas Festive',
    description: 'Ho ho ho! Festive poker fun',
    feltColor: '#0f3a0f',
    railColor: '#7c2d12',
    emissiveColor: '#22c55e',
    emissiveIntensity: 0.3,
    roughness: 0.6,
    metalness: 0.4,
    particleColor: '#ffffff',
    ambientColor: '#22c55e',
    accentColor: '#ef4444',
    textColor: '#ffffff',
    icon: '🎄',
    premium: false,
    animated: true,
  },
  {
    id: 'ice',
    name: 'Frozen Ice',
    description: 'Cool as ice poker table',
    feltColor: '#0c4a6e',
    railColor: '#e0f2fe',
    emissiveColor: '#7dd3fc',
    emissiveIntensity: 0.4,
    roughness: 0.1,
    metalness: 0.9,
    particleColor: '#ffffff',
    ambientColor: '#7dd3fc',
    accentColor: '#bae6fd',
    textColor: '#e0f2fe',
    icon: '❄️',
    premium: true,
    animated: true,
  },
  {
    id: 'lava',
    name: 'Volcanic Lava',
    description: 'High stakes, high heat!',
    feltColor: '#1a0000',
    railColor: '#450a0a',
    emissiveColor: '#ff4500',
    emissiveIntensity: 0.7,
    roughness: 0.5,
    metalness: 0.5,
    particleColor: '#ff4500',
    ambientColor: '#ff4500',
    accentColor: '#ff6347',
    textColor: '#ffa07a',
    icon: '🌋',
    premium: true,
    animated: true,
  },
  {
    id: 'matrix',
    name: 'Matrix Code',
    description: 'Follow the white rabbit',
    feltColor: '#000000',
    railColor: '#0a0a0a',
    emissiveColor: '#00ff00',
    emissiveIntensity: 0.5,
    roughness: 0.3,
    metalness: 0.7,
    particleColor: '#00ff00',
    ambientColor: '#00ff00',
    accentColor: '#00ff00',
    textColor: '#00ff00',
    icon: '🔢',
    premium: true,
    animated: true,
  },
  {
    id: 'rainbow',
    name: 'Rainbow Party',
    description: 'Colorful celebration table',
    feltColor: '#1e293b',
    railColor: '#334155',
    emissiveColor: '#f59e0b',
    emissiveIntensity: 0.4,
    roughness: 0.5,
    metalness: 0.6,
    particleColor: '#f59e0b',
    ambientColor: '#ffffff',
    accentColor: '#f59e0b',
    textColor: '#ffffff',
    icon: '🌈',
    premium: false,
    animated: true,
  },
];

// Themed Poker Table 3D
export function ThemedPokerTable3D({ theme }: { theme: TableTheme }) {
  const tableRef = useRef<THREE.Group>(null);
  const feltRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (theme.animated && feltRef.current) {
      // Pulsing emissive effect
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5;
      (feltRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        theme.emissiveIntensity * (0.5 + pulse * 0.5);
    }

    if (theme.id === 'rainbow' && tableRef.current) {
      // Rainbow color cycling
      const hue = (state.clock.elapsedTime * 0.1) % 1;
      const color = new THREE.Color().setHSL(hue, 0.8, 0.4);
      (feltRef.current?.material as THREE.MeshStandardMaterial)?.emissive.copy(color);
    }
  });

  return (
    <group ref={tableRef}>
      {/* Table Felt */}
      <mesh ref={feltRef} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[3.5, 3.5, 0.1, 64]} />
        <meshStandardMaterial
          color={theme.feltColor}
          roughness={theme.roughness}
          metalness={theme.metalness}
          emissive={theme.emissiveColor}
          emissiveIntensity={theme.emissiveIntensity}
        />
      </mesh>

      {/* Wooden Rail */}
      <mesh castShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, 0]}>
        <cylinderGeometry args={[4.2, 4.2, 0.3, 64]} />
        <meshStandardMaterial
          color={theme.railColor}
          roughness={theme.roughness * 0.8}
          metalness={theme.metalness}
        />
      </mesh>

      {/* Inner ring detail */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <cylinderGeometry args={[3.3, 3.3, 0.02, 64]} />
        <meshStandardMaterial
          color={theme.accentColor}
          roughness={0.3}
          metalness={0.8}
          emissive={theme.accentColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Center Logo */}
      <Text
        position={[0, 0.11, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.4}
        color={theme.textColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={theme.accentColor}
      >
        {theme.icon} {theme.name}
      </Text>

      {/* Theme-specific decorations */}
      {theme.id === 'space' && <SpaceStars />}
      {theme.id === 'underwater' && <Bubbles />}
      {theme.id === 'medieval' && <Torches />}
      {theme.id === 'christmas' && <Snowflakes />}
      {theme.id === 'lava' && <LavaGlow />}
      {theme.id === 'matrix' && <MatrixRain />}
    </group>
  );
}

// Space theme: Floating stars
function SpaceStars() {
  const starsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const starCount = 200;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = Math.random() * 10 + 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.8} />
    </points>
  );
}

// Underwater theme: Rising bubbles
function Bubbles() {
  const bubblesRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (bubblesRef.current) {
      const positions = bubblesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 100; i++) {
        positions[i * 3 + 1] += 0.02;
        if (positions[i * 3 + 1] > 10) {
          positions[i * 3 + 1] = 0;
        }
      }
      bubblesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const bubbleCount = 100;
  const positions = new Float32Array(bubbleCount * 3);
  for (let i = 0; i < bubbleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = Math.random() * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }

  return (
    <points ref={bubblesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={bubbleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#06b6d4" transparent opacity={0.4} />
    </points>
  );
}

// Medieval theme: Corner torches
function Torches() {
  const positions: [number, number, number][] = [
    [5, 2, 5],
    [-5, 2, 5],
    [5, 2, -5],
    [-5, 2, -5],
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Torch stick */}
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          {/* Flame */}
          <mesh position={[0, 1.2, 0]}>
            <coneGeometry args={[0.15, 0.4, 8]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#f97316"
              emissiveIntensity={1}
            />
          </mesh>
          {/* Light */}
          <pointLight position={[0, 1.2, 0]} color="#f97316" intensity={2} distance={5} />
        </group>
      ))}
    </>
  );
}

// Christmas theme: Falling snowflakes
function Snowflakes() {
  const snowRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (snowRef.current) {
      const positions = snowRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 200; i++) {
        positions[i * 3 + 1] -= 0.01;
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 10;
        }
      }
      snowRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const snowCount = 200;
  const positions = new Float32Array(snowCount * 3);
  for (let i = 0; i < snowCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = Math.random() * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  return (
    <points ref={snowRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={snowCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#ffffff" transparent opacity={0.8} />
    </points>
  );
}

// Lava theme: Glowing particles
function LavaGlow() {
  const glowRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (glowRef.current) {
      const positions = glowRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 100; i++) {
        positions[i * 3 + 1] += 0.03;
        if (positions[i * 3 + 1] > 5) {
          positions[i * 3 + 1] = 0.5;
        }
      }
      glowRef.current.geometry.attributes.position.needsUpdate = true;
      glowRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 3 + Math.random();
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.random() * 5;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }

  return (
    <points ref={glowRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ff4500"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Matrix theme: Falling code
function MatrixRain() {
  const matrixRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (matrixRef.current) {
      const positions = matrixRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 300; i++) {
        positions[i * 3 + 1] -= 0.05;
        if (positions[i * 3 + 1] < -2) {
          positions[i * 3 + 1] = 10;
        }
      }
      matrixRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const codeCount = 300;
  const positions = new Float32Array(codeCount * 3);
  for (let i = 0; i < codeCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = Math.random() * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  return (
    <points ref={matrixRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={codeCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#00ff00" transparent opacity={0.7} />
    </points>
  );
}

// Theme Selector UI
export function ThemeSelector({
  selectedTheme,
  onSelectTheme,
}: {
  selectedTheme: TableTheme;
  onSelectTheme: (theme: TableTheme) => void;
}) {
  return (
    <div className="fixed top-4 right-4 bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 max-w-md border-2 border-yellow-400 z-30">
      <h3 className="text-yellow-400 font-bold text-xl mb-4">🎨 Table Themes</h3>

      <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {TABLE_THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onSelectTheme(theme)}
            className={`p-4 rounded-xl transition border-2 ${
              selectedTheme.id === theme.id
                ? 'border-yellow-400 bg-gray-700'
                : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="text-4xl mb-2">{theme.icon}</div>
            <div className="text-white font-semibold text-sm">{theme.name}</div>
            <div className="text-gray-400 text-xs mt-1">{theme.description}</div>
            {theme.premium && (
              <div className="mt-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded">
                PREMIUM
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 text-center text-gray-400 text-xs">
        {TABLE_THEMES.filter((t) => t.premium).length} premium themes available!
      </div>
    </div>
  );
}
