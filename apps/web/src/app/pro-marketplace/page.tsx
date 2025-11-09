'use client';

import { useState } from 'react';
import { Star, Trophy, TrendingUp, DollarSign, Lock, Check } from 'lucide-react';
import Image from 'next/image';

const PRO_COACHES = [
  {
    id: 'daniel-negreanu',
    name: 'Daniel Negreanu',
    nickname: 'Kid Poker',
    style: 'Tight-Aggressive',
    winnings: '$46.1M',
    bracelets: 6,
    specialty: 'Tournament Master',
    description: 'Learn to read players like a book and master position play.',
    price: 14.99,
    rating: 4.9,
    students: 12453,
    image: '/pros/negreanu.jpg',
    highlights: [
      '🎯 Position Mastery',
      '👁️ Elite Player Reading',
      '🎰 Tournament Strategy',
      '💬 Table Talk Techniques'
    ]
  },
  {
    id: 'phil-ivey',
    name: 'Phil Ivey',
    nickname: 'The Tiger Woods of Poker',
    style: 'Loose-Aggressive (LAG)',
    winnings: '$30.1M',
    bracelets: 10,
    specialty: 'Cash Game Legend',
    description: 'Master aggressive play and fearless decision-making.',
    price: 19.99,
    rating: 4.95,
    students: 8942,
    image: '/pros/ivey.jpg',
    highlights: [
      '⚡ Relentless Aggression',
      '🧠 Advanced Reads',
      '💰 High Stakes Mastery',
      '🎯 Pressure Play'
    ],
    featured: true
  },
  {
    id: 'fedor-holz',
    name: 'Fedor Holz',
    nickname: 'CrownUpGuy',
    style: 'GTO Balanced',
    winnings: '$36.3M',
    bracelets: 1,
    specialty: 'Modern GTO',
    description: 'Modern poker theory with mental game mastery.',
    price: 17.99,
    rating: 4.92,
    students: 15234,
    image: '/pros/holz.jpg',
    highlights: [
      '🎓 GTO Foundation',
      '🧘 Mental Game Elite',
      '📊 ICM Mastery',
      '💎 High Roller Secrets'
    ]
  },
  {
    id: 'phil-hellmuth',
    name: 'Phil Hellmuth',
    nickname: 'The Poker Brat',
    style: 'Exploitative Tight',
    winnings: '$28.3M',
    bracelets: 16,
    specialty: 'Reading Players',
    description: 'Learn to exploit opponents and make legendary laydowns.',
    price: 12.99,
    rating: 4.7,
    students: 18765,
    image: '/pros/hellmuth.jpg',
    highlights: [
      '🔮 White Magic Reads',
      '🛡️ Tight is Right',
      '🏆 Tournament Consistency',
      '👀 Exploitative Play'
    ]
  },
  {
    id: 'vanessa-selbst',
    name: 'Vanessa Selbst',
    nickname: 'V-Ness',
    style: 'Ultra-Aggressive',
    winnings: '$11.9M',
    bracelets: 3,
    specialty: 'Fearless Aggression',
    description: 'Dominate tables with fearless aggressive play.',
    price: 13.99,
    rating: 4.85,
    students: 6543,
    image: '/pros/selbst.jpg',
    highlights: [
      '🔥 Fearless Play',
      '💪 3-Bet or Fold',
      '👊 Table Domination',
      '🎯 Aggressive Edge'
    ]
  },
  {
    id: 'tom-dwan',
    name: 'Tom Dwan',
    nickname: 'durrrr',
    style: 'Maniac (Creative)',
    winnings: '$3.7M+',
    bracelets: 0,
    specialty: 'Creative Bluffing',
    description: 'Learn unconventional plays and fearless bluffing.',
    price: 16.99,
    rating: 4.88,
    students: 9876,
    image: '/pros/dwan.jpg',
    highlights: [
      '🎭 Triple Barrel Bluffs',
      '🌀 Unpredictable Lines',
      '💸 High Stakes Cash',
      '🎲 Creative Aggression'
    ]
  }
];

