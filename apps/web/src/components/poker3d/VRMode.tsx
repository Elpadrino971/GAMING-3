'use client';

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { VRButton, XR, Controllers, Hands } from '@react-three/xr';
import * as THREE from 'three';

// VR Controller for poker actions
export function VRPokerController() {
  const controllerRef = useRef<THREE.Group>(null);

  return (
    <>
      {/* Left Controller - Card interactions */}
      <group>
        <mesh position={[-0.5, 1.5, -0.5]}>
          <boxGeometry args={[0.05, 0.05, 0.2]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
      </group>

      {/* Right Controller - Chip interactions */}
      <group>
        <mesh position={[0.5, 1.5, -0.5]}>
          <boxGeometry args={[0.05, 0.05, 0.2]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>
    </>
  );
}

// VR Hand Tracking for natural interactions
export function VRHandPoker() {
  return (
    <>
      <Hands />
    </>
  );
}

// VR UI Panel (floating in space)
export function VRUIPanel({ position = [0, 1.5, -1] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Background panel */}
      <mesh>
        <planeGeometry args={[1.5, 0.8]} />
        <meshStandardMaterial
          color="#1f2937"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Action buttons (Fold, Call, Raise, All-In) */}
      {[
        { label: 'FOLD', color: '#ef4444', pos: [-0.6, 0.2, 0.01] },
        { label: 'CALL', color: '#3b82f6', pos: [-0.2, 0.2, 0.01] },
        { label: 'RAISE', color: '#eab308', pos: [0.2, 0.2, 0.01] },
        { label: 'ALL-IN', color: '#22c55e', pos: [0.6, 0.2, 0.01] },
      ].map((btn, i) => (
        <group key={i} position={btn.pos as [number, number, number]}>
          <mesh>
            <boxGeometry args={[0.25, 0.15, 0.02]} />
            <meshStandardMaterial color={btn.color} />
          </mesh>
          {/* Button label would go here with Text component */}
        </group>
      ))}

      {/* Chip stack visualization */}
      <group position={[0, -0.2, 0.01]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      </group>
    </group>
  );
}

// Teleport system for VR
export function VRTeleport() {
  const { camera } = useThree();

  const teleportTo = (position: THREE.Vector3) => {
    camera.position.copy(position);
  };

  // Teleport spots around table
  const spots: [number, number, number][] = [
    [0, 1.6, 5],   // Front
    [5, 1.6, 0],   // Right
    [0, 1.6, -5],  // Back
    [-5, 1.6, 0],  // Left
  ];

  return (
    <>
      {spots.map((spot, i) => (
        <mesh
          key={i}
          position={spot}
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={() => teleportTo(new THREE.Vector3(...spot))}
        >
          <circleGeometry args={[0.5, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            transparent
            opacity={0.5}
            emissive="#fbbf24"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </>
  );
}

// VR Scene wrapper
export function VRPokerScene({ children }: { children: React.ReactNode }) {
  return (
    <>
      <XR>
        <Controllers />
        <VRHandPoker />
        <VRPokerController />
        <VRUIPanel />
        <VRTeleport />
        {children}
      </XR>
    </>
  );
}

// VR Button component (outside Canvas)
export function VREnterButton() {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <button
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-2xl border-4 border-white transition-all transform hover:scale-105"
        onClick={() => {
          // VRButton trigger (handled by @react-three/xr)
          const vrButton = document.getElementById('VRButton');
          if (vrButton) vrButton.click();
        }}
      >
        🥽 ENTER VR MODE
      </button>
    </div>
  );
}

// VR Stats display (floating)
export function VRStatsDisplay({ chips, pot }: { chips: number; pot: number }) {
  return (
    <group position={[0, 2.5, -1.5]}>
      <mesh>
        <planeGeometry args={[1, 0.3]} />
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Stats text would render here */}
    </group>
  );
}

// Grab interaction for VR
export function VRGrabbableChip({ position }: { position: [number, number, number] }) {
  const chipRef = useRef<THREE.Mesh>(null);
  const [grabbed, setGrabbed] = React.useState(false);

  return (
    <mesh
      ref={chipRef}
      position={position}
      onPointerDown={() => setGrabbed(true)}
      onPointerUp={() => setGrabbed(false)}
    >
      <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
      <meshStandardMaterial
        color={grabbed ? '#fbbf24' : '#3b82f6'}
        emissive={grabbed ? '#fbbf24' : '#000000'}
        emissiveIntensity={grabbed ? 0.5 : 0}
      />
    </mesh>
  );
}
