'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// ============================================================================
// MOBILE LAYOUT COMPONENTS
// ============================================================================

export function MobileContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white max-w-md mx-auto relative overflow-hidden">
      {children}
    </div>
  );
}

export function MobileHeader({
  title,
  leftAction,
  rightAction,
}: {
  title: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 safe-top">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="w-10">{leftAction}</div>
        <h1 className="text-lg font-bold">{title}</h1>
        <div className="w-10 flex justify-end">{rightAction}</div>
      </div>
    </header>
  );
}

export function BottomNavigation({ active = 'home' }: { active?: string }) {
  const items = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'play', icon: '🎮', label: 'Play' },
    { id: 'stats', icon: '📊', label: 'Stats' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t-2 border-gray-800 safe-bottom z-50">
      <div className="max-w-md mx-auto flex items-center justify-around h-16">
        {items.map((item) => (
          <button
            key={item.id}
            className={`flex flex-col items-center gap-1 min-w-[44px] ${
              active === item.id ? 'text-purple-500' : 'text-gray-400'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ============================================================================
// BUTTONS
// ============================================================================

export function PrimaryButton({
  children,
  onClick,
  disabled,
  fullWidth = true,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        h-12 px-6
        bg-gradient-to-r from-purple-600 to-pink-600
        hover:from-purple-700 hover:to-pink-700
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        text-white font-bold text-base
        rounded-xl
        shadow-lg shadow-purple-500/50
        transition-all duration-200
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  fullWidth = true,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        h-12 px-6
        bg-gray-800 hover:bg-gray-700
        active:scale-95
        text-white font-semibold text-base
        rounded-xl border-2 border-gray-600
        transition-all duration-200
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {children}
    </button>
  );
}

export function IconButton({
  icon,
  onClick,
  className = '',
}: {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-11 h-11
        bg-gray-800 hover:bg-gray-700
        active:scale-95
        rounded-full
        flex items-center justify-center
        transition-all duration-200
        ${className}
      `}
    >
      {icon}
    </button>
  );
}

// ============================================================================
// CARDS
// ============================================================================

export function GameCard({
  name,
  stakes,
  players,
  maxPlayers,
  avgPot,
  handsPerHour,
  isLive,
  onJoin,
}: {
  name: string;
  stakes: string;
  players: number;
  maxPlayers: number;
  avgPot: number;
  handsPerHour: number;
  isLive?: boolean;
  onJoin?: () => void;
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border-2 border-gray-700 shadow-xl"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-white font-bold text-lg">{name}</h3>
          <p className="text-gray-400 text-sm">{stakes}</p>
        </div>
        {isLive && (
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            LIVE
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <span>👥</span>
          <span>
            {players}/{maxPlayers} Players
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <span>💰</span>
          <span>Avg Pot: ${avgPot}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <span>⚡</span>
          <span>{handsPerHour} hands/hr</span>
        </div>
      </div>

      <PrimaryButton onClick={onJoin}>JOIN TABLE →</PrimaryButton>
    </motion.div>
  );
}

export function NFTCard({
  name,
  rarity,
  icon,
  price,
  onBuy,
}: {
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  icon: string;
  price: number;
  onBuy?: () => void;
}) {
  const rarityGradient = {
    mythic: 'from-red-500 via-purple-500 to-yellow-500',
    legendary: 'from-yellow-500 to-orange-500',
    epic: 'from-purple-500 to-pink-500',
    rare: 'from-blue-500 to-cyan-500',
    common: 'from-gray-500 to-gray-600',
  };

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className={`bg-gradient-to-br ${rarityGradient[rarity]} rounded-2xl p-1 shadow-2xl`}
    >
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <span className="text-8xl">{icon}</span>
        </div>
        <div className="p-4">
          <h3 className="text-white font-bold text-lg mb-1">{name}</h3>
          <span
            className={`inline-block px-3 py-1 bg-gradient-to-r ${rarityGradient[rarity]} text-white text-xs font-bold rounded-full`}
          >
            {rarity.toUpperCase()}
          </span>
          <div className="mt-3 text-white text-2xl font-bold">Ξ {price.toFixed(2)}</div>
          <button
            onClick={onBuy}
            className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg"
          >
            BUY NOW
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// INPUTS
// ============================================================================

export function TextInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
}: {
  type?: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  icon?: string;
}) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
          {icon}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`
          w-full h-12 ${icon ? 'pl-12' : 'pl-4'} pr-4
          bg-gray-800
          border-2 border-gray-700
          focus:border-purple-500
          rounded-xl
          text-white placeholder-gray-400
          transition-colors duration-200
          outline-none
        `}
      />
    </div>
  );
}

export function Slider({
  min = 0,
  max = 100,
  value,
  onChange,
}: {
  min?: number;
  max?: number;
  value: number;
  onChange?: (value: number) => void;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange?.(Number(e.target.value))}
      className="
        w-full h-2
        bg-gray-700
        rounded-full
        appearance-none
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:w-6
        [&::-webkit-slider-thumb]:h-6
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-purple-600
        [&::-webkit-slider-thumb]:cursor-pointer
        [&::-webkit-slider-thumb]:shadow-lg
      "
    />
  );
}

