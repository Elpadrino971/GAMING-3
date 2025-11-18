'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface PlayerAvatar3DProps {
  position: [number, number, number];
  name: string;
  emotion?: 'neutral' | 'happy' | 'sad' | 'angry' | 'thinking' | 'shocked';
  action?: 'idle' | 'celebrate' | 'frustrated' | 'thinking';
  chips: number;
  isActive?: boolean;
}

export default function PlayerAvatar3D({
  position,
  name,
  emotion = 'neutral',
  action = 'idle',
  chips,
  isActive = false,
}: PlayerAvatar3DProps) {
  const avatarRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);

  // Emotion faces
  const emotionFaces: Record<string, string> = {
    neutral: '😐',
    happy: '😊',
    sad: '😢',
    angry: '😠',
    thinking: '🤔',
    shocked: '😱',
  };

  useFrame((state) => {
    if (!avatarRef.current || !headRef.current) return;

    // Idle breathing animation
    if (action === 'idle') {
      avatarRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }

    // Celebrate - bounce up and down
    if (action === 'celebrate') {
      avatarRef.current.position.y =
        position[1] + Math.abs(Math.sin(state.clock.elapsedTime * 5)) * 0.3;
      avatarRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.3;
    }

    // Frustrated - shake head
    if (action === 'frustrated') {
      headRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.2;
    }

    // Thinking - slow nod
    if (action === 'thinking') {
      headRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
    }

    // Active player glow pulse
    if (isActive && avatarRef.current.children[0] instanceof THREE.Mesh) {
      const mat = avatarRef.current.children[0].material as THREE.MeshStandardMaterial;
      if (mat.emissive) {
        const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 0.5;
        mat.emissiveIntensity = pulse * 0.5;
      }
    }
  });

  return (
    <group ref={avatarRef} position={position}>
      {/* Body (simple cylinder) */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.6, 16]} />
        <meshStandardMaterial
          color={isActive ? '#fbbf24' : '#3b82f6'}
          roughness={0.5}
          metalness={0.2}
          emissive={isActive ? '#fbbf24' : '#000000'}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color="#ffdbac"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Face (emoji) */}
      <Text
        position={[0, 0.5, 0.26]}
        fontSize={0.2}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {emotionFaces[emotion]}
      </Text>

      {/* Name plate above head */}
      <group position={[0, 0.9, 0]}>
        <mesh>
          <planeGeometry args={[0.8, 0.2]} />
          <meshStandardMaterial
            color="#1f2937"
            transparent
            opacity={0.8}
          />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.7}
          font="/fonts/Arial-Bold.ttf"
        >
          {name}
        </Text>
      </group>

      {/* Chip count */}
      <Text
        position={[0, 1.15, 0]}
        fontSize={0.12}
        color="#22c55e"
        anchorX="center"
        anchorY="middle"
      >
        ${chips.toLocaleString()}
      </Text>

      {/* Arms (simple) */}
      <mesh position={[-0.3, 0.15, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      <mesh position={[0.3, 0.15, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      {/* Active indicator ring */}
      {isActive && (
        <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.4, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}

      {/* Shadow circle */}
      <mesh position={[0, -0.29, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

// Action bubble (speech bubble for actions)
export function ActionBubble({
  position,
  text,
  type = 'action',
}: {
  position: [number, number, number];
  text: string;
  type?: 'action' | 'thought' | 'win';
}) {
  const bubbleRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!bubbleRef.current) return;
    // Gentle float
    bubbleRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
  });

  const bubbleColor = type === 'win' ? '#22c55e' : type === 'thought' ? '#3b82f6' : '#fbbf24';

  return (
    <group ref={bubbleRef} position={position}>
      {/* Bubble background */}
      <mesh>
        <planeGeometry args={[1, 0.4]} />
        <meshStandardMaterial
          color={bubbleColor}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Text */}
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.15}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.9}
        font="/fonts/Arial-Bold.ttf"
      >
        {text}
      </Text>

      {/* Pointer triangle */}
      <mesh position={[0, -0.25, 0]}>
        <coneGeometry args={[0.1, 0.15, 3]} />
        <meshStandardMaterial
          color={bubbleColor}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}
