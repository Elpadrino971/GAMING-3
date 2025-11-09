'use client';

import Link from 'next/link';
import { Brain, TrendingUp, Video, Zap, Trophy, Users } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-poker-gold to-yellow-500 bg-clip-text text-transparent">
            PokerMind
          </h1>
          <p className="text-2xl text-gray-300 mb-8">
            Assistant IA de Poker Révolutionnaire
          </p>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            Transformez votre jeu avec un coach IA intelligent qui analyse vos décisions en temps réel,
            vous aide à progresser et vous accompagne vers l'excellence.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/play"
              className="px-8 py-4 bg-poker-gold text-gray-900 rounded-lg font-bold text-lg hover:bg-yellow-500 transition-colors"
            >
              Commencer à jouer
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 bg-gray-700 text-white rounded-lg font-bold text-lg hover:bg-gray-600 transition-colors"
            >
              Voir la démo
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Mode Coaching Léger */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-poker-gold transition-colors">
            <div className="flex items-center mb-4">
              <Brain className="w-12 h-12 text-poker-gold mr-4" />
              <h3 className="text-2xl font-bold">Coaching Léger</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Pour les débutants : conseils simples et rapides, apprentissage progressif adapté à votre style.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• Analyse de l'historique</li>
              <li>• Conseils en temps réel</li>
              <li>• Apprentissage adaptatif</li>
            </ul>
          </div>

          {/* Mode Analyse Pro */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-poker-gold transition-colors">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-12 h-12 text-poker-gold mr-4" />
              <h3 className="text-2xl font-bold">Analyse Pro</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Pour les intermédiaires : statistiques avancées, simulation GTO, recommandations personnalisées.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• VPIP, PFR, Aggression Factor</li>
              <li>• Simulation GTO</li>
              <li>• Analyse de range</li>
            </ul>
          </div>

          {/* Mode Mentor Live */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-poker-gold transition-colors">
            <div className="flex items-center mb-4">
              <Video className="w-12 h-12 text-poker-gold mr-4" />
              <h3 className="text-2xl font-bold">Mentor Live</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Premium : analyse en direct, mode vocal, replay commenté façon documentaire.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• Analyse en direct</li>
              <li>• Mode vocal</li>
              <li>• Replay commenté</li>
            </ul>
          </div>
        </div>

        {/* Game Modes */}
        <h2 className="text-4xl font-bold text-center mb-12">Modes de Jeu Innovants</h2>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Parties Live Assistées */}
          <div className="bg-gradient-to-br from-poker-green to-poker-green-dark rounded-xl p-8 border-2 border-poker-gold">
            <div className="flex items-center mb-4">
              <Users className="w-10 h-10 text-poker-gold mr-4" />
              <h3 className="text-2xl font-bold">Parties Live Assistées</h3>
            </div>
            <p className="text-gray-200 mb-4">
              Jouez avec votre assistant IA personnel qui vous conseille discrètement pendant la partie.
            </p>
            <ul className="space-y-2 text-gray-200">
              <li>✓ Conseils privés en temps réel</li>
              <li>✓ IA neutre qui commente</li>
              <li>✓ Apprentissage en jouant</li>
            </ul>
          </div>

          {/* Coach Battle */}
          <div className="bg-gradient-to-br from-poker-blue to-blue-900 rounded-xl p-8 border-2 border-poker-gold">
            <div className="flex items-center mb-4">
              <Zap className="w-10 h-10 text-poker-gold mr-4" />
              <h3 className="text-2xl font-bold">Coach Battle</h3>
            </div>
            <p className="text-gray-200 mb-4">
              Affrontement spectaculaire où les IA coaches débattent des meilleures stratégies en direct.
            </p>
            <ul className="space-y-2 text-gray-200">
              <li>✓ Débats IA en temps réel</li>
              <li>✓ Vote du public</li>
              <li>✓ Très streamable</li>
            </ul>
          </div>

          {/* Shadow Play */}
          <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl p-8 border-2 border-poker-gold">
            <div className="flex items-center mb-4">
              <Trophy className="w-10 h-10 text-poker-gold mr-4" />
              <h3 className="text-2xl font-bold">Shadow Play</h3>
            </div>
            <p className="text-gray-200 mb-4">
              Jouez virtuellement les mêmes mains qu'un pro et comparez vos décisions.
            </p>
            <ul className="space-y-2 text-gray-200">
              <li>✓ Joue les mêmes mains qu'un pro</li>
              <li>✓ Comparaison des décisions</li>
              <li>✓ Parfait pour apprendre</li>
            </ul>
          </div>

          {/* IDI Ranking */}
          <div className="bg-gradient-to-br from-orange-900 to-red-900 rounded-xl p-8 border-2 border-poker-gold">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-10 h-10 text-poker-gold mr-4" />
              <h3 className="text-2xl font-bold">Classement IDI</h3>
            </div>
            <p className="text-gray-200 mb-4">
              Indice de Décision Intelligente : classement basé sur vos décisions, pas votre chance.
            </p>
            <ul className="space-y-2 text-gray-200">
              <li>✓ Mesure la qualité de décision</li>
              <li>✓ Classement mondial</li>
              <li>✓ Progression visible</li>
            </ul>
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-12">Tarifs</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold mb-2">Gratuit</h3>
              <p className="text-4xl font-bold text-poker-gold mb-6">0€</p>
              <ul className="space-y-3 text-gray-300 text-left mb-8">
                <li>✓ Mode Coaching Léger</li>
                <li>✓ 10 analyses/mois</li>
                <li>✓ Statistiques basiques</li>
                <li>✓ Historique limité</li>
              </ul>
              <button className="w-full py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Commencer
              </button>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-br from-poker-gold to-yellow-600 rounded-xl p-8 border-2 border-yellow-400 transform scale-105">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Pro</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">9.99€<span className="text-lg">/mois</span></p>
              <ul className="space-y-3 text-gray-900 text-left mb-8">
                <li>✓ Mode Analyse Pro</li>
                <li>✓ Analyses illimitées</li>
                <li>✓ Statistiques avancées</li>
                <li>✓ Simulation GTO</li>
                <li>✓ Replay intelligent</li>
              </ul>
              <button className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                Choisir Pro
              </button>
            </div>

            {/* Premium */}
            <div className="bg-gray-800 rounded-xl p-8 border border-poker-gold">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-4xl font-bold text-poker-gold mb-6">19.99€<span className="text-lg">/mois</span></p>
              <ul className="space-y-3 text-gray-300 text-left mb-8">
                <li>✓ Mode Mentor Live</li>
                <li>✓ Tout de Pro +</li>
                <li>✓ Coaching vocal</li>
                <li>✓ Parties live assistées</li>
                <li>✓ Coach Battle</li>
                <li>✓ Shadow Play</li>
              </ul>
              <button className="w-full py-3 bg-poker-gold text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors">
                Choisir Premium
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-poker-gold to-yellow-500 rounded-xl p-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Prêt à transformer votre jeu ?
          </h2>
          <p className="text-xl text-gray-800 mb-8">
            Rejoignez des milliers de joueurs qui progressent avec PokerMind
          </p>
          <Link
            href="/signup"
            className="inline-block px-12 py-4 bg-gray-900 text-white rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors"
          >
            Créer un compte gratuit
          </Link>
        </div>
      </div>
    </main>
  );
}
