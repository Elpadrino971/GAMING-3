/**
 * Types pour le moteur d'analyse IA
 */

export interface Card {
  rank: string;
  suit: string;
}

export interface HandState {
  holeCards: Card[];
  communityCards: Card[];
  position: Position;
  pot: number;
  stackSize: number;
  toCall: number;
  numPlayers: number;
  street: Street;
  actions: Action[];
}

export enum Position {
  SmallBlind = 'SB',
  BigBlind = 'BB',
  UnderTheGun = 'UTG',
  MiddlePosition = 'MP',
  Cutoff = 'CO',
  Button = 'BTN'
}

export enum Street {
  PreFlop = 'preflop',
  Flop = 'flop',
  Turn = 'turn',
  River = 'river'
}

export enum ActionType {
  Fold = 'fold',
  Check = 'check',
  Call = 'call',
  Bet = 'bet',
  Raise = 'raise',
  AllIn = 'all-in'
}

export interface Action {
  player: string;
  type: ActionType;
  amount?: number;
  timestamp: Date;
}

export interface GTORecommendation {
  action: ActionType;
  amount?: number;
  frequency: number; // 0-1, pour les stratégies mixtes
  reasoning: string;
  alternatives: Array<{
    action: ActionType;
    amount?: number;
    frequency: number;
    ev: number;
  }>;
}

export interface RangeAnalysis {
  estimatedRange: string[];
  rangeStrength: number; // 0-1
  topPairs: number;
  middlePairs: number;
  bottomPairs: number;
  draws: number;
  bluffs: number;
}

export interface HandAnalysis {
  equity: number;
  potOdds: number;
  impliedOdds: number;
  gtoRecommendation: GTORecommendation;
  playerDecision: Action;
  isOptimal: boolean;
  optimality: number; // 0-1
  mistakes: Mistake[];
  suggestions: string[];
  expectedValue: number;
}

export interface Mistake {
  type: MistakeType;
  severity: Severity;
  description: string;
  betterAction: ActionType;
  evLoss: number;
}

export enum MistakeType {
  PoorFold = 'poor_fold',
  PoorCall = 'poor_call',
  PoorBet = 'poor_bet',
  PoorRaise = 'poor_raise',
  MissedValue = 'missed_value',
  OverBluff = 'over_bluff',
  UnderBluff = 'under_bluff',
  SizingError = 'sizing_error'
}

export enum Severity {
  Minor = 'minor',
  Moderate = 'moderate',
  Major = 'major',
  Critical = 'critical'
}

export interface CoachingAdvice {
  mode: CoachMode;
  advice: string;
  priority: Priority;
  category: AdviceCategory;
  actionable: boolean;
}

export enum CoachMode {
  Light = 'light',
  Pro = 'pro',
  Mentor = 'mentor'
}

export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical'
}

export enum AdviceCategory {
  PreFlop = 'preflop',
  PostFlop = 'postflop',
  Betting = 'betting',
  Position = 'position',
  RangeReading = 'range_reading',
  Bluffing = 'bluffing',
  ValueBetting = 'value_betting',
  BankrollManagement = 'bankroll_management',
  Emotional = 'emotional'
}

export interface PlayerStats {
  vpip: number; // Voluntary Put In Pot
  pfr: number; // Pre-Flop Raise
  aggressionFactor: number;
  cBetPercentage: number;
  foldToCBet: number;
  threeBetPercentage: number;
  wtsd: number; // Went To ShowDown
  wsd: number; // Won at ShowDown
}

export interface SessionAnalysis {
  overallPerformance: number; // 0-100
  idi: number; // Indice de Décision Intelligente (0-100)
  optimalDecisions: number;
  suboptimalDecisions: number;
  majorMistakes: Mistake[];
  strengths: string[];
  weaknesses: string[];
  improvementAreas: AdviceCategory[];
  emotionalState: EmotionalState;
  tiltDetected: boolean;
}

export enum EmotionalState {
  Calm = 'calm',
  Focused = 'focused',
  Excited = 'excited',
  Anxious = 'anxious',
  Tilted = 'tilted',
  Frustrated = 'frustrated',
  Confident = 'confident'
}
