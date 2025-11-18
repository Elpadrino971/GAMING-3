'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleEffects3DProps {
  type: 'confetti' | 'blood' | 'sparks' | 'chips' | 'smoke';
  position: [number, number, number];
  active: boolean;
  intensity?: number;
}

export default function ParticleEffects3D({
  type,
  position,
  active,
  intensity = 1,
}: ParticleEffects3DProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array>();

  const particleCount = type === 'confetti' ? 500 : type === 'blood' ? 300 : 200;

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Initial positions (burst from center)
      positions[i * 3] = position[0] + (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 1] = position[1] + (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 2] = position[2] + (Math.random() - 0.5) * 0.2;

      // Velocities for explosion effect
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.05 * intensity;
      velocities[i * 3] = Math.cos(angle) * speed;
      velocities[i * 3 + 1] = Math.random() * 0.1 * intensity; // Upward
      velocities[i * 3 + 2] = Math.sin(angle) * speed;

      // Colors based on type
      if (type === 'confetti') {
        // Rainbow colors
        const hue = Math.random();
        const color = new THREE.Color().setHSL(hue, 1, 0.6);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      } else if (type === 'blood') {
        // Red/dark red
        colors[i * 3] = 0.5 + Math.random() * 0.5; // Red
        colors[i * 3 + 1] = 0; // Green
        colors[i * 3 + 2] = 0; // Blue
      } else if (type === 'sparks') {
        // Yellow/gold
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0;
      } else if (type === 'chips') {
        // Various chip colors
        const chipColors = [
          [1, 1, 1],     // White
          [1, 0, 0],     // Red
          [0, 0, 1],     // Blue
          [0, 1, 0],     // Green
          [1, 1, 0],     // Yellow
        ];
        const color = chipColors[Math.floor(Math.random() * chipColors.length)];
        colors[i * 3] = color[0];
        colors[i * 3 + 1] = color[1];
        colors[i * 3 + 2] = color[2];
      } else if (type === 'smoke') {
        // Gray
        const gray = 0.5 + Math.random() * 0.3;
        colors[i * 3] = gray;
        colors[i * 3 + 1] = gray;
        colors[i * 3 + 2] = gray;
      }

      // Sizes
      sizes[i] = Math.random() * 0.1 + 0.05;
    }

    velocitiesRef.current = velocities;

    return { positions, colors, sizes };
  }, [type, particleCount, intensity, position]);

  useFrame((state, delta) => {
    if (!active || !particlesRef.current || !velocitiesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = velocitiesRef.current;

    for (let i = 0; i < particleCount; i++) {
      // Update positions based on velocities
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      // Apply gravity
      velocities[i * 3 + 1] -= 0.002;

      // Reset particles that fall too low
      if (positions[i * 3 + 1] < -2) {
        positions[i * 3] = position[0];
        positions[i * 3 + 1] = position[1];
        positions[i * 3 + 2] = position[2];

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.05 * intensity;
        velocities[i * 3] = Math.cos(angle) * speed;
        velocities[i * 3 + 1] = Math.random() * 0.1 * intensity;
        velocities[i * 3 + 2] = Math.sin(angle) * speed;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
