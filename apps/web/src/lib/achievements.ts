/**
 * Achievement tiers
 */
export enum AchievementTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum'
}

/**
 * Achievement definition
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  tier: AchievementTier;
  icon: string;
  requirement: {
    type: 'hands_played' | 'hands_won' | 'chips_won' | 'level' | 'win_streak' | 'perfect_hand' | 'fold_streak' | 'raise_streak' | 'all_in_won' | 'coach_grade_a' | 'total_chips' | 'pro_coaches';
    value: number;
  };
  reward: {
    chips?: number;
    xp?: number;
  };
}

/**
 * All available achievements
 */
export const ACHIEVEMENTS: Achievement[] = [
  // Hands Played
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Play your first hand',
    tier: AchievementTier.BRONZE,
    icon: '🎯',
    requirement: { type: 'hands_played', value: 1 },
    reward: { xp: 50 }
  },
  {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'Play 10 hands',
    tier: AchievementTier.BRONZE,
    icon: '🃏',
    requirement: { type: 'hands_played', value: 10 },
    reward: { chips: 100, xp: 100 }
  },
  {
    id: 'card_shark',
    name: 'Card Shark',
    description: 'Play 50 hands',
    tier: AchievementTier.SILVER,
    icon: '🦈',
    requirement: { type: 'hands_played', value: 50 },
    reward: { chips: 500, xp: 500 }
  },
  {
    id: 'poker_veteran',
    name: 'Poker Veteran',
    description: 'Play 100 hands',
    tier: AchievementTier.GOLD,
    icon: '⭐',
    requirement: { type: 'hands_played', value: 100 },
    reward: { chips: 1000, xp: 1000 }
  },
  {
    id: 'poker_master',
    name: 'Poker Master',
    description: 'Play 500 hands',
    tier: AchievementTier.PLATINUM,
    icon: '👑',
    requirement: { type: 'hands_played', value: 500 },
    reward: { chips: 5000, xp: 5000 }
  },

  // Hands Won
  {
    id: 'first_victory',
    name: 'First Victory',
    description: 'Win your first hand',
    tier: AchievementTier.BRONZE,
    icon: '🎉',
    requirement: { type: 'hands_won', value: 1 },
    reward: { xp: 100 }
  },
  {
    id: 'winner',
    name: 'Winner',
    description: 'Win 10 hands',
    tier: AchievementTier.SILVER,
    icon: '🏅',
    requirement: { type: 'hands_won', value: 10 },
    reward: { chips: 250, xp: 250 }
  },
  {
    id: 'champion',
    name: 'Champion',
    description: 'Win 50 hands',
    tier: AchievementTier.GOLD,
    icon: '🏆',
    requirement: { type: 'hands_won', value: 50 },
    reward: { chips: 1500, xp: 1500 }
  },

  // Level Achievements
  {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach level 5',
    tier: AchievementTier.BRONZE,
    icon: '⚡',
    requirement: { type: 'level', value: 5 },
    reward: { chips: 500 }
  },
  {
    id: 'level_10',
    name: 'Expert Player',
    description: 'Reach level 10',
    tier: AchievementTier.SILVER,
    icon: '💎',
    requirement: { type: 'level', value: 10 },
    reward: { chips: 2000 }
  },
  {
    id: 'level_20',
    name: 'Legendary',
    description: 'Reach level 20',
    tier: AchievementTier.GOLD,
    icon: '🌟',
    requirement: { type: 'level', value: 20 },
    reward: { chips: 10000 }
  },

  // Win Streaks
  {
    id: 'hot_streak',
    name: 'Hot Streak',
    description: 'Win 3 hands in a row',
    tier: AchievementTier.SILVER,
    icon: '🔥',
    requirement: { type: 'win_streak', value: 3 },
    reward: { chips: 300, xp: 300 }
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Win 5 hands in a row',
    tier: AchievementTier.GOLD,
    icon: '💪',
    requirement: { type: 'win_streak', value: 5 },
    reward: { chips: 1000, xp: 1000 }
  },

  // Chips
  {
    id: 'rich',
    name: 'Getting Rich',
    description: 'Accumulate 10,000 chips',
    tier: AchievementTier.SILVER,
    icon: '💰',
    requirement: { type: 'total_chips', value: 10000 },
    reward: { xp: 500 }
  },
  {
    id: 'millionaire',
    name: 'Chip Millionaire',
    description: 'Accumulate 100,000 chips',
    tier: AchievementTier.PLATINUM,
    icon: '💸',
    requirement: { type: 'total_chips', value: 100000 },
    reward: { xp: 10000 }
  },

  // Coach Achievements
  {
    id: 'a_student',
    name: 'A+ Student',
    description: 'Get an A grade from your coach',
    tier: AchievementTier.BRONZE,
    icon: '📚',
    requirement: { type: 'coach_grade_a', value: 1 },
    reward: { xp: 200 }
  },
  {
    id: 'perfect_student',
    name: 'Perfect Student',
    description: 'Get 10 A grades from your coach',
    tier: AchievementTier.GOLD,
    icon: '🎓',
    requirement: { type: 'coach_grade_a', value: 10 },
    reward: { chips: 2000, xp: 2000 }
  },

  // Pro Coaches
  {
    id: 'first_coach',
    name: 'Under the Wing',
    description: 'Purchase your first pro coach',
    tier: AchievementTier.BRONZE,
    icon: '🏆',
    requirement: { type: 'pro_coaches', value: 1 },
    reward: { xp: 500 }
  },
  {
    id: 'coach_collector',
    name: 'Coach Collector',
    description: 'Purchase 3 pro coaches',
    tier: AchievementTier.GOLD,
    icon: '👨‍🏫',
    requirement: { type: 'pro_coaches', value: 3 },
    reward: { chips: 3000, xp: 3000 }
  },
];

