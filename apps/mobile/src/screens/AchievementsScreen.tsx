import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../contexts/AuthContext';

type AchievementsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Achievements'>;
};

// Simplified achievements for mobile
const ACHIEVEMENTS = [
  { id: 'first_hand', name: 'First Hand', icon: '🎯', requirement: 1, type: 'hands' },
  { id: 'poker_novice', name: 'Poker Novice', icon: '🃏', requirement: 10, type: 'hands' },
  { id: 'card_shark', name: 'Card Shark', icon: '🦈', requirement: 50, type: 'hands' },
  { id: 'poker_pro', name: 'Poker Pro', icon: '💪', requirement: 100, type: 'hands' },
  { id: 'first_win', name: 'First Win', icon: '🏆', requirement: 1, type: 'wins' },
  { id: 'winning_streak', name: 'Winning Streak', icon: '🔥', requirement: 5, type: 'wins' },
  { id: 'chip_collector', name: 'Chip Collector', icon: '💰', requirement: 10000, type: 'chips' },
  { id: 'high_roller', name: 'High Roller', icon: '💎', requirement: 50000, type: 'chips' },
];

export default function AchievementsScreen({ navigation }: AchievementsScreenProps) {
  const { user } = useAuth();

  const getProgress = (achievement: any) => {
    if (!user) return 0;

    if (achievement.type === 'hands') {
      return Math.min((user.handsPlayed / achievement.requirement) * 100, 100);
    } else if (achievement.type === 'wins') {
      return Math.min((user.handsWon / achievement.requirement) * 100, 100);
    } else if (achievement.type === 'chips') {
      return Math.min((user.totalChips / achievement.requirement) * 100, 100);
    }
    return 0;
  };

  const isUnlocked = (achievement: any) => {
    return getProgress(achievement) >= 100;
  };

  return (
    <LinearGradient colors={['#047857', '#065f46']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Achievements</Text>
        <View style={styles.placeholder} />
      </View>

      {/* User Stats */}
      {user && (
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.handsPlayed}</Text>
            <Text style={styles.statLabel}>Hands Played</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.handsWon}</Text>
            <Text style={styles.statLabel}>Hands Won</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>⭐ {user.level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>
      )}

      {/* Achievements List */}
      <ScrollView style={styles.achievementsList}>
        {ACHIEVEMENTS.map((achievement) => {
          const progress = getProgress(achievement);
          const unlocked = isUnlocked(achievement);

          return (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                unlocked && styles.achievementCardUnlocked,
              ]}
            >
              <View style={styles.achievementIcon}>
                <Text style={styles.achievementIconText}>
                  {achievement.icon}
                </Text>
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementName}>{achievement.name}</Text>
                <Text style={styles.achievementRequirement}>
                  {achievement.requirement} {achievement.type}
                </Text>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${progress}%` },
                      unlocked && styles.progressBarComplete,
                    ]}
                  />
                </View>
                {unlocked && (
                  <Text style={styles.unlockedText}>✓ Unlocked</Text>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    fontSize: 16,
    color: '#fbbf24',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 50,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#d1fae5',
  },
  achievementsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementCardUnlocked: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementIconText: {
    fontSize: 32,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  achievementRequirement: {
    fontSize: 14,
    color: '#d1fae5',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  progressBarComplete: {
    backgroundColor: '#fbbf24',
  },
  unlockedText: {
    fontSize: 14,
    color: '#fbbf24',
    fontWeight: '600',
    marginTop: 5,
  },
});
