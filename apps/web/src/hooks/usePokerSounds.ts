'use client';

import { useCallback, useRef } from 'react';

// Using Web Audio API to generate simple sound effects
// This avoids needing external audio files

export function usePokerSounds() {
  const audioContext = useRef<AudioContext | null>(null);

  // Initialize audio context on first use
  const getAudioContext = useCallback(() => {
    if (!audioContext.current && typeof window !== 'undefined') {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext.current;
  }, []);

  // Play a beep sound with custom frequency and duration
  const playBeep = useCallback((frequency: number, duration: number, volume: number = 0.3) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [getAudioContext]);

  // Card dealing sound (quick low beep)
  const playCardDeal = useCallback(() => {
    playBeep(200, 0.1, 0.2);
  }, [playBeep]);

  // Card flip sound (mid beep)
  const playCardFlip = useCallback(() => {
    playBeep(300, 0.15, 0.25);
  }, [playBeep]);

  // Chip stack sound (multiple quick beeps)
  const playChipSound = useCallback(() => {
    playBeep(400, 0.08, 0.2);
    setTimeout(() => playBeep(450, 0.08, 0.2), 50);
    setTimeout(() => playBeep(500, 0.08, 0.2), 100);
  }, [playBeep]);

  // Fold action sound (descending tone)
  const playFoldSound = useCallback(() => {
    playBeep(400, 0.2, 0.2);
    setTimeout(() => playBeep(300, 0.2, 0.2), 100);
  }, [playBeep]);

  // Call/Check action sound (single clean beep)
  const playCallSound = useCallback(() => {
    playBeep(500, 0.15, 0.25);
  }, [playBeep]);

  // Raise action sound (ascending tones)
  const playRaiseSound = useCallback(() => {
    playBeep(400, 0.1, 0.2);
    setTimeout(() => playBeep(500, 0.1, 0.2), 80);
    setTimeout(() => playBeep(600, 0.15, 0.25), 160);
  }, [playBeep]);

  // Winner sound (triumphant ascending sequence)
  const playWinnerSound = useCallback(() => {
    playBeep(523, 0.15, 0.3); // C
    setTimeout(() => playBeep(659, 0.15, 0.3), 100); // E
    setTimeout(() => playBeep(784, 0.15, 0.3), 200); // G
    setTimeout(() => playBeep(1047, 0.3, 0.35), 300); // C (higher octave)
  }, [playBeep]);

  // Button click sound
  const playClickSound = useCallback(() => {
    playBeep(800, 0.05, 0.15);
  }, [playBeep]);

  // Error/warning sound
  const playErrorSound = useCallback(() => {
    playBeep(200, 0.1, 0.3);
    setTimeout(() => playBeep(150, 0.2, 0.3), 100);
  }, [playBeep]);

  // Match found sound (celebration)
  const playMatchFoundSound = useCallback(() => {
    playBeep(600, 0.1, 0.25);
    setTimeout(() => playBeep(700, 0.1, 0.25), 100);
    setTimeout(() => playBeep(800, 0.2, 0.3), 200);
  }, [playBeep]);

  return {
    playCardDeal,
    playCardFlip,
    playChipSound,
    playFoldSound,
    playCallSound,
    playRaiseSound,
    playWinnerSound,
    playClickSound,
    playErrorSound,
    playMatchFoundSound,
  };
}
