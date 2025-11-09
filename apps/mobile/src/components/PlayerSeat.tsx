import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';

interface PlayerSeatProps {
  name: string;
  chips: number;
  bet: number;
  cards?: Array<{ rank: string; suit: string }>;
  isActive?: boolean;
  isFolded?: boolean;
  isDealer?: boolean;
  position: 'top' | 'left' | 'right' | 'bottom';
}

export default function PlayerSeat({
  name,
  chips,
  bet,
  cards = [],
  isActive = false,
  isFolded = false,
  isDealer = false,
  position,
}: PlayerSeatProps) {
  const isHuman = position === 'bottom';

  return (
    <View style={[styles.container, isActive && styles.containerActive]}>
      {/* Dealer Button */}
      {isDealer && (
        <View style={styles.dealerButton}>
          <Text style={styles.dealerText}>D</Text>
        </View>
      )}

      {/* Player Info */}
      <View style={styles.infoContainer}>
        <View style={[styles.avatar, isFolded && styles.avatarFolded]}>
          <Text style={styles.avatarText}>{name[0]?.toUpperCase()}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, isFolded && styles.foldedText]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.chips, isFolded && styles.foldedText]}>
            💰 {chips}
          </Text>
        </View>
      </View>

      {/* Bet Amount */}
      {bet > 0 && (
        <View style={styles.betContainer}>
          <Text style={styles.betText}>{bet}</Text>
        </View>
      )}

      {/* Cards */}
      {cards.length > 0 && (
        <View style={styles.cardsContainer}>
          {cards.map((card, index) => (
            <Card
              key={index}
              rank={card.rank}
              suit={card.suit}
              faceDown={!isHuman || isFolded}
              small
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    padding: 8,
    minWidth: 120,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  containerActive: {
    borderColor: '#fbbf24',
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
  },
  dealerButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fbbf24',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  dealerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#047857',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarFolded: {
    backgroundColor: '#64748b',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  chips: {
    fontSize: 12,
    color: '#fbbf24',
    fontWeight: '600',
  },
  foldedText: {
    opacity: 0.5,
  },
  betContainer: {
    backgroundColor: '#fbbf24',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  betText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cardsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'center',
  },
});
