'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

/**
 * Page d'accueil de PokerMind
 */
export default function HomePage() {
  const { user, isAuthenticated, login } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length >= 3) {
      login(username.trim());
      setShowLoginModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-poker-green via-emerald-800 to-green-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400/20 rounded-full"
            initial={{
              x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
              y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                🎰
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">PokerMind</h1>
                <p className="text-yellow-400 text-sm">AI-Powered Poker Training</p>
              </div>
            </motion.div>

            {isAuthenticated && user && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-4"
              >
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-700">
                  <div className="text-right">
                    <p className="text-white font-semibold">{user.username}</p>
                    <p className="text-yellow-400 text-sm">
                      💰 {user.totalChips.toLocaleString()} chips
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {user.username[0].toUpperCase()}
                </div>
              </motion.div>
            )}
          </div>
        </header>

        {/* Hero section */}
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-6xl font-bold text-white mb-4">
              Learn Poker from the
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                {' '}Legends
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Play against intelligent AI, get coached by virtual pros, and master your game with real-time feedback.
            </p>

            {isAuthenticated && (
              <div className="flex justify-center space-x-4">
                <Link
                  href="/lobby"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-xl px-12 py-4 rounded-2xl shadow-2xl transition transform hover:scale-105"
                >
                  🎮 Play Now
                </Link>
                <Link
                  href="/pro-marketplace"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold text-xl px-12 py-4 rounded-2xl shadow-2xl transition transform hover:scale-105"
                >
                  🏆 Pro Coaches
                </Link>
              </div>
            )}
          </motion.div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              icon="🤖"
              title="5 AI Personalities"
              description="Face different playing styles: Nit, TAG, LAG, Maniac, and Calling Station"
              delay={0.3}
            />
            <FeatureCard
              icon="🏆"
              title="Pro Coaching"
              description="Learn from legends like Phil Ivey, Daniel Negreanu, and Fedor Holz"
              delay={0.4}
            />
            <FeatureCard
              icon="📊"
              title="Advanced Analytics"
              description="Track VPIP, PFR, aggression factor, and compare with the pros"
              delay={0.5}
            />
          </div>

          {/* Stats section */}
          {isAuthenticated && user && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Your Progress</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard label="Level" value={user.level.toString()} icon="⭐" />
                <StatCard label="XP" value={`${user.xp}/${user.level * 100}`} icon="📈" />
                <StatCard label="Hands Played" value={user.handsPlayed.toString()} icon="🃏" />
                <StatCard
                  label="Win Rate"
                  value={user.handsPlayed > 0 ? `${Math.round((user.handsWon / user.handsPlayed) * 100)}%` : '0%'}
                  icon="🎯"
                />
              </div>
            </motion.div>
          )}

          {/* Quick links */}
          <div className="mt-12 flex justify-center space-x-6">
            <Link href="/pro-stats" className="text-yellow-400 hover:text-yellow-300 font-semibold transition">
              📊 View Stats
            </Link>
            <Link href="/pro-marketplace" className="text-yellow-400 hover:text-yellow-300 font-semibold transition">
              🏪 Pro Marketplace
            </Link>
            <a href="#" className="text-yellow-400 hover:text-yellow-300 font-semibold transition">
              📚 Learn
            </a>
          </div>
        </div>
      </div>

      {/* Login modal */}
      <AnimatePresence>
        {showLoginModal && !isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                  🎰
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome to PokerMind</h2>
                <p className="text-gray-400">Enter your username to get started</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Username (min 3 characters)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 transition"
                    minLength={3}
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-xl transition transform hover:scale-105 shadow-xl"
                  disabled={username.trim().length < 3}
                >
                  Start Playing 🚀
                </button>
              </form>

              <div className="mt-6 text-center text-gray-500 text-sm">
                <p>🎁 Starting bonus: 5,000 chips</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Feature card component
 */
function FeatureCard({
  icon,
  title,
  description,
  delay
}: {
  icon: string;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-yellow-400 transition cursor-pointer"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

/**
 * Stat card component
 */
function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}
