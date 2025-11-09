'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Disable static generation
export const dynamic = 'force-dynamic';

interface ChipPackage {
  id: string;
  name: string;
  chips: number;
  price: number;
  currency: string;
  bonus: number;
  popular?: boolean;
  bestValue?: boolean;
}

const CHIP_PACKAGES: ChipPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    chips: 10000,
    price: 4.99,
    currency: 'EUR',
    bonus: 0,
  },
  {
    id: 'bronze',
    name: 'Bronze Pack',
    chips: 25000,
    price: 9.99,
    currency: 'EUR',
    bonus: 10,
  },
  {
    id: 'silver',
    name: 'Silver Pack',
    chips: 50000,
    price: 19.99,
    currency: 'EUR',
    bonus: 15,
    popular: true,
  },
  {
    id: 'gold',
    name: 'Gold Pack',
    chips: 100000,
    price: 34.99,
    currency: 'EUR',
    bonus: 20,
  },
  {
    id: 'platinum',
    name: 'Platinum Pack',
    chips: 250000,
    price: 79.99,
    currency: 'EUR',
    bonus: 25,
    bestValue: true,
  },
  {
    id: 'diamond',
    name: 'Diamond Pack',
    chips: 500000,
    price: 149.99,
    currency: 'EUR',
    bonus: 30,
  },
];

