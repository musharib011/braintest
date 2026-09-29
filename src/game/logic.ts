import { Card, Difficulty, DIFFICULTY_CONFIGS, SYMBOLS, SYMBOL_CATEGORIES, GameState, PlayerData } from './types';
import { loadGameData, saveGameData, getTodayString, getYesterdayString } from './storage';

// Fisher-Yates shuffle
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
  
  // Randomly select a category theme for visual variety
  const categoryKeys = Object.keys(SYMBOL_CATEGORIES) as Array<keyof typeof SYMBOL_CATEGORIES>;
  const selectedCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
  const categorySymbols = SYMBOL_CATEGORIES[selectedCategory];
  
  // Shuffle the category symbols and take what we need
  const shuffledSymbols = shuffleDeck(categorySymbols);
  const symbols = shuffledSymbols.slice(0, config.totalPairs);
  
  const pairs: Card[] = [];
  let id = 0;
  for (let i = 0; i < config.totalPairs; i++) {
    const symbol = symbols[i];
    pairs.push({ id: id++, pairId: i, symbol, state: 'hidden' });
    pairs.push({ id: id++, pairId: i, symbol, state: 'hidden' });
  }
  return shuffleDeck(pairs);
}

export function calculateScore(matchedPairs: number, moves: number, timeElapsed: number, difficulty: Difficulty): number {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const basePoints = matchedPairs * 100;
  const optimalMoves = config.totalPairs;
  const moveRatio = Math.max(0, 1 - (moves - optimalMoves) / (optimalMoves * 2));
  const moveBonus = Math.round(basePoints * moveRatio * 0.5);
  const expectedTime = config.totalPairs * 5;
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
    combo: 0,
    maxCombo: 0,
    perfectRun: true,
    mismatchedIds: [],
  };
}

// XP System
export function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function getTotalXPForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXPForLevel(i);
  }
  return total;
}

export function addXP(data: PlayerData, amount: number): { newData: PlayerData; levelsGained: number } {
  // Apply booster if active
  let multiplier = 1;
  if (data.booster && data.booster.expiresAt > Date.now()) {
    multiplier = data.booster.multiplier;
  }
  
  const boostedAmount = Math.floor(amount * multiplier);
  const newData = { ...data };
  newData.xp += boostedAmount;
  newData.totalXPEarned += boostedAmount;
  
  let levelsGained = 0;
  while (newData.xp >= getXPForLevel(newData.level)) {
    newData.xp -= getXPForLevel(newData.level);
    newData.level += 1;
    levelsGained += 1;
  }
  
  return { newData, levelsGained };
}

// Coin rewards
export function calculateMatchReward(combo: number): { coins: number; xp: number } {
  const baseCoins = 5;
  const baseXP = 2;
  const comboMultiplier = 1 + Math.min(combo * 0.1, 0.5); // Max 50% bonus at combo 5+
  return {
    coins: Math.floor(baseCoins * comboMultiplier),
    xp: Math.floor(baseXP * comboMultiplier),
  };
}

export function calculateGameCompleteReward(difficulty: Difficulty, accuracy: number, timeElapsed: number, perfectRun: boolean): { coins: number; xp: number } {
  const config = DIFFICULTY_CONFIGS[difficulty];
  let coins = 50;
  let xp = 25;
  
  // Difficulty bonus
  coins = Math.floor(coins * config.multiplier);
  xp = Math.floor(xp * config.multiplier);
  
  // Accuracy bonus
  if (accuracy >= 90) {
    coins += 30;
    xp += 15;
  }
  
  // Perfect run bonus
  if (perfectRun) {
    coins += 100;
    xp += 50;
  }
  
  return { coins, xp };
}

