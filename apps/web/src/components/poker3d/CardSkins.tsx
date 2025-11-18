'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

export interface CardSkin {
  id: string;
  name: string;
  description: string;
  frontColor: string;
  backPattern: 'classic' | 'geometric' | 'galaxy' | 'neon' | 'gold' | 'carbon' | 'rainbow';
  backColor: string;
  borderColor: string;
  glowEffect: boolean;
  animated: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  price: number;
  icon: string;
}

export const CARD_SKINS: CardSkin[] = [
  {
    id: 'classic',
    name: 'Classique',
    description: 'Le design traditionnel',
    frontColor: '#ffffff',
    backPattern: 'classic',
    backColor: '#1e40af',
    borderColor: '#000000',
    glowEffect: false,
    animated: false,
    rarity: 'common',
    price: 0,
    icon: '🃏',
  },
  {
    id: 'gold-luxury',
    name: 'Or de Luxe',
    description: 'Brillance dorée premium',
    frontColor: '#fff7ed',
    backPattern: 'gold',
    backColor: '#d4af37',
    borderColor: '#fbbf24',
    glowEffect: true,
    animated: true,
    rarity: 'legendary',
    price: 5000,
    icon: '👑',
  },
  {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk',
    description: 'Futur électrique',
    frontColor: '#0a0a0a',
    backPattern: 'neon',
    backColor: '#00ffff',
    borderColor: '#ff00ff',
    glowEffect: true,
    animated: true,
    rarity: 'epic',
    price: 2500,
    icon: '🤖',
  },
  {
    id: 'galaxy-cosmic',
    name: 'Galaxie Cosmique',
    description: 'Les étoiles dans vos mains',
    frontColor: '#1e1b4b',
    backPattern: 'galaxy',
    backColor: '#4c1d95',
    borderColor: '#8b5cf6',
    glowEffect: true,
    animated: true,
    rarity: 'epic',
    price: 3000,
    icon: '🌌',
  },
  {
    id: 'carbon-fiber',
    name: 'Fibre de Carbone',
    description: 'Style sportif premium',
    frontColor: '#0f172a',
    backPattern: 'carbon',
    backColor: '#1e293b',
    borderColor: '#64748b',
    glowEffect: false,
    animated: false,
    rarity: 'rare',
    price: 1000,
    icon: '🏎️',
  },
  {
    id: 'rainbow-pride',
    name: 'Arc-en-ciel',
    description: 'Toutes les couleurs',
    frontColor: '#ffffff',
    backPattern: 'rainbow',
    backColor: '#ef4444',
    borderColor: '#f59e0b',
    glowEffect: true,
    animated: true,
    rarity: 'rare',
    price: 1500,
    icon: '🌈',
  },
  {
    id: 'emerald-elite',
    name: 'Émeraude Élite',
    description: 'Vert royal',
    frontColor: '#f0fdf4',
    backPattern: 'geometric',
    backColor: '#047857',
    borderColor: '#10b981',
    glowEffect: true,
    animated: false,
    rarity: 'rare',
    price: 1200,
    icon: '💎',
  },
  {
    id: 'blood-red',
    name: 'Rouge Sang',
    description: 'Pour LA BOUCHERIE',
    frontColor: '#fef2f2',
    backPattern: 'geometric',
    backColor: '#7f1d1d',
    borderColor: '#dc2626',
    glowEffect: true,
    animated: true,
    rarity: 'epic',
    price: 2000,
    icon: '🔪',
  },
  {
    id: 'ice-frozen',
    name: 'Glace Gelée',
    description: 'Fraîcheur cristalline',
    frontColor: '#f0f9ff',
    backPattern: 'geometric',
    backColor: '#0c4a6e',
    borderColor: '#0ea5e9',
    glowEffect: true,
    animated: true,
    rarity: 'rare',
    price: 1500,
    icon: '❄️',
  },
  {
    id: 'fire-inferno',
    name: 'Feu Infernal',
    description: 'Flammes ardentes',
    frontColor: '#fff7ed',
    backPattern: 'neon',
    backColor: '#7c2d12',
    borderColor: '#f97316',
    glowEffect: true,
    animated: true,
    rarity: 'epic',
    price: 2200,
    icon: '🔥',
  },
];

