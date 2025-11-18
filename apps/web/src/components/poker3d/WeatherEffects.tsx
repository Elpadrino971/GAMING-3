'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Rain effect
export function Rain({ intensity = 1 }: { intensity?: number }) {
  const rainRef = useRef<THREE.Points>(null);
  const particleCount = 1000 * intensity;

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      velocities[i] = 0.1 + Math.random() * 0.2;
    }

    return { positions, velocities };
  }, [particleCount]);

  useFrame(() => {
    if (!rainRef.current) return;

    const positions = rainRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] -= velocities[i];

      if (positions[i * 3 + 1] < -1) {
        positions[i * 3 + 1] = 20;
      }
    }

    rainRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#88ccff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Snow effect
export function Snow({ intensity = 1 }: { intensity?: number }) {
  const snowRef = useRef<THREE.Points>(null);
  const particleCount = 500 * intensity;

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = -0.02 - Math.random() * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return { positions, velocities };
  }, [particleCount]);

  useFrame(() => {
    if (!snowRef.current) return;

    const positions = snowRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      if (positions[i * 3 + 1] < -1) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      }
    }

    snowRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={snowRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Leaves falling (autumn)
export function FallingLeaves({ intensity = 1 }: { intensity?: number }) {
  const leavesRef = useRef<THREE.Points>(null);
  const particleCount = 100 * intensity;

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      velocities[i * 3] = (Math.random() - 0.5) * 0.05;
      velocities[i * 3 + 1] = -0.01 - Math.random() * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05;

      // Orange/brown/yellow colors
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 1; // Orange
        colors[i * 3 + 1] = 0.5;
        colors[i * 3 + 2] = 0;
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0.6; // Brown
        colors[i * 3 + 1] = 0.3;
        colors[i * 3 + 2] = 0;
      } else {
        colors[i * 3] = 1; // Yellow
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 0;
      }
    }

    return { positions, velocities, colors };
  }, [particleCount]);

  useFrame(() => {
    if (!leavesRef.current) return;

    const positions = leavesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += velocities[i * 3] + Math.sin(Date.now() * 0.001 + i) * 0.01;
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      if (positions[i * 3 + 1] < -1) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      }
    }

    leavesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={leavesRef}>
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
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// Fireflies (summer night)
export function Fireflies({ count = 50 }: { count?: number }) {
  const firefliesRef = useRef<THREE.Points>(null);

  const { positions, intensities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const intensities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = Math.random() * 3 + 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      intensities[i] = Math.random();
    }

    return { positions, intensities };
  }, [count]);

  useFrame((state) => {
    if (!firefliesRef.current) return;

    const positions = firefliesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.01;
      positions[i * 3 + 1] += Math.cos(state.clock.elapsedTime * 2 + i) * 0.005;
      positions[i * 3 + 2] += Math.sin(state.clock.elapsedTime * 1.5 + i) * 0.01;

      // Pulsing intensity
      intensities[i] = Math.sin(state.clock.elapsedTime * 3 + i * 10) * 0.5 + 0.5;
    }

    firefliesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={firefliesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffff00"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Day/Night cycle lighting
export function DayNightCycle({ time = 12 }: { time?: number }) {
  // time is 0-24 (hours)
  const isDay = time >= 6 && time < 18;
  const sunAngle = ((time - 6) / 12) * Math.PI;

  const skyColor = isDay ? '#87CEEB' : '#0a0a1a';
  const sunColor = isDay ? '#FDB813' : '#ffffff';
  const intensity = isDay ? 1 : 0.3;

  return (
    <>
      {/* Sun/Moon */}
      <directionalLight
        position={[
          Math.cos(sunAngle) * 10,
          Math.sin(sunAngle) * 10,
          0,
        ]}
        intensity={intensity}
        color={sunColor}
        castShadow
      />

      {/* Ambient light varies by time */}
      <ambientLight intensity={isDay ? 0.5 : 0.2} color={isDay ? '#ffffff' : '#4444ff'} />

      {/* Stars at night */}
      {!isDay && <Stars />}
    </>
  );
}

// Stars for night sky
function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  const count = 1000;

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.abs(radius * Math.sin(phi) * Math.sin(theta));
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation={false}
      />
    </points>
  );
}

// Weather controller component
export function WeatherController({
  season,
  time,
}: {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  time: number;
}) {
  return (
    <>
      <DayNightCycle time={time} />

      {season === 'spring' && <Rain intensity={0.3} />}
      {season === 'summer' && time >= 18 && <Fireflies count={30} />}
      {season === 'autumn' && <FallingLeaves intensity={0.5} />}
      {season === 'winter' && <Snow intensity={0.7} />}
    </>
  );
}
