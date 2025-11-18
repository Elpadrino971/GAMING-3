'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

// AR Marker Detection
export interface ARMarker {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  detected: boolean;
}

// Mobile AR Manager
export class MobileARManager {
  private static instance: MobileARManager;
  private videoElement: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private isARSupported: boolean = false;

  private constructor() {
    this.checkARSupport();
  }

  static getInstance(): MobileARManager {
    if (!MobileARManager.instance) {
      MobileARManager.instance = new MobileARManager();
    }
    return MobileARManager.instance;
  }

  private checkARSupport() {
    // Check for WebXR AR support
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        this.isARSupported = supported;
      });
    }
  }

  async startCamera(): Promise<HTMLVideoElement> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      this.videoElement = document.createElement('video');
      this.videoElement.srcObject = this.stream;
      this.videoElement.setAttribute('playsinline', '');
      this.videoElement.play();

      return this.videoElement;
    } catch (error) {
      console.error('Failed to start camera:', error);
      throw error;
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }
  }

  getVideoElement(): HTMLVideoElement | null {
    return this.videoElement;
  }

  isSupported(): boolean {
    return this.isARSupported || !!navigator.mediaDevices?.getUserMedia;
  }
}

// AR Video Background
export function ARVideoBackground() {
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);
  const { scene } = useThree();

  useEffect(() => {
    const arManager = MobileARManager.getInstance();

    arManager.startCamera().then((video) => {
      const texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBAFormat;
      setVideoTexture(texture);

      // Set as scene background
      scene.background = texture;
    }).catch((error) => {
      console.error('AR camera failed:', error);
    });

    return () => {
      arManager.stopCamera();
      if (scene.background instanceof THREE.VideoTexture) {
        scene.background = null;
      }
    };
  }, [scene]);

  return null;
}

// AR Poker Table (scaled for real-world)
export function ARPokerTable({
  position = [0, 0, -1],
  scale = 0.3,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const tableRef = useRef<THREE.Group>(null);
  const [detected, setDetected] = useState(true);

  useFrame((state) => {
    if (tableRef.current && detected) {
      // Subtle floating animation
      tableRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group ref={tableRef} position={position} scale={scale}>
      {/* Table Felt */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[3.5, 3.5, 0.1, 64]} />
        <meshStandardMaterial
          color="#1e7a1e"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Wooden Rail */}
      <mesh castShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, 0]}>
        <cylinderGeometry args={[4.2, 4.2, 0.3, 64]} />
        <meshStandardMaterial color="#4a2511" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* AR Logo */}
      <Text
        position={[0, 0.11, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.4}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        🎮 AR POKER
      </Text>

      {/* AR Markers (corners) */}
      <ARMarkerCorners />
    </group>
  );
}

// AR Marker Corners (for tracking)
function ARMarkerCorners() {
  const positions: [number, number, number][] = [
    [3.8, 0.3, 3.8],
    [-3.8, 0.3, 3.8],
    [3.8, 0.3, -3.8],
    [-3.8, 0.3, -3.8],
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </>
  );
}

