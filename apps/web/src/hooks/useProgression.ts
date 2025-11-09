import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  ExtendedUserStats,
  getDefaultStats,
  loadStats,
  saveStats,
  updateStatsAfterHand,
  calculateHandXP
} from '@/lib/progression';
import {
  Achievement,
  getNewlyUnlockedAchievements
} from '@/lib/achievements';

/**
 * Hook for managing user progression
 */
export function useProgression() {
  const { user, addChips, addXP } = useAuth();
  const [stats, setStats] = useState<ExtendedUserStats>(getDefaultStats());
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  // Load stats on mount
  useEffect(() => {
    if (user) {
      const loadedStats = loadStats(user.id);
      setStats(loadedStats);
    }
  }, [user]);

  // Save stats whenever they change
  useEffect(() => {
    if (user) {
      saveStats(user.id, stats);
    }
  }, [stats, user]);

  /**
   * Record a hand result
   */
  const recordHandResult = useCallback((handResult: {
    won: boolean;
    potSize: number;
    chipsWon: number;
    voluntarilyPlayed: boolean;
    preFlopRaised: boolean;
    raisesCount: number;
    callsCount: number;
    coachGrade?: string;
  }) => {
    if (!user) return;

    // Update stats
    const newStats = updateStatsAfterHand(stats, handResult);

    // Check for new achievements
    const newlyUnlocked = getNewlyUnlockedAchievements(
      {
        handsPlayed: newStats.handsPlayed,
        handsWon: newStats.handsWon,
        level: newStats.level,
        winStreak: newStats.currentWinStreak,
        totalChips: newStats.totalChips,
        coachGradeA: newStats.coachGradeA,
        proCoaches: newStats.proCoaches
      },
      newStats.unlockedAchievements
    );

    // Award achievement rewards
    newlyUnlocked.forEach(achievement => {
      if (achievement.reward.chips) {
        newStats.totalChips += achievement.reward.chips;
        addChips(achievement.reward.chips);
      }
      if (achievement.reward.xp) {
        newStats.xp += achievement.reward.xp;
        addXP(achievement.reward.xp);
      }
      newStats.unlockedAchievements.push(achievement.id);
    });

    // Calculate XP for the hand
    const xpGained = calculateHandXP({
      won: handResult.won,
      potSize: handResult.potSize,
      coachGrade: handResult.coachGrade
    });

    // Update auth context
    addXP(xpGained);
    addChips(handResult.chipsWon);

    // Set stats
    setStats(newStats);

    // Set new achievements for display
    if (newlyUnlocked.length > 0) {
      setNewAchievements(newlyUnlocked);
    }
  }, [stats, user, addChips, addXP]);

  /**
   * Clear new achievements (after showing them)
   */
  const clearNewAchievements = useCallback(() => {
    setNewAchievements([]);
  }, []);

  /**
   * Get current stats
   */
  const getCurrentStats = useCallback(() => {
    return stats;
  }, [stats]);

  return {
    stats,
    newAchievements,
    recordHandResult,
    clearNewAchievements,
    getCurrentStats
  };
}
