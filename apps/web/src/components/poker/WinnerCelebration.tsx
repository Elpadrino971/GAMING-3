'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface WinnerCelebrationProps {
  winner: {
    playerName: string;
    amount: number;
    handRank: string;
  };
  onComplete: () => void;
}

export default function WinnerCelebration({ winner, onComplete }: WinnerCelebrationProps) {
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    // Trigger confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#fbbf24', '#f59e0b', '#ffffff', '#10b981'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#fbbf24', '#f59e0b', '#ffffff', '#10b981'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
    setShowFireworks(true);

    return () => {
      confetti.reset();
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onComplete}
        />

        {/* Winner card */}
        <motion.div
          className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl p-8 max-w-md w-full mx-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: 1,
            rotate: 0,
          }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
          }}
          style={{
            boxShadow: '0 0 100px rgba(251, 191, 36, 0.5)',
          }}
        >
          {/* Trophy animation */}
          <motion.div
            className="text-8xl text-center mb-6"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🏆
          </motion.div>

          {/* Winner text */}
          <motion.h2
            className="text-4xl font-bold text-gray-900 text-center mb-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Winner!
          </motion.h2>

          {/* Player name */}
          <motion.p
            className="text-2xl font-bold text-gray-800 text-center mb-2"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {winner.playerName}
          </motion.p>

          {/* Amount won */}
          <motion.div
            className="bg-white/30 backdrop-blur-sm rounded-2xl py-6 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.5,
              type: 'spring',
              stiffness: 200,
            }}
          >
            <motion.p
              className="text-5xl font-bold text-green-700 text-center"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              +{winner.amount.toLocaleString()}
            </motion.p>
            <p className="text-gray-700 text-center text-lg mt-2">chips</p>
          </motion.div>

          {/* Hand rank */}
          <motion.p
            className="text-xl text-gray-800 text-center mb-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {winner.handRank}
          </motion.p>

          {/* Continue button */}
          <motion.button
            className="w-full bg-gray-900 hover:bg-gray-800 text-yellow-400 font-bold py-4 rounded-xl text-lg transition"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
          >
            Continue
          </motion.button>

          {/* Decorative stars */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${-10 + Math.random() * 120}%`,
              }}
              initial={{ scale: 0, rotate: 0 }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 360],
                y: [0, -50, -100],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              ⭐
            </motion.div>
          ))}

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-3xl"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              ease: 'linear',
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
