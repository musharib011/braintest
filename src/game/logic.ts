import { Card, Difficulty, DIFFICULTY_CONFIGS, SYMBOLS, GameState, BestScore } from './types';

// Fisher-Yates shuffle - unbiased
export function shuffleDeck<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createDeck(difficulty: Difficulty): Card[] {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const symbols = SYMBOLS.slice(0, config.totalPairs);
  
  const pairs: Card[] = [];
  let id = 0;
  
  for (let i = 0; i < config.totalPairs; i++) {
    const symbol = symbols[i];
    pairs.push({ id: id++, pairId: i, symbol, state: 'hidden' });
    pairs.push({ id: id++, pairId: i, symbol, state: 'hidden' });
  }
  
  return shuffleDeck(pairs);
}

export function calculateScore(
  matchedPairs: number,
  moves: number,
  timeElapsed: number,
  difficulty: Difficulty
): number {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const basePoints = matchedPairs * 100;
  
  // Move efficiency bonus: reward fewer moves
  const optimalMoves = config.totalPairs;
  const moveRatio = Math.max(0, 1 - (moves - optimalMoves) / (optimalMoves * 2));
  const moveBonus = Math.round(basePoints * moveRatio * 0.5);
  
  // Time bonus: reward faster completion
  const expectedTime = config.totalPairs * 5; // 5 seconds per pair expected
  const timeRatio = Math.max(0, 1 - timeElapsed / (expectedTime * 3));
  const timeBonus = Math.round(basePoints * timeRatio * 0.3);
  
  const total = Math.round((basePoints + moveBonus + timeBonus) * config.multiplier);
  return Math.max(0, total);
}

export function calculateAccuracy(matchedPairs: number, totalAttempts: number): number {
  if (totalAttempts === 0) return 0;
  return Math.round((matchedPairs / totalAttempts) * 100);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatScore(score: number): string {
  return score.toLocaleString();
}

export function createInitialGameState(difficulty: Difficulty): GameState {
  const config = DIFFICULTY_CONFIGS[difficulty];
  return {
    cards: createDeck(difficulty),
    score: 0,
    moves: 0,
    matchedPairs: 0,
    totalPairs: config.totalPairs,
    firstCard: null,
    secondCard: null,
    locked: false,
    gameStarted: false,
    gameFinished: false,
    paused: false,
    difficulty,
    timeElapsed: 0,
    totalAttempts: 0,
  };
}