// 3D Card with Skin Applied
export function SkinnedCard3D({
  rank,
  suit,
  position,
  rotation,
  faceDown,
  skin,
}: {
  rank: string;
  suit: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  faceDown?: boolean;
  skin: CardSkin;
}) {
  const cardRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cardRef.current && skin.animated) {
      if (skin.backPattern === 'rainbow') {
        const hue = (state.clock.elapsedTime * 0.1) % 1;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
        cardRef.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissive = color;
          }
        });
      }

      if (skin.glowEffect) {
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.5;
        cardRef.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissiveIntensity = pulse * 0.5;
          }
        });
      }
    }
  });

  const isRed = suit === '♥' || suit === '♦';

  return (
    <group ref={cardRef} position={position} rotation={rotation}>
      {/* Card Body */}
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.9, 0.02]} />
        <meshStandardMaterial
          color={faceDown ? skin.backColor : skin.frontColor}
          roughness={0.3}
          metalness={skin.rarity === 'legendary' ? 0.8 : 0.1}
          emissive={skin.backColor}
          emissiveIntensity={skin.glowEffect ? 0.3 : 0}
        />
      </mesh>

      {/* Border */}
      <mesh position={[0, 0, 0.011]}>
        <boxGeometry args={[0.62, 0.92, 0.01]} />
        <meshStandardMaterial
          color={skin.borderColor}
          transparent
          opacity={0.8}
          emissive={skin.borderColor}
          emissiveIntensity={skin.glowEffect ? 0.5 : 0}
        />
      </mesh>

      {!faceDown && (
        <>
          {/* Rank */}
          <Text
            position={[-0.2, 0.3, 0.02]}
            fontSize={0.15}
            color={isRed ? '#ef4444' : '#000000'}
            anchorX="center"
            anchorY="middle"
          >
            {rank}
          </Text>

          {/* Suit */}
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.35}
            color={isRed ? '#ef4444' : '#000000'}
            anchorX="center"
            anchorY="middle"
          >
            {suit}
          </Text>

          {/* Small rank bottom */}
          <Text
            position={[0.2, -0.3, 0.02]}
            fontSize={0.15}
            color={isRed ? '#ef4444' : '#000000'}
            anchorX="center"
            anchorY="middle"
            rotation={[0, 0, Math.PI]}
          >
            {rank}
          </Text>
        </>
      )}

      {/* Glow Effect */}
      {skin.glowEffect && (
        <mesh>
          <boxGeometry args={[0.7, 1, 0.05]} />
          <meshBasicMaterial
            color={skin.borderColor}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}
    </group>
  );
}

// Card Skin Shop
export function CardSkinShop({
  ownedSkins,
  currentSkin,
  balance,
  onPurchase,
  onSelect,
}: {
  ownedSkins: string[];
  currentSkin: string;
  balance: number;
  onPurchase: (skinId: string) => void;
  onSelect: (skinId: string) => void;
}) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-yellow-500 to-orange-500';
      case 'epic':
        return 'from-purple-500 to-pink-500';
      case 'rare':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="fixed inset-4 bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 border-4 border-yellow-400 z-50 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-yellow-400 font-bold text-3xl mb-2">🎨 Boutique de Skins</h2>
          <div className="text-white text-xl">
            Solde: <span className="text-green-400 font-bold">${balance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {CARD_SKINS.map((skin) => {
          const owned = ownedSkins.includes(skin.id);
          const selected = currentSkin === skin.id;
          const canAfford = balance >= skin.price;

          return (
            <motion.div
              key={skin.id}
              whileHover={{ scale: 1.05 }}
              className={`bg-gradient-to-br ${getRarityColor(skin.rarity)} rounded-xl p-1`}
            >
              <div className="bg-gray-800 rounded-lg p-6">
                {/* Skin Icon */}
                <div className="text-6xl text-center mb-4">{skin.icon}</div>

                {/* Name & Rarity */}
                <div className="text-white font-bold text-xl text-center mb-2">{skin.name}</div>
                <div className="text-center mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColor(
                      skin.rarity
                    )} text-white`}
                  >
                    {skin.rarity.toUpperCase()}
                  </span>
                </div>

                {/* Description */}
                <div className="text-gray-400 text-sm text-center mb-4">{skin.description}</div>

                {/* Features */}
                <div className="flex gap-2 justify-center mb-4">
                  {skin.glowEffect && (
                    <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">✨ Glow</div>
                  )}
                  {skin.animated && (
                    <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">🔄 Animated</div>
                  )}
                </div>

                {/* Action Button */}
                {owned ? (
                  selected ? (
                    <div className="bg-green-600 text-white py-3 rounded-lg font-bold text-center">
                      ✓ Équipé
                    </div>
                  ) : (
                    <button
                      onClick={() => onSelect(skin.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition"
                    >
                      Équiper
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => onPurchase(skin.id)}
                    disabled={!canAfford}
                    className={`w-full py-3 rounded-lg font-bold transition ${
                      canAfford
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {skin.price === 0 ? 'Gratuit' : `$${skin.price.toLocaleString()}`}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Skin Preview
export function SkinPreview({ skin }: { skin: CardSkin }) {
  return (
    <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 border-2 border-yellow-400">
      <div className="text-yellow-400 font-bold text-xl mb-4">👁️ Aperçu</div>
      <div className="bg-gray-800 rounded-lg p-8 flex items-center justify-center">
        <div className="text-8xl">{skin.icon}</div>
      </div>
      <div className="mt-4 text-white text-center font-bold text-2xl">{skin.name}</div>
      <div className="mt-2 text-gray-400 text-center">{skin.description}</div>
    </div>
  );
}