// Daily Challenge System
export const DAILY_CHALLENGES = [
  // Memory Flip challenges
  { id: 'easy_accuracy', description: 'Complete Easy Mode with 90%+ accuracy', type: 'accuracy', target: 90, difficulty: 'easy' as Difficulty, gameMode: 'memoryFlip' as const, rewardCoins: 250, rewardXP: 100 },
  { id: 'medium_speed', description: 'Complete Medium Mode in under 90 seconds', type: 'time', target: 90, difficulty: 'medium' as Difficulty, gameMode: 'memoryFlip' as const, rewardCoins: 300, rewardXP: 120 },
  { id: 'hard_moves', description: 'Complete Hard Mode with fewer than 70 moves', type: 'moves', target: 70, difficulty: 'hard' as Difficulty, gameMode: 'memoryFlip' as const, rewardCoins: 400, rewardXP: 150 },
  { id: 'pairs_25', description: 'Match 25 pairs today', type: 'pairs', target: 25, gameMode: 'memoryFlip' as const, rewardCoins: 200, rewardXP: 80 },
  { id: 'combo_5', description: 'Reach combo x5 in a single game', type: 'combo', target: 5, gameMode: 'memoryFlip' as const, rewardCoins: 200, rewardXP: 80 },
  { id: 'perfect', description: 'Complete a perfect run (no mismatches)', type: 'perfect', target: 1, gameMode: 'memoryFlip' as const, rewardCoins: 350, rewardXP: 140 },
  { id: 'easy_speed', description: 'Complete Easy Mode in under 30 seconds', type: 'time', target: 30, difficulty: 'easy' as Difficulty, gameMode: 'memoryFlip' as const, rewardCoins: 250, rewardXP: 100 },
  { id: 'medium_accuracy', description: 'Complete Medium Mode with 85%+ accuracy', type: 'accuracy', target: 85, difficulty: 'medium' as Difficulty, gameMode: 'memoryFlip' as const, rewardCoins: 300, rewardXP: 120 },
  { id: 'hard_complete', description: 'Complete Hard Mode', type: 'complete', target: 1, difficulty: 'hard' as Difficulty, gameMode: 'memoryFlip' as const, rewardCoins: 350, rewardXP: 140 },
  // Word Scramble challenges
  { id: 'scramble_5', description: 'Solve 5 words in Word Scramble', type: 'words', target: 5, gameMode: 'wordScramble' as const, rewardCoins: 200, rewardXP: 80 },
  { id: 'scramble_10', description: 'Solve 10 words in Word Scramble', type: 'words', target: 10, gameMode: 'wordScramble' as const, rewardCoins: 300, rewardXP: 120 },
  { id: 'scramble_perfect', description: 'Complete a perfect Word Scramble round', type: 'perfect', target: 1, gameMode: 'wordScramble' as const, rewardCoins: 350, rewardXP: 140 },
  { id: 'scramble_hard', description: 'Solve a Hard word in Word Scramble', type: 'difficulty_complete', target: 1, difficulty: 'hard' as Difficulty, gameMode: 'wordScramble' as const, rewardCoins: 400, rewardXP: 150 },
  { id: 'scramble_combo', description: 'Reach combo x5 in Word Scramble', type: 'combo', target: 5, gameMode: 'wordScramble' as const, rewardCoins: 250, rewardXP: 100 },
  // Word Builder challenges
  { id: 'builder_10', description: 'Find 10 words in Word Builder', type: 'words', target: 10, gameMode: 'wordBuilder' as const, rewardCoins: 250, rewardXP: 100 },
  { id: 'builder_15', description: 'Find 15 words in Word Builder', type: 'words', target: 15, gameMode: 'wordBuilder' as const, rewardCoins: 350, rewardXP: 140 },
  { id: 'builder_long', description: 'Find a 7+ letter word in Word Builder', type: 'longest_word', target: 7, gameMode: 'wordBuilder' as const, rewardCoins: 300, rewardXP: 120 },
  { id: 'builder_perfect', description: 'Complete a perfect Word Builder round', type: 'perfect', target: 1, gameMode: 'wordBuilder' as const, rewardCoins: 400, rewardXP: 150 },
  { id: 'builder_combo', description: 'Reach combo x8 in Word Builder', type: 'combo', target: 8, gameMode: 'wordBuilder' as const, rewardCoins: 300, rewardXP: 120 },
  // Cross-game challenges
  { id: 'games_3', description: 'Complete 3 games today (any mode)', type: 'games', target: 3, rewardCoins: 150, rewardXP: 60 },
  { id: 'xp_500', description: 'Earn 500 XP today', type: 'xp', target: 500, rewardCoins: 200, rewardXP: 80 },
];

