'use client';

import { useEffect, useRef } from 'react';

interface SpatialAudioProps {
  enabled: boolean;
}

// Audio manager for 3D spatial sound effects
export class AudioManager {
  private static instance: AudioManager;
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private enabled: boolean = true;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  // Play sound at 3D position
  playSound(soundId: string, position: [number, number, number] = [0, 0, 0], volume: number = 1) {
    if (!this.enabled || !this.audioContext) return;

    // For now, we'll use console logs as placeholders
    // In production, you'd load actual audio files
    console.log(`🔊 Playing ${soundId} at position [${position.join(', ')}] with volume ${volume}`);

    // Create oscillator for demo sounds (remove this in production with actual audio files)
    this.createDemoSound(soundId, volume);
  }

  // Demo sound generator (replace with actual audio loading)
  private createDemoSound(soundId: string, volume: number) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Different frequencies for different sounds
    const soundFrequencies: Record<string, number> = {
      'chip-drop': 800,
      'card-shuffle': 400,
      'card-flip': 600,
      'all-in': 1000,
      'win': 1200,
      'fold': 300,
      'call': 500,
      'raise': 700,
      'timer': 900,
    };

    oscillator.frequency.value = soundFrequencies[soundId] || 440;
    oscillator.type = soundId.includes('chip') ? 'sine' : 'square';

    gainNode.gain.setValueAtTime(volume * 0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  // Play chip sound with stacking effect
  playChipSound(count: number, position: [number, number, number]) {
    for (let i = 0; i < Math.min(count, 5); i++) {
      setTimeout(() => {
        this.playSound('chip-drop', position, 0.5);
      }, i * 50);
    }
  }

  // Play card shuffle
  playCardShuffle(position: [number, number, number]) {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playSound('card-shuffle', position, 0.3);
      }, i * 100);
    }
  }

  // Play dramatic all-in sound
  playAllIn(position: [number, number, number]) {
    this.playSound('all-in', position, 1.0);
    setTimeout(() => {
      this.playChipSound(10, position);
    }, 200);
  }

  // Play victory fanfare
  playVictory(position: [number, number, number]) {
    const notes = [1.0, 1.2, 1.5, 2.0];
    notes.forEach((mult, i) => {
      setTimeout(() => {
        this.playSound('win', position, 0.8);
      }, i * 150);
    });
  }

  // Ambient casino sounds
  playAmbience() {
    if (!this.enabled) return;
    console.log('🎵 Playing casino ambience...');
  }
}

// React hook for audio
export default function useSpatialAudio(enabled: boolean = true) {
  const audioManager = useRef<AudioManager>();

  useEffect(() => {
    audioManager.current = AudioManager.getInstance();
    audioManager.current.setEnabled(enabled);
  }, [enabled]);

  return {
    playChipSound: (count: number, position: [number, number, number] = [0, 0, 0]) =>
      audioManager.current?.playChipSound(count, position),
    playCardShuffle: (position: [number, number, number] = [0, 0, 0]) =>
      audioManager.current?.playCardShuffle(position),
    playAllIn: (position: [number, number, number] = [0, 0, 0]) =>
      audioManager.current?.playAllIn(position),
    playVictory: (position: [number, number, number] = [0, 0, 0]) =>
      audioManager.current?.playVictory(position),
    playSound: (soundId: string, position: [number, number, number] = [0, 0, 0], volume: number = 1) =>
      audioManager.current?.playSound(soundId, position, volume),
    playAmbience: () =>
      audioManager.current?.playAmbience(),
  };
}
