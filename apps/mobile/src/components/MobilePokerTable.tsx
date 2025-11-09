import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PlayerSeat from './PlayerSeat';
import Card from './Card';

const { width, height } = Dimensions.get('window');

interface Player {
  id: string;
  name: string;
  chips: number;
  bet: number;
  holeCards: Array<{ rank: string; suit: string }>;
  isFolded: boolean;
  isActive: boolean;
}

interface MobilePokerTableProps {
  players: Player[];
  communityCards: Array<{ rank: string; suit: string }>;
  pot: number;
  dealerIndex: number;
  activePlayerIndex: number;
  humanPlayerId: string;
}

export default function MobilePokerTable({
  players,
  communityCards,
  pot,
  dealerIndex,
  activePlayerIndex,
  humanPlayerId,
}: MobilePokerTableProps) {
  // Reorder players so human is at bottom
  const humanIndex = players.findIndex(p => p.id === humanPlayerId);
  const reorderedPlayers = [...players];
  if (humanIndex !== -1) {
    const [human] = reorderedPlayers.splice(humanIndex, 1);
    reorderedPlayers.push(human);
  }

  // Position players around the table
  const getPlayerPosition = (index: number): 'top' | 'left' | 'right' | 'bottom' => {
    const totalPlayers = reorderedPlayers.length;
    const humanIndex = totalPlayers - 1;

    if (index === humanIndex) return 'bottom';
    if (totalPlayers === 2) return 'top';
    if (totalPlayers === 3) {
      if (index === 0) return 'left';
      if (index === 1) return 'right';
    }
    if (totalPlayers === 4) {
      if (index === 0) return 'left';
      if (index === 1) return 'top';
      if (index === 2) return 'right';
    }
    if (totalPlayers >= 5) {
      if (index === 0 || index === 1) return 'left';
      if (index === 2) return 'top';
      if (index === 3 || index === 4) return 'right';
    }
    return 'top';
  };

  const renderPlayerInPosition = (position: 'top' | 'left' | 'right' | 'bottom') => {
    const playersInPosition = reorderedPlayers
      .map((player, index) => ({ player, index, position: getPlayerPosition(index) }))
      .filter(p => p.position === position);

    return (
      <View style={styles[`${position}Players`]}>
        {playersInPosition.map(({ player, index }) => {
          const originalIndex = players.findIndex(p => p.id === player.id);
          const isDealer = originalIndex === dealerIndex;
          const isActive = originalIndex === activePlayerIndex;

          return (
            <PlayerSeat
              key={player.id}
              name={player.name}
              chips={player.chips}
              bet={player.bet}
              cards={player.holeCards}
              isActive={isActive}
              isFolded={player.isFolded}
              isDealer={isDealer}
              position={position}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Poker Table Background */}
      <LinearGradient
        colors={['#047857', '#059669']}
        style={styles.table}
      >
        {/* Table Border */}
        <View style={styles.tableBorder}>
          {/* Top Players */}
          {renderPlayerInPosition('top')}

          {/* Middle Row */}
          <View style={styles.middleRow}>
            {/* Left Players */}
            {renderPlayerInPosition('left')}

            {/* Center (Community Cards & Pot) */}
            <View style={styles.center}>
              {/* Community Cards */}
              {communityCards.length > 0 && (
                <View style={styles.communityCards}>
                  {communityCards.map((card, index) => (
                    <Card
                      key={index}
                      rank={card.rank}
                      suit={card.suit}
                    />
                  ))}
                </View>
              )}

              {/* Pot */}
              <View style={styles.potContainer}>
                <Text style={styles.potLabel}>Pot</Text>
                <Text style={styles.potAmount}>💰 {pot}</Text>
              </View>
            </View>

            {/* Right Players */}
            {renderPlayerInPosition('right')}
          </View>

          {/* Bottom Players (Human) */}
          {renderPlayerInPosition('bottom')}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  table: {
    width: width - 20,
    height: height * 0.7,
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  tableBorder: {
    flex: 1,
    margin: 10,
    borderWidth: 8,
    borderColor: '#fbbf24',
    borderRadius: 15,
    padding: 10,
    justifyContent: 'space-between',
  },
  topPlayers: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  bottomPlayers: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  leftPlayers: {
    justifyContent: 'center',
    gap: 10,
  },
  rightPlayers: {
    justifyContent: 'center',
    gap: 10,
  },
  middleRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  communityCards: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  potContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  potLabel: {
    fontSize: 14,
    color: '#d1fae5',
    textAlign: 'center',
    marginBottom: 5,
  },
  potAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fbbf24',
    textAlign: 'center',
  },
});