export function getDailyChallenge(): typeof DAILY_CHALLENGES[0] {
  const today = getTodayString();
  // Deterministic selection based on date
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = ((hash << 5) - hash) + today.charCodeAt(i);
    hash = hash & hash;
  }
  const index = Math.abs(hash) % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[index];
}

export function checkDailyChallengeCompletion(data: PlayerData, gameResult: { difficulty: Difficulty; accuracy: number; timeElapsed: number; moves: number; matchedPairs: number; combo: number; perfectRun: boolean; won: boolean }): boolean {
  const challenge = getDailyChallenge();
  const today = getTodayString();
  
  // Already completed today
  if (data.dailyChallenge.date === today && data.dailyChallenge.completed) {
    return false;
  }
  
  // Check if this game matches the challenge
  if (challenge.difficulty && gameResult.difficulty !== challenge.difficulty) {
    return false;
  }
  
  let completed = false;
  switch (challenge.type) {
    case 'accuracy':
      completed = gameResult.won && gameResult.accuracy >= challenge.target;
      break;
    case 'time':
      completed = gameResult.won && gameResult.timeElapsed <= challenge.target;
      break;
    case 'moves':
      completed = gameResult.won && gameResult.moves <= challenge.target;
      break;
    case 'pairs':
      // Accumulate pairs across games
      data.dailyChallenge.progress += gameResult.matchedPairs;
      completed = data.dailyChallenge.progress >= challenge.target;
      break;
    case 'games':
      data.dailyChallenge.progress += gameResult.won ? 1 : 0;
      completed = data.dailyChallenge.progress >= challenge.target;
      break;
    case 'combo':
      completed = gameResult.combo >= challenge.target;
      break;
    case 'perfect':
      completed = gameResult.won && gameResult.perfectRun;
      break;
    case 'complete':
      completed = gameResult.won;
      break;
  }
  
  return completed;
}

// Streak system
export function updateStreak(data: PlayerData): { newData: PlayerData; streakIncreased: boolean; milestoneReached: number | null } {
  const today = getTodayString();
  const yesterday = getYesterdayString();
  const newData = { ...data, streak: { ...data.streak } };
  
  let streakIncreased = false;
  let milestoneReached: number | null = null;
  
  if (newData.streak.lastCompletedDate === today) {
    // Already completed today, no change
    return { newData, streakIncreased: false, milestoneReached: null };
  }
  
  if (newData.streak.lastCompletedDate === yesterday) {
    // Continue streak
    newData.streak.current += 1;
    streakIncreased = true;
  } else {
    // Reset streak
    newData.streak.current = 1;
    streakIncreased = true;
  }
  
  newData.streak.lastCompletedDate = today;
  if (newData.streak.current > newData.streak.longest) {
    newData.streak.longest = newData.streak.current;
  }
  
  // Check milestones
  const milestones = [3, 7, 14, 30];
  for (const m of milestones) {
    if (newData.streak.current === m && !newData.streak.milestonesClaimed.includes(m)) {
      milestoneReached = m;
      newData.streak.milestonesClaimed.push(m);
      break;
    }
  }
  
  return { newData, streakIncreased, milestoneReached };
}

// Booster check
export function isBoosterActive(data: PlayerData): boolean {
  return data.booster !== null && data.booster.expiresAt > Date.now();
}

export function getBoosterTimeRemaining(data: PlayerData): number {
  if (!data.booster) return 0;
  return Math.max(0, data.booster.expiresAt - Date.now());
}
