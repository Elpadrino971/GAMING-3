export interface Card {
  rank: string; // '2'-'9', 'T', 'J', 'Q', 'K', 'A'
  suit: string; // 'h', 'd', 'c', 's'
}

export interface EquityResult {
  equity: number; // 0-1
  wins: number;
  ties: number;
  losses: number;
  iterations: number;
}

export interface HandStrength {
  rank: number; // 0-9 (High Card to Royal Flush)
  name: string;
  description: string;
}
