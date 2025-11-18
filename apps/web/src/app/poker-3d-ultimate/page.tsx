'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import * as THREE from 'three';

// Disable static generation
export const dynamic = 'force-dynamic';

// Dynamic imports for 3D components
const BoucherieTable3D = dynamic(() => import('@/components/poker3d/BoucherieTable3D'), { ssr: false });
const PlayerAvatar3D = dynamic(() => import('@/components/poker3d/PlayerAvatar3D'), { ssr: false });
const ActionBubble = dynamic(() => import('@/components/poker3d/PlayerAvatar3D').then(mod => ({ default: mod.ActionBubble })), { ssr: false });
const ParticleEffects3D = dynamic(() => import('@/components/poker3d/ParticleEffects3D'), { ssr: false });
const AnimatedCardDealing = dynamic(() => import('@/components/poker3d/AnimatedCardDealing'), { ssr: false });
const CommunityCardReveal = dynamic(() => import('@/components/poker3d/AnimatedCardDealing').then(mod => ({ default: mod.CommunityCardReveal })), { ssr: false });
const CameraController = dynamic(() => import('@/components/poker3d/CameraController'), { ssr: false });
const CinematicCameraAnimation = dynamic(() => import('@/components/poker3d/CameraController').then(mod => ({ default: mod.CinematicCameraAnimation })), { ssr: false });

import useSpatialAudio from '@/components/poker3d/SpatialAudio';
import type { CameraView } from '@/components/poker3d/CameraController';

interface Player {
  id: string;
  name: string;
  chips: number;
  position: number;
  emotion: 'neutral' | 'happy' | 'sad' | 'angry' | 'thinking' | 'shocked';
  action: 'idle' | 'celebrate' | 'frustrated' | 'thinking';
  isActive: boolean;
  actionText?: string;
}

