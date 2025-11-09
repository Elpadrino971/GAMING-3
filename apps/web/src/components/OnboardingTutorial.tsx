'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check } from 'lucide-react';

interface TutorialStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    target: 'welcome',
    title: '🎰 Bienvenue sur PokerMind !',
    content: 'Je suis ton assistant IA personnel. Je vais t\'apprendre à devenir un meilleur joueur de poker.',
    position: 'bottom'
  },
  {
    target: '.coach-overlay',
    title: '🧠 Ton Coach IA',
    content: 'Ici, je vais te donner des conseils en temps réel. Chaque décision sera analysée instantanément.',
    position: 'left'
  },
  {
    target: '.idi-score',
    title: '📊 Ton IDI (Indice de Décision Intelligente)',
    content: 'Ton IDI mesure la QUALITÉ de tes décisions, pas ta chance. Un IDI de 80+ = niveau pro !',
    position: 'bottom'
  },
  {
    target: '.poker-table',
    title: '♠️ Table de Poker',
    content: 'Joue normalement. Je vais analyser chaque main et te dire si tu prends la bonne décision.',
    position: 'top'
  },
  {
    target: '.action-buttons',
    title: '🎯 Prends ta Décision',
    content: 'Après chaque action, je te dirai si c\'était optimal et comment t\'améliorer.',
    position: 'top'
  },
  {
    target: '.stats-panel',
    title: '📈 Tes Statistiques',
    content: 'VPIP, PFR, Aggression Factor... Tes stats évoluent en temps réel. Objectif : tout en vert !',
    position: 'left'
  },
  {
    target: 'finish',
    title: '🚀 C\'est Parti !',
    content: 'Tu es prêt ! Commence à jouer et laisse-moi t\'aider à progresser. Bonne chance ! 🎰',
    position: 'bottom'
  }
];

export default function OnboardingTutorial({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Calculer la position de l'élément cible
    const step = tutorialSteps[currentStep];
    if (step.target === 'welcome' || step.target === 'finish') {
      // Centrer l'overlay
      setTargetPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      });
    } else {
      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      }
    }
  }, [currentStep]);

  const handleNext = () => {
    const step = tutorialSteps[currentStep];
    if (step.action) {
      step.action();
    }

    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsVisible(false);
      if (onComplete) onComplete();
      localStorage.setItem('pokermind_tutorial_completed', 'true');
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    if (onComplete) onComplete();
    localStorage.setItem('pokermind_tutorial_completed', 'true');
  };

  if (!isVisible) return null;

  const step = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/70 z-40 pointer-events-auto" />

      {/* Spotlight sur l'élément cible */}
      {step.target !== 'welcome' && step.target !== 'finish' && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: targetPosition.x,
            top: targetPosition.y,
            transform: 'translate(-50%, -50%)',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
            background: 'transparent'
          }}
        />
      )}

      {/* Tutorial popup */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {step.title}
            </h3>
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {step.content}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-poker-gold h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentStep + 1} / {tutorialSteps.length}
            </span>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Retour
                </button>
              )}

              <button
                onClick={handleNext}
                className="px-6 py-2 bg-poker-gold text-gray-900 rounded-lg font-bold hover:bg-yellow-500 transition-colors flex items-center gap-2"
              >
                {currentStep === tutorialSteps.length - 1 ? (
                  <>
                    <Check className="w-4 h-4" />
                    Terminer
                  </>
                ) : (
                  <>
                    Suivant
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
