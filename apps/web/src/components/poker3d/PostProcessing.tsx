'use client';

import React from 'react';
import { EffectComposer, Bloom, DepthOfField, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

// Professional post-processing effects
export function PokerPostProcessing({ enabled = true }: { enabled?: boolean }) {
  if (!enabled) return null;

  return (
    <EffectComposer>
      {/* Bloom - Glowing lights */}
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.9}
        height={300}
        opacity={1}
      />

      {/* Depth of Field - Cinematic blur */}
      <DepthOfField
        focusDistance={0.02}
        focalLength={0.05}
        bokehScale={3}
        height={480}
      />

      {/* Vignette - Dark edges */}
      <Vignette
        offset={0.3}
        darkness={0.5}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* Chromatic Aberration - Subtle color fringing */}
      <ChromaticAberration
        offset={[0.001, 0.001]}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

// Intense effects for dramatic moments
export function DramaticEffects({ intensity = 1 }: { intensity?: number }) {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.5 * intensity}
        luminanceThreshold={0.5}
        luminanceSmoothing={0.9}
        height={300}
      />

      <DepthOfField
        focusDistance={0.01}
        focalLength={0.02}
        bokehScale={5 * intensity}
        height={480}
      />

      <Vignette
        offset={0.2}
        darkness={0.7 * intensity}
      />

      <ChromaticAberration
        offset={[0.003 * intensity, 0.003 * intensity]}
      />
    </EffectComposer>
  );
}
