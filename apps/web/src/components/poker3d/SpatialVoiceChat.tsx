'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface VoicePlayer {
  id: string;
  name: string;
  position: [number, number, number];
  speaking: boolean;
  volume: number;
  muted: boolean;
}

// Spatial Audio Manager for 3D voice
export class SpatialVoiceManager {
  private static instance: SpatialVoiceManager;
  private audioContext: AudioContext | null = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private panners: Map<string, PannerNode> = new Map();
  private listenerPosition: [number, number, number] = [0, 0, 0];

  private constructor() {
    this.initAudioContext();
  }

  static getInstance(): SpatialVoiceManager {
    if (!SpatialVoiceManager.instance) {
      SpatialVoiceManager.instance = new SpatialVoiceManager();
    }
    return SpatialVoiceManager.instance;
  }

  private initAudioContext() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Create spatial audio for player
  addPlayer(playerId: string, position: [number, number, number], stream: MediaStream) {
    if (!this.audioContext) return;

    const source = this.audioContext.createMediaStreamSource(stream);
    const panner = this.audioContext.createPanner();

    // Configure spatial audio
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 10;
    panner.rolloffFactor = 1;
    panner.coneInnerAngle = 360;
    panner.coneOuterAngle = 0;
    panner.coneOuterGain = 0;

    // Set position
    panner.positionX.setValueAtTime(position[0], this.audioContext.currentTime);
    panner.positionY.setValueAtTime(position[1], this.audioContext.currentTime);
    panner.positionZ.setValueAtTime(position[2], this.audioContext.currentTime);

    // Connect: source -> panner -> destination
    source.connect(panner);
    panner.connect(this.audioContext.destination);

    this.panners.set(playerId, panner);
  }

  // Update player position
  updatePlayerPosition(playerId: string, position: [number, number, number]) {
    if (!this.audioContext) return;

    const panner = this.panners.get(playerId);
    if (panner) {
      panner.positionX.setValueAtTime(position[0], this.audioContext.currentTime);
      panner.positionY.setValueAtTime(position[1], this.audioContext.currentTime);
      panner.positionZ.setValueAtTime(position[2], this.audioContext.currentTime);
    }
  }

  // Update listener (camera) position
  updateListenerPosition(position: [number, number, number]) {
    if (!this.audioContext || !this.audioContext.listener) return;

    this.listenerPosition = position;
    this.audioContext.listener.positionX.setValueAtTime(position[0], this.audioContext.currentTime);
    this.audioContext.listener.positionY.setValueAtTime(position[1], this.audioContext.currentTime);
    this.audioContext.listener.positionZ.setValueAtTime(position[2], this.audioContext.currentTime);
  }

  removePlayer(playerId: string) {
    const panner = this.panners.get(playerId);
    if (panner) {
      panner.disconnect();
      this.panners.delete(playerId);
    }
  }
}

