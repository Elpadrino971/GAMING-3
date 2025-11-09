import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useAuth } from '../contexts/AuthContext';
import MobilePokerTable from '../components/MobilePokerTable';
import ActionButtons from '../components/ActionButtons';

// Import shared packages
import { GameEngine } from '@pokermind/poker-engine/src/game-engine';
import { AIPlayer, AI_PERSONALITIES } from '@pokermind/ai-engine/src/ai-player';
import { Street, PlayerAction } from '@pokermind/poker-engine/src/game-state';

type PlayScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Play'>;
  route: RouteProp<RootStackParamList, 'Play'>;
};

export default function PlayScreen({ navigation, route }: PlayScreenProps) {
  const { user, updateUser } = useAuth();
  const { gameMode, buyIn, smallBlind, bigBlind } = route.params;

  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [aiPlayers] = useState<Map<string, AIPlayer>>(new Map());
  const [showWinner, setShowWinner] = useState(false);

  // Initialize game
  useEffect(() => {
    if (!user) return;

    // Create AI opponents
    const aiPersonalities = ['nit', 'tag', 'lag', 'maniac'];
    const players = [
      {
        id: user.id,
        name: user.username,
        stack: buyIn,
        position: 0,
      },
      ...aiPersonalities.map((personality, index) => ({
        id: `ai_${personality}`,
        name: personality.toUpperCase(),
        stack: buyIn,
        position: index + 1,
      })),
    ];

    // Initialize AI players
    aiPersonalities.forEach((personality) => {
      const ai = new AIPlayer(
        `ai_${personality}`,
        AI_PERSONALITIES[personality]
      );
      aiPlayers.set(`ai_${personality}`, ai);
    });

    // Create game engine
    const engine = new GameEngine({
      players,
      smallBlind,
      bigBlind,
    });

    setGameEngine(engine);
    setGameState(engine.getState());
  }, []);

  // Handle AI actions
  useEffect(() => {
    if (!gameState || !gameEngine) return;

    const activePlayer = gameState.players[gameState.activePlayerIndex];
    if (!activePlayer || activePlayer.id === user?.id) return;

    // AI player's turn
    const ai = aiPlayers.get(activePlayer.id);
    if (!ai) return;

    // Delay AI action for realism
    setTimeout(() => {
      const decision = ai.makeDecision(gameState, activePlayer);

      const result = gameEngine.processAction(
        activePlayer.id,
        decision.action,
        decision.amount || 0
      );

      if (result.success) {
        setGameState(gameEngine.getState());

        // Check for winner
        if (result.state.winners && result.state.winners.length > 0) {
          setShowWinner(true);
        }
      }
    }, 1000);
  }, [gameState]);

  const handlePlayerAction = (
    action: 'fold' | 'check' | 'call' | 'raise',
    amount?: number
  ) => {
    if (!gameEngine || !user) return;

    let playerAction: PlayerAction;
    if (action === 'fold') playerAction = PlayerAction.FOLD;
    else if (action === 'check') playerAction = PlayerAction.CHECK;
    else if (action === 'call') playerAction = PlayerAction.CALL;
    else playerAction = PlayerAction.RAISE;

    const result = gameEngine.processAction(user.id, playerAction, amount || 0);

    if (result.success) {
      setGameState(result.state);

      // Check for winner
      if (result.state.winners && result.state.winners.length > 0) {
        setShowWinner(true);
      }
    }
  };

  const handleNextHand = () => {
    if (!gameEngine) return;

    setShowWinner(false);

    // Check if human player is out of chips
    const humanPlayer = gameState.players.find((p: any) => p.id === user?.id);
    if (humanPlayer && humanPlayer.stack <= 0) {
      Alert.alert(
        'Game Over',
        'You ran out of chips!',
        [
          {
            text: 'Leave Table',
            onPress: () => navigation.navigate('Lobby'),
          },
        ]
      );
      return;
    }

    // Start new hand
    gameEngine.startNewHand();
    setGameState(gameEngine.getState());
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
            // Update user chips
            const humanPlayer = gameState?.players.find((p: any) => p.id === user?.id);
            if (humanPlayer && user) {
              const chipsDiff = humanPlayer.stack - buyIn;
              updateUser({ totalChips: user.totalChips + chipsDiff });
            }
            navigation.navigate('Lobby');
          },
        },
      ]
    );
  };

  if (!gameState) {
    return (
      <LinearGradient colors={['#047857', '#065f46']} style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </LinearGradient>
    );
  }

  const humanPlayer = gameState.players.find((p: any) => p.id === user?.id);
  const isHumanTurn = gameState.players[gameState.activePlayerIndex]?.id === user?.id;

  // Get action options
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
    <LinearGradient colors={['#1f2937', '#111827']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLeaveTable}>
          <Text style={styles.leaveButton}>← Leave</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {gameMode === 'cash' ? 'Cash Game' : 'Sit & Go'}
        </Text>
        <View style={styles.headerChips}>
          <Text style={styles.headerChipsText}>💰 {humanPlayer?.stack || 0}</Text>
        </View>
      </View>

      {/* Poker Table */}
      <MobilePokerTable
        players={gameState.players}
        communityCards={gameState.communityCards}
        pot={gameState.pots.reduce((sum: number, pot: any) => sum + pot.amount, 0)}
        dealerIndex={gameState.dealerPosition}
        activePlayerIndex={gameState.activePlayerIndex}
        humanPlayerId={user?.id || ''}
      />

      {/* Action Buttons (only show when it's human's turn) */}
      {isHumanTurn && !showWinner && (
        <ActionButtons
          options={actionOptions}
          onAction={handlePlayerAction}
          pot={gameState.pots.reduce((sum: number, pot: any) => sum + pot.amount, 0)}
        />
      )}

      {/* Winner Modal */}
      <Modal
        visible={showWinner}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.winnerModal}>
            <Text style={styles.winnerTitle}>🏆 Hand Complete</Text>
            {gameState.winners?.map((winner: any, index: number) => (
              <View key={index} style={styles.winnerInfo}>
                <Text style={styles.winnerName}>{winner.playerName}</Text>
                <Text style={styles.winnerAmount}>Won: {winner.amount}</Text>
                <Text style={styles.winnerHand}>{winner.handRank}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.nextHandButton}
              onPress={handleNextHand}
            >
              <LinearGradient
                colors={['#fbbf24', '#f59e0b']}
                style={styles.nextHandGradient}
              >
                <Text style={styles.nextHandText}>Next Hand</Text>
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
  },
  loading: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 24,
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
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
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
  modalOverlay: {
    flex: 1,
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
