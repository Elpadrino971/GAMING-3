'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SearchingAnimationProps {
  stakes: string;
  buyIn: number;
  onCancel: () => void;
}

export default function SearchingAnimation({ stakes, buyIn, onCancel }: SearchingAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      {/* Animated cards searching */}
      <div className="relative h-32 mb-8 flex items-center justify-center">
        {/* Central search icon */}
        <motion.div
          className="absolute text-6xl z-10"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          🔍
        </motion.div>

        {/* Orbiting cards */}
        {['♠', '♥', '♦', '♣'].map((suit, index) => {
          const angle = (index / 4) * 360;
          return (
            <motion.div
              key={suit}
              className="absolute w-12 h-16 bg-white rounded-lg shadow-xl flex items-center justify-center border-2 border-gray-300"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                transformOrigin: `50% 50%`,
              }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  left: `${80 * Math.cos((angle * Math.PI) / 180)}px`,
                  top: `${80 * Math.sin((angle * Math.PI) / 180)}px`,
                }}
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <span
                  className={`text-3xl ${
                    suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-gray-900'
                  }`}
                >
                  {suit}
                </span>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Pulse rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-4 border-yellow-400"
            style={{
              width: '150px',
              height: '150px',
            }}
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={{
              scale: [0.5, 2, 2],
              opacity: [0.8, 0.3, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.6,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Text */}
      <motion.h3
        className="text-2xl font-bold text-white mb-2"
        animate={{
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      >
        Searching for players...
      </motion.h3>

      {/* Match details */}
      <div className="bg-gray-700/50 rounded-lg px-6 py-3 inline-block mb-6">
        <p className="text-gray-300">
          <span className="font-bold text-yellow-400">{stakes}</span> Stakes
          <span className="mx-2">•</span>
          Buy-in: <span className="font-bold text-green-400">{buyIn}</span> chips
        </p>
      </div>

      {/* Waiting dots */}
      <div className="flex justify-center space-x-2 mb-8">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-yellow-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              delay: i * 0.3,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Cancel button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCancel}
        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition shadow-lg"
      >
        Cancel Search
      </motion.button>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="mt-8 text-gray-400 text-sm"
      >
        <p>💡 Tip: Matchmaking usually takes 10-30 seconds</p>
      </motion.div>
    </motion.div>
  );
}
