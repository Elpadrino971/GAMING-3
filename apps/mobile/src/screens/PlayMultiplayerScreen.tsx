import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useAuth } from '../contexts/AuthContext';
import { getSocketManager } from '@pokermind/multiplayer';
import MobilePokerTable from '../components/MobilePokerTable';
import ActionButtons from '../components/ActionButtons';
import * as Haptics from 'expo-haptics';

type PlayMultiplayerScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PlayMultiplayer'>;
  route: RouteProp<RootStackParamList, 'PlayMultiplayer'>;
};

export default function PlayMultiplayerScreen({ navigation, route }: PlayMultiplayerScreenProps) {
  const { user } = useAuth();
  const { tableId } = route.params;

  const [gameState, setGameState] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [winners, setWinners] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);

  const socketManager = getSocketManager();

  useEffect(() => {
    if (!tableId || !user) {
      navigation.navigate('MultiplayerLobby');
      return;
    }

    setupMultiplayer();

    return () => {
      // Leave table on unmount
      if (user) {
        socketManager.leaveTable(user.id);
      }
    };
  }, [tableId, user]);

  const setupMultiplayer = async () => {
    try {
      // Connect if not already connected
      if (!socketManager.isConnected()) {
        await socketManager.connect();
      }

      setConnected(true);

      // Listen for game state updates
      socketManager.onGameStateUpdate((newGameState) => {
        console.log('Game state updated');
        setGameState(newGameState);
        setPlayers(newGameState.players || []);

        // Check for winners
        if (newGameState.winners && newGameState.winners.length > 0) {
          setWinners(newGameState.winners);
          setShowWinner(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      });

      // Listen for hand complete
      socketManager.onHandComplete((data) => {
        setWinners(data.winners);
        setShowWinner(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      });

      // Listen for player joined
      socketManager.onPlayerJoined((data) => {
        setChatMessages(prev => [...prev, {
          type: 'system',
          message: `${data.username} joined the table`,
          timestamp: Date.now(),
        }]);
      });

      // Listen for player left
      socketManager.onPlayerLeft((data) => {
        setChatMessages(prev => [...prev, {
          type: 'system',
          message: 'A player left the table',
          timestamp: Date.now(),
        }]);
      });

      // Listen for chat messages
      socketManager.onNewMessage((data) => {
        setChatMessages(prev => [...prev, {
          type: 'chat',
          username: data.username,
          message: data.message,
          timestamp: data.timestamp,
        }]);
      });

      // Listen for game started
      socketManager.onGameStarted((data) => {
        setGameState(data.gameState);
      });

    } catch (error) {
      console.error('Failed to setup multiplayer:', error);
      Alert.alert(
        'Connection Error',
        'Failed to connect to multiplayer server',
        [
          { text: 'OK', onPress: () => navigation.navigate('MultiplayerLobby') },
        ]
      );
    }
  };

  const handlePlayerAction = (action: 'fold' | 'check' | 'call' | 'raise', amount?: number) => {
    if (!user || !tableId) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    socketManager.sendAction({
      tableId,
      playerId: user.id,
      action,
      amount,
    });
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !user || !tableId) return;

    socketManager.sendMessage(tableId, user.id, chatInput);
    setChatInput('');
  };

  const handleLeaveTable = () => {
    Alert.alert(
      'Leave Table?',
      'Are you sure you want to leave?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            if (user) {
              socketManager.leaveTable(user.id);
            }
            navigation.navigate('MultiplayerLobby');
          },
        },
      ]
    );
  };

  const handleNextHand = () => {
    setShowWinner(false);
    setWinners([]);
  };

  if (!connected || !gameState) {
    return (
      <LinearGradient colors={['#1f2937', '#111827']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingIcon}>🎰</Text>
          <Text style={styles.loadingText}>Connecting to table...</Text>
        </View>
      </LinearGradient>
    );
  }

  const humanPlayer = players.find(p => p.id === user?.id);
  const isHumanTurn = gameState.players[gameState.activePlayerIndex]?.id === user?.id;

  const actionOptions = {
    canCheck: gameState.currentBet === humanPlayer?.bet,
    canCall: gameState.currentBet > humanPlayer?.bet,
    canRaise: humanPlayer?.stack > (gameState.currentBet - humanPlayer?.bet),
    canFold: true,
    callAmount: gameState.currentBet - (humanPlayer?.bet || 0),
    minRaise: gameState.minRaise,
    maxRaise: humanPlayer?.stack || 0,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient colors={['#1f2937', '#111827']} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLeaveTable}>
            <Text style={styles.leaveButton}>← Leave</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Multiplayer</Text>
            <Text style={styles.playersOnline}>🟢 {players.length} online</Text>
          </View>
          <View style={styles.headerChips}>
            <Text style={styles.headerChipsText}>💰 {humanPlayer?.stack || 0}</Text>
          </View>
        </View>

        {/* Poker Table */}
        <View style={styles.tableContainer}>
          <MobilePokerTable
            players={players}
            communityCards={gameState.communityCards || []}
            pot={gameState.pots?.reduce((sum: number, pot: any) => sum + pot.amount, 0) || 0}
            dealerIndex={gameState.dealerPosition}
            activePlayerIndex={gameState.activePlayerIndex}
            humanPlayerId={user?.id || ''}
          />
        </View>

        {/* Chat Toggle */}
        <TouchableOpacity
          style={styles.chatToggle}
          onPress={() => setShowChat(!showChat)}
        >
          <Text style={styles.chatToggleText}>💬 {chatMessages.length}</Text>
        </TouchableOpacity>

        {/* Chat Overlay */}
        {showChat && (
          <View style={styles.chatOverlay}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>Chat</Text>
              <TouchableOpacity onPress={() => setShowChat(false)}>
                <Text style={styles.chatClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.chatMessages}>
              {chatMessages.map((msg, index) => (
                <View key={index} style={styles.chatMessage}>
                  {msg.type === 'system' ? (
                    <Text style={styles.chatMessageSystem}>{msg.message}</Text>
                  ) : (
                    <>
                      <Text style={styles.chatMessageUsername}>{msg.username}:</Text>
                      <Text style={styles.chatMessageText}>{msg.message}</Text>
                    </>
                  )}
                </View>
              ))}
            </ScrollView>
            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Type a message..."
                placeholderTextColor="#94a3b8"
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity style={styles.chatSendButton} onPress={handleSendMessage}>
                <Text style={styles.chatSendText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {isHumanTurn && !showWinner && !showChat && (
          <ActionButtons
            options={actionOptions}
            onAction={handlePlayerAction}
            pot={gameState.pots?.reduce((sum: number, pot: any) => sum + pot.amount, 0) || 0}
          />
        )}

        {/* Winner Modal */}
        {showWinner && winners.length > 0 && (
          <View style={styles.modalOverlay}>
            <View style={styles.winnerModal}>
              <Text style={styles.winnerTitle}>🏆 Hand Complete</Text>
              {winners.map((winner, index) => (
                <View key={index} style={styles.winnerInfo}>
                  <Text style={styles.winnerName}>{winner.playerName}</Text>
                  <Text style={styles.winnerAmount}>Won: {winner.amount}</Text>
                  <Text style={styles.winnerHand}>{winner.handRank}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.nextHandButton} onPress={handleNextHand}>
                <LinearGradient
                  colors={['#fbbf24', '#f59e0b']}
                  style={styles.nextHandGradient}
                >
                  <Text style={styles.nextHandText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 40,
  },
  leaveButton: {
    fontSize: 16,
    color: '#fbbf24',
    fontWeight: '600',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  playersOnline: {
    fontSize: 12,
    color: '#10b981',
  },
  headerChips: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerChipsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  tableContainer: {
    flex: 1,
  },
  chatToggle: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: '#1f2937',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  chatToggleText: {
    color: '#fbbf24',
    fontWeight: 'bold',
  },
  chatOverlay: {
    position: 'absolute',
    top: 80,
    right: 20,
    bottom: 20,
    width: 250,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fbbf24',
    padding: 15,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  chatClose: {
    fontSize: 24,
    color: '#fff',
  },
  chatMessages: {
    flex: 1,
    marginBottom: 10,
  },
  chatMessage: {
    marginBottom: 8,
  },
  chatMessageSystem: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  chatMessageUsername: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  chatMessageText: {
    fontSize: 14,
    color: '#fff',
  },
  chatInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#fff',
    fontSize: 14,
  },
  chatSendButton: {
    backgroundColor: '#fbbf24',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  chatSendText: {
    color: '#1f2937',
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerModal: {
    backgroundColor: '#1f2937',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fbbf24',
  },
  winnerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 20,
  },
  winnerInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  winnerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  winnerAmount: {
    fontSize: 18,
    color: '#10b981',
    fontWeight: '600',
    marginBottom: 5,
  },
  winnerHand: {
    fontSize: 16,
    color: '#d1fae5',
  },
  nextHandButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  nextHandGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  nextHandText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});
