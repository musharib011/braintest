import { BestScore, Difficulty } from './types';

const STORAGE_KEYS: Record<Difficulty, string> = {
  easy: 'memoryFlipBestEasy',
  medium: 'memoryFlipBestMedium',
  hard: 'memoryFlipBestHard',
};

export function loadBestScore(difficulty: Difficulty): BestScore | null {
  try {
    const key = STORAGE_KEYS[difficulty];
    const data = localStorage.getItem(key);
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (
      typeof parsed.score === 'number' &&
      typeof parsed.time === 'number' &&
      typeof parsed.moves === 'number' &&
      typeof parsed.accuracy === 'number'
    ) {
      return parsed as BestScore;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveBestScore(difficulty: Difficulty, score: BestScore): boolean {
  try {
    const key = STORAGE_KEYS[difficulty];
    localStorage.setItem(key, JSON.stringify(score));
    return true;
  } catch {
    return false;
  }
}

export function isNewBestScore(difficulty: Difficulty, currentScore: number): boolean {
  const best = loadBestScore(difficulty);
  if (!best) return true;
  return currentScore > best.score;
}

export function loadSoundEnabled(): boolean {
  try {
    const data = localStorage.getItem('memoryFlipSound');
    if (data === null) return true;
    return data === 'true';
  } catch {
    return true;
  }
}

export function saveSoundEnabled(enabled: boolean): void {
  try {
    localStorage.setItem('memoryFlipSound', String(enabled));
  } catch {
    // silently fail
  }
}

export function loadTheme(): 'light' | 'dark' {
  try {
    const data = localStorage.getItem('memoryFlipTheme');
    if (data === 'dark') return 'dark';
    return 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem('memoryFlipTheme', theme);
  } catch {
    // silently fail
  }
}
