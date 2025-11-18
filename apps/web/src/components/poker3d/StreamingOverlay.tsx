'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface StreamConfig {
  platform: 'twitch' | 'youtube' | 'facebook' | 'custom';
  streamKey: string;
  serverUrl: string;
  bitrate: number;
  resolution: '720p' | '1080p' | '1440p' | '4K';
  fps: 30 | 60;
}

export interface StreamOverlay {
  id: string;
  type: 'webcam' | 'chat' | 'alerts' | 'stats' | 'timer' | 'logo' | 'socials';
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible: boolean;
  style?: React.CSSProperties;
}

// Streaming Manager
export class StreamingManager {
  private static instance: StreamingManager;
  private mediaRecorder: MediaRecorder | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private stream: MediaStream | null = null;

  private constructor() {}

  static getInstance(): StreamingManager {
    if (!StreamingManager.instance) {
      StreamingManager.instance = new StreamingManager();
    }
    return StreamingManager.instance;
  }

  async startStream(config: StreamConfig): Promise<void> {
    try {
      // Get display media (screen capture)
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: this.getResolution(config.resolution).width,
          height: this.getResolution(config.resolution).height,
          frameRate: config.fps,
        },
        audio: true,
      });

      // Get webcam
      const webcamStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Combine streams
      this.stream = new MediaStream([
        ...displayStream.getVideoTracks(),
        ...webcamStream.getAudioTracks(),
      ]);

      // Setup MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: config.bitrate,
      });

      console.log('🎥 Stream started!', config);
    } catch (error) {
      console.error('Failed to start stream:', error);
      throw error;
    }
  }

  stopStream(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  private getResolution(res: string): { width: number; height: number } {
    switch (res) {
      case '720p':
        return { width: 1280, height: 720 };
      case '1080p':
        return { width: 1920, height: 1080 };
      case '1440p':
        return { width: 2560, height: 1440 };
      case '4K':
        return { width: 3840, height: 2160 };
      default:
        return { width: 1920, height: 1080 };
    }
  }
}

