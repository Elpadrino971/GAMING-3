'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export type CameraView = 'orbit' | 'tv' | 'firstPerson' | 'topDown' | 'cinematic' | 'dealer';

interface CameraControllerProps {
  view: CameraView;
  playerPosition?: number; // 0-8 for first person view
  smooth?: boolean;
  onViewChange?: (view: CameraView) => void;
}

export default function CameraController({
  view,
  playerPosition = 0,
  smooth = true,
}: CameraControllerProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Camera presets
  const getCameraPreset = (viewType: CameraView): { position: THREE.Vector3; lookAt: THREE.Vector3 } => {
    const angle = (playerPosition * (360 / 9)) * (Math.PI / 180);
    const playerRadius = 2.8;
    const playerX = Math.cos(angle) * playerRadius;
    const playerZ = Math.sin(angle) * playerRadius;

    switch (viewType) {
      case 'orbit':
        return {
          position: new THREE.Vector3(0, 8, 10),
          lookAt: new THREE.Vector3(0, 0, 0),
        };

      case 'tv':
        // Professional TV poker view - angled from above
        return {
          position: new THREE.Vector3(5, 6, 8),
          lookAt: new THREE.Vector3(0, -0.3, 0),
        };

      case 'firstPerson':
        // View from player's perspective
        return {
          position: new THREE.Vector3(
            playerX * 1.1,
            0.5,
            playerZ * 1.1
          ),
          lookAt: new THREE.Vector3(0, -0.3, 0),
        };

      case 'topDown':
        // Bird's eye view
        return {
          position: new THREE.Vector3(0, 15, 0.1),
          lookAt: new THREE.Vector3(0, 0, 0),
        };

      case 'cinematic':
        // Dramatic low angle
        return {
          position: new THREE.Vector3(8, 2, 12),
          lookAt: new THREE.Vector3(0, 0, 0),
        };

      case 'dealer':
        // From dealer position
        return {
          position: new THREE.Vector3(0, 1, -4),
          lookAt: new THREE.Vector3(0, -0.3, 0),
        };

      default:
        return {
          position: new THREE.Vector3(0, 8, 10),
          lookAt: new THREE.Vector3(0, 0, 0),
        };
    }
  };

  useEffect(() => {
    const preset = getCameraPreset(view);
    targetPosition.current.copy(preset.position);
    targetLookAt.current.copy(preset.lookAt);
  }, [view, playerPosition]);

  useFrame(() => {
    if (smooth) {
      // Smooth interpolation
      camera.position.lerp(targetPosition.current, 0.05);
      currentLookAt.current.lerp(targetLookAt.current, 0.05);
      camera.lookAt(currentLookAt.current);
    } else {
      // Instant
      camera.position.copy(targetPosition.current);
      camera.lookAt(targetLookAt.current);
    }
  });

  return null;
}

// Cinematic camera animations
export function CinematicCameraAnimation({
  enabled,
  type = 'sweep',
}: {
  enabled: boolean;
  type?: 'sweep' | 'dolly' | 'orbit' | 'shake';
}) {
  const { camera } = useThree();
  const originalPosition = useRef(new THREE.Vector3());

  useEffect(() => {
    if (enabled) {
      originalPosition.current.copy(camera.position);
    }
  }, [enabled, camera]);

  useFrame((state) => {
    if (!enabled) return;

    const time = state.clock.elapsedTime;

    switch (type) {
      case 'sweep':
        // Smooth sweep around table
        const radius = 10;
        camera.position.x = Math.cos(time * 0.3) * radius;
        camera.position.z = Math.sin(time * 0.3) * radius;
        camera.position.y = 8;
        camera.lookAt(0, 0, 0);
        break;

      case 'dolly':
        // Zoom in and out
        const distance = 10 + Math.sin(time * 0.5) * 3;
        camera.position.z = distance;
        camera.position.y = 8;
        camera.lookAt(0, 0, 0);
        break;

      case 'orbit':
        // Circular orbit
        const orbitRadius = 12;
        camera.position.x = Math.cos(time * 0.5) * orbitRadius;
        camera.position.z = Math.sin(time * 0.5) * orbitRadius;
        camera.position.y = 6 + Math.sin(time * 0.3) * 2;
        camera.lookAt(0, 0, 0);
        break;

      case 'shake':
        // Camera shake (for dramatic moments)
        const intensity = 0.1;
        camera.position.x = originalPosition.current.x + (Math.random() - 0.5) * intensity;
        camera.position.y = originalPosition.current.y + (Math.random() - 0.5) * intensity;
        camera.position.z = originalPosition.current.z + (Math.random() - 0.5) * intensity;
        camera.lookAt(0, 0, 0);
        break;
    }
  });

  return null;
}

// Slow-motion effect controller
export function SlowMotionController({
  enabled,
  factor = 0.3,
}: {
  enabled: boolean;
  factor?: number;
}) {
  const { clock } = useThree();

  useFrame(() => {
    if (enabled) {
      // Slow down time (this affects all animations using clock)
      (clock as any).elapsedTime += (1 / 60) * factor;
    }
  });

  return null;
}
