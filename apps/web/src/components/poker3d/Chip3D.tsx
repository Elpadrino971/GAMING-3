'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface Chip3DProps {
  value: number;
  position: [number, number, number];
  stack?: number; // Number of chips stacked
  animate?: boolean;
}

const CHIP_COLORS: Record<number, string> = {
  1: '#ffffff',      // White - $1
  5: '#ef4444',      // Red - $5
  10: '#3b82f6',     // Blue - $10
  25: '#22c55e',     // Green - $25
  100: '#1f2937',    // Black - $100
  500: '#a855f7',    // Purple - $500
  1000: '#eab308',   // Yellow/Gold - $1000
  5000: '#ec4899',   // Pink - $5000
};

const getChipColor = (value: number): string => {
  const validValues = [1, 5, 10, 25, 100, 500, 1000, 5000];
  const closest = validValues.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
  return CHIP_COLORS[closest];
};

export default function Chip3D({
  value,
  position,
  stack = 1,
  animate = false,
}: Chip3DProps) {
  const chipRef = useRef<THREE.Group>(null);
  const chipColor = getChipColor(value);
  const chipHeight = 0.05;

  useFrame((state) => {
    if (animate && chipRef.current) {
      chipRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
  });

  return (
    <group ref={chipRef} position={position}>
      {Array.from({ length: stack }).map((_, i) => (
        <group key={i} position={[0, i * chipHeight, 0]}>
          {/* Main chip body */}
          <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, chipHeight, 32]} />
            <meshStandardMaterial
              color={chipColor}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>

          {/* Edge stripe (white) */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <cylinderGeometry args={[0.151, 0.151, chipHeight * 0.3, 32]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>

          {/* Top face value text */}
          {i === stack - 1 && (
            <>
              <Text
                position={[0, chipHeight / 2 + 0.001, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.08}
                color={value >= 100 ? '#fbbf24' : '#1f2937'}
                anchorX="center"
                anchorY="middle"
                font="/fonts/Arial-Bold.ttf"
              >
                ${value >= 1000 ? `${value / 1000}K` : value}
              </Text>

              {/* Chip design - small dots around edge */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => {
                const rad = (angle * Math.PI) / 180;
                const radius = 0.11;
                return (
                  <mesh
                    key={idx}
                    position={[
                      Math.cos(rad) * radius,
                      chipHeight / 2 + 0.001,
                      Math.sin(rad) * radius,
                    ]}
                  >
                    <circleGeometry args={[0.015, 16]} />
                    <meshStandardMaterial
                      color="#ffffff"
                      roughness={0.5}
                    />
                  </mesh>
                );
              })}
            </>
          )}
        </group>
      ))}
    </group>
  );
}
