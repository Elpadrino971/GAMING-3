'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Disable static generation
export const dynamic = 'force-dynamic';

interface ProApplication {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    country: string;
    city: string;
    email: string;
    phone: string;
  };
  pokerCareer: {
    yearsPlaying: number;
    mainSpecialty: 'tournaments' | 'cash-game' | 'both';
    biggestWin: number;
    totalEarnings: number;
    majorTitles: string;
    pokerStarsUsername?: string;
    winamaxUsername?: string;
    ggpokerUsername?: string;
  };
  verification: {
    governmentID: File | null;
    proofOfAddress: File | null;
    tournamentResults: File | null;
    bankStatement: File | null;
  };
  socialMedia: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    twitch?: string;
  };
}

export default function ProRegistrationPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const [application, setApplication] = useState<ProApplication>({
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      country: '',
      city: '',
      email: '',
      phone: '',
    },
    pokerCareer: {
      yearsPlaying: 0,
      mainSpecialty: 'both',
      biggestWin: 0,
      totalEarnings: 0,
      majorTitles: '',
      pokerStarsUsername: '',
      winamaxUsername: '',
      ggpokerUsername: '',
    },
    verification: {
      governmentID: null,
      proofOfAddress: null,
      tournamentResults: null,
      bankStatement: null,
    },
    socialMedia: {
      twitter: '',
      instagram: '',
      youtube: '',
      twitch: '',
    },
  });

  const handleSubmit = () => {
    alert('🎉 Candidature envoyée avec succès!\n\nNotre équipe examinera votre dossier sous 48-72 heures.\n\nVous recevrez un email de confirmation.');
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Retour
          </Link>
          <div className="text-center">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-purple-400 to-yellow-400 mb-2">
              🏅 INSCRIPTION PRO
            </h1>
            <p className="text-gray-300 text-lg">Rejoignez l'Élite des Joueurs Professionnels</p>
          </div>
          <div className="bg-gray-800 rounded-full px-6 py-2">
            <span className="text-yellow-400 font-bold">
              💰 {user?.totalChips?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        {/* Benefits Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-4">✨ Avantages du Statut Pro</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-10 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-white font-bold">Tournois Exclusifs</div>
              <div className="text-purple-200 text-sm">$500K+ prize pools</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🤝</div>
              <div className="text-white font-bold">Sponsorships</div>
              <div className="text-purple-200 text-sm">Deals avec grandes marques</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-white font-bold">Analytics Avancés</div>
              <div className="text-purple-200 text-sm">Tracking détaillé</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🌟</div>
              <div className="text-white font-bold">Badge Vérifié</div>
              <div className="text-purple-200 text-sm">Reconnaissance officielle</div>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400 text-sm">Étape {step} sur {totalSteps}</span>
            <span className="text-yellow-400 text-sm font-bold">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full"
            />
          </div>
        </div>

        {/* Form Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-2xl p-8 max-w-4xl mx-auto"
        >
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">📋 Informations Personnelles</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Nom Complet *</label>
                    <input
                      type="text"
                      className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="John Doe"
                      value={application.personalInfo.fullName}
                      onChange={(e) =>
                        setApplication({
                          ...application,
                          personalInfo: { ...application.personalInfo, fullName: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Date de Naissance *</label>
                    <input
                      type="date"
                      className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      value={application.personalInfo.dateOfBirth}
                      onChange={(e) =>
                        setApplication({
                          ...application,
                          personalInfo: { ...application.personalInfo, dateOfBirth: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Pays *</label>
                    <input
                      type="text"
                      className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="France"
                      value={application.personalInfo.country}
                      onChange={(e) =>
                        setApplication({
                          ...application,
                          personalInfo: { ...application.personalInfo, country: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Ville *</label>
                    <input
                      type="text"
                      className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Paris"
                      value={application.personalInfo.city}
                      onChange={(e) =>
                        setApplication({
                          ...application,
                          personalInfo: { ...application.personalInfo, city: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Email *</label>
                    <input
                      type="email"
                      className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="john@example.com"
                      value={application.personalInfo.email}
                      onChange={(e) =>
                        setApplication({
                          ...application,
                          personalInfo: { ...application.personalInfo, email: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Téléphone *</label>
                    <input
                      type="tel"
                      className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="+33 6 12 34 56 78"
                      value={application.personalInfo.phone}
                      onChange={(e) =>
                        setApplication({
                          ...application,
                          personalInfo: { ...application.personalInfo, phone: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Poker Career */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">🎯 Carrière Poker</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Années d'Expérience *</label>
                    <input
                      type="number"
                      className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="5"
                      value={application.pokerCareer.yearsPlaying}
                      onChange={(e) =>
                        setApplication({
                          ...application,
                          pokerCareer: { ...application.pokerCareer, yearsPlaying: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Spécialité *</label>
                    <select
                      className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      value={application.pokerCareer.mainSpecialty}
                      onChange={(e) =>
                        setApplication({
                          ...application,
                          pokerCareer: { ...application.pokerCareer, mainSpecialty: e.target.value as any },
                        })
                      }
                    >
                      <option value="tournaments">Tournois</option>
                      <option value="cash-game">Cash Game</option>
                      <option value="both">Les Deux</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Plus Grosse Victoire ($) *</label>
                    <input
                      type="number"
                      className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="50000"
                      value={application.pokerCareer.biggestWin}
                      onChange={(e) =>
                        setApplication({
                          ...application,
                          pokerCareer: { ...application.pokerCareer, biggestWin: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Gains Totaux ($) *</label>
                    <input
                      type="number"
                      className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="200000"
                      value={application.pokerCareer.totalEarnings}
                      onChange={(e) =>
                        setApplication({
                          ...application,
                          pokerCareer: { ...application.pokerCareer, totalEarnings: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Titres Majeurs (WSOP, WPT, EPT, etc.)</label>
                  <textarea
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-24"
                    placeholder="Ex: WSOP Main Event 2023, EPT Barcelona 2024..."
                    value={application.pokerCareer.majorTitles}
                    onChange={(e) =>
                      setApplication({
                        ...application,
                        pokerCareer: { ...application.pokerCareer, majorTitles: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="bg-blue-900 bg-opacity-30 border border-blue-500 rounded-xl p-4">
                  <h3 className="text-white font-bold mb-3">🎮 Comptes Poker Online (optionnel)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="PokerStars Username"
                      value={application.pokerCareer.pokerStarsUsername}
                      onChange={(e) =>
                        setApplication({
                          ...application,
                          pokerCareer: { ...application.pokerCareer, pokerStarsUsername: e.target.value },
                        })
                      }
                    />
                    <input
                      type="text"
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Winamax Username"
                      value={application.pokerCareer.winamaxUsername}
                      onChange={(e) =>
                        setApplication({
                          ...application,
                          pokerCareer: { ...application.pokerCareer, winamaxUsername: e.target.value },
                        })
                      }
                    />
                    <input
                      type="text"
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="GGPoker Username"
                      value={application.pokerCareer.ggpokerUsername}
                      onChange={(e) =>
                        setApplication({
                          ...application,
                          pokerCareer: { ...application.pokerCareer, ggpokerUsername: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Verification Documents */}
          {step === 3 && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">📎 Documents de Vérification</h2>
              <div className="space-y-4">
                <div className="bg-yellow-900 bg-opacity-30 border border-yellow-500 rounded-xl p-4 mb-4">
                  <p className="text-yellow-200 text-sm">
                    ⚠️ Tous les documents doivent être clairs, lisibles et en couleur. Formats acceptés: PDF, JPG, PNG
                  </p>
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Pièce d'Identité (Passeport ou Carte d'Identité) *</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-yellow-400 transition cursor-pointer">
                    <input type="file" className="hidden" id="governmentID" accept=".pdf,.jpg,.png" />
                    <label htmlFor="governmentID" className="cursor-pointer">
                      <div className="text-4xl mb-2">📄</div>
                      <div className="text-gray-400">Cliquez pour télécharger</div>
                      <div className="text-gray-500 text-xs mt-1">PDF, JPG, PNG - Max 10MB</div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Justificatif de Domicile (moins de 3 mois) *</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-yellow-400 transition cursor-pointer">
                    <input type="file" className="hidden" id="proofOfAddress" accept=".pdf,.jpg,.png" />
                    <label htmlFor="proofOfAddress" className="cursor-pointer">
                      <div className="text-4xl mb-2">🏠</div>
                      <div className="text-gray-400">Cliquez pour télécharger</div>
                      <div className="text-gray-500 text-xs mt-1">Facture, Relevé bancaire, etc.</div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Résultats de Tournois / Preuves de Gains *</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-yellow-400 transition cursor-pointer">
                    <input type="file" className="hidden" id="tournamentResults" accept=".pdf,.jpg,.png" />
                    <label htmlFor="tournamentResults" className="cursor-pointer">
                      <div className="text-4xl mb-2">🏆</div>
                      <div className="text-gray-400">Cliquez pour télécharger</div>
                      <div className="text-gray-500 text-xs mt-1">Screenshots Hendon Mob, cashier online, etc.</div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Relevé Bancaire (optionnel pour vérification)</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-yellow-400 transition cursor-pointer">
                    <input type="file" className="hidden" id="bankStatement" accept=".pdf" />
                    <label htmlFor="bankStatement" className="cursor-pointer">
                      <div className="text-4xl mb-2">🏦</div>
                      <div className="text-gray-400">Cliquez pour télécharger</div>
                      <div className="text-gray-500 text-xs mt-1">Pour validation rapide (confidentiel)</div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Social Media */}
          {step === 4 && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">🌐 Réseaux Sociaux (Optionnel)</h2>
              <p className="text-gray-400 mb-6">
                Augmentez vos chances de sponsorship en partageant vos profils sociaux
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block flex items-center">
                    <span className="text-2xl mr-2">🐦</span> Twitter / X
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="@votreusername"
                    value={application.socialMedia.twitter}
                    onChange={(e) =>
                      setApplication({
                        ...application,
                        socialMedia: { ...application.socialMedia, twitter: e.target.value },
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block flex items-center">
                    <span className="text-2xl mr-2">📸</span> Instagram
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="@votreusername"
                    value={application.socialMedia.instagram}
                    onChange={(e) =>
                      setApplication({
                        ...application,
                        socialMedia: { ...application.socialMedia, instagram: e.target.value },
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block flex items-center">
                    <span className="text-2xl mr-2">📺</span> YouTube
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Channel URL"
                    value={application.socialMedia.youtube}
                    onChange={(e) =>
                      setApplication({
                        ...application,
                        socialMedia: { ...application.socialMedia, youtube: e.target.value },
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block flex items-center">
                    <span className="text-2xl mr-2">🎮</span> Twitch
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Channel URL"
                    value={application.socialMedia.twitch}
                    onChange={(e) =>
                      setApplication({
                        ...application,
                        socialMedia: { ...application.socialMedia, twitch: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="bg-green-900 bg-opacity-30 border border-green-500 rounded-xl p-4 mt-6">
                  <h3 className="text-green-200 font-bold mb-2">✅ Prêt à Soumettre</h3>
                  <p className="text-green-300 text-sm">
                    Votre candidature sera examinée par notre équipe dans les 48-72 heures. Vous recevrez un email de confirmation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(step - 1)}
                className="bg-gray-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-600 transition"
              >
                ← Précédent
              </motion.button>
            )}
            {step < totalSteps ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(step + 1)}
                className="ml-auto bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-3 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition"
              >
                Suivant →
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="ml-auto bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition"
              >
                ✅ Soumettre la Candidature
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Requirements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-gray-800 rounded-2xl p-6 max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-white mb-4">📋 Critères d'Éligibilité</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div className="flex items-start space-x-2">
              <span className="text-green-400 font-bold">✓</span>
              <span>Minimum 3 ans d'expérience en poker</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-400 font-bold">✓</span>
              <span>Gains totaux vérifiables &gt; $50,000</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-400 font-bold">✓</span>
              <span>Win rate positif démontrable</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-400 font-bold">✓</span>
              <span>Au moins 1 titre majeur ou résultat significatif</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-400 font-bold">✓</span>
              <span>Identité vérifiable avec documents officiels</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-400 font-bold">✓</span>
              <span>Réputation positive dans la communauté poker</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
