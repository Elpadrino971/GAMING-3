'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentaryEvent {
  type: 'action' | 'showdown' | 'winner' | 'analysis' | 'hype';
  text: string;
  timestamp: number;
}

// AI Commentator system
export class PokerCommentator {
  private static instance: PokerCommentator;

  private constructor() {}

  static getInstance(): PokerCommentator {
    if (!PokerCommentator.instance) {
      PokerCommentator.instance = new PokerCommentator();
    }
    return PokerCommentator.instance;
  }

  // Generate commentary based on action
  commentate(
    action: string,
    playerName: string,
    amount?: number,
    pot?: number,
    context?: any
  ): string {
    const comments = this.getCommentsForAction(action, playerName, amount, pot);
    return comments[Math.floor(Math.random() * comments.length)];
  }

  private getCommentsForAction(
    action: string,
    playerName: string,
    amount?: number,
    pot?: number
  ): string[] {
    switch (action) {
      case 'fold':
        return [
          `${playerName} se couche, pas assez confiant dans sa main`,
          `${playerName} abandonne ce coup`,
          `Fold de ${playerName}, décision prudente`,
          `${playerName} jette ses cartes, il attend un meilleur spot`,
        ];

      case 'call':
        return [
          `${playerName} suit pour $${amount}`,
          `Call de ${playerName}, il veut voir la suite`,
          `${playerName} reste dans le coup avec $${amount}`,
          `${playerName} paye pour voir`,
        ];

      case 'raise':
        return [
          `GROSSE RELANCE de ${playerName} à $${amount}!`,
          `${playerName} monte à $${amount}, il prend les commandes!`,
          `Raise agressif de ${playerName}!`,
          `${playerName} met la pression avec $${amount}!`,
          `BOOM! ${playerName} relance à $${amount}!`,
        ];

      case 'all-in':
        return [
          `🚨 ALL-IN DE ${playerName} POUR $${amount}!!!`,
          `TAPIS! ${playerName} risque tout son stack!`,
          `C'EST LE MOMENT DE VÉRITÉ! ${playerName} ALL-IN!`,
          `DRAMA MAXIMUM! ${playerName} pousse tout!!!`,
          `${playerName} N'A PLUS LE CHOIX - ALL-IN $${amount}!`,
        ];

      case 'check':
        return [
          `${playerName} check`,
          `Parole pour ${playerName}`,
          `${playerName} passe, il veut voir la carte gratuite`,
        ];

      case 'flop':
        return [
          `Et voici le FLOP!`,
          `Les trois premières cartes sont révélées!`,
          `FLOP sur la table!`,
          `Voyons ce que nous donne ce flop...`,
        ];

      case 'turn':
        return [
          `TURN!`,
          `La quatrième carte arrive!`,
          `Et le turn est...`,
          `Carte importante!`,
        ];

      case 'river':
        return [
          `RIVER! La dernière carte!`,
          `C'est le moment de vérité!`,
          `La river va tout décider!`,
          `Cinquième et dernière carte!`,
        ];

      case 'showdown':
        return [
          `C'EST L'HEURE DU SHOWDOWN!`,
          `Les cartes vont parler!`,
          `Qui a la meilleure main?`,
          `MOMENT DE VÉRITÉ!`,
        ];

      case 'win':
        return [
          `${playerName} REMPORTE LE POT DE $${pot}!`,
          `VICTOIRE DE ${playerName}!`,
          `${playerName} prend tout le pot!`,
          `C'EST ${playerName} QUI L'EMPORTE!`,
          `GG ${playerName}! $${pot} dans la poche!`,
        ];

      case 'royal-flush':
        return [
          `🎰 ROYAL FLUSH!!! INCROYABLE!!!`,
          `LA MAIN ULTIME! ROYAL FLUSH!`,
          `VOUS PLAISANTEZ?! ROYAL FLUSH!!!`,
          `IMPOSSIBLE! C'EST UNE ROYAL FLUSH!`,
        ];

      case 'straight-flush':
        return [
          `STRAIGHT FLUSH! Main extraordinaire!`,
          `QUINTE FLUSH! Quel coup!`,
          `C'EST MAGNIFIQUE! STRAIGHT FLUSH!`,
        ];

      case 'four-kind':
        return [
          `CARRÉ! Main monster!`,
          `FOUR OF A KIND! Énorme!`,
          `CARRÉ! Difficile à battre!`,
        ];

      default:
        return [`Action de ${playerName}`];
    }
  }

