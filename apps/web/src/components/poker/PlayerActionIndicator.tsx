'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PlayerActionIndicatorProps {
  action: 'fold' | 'check' | 'call' | 'raise' | 'bet';
  amount?: number;
}

const ACTION_CONFIGS = {
  fold: {
    emoji: '🚫',
    color: '#dc2626',
    bgColor: 'rgba(220, 38, 38, 0.2)',
    label: 'FOLD',
  },
  check: {
    emoji: '✅',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.2)',
    label: 'CHECK',
  },
  call: {
    emoji: '📞',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.2)',
    label: 'CALL',
  },
  raise: {
    emoji: '⬆️',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.2)',
    label: 'RAISE',
  },
  bet: {
    emoji: '💰',
    color: '#fbbf24',
    bgColor: 'rgba(251, 191, 36, 0.2)',
    label: 'BET',
  },
};

export default function PlayerActionIndicator({ action, amount }: PlayerActionIndicatorProps) {
  const config = ACTION_CONFIGS[action];

  return (
    <motion.div
      className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-20"
      initial={{ scale: 0, y: 20, opacity: 0 }}
      animate={{
        scale: [0, 1.2, 1],
        y: [20, -10, 0],
        opacity: [0, 1, 1],
      }}
      exit={{
        scale: 0,
        y: -20,
        opacity: 0,
      }}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
      }}
    >
      <motion.div
        className="relative px-6 py-3 rounded-full shadow-2xl backdrop-blur-sm"
        style={{
          backgroundColor: config.bgColor,
          border: `3px solid ${config.color}`,
        }}
        animate={{
          boxShadow: [
            `0 0 20px ${config.color}40`,
            `0 0 40px ${config.color}80`,
            `0 0 20px ${config.color}40`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="flex items-center space-x-3">
          {/* Emoji */}
          <motion.span
            className="text-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            {config.emoji}
          </motion.span>

          {/* Text */}
          <div>
            <motion.p
              className="font-bold text-lg leading-none"
              style={{ color: config.color }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              {config.label}
            </motion.p>
            {amount && (
              <motion.p
                className="text-sm font-semibold mt-1"
                style={{ color: config.color }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {amount.toLocaleString()}
              </motion.p>
            )}
          </div>
        </div>

        {/* Pulse rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{
              border: `2px solid ${config.color}`,
            }}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{
              scale: [1, 1.5, 2],
              opacity: [0.6, 0.3, 0],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </motion.div>

      {/* Arrow pointing down */}
      <motion.div
        className="absolute -bottom-3 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 5, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div
          className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
          style={{
            borderTopColor: config.color,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
