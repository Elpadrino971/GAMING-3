'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CardProps {
  rank: string;
  suit: string;
  faceDown?: boolean;
  delay?: number;
  index?: number;
}

const SUIT_SYMBOLS: Record<string, string> = {
  h: '♥',
  d: '♦',
  c: '♣',
  s: '♠',
};

const SUIT_COLORS: Record<string, string> = {
  h: '#ef4444',
  d: '#ef4444',
  c: '#1f2937',
  s: '#1f2937',
};

export default function Card({ rank, suit, faceDown = false, delay = 0, index = 0 }: CardProps) {
  const [isFlipping, setIsFlipping] = useState(faceDown);
  const suitSymbol = SUIT_SYMBOLS[suit];
  const suitColor = SUIT_COLORS[suit];

  useEffect(() => {
    if (!faceDown && isFlipping) {
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 300 + delay);
      return () => clearTimeout(timer);
    }
  }, [faceDown, delay, isFlipping]);

  return (
    <motion.div
      initial={{
        scale: 0,
        y: -100,
        rotateY: 180,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        y: 0,
        rotateY: isFlipping ? 180 : 0,
        opacity: 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: delay + index * 0.1,
      }}
      whileHover={{
        scale: 1.05,
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="relative"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <motion.div
        className={`w-16 h-24 rounded-lg shadow-2xl flex items-center justify-center relative overflow-hidden ${
          isFlipping ? 'bg-gradient-to-br from-blue-600 to-blue-800' : 'bg-white'
        }`}
        style={{
          backfaceVisibility: 'hidden',
          border: isFlipping ? '3px solid #fbbf24' : '2px solid #e5e7eb',
        }}
      >
        {isFlipping ? (
          // Card back
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="text-4xl opacity-50"
          >
            🎰
          </motion.div>
        ) : (
          // Card front
          <div className="w-full h-full p-2 flex flex-col justify-between">
            {/* Top left */}
            <div className="flex flex-col items-start">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold leading-none"
                style={{ color: suitColor }}
              >
                {rank}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl leading-none"
                style={{ color: suitColor }}
              >
                {suitSymbol}
              </motion.span>
            </div>

            {/* Center symbol */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.5,
                type: 'spring',
                stiffness: 200,
              }}
              className="flex items-center justify-center text-3xl"
              style={{ color: suitColor }}
            >
              {suitSymbol}
            </motion.div>

            {/* Bottom right (upside down) */}
            <div className="flex flex-col items-end rotate-180">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold leading-none"
                style={{ color: suitColor }}
              >
                {rank}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl leading-none"
                style={{ color: suitColor }}
              >
                {suitSymbol}
              </motion.span>
            </div>
          </div>
        )}

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/40 to-white/0"
          initial={{ x: '-100%', y: '-100%' }}
          animate={{ x: '100%', y: '100%' }}
          transition={{
            duration: 1.5,
            delay: delay,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </motion.div>
  );
}
