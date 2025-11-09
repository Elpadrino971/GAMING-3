/**
 * Calculate XP for a hand
 */
export function calculateHandXP(params: {
  won: boolean;
  potSize: number;
  coachGrade?: string;
  optimalPlay?: boolean;
}): number {
  const { won, potSize, coachGrade, optimalPlay } = params;

  // Base XP
  let baseXP = 10;

  // Bonus for pot size (bigger pots = more XP)
  const potBonus = Math.floor(potSize / 100) * 5;
  baseXP += potBonus;

  // Win bonus
  if (won) {
    baseXP += 20;
  }

  // Coach grade bonus
  if (coachGrade === 'A') {
    baseXP += 30;
  } else if (coachGrade === 'B') {
    baseXP += 15;
  }

  // Optimal play bonus
  if (optimalPlay) {
    baseXP += 10;
  }

  return Math.floor(baseXP);
}

/**
 * Calculate chips won/lost impact on total
 */
export function calculateChipsChange(
  startingStack: number,
  currentStack: number
): number {
  return currentStack - startingStack;
}

/**
 * Calculate level from XP
 */
export function calculateLevel(xp: number): { level: number; xpInLevel: number; xpForNext: number } {
  let level = 1;
  let totalXPNeeded = 0;
  let xpForNextLevel = 100;

  while (xp >= totalXPNeeded + xpForNextLevel) {
    totalXPNeeded += xpForNextLevel;
    level++;
    xpForNextLevel = level * 100;
  }

  const xpInLevel = xp - totalXPNeeded;

  return {
    level,
    xpInLevel,
    xpForNext: xpForNextLevel
  };
}

/**
 * Get win rate percentage
 */
export function getWinRate(handsPlayed: number, handsWon: number): number {
  if (handsPlayed === 0) return 0;
  return Math.round((handsWon / handsPlayed) * 100);
}

/**
 * Calculate VPIP (Voluntarily Put money In Pot)
 */
export function calculateVPIP(handsPlayed: number, handsVoluntarilyPlayed: number): number {
  if (handsPlayed === 0) return 0;
  return Math.round((handsVoluntarilyPlayed / handsPlayed) * 100);
}

/**
 * Calculate PFR (Pre-Flop Raise)
 */
export function calculatePFR(handsPlayed: number, preFlopRaises: number): number {
  if (handsPlayed === 0) return 0;
  return Math.round((preFlopRaises / handsPlayed) * 100);
}

/**
 * Calculate Aggression Factor
 */
export function calculateAggressionFactor(
  raises: number,
  calls: number
): number {
  if (calls === 0) return raises > 0 ? 10 : 0;
  return Math.round((raises / calls) * 10) / 10;
}

/**
 * Player rank based on chips
 */
export function getPlayerRank(totalChips: number): {
  rank: string;
  color: string;
  icon: string;
} {
  if (totalChips < 5000) {
    return { rank: 'Beginner', color: 'text-gray-400', icon: '🌱' };
  } else if (totalChips < 10000) {
    return { rank: 'Amateur', color: 'text-green-400', icon: '🎯' };
  } else if (totalChips < 25000) {
    return { rank: 'Intermediate', color: 'text-blue-400', icon: '🎮' };
  } else if (totalChips < 50000) {
    return { rank: 'Advanced', color: 'text-purple-400', icon: '⚡' };
  } else if (totalChips < 100000) {
    return { rank: 'Expert', color: 'text-orange-400', icon: '🔥' };
  } else if (totalChips < 500000) {
    return { rank: 'Master', color: 'text-red-400', icon: '💎' };
  } else {
    return { rank: 'Legend', color: 'text-yellow-400', icon: '👑' };
  }
}

/**
 * Extended user stats for progression
 */
export interface ExtendedUserStats {
  // Basic
  handsPlayed: number;
  handsWon: number;
  totalChips: number;
  level: number;
  xp: number;

  // Streaks
  currentWinStreak: number;
  longestWinStreak: number;
  currentLossStreak: number;

