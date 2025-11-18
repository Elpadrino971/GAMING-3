'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import ParticleEffects3D from './ParticleEffects3D';

export default function BoucherieTable3D() {
  const tableRef = useRef<THREE.Group>(null);
  const bloodDripRef = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    if (tableRef.current) {
      // Subtle pulsing red glow
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
      tableRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          if (child.userData.isPulse) {
            child.material.emissiveIntensity = pulse * 0.5;
          }
        }
      });
    }
  });

  return (
    <group ref={tableRef} position={[0, -0.5, 0]}>
      {/* Blood-red felt table */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} userData={{ isPulse: true }}>
        <cylinderGeometry args={[3.5, 3.5, 0.1, 64]} />
        <meshStandardMaterial
          color="#8b0000"
          roughness={0.8}
          metalness={0.1}
          emissive="#ff0000"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Darker blood inner ring */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.051, 0]}>
        <cylinderGeometry args={[3.3, 3.3, 0.001, 64]} />
        <meshStandardMaterial
          color="#4a0000"
          roughness={0.9}
          emissive="#8b0000"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Black rail with blood drips */}
      <mesh castShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <cylinderGeometry args={[3.7, 3.5, 0.2, 64]} />
        <meshStandardMaterial
          color="#1a0000"
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Blood splatter marks */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const radius = 2.5;
        return (
          <mesh
            key={i}
            position={[Math.cos(rad) * radius, 0.061, Math.sin(rad) * radius]}
            rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}
          >
            <circleGeometry args={[0.15 + Math.random() * 0.1, 16]} />
            <meshStandardMaterial
              color="#6b0000"
              roughness={0.85}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}

      {/* Knife marks (scratches) */}
      {[30, 150, 210, 330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const radius = 2.0;
        return (
          <mesh
            key={`scratch-${i}`}
            position={[Math.cos(rad) * radius, 0.062, Math.sin(rad) * radius]}
            rotation={[-Math.PI / 2, 0, angle * (Math.PI / 180)]}
          >
            <planeGeometry args={[0.5, 0.05]} />
            <meshStandardMaterial
              color="#3a0000"
              roughness={0.9}
            />
          </mesh>
        );
      })}

      {/* LA BOUCHERIE logo with dripping effect */}
      <Text
        position={[0, 0.063, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.35}
        color="#ff0000"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Arial-Bold.ttf"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        LA BOUCHERIE
      </Text>

      {/* Knife and cleaver icons */}
      <Text
        position={[-0.8, 0.063, -0.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 4]}
        fontSize={0.3}
        color="#c0c0c0"
        anchorX="center"
        anchorY="middle"
      >
        🔪
      </Text>

      <Text
        position={[0.8, 0.063, -0.5]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 4]}
        fontSize={0.3}
        color="#c0c0c0"
        anchorX="center"
        anchorY="middle"
      >
        🔪
      </Text>

      {/* Blood drops subtitle */}
      <Text
        position={[0, 0.063, 0.4]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.12}
        color="#ff6b6b"
        anchorX="center"
        anchorY="middle"
      >
        🩸 Wild Omaha - Use 0 to 4 Cards 🩸
      </Text>

      {/* Dealer position with blood marker */}
      <mesh position={[0, 0.063, -1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial
          color="#8b0000"
          roughness={0.4}
          emissive="#ff0000"
          emissiveIntensity={0.5}
        />
      </mesh>

      <Text
        position={[0, 0.064, -1.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Arial-Bold.ttf"
      >
        D
      </Text>

      {/* Warning signs around edge */}
      {[0, 120, 240].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const radius = 3.1;
        return (
          <Text
            key={`warning-${i}`}
            position={[Math.cos(rad) * radius, 0.063, Math.sin(rad) * radius]}
            rotation={[-Math.PI / 2, 0, -rad]}
            fontSize={0.08}
            color="#ffff00"
            anchorX="center"
            anchorY="middle"
          >
            ⚠️ VARIANCE EXTRÊME ⚠️
          </Text>
        );
      })}

      {/* Blood particle effects in several spots */}
      <ParticleEffects3D
        type="blood"
        position={[1.5, 0.5, 0]}
        active={true}
        intensity={0.3}
      />
      <ParticleEffects3D
        type="blood"
        position={[-1.5, 0.5, 0]}
        active={true}
        intensity={0.3}
      />
      <ParticleEffects3D
        type="blood"
        position={[0, 0.5, 1.5]}
        active={true}
        intensity={0.2}
      />

      {/* Red fog/smoke effect */}
      <ParticleEffects3D
        type="smoke"
        position={[0, 0, 0]}
        active={true}
        intensity={0.5}
      />
    </group>
  );
}
