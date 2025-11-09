import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export interface CardProps {
  rank: string;
  suit: string;
  faceDown?: boolean;
  small?: boolean;
}

const SUIT_SYMBOLS: Record<string, string> = {
  h: '♥',
  d: '♦',
  c: '♣',
  s: '♠',
};

const SUIT_COLORS: Record<string, string> = {
  h: '#ef4444',
  d: '#ef4444',
  c: '#1f2937',
  s: '#1f2937',
};

export default function Card({ rank, suit, faceDown = false, small = false }: CardProps) {
  const suitSymbol = SUIT_SYMBOLS[suit];
  const suitColor = SUIT_COLORS[suit];

  const cardSize = small ? { width: 35, height: 50 } : { width: 50, height: 70 };

  if (faceDown) {
    return (
      <LinearGradient
        colors={['#1e40af', '#1e3a8a']}
        style={[styles.card, cardSize, styles.cardBack]}
      >
        <View style={styles.cardBackPattern}>
          <Text style={styles.cardBackText}>🎰</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, cardSize, styles.cardFront]}>
      <View style={styles.cardContent}>
        <Text style={[styles.rank, { color: suitColor, fontSize: small ? 16 : 22 }]}>
          {rank}
        </Text>
        <Text style={[styles.suit, { color: suitColor, fontSize: small ? 16 : 22 }]}>
          {suitSymbol}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardFront: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardBack: {
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  cardContent: {
    alignItems: 'center',
  },
  rank: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  suit: {
    fontWeight: 'bold',
  },
  cardBackPattern: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBackText: {
    fontSize: 24,
    opacity: 0.5,
  },
});