export default function ProMarketplacePage() {
  const [selectedPro, setSelectedPro] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'beginner' | 'advanced'>('all');

  const handlePurchase = async (proId: string, price: number) => {
    // Intégration Stripe
    const response = await fetch('/api/pro-coach/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proId, price })
    });

    const { url } = await response.json();
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-poker-gold to-yellow-500 bg-clip-text text-transparent">
          🏆 Pro Coaches Marketplace
        </h1>
        <p className="text-xl text-gray-300">
          Learn from the best players in the world. Choose your mentor.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto mb-8 grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-3xl font-bold text-poker-gold">6</div>
          <div className="text-sm text-gray-400">Pro Coaches</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-3xl font-bold text-green-500">72K+</div>
          <div className="text-sm text-gray-400">Students</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-3xl font-bold text-blue-500">4.87</div>
          <div className="text-sm text-gray-400">Avg Rating</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-3xl font-bold text-purple-500">$155M+</div>
          <div className="text-sm text-gray-400">Combined Winnings</div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8 flex gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-poker-gold text-gray-900'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All Coaches
        </button>
        <button
          onClick={() => setFilter('beginner')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            filter === 'beginner'
              ? 'bg-poker-gold text-gray-900'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Beginner Friendly
        </button>
        <button
          onClick={() => setFilter('advanced')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            filter === 'advanced'
              ? 'bg-poker-gold text-gray-900'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Advanced
        </button>
      </div>

      {/* Pro Coaches Grid */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRO_COACHES.map((pro) => (
          <div
            key={pro.id}
            className={`bg-gray-800 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
              pro.featured
                ? 'border-poker-gold shadow-2xl shadow-poker-gold/20'
                : 'border-gray-700 hover:border-poker-gold/50'
            }`}
          >
            {/* Featured Badge */}
            {pro.featured && (
              <div className="bg-poker-gold text-gray-900 text-center py-1 font-bold text-sm">
                ⭐ MOST POPULAR
              </div>
            )}

            {/* Pro Image Placeholder */}
            <div className="h-48 bg-gradient-to-br from-poker-green to-poker-green-dark flex items-center justify-center">
              <div className="text-6xl">🎰</div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Name & Nickname */}
              <h3 className="text-2xl font-bold mb-1">{pro.name}</h3>
              <p className="text-sm text-poker-gold mb-3">"{pro.nickname}"</p>

              {/* Style */}
              <div className="inline-block px-3 py-1 bg-gray-700 rounded-full text-xs font-medium mb-4">
                {pro.style}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center text-sm">
                  <Trophy className="w-4 h-4 text-poker-gold mr-2" />
                  {pro.bracelets} Bracelets
                </div>
                <div className="flex items-center text-sm">
                  <DollarSign className="w-4 h-4 text-green-500 mr-2" />
                  {pro.winnings}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-4">
                {pro.description}
              </p>

              {/* Highlights */}
              <div className="space-y-1 mb-4">
                {pro.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center text-xs text-gray-400">
                    <Check className="w-3 h-3 text-green-500 mr-2" />
                    {highlight}
                  </div>
                ))}
              </div>

              {/* Rating & Students */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-medium">{pro.rating}</span>
                </div>
                <div className="text-sm text-gray-400">
                  {pro.students.toLocaleString()} students
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-poker-gold">
                  ${pro.price}
                </div>
                <button
                  onClick={() => handlePurchase(pro.id, pro.price)}
                  className="px-6 py-2 bg-poker-gold text-gray-900 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
                >
                  Unlock
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* What You Get */}
      <div className="max-w-7xl mx-auto mt-16 bg-gray-800 rounded-xl p-8 border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center">What You Get with Each Pro Coach</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🎓</div>
            <h3 className="font-bold mb-2">Pro-Style Coaching</h3>
            <p className="text-sm text-gray-400">
              IA qui coach exactement comme le pro. Conseils personnalisés dans leur style unique.
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold mb-2">Hand Comparisons</h3>
            <p className="text-sm text-gray-400">
              Compare chaque main avec ce que le pro aurait fait. Notes et explications.
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold mb-2">Custom Learning Path</h3>
            <p className="text-sm text-gray-400">
              Plan d'apprentissage personnalisé pour jouer comme le pro en 30 jours.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-poker-gold font-medium">
            ✨ One-time purchase. Lifetime access.
          </p>
        </div>
      </div>
    </div>
  );
}