// Voice Chat Control Panel
export function VoiceChatPanel() {
  const [enabled, setEnabled] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [pushToTalk, setPushToTalk] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const voiceManager = SpatialVoiceManager.getInstance();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (pushToTalk && e.key === 'v') {
        setSpeaking(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (pushToTalk && e.key === 'v') {
        setSpeaking(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pushToTalk]);

  const toggleVoice = () => {
    setEnabled(!enabled);
  };

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 border-2 border-green-400 z-30 min-w-96">
      <h3 className="text-green-400 font-bold text-xl mb-4">🎙️ Voice Chat 3D</h3>

      {/* Main Controls */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={toggleVoice}
          className={`flex-1 py-3 rounded-lg font-bold transition ${
            enabled
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {enabled ? '✅ Activé' : '🔇 Désactivé'}
        </button>

        <button
          onClick={() => setMuted(!muted)}
          disabled={!enabled}
          className={`px-6 py-3 rounded-lg font-bold transition ${
            muted
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } ${!enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {muted ? '🔇' : '🎤'}
        </button>
      </div>

      {/* Volume Control */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-300">Volume:</span>
          <span className="text-white font-bold">{volume}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full"
          disabled={!enabled}
        />
      </div>

      {/* Push to Talk */}
      <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3 mb-4">
        <div>
          <div className="text-white font-semibold text-sm">Push-to-Talk</div>
          <div className="text-gray-400 text-xs">Maintenir 'V' pour parler</div>
        </div>
        <button
          onClick={() => setPushToTalk(!pushToTalk)}
          disabled={!enabled}
          className={`w-14 h-8 rounded-full transition ${
            pushToTalk ? 'bg-green-500' : 'bg-gray-600'
          } ${!enabled ? 'opacity-50' : ''}`}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full transition transform ${
              pushToTalk ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Speaking Indicator */}
      {enabled && speaking && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-3 flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-2 h-8 bg-white rounded-full animate-pulse" />
            <div className="w-2 h-10 bg-white rounded-full animate-pulse animation-delay-100" />
            <div className="w-2 h-6 bg-white rounded-full animate-pulse animation-delay-200" />
            <div className="w-2 h-12 bg-white rounded-full animate-pulse animation-delay-300" />
          </div>
          <div className="text-white font-bold">Vous parlez...</div>
        </div>
      )}

      {/* Spatial Info */}
      <div className="bg-green-900/30 border border-green-500 rounded-lg p-3">
        <div className="text-green-400 text-xs font-semibold mb-1">Audio Spatial 3D Activé</div>
        <div className="text-green-300 text-xs">
          Le son varie en fonction de la position des joueurs autour de la table
        </div>
      </div>
    </div>
  );
}

// Player Voice Indicator (shown above avatar)
export function PlayerVoiceIndicator({
  player,
  position,
}: {
  player: VoicePlayer;
  position: [number, number, number];
}) {
  return (
    <group position={[position[0], position[1] + 2, position[2]]}>
      {player.speaking && (
        <>
          {/* Speaking waves */}
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial
              color="#22c55e"
              transparent
              opacity={0.3}
              wireframe
            />
          </mesh>

          <mesh>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial
              color="#22c55e"
              transparent
              opacity={0.2}
              wireframe
            />
          </mesh>

          {/* Microphone icon */}
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#22c55e"
              emissiveIntensity={1}
            />
          </mesh>
        </>
      )}

      {player.muted && (
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={1}
          />
        </mesh>
      )}
    </group>
  );
}

// Voice Chat Player List
export function VoicePlayerList({ players }: { players: VoicePlayer[] }) {
  return (
    <div className="fixed right-4 bottom-40 bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 border-2 border-green-400 z-30 min-w-64">
      <div className="text-green-400 font-bold mb-3">👥 Joueurs ({players.length})</div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {players.map((player) => (
          <div
            key={player.id}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              player.speaking
                ? 'bg-green-900/50 border border-green-500'
                : 'bg-gray-800'
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                {player.name[0]}
              </div>
              {player.speaking && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
              )}
              {player.muted && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full">
                  <div className="text-white text-xs">🔇</div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-white text-sm font-semibold">{player.name}</div>
              <div className="text-gray-400 text-xs">
                {player.speaking ? '🎤 Parle' : player.muted ? 'Muet' : 'En écoute'}
              </div>
            </div>
            {!player.muted && (
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full ${
                      i < Math.floor(player.volume / 20)
                        ? 'bg-green-500 h-4'
                        : 'bg-gray-600 h-2'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Quick Voice Settings
export function QuickVoiceSettings() {
  const [inputDevice, setInputDevice] = useState<string>('');
  const [outputDevice, setOutputDevice] = useState<string>('');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceList) => {
      setDevices(deviceList);
    });
  }, []);

  return (
    <div className="space-y-3">
      {/* Input Device */}
      <div>
        <div className="text-white text-sm font-semibold mb-1">Microphone:</div>
        <select
          value={inputDevice}
          onChange={(e) => setInputDevice(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-600"
        >
          <option value="">Défaut</option>
          {devices
            .filter((d) => d.kind === 'audioinput')
            .map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || 'Microphone'}
              </option>
            ))}
        </select>
      </div>

      {/* Output Device */}
      <div>
        <div className="text-white text-sm font-semibold mb-1">Sortie Audio:</div>
        <select
          value={outputDevice}
          onChange={(e) => setOutputDevice(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-600"
        >
          <option value="">Défaut</option>
          {devices
            .filter((d) => d.kind === 'audiooutput')
            .map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || 'Haut-parleur'}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
