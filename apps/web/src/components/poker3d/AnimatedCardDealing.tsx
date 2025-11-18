'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Card3D from './Card3D';

interface AnimatedCard {
  id: string;
  rank: string;
  suit: string;
  startPos: [number, number, number];
  endPos: [number, number, number];
  progress: number;
  delay: number;
  faceDown: boolean;
}

interface AnimatedCardDealingProps {
  cards: Array<{
    rank: string;
    suit: string;
    targetPosition: [number, number, number];
    targetRotation?: [number, number, number];
    faceDown?: boolean;
  }>;
  dealerPosition?: [number, number, number];
  onComplete?: () => void;
  speed?: number;
}

export default function AnimatedCardDealing({
  cards,
  dealerPosition = [0, 0.5, -2],
  onComplete,
  speed = 1,
}: AnimatedCardDealingProps) {
  const [animatedCards, setAnimatedCards] = useState<AnimatedCard[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Initialize animated cards
    const newCards: AnimatedCard[] = cards.map((card, i) => ({
      id: `card-${i}`,
      rank: card.rank,
      suit: card.suit,
      startPos: dealerPosition,
      endPos: card.targetPosition,
      progress: 0,
      delay: i * 0.1, // Stagger dealing
      faceDown: card.faceDown || false,
    }));
    setAnimatedCards(newCards);
  }, [cards, dealerPosition]);

  useFrame((state, delta) => {
    if (!isAnimating) return;

    let allComplete = true;

    setAnimatedCards((prevCards) =>
      prevCards.map((card) => {
        if (card.progress >= 1) return card;

        allComplete = false;

        // Calculate new progress with delay
        const delayedProgress = Math.max(0, state.clock.elapsedTime - card.delay);
        const newProgress = Math.min(1, delayedProgress * speed);

        return {
          ...card,
          progress: newProgress,
        };
      })
    );

    if (allComplete) {
      setIsAnimating(false);
      onComplete?.();
    }
  });

  return (
    <>
      {animatedCards.map((card) => {
        // Bezier curve for card flight path
        const t = card.progress;
        const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // Ease in-out

        // Arc height for dramatic effect
        const arcHeight = 2;
        const midPoint: [number, number, number] = [
          (card.startPos[0] + card.endPos[0]) / 2,
          (card.startPos[1] + card.endPos[1]) / 2 + arcHeight,
          (card.startPos[2] + card.endPos[2]) / 2,
        ];

        // Quadratic bezier interpolation
        const x =
          (1 - easeT) * (1 - easeT) * card.startPos[0] +
          2 * (1 - easeT) * easeT * midPoint[0] +
          easeT * easeT * card.endPos[0];
        const y =
          (1 - easeT) * (1 - easeT) * card.startPos[1] +
          2 * (1 - easeT) * easeT * midPoint[1] +
          easeT * easeT * card.endPos[1];
        const z =
          (1 - easeT) * (1 - easeT) * card.startPos[2] +
          2 * (1 - easeT) * easeT * midPoint[2] +
          easeT * easeT * card.endPos[2];

        // Rotation during flight
        const rotationY = easeT * Math.PI * 2; // Spin during flight
        const rotationX = -Math.PI / 4; // Tilt

        return (
          <Card3D
            key={card.id}
            rank={card.rank}
            suit={card.suit}
            position={[x, y, z]}
            rotation={[rotationX, rotationY, 0]}
            faceDown={card.faceDown}
            animate={false}
          />
        );
      })}
    </>
  );
}

// Flop/Turn/River reveal animation
export function CommunityCardReveal({
  cards,
  onComplete,
}: {
  cards: Array<{ rank: string; suit: string }>;
  onComplete?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [revealed, setRevealed] = useState(false);

  useFrame((state) => {
    if (!groupRef.current || revealed) return;

    // Dramatic flip animation
    const progress = Math.min(1, state.clock.elapsedTime * 2);
    groupRef.current.rotation.y = progress * Math.PI;

    if (progress >= 1) {
      setRevealed(true);
      onComplete?.();
    }
  });

  return (
    <group ref={groupRef}>
      {cards.map((card, i) => {
        const spacing = 0.7;
        const startX = -((cards.length - 1) * spacing) / 2;
        return (
          <Card3D
            key={i}
            rank={card.rank}
            suit={card.suit}
            position={[startX + i * spacing, -0.38, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            faceDown={!revealed}
            animate={revealed && i === cards.length - 1}
          />
        );
      })}
    </group>
  );
}