// AR Card (floating above table)
export function ARCard({
  rank,
  suit,
  position,
}: {
  rank: string;
  suit: string;
  position: [number, number, number];
}) {
  const cardRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cardRef.current) {
      cardRef.current.rotation.y = state.clock.elapsedTime;
      cardRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const isRed = suit === '♥' || suit === '♦';

  return (
    <group ref={cardRef} position={position}>
      {/* Card front */}
      <mesh>
        <boxGeometry args={[0.6, 0.9, 0.02]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Rank and Suit */}
      <Text
        position={[0, 0.2, 0.02]}
        fontSize={0.25}
        color={isRed ? '#ef4444' : '#000000'}
        anchorX="center"
        anchorY="middle"
      >
        {rank}
      </Text>
      <Text
        position={[0, -0.1, 0.02]}
        fontSize={0.3}
        color={isRed ? '#ef4444' : '#000000'}
        anchorX="center"
        anchorY="middle"
      >
        {suit}
      </Text>

      {/* Glow effect */}
      <mesh>
        <boxGeometry args={[0.7, 1, 0.05]} />
        <meshStandardMaterial
          color="#fbbf24"
          transparent
          opacity={0.3}
          emissive="#fbbf24"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

// AR Hand Display (player's cards in AR)
export function ARHandDisplay({
  cards,
  position,
}: {
  cards: { rank: string; suit: string }[];
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      {cards.map((card, i) => (
        <ARCard
          key={i}
          rank={card.rank}
          suit={card.suit}
          position={[(i - cards.length / 2) * 0.8, 0, 0]}
        />
      ))}
    </group>
  );
}

// AR UI Overlay
export function ARUIOverlay() {
  return (
    <Html
      position={[0, 3, -2]}
      transform
      occlude={false}
      style={{
        width: '400px',
        pointerEvents: 'none',
      }}
    >
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 border-2 border-cyan-400">
        <div className="text-cyan-400 font-bold text-xl mb-2">🎯 AR Mode Active</div>
        <div className="text-white text-sm">
          Déplacez votre appareil pour explorer la table en 3D
        </div>
      </div>
    </Html>
  );
}

// AR Controls
export function ARControls() {
  const [arActive, setArActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const arManager = MobileARManager.getInstance();

  useEffect(() => {
    // Check camera permission
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'camera' as PermissionName }).then((result) => {
        setCameraPermission(result.state as any);
      });
    }
  }, []);

  const toggleAR = async () => {
    if (!arActive) {
      try {
        await arManager.startCamera();
        setArActive(true);
      } catch (error) {
        alert('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
      }
    } else {
      arManager.stopCamera();
      setArActive(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <button
        onClick={toggleAR}
        className={`px-8 py-4 rounded-full font-bold text-xl shadow-2xl border-4 transition transform hover:scale-105 ${
          arActive
            ? 'bg-gradient-to-r from-red-600 to-pink-600 border-red-400 text-white'
            : 'bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-400 text-white'
        }`}
      >
        {arActive ? '🛑 Arrêter AR' : '📱 Activer AR'}
      </button>

      {!arManager.isSupported() && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-red-900 text-white px-4 py-2 rounded-lg text-sm">
          ⚠️ AR non supporté sur cet appareil
        </div>
      )}
    </div>
  );
}

// AR Calibration Guide
export function ARCalibrationGuide({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: '1. Trouvez une surface plane',
      description: 'Placez votre appareil face à une table ou un bureau',
      icon: '📏',
    },
    {
      title: '2. Scannez la surface',
      description: 'Déplacez lentement votre appareil pour détecter le plan',
      icon: '🔍',
    },
    {
      title: '3. Tapez pour placer',
      description: 'Touchez l\'écran pour placer la table de poker',
      icon: '👆',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-cyan-900 to-blue-900 rounded-2xl p-8 max-w-md border-4 border-cyan-400">
        <div className="text-6xl text-center mb-4">{steps[step].icon}</div>
        <h2 className="text-cyan-400 font-bold text-2xl mb-2 text-center">
          {steps[step].title}
        </h2>
        <p className="text-white text-center mb-6">{steps[step].description}</p>

        <div className="flex gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full ${
                i <= step ? 'bg-cyan-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold"
            >
              Retour
            </button>
          )}
          <button
            onClick={() => {
              if (step < steps.length - 1) {
                setStep(step + 1);
              } else {
                onComplete();
              }
            }}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            {step < steps.length - 1 ? 'Suivant' : 'Commencer'}
          </button>
        </div>
      </div>
    </div>
  );
}

// AR Gesture Hints
export function ARGestureHints() {
  const hints = [
    { icon: '👆', text: 'Touchez pour placer' },
    { icon: '🤏', text: 'Pincez pour zoomer' },
    { icon: '🔄', text: 'Tournez pour pivoter' },
    { icon: '👆👆', text: '2 doigts pour déplacer' },
  ];

  return (
    <div className="fixed top-4 left-4 z-40 space-y-2">
      {hints.map((hint, i) => (
        <div
          key={i}
          className="bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-cyan-400 flex items-center gap-2"
        >
          <div className="text-2xl">{hint.icon}</div>
          <div className="text-cyan-400 text-sm font-semibold">{hint.text}</div>
        </div>
      ))}
    </div>
  );
}

// AR Distance Indicator
export function ARDistanceIndicator({ distance }: { distance: number }) {
  const getColor = () => {
    if (distance < 0.5) return 'text-red-400';
    if (distance > 2) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getMessage = () => {
    if (distance < 0.5) return 'Trop proche! Reculez';
    if (distance > 2) return 'Trop loin! Rapprochez-vous';
    return 'Distance idéale ✓';
  };

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg px-6 py-3 border-2 border-cyan-400">
        <div className={`${getColor()} font-bold text-lg`}>
          📏 {distance.toFixed(1)}m - {getMessage()}
        </div>
      </div>
    </div>
  );
}

// AR Session Stats
export function ARSessionStats({
  handsPlayed,
  sessionTime,
}: {
  handsPlayed: number;
  sessionTime: number;
}) {
  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 border-2 border-cyan-400">
        <div className="text-cyan-400 font-bold mb-2">Session AR</div>
        <div className="space-y-1">
          <div className="text-white text-sm">
            🎰 Mains: <span className="font-bold">{handsPlayed}</span>
          </div>
          <div className="text-white text-sm">
            ⏱️ Temps: <span className="font-bold">{Math.floor(sessionTime / 60)}m</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Device Orientation Hint
export function DeviceOrientationHint() {
  const [isLandscape, setIsLandscape] = useState(true);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  if (isLandscape) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-8xl mb-4">📱</div>
        <div className="text-white text-2xl font-bold mb-2">
          Tournez votre appareil
        </div>
        <div className="text-gray-400">
          Le mode AR fonctionne mieux en orientation paysage
        </div>
      </div>
    </div>
  );
}
