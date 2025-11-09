'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PlayerStats {
  vpip: number;
  pfr: number;
  aggressionFactor: number;
  threebet: number;
  cbet: number;
  wtsd: number; // Went to showdown
  wonAtShowdown: number;
  handsPlayed: number;
  winRate: number; // BB/100
}

interface ProPlayer {
  id: string;
  name: string;
  nickname: string;
  photoUrl?: string;
  playStyle: string;
  stats: {
    vpipAvg: number;
    pfrAvg: number;
    aggressionFactor: number;
    threebet: number;
    cbet: number;
  };
  totalWinnings: number;
  braceletCount: number;
}

interface StyleMatch {
  proId: string;
  proName: string;
  similarity: number;
  matchingTraits: string[];
  differences: string[];
}

export default function ProStatsPage() {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [myCoaches, setMyCoaches] = useState<ProPlayer[]>([]);
  const [selectedPro, setSelectedPro] = useState<ProPlayer | null>(null);
  const [styleMatches, setStyleMatches] = useState<StyleMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Récupérer les stats du joueur
      const statsResponse = await fetch('/api/user/stats');
      const stats = await statsResponse.json();
      setPlayerStats(stats);

      // Récupérer les coaches achetés
      const coachesResponse = await fetch('/api/pro-coach/my-coaches/user_123'); // TODO: vrai userId
      const coachesData = await coachesResponse.json();
      setMyCoaches(coachesData.coaches);

      if (coachesData.coaches.length > 0) {
        setSelectedPro(coachesData.coaches[0]);
      }

      // Trouver les matchs de style
      const matchResponse = await fetch('/api/pro-coach/style-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats })
      });
      const matches = await matchResponse.json();
      setStyleMatches(matches.matches || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatDifference = (playerValue: number, proValue: number) => {
    const diff = playerValue - proValue;
    return {
      value: diff,
      isClose: Math.abs(diff) < 3,
      direction: diff > 0 ? 'higher' : 'lower'
    };
  };

  const StatComparison = ({ label, playerValue, proValue, suffix = '%' }: {
    label: string;
    playerValue: number;
    proValue: number;
    suffix?: string;
  }) => {
    const diff = getStatDifference(playerValue, proValue);

    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">{label}</h4>

        <div className="grid grid-cols-2 gap-4 mb-3">
          {/* Player stat */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Your Stat</p>
            <p className="text-2xl font-bold text-gray-900">
              {playerValue.toFixed(1)}{suffix}
            </p>
          </div>

          {/* Pro stat */}
          <div>
            <p className="text-xs text-gray-500 mb-1">{selectedPro?.name}</p>
            <p className="text-2xl font-bold text-poker-gold">
              {proValue.toFixed(1)}{suffix}
            </p>
          </div>
        </div>

        {/* Difference indicator */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Difference:</span>
          <span className={`text-sm font-semibold ${
            diff.isClose ? 'text-green-600' :
            Math.abs(diff.value) < 8 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {diff.value > 0 ? '+' : ''}{diff.value.toFixed(1)}{suffix}
          </span>
        </div>

        {/* Visual bar */}
        <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full flex">
            <div
              style={{ width: `${(playerValue / Math.max(playerValue, proValue)) * 100}%` }}
              className="bg-blue-500"
            />
            <div
              style={{ width: `${(proValue / Math.max(playerValue, proValue)) * 100}%` }}
              className="bg-poker-gold"
            />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-poker-green to-emerald-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading stats...</div>
      </div>
    );
  }

  if (!playerStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-poker-green to-emerald-900 flex items-center justify-center">
        <div className="text-white text-xl">Play some hands to see your stats!</div>
      </div>
    );
  }

  if (myCoaches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-poker-green to-emerald-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold mb-4">No Pro Coaches Yet</h2>
          <p className="text-gray-600 mb-6">
            Purchase a pro coach to compare your stats and improve your game!
          </p>
          <a
            href="/pro-marketplace"
            className="inline-block bg-gradient-to-r from-poker-gold to-yellow-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg transition"
          >
            Browse Pro Coaches
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-poker-green to-emerald-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Your Stats vs The Pros
          </h1>
          <p className="text-gray-600">
            See how you stack up against the world's best poker players
          </p>
        </div>

        {/* Pro selector */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Compare with:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {myCoaches.map((pro) => (
              <button
                key={pro.id}
                onClick={() => setSelectedPro(pro)}
                className={`p-4 rounded-xl border-2 transition ${
                  selectedPro?.id === pro.id
                    ? 'border-poker-gold bg-yellow-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {pro.photoUrl && (
                  <img
                    src={pro.photoUrl}
                    alt={pro.name}
                    className="w-16 h-16 rounded-full mx-auto mb-2"
                  />
                )}
                <p className="font-semibold text-sm text-center">{pro.name}</p>
                <p className="text-xs text-gray-500 text-center">{pro.playStyle}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Style Match Score */}
        {styleMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 mb-6 text-white"
          >
            <h2 className="text-2xl font-bold mb-4">🎯 Style Match Score</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {styleMatches.slice(0, 3).map((match, index) => (
                <div key={match.proId} className="bg-white bg-opacity-20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{match.proName}</span>
                    <span className="text-2xl font-bold">{match.similarity}%</span>
                  </div>
                  <div className="h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${match.similarity}%` }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                  <p className="text-xs mt-2 opacity-90">
                    {index === 0 ? 'Most Similar' : index === 1 ? 'Similar' : 'Different Style'}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats Comparison Grid */}
        {selectedPro && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StatComparison
              label="VPIP (Voluntarily Put $ In Pot)"
              playerValue={playerStats.vpip}
              proValue={selectedPro.stats.vpipAvg}
            />
            <StatComparison
              label="PFR (Pre-Flop Raise)"
              playerValue={playerStats.pfr}
              proValue={selectedPro.stats.pfrAvg}
            />
            <StatComparison
              label="Aggression Factor"
              playerValue={playerStats.aggressionFactor}
              proValue={selectedPro.stats.aggressionFactor}
              suffix="x"
            />
            <StatComparison
              label="3-Bet %"
              playerValue={playerStats.threebet}
              proValue={selectedPro.stats.threebet}
            />
            <StatComparison
              label="C-Bet %"
              playerValue={playerStats.cbet}
              proValue={selectedPro.stats.cbet}
            />
            <StatComparison
              label="Went to Showdown"
              playerValue={playerStats.wtsd}
              proValue={28.5} // Example pro value
            />
          </div>
        )}

        {/* Insights & Recommendations */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4">💡 Insights & Recommendations</h2>

          <div className="space-y-4">
            {/* Matching traits */}
            {styleMatches[0] && styleMatches[0].matchingTraits.length > 0 && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <h3 className="font-semibold text-green-900 mb-2">✅ What You're Doing Well:</h3>
                <ul className="space-y-1">
                  {styleMatches[0].matchingTraits.map((trait, index) => (
                    <li key={index} className="text-sm text-green-800">• {trait}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Differences */}
            {styleMatches[0] && styleMatches[0].differences.length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Areas to Improve:</h3>
                <ul className="space-y-1">
                  {styleMatches[0].differences.map((diff, index) => (
                    <li key={index} className="text-sm text-yellow-800">• {diff}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Overall stats */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">📈 Your Progress:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-blue-900">{playerStats.handsPlayed.toLocaleString()}</p>
                  <p className="text-sm text-blue-700">Hands Played</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">
                    {playerStats.winRate > 0 ? '+' : ''}{playerStats.winRate.toFixed(1)} BB/100
                  </p>
                  <p className="text-sm text-blue-700">Win Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 flex space-x-4">
            <a
              href="/pro-marketplace"
              className="flex-1 bg-gradient-to-r from-poker-gold to-yellow-600 text-white font-bold py-4 rounded-xl text-center hover:shadow-lg transition"
            >
              Unlock More Pros
            </a>
            <button
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl transition"
              onClick={() => {
                // TODO: Ouvrir learning path
                console.log('View learning path');
              }}
            >
              View Learning Path
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