export default function StorePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<ChipPackage | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handlePurchase = async (pkg: ChipPackage) => {
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    if (!selectedPackage || !user) return;

    setProcessing(true);

    try {
      // Simulate payment processing (replace with real Stripe integration)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add chips to user account
      const totalChips = selectedPackage.chips + (selectedPackage.chips * selectedPackage.bonus / 100);

      // Update user chips (in real app, this would be server-side)
      alert(`✅ Achat réussi! ${totalChips.toLocaleString()} jetons ajoutés à votre compte.`);

      setShowPaymentModal(false);
      setSelectedPackage(null);
    } catch (error) {
      alert('❌ Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setProcessing(false);
    }
  };

  const getTotalChips = (pkg: ChipPackage) => {
    return pkg.chips + (pkg.chips * pkg.bonus / 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Retour
          </Link>
          <h1 className="text-4xl font-bold text-white">💰 Boutique de Jetons</h1>
          <div className="bg-gray-800 rounded-full px-6 py-2">
            <span className="text-yellow-400 font-bold">💰 {user?.totalChips?.toLocaleString() || 0}</span>
          </div>
        </div>

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl p-8 mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            🎁 Offre Spéciale : Jusqu'à 30% de Bonus!
          </h2>
          <p className="text-gray-800 text-lg">
            Achetez des jetons maintenant et recevez des bonus exclusifs
          </p>
        </motion.div>

        {/* Payment Methods */}
        <div className="text-center mb-8">
          <p className="text-gray-400 mb-3">Paiement 100% sécurisé</p>
          <div className="flex justify-center space-x-6">
            <div className="bg-white rounded-lg px-4 py-2 text-xl font-bold">💳 VISA</div>
            <div className="bg-white rounded-lg px-4 py-2 text-xl font-bold">💳 Mastercard</div>
            <div className="bg-white rounded-lg px-4 py-2 text-xl font-bold">🅿️ PayPal</div>
            <div className="bg-white rounded-lg px-4 py-2 text-xl font-bold">🔒 Stripe</div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CHIP_PACKAGES.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Popular/Best Value Badge */}
              {(pkg.popular || pkg.bestValue) && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`${
                    pkg.bestValue ? 'bg-purple-600' : 'bg-green-600'
                  } text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg`}>
                    {pkg.bestValue ? '💎 Meilleure Offre' : '⭐ Populaire'}
                  </div>
                </div>
              )}

              <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                className={`bg-gray-800 rounded-2xl p-6 border-4 h-full flex flex-col ${
                  pkg.bestValue
                    ? 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]'
                    : pkg.popular
                    ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]'
                    : 'border-gray-700'
                }`}
              >
                {/* Package Name */}
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  {pkg.name}
                </h3>

                {/* Chips Amount */}
                <div className="bg-gray-900 rounded-xl p-6 mb-4">
                  <div className="text-center">
                    <div className="text-5xl mb-2">🪙</div>
                    <div className="text-3xl font-bold text-yellow-400 mb-2">
                      {pkg.chips.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">Jetons de base</div>
                  </div>

                  {/* Bonus */}
                  {pkg.bonus > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="mt-4 bg-gradient-to-r from-green-600 to-green-500 rounded-lg p-3"
                    >
                      <div className="text-center">
                        <div className="text-white font-bold">
                          +{pkg.bonus}% BONUS 🎁
                        </div>
                        <div className="text-green-100 text-sm">
                          +{(pkg.chips * pkg.bonus / 100).toLocaleString()} jetons
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Total */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="text-center">
                      <div className="text-gray-400 text-sm mb-1">Total</div>
                      <div className="text-2xl font-bold text-green-400">
                        {getTotalChips(pkg).toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-xs">jetons</div>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-white">
                    {pkg.price.toFixed(2)} {pkg.currency}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    {(pkg.price / getTotalChips(pkg) * 1000).toFixed(2)}€ / 1000 jetons
                  </div>
                </div>

                {/* Buy Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePurchase(pkg)}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-lg mt-auto ${
                    pkg.bestValue
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                      : pkg.popular
                      ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                      : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900'
                  } text-white`}
                >
                  💳 Acheter Maintenant
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-white font-bold mb-2">Paiement Sécurisé</h3>
            <p className="text-gray-400 text-sm">
              Cryptage SSL 256-bit et conformité PCI-DSS
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-white font-bold mb-2">Livraison Instantanée</h3>
            <p className="text-gray-400 text-sm">
              Jetons crédités immédiatement après l'achat
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="text-white font-bold mb-2">Garantie Satisfait</h3>
            <p className="text-gray-400 text-sm">
              Support client 24/7 et remboursement sous 14 jours
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            ❓ Questions Fréquentes
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-yellow-400 font-bold mb-2">
                Puis-je jouer avec de l'argent réel?
              </h3>
              <p className="text-gray-300 text-sm">
                Non, les jetons sont fictifs et servent uniquement au divertissement.
                Vous ne pouvez pas les convertir en argent réel.
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-yellow-400 font-bold mb-2">
                Quand vais-je recevoir mes jetons?
              </h3>
              <p className="text-gray-300 text-sm">
                Les jetons sont ajoutés instantanément à votre compte après confirmation du paiement.
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-yellow-400 font-bold mb-2">
                Les paiements sont-ils sécurisés?
              </h3>
              <p className="text-gray-300 text-sm">
                Oui, tous les paiements sont traités par Stripe, un leader mondial du paiement en ligne.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedPackage && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border-4 border-yellow-400"
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                💳 Confirmer l'Achat
              </h2>

              <div className="bg-gray-900 rounded-xl p-6 mb-6">
                <div className="text-center mb-4">
                  <div className="text-yellow-400 font-bold text-lg">
                    {selectedPackage.name}
                  </div>
                  <div className="text-3xl font-bold text-white mt-2">
                    {getTotalChips(selectedPackage).toLocaleString()} 🪙
                  </div>
                  <div className="text-gray-400 text-sm">
                    ({selectedPackage.chips.toLocaleString()} + {selectedPackage.bonus}% bonus)
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Prix:</span>
                    <span className="text-white font-bold">
                      {selectedPackage.price.toFixed(2)} {selectedPackage.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Méthode:</span>
                    <span className="text-white">🔒 Stripe</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={processPayment}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin mr-2">⏳</div>
                      Traitement...
                    </span>
                  ) : (
                    '✅ Confirmer le Paiement'
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPackage(null);
                  }}
                  disabled={processing}
                  className="w-full bg-gray-700 text-white py-4 rounded-xl font-bold hover:bg-gray-600 transition disabled:opacity-50"
                >
                  Annuler
                </motion.button>
              </div>

              <p className="text-gray-400 text-xs text-center mt-4">
                🔒 Paiement sécurisé par Stripe
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
