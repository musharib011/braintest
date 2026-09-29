export type CardState = 'hidden' | 'revealed' | 'matched' | 'locked';

export interface Card {
  id: number;
  pairId: number;
  symbol: string;
  state: CardState;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  cols: number;
  rows: number;
  totalPairs: number;
  multiplier: number;
  label: string;
}

export interface GameState {
  cards: Card[];
  score: number;
  moves: number;
  matchedPairs: number;
  totalPairs: number;
  firstCard: number | null;
  secondCard: number | null;
  locked: boolean;
  gameStarted: boolean;
  gameFinished: boolean;
  paused: boolean;
  difficulty: Difficulty;
  timeElapsed: number;
  totalAttempts: number;
  mismatchedIds: number[];
}

export interface BestScore {
  score: number;
  time: number;
  moves: number;
  accuracy: number;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: { cols: 4, rows: 4, totalPairs: 8, multiplier: 1, label: 'Easy' },
  medium: { cols: 6, rows: 6, totalPairs: 18, multiplier: 1.5, label: 'Medium' },
  hard: { cols: 8, rows: 8, totalPairs: 32, multiplier: 2, label: 'Hard' },
};

export const SYMBOLS: string[] = [
  '🚀', '🌎', '⚡', '🎮', '🍕', '🦊', '🎧', '🔥',
  '🌙', '⭐', '🍀', '💎', '🎯', '🧠', '🎲', '🚗',
  '🌈', '🎪', '🦋', '🌸', '🎸', '🏆', '🎭', '🦄',
  '🐙', '🌺', '🎨', '🦁', '🍄', '🎃', '🐬', '🌊',
];
