// Card types
export type CardState = 'hidden' | 'revealed' | 'matched';

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
  combo: number;
  maxCombo: number;
  perfectRun: boolean;
  mismatchedIds: number[];
}

export interface BestScore {
  score: number;
  time: number;
  moves: number;
  accuracy: number;
}

// Progression types
export interface Skin {
  id: string;
  name: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  cardBack: string;
  cardFront: string;
  accent: string;
  glow: string;
  icon: string;
}

export interface Emote {
  id: string;
  emoji: string;
  name: string;
  unlockType: 'level' | 'achievement' | 'coins' | 'free';
  unlockRequirement: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  rewardCoins: number;
  rewardXP: number;
  statKey: string;
}

export interface Booster {
  multiplier: number;
  expiresAt: number;
}

export interface DailyChallenge {
  id: string;
  description: string;
  type: string;
  target: number;
  difficulty?: Difficulty;
  rewardCoins: number;
  rewardXP: number;
}

export interface PlayerData {
  version: number;
  coins: number;
  xp: number;
  level: number;
  totalXPEarned: number;
  skinsOwned: string[];
  equippedSkin: string;
  emotesOwned: string[];
  equippedEmote: string | null;
  achievementsUnlocked: string[];
  statistics: {
    gamesPlayed: number;
    gamesWon: number;
    perfectRuns: number;
    totalPairsMatched: number;
    totalMoves: number;
    totalCoinsEarned: number;
    highestCombo: number;
    bestTimeEasy: number | null;
    bestTimeMedium: number | null;
    bestTimeHard: number | null;
    dailyChallengesCompleted: number;
  };
  dailyChallenge: {
    date: string;
    challengeId: string;
    completed: boolean;
    progress: number;
  };
  streak: {
    current: number;
    longest: number;
    lastCompletedDate: string;
    milestonesClaimed: number[];
  };
  booster: Booster | null;
  settings: {
    soundEnabled: boolean;
    theme: 'light' | 'dark';
  };
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
