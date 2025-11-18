'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface GestureDetection {
  gesture: 'fold' | 'call' | 'raise' | 'all-in' | 'check' | 'none';
  confidence: number;
  handPosition: { x: number; y: number };
}

// Gesture Recognition Engine (simplified for demo)
export class GestureRecognitionAI {
  private static instance: GestureRecognitionAI;
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private isDetecting: boolean = false;

  private constructor() {}

  static getInstance(): GestureRecognitionAI {
    if (!GestureRecognitionAI.instance) {
      GestureRecognitionAI.instance = new GestureRecognitionAI();
    }
    return GestureRecognitionAI.instance;
  }

  async startDetection(videoElement: HTMLVideoElement): Promise<void> {
    this.video = videoElement;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.isDetecting = true;

    // Start webcam
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.srcObject = stream;
      this.detectLoop();
    } catch (error) {
      console.error('Failed to start webcam:', error);
      throw error;
    }
  }

  private detectLoop() {
    if (!this.isDetecting || !this.video || !this.canvas || !this.context) return;

    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.context.drawImage(this.video, 0, 0);

    // Simplified gesture detection (in production, use TensorFlow.js or MediaPipe)
    const detection = this.analyzeFrame();

    if (detection.gesture !== 'none') {
      window.dispatchEvent(
        new CustomEvent('gesture-detected', { detail: detection })
      );
    }

    requestAnimationFrame(() => this.detectLoop());
  }

  private analyzeFrame(): GestureDetection {
    // Simplified detection - in real app, use ML model
    const gestures = ['fold', 'call', 'raise', 'all-in', 'check', 'none'] as const;
    const randomGesture = Math.random() < 0.05 ? gestures[Math.floor(Math.random() * 5)] : 'none';

    return {
      gesture: randomGesture,
      confidence: randomGesture !== 'none' ? 70 + Math.random() * 25 : 0,
      handPosition: {
        x: 0.5 + (Math.random() - 0.5) * 0.3,
        y: 0.5 + (Math.random() - 0.5) * 0.3,
      },
    };
  }

  stopDetection() {
    this.isDetecting = false;
    if (this.video && this.video.srcObject) {
      (this.video.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
    }
  }
}