/**
 * Check if user has unlocked an achievement
 */
export function checkAchievement(
  achievement: Achievement,
  userStats: {
    handsPlayed: number;
    handsWon: number;
    level: number;
    winStreak: number;
    totalChips: number;
    coachGradeA: number;
    proCoaches: number;
  }
): boolean {
  switch (achievement.requirement.type) {
    case 'hands_played':
      return userStats.handsPlayed >= achievement.requirement.value;
    case 'hands_won':
      return userStats.handsWon >= achievement.requirement.value;
    case 'level':
      return userStats.level >= achievement.requirement.value;
    case 'win_streak':
      return userStats.winStreak >= achievement.requirement.value;
    case 'total_chips':
      return userStats.totalChips >= achievement.requirement.value;
    case 'coach_grade_a':
      return userStats.coachGradeA >= achievement.requirement.value;
    case 'pro_coaches':
      return userStats.proCoaches >= achievement.requirement.value;
    default:
      return false;
  }
}

/**
 * Get newly unlocked achievements
 */
export function getNewlyUnlockedAchievements(
  userStats: {
    handsPlayed: number;
    handsWon: number;
    level: number;
    winStreak: number;
    totalChips: number;
    coachGradeA: number;
    proCoaches: number;
  },
  unlockedIds: string[]
): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => {
    const isUnlocked = checkAchievement(achievement, userStats);
    const wasNotUnlockedBefore = !unlockedIds.includes(achievement.id);
    return isUnlocked && wasNotUnlockedBefore;
  });
}

/**
 * Get tier color
 */
export function getTierColor(tier: AchievementTier): string {
  switch (tier) {
    case AchievementTier.BRONZE:
      return 'from-orange-600 to-orange-800';
    case AchievementTier.SILVER:
      return 'from-gray-400 to-gray-600';
    case AchievementTier.GOLD:
      return 'from-yellow-400 to-yellow-600';
    case AchievementTier.PLATINUM:
      return 'from-purple-400 to-purple-600';
  }
}

/**
 * Get tier badge
 */
export function getTierBadge(tier: AchievementTier): string {
  switch (tier) {
    case AchievementTier.BRONZE:
      return '🥉';
    case AchievementTier.SILVER:
      return '🥈';
    case AchievementTier.GOLD:
      return '🥇';
    case AchievementTier.PLATINUM:
      return '💎';
  }
}