  // Analysis commentary
  analyzeHand(playerName: string, hand: string[], board: string[]): string {
    const analyses = [
      `${playerName} a une main intéressante ici`,
      `Regardez la position de ${playerName}, c'est crucial`,
      `${playerName} doit être prudent avec cette board`,
      `Belle opportunité pour ${playerName}`,
      `${playerName} a du potentiel avec ces cartes`,
    ];
    return analyses[Math.floor(Math.random() * analyses.length)];
  }

  // Hype commentary
  buildHype(situation: 'tense' | 'exciting' | 'dramatic'): string {
    if (situation === 'tense') {
      return [
        `La tension est palpable!`,
        `Atmosphere électrique!`,
        `Tout peut arriver maintenant!`,
        `C'est serré!`,
      ][Math.floor(Math.random() * 4)];
    }

    if (situation === 'exciting') {
      return [
        `QUEL MATCH!`,
        `C'EST INCROYABLE!`,
        `ON ADORE ÇA!`,
        `DU GRAND SPECTACLE!`,
      ][Math.floor(Math.random() * 4)];
    }

    return [
      `C'EST LE MOMENT!`,
      `DRAMA MAXIMUM!`,
      `HISTORIQUE!`,
      `LÉGENDAIRE!`,
    ][Math.floor(Math.random() * 4)];
  }
}

// Commentary Display Component
export function CommentaryDisplay() {
  const [commentary, setCommentary] = useState<CommentaryEvent | null>(null);
  const [history, setHistory] = useState<CommentaryEvent[]>([]);

  useEffect(() => {
    // Listen for commentary events
    const handleCommentary = (event: CustomEvent<CommentaryEvent>) => {
      setCommentary(event.detail);
      setHistory((prev) => [...prev.slice(-4), event.detail]);

      // Auto-hide after 5 seconds
      setTimeout(() => {
        setCommentary(null);
      }, 5000);
    };

    window.addEventListener('poker-commentary' as any, handleCommentary);
    return () => window.removeEventListener('poker-commentary' as any, handleCommentary);
  }, []);

  return (
    <>
      {/* Main Commentary Banner */}
      <AnimatePresence>
        {commentary && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-32 left-1/2 transform -translate-x-1/2 z-40 max-w-4xl"
          >
            <div
              className={`rounded-xl p-6 shadow-2xl border-4 ${
                commentary.type === 'hype'
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 border-yellow-400'
                  : commentary.type === 'winner'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 border-green-400'
                  : 'bg-gray-900/95 backdrop-blur-sm border-blue-400'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">
                  {commentary.type === 'hype' && '🔥'}
                  {commentary.type === 'winner' && '🏆'}
                  {commentary.type === 'action' && '🎯'}
                  {commentary.type === 'showdown' && '🃏'}
                  {commentary.type === 'analysis' && '🤔'}
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-2xl">{commentary.text}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Commentary History (bottom corner) */}
      <div className="fixed bottom-32 right-4 z-30 w-80 space-y-2">
        {history.slice(-3).map((comment, i) => (
          <motion.div
            key={comment.timestamp}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 0.6, x: 0 }}
            className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700"
          >
            <div className="text-gray-300 text-sm">{comment.text}</div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

// Hook to trigger commentary
export function useCommentator() {
  const commentator = PokerCommentator.getInstance();

  const comment = (
    type: CommentaryEvent['type'],
    action: string,
    playerName: string,
    amount?: number,
    pot?: number
  ) => {
    const text = commentator.commentate(action, playerName, amount, pot);
    const event: CommentaryEvent = {
      type,
      text,
      timestamp: Date.now(),
    };

    window.dispatchEvent(new CustomEvent('poker-commentary', { detail: event }));
  };

  return { comment };
}

// Voice synthesis (Web Speech API)
export function speakCommentary(text: string, voice: 'male' | 'female' = 'male') {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.1; // Slightly faster
    utterance.pitch = voice === 'male' ? 0.9 : 1.1;
    utterance.volume = 0.8;

    window.speechSynthesis.speak(utterance);
  }
}