// Gesture Control Panel
export function GestureControlPanel() {
  const [enabled, setEnabled] = useState(false);
  const [lastGesture, setLastGesture] = useState<GestureDetection | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const gestureAI = GestureRecognitionAI.getInstance();

  useEffect(() => {
    const handleGesture = (event: CustomEvent<GestureDetection>) => {
      setLastGesture(event.detail);
      setTimeout(() => setLastGesture(null), 2000);
    };

    window.addEventListener('gesture-detected' as any, handleGesture);
    return () => window.removeEventListener('gesture-detected' as any, handleGesture);
  }, []);

  const toggleGesture = async () => {
    if (!enabled && videoRef.current) {
      try {
        await gestureAI.startDetection(videoRef.current);
        setEnabled(true);
      } catch (error) {
        alert('Impossible d\'accéder à la webcam');
      }
    } else {
      gestureAI.stopDetection();
      setEnabled(false);
    }
  };

  return (
    <div className="fixed left-4 top-1/3 bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 border-4 border-cyan-400 z-40 min-w-96">
      <h3 className="text-cyan-400 font-bold text-2xl mb-4">👋 Contrôles Gestuels</h3>

      {/* Webcam Feed */}
      <div className="relative mb-4 rounded-xl overflow-hidden border-2 border-cyan-400">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-48 object-cover mirror bg-gray-800"
          style={{ transform: 'scaleX(-1)' }}
        />
        {enabled && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-bold">DETECTION</span>
          </div>
        )}
      </div>

      {/* Enable/Disable Button */}
      <button
        onClick={toggleGesture}
        className={`w-full py-3 rounded-xl font-bold text-lg mb-4 transition ${
          enabled
            ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
            : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
        }`}
      >
        {enabled ? '🛑 Désactiver' : '▶️ Activer'}
      </button>

      {/* Last Gesture */}
      <AnimatePresence>
        {lastGesture && lastGesture.gesture !== 'none' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="text-4xl">
                {lastGesture.gesture === 'fold' && '🚫'}
                {lastGesture.gesture === 'call' && '💰'}
                {lastGesture.gesture === 'raise' && '🚀'}
                {lastGesture.gesture === 'all-in' && '🔥'}
                {lastGesture.gesture === 'check' && '✅'}
              </div>
              <div>
                <div className="text-white font-bold text-xl uppercase">{lastGesture.gesture}</div>
                <div className="text-green-200 text-sm">
                  Confiance: {lastGesture.confidence.toFixed(0)}%
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gesture Guide */}
      <div className="bg-cyan-950/50 rounded-xl p-4">
        <div className="text-cyan-300 font-semibold mb-3">Guide des Gestes:</div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="text-2xl">✋</div>
            <div className="text-white">Main ouverte = <span className="font-bold">FOLD</span></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl">👍</div>
            <div className="text-white">Pouce levé = <span className="font-bold">CALL</span></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl">✊</div>
            <div className="text-white">Poing fermé = <span className="font-bold">RAISE</span></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl">🤘</div>
            <div className="text-white">Rock sign = <span className="font-bold">ALL-IN</span></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl">👌</div>
            <div className="text-white">OK sign = <span className="font-bold">CHECK</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Gesture Tutorial
export function GestureTutorial({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      gesture: 'fold',
      icon: '✋',
      title: 'FOLD - Main Ouverte',
      description: 'Montrez votre main ouverte devant la caméra',
      demo: '/gestures/fold.gif',
    },
    {
      gesture: 'call',
      icon: '👍',
      title: 'CALL - Pouce Levé',
      description: 'Levez le pouce pour payer',
      demo: '/gestures/call.gif',
    },
    {
      gesture: 'raise',
      icon: '✊',
      title: 'RAISE - Poing Fermé',
      description: 'Fermez le poing pour relancer',
      demo: '/gestures/raise.gif',
    },
    {
      gesture: 'all-in',
      icon: '🤘',
      title: 'ALL-IN - Rock Sign',
      description: 'Faites le signe du rock pour tapis',
      demo: '/gestures/allin.gif',
    },
    {
      gesture: 'check',
      icon: '👌',
      title: 'CHECK - OK Sign',
      description: 'Faites OK avec vos doigts pour check',
      demo: '/gestures/check.gif',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-cyan-900 to-blue-900 rounded-3xl p-10 max-w-2xl border-4 border-cyan-400">
        <div className="text-8xl text-center mb-6">{steps[step].icon}</div>
        <h2 className="text-cyan-300 font-bold text-3xl text-center mb-3">{steps[step].title}</h2>
        <p className="text-white text-xl text-center mb-8">{steps[step].description}</p>

        {/* Progress Dots */}
        <div className="flex justify-center gap-3 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === step ? 'bg-cyan-400' : i < step ? 'bg-green-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold text-lg"
            >
              ← Précédent
            </button>
          )}
          <button
            onClick={() => {
              if (step < steps.length - 1) {
                setStep(step + 1);
              } else {
                onComplete();
              }
            }}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-4 rounded-xl font-bold text-lg"
          >
            {step < steps.length - 1 ? 'Suivant →' : 'Commencer! ✅'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Gesture Sensitivity Settings
export function GestureSensitivity() {
  const [sensitivity, setSensitivity] = useState(75);
  const [minConfidence, setMinConfidence] = useState(60);

  return (
    <div className="bg-cyan-950/50 rounded-xl p-4">
      <div className="text-cyan-300 font-semibold mb-3">⚙️ Paramètres</div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-white">Sensibilité:</span>
          <span className="text-cyan-400 font-bold">{sensitivity}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sensitivity}
          onChange={(e) => setSensitivity(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-white">Confiance minimale:</span>
          <span className="text-cyan-400 font-bold">{minConfidence}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={minConfidence}
          onChange={(e) => setMinConfidence(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