function UltimatePokerScene() {
  const [players] = useState<Player[]>([
    {
      id: '1',
      name: 'Vous',
      chips: 5000,
      position: 0,
      emotion: 'happy',
      action: 'idle',
      isActive: true,
      actionText: 'All-In! 🚀',
    },
    {
      id: '2',
      name: 'Le Boucher',
      chips: 12000,
      position: 2,
      emotion: 'angry',
      action: 'idle',
      isActive: false,
      actionText: 'Je Call! 🔪',
    },
    {
      id: '3',
      name: 'Phil',
      chips: 3500,
      position: 4,
      emotion: 'thinking',
      action: 'thinking',
      isActive: false,
    },
    {
      id: '4',
      name: 'Vanessa',
      chips: 7800,
      position: 6,
      emotion: 'shocked',
      action: 'idle',
      isActive: false,
      actionText: 'Fold... 😱',
    },
  ]);

  const [showParticles, setShowParticles] = useState(true);
  const [showCards, setShowCards] = useState(true);
  const [cameraView, setCameraView] = useState<CameraView>('orbit');
  const [cinematicMode, setCinematicMode] = useState(false);

  const audio = useSpatialAudio(true);

  useEffect(() => {
    // Play ambient sounds on mount
    audio.playAmbience();
  }, []);

  // Get player 3D position
  const getPlayerPosition = (position: number): [number, number, number] => {
    const angle = (position * (360 / 9)) * (Math.PI / 180);
    const radius = 2.8;
    return [Math.cos(angle) * radius, 0.3, Math.sin(angle) * radius];
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight
        position={[0, 5, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={0.8}
        color="#ff0000"
        castShadow
      />
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#8b0000" />

      {/* Environment */}
      <Environment preset="night" />

      {/* LA BOUCHERIE Table */}
      <BoucherieTable3D />

      {/* Contact Shadows */}
      <ContactShadows
        position={[0, -0.49, 0]}
        opacity={0.6}
        scale={10}
        blur={2}
        far={4}
        color="#8b0000"
      />

      {/* Players with Avatars */}
      {players.map((player) => {
        const pos = getPlayerPosition(player.position);
        return (
          <React.Fragment key={player.id}>
            <PlayerAvatar3D
              position={pos}
              name={player.name}
              chips={player.chips}
              emotion={player.emotion}
              action={player.action}
              isActive={player.isActive}
            />
            {player.actionText && (
              <ActionBubble
                position={[pos[0], pos[1] + 1.5, pos[2]]}
                text={player.actionText}
                type={player.emotion === 'happy' ? 'win' : 'action'}
              />
            )}
          </React.Fragment>
        );
      })}

      {/* Particle Effects */}
      {showParticles && (
        <>
          {/* Victory confetti for winner */}
          <ParticleEffects3D
            type="confetti"
            position={getPlayerPosition(0)}
            active={true}
            intensity={1.5}
          />

          {/* Sparks for all-in */}
          <ParticleEffects3D
            type="sparks"
            position={[0, 0.5, 0]}
            active={true}
            intensity={1.0}
          />

          {/* Chips falling into pot */}
          <ParticleEffects3D
            type="chips"
            position={[0, 1, 0]}
            active={true}
            intensity={0.8}
          />
        </>
      )}

      {/* Community Cards Reveal */}
      {showCards && (
        <CommunityCardReveal
          cards={[
            { rank: 'A', suit: 'h' },
            { rank: 'K', suit: 'h' },
            { rank: 'Q', suit: 'h' },
            { rank: 'J', suit: 'h' },
            { rank: '10', suit: 'h' },
          ]}
          onComplete={() => {
            console.log('🎉 ROYAL FLUSH!');
            audio.playVictory([0, 0, 0]);
          }}
        />
      )}

      {/* Camera Controller */}
      <CameraController view={cameraView} playerPosition={0} smooth={true} />

      {/* Cinematic Mode */}
      {cinematicMode && (
        <CinematicCameraAnimation enabled={true} type="sweep" />
      )}
    </>
  );
}

export default function Poker3DUltimatePage() {
  const [cameraView, setCameraView] = useState<CameraView>('orbit');
  const [cinematicMode, setCinematicMode] = useState(false);
  const [showParticles, setShowParticles] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);

  const audio = useSpatialAudio(audioEnabled);

  const cameraViews: { id: CameraView; name: string; icon: string }[] = [
    { id: 'orbit', name: 'Orbit', icon: '🔄' },
    { id: 'tv', name: 'TV View', icon: '📺' },
    { id: 'firstPerson', name: 'First Person', icon: '👤' },
    { id: 'topDown', name: 'Top Down', icon: '🦅' },
    { id: 'cinematic', name: 'Cinematic', icon: '🎬' },
    { id: 'dealer', name: 'Dealer', icon: '🎰' },
  ];

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Epic Title Overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30"
      >
        <div className="bg-gradient-to-r from-red-900 via-red-700 to-red-900 border-4 border-red-500 rounded-2xl px-8 py-4 shadow-2xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-wider">
              🔪 LA BOUCHERIE 3D 🩸
            </h1>
            <p className="text-red-300 text-lg">
              The Ultimate 3D Poker Experience
            </p>
          </div>
        </div>
      </motion.div>

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-30 bg-gray-900/90 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-bold transition backdrop-blur-sm border-2 border-red-500"
      >
        ← Retour
      </Link>

      {/* Camera Controls */}
      <div className="absolute top-4 right-4 z-30 bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 border-2 border-red-500 max-w-xs">
        <h3 className="text-red-400 font-bold mb-3">📹 Camera Views</h3>
        <div className="grid grid-cols-2 gap-2">
          {cameraViews.map((view) => (
            <button
              key={view.id}
              onClick={() => {
                setCameraView(view.id);
                audio.playSound('select', [0, 0, 0], 0.5);
              }}
              className={`px-3 py-2 rounded-lg font-semibold transition ${
                cameraView === view.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {view.icon} {view.name}
            </button>
          ))}
        </div>
      </div>

      {/* Effects Controls */}
      <div className="absolute bottom-4 left-4 z-30 bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 border-2 border-red-500">
        <h3 className="text-red-400 font-bold mb-3">✨ Effects</h3>
        <div className="space-y-2">
          <button
            onClick={() => {
              setCinematicMode(!cinematicMode);
              audio.playSound('toggle', [0, 0, 0]);
            }}
            className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
              cinematicMode
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            🎬 Cinematic {cinematicMode ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => {
              setShowParticles(!showParticles);
              audio.playSound('toggle', [0, 0, 0]);
            }}
            className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
              showParticles
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            🎆 Particles {showParticles ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => {
              setAudioEnabled(!audioEnabled);
            }}
            className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
              audioEnabled
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            🔊 Audio {audioEnabled ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => {
              setAutoRotate(!autoRotate);
              audio.playSound('toggle', [0, 0, 0]);
            }}
            className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
              autoRotate
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            🔄 Auto-Rotate {autoRotate ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-4 right-4 z-30 bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 border-2 border-red-500">
        <h3 className="text-red-400 font-bold mb-3">🎮 Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              audio.playChipSound(5, [0, 0, 0]);
            }}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-bold transition"
          >
            💰 Chips
          </button>
          <button
            onClick={() => {
              audio.playCardShuffle([0, 0, 0]);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition"
          >
            🃏 Shuffle
          </button>
          <button
            onClick={() => {
              audio.playAllIn([0, 0, 0]);
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition"
          >
            🚀 All-In
          </button>
          <button
            onClick={() => {
              audio.playVictory([0, 0, 0]);
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition"
          >
            🎉 Victory
          </button>
        </div>
      </div>

      {/* Features List */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-32 left-4 z-20 bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 max-w-xs border-2 border-red-500"
      >
        <h3 className="text-red-400 font-bold mb-2">🔥 Features</h3>
        <ul className="text-white text-sm space-y-1">
          <li>✅ 3D Avatars with emotions</li>
          <li>✅ Particle effects (confetti, blood, sparks)</li>
          <li>✅ 6 camera views</li>
          <li>✅ Cinematic animations</li>
          <li>✅ Spatial 3D audio</li>
          <li>✅ Speech bubbles</li>
          <li>✅ Blood theme table</li>
          <li>✅ Royal Flush reveal</li>
        </ul>
      </motion.div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 8, 10], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <UltimatePokerScene />
          {!cinematicMode && (
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
          )}
        </Suspense>
      </Canvas>

      {/* Loading Overlay */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute inset-0 bg-black flex items-center justify-center z-40 pointer-events-none"
        >
          <div className="text-center">
            <div className="text-8xl mb-4 animate-pulse">🔪</div>
            <h2 className="text-4xl font-bold text-red-500 mb-2">Loading...</h2>
            <p className="text-red-300">Preparing the carnage 🩸</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
