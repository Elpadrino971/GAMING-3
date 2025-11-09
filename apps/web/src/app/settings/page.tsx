'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

// Disable static generation
export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Performance settings
  const [animations, setAnimations] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [graphicsQuality, setGraphicsQuality] = useState<'low' | 'medium' | 'high'>('high');
  const [autoSave, setAutoSave] = useState(true);

  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Game settings
  const [autoMuck, setAutoMuck] = useState(false);
  const [fourColorDeck, setFourColorDeck] = useState(false);
  const [showPotOdds, setShowPotOdds] = useState(true);
  const [quickFold, setQuickFold] = useState(false);

  const handleSave = () => {
    // Save settings to backend
    localStorage.setItem('settings', JSON.stringify({
      animations,
      soundEffects,
      graphicsQuality,
      autoSave,
      twoFactorAuth,
      sessionTimeout,
      emailNotifications,
      autoMuck,
      fourColorDeck,
      showPotOdds,
      quickFold,
    }));

    alert('✅ Paramètres sauvegardés avec succès!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Retour
          </Link>
          <h1 className="text-4xl font-bold text-white">⚙️ Paramètres</h1>
          <div className="bg-gray-800 rounded-full px-6 py-2">
            <span className="text-yellow-400 font-bold">💰 {user?.totalChips?.toLocaleString() || 0}</span>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              👤 Compte
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">Nom d'utilisateur</div>
                  <div className="text-gray-400 text-sm">{user?.username || 'Utilisateur'}</div>
                </div>
                <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition">
                  Modifier
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">Email</div>
                  <div className="text-gray-400 text-sm">{user?.email || 'email@example.com'}</div>
                </div>
                <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition">
                  Modifier
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">Mot de passe</div>
                  <div className="text-gray-400 text-sm">••••••••</div>
                </div>
                <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition">
                  Changer
                </button>
              </div>
            </div>
          </motion.div>

          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              🔒 Sécurité
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">Authentification à 2 facteurs</div>
                  <div className="text-gray-400 text-sm">Sécurité renforcée avec code SMS</div>
                </div>
                <button
                  onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                  className={`relative w-14 h-7 rounded-full transition ${
                    twoFactorAuth ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      twoFactorAuth ? 'transform translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">Délai d'expiration de session</div>
                  <div className="text-gray-400 text-sm">Déconnexion automatique après inactivité</div>
                </div>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 heure</option>
                  <option value={120}>2 heures</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">Notifications par email</div>
                  <div className="text-gray-400 text-sm">Recevoir des alertes de sécurité</div>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative w-14 h-7 rounded-full transition ${
                    emailNotifications ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      emailNotifications ? 'transform translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Performance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              ⚡ Performance
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">Animations</div>
                  <div className="text-gray-400 text-sm">Activer les animations fluides</div>
                </div>
                <button
                  onClick={() => setAnimations(!animations)}
                  className={`relative w-14 h-7 rounded-full transition ${
                    animations ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      animations ? 'transform translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">Effets sonores</div>
                  <div className="text-gray-400 text-sm">Sons des actions de jeu</div>
                </div>
                <button
                  onClick={() => setSoundEffects(!soundEffects)}
                  className={`relative w-14 h-7 rounded-full transition ${
                    soundEffects ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      soundEffects ? 'transform translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">Qualité graphique</div>
                  <div className="text-gray-400 text-sm">Niveau de détail des visuels</div>
                </div>
                <select
                  value={graphicsQuality}
                  onChange={(e) => setGraphicsQuality(e.target.value as any)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">Sauvegarde automatique</div>
                  <div className="text-gray-400 text-sm">Sauvegarder la progression automatiquement</div>
                </div>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`relative w-14 h-7 rounded-full transition ${
                    autoSave ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      autoSave ? 'transform translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Game Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              🎮 Jeu
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">Auto-muck</div>
                  <div className="text-gray-400 text-sm">Cacher automatiquement les cartes perdantes</div>
                </div>
                <button
                  onClick={() => setAutoMuck(!autoMuck)}
                  className={`relative w-14 h-7 rounded-full transition ${
                    autoMuck ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      autoMuck ? 'transform translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">Jeu 4 couleurs</div>
                  <div className="text-gray-400 text-sm">Utiliser 4 couleurs différentes pour les cartes</div>
                </div>
                <button
                  onClick={() => setFourColorDeck(!fourColorDeck)}
                  className={`relative w-14 h-7 rounded-full transition ${
                    fourColorDeck ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      fourColorDeck ? 'transform translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">Afficher les cotes du pot</div>
                  <div className="text-gray-400 text-sm">Voir les probabilités en temps réel</div>
                </div>
                <button
                  onClick={() => setShowPotOdds(!showPotOdds)}
                  className={`relative w-14 h-7 rounded-full transition ${
                    showPotOdds ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      showPotOdds ? 'transform translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">Fold rapide</div>
                  <div className="text-gray-400 text-sm">Bouton de fold rapide avant votre tour</div>
                </div>
                <button
                  onClick={() => setQuickFold(!quickFold)}
                  className={`relative w-14 h-7 rounded-full transition ${
                    quickFold ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      quickFold ? 'transform translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Language Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              🌍 Langue
            </h2>

            <div className="flex justify-between items-center">
              <div>
                <div className="text-white font-semibold">Langue de l'interface</div>
                <div className="text-gray-400 text-sm">Choisissez votre langue préférée</div>
              </div>
              <LanguageSelector />
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-12 py-4 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-yellow-600 transition shadow-lg"
            >
              💾 Sauvegarder les paramètres
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
