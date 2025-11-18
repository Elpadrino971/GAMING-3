'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

export interface PlayerStats {
  handsPlayed: number;
  handsWon: number;
  totalWinnings: number;
  biggestPot: number;
  winRate: number;
  vpip: number; // Voluntarily Put Money In Pot
  pfr: number; // Pre-Flop Raise
  aggression: number;
  tightness: number;
  hourlyWinRate: number;
  bestHand: string;
  worstBeat: string;
  favoritePosition: string;
  playTime: number; // hours
  tournamentWins: number;
  cashGameProfit: number;
}

export interface SessionData {
  date: string;
  profit: number;
  handsPlayed: number;
  winRate: number;
}

// 3D Bar Chart
export function BarChart3D({
  data,
  title,
  position,
  color,
}: {
  data: { label: string; value: number }[];
  title: string;
  position: [number, number, number];
  color: string;
}) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <group position={position}>
      {/* Title */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {title}
      </Text>

      {/* Bars */}
      {data.map((item, i) => {
        const height = (item.value / maxValue) * 2;
        const x = (i - data.length / 2) * 0.8;

        return (
          <group key={i} position={[x, 0, 0]}>
            {/* Bar */}
            <mesh position={[0, height / 2, 0]} castShadow>
              <boxGeometry args={[0.6, height, 0.6]} />
              <meshStandardMaterial
                color={color}
                roughness={0.3}
                metalness={0.7}
                emissive={color}
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Value label */}
            <Text
              position={[0, height + 0.3, 0]}
              fontSize={0.2}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {item.value.toFixed(0)}
            </Text>

            {/* Label */}
            <Text
              position={[0, -0.3, 0]}
              fontSize={0.15}
              color="#cccccc"
              anchorX="center"
              anchorY="middle"
            >
              {item.label}
            </Text>
          </group>
        );
      })}

      {/* Base platform */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[data.length * 0.8 + 0.5, 0.1, 1]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} metalness={0.2} />
      </mesh>
    </group>
  );
}

