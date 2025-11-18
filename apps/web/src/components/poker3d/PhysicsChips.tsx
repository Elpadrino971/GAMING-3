'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, Physics, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

interface PhysicsChip {
  id: string;
  value: number;
  position: [number, number, number];
  velocity: [number, number, number];
}

// Single physics-enabled chip
export function PhysicsChip3D({
  value,
  position,
  onRest,
}: {
  value: number;
  position: [number, number, number];
  onRest?: () => void;
}) {
  const rigidBodyRef = useRef<any>(null);
  const [color, setColor] = useState('#fbbf24');

  const chipColors: Record<number, string> = {
    1: '#ffffff',
    5: '#ef4444',
    10: '#3b82f6',
    25: '#22c55e',
    100: '#1f2937',
    500: '#a855f7',
    1000: '#eab308',
    5000: '#ec4899',
  };

  React.useEffect(() => {
    const closest = Object.keys(chipColors)
      .map(Number)
      .reduce((prev, curr) =>
        Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
      );
    setColor(chipColors[closest]);
  }, [value]);

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      colliders="cylinder"
      restitution={0.3}
      friction={0.5}
      onSleep={onRest}
    >
      {/* Main chip */}
      <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Edge stripe */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.152, 0.152, 0.015, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>

      {/* Value indicator dots */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => {
        const rad = (angle * Math.PI) / 180;
        const radius = 0.11;
        return (
          <mesh
            key={idx}
            position={[
              Math.cos(rad) * radius,
              0.026,
              Math.sin(rad) * radius,
            ]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.012, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        );
      })}
    </RigidBody>
  );
}

// Chip stack that can be knocked over
export function PhysicsChipStack({
  value,
  count,
  position,
}: {
  value: number;
  count: number;
  position: [number, number, number];
}) {
  return (
    <>
      {Array.from({ length: Math.min(count, 20) }).map((_, i) => (
        <PhysicsChip3D
          key={i}
          value={value}
          position={[position[0], position[1] + i * 0.05, position[2]]}
        />
      ))}
    </>
  );
}

// Chip toss animation (throw chips to pot)
export function ChipToss({
  value,
  count,
  fromPosition,
  toPosition,
  onComplete,
}: {
  value: number;
  count: number;
  fromPosition: [number, number, number];
  toPosition: [number, number, number];
  onComplete?: () => void;
}) {
  const [chips, setChips] = useState<PhysicsChip[]>([]);
  const [launched, setLaunched] = useState(false);

  React.useEffect(() => {
    if (!launched) {
      const newChips: PhysicsChip[] = [];
      for (let i = 0; i < Math.min(count, 10); i++) {
        const angle = (i / count) * Math.PI * 2;
        const spread = 0.2;

        // Calculate trajectory to pot
        const dx = toPosition[0] - fromPosition[0];
        const dy = toPosition[1] - fromPosition[1];
        const dz = toPosition[2] - fromPosition[2];

        const distance = Math.sqrt(dx * dx + dz * dz);
        const velocityMagnitude = Math.sqrt(distance) * 2;

        newChips.push({
          id: `chip-${i}`,
          value,
          position: [
            fromPosition[0] + Math.cos(angle) * spread,
            fromPosition[1] + 0.5,
            fromPosition[2] + Math.sin(angle) * spread,
          ],
          velocity: [
            (dx / distance) * velocityMagnitude + (Math.random() - 0.5) * 0.5,
            3 + Math.random() * 2, // Upward velocity
            (dz / distance) * velocityMagnitude + (Math.random() - 0.5) * 0.5,
          ],
        });
      }
      setChips(newChips);
      setLaunched(true);

      setTimeout(() => {
        onComplete?.();
      }, 2000);
    }
  }, [launched]);

  return (
    <>
      {chips.map((chip) => (
        <RigidBody
          key={chip.id}
          position={chip.position}
          linearVelocity={chip.velocity}
          colliders="cylinder"
          restitution={0.4}
          friction={0.6}
        >
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.3} />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}

// Chip explosion (all-in moment!)
export function ChipExplosion({
  position,
  chipCount = 20,
  trigger,
}: {
  position: [number, number, number];
  chipCount?: number;
  trigger: boolean;
}) {
  const [exploded, setExploded] = useState(false);

  React.useEffect(() => {
    if (trigger && !exploded) {
      setExploded(true);
    }
  }, [trigger]);

  if (!exploded) return null;

  return (
    <>
      {Array.from({ length: chipCount }).map((_, i) => {
        const angle = (i / chipCount) * Math.PI * 2;
        const velocity = 5 + Math.random() * 3;

        return (
          <RigidBody
            key={i}
            position={position}
            linearVelocity={[
              Math.cos(angle) * velocity,
              5 + Math.random() * 5,
              Math.sin(angle) * velocity,
            ]}
            angularVelocity={[
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
            ]}
            colliders="cylinder"
            restitution={0.6}
          >
            <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
              <meshStandardMaterial
                color={['#fbbf24', '#ef4444', '#3b82f6', '#22c55e'][Math.floor(Math.random() * 4)]}
                roughness={0.3}
                metalness={0.2}
              />
            </mesh>
          </RigidBody>
        );
      })}
    </>
  );
}

// Physics table surface (collider)
export function PhysicsTableSurface() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh position={[0, -0.45, 0]} receiveShadow visible={false}>
        <cylinderGeometry args={[3.5, 3.5, 0.1, 32]} />
      </mesh>
    </RigidBody>
  );
}

// Complete physics scene wrapper
export function PhysicsPokerScene({ children }: { children: React.ReactNode }) {
  return (
    <Physics gravity={[0, -9.81, 0]}>
      <PhysicsTableSurface />
      {children}
    </Physics>
  );
}
