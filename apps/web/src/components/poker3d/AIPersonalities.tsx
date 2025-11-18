'use client';

import React from 'react';

export interface AIPersonality {
  id: string;
  name: string;
  avatar: string;
  style: 'tight-aggressive' | 'loose-aggressive' | 'tight-passive' | 'loose-passive' | 'maniac';
  emotion: 'neutral' | 'happy' | 'sad' | 'angry' | 'thinking' | 'shocked';
  trashTalk: string[];
  compliments: string[];
  winQuotes: string[];
  loseQuotes: string[];
  bluffFrequency: number; // 0-1
  aggression: number; // 0-1
  intelligence: number; // 0-1
  tiltFactor: number; // 0-1
}

export const AI_PERSONALITIES: AIPersonality[] = [
  {
    id: 'phil-ivey',
    name: 'Phil "The Pro" Ivey',
    avatar: '🎩',
    style: 'tight-aggressive',
    emotion: 'neutral',
    trashTalk: [
      "Je vais te lire comme un livre ouvert",
      "Tu joues comme un débutant",
      "J'ai vu ce move venir à des kilomètres",
    ],
    compliments: [
      "Joli coup",
      "Bien joué, je respecte",
      "Tu t'améliores",
    ],
    winQuotes: [
      "😎 Comme prévu",
      "🎩 Class et expertise",
      "💼 C'est mon métier",
    ],
    loseQuotes: [
      "😐 Variance...",
      "🤔 Intéressant",
      "📊 Je note ça",
    ],
    bluffFrequency: 0.3,
    aggression: 0.8,
    intelligence: 0.95,
    tiltFactor: 0.1,
  },
  {
    id: 'maniac-mike',
    name: 'Maniac Mike',
    avatar: '🤪',
    style: 'maniac',
    emotion: 'happy',
    trashTalk: [
      "ALL-IN BABY!!! 🚀",
      "YOLO!!! On joue au poker ou quoi?!",
      "J'adore le CHAOS! 💥",
      "La vie est courte, ALL-IN!",
    ],
    compliments: [
      "WOW! T'es aussi fou que moi!",
      "J'ADORE! 🔥",
      "Enfin quelqu'un qui joue!",
    ],
    winQuotes: [
      "🤪 BOOM! DANS TA FACE!",
      "💣 J'AI GAGNÉ EN BLUFFANT!",
      "🎰 JACKPOT!!!",
    ],
    loseQuotes: [
      "😅 Bof, je m'en fous!",
      "🎲 Prochain coup!",
      "🤷 C'est juste de l'argent!",
    ],
    bluffFrequency: 0.8,
    aggression: 0.95,
    intelligence: 0.4,
    tiltFactor: 0.2,
  },
  {
    id: 'fish-fred',
    name: 'Fish Fred',
    avatar: '🐟',
    style: 'loose-passive',
    emotion: 'thinking',
    trashTalk: [
      "Euh... je sais pas trop quoi faire",
      "J'ai une bonne main... je crois?",
      "Peut-être que je vais gagner?",
    ],
    compliments: [
      "Wow t'es fort!",
      "Comment tu fais ça?",
      "Apprends-moi!",
    ],
    winQuotes: [
      "😱 J'AI GAGNÉ?!",
      "🐟 Les poissons gagnent aussi!",
      "🎉 INCROYABLE!",
    ],
    loseQuotes: [
      "😢 Je comprends pas",
      "🥺 Encore perdu...",
      "😔 Normal...",
    ],
    bluffFrequency: 0.1,
    aggression: 0.3,
    intelligence: 0.3,
    tiltFactor: 0.6,
  },
  {
    id: 'ice-queen',
    name: 'Ice Queen',
    avatar: '🧊',
    style: 'tight-aggressive',
    emotion: 'neutral',
    trashTalk: [
      "Statistiquement, tu vas perdre",
      "Les émotions sont pour les faibles",
      "Je suis une machine à calculer",
    ],
    compliments: [
      "Décision correcte",
      "Pourcentage acceptable",
      "...",
    ],
    winQuotes: [
      "🧊 Comme calculé",
      "📐 Probabilités respectées",
      "💎 Optimal",
    ],
    loseQuotes: [
      "🧊 Variance à court terme",
      "📊 Dans les limites statistiques",
      "🎯 Ajustement nécessaire",
    ],
    bluffFrequency: 0.25,
    aggression: 0.7,
    intelligence: 0.9,
    tiltFactor: 0.05,
  },
  {
    id: 'gambler-gary',
    name: 'Gambler Gary',
    avatar: '🎲',
    style: 'loose-aggressive',
    emotion: 'happy',
    trashTalk: [
      "J'ADORE les risques!",
      "Pas de risk, pas de fun!",
      "On est là pour s'amuser!",
    ],
    compliments: [
      "Belle prise de risque!",
      "J'aime ton style!",
      "Ça c'est du jeu!",
    ],
    winQuotes: [
      "🎲 Les dés sont avec moi!",
      "🍀 La chance sourit aux audacieux!",
      "💰 PAYDAY!",
    ],
    loseQuotes: [
      "🎲 Pas de chance cette fois",
      "😄 On recommence!",
      "🎰 C'est le jeu!",
    ],
    bluffFrequency: 0.5,
    aggression: 0.75,
    intelligence: 0.6,
    tiltFactor: 0.4,
  },
  {
    id: 'le-boucher',
    name: 'Le Boucher',
    avatar: '🔪',
    style: 'maniac',
    emotion: 'angry',
    trashTalk: [
      "Je vais te découper! 🔪",
      "Tu vas saigner tes jetons! 🩸",
      "Bienvenue à LA BOUCHERIE!",
      "0 à 4 cartes... et 100% carnage!",
    ],
    compliments: [
      "Respect... mais je vais quand même te saigner",
      "Pas mal... pour une victime",
      "🔪 Tu mérites une mort rapide",
    ],
    winQuotes: [
      "🔪 COUPÉ EN MORCEAUX!",
      "🩸 LE SANG COULE!",
      "🥩 VIANDE HACHÉE!",
    ],
    loseQuotes: [
      "😠 GRRRR!",
      "🔪 Tu vas payer!",
      "💢 VENGEANCE!",
    ],
    bluffFrequency: 0.7,
    aggression: 0.9,
    intelligence: 0.7,
    tiltFactor: 0.8,
  },
  {
    id: 'old-school',
    name: 'Old School Sam',
    avatar: '👴',
    style: 'tight-passive',
    emotion: 'neutral',
    trashTalk: [
      "De mon temps, on jouait au VRAI poker",
      "Vous les jeunes, vous ne savez pas jouer",
      "J'ai 40 ans d'expérience",
    ],
    compliments: [
      "Hmm, pas mal pour un jeune",
      "Tu apprends vite",
      "Respect",
    ],
    winQuotes: [
      "👴 L'expérience paie",
      "📚 Leçon de l'ancien",
      "🎓 École de poker",
    ],
    loseQuotes: [
      "😤 Coup de chance",
      "🙄 Ces jeunes...",
      "😒 La variance...",
    ],
    bluffFrequency: 0.15,
    aggression: 0.4,
    intelligence: 0.75,
    tiltFactor: 0.3,
  },
  {
    id: 'lucky-lucy',
    name: 'Lucky Lucy',
    avatar: '🍀',
    style: 'loose-passive',
    emotion: 'happy',
    trashTalk: [
      "La chance est avec moi aujourd'hui! ✨",
      "Je sens que je vais gagner! 🌟",
      "Les étoiles sont alignées! 💫",
    ],
    compliments: [
      "Quelle chance tu as!",
      "Les dieux du poker t'aiment!",
      "Tu as de la veine!",
    ],
    winQuotes: [
      "🍀 JE LE SAVAIS!",
      "✨ MAGIQUE!",
      "🌈 ARC-EN-CIEL!",
    ],
    loseQuotes: [
      "😊 Pas grave, prochaine fois!",
      "🌟 Ma chance reviendra!",
      "💫 C'est temporaire!",
    ],
    bluffFrequency: 0.2,
    aggression: 0.4,
    intelligence: 0.5,
    tiltFactor: 0.2,
  },
];

