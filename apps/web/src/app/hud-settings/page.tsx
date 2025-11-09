'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import PokerHUD from '@/components/PokerHUD';

// Disable static generation
export const dynamic = 'force-dynamic';

interface HUDSettings {
  showStats: boolean;
  showNotes: boolean;
  showPotOdds: boolean;
  compactMode: boolean;
  opacity: number;
  fontSize: 'small' | 'medium' | 'large';
  position: 'top' | 'overlay' | 'side';
  colorScheme: 'default' | 'colorblind' | 'dark' | 'light';
  statsToShow: {
    vpip: boolean;
    pfr: boolean;
    aggression: boolean;
    threebet: boolean;
    foldToCbet: boolean;
    wtsd: boolean; // Went To ShowDown
    wsd: boolean; // Won at ShowDown
  };
}

export default function HUDSettingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  // HUD Settings State
  const [hudSettings, setHudSettings] = useState<HUDSettings>({
    showStats: true,
    showNotes: true,
    showPotOdds: true,
    compactMode: false,
    opacity: 90,
    fontSize: 'medium',
    position: 'overlay',
    colorScheme: 'default',
    statsToShow: {
      vpip: true,
      pfr: true,
      aggression: true,
      threebet: false,
      foldToCbet: false,
      wtsd: false,
      wsd: false,
    },
  });

  const [showPreview, setShowPreview] = useState(true);

  // Mock data for preview
  const mockPlayers = [
    {
      playerId: '1',
      username: 'Vous',
      position: 0,
      vpip: 24,
      pfr: 19,
      aggression: 3.2,
      hands: 125,
      color: '#22c55e',
    },
    {
      playerId: '2',
      username: 'SharkPro',
      position: 3,
      vpip: 22,
      pfr: 18,
      aggression: 3.8,
      hands: 340,
      note: 'Très agressif en position. Ne pas le bluffer.',
      color: '#ef4444',
    },
    {
      playerId: '3',
      username: 'FishyPlayer',
      position: 5,
      vpip: 48,
      pfr: 8,
      aggression: 0.9,
      hands: 256,
      note: 'Call station. Value bet thin.',
      color: '#3b82f6',
    },
    {
      playerId: '4',
      username: 'TightRock',
      position: 7,
      vpip: 14,
      pfr: 10,
      aggression: 1.5,
      hands: 145,
    },
  ];

  const handleSaveSettings = () => {
    localStorage.setItem('hudSettings', JSON.stringify(hudSettings));
    alert('✅ Paramètres HUD sauvegardés !');
  };

  const handleResetSettings = () => {
    const defaultSettings: HUDSettings = {
      showStats: true,
      showNotes: true,
      showPotOdds: true,
      compactMode: false,
      opacity: 90,
      fontSize: 'medium',
      position: 'overlay',
      colorScheme: 'default',
      statsToShow: {
        vpip: true,
        pfr: true,
        aggression: true,
        threebet: false,
        foldToCbet: false,
        wtsd: false,
        wsd: false,
      },
    };
    setHudSettings(defaultSettings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Retour
          </Link>
          <h1 className="text-4xl font-bold text-white">🎯 Configuration HUD</h1>
          <div className="bg-gray-800 rounded-full px-6 py-2">
            <span className="text-yellow-400 font-bold">
              💰 {user?.totalChips?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Display Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">🎨 Affichage</h2>

              <div className="space-y-4">
                {/* Show Stats Toggle */}
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-semibold">Afficher les statistiques</div>
                    <div className="text-gray-400 text-sm">VPIP, PFR, Aggression</div>
                  </div>
                  <button
                    onClick={() =>
                      setHudSettings((prev) => ({ ...prev, showStats: !prev.showStats }))
                    }
                    className={`relative w-14 h-7 rounded-full transition ${
                      hudSettings.showStats ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        hudSettings.showStats ? 'transform translate-x-7' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Show Notes Toggle */}
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-semibold">Afficher les notes</div>
                    <div className="text-gray-400 text-sm">Notes sur les joueurs</div>
                  </div>
                  <button
                    onClick={() =>
                      setHudSettings((prev) => ({ ...prev, showNotes: !prev.showNotes }))
                    }
                    className={`relative w-14 h-7 rounded-full transition ${
                      hudSettings.showNotes ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        hudSettings.showNotes ? 'transform translate-x-7' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Show Pot Odds Toggle */}
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-semibold">Afficher Pot Odds</div>
                    <div className="text-gray-400 text-sm">Calcul automatique des cotes</div>
                  </div>
                  <button
                    onClick={() =>
                      setHudSettings((prev) => ({ ...prev, showPotOdds: !prev.showPotOdds }))
                    }
                    className={`relative w-14 h-7 rounded-full transition ${
                      hudSettings.showPotOdds ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        hudSettings.showPotOdds ? 'transform translate-x-7' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Compact Mode Toggle */}
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-semibold">Mode Compact</div>
                    <div className="text-gray-400 text-sm">Affichage minimal pour économiser l'espace</div>
                  </div>
                  <button
                    onClick={() =>
                      setHudSettings((prev) => ({ ...prev, compactMode: !prev.compactMode }))
                    }
                    className={`relative w-14 h-7 rounded-full transition ${
                      hudSettings.compactMode ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        hudSettings.compactMode ? 'transform translate-x-7' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Opacity Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <div className="text-white font-semibold">Opacité</div>
                    <div className="text-yellow-400 font-bold">{hudSettings.opacity}%</div>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={hudSettings.opacity}
                    onChange={(e) =>
                      setHudSettings((prev) => ({ ...prev, opacity: Number(e.target.value) }))
                    }
                    className="w-full"
                  />
                </div>

                {/* Font Size */}
                <div>
                  <div className="text-white font-semibold mb-2">Taille de police</div>
                  <div className="flex space-x-2">
                    {(['small', 'medium', 'large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setHudSettings((prev) => ({ ...prev, fontSize: size }))}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          hudSettings.fontSize === size
                            ? 'bg-yellow-400 text-gray-900'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        {size === 'small' ? 'Petit' : size === 'medium' ? 'Moyen' : 'Grand'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Scheme */}
                <div>
                  <div className="text-white font-semibold mb-2">Thème de couleurs</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'default', label: 'Défaut' },
                      { value: 'colorblind', label: 'Daltonien' },
                      { value: 'dark', label: 'Sombre' },
                      { value: 'light', label: 'Clair' },
                    ].map((scheme) => (
                      <button
                        key={scheme.value}
                        onClick={() =>
                          setHudSettings((prev) => ({ ...prev, colorScheme: scheme.value as any }))
                        }
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          hudSettings.colorScheme === scheme.value
                            ? 'bg-yellow-400 text-gray-900'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        {scheme.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">📊 Statistiques à Afficher</h2>

              <div className="space-y-3">
                {[
                  { key: 'vpip', label: 'VPIP', description: 'Voluntarily Put $ In Pot' },
                  { key: 'pfr', label: 'PFR', description: 'Pre-Flop Raise' },
                  { key: 'aggression', label: 'Aggression', description: 'Facteur d\'Aggression' },
                  { key: 'threebet', label: '3-Bet', description: 'Fréquence de 3-Bet' },
                  { key: 'foldToCbet', label: 'Fold to C-Bet', description: 'Fold au Continuation Bet' },
                  { key: 'wtsd', label: 'WTSD', description: 'Went To ShowDown' },
                  { key: 'wsd', label: 'W$SD', description: 'Won $ at ShowDown' },
                ].map((stat) => (
                  <div key={stat.key} className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-semibold">{stat.label}</div>
                      <div className="text-gray-400 text-sm">{stat.description}</div>
                    </div>
                    <button
                      onClick={() =>
                        setHudSettings((prev) => ({
                          ...prev,
                          statsToShow: {
                            ...prev.statsToShow,
                            [stat.key]: !prev.statsToShow[stat.key as keyof typeof prev.statsToShow],
                          },
                        }))
                      }
                      className={`relative w-14 h-7 rounded-full transition ${
                        hudSettings.statsToShow[stat.key as keyof typeof hudSettings.statsToShow]
                          ? 'bg-green-500'
                          : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                          hudSettings.statsToShow[stat.key as keyof typeof hudSettings.statsToShow]
                            ? 'transform translate-x-7'
                            : ''
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex space-x-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveSettings}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 py-4 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition"
              >
                💾 Sauvegarder
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleResetSettings}
                className="bg-gray-700 text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-600 transition"
              >
                🔄 Réinitialiser
              </motion.button>
            </motion.div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">👁️ Aperçu en Direct</h2>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-yellow-400 hover:text-yellow-300 font-semibold"
                >
                  {showPreview ? 'Masquer' : 'Afficher'}
                </button>
              </div>

              {showPreview && (
                <div
                  className="relative bg-gradient-to-br from-green-700 to-green-900 rounded-xl overflow-hidden"
                  style={{ height: '600px', opacity: hudSettings.opacity / 100 }}
                >
                  <PokerHUD
                    players={mockPlayers}
                    pot={1250}
                    yourStack={5420}
                    bigBlind={100}
                    potOdds={25.5}
                    showStats={hudSettings.showStats}
                    showNotes={hudSettings.showNotes}
                    showPotOdds={hudSettings.showPotOdds}
                    compactMode={hudSettings.compactMode}
                  />
                </div>
              )}
            </motion.div>

            {/* HUD Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">💡 Conseils HUD</h3>
              <div className="space-y-3 text-gray-300 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 font-bold">✓</span>
                  <p>
                    <strong>VPIP (Bleu/Vert/Jaune/Rouge)</strong> : Indique si le joueur est tight (&lt;20%) ou
                    loose (&gt;40%)
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 font-bold">✓</span>
                  <p>
                    <strong>PFR</strong> : Un écart important entre VPIP et PFR indique un joueur passif
                    (call station)
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 font-bold">✓</span>
                  <p>
                    <strong>Aggression (&gt;3)</strong> : Joueur agressif qui mise et relance souvent
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-400 font-bold">!</span>
                  <p>
                    Les statistiques nécessitent au moins 10-20 mains pour être fiables
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-400 font-bold">!</span>
                  <p>
                    Utilisez les codes couleur pour repérer rapidement les fish (vert) et sharks (rouge)
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
