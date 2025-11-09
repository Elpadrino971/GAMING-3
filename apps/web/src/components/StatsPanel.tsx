'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PlayerStats {
  vpip: number;
  pfr: number;
  aggressionFactor: number;
  cBetPercentage: number;
  foldToCBet: number;
  threeBetPercentage: number;
  idi: number;
}

interface StatsPanelProps {
  stats: PlayerStats;
  sessionHistory?: any[];
}

export default function StatsPanel({ stats, sessionHistory = [] }: StatsPanelProps) {
  const getStatStatus = (value: number, optimal: [number, number]) => {
    if (value >= optimal[0] && value <= optimal[1]) {
      return { icon: <Minus className="w-4 h-4 text-green-500" />, color: 'text-green-600' };
    } else if (value < optimal[0]) {
      return { icon: <TrendingDown className="w-4 h-4 text-blue-500" />, color: 'text-blue-600' };
    } else {
      return { icon: <TrendingUp className="w-4 h-4 text-red-500" />, color: 'text-red-600' };
    }
  };

  const statItems = [
    {
      label: 'VPIP',
      value: stats.vpip,
      optimal: [20, 30] as [number, number],
      description: 'Voluntary Put In Pot - % de mains jouées'
    },
    {
      label: 'PFR',
      value: stats.pfr,
      optimal: [15, 25] as [number, number],
      description: 'Pre-Flop Raise - % de raises pre-flop'
    },
    {
      label: 'Aggression Factor',
      value: stats.aggressionFactor,
      optimal: [2.0, 3.5] as [number, number],
      description: 'Ratio (Bet+Raise)/Call'
    },
    {
      label: 'C-Bet %',
      value: stats.cBetPercentage,
      optimal: [50, 65] as [number, number],
      description: 'Continuation Bet au flop'
    },
    {
      label: 'Fold to C-Bet',
      value: stats.foldToCBet,
      optimal: [40, 60] as [number, number],
      description: 'Fréquence de fold face à un c-bet'
    },
    {
      label: '3-Bet %',
      value: stats.threeBetPercentage,
      optimal: [5, 10] as [number, number],
      description: '% de 3-bet pre-flop'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* IDI Score */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Indice de Décision Intelligente (IDI)
          </h3>
          <span className="text-3xl font-bold text-poker-gold">
            {stats.idi.toFixed(0)}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all ${
              stats.idi >= 80
                ? 'bg-green-500'
                : stats.idi >= 60
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${stats.idi}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {stats.idi >= 80
            ? '🏆 Excellent ! Tes décisions sont optimales'
            : stats.idi >= 60
            ? '✅ Bon niveau, continue de progresser'
            : '📚 Continue d\'apprendre et de t\'améliorer'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {statItems.map((item) => {
          const status = getStatStatus(item.value, item.optimal);

          return (
            <div
              key={item.label}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {item.label}
                </span>
                {status.icon}
              </div>
              <div className="flex items-baseline space-x-2">
                <span className={`text-2xl font-bold ${status.color}`}>
                  {item.value.toFixed(1)}
                  {item.label.includes('%') ? '%' : ''}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Opt: {item.optimal[0]}-{item.optimal[1]}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Session History Chart */}
      {sessionHistory.length > 0 && (
        <div>
          <h4 className="text-md font-bold text-gray-900 dark:text-white mb-4">
            Progression IDI
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sessionHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="idi"
                stroke="#FFD700"
                strokeWidth={2}
                dot={{ fill: '#FFD700' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