// Stream Control Panel
export function StreamControlPanel() {
  const [streaming, setStreaming] = useState(false);
  const [platform, setPlatform] = useState<'twitch' | 'youtube' | 'facebook'>('twitch');
  const [viewers, setViewers] = useState(0);
  const [streamTime, setStreamTime] = useState(0);
  const streamManager = StreamingManager.getInstance();

  useEffect(() => {
    if (streaming) {
      const interval = setInterval(() => {
        setStreamTime((prev) => prev + 1);
        setViewers((prev) => prev + Math.floor(Math.random() * 3 - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [streaming]);

  const toggleStream = async () => {
    if (!streaming) {
      try {
        await streamManager.startStream({
          platform,
          streamKey: 'demo-key',
          serverUrl: 'rtmp://live.twitch.tv/app',
          bitrate: 6000000,
          resolution: '1080p',
          fps: 60,
        });
        setStreaming(true);
      } catch (error) {
        alert('Impossible de démarrer le stream');
      }
    } else {
      streamManager.stopStream();
      setStreaming(false);
      setStreamTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-4 left-4 bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 border-2 border-purple-400 z-40 min-w-80">
      <h3 className="text-purple-400 font-bold text-xl mb-4">🎥 Stream Control</h3>

      {/* Platform Selector */}
      <div className="mb-4">
        <div className="text-white text-sm font-semibold mb-2">Plateforme:</div>
        <div className="flex gap-2">
          {(['twitch', 'youtube', 'facebook'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              disabled={streaming}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                platform === p
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } ${streaming ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {p === 'twitch' && '🟣 Twitch'}
              {p === 'youtube' && '🔴 YouTube'}
              {p === 'facebook' && '🔵 Facebook'}
            </button>
          ))}
        </div>
      </div>

      {/* Stream Stats */}
      {streaming && (
        <div className="bg-gradient-to-r from-red-900 to-pink-900 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <div className="text-white font-bold">EN DIRECT</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-red-300 text-xs">Spectateurs</div>
              <div className="text-white text-2xl font-bold">{viewers}</div>
            </div>
            <div>
              <div className="text-red-300 text-xs">Durée</div>
              <div className="text-white text-xl font-bold">{formatTime(streamTime)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Start/Stop Button */}
      <button
        onClick={toggleStream}
        className={`w-full py-4 rounded-xl font-bold text-lg transition transform hover:scale-105 ${
          streaming
            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
        }`}
      >
        {streaming ? '🛑 Arrêter le Stream' : '▶️ Démarrer le Stream'}
      </button>
    </div>
  );
}

// Webcam Overlay
export function WebcamOverlay({ position, size }: { position: { x: number; y: number }; size: { width: number; height: number } }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: 30,
      }}
      className="rounded-xl overflow-hidden border-4 border-purple-400 shadow-2xl"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover mirror"
        style={{ transform: 'scaleX(-1)' }}
      />
      <div className="absolute bottom-2 left-2 bg-black/70 px-3 py-1 rounded-full">
        <div className="text-white text-sm font-bold">📹 Vous</div>
      </div>
    </motion.div>
  );
}

// Chat Overlay
export function ChatOverlay() {
  const [messages, setMessages] = useState<{ user: string; text: string; color: string }[]>([
    { user: 'PokerKing42', text: 'Nice hand! 🔥', color: '#3b82f6' },
    { user: 'BluffMaster', text: 'GG!', color: '#22c55e' },
    { user: 'FishyPlayer', text: 'How do you always win?', color: '#f59e0b' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newMessages = [
        { user: 'Viewer' + Math.floor(Math.random() * 100), text: 'Amazing play!', color: '#8b5cf6' },
        { user: 'Fan' + Math.floor(Math.random() * 100), text: 'All-in! 🚀', color: '#ef4444' },
        { user: 'Noob' + Math.floor(Math.random() * 100), text: 'How to play poker?', color: '#06b6d4' },
      ];
      setMessages((prev) => [...prev.slice(-5), newMessages[Math.floor(Math.random() * newMessages.length)]]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed right-4 bottom-20 w-80 bg-gray-900/95 backdrop-blur-sm rounded-xl border-2 border-purple-400 z-30">
      <div className="bg-purple-900 px-4 py-3 rounded-t-xl border-b-2 border-purple-400">
        <div className="text-white font-bold">💬 Chat en Direct</div>
      </div>
      <div className="p-4 space-y-2 h-80 overflow-y-auto">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-lg p-2"
          >
            <div className="font-bold text-sm" style={{ color: msg.color }}>
              {msg.user}
            </div>
            <div className="text-white text-sm">{msg.text}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Alert Overlay (donations, follows, subs)
export function AlertOverlay() {
  const [alert, setAlert] = useState<{ type: string; user: string; amount?: number } | null>(null);

  useEffect(() => {
    // Simulate random alerts
    const interval = setInterval(() => {
      const alerts = [
        { type: 'follow', user: 'NewViewer' + Math.floor(Math.random() * 100) },
        { type: 'subscribe', user: 'BigFan' + Math.floor(Math.random() * 100) },
        { type: 'donation', user: 'Supporter' + Math.floor(Math.random() * 100), amount: Math.floor(Math.random() * 50) + 5 },
      ];
      setAlert(alerts[Math.floor(Math.random() * alerts.length)]);
      setTimeout(() => setAlert(null), 5000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: -100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: -100 }}
          className="fixed top-1/3 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 border-4 border-white shadow-2xl min-w-96">
            <div className="text-6xl text-center mb-4">
              {alert.type === 'follow' && '👋'}
              {alert.type === 'subscribe' && '⭐'}
              {alert.type === 'donation' && '💰'}
            </div>
            <div className="text-white text-3xl font-bold text-center mb-2">
              {alert.type === 'follow' && 'Nouveau Follower!'}
              {alert.type === 'subscribe' && 'Nouvel Abonné!'}
              {alert.type === 'donation' && `Don de $${alert.amount}!`}
            </div>
            <div className="text-white text-2xl text-center">{alert.user}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Stats Overlay
export function StatsOverlay({ stats }: { stats: { handsPlayed: number; winRate: number; profit: number } }) {
  return (
    <div className="fixed bottom-4 left-4 bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 border-2 border-blue-400 z-30">
      <div className="text-blue-400 font-bold mb-3">📊 Session Stats</div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-300 text-sm">Mains:</span>
          <span className="text-white font-bold">{stats.handsPlayed}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300 text-sm">Win Rate:</span>
          <span className="text-green-400 font-bold">{stats.winRate.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300 text-sm">Profit:</span>
          <span className={`font-bold ${stats.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.profit >= 0 ? '+' : ''}{stats.profit}$
          </span>
        </div>
      </div>
    </div>
  );
}

// Logo Overlay
export function LogoOverlay() {
  return (
    <div className="fixed top-4 right-4 z-30">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 border-2 border-white shadow-xl">
        <div className="text-white font-bold text-2xl">🎰 PokerMind</div>
        <div className="text-purple-200 text-sm">Live Stream</div>
      </div>
    </div>
  );
}

// Social Media Overlay
export function SocialMediaOverlay() {
  const socials = [
    { icon: '🐦', name: 'Twitter', handle: '@PokerMind' },
    { icon: '📷', name: 'Instagram', handle: '@pokermind' },
    { icon: '💬', name: 'Discord', handle: 'discord.gg/pokermind' },
  ];

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 border-2 border-pink-400 z-30">
      <div className="text-pink-400 font-bold mb-3">🌐 Suivez-moi</div>
      <div className="space-y-2">
        {socials.map((social, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="text-2xl">{social.icon}</div>
            <div>
              <div className="text-white text-sm font-semibold">{social.name}</div>
              <div className="text-gray-400 text-xs">{social.handle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Timer Overlay
export function TimerOverlay({ targetTime }: { targetTime: Date }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = targetTime.getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-red-900 to-orange-900 rounded-2xl p-8 border-4 border-yellow-400 shadow-2xl z-30">
      <div className="text-yellow-400 text-xl font-bold text-center mb-2">⏰ Prochain Tournoi</div>
      <div className="text-white text-6xl font-bold text-center font-mono">{timeLeft}</div>
    </div>
  );
}

// Stream Transition (BRB, Starting Soon, etc.)
export function StreamTransition({ type }: { type: 'starting' | 'brb' | 'ending' }) {
  const configs = {
    starting: {
      title: '🎮 STREAM DÉMARRE BIENTÔT',
      subtitle: 'Préparez vos jetons!',
      gradient: 'from-purple-600 to-pink-600',
    },
    brb: {
      title: '⏸️ DE RETOUR BIENTÔT',
      subtitle: 'Pause rapide...',
      gradient: 'from-blue-600 to-cyan-600',
    },
    ending: {
      title: '👋 MERCI D\'AVOIR REGARDÉ!',
      subtitle: 'À bientôt!',
      gradient: 'from-green-600 to-emerald-600',
    },
  };

  const config = configs[type];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 z-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className={`bg-gradient-to-r ${config.gradient} rounded-3xl p-16 border-8 border-white shadow-2xl`}
        >
          <div className="text-white text-7xl font-bold mb-4">{config.title}</div>
          <div className="text-white text-3xl">{config.subtitle}</div>
        </motion.div>
      </div>
    </div>
  );
}