  // Poker stats
  vpip: number;
  pfr: number;
  aggressionFactor: number;
  threebet: number;
  cbet: number;

  // Coach stats
  coachGradeA: number;
  coachGradeB: number;
  coachGradeC: number;
  coachGradeD: number;

  // Achievements
  unlockedAchievements: string[];
  proCoaches: number;

  // Internal tracking
  handsVoluntarilyPlayed: number;
  preFlopRaises: number;
  totalRaises: number;
  totalCalls: number;
}

/**
 * Initialize default stats
 */
export function getDefaultStats(): ExtendedUserStats {
  return {
    handsPlayed: 0,
    handsWon: 0,
    totalChips: 5000,
    level: 1,
    xp: 0,
    currentWinStreak: 0,
    longestWinStreak: 0,
    currentLossStreak: 0,
    vpip: 0,
    pfr: 0,
    aggressionFactor: 0,
    threebet: 0,
    cbet: 0,
    coachGradeA: 0,
    coachGradeB: 0,
    coachGradeC: 0,
    coachGradeD: 0,
    unlockedAchievements: [],
    proCoaches: 0,
    handsVoluntarilyPlayed: 0,
    preFlopRaises: 0,
    totalRaises: 0,
    totalCalls: 0
  };
}

/**
 * Update stats after a hand
 */
export function updateStatsAfterHand(
  currentStats: ExtendedUserStats,
  handResult: {
    won: boolean;
    potSize: number;
    chipsWon: number;
    voluntarilyPlayed: boolean;
    preFlopRaised: boolean;
    raisesCount: number;
    callsCount: number;
    coachGrade?: string;
  }
): ExtendedUserStats {
  const newStats = { ...currentStats };

  // Basic counts
  newStats.handsPlayed++;
  if (handResult.won) {
    newStats.handsWon++;
    newStats.currentWinStreak++;
    newStats.currentLossStreak = 0;
    if (newStats.currentWinStreak > newStats.longestWinStreak) {
      newStats.longestWinStreak = newStats.currentWinStreak;
    }
  } else {
    newStats.currentWinStreak = 0;
    newStats.currentLossStreak++;
  }

  // Chips
  newStats.totalChips += handResult.chipsWon;

  // Tracking
  if (handResult.voluntarilyPlayed) newStats.handsVoluntarilyPlayed++;
  if (handResult.preFlopRaised) newStats.preFlopRaises++;
  newStats.totalRaises += handResult.raisesCount;
  newStats.totalCalls += handResult.callsCount;

  // Calculate poker stats
  newStats.vpip = calculateVPIP(newStats.handsPlayed, newStats.handsVoluntarilyPlayed);
  newStats.pfr = calculatePFR(newStats.handsPlayed, newStats.preFlopRaises);
  newStats.aggressionFactor = calculateAggressionFactor(newStats.totalRaises, newStats.totalCalls);

  // Coach grades
  if (handResult.coachGrade === 'A') newStats.coachGradeA++;
  else if (handResult.coachGrade === 'B') newStats.coachGradeB++;
  else if (handResult.coachGrade === 'C') newStats.coachGradeC++;
  else if (handResult.coachGrade === 'D') newStats.coachGradeD++;

  // Calculate XP
  const xpGained = calculateHandXP({
    won: handResult.won,
    potSize: handResult.potSize,
    coachGrade: handResult.coachGrade
  });

  newStats.xp += xpGained;

  // Check for level up
  const { level, xpInLevel } = calculateLevel(newStats.xp);
  if (level > newStats.level) {
    // Level up! Grant bonus chips
    newStats.totalChips += 500;
  }
  newStats.level = level;

  return newStats;
}

/**
 * Save stats to localStorage
 */
export function saveStats(userId: string, stats: ExtendedUserStats): void {
  localStorage.setItem(`pokermind_stats_${userId}`, JSON.stringify(stats));
}

/**
 * Load stats from localStorage
 */
export function loadStats(userId: string): ExtendedUserStats {
  const stored = localStorage.getItem(`pokermind_stats_${userId}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stats:', e);
    }
  }
  return getDefaultStats();
}
