'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function TableLoadingAnimation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center">
        {/* Animated poker cards */}
        <div className="flex space-x-4 mb-8 justify-center">
          {['♠', '♥', '♦', '♣'].map((suit, index) => (
            <motion.div
              key={suit}
              className="w-16 h-24 bg-white rounded-lg shadow-2xl flex items-center justify-center border-2 border-gray-300"
              initial={{ y: 0, rotate: 0 }}
              animate={{
                y: [-20, 20, -20],
                rotate: [-10, 10, -10],
              }}
              transition={{
                duration: 2,
                delay: index * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <motion.span
                className={`text-4xl ${
                  suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-gray-900'
                }`}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.2,
                  repeat: Infinity,
                }}
              >
                {suit}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* Animated chips */}
        <div className="flex space-x-2 mb-8 justify-center">
          {[...Array(5)].map((_, index) => (
            <motion.div
              key={index}
              className="w-12 h-12 rounded-full border-4 border-white/30 shadow-lg"
              style={{
                background: `linear-gradient(135deg, #fbbf24, #f59e0b)`,
              }}
              initial={{ scale: 0, y: -50 }}
              animate={{
                scale: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.1,
                type: 'spring',
                stiffness: 200,
                damping: 10,
              }}
            >
              <div className="w-full h-full rounded-full border-2 border-yellow-300/50 flex items-center justify-center">
                <motion.div
                  className="w-6 h-6 rounded-full border-2 border-white/50"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            Connecting to Table
          </h2>
          <motion.p
            className="text-gray-400 text-lg"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            Shuffling the deck...
          </motion.p>
        </motion.div>

        {/* Spinning dealer button */}
        <motion.div
          className="mt-8 inline-block bg-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl border-4 border-yellow-400 shadow-xl"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          D
        </motion.div>

        {/* Pulse ring */}
        <div className="relative mt-8">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-yellow-400"
              style={{
                width: '100px',
                height: '100px',
                left: '50%',
                top: '50%',
                marginLeft: '-50px',
                marginTop: '-50px',
              }}
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{
                scale: [0.5, 2, 2.5],
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
      </div>
    </div>
  );
}