// Get AI decision based on personality
export function getAIDecision(
  personality: AIPersonality,
  hand: string[],
  pot: number,
  toCall: number,
  stack: number
): 'fold' | 'call' | 'raise' | 'all-in' {
  // Simplified AI logic based on personality traits
  const random = Math.random();

  // Maniac mode - almost always aggressive
  if (personality.style === 'maniac') {
    if (random < 0.3) return 'all-in';
    if (random < 0.7) return 'raise';
    return 'call';
  }

  // Tight-aggressive - selective but aggressive when playing
  if (personality.style === 'tight-aggressive') {
    if (random < personality.bluffFrequency) return 'raise';
    if (random < 0.7) return 'call';
    return 'fold';
  }

  // Loose-aggressive - plays many hands aggressively
  if (personality.style === 'loose-aggressive') {
    if (random < 0.4) return 'raise';
    if (random < 0.8) return 'call';
    return 'fold';
  }

  // Loose-passive - calls a lot, rarely raises
  if (personality.style === 'loose-passive') {
    if (random < 0.1) return 'raise';
    if (random < 0.8) return 'call';
    return 'fold';
  }

  // Tight-passive - folds a lot
  if (random < 0.3) return 'call';
  return 'fold';
}

// Get AI trash talk
export function getAITrashTalk(personality: AIPersonality, situation: 'win' | 'lose' | 'play'): string {
  if (situation === 'win') {
    return personality.winQuotes[Math.floor(Math.random() * personality.winQuotes.length)];
  }
  if (situation === 'lose') {
    return personality.loseQuotes[Math.floor(Math.random() * personality.loseQuotes.length)];
  }
  return personality.trashTalk[Math.floor(Math.random() * personality.trashTalk.length)];
}

// Get AI emotion based on situation
export function getAIEmotion(
  personality: AIPersonality,
  situation: 'win' | 'lose' | 'thinking' | 'neutral'
): typeof personality.emotion {
  if (situation === 'win') return 'happy';
  if (situation === 'lose') {
    // Check if tilted
    if (Math.random() < personality.tiltFactor) return 'angry';
    return 'sad';
  }
  if (situation === 'thinking') return 'thinking';
  return personality.emotion;
}
