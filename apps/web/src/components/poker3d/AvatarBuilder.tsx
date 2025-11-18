'use client';

import React, { useState } from 'react';
import * as THREE from 'three';

export interface AvatarConfig {
  skinTone: string;
  hairStyle: 'bald' | 'short' | 'long' | 'mohawk' | 'afro';
  hairColor: string;
  bodyType: 'slim' | 'average' | 'muscular' | 'heavy';
  outfit: 'casual' | 'suit' | 'hoodie' | 'tshirt' | 'dress';
  outfitColor: string;
  accessory: 'none' | 'glasses' | 'sunglasses' | 'hat' | 'headphones';
  emotion: 'neutral' | 'happy' | 'serious' | 'confident' | 'intimidating';
}

export const DEFAULT_AVATAR: AvatarConfig = {
  skinTone: '#ffdbac',
  hairStyle: 'short',
  hairColor: '#4a3728',
  bodyType: 'average',
  outfit: 'casual',
  outfitColor: '#3b82f6',
  accessory: 'none',
  emotion: 'neutral',
};

// Custom Avatar 3D Model
export function CustomAvatar3D({ config, position }: { config: AvatarConfig; position: [number, number, number] }) {
  const bodyScale: Record<string, [number, number, number]> = {
    slim: [0.8, 1, 0.8],
    average: [1, 1, 1],
    muscular: [1.2, 1.1, 1.2],
    heavy: [1.4, 1, 1.4],
  };

  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 0, 0]} scale={bodyScale[config.bodyType]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.7, 16]} />
        <meshStandardMaterial color={config.outfitColor} roughness={0.6} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={config.skinTone} roughness={0.7} />
      </mesh>

      {/* Hair */}
      {config.hairStyle !== 'bald' && (
        <group position={[0, 0.55, 0]}>
          {config.hairStyle === 'short' && (
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.26, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={config.hairColor} />
            </mesh>
          )}
          {config.hairStyle === 'long' && (
            <>
              <mesh position={[0, 0.1, 0]}>
                <sphereGeometry args={[0.27, 16, 16]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
              <mesh position={[0, -0.2, 0.15]}>
                <boxGeometry args={[0.4, 0.5, 0.1]} />
                <meshStandardMaterial color={config.hairColor} />
              </mesh>
            </>
          )}
          {config.hairStyle === 'mohawk' && (
            <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.1, 0.4, 0.3]} />
              <meshStandardMaterial color={config.hairColor} />
            </mesh>
          )}
          {config.hairStyle === 'afro' && (
            <mesh position={[0, 0.2, 0]}>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshStandardMaterial color={config.hairColor} />
            </mesh>
          )}
        </group>
      )}

      {/* Accessories */}
      {config.accessory === 'glasses' && (
        <group position={[0, 0.55, 0.2]}>
          <mesh position={[-0.12, 0, 0]}>
            <torusGeometry args={[0.07, 0.01, 8, 16]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
          <mesh position={[0.12, 0, 0]}>
            <torusGeometry args={[0.07, 0.01, 8, 16]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 0.01, 0.01]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        </group>
      )}

      {config.accessory === 'sunglasses' && (
        <group position={[0, 0.55, 0.22]}>
          <mesh position={[-0.12, 0, 0]}>
            <boxGeometry args={[0.12, 0.08, 0.02]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0.12, 0, 0]}>
            <boxGeometry args={[0.12, 0.08, 0.02]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>
      )}

      {config.accessory === 'hat' && (
        <group position={[0, 0.8, 0]}>
          <mesh>
            <cylinderGeometry args={[0.28, 0.28, 0.15, 16]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.02, 16]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        </group>
      )}

      {config.accessory === 'headphones' && (
        <group position={[0, 0.65, 0]}>
          <mesh position={[-0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.1, 0.03, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          <mesh position={[0.25, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <torusGeometry args={[0.1, 0.03, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.25, 0.02, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </group>
      )}

      {/* Arms */}
      <mesh position={[-0.35, 0.1, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
        <meshStandardMaterial color={config.skinTone} />
      </mesh>
      <mesh position={[0.35, 0.1, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
        <meshStandardMaterial color={config.skinTone} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.12, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
        <meshStandardMaterial color={config.outfitColor} />
      </mesh>
      <mesh position={[0.12, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
        <meshStandardMaterial color={config.outfitColor} />
      </mesh>
    </group>
  );
}

// Avatar Builder UI
export function AvatarBuilderUI({ onSave }: { onSave: (config: AvatarConfig) => void }) {
  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_AVATAR);

  const skinTones = [
    { name: 'Light', value: '#ffdbac' },
    { name: 'Medium', value: '#daa471' },
    { name: 'Tan', value: '#c68642' },
    { name: 'Dark', value: '#8d5524' },
    { name: 'Deep', value: '#4a2511' },
  ];

  const hairColors = [
    { name: 'Black', value: '#1a1a1a' },
    { name: 'Brown', value: '#4a3728' },
    { name: 'Blonde', value: '#f5d76e' },
    { name: 'Red', value: '#a0410d' },
    { name: 'Gray', value: '#808080' },
    { name: 'White', value: '#f0f0f0' },
    { name: 'Blue', value: '#0066ff' },
    { name: 'Pink', value: '#ff69b4' },
    { name: 'Green', value: '#00ff00' },
  ];

  const outfitColors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Black', value: '#1f2937' },
    { name: 'White', value: '#f3f4f6' },
  ];

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 max-w-2xl border-2 border-yellow-400">
      <h2 className="text-3xl font-bold text-yellow-400 mb-6">👤 Avatar Builder</h2>

      {/* Skin Tone */}
      <div className="mb-6">
        <label className="text-white font-bold mb-2 block">Skin Tone</label>
        <div className="flex gap-2 flex-wrap">
          {skinTones.map((tone) => (
            <button
              key={tone.value}
              onClick={() => setConfig({ ...config, skinTone: tone.value })}
              className={`w-12 h-12 rounded-full border-4 transition ${
                config.skinTone === tone.value ? 'border-yellow-400 scale-110' : 'border-gray-600'
              }`}
              style={{ backgroundColor: tone.value }}
              title={tone.name}
            />
          ))}
        </div>
      </div>

      {/* Hair Style */}
      <div className="mb-6">
        <label className="text-white font-bold mb-2 block">Hair Style</label>
        <div className="grid grid-cols-5 gap-2">
          {(['bald', 'short', 'long', 'mohawk', 'afro'] as const).map((style) => (
            <button
              key={style}
              onClick={() => setConfig({ ...config, hairStyle: style })}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                config.hairStyle === style
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Hair Color */}
      {config.hairStyle !== 'bald' && (
        <div className="mb-6">
          <label className="text-white font-bold mb-2 block">Hair Color</label>
          <div className="flex gap-2 flex-wrap">
            {hairColors.map((color) => (
              <button
                key={color.value}
                onClick={() => setConfig({ ...config, hairColor: color.value })}
                className={`w-10 h-10 rounded-full border-4 transition ${
                  config.hairColor === color.value ? 'border-yellow-400 scale-110' : 'border-gray-600'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Body Type */}
      <div className="mb-6">
        <label className="text-white font-bold mb-2 block">Body Type</label>
        <div className="grid grid-cols-4 gap-2">
          {(['slim', 'average', 'muscular', 'heavy'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setConfig({ ...config, bodyType: type })}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                config.bodyType === type
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Outfit Color */}
      <div className="mb-6">
        <label className="text-white font-bold mb-2 block">Outfit Color</label>
        <div className="flex gap-2 flex-wrap">
          {outfitColors.map((color) => (
            <button
              key={color.value}
              onClick={() => setConfig({ ...config, outfitColor: color.value })}
              className={`w-12 h-12 rounded-lg border-4 transition ${
                config.outfitColor === color.value ? 'border-yellow-400 scale-110' : 'border-gray-600'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Accessory */}
      <div className="mb-6">
        <label className="text-white font-bold mb-2 block">Accessory</label>
        <div className="grid grid-cols-5 gap-2">
          {(['none', 'glasses', 'sunglasses', 'hat', 'headphones'] as const).map((acc) => (
            <button
              key={acc}
              onClick={() => setConfig({ ...config, accessory: acc })}
              className={`px-3 py-2 rounded-lg font-semibold transition text-sm ${
                config.accessory === acc
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {acc === 'none' ? 'None' : acc.charAt(0).toUpperCase() + acc.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={() => onSave(config)}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl font-bold text-xl transition"
      >
        ✅ Save Avatar
      </button>
    </div>
  );
}
