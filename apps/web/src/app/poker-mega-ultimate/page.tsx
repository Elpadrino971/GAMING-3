'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Disable static generation
export const dynamic = 'force-dynamic';

// Dynamic imports
const BoucherieTable3D = dynamic(() => import('@/components/poker3d/BoucherieTable3D'), { ssr: false });
const CustomAvatar3D = dynamic(() => import('@/components/poker3d/AvatarBuilder').then(mod => ({ default: mod.CustomAvatar3D })), { ssr: false });
const AvatarBuilderUI = dynamic(() => import('@/components/poker3d/AvatarBuilder').then(mod => ({ default: mod.AvatarBuilderUI })), { ssr: false });
const DEFAULT_AVATAR = dynamic(() => import('@/components/poker3d/AvatarBuilder').then(mod => ({ default: mod.DEFAULT_AVATAR })), { ssr: false });
const PhysicsPokerScene = dynamic(() => import('@/components/poker3d/PhysicsChips').then(mod => ({ default: mod.PhysicsPokerScene })), { ssr: false });
const ChipToss = dynamic(() => import('@/components/poker3d/PhysicsChips').then(mod => ({ default: mod.ChipToss })), { ssr: false });
const ChipExplosion = dynamic(() => import('@/components/poker3d/PhysicsChips').then(mod => ({ default: mod.ChipExplosion })), { ssr: false });
const ParticleEffects3D = dynamic(() => import('@/components/poker3d/ParticleEffects3D'), { ssr: false });
const CommentaryDisplay = dynamic(() => import('@/components/poker3d/Commentator').then(mod => ({ default: mod.CommentaryDisplay })), { ssr: false });
const Tournament3DBracket = dynamic(() => import('@/components/poker3d/Tournament3DBracket').then(mod => ({ default: mod.Tournament3DBracket })), { ssr: false });
const SAMPLE_TOURNAMENT = dynamic(() => import('@/components/poker3d/Tournament3DBracket').then(mod => ({ default: mod.SAMPLE_TOURNAMENT })), { ssr: false });
const ReplayController = dynamic(() => import('@/components/poker3d/ReplaySystem').then(mod => ({ default: mod.ReplayController })), { ssr: false });
const SAMPLE_REPLAY = dynamic(() => import('@/components/poker3d/ReplaySystem').then(mod => ({ default: mod.SAMPLE_REPLAY })), { ssr: false });
const AI_PERSONALITIES = dynamic(() => import('@/components/poker3d/AIPersonalities').then(mod => ({ default: mod.AI_PERSONALITIES })), { ssr: false });

import useSpatialAudio from '@/components/poker3d/SpatialAudio';
import type { AvatarConfig } from '@/components/poker3d/AvatarBuilder';