// ============================================================================
// POKER GAME COMPONENTS
// ============================================================================

export function PlayingCard({ rank, suit, faceDown }: { rank: string; suit: string; faceDown?: boolean }) {
  const isRed = suit === '♥' || suit === '♦';

  if (faceDown) {
    return (
      <div className="relative w-16 h-24 bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg shadow-xl border-2 border-blue-700 flex items-center justify-center">
        <div className="text-blue-600 font-bold text-2xl">🎰</div>
      </div>
    );
  }

  return (
    <div className="relative w-16 h-24 bg-white rounded-lg shadow-xl flex flex-col items-center justify-center">
      <span className={`text-3xl font-bold ${isRed ? 'text-red-600' : 'text-black'}`}>{rank}</span>
      <span className={`text-2xl ${isRed ? 'text-red-600' : 'text-black'}`}>{suit}</span>
    </div>
  );
}

export function ChipStack({ value, count = 5 }: { value: number; count?: number }) {
  const chipColors: Record<number, string> = {
    1: 'from-white to-gray-200',
    5: 'from-red-500 to-red-700',
    10: 'from-blue-500 to-blue-700',
    25: 'from-green-500 to-green-700',
    100: 'from-gray-900 to-black',
    500: 'from-purple-500 to-purple-700',
    1000: 'from-yellow-500 to-yellow-700',
  };

  const closestValue = Object.keys(chipColors)
    .map(Number)
    .reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev));

  return (
    <div className="flex flex-col items-center">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`
            w-12 h-3
            rounded-full
            bg-gradient-to-b ${chipColors[closestValue]}
            border-2 border-white
            shadow-lg
          `}
          style={{ marginTop: i === 0 ? 0 : -8 }}
        />
      ))}
      <div className="text-white text-xs font-bold mt-1">${value}</div>
    </div>
  );
}

export function ActionTimer({ timeLeft, maxTime }: { timeLeft: number; maxTime: number }) {
  const percentage = (timeLeft / maxTime) * 100;

  return (
    <div className="relative">
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'linear' }}
        />
      </div>
      <span className="absolute -top-6 right-0 text-white font-bold text-sm">{timeLeft}s</span>
    </div>
  );
}

export function PokerActions({
  canCheck,
  canCall,
  canRaise,
  callAmount,
  onFold,
  onCheck,
  onCall,
  onRaise,
}: {
  canCheck: boolean;
  canCall: boolean;
  canRaise: boolean;
  callAmount?: number;
  onFold?: () => void;
  onCheck?: () => void;
  onCall?: () => void;
  onRaise?: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onFold}
          className="h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-95 text-white font-bold rounded-xl transition-all"
        >
          FOLD
        </button>

        {canCheck ? (
          <button
            onClick={onCheck}
            className="h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95 text-white font-bold rounded-xl transition-all"
          >
            CHECK
          </button>
        ) : canCall ? (
          <button
            onClick={onCall}
            className="h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 active:scale-95 text-white font-bold rounded-xl transition-all"
          >
            CALL ${callAmount}
          </button>
        ) : null}
      </div>

      {canRaise && (
        <button
          onClick={onRaise}
          className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:scale-95 text-white font-bold text-lg rounded-xl transition-all"
        >
          RAISE
        </button>
      )}
    </div>
  );
}

// ============================================================================
// LOADING & EMPTY STATES
// ============================================================================

export function LoadingSpinner({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div
        className={`animate-spin rounded-full border-4 border-purple-500 border-t-transparent ${sizeClasses[size]}`}
      />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <span className="text-6xl mb-4">{icon}</span>
      <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      {actionLabel && onAction && <PrimaryButton onClick={onAction}>{actionLabel}</PrimaryButton>}
    </div>
  );
}

// ============================================================================
// MODALS & OVERLAYS
// ============================================================================

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl z-50 max-w-md mx-auto safe-bottom"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-xl">{title}</h3>
                <button onClick={onClose} className="text-gray-400 text-2xl">
                  ✕
                </button>
              </div>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function Toast({
  message,
  type = 'info',
  isVisible,
}: {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
}) {
  const bgColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 left-4 right-4 ${bgColors[type]} text-white px-4 py-3 rounded-xl shadow-xl z-50 max-w-md mx-auto`}
        >
          <p className="font-semibold text-center">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// STATS & PROGRESS
// ============================================================================

export function ProgressBar({ value, max, label }: { value: number; max: number; label?: string }) {
  const percentage = (value / max) * 100;

  return (
    <div>
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">{label}</span>
          <span className="text-white font-bold">
            {value}/{max}
          </span>
        </div>
      )}
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}

export function StatCard({
  icon,
  label,
  value,
  change,
}: {
  icon: string;
  label: string;
  value: string | number;
  change?: number;
}) {
  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <div className="text-white text-2xl font-bold">{value}</div>
      {change !== undefined && (
        <div className={`text-sm mt-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? '↗' : '↘'} {Math.abs(change)}%
        </div>
      )}
    </div>
  );
}
