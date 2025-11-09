'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ChipStackProps {
  amount: number;
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'black';
  animate?: boolean;
}

const CHIP_COLORS = {
  red: ['#dc2626', '#991b1b'],
  blue: ['#2563eb', '#1e40af'],
  green: ['#16a34a', '#15803d'],
  yellow: ['#eab308', '#ca8a04'],
  black: ['#1f2937', '#111827'],
};

export default function ChipStack({ amount, color = 'yellow', animate = true }: ChipStackProps) {
  const chipCount = Math.min(Math.ceil(amount / 100), 10);
  const colors = CHIP_COLORS[color];

  return (
    <motion.div
      className="relative flex flex-col-reverse items-center"
      initial={animate ? { scale: 0, y: 50 } : {}}
      animate={{ scale: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
    >
      {/* Chip stack */}
      <div className="relative" style={{ height: `${chipCount * 4 + 20}px` }}>
        {[...Array(chipCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-4 border-white/30 shadow-lg"
            style={{
              width: '40px',
              height: '40px',
              bottom: `${i * 4}px`,
              left: '0',
              background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
              zIndex: chipCount - i,
            }}
            initial={animate ? {
              scale: 0,
              y: -100,
              rotate: Math.random() * 360,
            } : {}}
            animate={{
              scale: 1,
              y: 0,
              rotate: 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 12,
              delay: i * 0.05,
            }}
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.2 }
            }}
          >
            {/* Chip pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-white/50" />
            </div>

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Amount label */}
      <motion.div
        className="mb-2 bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full"
        initial={animate ? { opacity: 0, y: -20 } : {}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.span
          className="text-yellow-400 font-bold text-sm"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          💰 {amount.toLocaleString()}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