export default function PokerMegaUltimatePage() {
  const [mode, setMode] = useState<'play' | 'avatar' | 'tournament' | 'replay'>('play');
  const [showAvatarBuilder, setShowAvatarBuilder] = useState(false);
  const [userAvatar, setUserAvatar] = useState<AvatarConfig | null>(null);
  const [explosionTrigger, setExplosionTrigger] = useState(false);
  const [chipTossTrigger, setChipTossTrigger] = useState(false);
  const [showParticles, setShowParticles] = useState(true);
  const [replayTime, setReplayTime] = useState(0);

  const audio = useSpatialAudio(true);

  const handleAllIn = () => {
    setExplosionTrigger(true);
    audio.playAllIn([0, 0, 0]);
    setTimeout(() => setExplosionTrigger(false), 3000);

    // Trigger commentary
    const event = new CustomEvent('poker-commentary', {
      detail: {
        type: 'hype',
        text: '🚨 ALL-IN MASSIF! TOUT EST EN JEU! 🚨',
        timestamp: Date.now(),
      },
    });
    window.dispatchEvent(event);
  };

  const handleRaise = () => {
    setChipTossTrigger(true);
    audio.playChipSound(5, [0, 0, 0]);
    setTimeout(() => setChipTossTrigger(false), 2000);
  };

  const handleSaveAvatar = (config: AvatarConfig) => {
    setUserAvatar(config);
    setShowAvatarBuilder(false);
    alert('✅ Avatar sauvegardé!');
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Epic Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40"
      >
        <div className="bg-gradient-to-r from-purple-900 via-red-900 to-orange-900 border-4 border-yellow-400 rounded-2xl px-8 py-4 shadow-2xl">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-center">
            🎮 POKER MEGA ULTIMATE 3D 🔥
          </h1>
          <p className="text-yellow-300 text-center mt-2 text-lg">
            VR • Physics • AI • Replay • Commentary • Tournament
          </p>
        </div>
      </motion.div>

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-40 bg-gray-900/90 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-bold transition backdrop-blur-sm border-2 border-yellow-400"
      >
        ← Retour
      </Link>

      {/* Mode Selector */}
      <div className="absolute top-28 left-1/2 transform -translate-x-1/2 z-40 flex gap-2">
        {[
          { id: 'play', label: 'Play', icon: '🎮' },
          { id: 'avatar', label: 'Avatar', icon: '👤' },
          { id: 'tournament', label: 'Tournament', icon: '🏆' },
          { id: 'replay', label: 'Replay', icon: '🎬' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as any)}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              mode === m.id
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-900/90 text-white hover:bg-gray-800 border-2 border-gray-700'
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* Avatar Builder Overlay */}
      <AnimatePresence>
        {showAvatarBuilder && mode === 'avatar' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto p-4"
          >
            <div className="relative">
              <button
                onClick={() => setShowAvatarBuilder(false)}
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition z-10"
              >
                ✕ Fermer
              </button>
              <AvatarBuilderUI onSave={handleSaveAvatar} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Panel */}
      <div className="absolute bottom-4 left-4 z-30 bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 border-2 border-yellow-400">
        <h3 className="text-yellow-400 font-bold mb-3">🎮 Actions</h3>
        <div className="space-y-2">
          <button
            onClick={handleRaise}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition"
          >
            💰 Raise (Physics)
          </button>
          <button
            onClick={handleAllIn}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition"
          >
            🚀 ALL-IN (Explosion!)
          </button>
          <button
            onClick={() => audio.playVictory([0, 0, 0])}
            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition"
          >
            🎉 Victory Sound
          </button>
          {mode === 'avatar' && (
            <button
              onClick={() => setShowAvatarBuilder(true)}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition"
            >
              👤 Customize Avatar
            </button>
          )}
        </div>
      </div>

      {/* Feature List */}
      <div className="absolute top-48 left-4 z-30 bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 max-w-xs border-2 border-yellow-400">
        <h3 className="text-yellow-400 font-bold mb-2">✨ Features</h3>
        <ul className="text-white text-xs space-y-1">
          <li>✅ VR Ready (WebXR)</li>
          <li>✅ Physics Engine (Rapier)</li>
          <li>✅ AI Bots (8 personalities)</li>
          <li>✅ Avatar Builder</li>
          <li>✅ Replay System</li>
          <li>✅ Tournament Bracket 3D</li>
          <li>✅ Live Commentary (FR)</li>
          <li>✅ Particle FX</li>
          <li>✅ Post-Processing</li>
          <li>✅ Spatial Audio</li>
        </ul>
      </div>

      {/* AI Bots List */}
      {mode === 'play' && (
        <div className="absolute top-48 right-4 z-30 bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 max-w-xs border-2 border-red-500">
          <h3 className="text-red-400 font-bold mb-2">🤖 AI Opponents</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {AI_PERSONALITIES?.slice(0, 6).map((ai: any) => (
              <div key={ai.id} className="bg-gray-800 rounded-lg p-2">
                <div className="text-white font-semibold text-sm">
                  {ai.avatar} {ai.name}
                </div>
                <div className="text-gray-400 text-xs">{ai.style}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 8, 10], fov: 50 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          {mode === 'play' && (
            <PhysicsPokerScene>
              {/* Lighting */}
              <ambientLight intensity={0.3} />
              <directionalLight position={[10, 10, 5]} intensity={0.6} castShadow />
              <spotLight position={[0, 5, 0]} angle={0.6} penumbra={0.5} intensity={0.8} color="#ff0000" castShadow />

              <Environment preset="night" />

              <BoucherieTable3D />
              <ContactShadows position={[0, -0.49, 0]} opacity={0.6} scale={10} blur={2} far={4} color="#8b0000" />

              {/* User Avatar */}
              {userAvatar && (
                <CustomAvatar3D config={userAvatar} position={[0, 0.3, 3]} />
              )}

              {/* Physics Effects */}
              {explosionTrigger && (
                <ChipExplosion position={[0, 0.5, 0]} chipCount={30} trigger={true} />
              )}

              {chipTossTrigger && (
                <ChipToss
                  value={100}
                  count={5}
                  fromPosition={[2, 0, 2]}
                  toPosition={[0, 0, 0]}
                  onComplete={() => setChipTossTrigger(false)}
                />
              )}

              {/* Particles */}
              {showParticles && (
                <>
                  <ParticleEffects3D type="confetti" position={[0, 2, 0]} active={true} intensity={0.5} />
                  <ParticleEffects3D type="sparks" position={[0, 0.5, 0]} active={true} intensity={0.3} />
                </>
              )}
            </PhysicsPokerScene>
          )}

          {mode === 'avatar' && userAvatar && (
            <>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <Environment preset="city" />

              <CustomAvatar3D config={userAvatar} position={[0, 0, 0]} />

              <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <circleGeometry args={[2, 32]} />
                <meshStandardMaterial color="#333333" />
              </mesh>
            </>
          )}

          {mode === 'tournament' && SAMPLE_TOURNAMENT && (
            <>
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={0.8} />
              <Environment preset="sunset" />

              <Tournament3DBracket matches={SAMPLE_TOURNAMENT} currentRound={2} />
            </>
          )}

          {mode === 'replay' && (
            <>
              <ambientLight intensity={0.3} />
              <directionalLight position={[10, 10, 5]} intensity={0.6} castShadow />
              <Environment preset="night" />

              <BoucherieTable3D />
              <ContactShadows position={[0, -0.49, 0]} opacity={0.5} scale={10} blur={2} />
            </>
          )}

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>

      {/* Commentary Display */}
      <CommentaryDisplay />

      {/* Replay Controller */}
      {mode === 'replay' && SAMPLE_REPLAY && (
        <ReplayController replay={SAMPLE_REPLAY} onTimeUpdate={setReplayTime} />
      )}

      {/* Loading Screen */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute inset-0 bg-black flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="text-center">
            <div className="text-8xl mb-4 animate-bounce">🎰</div>
            <h2 className="text-4xl font-bold text-yellow-400 mb-2">Loading...</h2>
            <p className="text-yellow-300">Initializing MEGA ULTIMATE MODE 🔥</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
