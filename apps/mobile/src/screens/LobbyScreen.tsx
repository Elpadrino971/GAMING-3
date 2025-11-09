import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../contexts/AuthContext';

type LobbyScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Lobby'>;
};

type GameMode = 'cash' | 'sng';

interface Stakes {
  name: string;
  smallBlind: number;
  bigBlind: number;
  minBuyIn: number;
  maxBuyIn: number;
}

const CASH_GAME_STAKES: Stakes[] = [
  { name: 'Micro', smallBlind: 1, bigBlind: 2, minBuyIn: 40, maxBuyIn: 200 },
  { name: 'Low', smallBlind: 5, bigBlind: 10, minBuyIn: 200, maxBuyIn: 1000 },
  { name: 'Medium', smallBlind: 10, bigBlind: 20, minBuyIn: 400, maxBuyIn: 2000 },
  { name: 'High', smallBlind: 25, bigBlind: 50, minBuyIn: 1000, maxBuyIn: 5000 },
];

const SNG_BUY_INS = [
  { name: 'Beginner', buyIn: 100, prize: 500 },
  { name: 'Amateur', buyIn: 250, prize: 1250 },
  { name: 'Intermediate', buyIn: 500, prize: 2500 },
  { name: 'Advanced', buyIn: 1000, prize: 5000 },
  { name: 'Pro', buyIn: 2000, prize: 10000 },
];

export default function LobbyScreen({ navigation }: LobbyScreenProps) {
  const { user } = useAuth();
  const [gameMode, setGameMode] = useState<GameMode>('cash');
  const [selectedStakes, setSelectedStakes] = useState<Stakes>(CASH_GAME_STAKES[0]);
  const [selectedSNG, setSelectedSNG] = useState(SNG_BUY_INS[0]);

  const handlePlay = () => {
    if (!user) return;

    if (gameMode === 'cash') {
      if (user.totalChips < selectedStakes.minBuyIn) {
        Alert.alert(
          'Insufficient Chips',
          `You need at least ${selectedStakes.minBuyIn} chips to play this table.`
        );
        return;
      }

      navigation.navigate('Play', {
        gameMode: 'cash',
        buyIn: selectedStakes.minBuyIn,
        smallBlind: selectedStakes.smallBlind,
        bigBlind: selectedStakes.bigBlind,
      });
    } else {
      if (user.totalChips < selectedSNG.buyIn) {
        Alert.alert(
          'Insufficient Chips',
          `You need ${selectedSNG.buyIn} chips to enter this tournament.`
        );
        return;
      }

      navigation.navigate('Play', {
        gameMode: 'sng',
        buyIn: selectedSNG.buyIn,
        smallBlind: 10,
        bigBlind: 20,
      });
    }
  };

  return (
    <LinearGradient colors={['#047857', '#065f46']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Game Lobby</Text>
          <View style={styles.chipDisplay}>
            <Text style={styles.chipText}>💰 {user?.totalChips || 0}</Text>
          </View>
        </View>

        {/* Game Mode Selector */}
        <View style={styles.modeSelectorContainer}>
          <TouchableOpacity
            style={[styles.modeButton, gameMode === 'cash' && styles.modeButtonActive]}
            onPress={() => setGameMode('cash')}
          >
            <Text style={[styles.modeText, gameMode === 'cash' && styles.modeTextActive]}>
              💵 Cash Game
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, gameMode === 'sng' && styles.modeButtonActive]}
            onPress={() => setGameMode('sng')}
          >
            <Text style={[styles.modeText, gameMode === 'sng' && styles.modeTextActive]}>
              🏆 Sit & Go
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cash Game Stakes */}
        {gameMode === 'cash' && (
          <View style={styles.optionsContainer}>
            <Text style={styles.sectionTitle}>Select Stakes</Text>
            {CASH_GAME_STAKES.map((stakes, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionCard,
                  selectedStakes === stakes && styles.optionCardActive,
                ]}
                onPress={() => setSelectedStakes(stakes)}
              >
                <View style={styles.optionInfo}>
                  <Text style={styles.optionName}>{stakes.name}</Text>
                  <Text style={styles.optionDetail}>
                    Blinds: {stakes.smallBlind}/{stakes.bigBlind}
                  </Text>
                  <Text style={styles.optionDetail}>
                    Buy-in: {stakes.minBuyIn}-{stakes.maxBuyIn}
                  </Text>
                </View>
                {selectedStakes === stakes && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* SNG Buy-ins */}
        {gameMode === 'sng' && (
          <View style={styles.optionsContainer}>
            <Text style={styles.sectionTitle}>Select Tournament</Text>
            {SNG_BUY_INS.map((sng, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionCard,
                  selectedSNG === sng && styles.optionCardActive,
                ]}
                onPress={() => setSelectedSNG(sng)}
              >
                <View style={styles.optionInfo}>
                  <Text style={styles.optionName}>{sng.name}</Text>
                  <Text style={styles.optionDetail}>Buy-in: {sng.buyIn}</Text>
                  <Text style={styles.optionPrize}>Prize: {sng.prize} 💰</Text>
                </View>
                {selectedSNG === sng && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Play Button */}
        <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
          <LinearGradient
            colors={['#fbbf24', '#f59e0b']}
            style={styles.playButtonGradient}
          >
            <Text style={styles.playButtonText}>
              {gameMode === 'cash'
                ? `Play ${selectedStakes.name} (${selectedStakes.minBuyIn} chips)`
                : `Enter Tournament (${selectedSNG.buyIn} chips)`
              }
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    fontSize: 18,
    color: '#fbbf24',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  chipDisplay: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  modeSelectorContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  modeButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modeButtonActive: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderColor: '#fbbf24',
  },
  modeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d1fae5',
  },
  modeTextActive: {
    color: '#fbbf24',
  },
  optionsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardActive: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderColor: '#fbbf24',
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  optionDetail: {
    fontSize: 14,
    color: '#d1fae5',
  },
  optionPrize: {
    fontSize: 14,
    color: '#fbbf24',
    fontWeight: '600',
  },
  checkMark: {
    fontSize: 24,
    color: '#fbbf24',
  },
  playButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  playButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});
