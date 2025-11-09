import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../contexts/AuthContext';
import { getSocketManager } from '@pokermind/multiplayer';
import type { Table } from '@pokermind/multiplayer';

type MultiplayerLobbyScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MultiplayerLobby'>;
};

const STAKES_OPTIONS = [
  { value: 'micro', label: 'Micro', smallBlind: 1, bigBlind: 2, minBuyIn: 40 },
  { value: 'low', label: 'Low', smallBlind: 5, bigBlind: 10, minBuyIn: 200 },
  { value: 'medium', label: 'Medium', smallBlind: 10, bigBlind: 20, minBuyIn: 400 },
  { value: 'high', label: 'High', smallBlind: 25, bigBlind: 50, minBuyIn: 1000 },
];

export default function MultiplayerLobbyScreen({ navigation }: MultiplayerLobbyScreenProps) {
  const { user } = useAuth();
  const [selectedStakes, setSelectedStakes] = useState(STAKES_OPTIONS[0]);
  const [buyInAmount, setBuyInAmount] = useState(200);
  const [searching, setSearching] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Change this to your deployed server URL
  const MULTIPLAYER_SERVER = 'http://192.168.1.100:3001'; // Use your local IP for testing

  const socketManager = getSocketManager(MULTIPLAYER_SERVER);

  useEffect(() => {
    connectToServer();

    return () => {
      if (searching && user) {
        socketManager.cancelMatchmaking(user.id);
      }
    };
  }, []);

  const connectToServer = async () => {
    try {
      await socketManager.connect();
      setConnected(true);
      setConnectionError(null);

      // Listen for match found
      socketManager.onMatchFound((data) => {
        if (data.matched) {
          setSearching(false);
          // Navigate to multiplayer game
          navigation.navigate('PlayMultiplayer', { tableId: data.tableId });
        } else if (data.searching) {
          setSearching(true);
        }
      });

      // Listen for errors
      socketManager.onError((error) => {
        console.error('Socket error:', error);
        setConnectionError(error.message);
        Alert.alert('Connection Error', error.message);
      });

    } catch (error) {
      console.error('Failed to connect:', error);
      setConnectionError('Unable to connect to multiplayer server');
      setConnected(false);
      Alert.alert(
        'Connection Failed',
        'Unable to connect to multiplayer server. Please check your internet connection.',
        [
          { text: 'Retry', onPress: connectToServer },
          { text: 'Go Back', onPress: () => navigation.goBack() },
        ]
      );
    }
  };

  const handleQuickMatch = () => {
    if (!user) return;

    if (user.totalChips < buyInAmount) {
      Alert.alert(
        'Insufficient Chips',
        `You need at least ${buyInAmount} chips to play.`
      );
      return;
    }

    setSearching(true);

    socketManager.findMatch({
      playerId: user.id,
      username: user.username,
      gameType: 'cash',
      stakes: selectedStakes.value as any,
      buyIn: buyInAmount,
    });
  };

  const handleCancelSearch = () => {
    if (user) {
      socketManager.cancelMatchmaking(user.id);
      setSearching(false);
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
          <Text style={styles.title}>Multiplayer</Text>
          <View style={styles.chipDisplay}>
            <Text style={styles.chipText}>💰 {user?.totalChips || 0}</Text>
          </View>
        </View>

        {/* Connection Status */}
        {!connected && (
          <View style={styles.connectionStatus}>
            {connectionError ? (
              <>
                <Text style={styles.errorText}>⚠️ {connectionError}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={connectToServer}>
                  <Text style={styles.retryButtonText}>Retry Connection</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <ActivityIndicator size="large" color="#fbbf24" />
                <Text style={styles.connectingText}>Connecting to server...</Text>
              </>
            )}
          </View>
        )}

        {connected && !searching && (
          <>
            {/* Stakes Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Stakes</Text>
              <View style={styles.stakesGrid}>
                {STAKES_OPTIONS.map((stakes) => (
                  <TouchableOpacity
                    key={stakes.value}
                    style={[
                      styles.stakesCard,
                      selectedStakes.value === stakes.value && styles.stakesCardActive,
                    ]}
                    onPress={() => {
                      setSelectedStakes(stakes);
                      setBuyInAmount(stakes.minBuyIn);
                    }}
                  >
                    <Text style={styles.stakesLabel}>{stakes.label}</Text>
                    <Text style={styles.stakesBlinds}>
                      {stakes.smallBlind}/{stakes.bigBlind}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Buy-in Amount */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Buy-in: {buyInAmount} chips</Text>
              <View style={styles.buyInButtons}>
                {[1, 2, 3, 5].map((multiplier) => (
                  <TouchableOpacity
                    key={multiplier}
                    style={styles.buyInButton}
                    onPress={() => setBuyInAmount(selectedStakes.minBuyIn * multiplier)}
                  >
                    <Text style={styles.buyInButtonText}>{multiplier}x</Text>
                    <Text style={styles.buyInAmount}>
                      {selectedStakes.minBuyIn * multiplier}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Find Match Button */}
            <TouchableOpacity style={styles.findMatchButton} onPress={handleQuickMatch}>
              <LinearGradient
                colors={['#fbbf24', '#f59e0b']}
                style={styles.findMatchGradient}
              >
                <Text style={styles.findMatchText}>🎮 Find Match</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {/* Searching Animation */}
        {searching && (
          <View style={styles.searchingContainer}>
            <Text style={styles.searchingIcon}>🔍</Text>
            <Text style={styles.searchingTitle}>Searching for players...</Text>
            <Text style={styles.searchingInfo}>
              Stakes: {selectedStakes.label} | Buy-in: {buyInAmount}
            </Text>
            <ActivityIndicator size="large" color="#fbbf24" style={styles.spinner} />
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSearch}>
              <Text style={styles.cancelButtonText}>Cancel Search</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginTop: 20,
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
  connectionStatus: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  connectingText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 15,
  },
  retryButton: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  stakesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  stakesCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  stakesCardActive: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderColor: '#fbbf24',
  },
  stakesLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  stakesBlinds: {
    fontSize: 14,
    color: '#d1fae5',
  },
  buyInButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  buyInButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buyInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  buyInAmount: {
    fontSize: 14,
    color: '#fbbf24',
  },
  findMatchButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  findMatchGradient: {
    padding: 18,
    alignItems: 'center',
  },
  findMatchText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  searchingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  searchingIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  searchingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  searchingInfo: {
    fontSize: 16,
    color: '#d1fae5',
    marginBottom: 30,
    textAlign: 'center',
  },
  spinner: {
    marginBottom: 30,
  },
  cancelButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
