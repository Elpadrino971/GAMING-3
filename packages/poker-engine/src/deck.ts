import { Card } from './types';

export class Deck {
  private cards: Card[] = [];

  constructor() {
    this.reset();
  }

  /**
   * Crée un deck complet de 52 cartes
   */
  reset(): void {
    this.cards = [];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const suits = ['h', 'd', 'c', 's'];

    for (const suit of suits) {
      for (const rank of ranks) {
        this.cards.push({ rank, suit });
      }
    }
  }

  /**
   * Mélange le deck (Fisher-Yates)
   */
  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  /**
   * Retire des cartes du deck (pour éviter de redistribuer des cartes connues)
   */
  removeCards(cardsToRemove: Card[]): void {
    this.cards = this.cards.filter(card =>
      !cardsToRemove.some(c => c.rank === card.rank && c.suit === card.suit)
    );
  }

  /**
   * Tire une carte du deck
   */
  dealOne(): Card | undefined {
    return this.cards.pop();
  }

  /**
   * Alias for dealOne()
   */
  deal(): Card {
    const card = this.cards.pop();
    if (!card) throw new Error('No cards left in deck');
    return card;
  }

  /**
   * Tire plusieurs cartes
   */
  dealMany(count: number): Card[] {
    const dealt: Card[] = [];
    for (let i = 0; i < count; i++) {
      const card = this.dealOne();
      if (card) dealt.push(card);
    }
    return dealt;
  }

  /**
   * Nombre de cartes restantes
   */
  get remaining(): number {
    return this.cards.length;
  }

  /**
   * Clone le deck
   */
  clone(): Deck {
    const newDeck = new Deck();
    newDeck.cards = [...this.cards];
    return newDeck;
  }
}
