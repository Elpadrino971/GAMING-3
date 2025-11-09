import { Hand } from 'pokersolver';
import { Card, HandStrength } from './types';

export class HandEvaluator {
  /**
   * Évalue une main de poker (5-7 cartes)
   */
  evaluateHand(cards: Card[]): HandStrength {
    // Convertir au format pokersolver
    const handString = cards.map(c => `${c.rank}${c.suit}`);
    const hand = Hand.solve(handString);

    return {
      rank: hand.rank,
      name: hand.name,
      description: hand.descr
    };
  }

  /**
   * Compare deux mains
   * @returns 1 si hand1 gagne, -1 si hand2 gagne, 0 si égalité
   */
  compareHands(cards1: Card[], cards2: Card[]): number {
    const hand1String = cards1.map(c => `${c.rank}${c.suit}`);
    const hand2String = cards2.map(c => `${c.rank}${c.suit}`);

    const hand1 = Hand.solve(hand1String);
    const hand2 = Hand.solve(hand2String);

    const winners = Hand.winners([hand1, hand2]);

    if (winners.length === 2) return 0; // Tie
    if (winners[0] === hand1) return 1;
    return -1;
  }

  /**
   * Trouve la meilleure main parmi plusieurs
   */
  findBestHand(allHands: Card[][]): { hand: Card[], strength: HandStrength } {
    const evaluations = allHands.map(cards => ({
      cards,
      strength: this.evaluateHand(cards)
    }));

    evaluations.sort((a, b) => {
      const handA = Hand.solve(a.cards.map(c => `${c.rank}${c.suit}`));
      const handB = Hand.solve(b.cards.map(c => `${c.rank}${c.suit}`));
      const winners = Hand.winners([handA, handB]);
      if (winners[0] === handA) return -1;
      if (winners[0] === handB) return 1;
      return 0;
    });

    return {
      hand: evaluations[0].cards,
      strength: evaluations[0].strength
    };
  }

  /**
   * Calcule la force relative d'une main (0-1)
   */
  getHandStrengthNormalized(cards: Card[]): number {
    const strength = this.evaluateHand(cards);

    // Normalisation approximative basée sur le rank
    // Rank 0 (High Card) à Rank 9 (Royal Flush)
    return strength.rank / 9;
  }
}
