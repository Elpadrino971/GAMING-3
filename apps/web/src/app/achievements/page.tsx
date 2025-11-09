'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ACHIEVEMENTS, getTierColor, getTierBadge, checkAchievement } from '@/lib/achievements';
import { useProgression } from '@/hooks/useProgression';

// Disable static generation for this auth-required page
export const dynamic = 'force-dynamic';

/**
 * Achievements page - voir tous les achievements
 */
export default function AchievementsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { stats } = useProgression();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!user) return null;

  // Group achievements by status
  const unlockedAchievements = ACHIEVEMENTS.filter(a =>
    stats.unlockedAchievements.includes(a.id)
  );

  const lockedAchievements = ACHIEVEMENTS.filter(a =>
    !stats.unlockedAchievements.includes(a.id)
  );

  const progress = Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-poker-green via-emerald-800 to-green-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              🎰
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">PokerMind</h1>
              <p className="text-yellow-400 text-xs">Achievements</p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-700">
              <div className="text-right">
                <p className="text-white font-semibold">{user.username}</p>
                <p className="text-yellow-400 text-sm">
                  Level {user.level} • {user.totalChips.toLocaleString()} chips
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Progress overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Your Achievements</h2>
              <p className="text-gray-300">
                {unlockedAchievements.length} of {ACHIEVEMENTS.length} unlocked
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-400 mb-1">{progress}%</div>
              <div className="text-gray-400 text-sm">Complete</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600"
            />
          </div>
        </motion.div>

        {/* Unlocked achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">🏆 Unlocked</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedAchievements.map((achievement, index) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={true}
                  delay={index * 0.05}
                />
              ))}
            </div>
          </div>
        )}

        {/* Locked achievements */}
        {lockedAchievements.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">🔒 Locked</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lockedAchievements.map((achievement, index) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={false}
                  delay={index * 0.05}
                  stats={stats}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Achievement card component
 */
function AchievementCard({
  achievement,
  unlocked,
  delay = 0,
  stats
}: {
  achievement: any;
  unlocked: boolean;
  delay?: number;
  stats?: any;
}) {
  let progressValue = 0;
  let progressMax = achievement.requirement.value;

  if (!unlocked && stats) {
    switch (achievement.requirement.type) {
      case 'hands_played':
        progressValue = stats.handsPlayed;
        break;
      case 'hands_won':
        progressValue = stats.handsWon;
        break;
      case 'level':
        progressValue = stats.level;
        break;
      case 'win_streak':
        progressValue = stats.currentWinStreak;
        break;
      case 'total_chips':
        progressValue = stats.totalChips;
        break;
      case 'coach_grade_a':
        progressValue = stats.coachGradeA;
        break;
      case 'pro_coaches':
        progressValue = stats.proCoaches;
        break;
    }
  }

  const progressPercent = Math.min(100, Math.round((progressValue / progressMax) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`
        rounded-xl p-4 border-2 transition
        ${unlocked
          ? `bg-gradient-to-br ${getTierColor(achievement.tier)} border-white shadow-xl`
          : 'bg-gray-900/50 border-gray-700 opacity-75'
        }
      `}
    >
      <div className="flex items-start space-x-3">
        <div className={`text-4xl ${unlocked ? '' : 'grayscale opacity-50'}`}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className={`font-bold ${unlocked ? 'text-white' : 'text-gray-400'}`}>
              {achievement.name}
            </h4>
            <span className="text-lg">{getTierBadge(achievement.tier)}</span>
          </div>
          <p className={`text-sm mb-2 ${unlocked ? 'text-white/90' : 'text-gray-500'}`}>
            {achievement.description}
          </p>

          {/* Rewards */}
          {(achievement.reward.chips || achievement.reward.xp) && (
            <div className="flex space-x-3 text-xs mb-2">
              {achievement.reward.chips && (
                <span className={unlocked ? 'text-white/80' : 'text-gray-500'}>
                  💰 +{achievement.reward.chips}
                </span>
              )}
              {achievement.reward.xp && (
                <span className={unlocked ? 'text-white/80' : 'text-gray-500'}>
                  ⭐ +{achievement.reward.xp} XP
                </span>
              )}
            </div>
          )}

          {/* Progress for locked achievements */}
          {!unlocked && (
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {progressValue} / {progressMax}
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
            </div>
          )}

          {unlocked && (
            <div className="text-white/80 text-xs font-semibold">
              ✓ UNLOCKED
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
