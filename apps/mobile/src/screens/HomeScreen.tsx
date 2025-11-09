import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../contexts/AuthContext';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user, isAuthenticated, login } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');

  React.useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    if (username.trim()) {
      await login(username.trim());
      setShowLoginModal(false);
    }
  };

  return (
    <LinearGradient colors={['#047857', '#065f46']} style={styles.container}>
      {/* Logo & Title */}
      <View style={styles.header}>
        <Text style={styles.logo}>🎰</Text>
        <Text style={styles.title}>PokerMind</Text>
        <Text style={styles.subtitle}>AI-Powered Poker Training</Text>
      </View>

      {/* User Info */}
      {isAuthenticated && user && (
        <View style={styles.userCard}>
          <Text style={styles.userName}>{user.username}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>💰 {user.totalChips}</Text>
              <Text style={styles.statLabel}>Chips</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>⭐ {user.level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>🎯 {user.handsPlayed}</Text>
              <Text style={styles.statLabel}>Hands</Text>
            </View>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Lobby')}
        >
          <LinearGradient
            colors={['#fbbf24', '#f59e0b']}
            style={styles.buttonGradient}
          >
            <Text style={styles.primaryButtonText}>🎮 Play Now</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('MultiplayerLobby')}
        >
          <Text style={styles.secondaryButtonText}>🌐 Multiplayer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Achievements')}
        >
          <Text style={styles.secondaryButtonText}>🏆 Achievements</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('ProMarketplace')}
        >
          <Text style={styles.secondaryButtonText}>👨‍🏫 Pro Coaches</Text>
        </TouchableOpacity>
      </View>

      {/* Login Modal */}
      <Modal
        visible={showLoginModal}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Welcome to PokerMind</Text>
            <Text style={styles.modalSubtitle}>Enter your username to start</Text>

            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#94a3b8"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={!username.trim()}
            >
              <LinearGradient
                colors={username.trim() ? ['#fbbf24', '#f59e0b'] : ['#64748b', '#475569']}
                style={styles.buttonGradient}
              >
                <Text style={styles.loginButtonText}>Start Playing</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#d1fae5',
  },
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    marginBottom: 30,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#d1fae5',
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 15,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1f2937',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 25,
  },
  input: {
    width: '100%',
    backgroundColor: '#374151',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  loginButton: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});
