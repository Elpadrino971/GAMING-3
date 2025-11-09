'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProComparisonData {
  proAction: string;
  proReasoning: string;
  evDifference: number;
  grade: string;
  proName: string;
  proNickname: string;
  proPhotoUrl?: string;
}

interface InGameProComparisonProps {
  handId: string;
  playerAction: string;
  userId: string;
  activeProId?: string; // Pro actuellement sélectionné par le joueur
  onClose: () => void;
}

/**
 * Composant qui affiche la comparaison avec un pro après une action
 * S'affiche automatiquement en overlay pendant le jeu
 */
export default function InGameProComparison({
  handId,
  playerAction,
  userId,
  activeProId,
  onClose
}: InGameProComparisonProps) {
  const [comparison, setComparison] = useState<ProComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!activeProId) {
      setLoading(false);
      return;
    }

    fetchComparison();
  }, [handId, playerAction, activeProId]);

  const fetchComparison = async () => {
    try {
      setLoading(true);

      // Récupérer la main complète
      const handResponse = await fetch(`/api/hands/${handId}`);
      const hand = await handResponse.json();

      // Comparer avec le pro
      const response = await fetch('/api/pro-coach/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          proId: activeProId,
          handState: hand,
          playerAction
        })
      });

      const data = await response.json();

      if (data.success) {
        setComparison(data.comparison);
        setShow(true);
      }
    } catch (error) {
      console.error('Error fetching pro comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-500 bg-green-50';
      case 'B': return 'text-blue-500 bg-blue-50';
      case 'C': return 'text-yellow-500 bg-yellow-50';
      case 'D': return 'text-orange-500 bg-orange-50';
      case 'F': return 'text-red-500 bg-red-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getGradeMessage = (grade: string) => {
    switch (grade) {
      case 'A': return 'Excellent play!';
      case 'B': return 'Good decision';
      case 'C': return 'Average play';
      case 'D': return 'Questionable decision';
      case 'F': return 'Significant mistake';
      default: return '';
    }
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300); // Attendre la fin de l'animation
  };

  if (loading || !comparison) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl shadow-2xl max-w-2xl w-full p-6 pb-8"
          >
            {/* Header avec photo du pro */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {comparison.proPhotoUrl && (
                  <img
                    src={comparison.proPhotoUrl}
                    alt={comparison.proName}
                    className="w-16 h-16 rounded-full border-4 border-poker-gold"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {comparison.proName}
                  </h3>
                  <p className="text-sm text-gray-500">{comparison.proNickname}</p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Comparaison des actions */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Ton action */}
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Your Action
                </p>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {playerAction}
                </p>
              </div>

              {/* Action du pro */}
              <div className="bg-gradient-to-br from-poker-gold to-yellow-600 rounded-xl p-4 border-2 border-poker-gold shadow-lg">
                <p className="text-xs font-semibold text-yellow-100 uppercase mb-2">
                  {comparison.proName} Would
                </p>
                <p className="text-2xl font-bold text-white capitalize">
                  {comparison.proAction}
                </p>
              </div>
            </div>

            {/* EV Difference & Grade */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">EV Difference:</span>
                <span className={`text-xl font-bold ${
                  comparison.evDifference >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {comparison.evDifference >= 0 ? '+' : ''}{comparison.evDifference.toFixed(1)} BB
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600">Grade:</span>
                <div className={`px-6 py-2 rounded-lg ${getGradeColor(comparison.grade)}`}>
                  <span className="text-3xl font-bold">{comparison.grade}</span>
                </div>
              </div>
            </div>

            {/* Grade message */}
            <div className="mb-4">
              <p className={`text-center font-semibold ${
                comparison.grade === 'A' ? 'text-green-600' :
                comparison.grade === 'B' ? 'text-blue-600' :
                comparison.grade === 'C' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {getGradeMessage(comparison.grade)}
              </p>
            </div>

            {/* Reasoning du pro */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border-l-4 border-poker-gold">
              <div className="flex items-start space-x-3">
                <div className="text-3xl">💭</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {comparison.proName}'s Analysis:
                  </p>
                  <p className="text-gray-800 leading-relaxed italic">
                    "{comparison.proReasoning}"
                  </p>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-xl transition"
              >
                Got it
              </button>
              <button
                onClick={() => {
                  // TODO: Ouvrir le learning path
                  console.log('Open learning path');
                }}
                className="flex-1 bg-gradient-to-r from-poker-gold to-yellow-600 hover:from-yellow-600 hover:to-poker-gold text-white font-semibold py-3 rounded-xl transition shadow-lg"
              >
                Learn More
              </button>
            </div>

            {/* Mini stats */}
            <div className="mt-4 text-center text-xs text-gray-500">
              Your stats vs {comparison.proName} • View full comparison in Dashboard
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
