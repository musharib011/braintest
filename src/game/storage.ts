import { PlayerData, BestScore, Difficulty } from './types';

const SAVE_KEY = 'memoryFlipData';
const BEST_SCORES_KEY = 'memoryFlipBestScores';

const DEFAULT_DATA: PlayerData = {
  version: 1,
  coins: 0,
  xp: 0,
  level: 1,
  totalXPEarned: 0,
  skinsOwned: ['classic'],
  equippedSkin: 'classic',
  emotesOwned: ['fire'],
  equippedEmote: null,
  achievementsUnlocked: [],
  statistics: {
    gamesPlayed: 0,
    gamesWon: 0,
    perfectRuns: 0,
    totalPairsMatched: 0,
    totalMoves: 0,
    totalCoinsEarned: 0,
    highestCombo: 0,
    bestTimeEasy: null,
    bestTimeMedium: null,
    bestTimeHard: null,
    dailyChallengesCompleted: 0,
  },
  dailyChallenge: {
    date: '',
    challengeId: '',
    completed: false,
    progress: 0,
  },
  streak: {
    current: 0,
    longest: 0,
    lastCompletedDate: '',
    milestonesClaimed: [],
  },
  booster: null,
  settings: {
    soundEnabled: true,
    theme: 'light',
  },
};

export function loadGameData(): PlayerData {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { ...DEFAULT_DATA };
    
    const parsed = JSON.parse(raw);
    // Merge with defaults to handle missing fields
    const data = deepMerge(DEFAULT_DATA, parsed) as PlayerData;
    
    // Validate numbers
    if (typeof data.coins !== 'number' || isNaN(data.coins)) data.coins = 0;
    if (typeof data.xp !== 'number' || isNaN(data.xp)) data.xp = 0;
    if (typeof data.level !== 'number' || isNaN(data.level) || data.level < 1) data.level = 1;
    if (data.coins < 0) data.coins = 0;
    
    return data;
  } catch {
    return { ...DEFAULT_DATA };
  }
}

export function saveGameData(data: PlayerData): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // silently fail
  }
}

export function resetGameData(): PlayerData {
  const fresh = { ...DEFAULT_DATA };
  saveGameData(fresh);
  return fresh;
}

function deepMerge(defaults: any, overrides: any): any {
  const result = { ...defaults };
  for (const key in overrides) {
    if (overrides[key] !== null && typeof overrides[key] === 'object' && !Array.isArray(overrides[key])) {
      result[key] = deepMerge(defaults[key] || {}, overrides[key]);
    } else if (overrides[key] !== undefined) {
      result[key] = overrides[key];
    }
  }
  return result;
}

// Best scores (separate from main data for backward compat)
export function loadBestScore(difficulty: Difficulty): BestScore | null {
  try {
    const raw = localStorage.getItem(BEST_SCORES_KEY);
    if (!raw) return null;
    const scores = JSON.parse(raw);
    const score = scores[difficulty];
    if (score && typeof score.score === 'number') return score;
    return null;
  } catch {
    return null;
  }
}

export function saveBestScore(difficulty: Difficulty, score: BestScore): void {
  try {
    const raw = localStorage.getItem(BEST_SCORES_KEY);
    const scores = raw ? JSON.parse(raw) : {};
    scores[difficulty] = score;
    localStorage.setItem(BEST_SCORES_KEY, JSON.stringify(scores));
  } catch {}
}

export function isNewBestScore(difficulty: Difficulty, currentScore: number): boolean {
  const best = loadBestScore(difficulty);
  if (!best) return true;
  return currentScore > best.score;
}

// Helpers
export function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