// 3D Line Graph
export function LineGraph3D({
  data,
  title,
  position,
  color,
}: {
  data: SessionData[];
  title: string;
  position: [number, number, number];
  color: string;
}) {
  const lineRef = useRef<THREE.Line>(null);

  const points = useMemo(() => {
    const maxProfit = Math.max(...data.map((d) => Math.abs(d.profit)));
    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * 4 - 2;
      const y = (d.profit / maxProfit) * 2;
      return new THREE.Vector3(x, y, 0);
    });
  }, [data]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  return (
    <group position={position}>
      {/* Title */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {title}
      </Text>

      {/* Line */}
      <line ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial color={color} linewidth={3} />
      </line>

      {/* Data points */}
      {points.map((point, i) => (
        <mesh key={i} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={data[i].profit >= 0 ? '#22c55e' : '#ef4444'}
            emissive={data[i].profit >= 0 ? '#22c55e' : '#ef4444'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Grid */}
      <mesh position={[0, 0, -0.1]} receiveShadow>
        <planeGeometry args={[5, 4]} />
        <meshStandardMaterial color="#1f2937" opacity={0.5} transparent />
      </mesh>

      {/* Axes */}
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[5, 0.02, 0.02]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      <mesh position={[-2.5, 0, 0]}>
        <boxGeometry args={[0.02, 4, 0.02]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
    </group>
  );
}

// 3D Pie Chart (Donut)
export function PieChart3D({
  data,
  title,
  position,
}: {
  data: { label: string; value: number; color: string }[];
  title: string;
  position: [number, number, number];
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <group position={position}>
      {/* Title */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {title}
      </Text>

      {/* Slices */}
      {data.map((item, i) => {
        const angle = (item.value / total) * Math.PI * 2;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        const midAngle = (startAngle + endAngle) / 2;
        currentAngle += angle;

        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.absarc(0, 0, 1, startAngle, endAngle, false);
        shape.lineTo(0, 0);

        const labelRadius = 1.5;
        const labelX = Math.cos(midAngle) * labelRadius;
        const labelZ = Math.sin(midAngle) * labelRadius;

        return (
          <group key={i}>
            {/* Slice */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
              <extrudeGeometry
                args={[
                  shape,
                  {
                    depth: 0.3,
                    bevelEnabled: true,
                    bevelThickness: 0.05,
                    bevelSize: 0.05,
                    bevelSegments: 3,
                  },
                ]}
              />
              <meshStandardMaterial
                color={item.color}
                roughness={0.4}
                metalness={0.6}
                emissive={item.color}
                emissiveIntensity={0.2}
              />
            </mesh>

            {/* Label */}
            <Text
              position={[labelX, 0.5, labelZ]}
              fontSize={0.15}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {item.label}
            </Text>
            <Text
              position={[labelX, 0.2, labelZ]}
              fontSize={0.12}
              color="#cccccc"
              anchorX="center"
              anchorY="middle"
            >
              {((item.value / total) * 100).toFixed(1)}%
            </Text>
          </group>
        );
      })}
    </group>
  );
}

// 3D Heatmap for position analysis
export function HeatMap3D({
  data,
  title,
  position,
}: {
  data: number[][]; // 9x9 grid
  title: string;
  position: [number, number, number];
}) {
  const maxValue = Math.max(...data.flat());

  return (
    <group position={position}>
      {/* Title */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {title}
      </Text>

      {/* Grid cells */}
      {data.map((row, i) =>
        row.map((value, j) => {
          const intensity = value / maxValue;
          const color = new THREE.Color();
          color.setHSL(0.6 - intensity * 0.6, 1, 0.5); // Blue (cold) to Red (hot)

          const x = (j - 4) * 0.4;
          const z = (i - 4) * 0.4;
          const height = intensity * 0.5;

          return (
            <group key={`${i}-${j}`} position={[x, height / 2, z]}>
              <mesh castShadow>
                <boxGeometry args={[0.35, height, 0.35]} />
                <meshStandardMaterial
                  color={color}
                  roughness={0.4}
                  metalness={0.6}
                  emissive={color}
                  emissiveIntensity={intensity * 0.5}
                />
              </mesh>
            </group>
          );
        })
      )}

      {/* Base */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[4, 0.1, 4]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} metalness={0.2} />
      </mesh>
    </group>
  );
}

// Rotating Stats Display
export function RotatingStatsDisplay({ stats }: { stats: PlayerStats }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central sphere */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#3b82f6"
          roughness={0.2}
          metalness={0.8}
          emissive="#3b82f6"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Win Rate */}
      <Text position={[0, 1.5, 0]} fontSize={0.4} color="#22c55e" anchorX="center" anchorY="middle">
        {stats.winRate.toFixed(1)}%
      </Text>
      <Text position={[0, 1.2, 0]} fontSize={0.15} color="#ffffff" anchorX="center" anchorY="middle">
        Win Rate
      </Text>

      {/* Total Winnings */}
      <Text position={[0, -1.5, 0]} fontSize={0.3} color="#fbbf24" anchorX="center" anchorY="middle">
        ${stats.totalWinnings.toLocaleString()}
      </Text>
      <Text position={[0, -1.8, 0]} fontSize={0.15} color="#ffffff" anchorX="center" anchorY="middle">
        Total Winnings
      </Text>

      {/* Hands Played */}
      <Text
        position={[2, 0, 0]}
        fontSize={0.25}
        color="#06b6d4"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI / 2, 0]}
      >
        {stats.handsPlayed.toLocaleString()}
      </Text>
      <Text
        position={[2, -0.3, 0]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI / 2, 0]}
      >
        Hands Played
      </Text>
    </group>
  );
}

// Complete Analytics Dashboard Scene
export function AnalyticsDashboard3D({ stats }: { stats: PlayerStats }) {
  // Sample data for charts
  const weeklyData: SessionData[] = [
    { date: 'Mon', profit: 150, handsPlayed: 120, winRate: 55 },
    { date: 'Tue', profit: -80, handsPlayed: 95, winRate: 48 },
    { date: 'Wed', profit: 220, handsPlayed: 140, winRate: 62 },
    { date: 'Thu', profit: 180, handsPlayed: 110, winRate: 58 },
    { date: 'Fri', profit: -50, handsPlayed: 88, winRate: 45 },
    { date: 'Sat', profit: 310, handsPlayed: 175, winRate: 65 },
    { date: 'Sun', profit: 125, handsPlayed: 132, winRate: 54 },
  ];

  const handDistribution = [
    { label: 'Fold', value: 60, color: '#6b7280' },
    { label: 'Call', value: 20, color: '#3b82f6' },
    { label: 'Raise', value: 15, color: '#f59e0b' },
    { label: 'All-In', value: 5, color: '#ef4444' },
  ];

  const positionStats = [
    { label: 'BTN', value: stats.winRate * 1.2 },
    { label: 'CO', value: stats.winRate * 1.1 },
    { label: 'MP', value: stats.winRate },
    { label: 'EP', value: stats.winRate * 0.9 },
    { label: 'BB', value: stats.winRate * 0.85 },
    { label: 'SB', value: stats.winRate * 0.8 },
  ];

  // Heatmap data (9x9 grid for hand strength)
  const heatmapData = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => Math.random() * 100)
  );

  return (
    <group>
      {/* Central Stats Display */}
      <RotatingStatsDisplay stats={stats} />

      {/* Profit Chart */}
      <LineGraph3D
        data={weeklyData}
        title="📈 Weekly Profit Trend"
        position={[-6, 0, 0]}
        color="#22c55e"
      />

      {/* Position Win Rate */}
      <BarChart3D
        data={positionStats}
        title="🎯 Win Rate by Position"
        position={[6, 0, 0]}
        color="#3b82f6"
      />

      {/* Action Distribution */}
      <PieChart3D
        data={handDistribution}
        title="🎲 Action Distribution"
        position={[0, 0, 6]}
      />

      {/* Hand Strength Heatmap */}
      <HeatMap3D
        data={heatmapData}
        title="🔥 Hand Strength Matrix"
        position={[0, 0, -6]}
      />
    </group>
  );
}

