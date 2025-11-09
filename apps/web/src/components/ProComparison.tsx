'use client';

import { motion } from 'framer-motion';
import { User, Crown, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProComparisonProps {
  handId: string;
  playerAction: string;
  proAction: string;
  proName: string;
  proNickname: string;
  reasoning: string;
  evDifference: number;
  grade: string;
}

export default function ProComparison({
  playerAction,
  proAction,
  proName,
  proNickname,
  reasoning,
  evDifference,
  grade
}: ProComparisonProps) {
  const isSameAction = playerAction.toLowerCase() === proAction.toLowerCase();

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'from-green-400 to-green-600';
      case 'B':
        return 'from-blue-400 to-blue-600';
      case 'C':
        return 'from-yellow-400 to-yellow-600';
      case 'D':
        return 'from-red-400 to-red-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getEVIcon = () => {
    if (evDifference > 2) return <TrendingDown className="w-6 h-6 text-red-500" />;
    if (evDifference < -2) return <TrendingUp className="w-6 h-6 text-green-500" />;
    return <Minus className="w-6 h-6 text-gray-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Pro Comparison
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            vs {proName} "{proNickname}"
          </p>
        </div>

        {/* Grade Badge */}
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getGradeColor(grade)} flex items-center justify-center`}>
          <span className="text-3xl font-bold text-white">{grade}</span>
        </div>
      </div>

      {/* Actions Comparison */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Your Action */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <User className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Your Action
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {playerAction}
          </p>
        </div>

        {/* Pro Action */}
        <div className="bg-gradient-to-br from-poker-gold/10 to-yellow-500/10 rounded-lg p-4 border-2 border-poker-gold">
          <div className="flex items-center mb-2">
            <Crown className="w-5 h-5 text-poker-gold mr-2" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {proName} Would
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {proAction}
          </p>
        </div>
      </div>

      {/* EV Difference */}
      {!isSameAction && (
        <div className="flex items-center justify-center mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {getEVIcon()}
          <span className="ml-2 text-lg font-medium">
            {evDifference > 0 ? '+' : ''}{evDifference.toFixed(1)} BB difference
          </span>
        </div>
      )}

      {/* Pro's Reasoning */}
      <div className="bg-gradient-to-r from-poker-gold/5 to-yellow-500/5 border-l-4 border-poker-gold rounded p-4 mb-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          💭 {proName}'s Analysis:
        </p>
        <p className="text-gray-800 dark:text-gray-200 italic">
          "{reasoning}"
        </p>
      </div>

      {/* Result Message */}
      {isSameAction ? (
        <div className="text-center py-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            ✅ Perfect! Same as {proName}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            You're thinking like a pro!
          </p>
        </div>
      ) : (
        <div className="text-center py-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
            📚 Learning Opportunity
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Study this situation to improve your game
          </p>
        </div>
      )}
    </motion.div>
  );
}