// Analytics UI Panel
export function AnalyticsUIPanel({ stats }: { stats: PlayerStats }) {
  return (
    <div className="fixed left-4 top-20 bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 max-w-sm border-2 border-blue-400 z-30">
      <h2 className="text-blue-400 font-bold text-2xl mb-4">📊 Analytics</h2>

      <div className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Win Rate"
            value={`${stats.winRate.toFixed(1)}%`}
            color="text-green-400"
            icon="🏆"
          />
          <StatCard
            label="VPIP"
            value={`${stats.vpip.toFixed(1)}%`}
            color="text-blue-400"
            icon="🎯"
          />
          <StatCard
            label="PFR"
            value={`${stats.pfr.toFixed(1)}%`}
            color="text-yellow-400"
            icon="🚀"
          />
          <StatCard
            label="Aggression"
            value={stats.aggression.toFixed(2)}
            color="text-red-400"
            icon="💪"
          />
        </div>

        {/* Profit */}
        <div className="bg-gradient-to-r from-green-900 to-green-800 rounded-lg p-4">
          <div className="text-green-400 text-sm font-semibold mb-1">Total Profit</div>
          <div className="text-white text-3xl font-bold">
            ${stats.totalWinnings.toLocaleString()}
          </div>
          <div className="text-green-300 text-sm mt-1">
            ${stats.hourlyWinRate.toFixed(2)}/hr
          </div>
        </div>

        {/* Volume */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-sm font-semibold mb-2">Volume</div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Hands Played:</span>
              <span className="text-white font-bold">{stats.handsPlayed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Hands Won:</span>
              <span className="text-white font-bold">{stats.handsWon.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Play Time:</span>
              <span className="text-white font-bold">{stats.playTime.toFixed(0)}h</span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-sm font-semibold mb-2">Achievements</div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">🏆 Tournaments Won:</span>
              <span className="text-yellow-400 font-bold">{stats.tournamentWins}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">💰 Biggest Pot:</span>
              <span className="text-green-400 font-bold">${stats.biggestPot.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">🎯 Best Hand:</span>
              <span className="text-blue-400 font-bold">{stats.bestHand}</span>
            </div>
          </div>
        </div>

        {/* Playing Style */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-sm font-semibold mb-3">Playing Style</div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Aggression</span>
                <span className="text-white">{(stats.aggression * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-red-400 rounded-full transition-all"
                  style={{ width: `${stats.aggression * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Tightness</span>
                <span className="text-white">{(stats.tightness * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-blue-400 rounded-full transition-all"
                  style={{ width: `${stats.tightness * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: string;
  color: string;
  icon: string;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-3">
      <div className="text-gray-400 text-xs mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <span className={`${color} text-xl font-bold`}>{value}</span>
      </div>
    </div>
  );
}

// Sample player stats for demo
export const SAMPLE_STATS: PlayerStats = {
  handsPlayed: 12847,
  handsWon: 7156,
  totalWinnings: 45632,
  biggestPot: 8450,
  winRate: 55.7,
  vpip: 23.5,
  pfr: 18.2,
  aggression: 0.72,
  tightness: 0.68,
  hourlyWinRate: 28.45,
  bestHand: 'Royal Flush',
  worstBeat: 'AA vs KK (lost to set)',
  favoritePosition: 'Button',
  playTime: 248.5,
  tournamentWins: 34,
  cashGameProfit: 32150,
};
