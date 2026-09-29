import { WORD_DATABASE, LETTER_SETS, VALID_WORDS, WordEntry } from './wordDatabase';
import { Difficulty } from './types';

// Word Scramble Types
export interface ScrambleGameState {
  currentWord: WordEntry | null;
  scrambledLetters: string[];
  userInput: string;
  score: number;
  combo: number;
  maxCombo: number;
  wordsSolved: number;
  attempts: number;
  maxAttempts: number;
  hintsUsed: number;
  timeElapsed: number;
  gameStarted: boolean;
  gameFinished: boolean;
  difficulty: Difficulty;
  revealedLetters: boolean[];
  showDefinition: boolean;
  perfectRun: boolean;
}

// Word Builder Types
export interface BuilderGameState {
  letters: string[];
  foundWords: string[];
  score: number;
  combo: number;
  maxCombo: number;
  timeElapsed: number;
  timeLimit: number;
  gameStarted: boolean;
  gameFinished: boolean;
  difficulty: Difficulty;
  validWords: string[];
  longestWord: string;
  hintsUsed: number;
  attempts: number;
  perfectRun: boolean;
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Scramble letters, ensuring result is different from original
export function scrambleWord(word: string): string[] {
  const letters = word.split('');
  let scrambled: string[];
  let attempts = 0;
  
  do {
    scrambled = shuffleArray(letters);
    attempts++;
    // Prevent infinite loop
    if (attempts > 10) break;
  } while (scrambled.join('') === word && word.length > 2);
  
  return scrambled;
}

// Get random word from database
export function getRandomWord(difficulty: Difficulty): WordEntry {
  const words = WORD_DATABASE.filter(w => w.difficulty === difficulty);
  return words[Math.floor(Math.random() * words.length)];
}

// Initialize Word Scramble game
export function createScrambleGameState(difficulty: Difficulty): ScrambleGameState {
  const word = getRandomWord(difficulty);
  return {
    currentWord: word,
    scrambledLetters: scrambleWord(word.word),
    userInput: '',
    score: 0,
    combo: 0,
    maxCombo: 0,
    wordsSolved: 0,
    attempts: 0,
    maxAttempts: 3,
    hintsUsed: 0,
    timeElapsed: 0,
    gameStarted: false,
    gameFinished: false,
    difficulty,
    revealedLetters: new Array(word.word.length).fill(false),
    showDefinition: false,
    perfectRun: true,
  };
}

// Validate answer
export function validateAnswer(userInput: string, correctWord: string): boolean {
  const normalized = userInput.trim().toUpperCase().replace(/\s+/g, '');
  return normalized === correctWord.toUpperCase();
}

// Calculate Word Scramble score
export function calculateScrambleScore(
  word: WordEntry,
  timeElapsed: number,
  attempts: number,
  hintsUsed: number,
  combo: number
): number {
  let baseScore = 100;
  
  // Difficulty multiplier
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2,
  }[word.difficulty];
  
  baseScore *= difficultyMultiplier;
  
  // Time bonus (faster = more points)
  const timeBonus = Math.max(0, 50 - timeElapsed);
  baseScore += timeBonus;
  
  // Attempt penalty
  if (attempts > 1) {
    baseScore -= (attempts - 1) * 10;
  }
  
  // Hint penalty
  if (hintsUsed > 0) {
    baseScore -= hintsUsed * 20;
  }
  
  // Combo bonus
  if (combo > 1) {
    baseScore *= 1 + (combo - 1) * 0.1;
  }
  
  return Math.max(10, Math.round(baseScore));
}

// Calculate rewards for Word Scramble
export function calculateScrambleRewards(
  wordsSolved: number,
  score: number,
  difficulty: Difficulty,
  perfectRun: boolean
): { coins: number; xp: number } {
  const baseCoins = wordsSolved * 5;
  const baseXP = wordsSolved * 10;
  
  // Difficulty bonus
  const difficultyBonus = {
    easy: 1,
    medium: 1.5,
    hard: 2,
  }[difficulty];
  
  const coins = Math.round(baseCoins * difficultyBonus);
  const xp = Math.round(baseXP * difficultyBonus);
  
  // Perfect run bonus
  const perfectBonus = perfectRun ? 50 : 0;
  
  return {
    coins: coins + perfectBonus,
    xp: xp + perfectBonus,
  };
}

// Word Builder Functions

// Get letter set for difficulty
export function getLetterSet(difficulty: Difficulty): string[] {
  const sets = LETTER_SETS[difficulty];
  const set = sets[Math.floor(Math.random() * sets.length)];
  return [...set.letters];
}

// Find all valid words that can be made from letters
export function findValidWords(letters: string[]): string[] {
  const letterCount: Record<string, number> = {};
  letters.forEach(l => {
    letterCount[l] = (letterCount[l] || 0) + 1;
  });
  
  const validWords: string[] = [];
  
  VALID_WORDS.forEach(word => {
    if (word.length < 3 || word.length > letters.length) return;
    
    const wordCount: Record<string, number> = {};
    word.split('').forEach(l => {
      wordCount[l] = (wordCount[l] || 0) + 1;
    });
    
    let canMake = true;
    for (const letter in wordCount) {
      if (!letterCount[letter] || wordCount[letter] > letterCount[letter]) {
        canMake = false;
        break;
      }
    }
    
    if (canMake) {
      validWords.push(word);
    }
  });
  
  return validWords;
}

// Initialize Word Builder game
export function createBuilderGameState(difficulty: Difficulty): BuilderGameState {
  const letters = getLetterSet(difficulty);
  const validWords = findValidWords(letters);
  
  const timeLimit = {
    easy: 75,
    medium: 60,
    hard: 45,
  }[difficulty];
  
  return {
    letters,
    foundWords: [],
    score: 0,
    combo: 0,
    maxCombo: 0,
    timeElapsed: 0,
    timeLimit,
    gameStarted: false,
    gameFinished: false,
    difficulty,
    validWords,
    longestWord: '',
    hintsUsed: 0,
    attempts: 0,
    perfectRun: true,
  };
}

// Validate word for Word Builder
export function validateBuilderWord(
  word: string,
  letters: string[],
  foundWords: string[],
  validWords: string[]
): { valid: boolean; message: string } {
  const normalized = word.trim().toUpperCase();
  
  if (normalized.length < 3) {
    return { valid: false, message: 'Word must be at least 3 letters' };
  }
  
  if (foundWords.includes(normalized)) {
    return { valid: false, message: 'Already found!' };
  }
  
  if (!validWords.includes(normalized)) {
    return { valid: false, message: 'Not a valid word' };
  }
  
  // Check if can be made from available letters
  const letterCount: Record<string, number> = {};
  letters.forEach(l => {
    letterCount[l] = (letterCount[l] || 0) + 1;
  });
  
  const wordCount: Record<string, number> = {};
  normalized.split('').forEach(l => {
    wordCount[l] = (wordCount[l] || 0) + 1;
  });
  
  for (const letter in wordCount) {
    if (!letterCount[letter] || wordCount[letter] > letterCount[letter]) {
      return { valid: false, message: 'Cannot make this word' };
    }
  }
  
  return { valid: true, message: 'Valid!' };
}

// Calculate Word Builder score for a word
export function calculateBuilderWordScore(word: string, combo: number): number {
  const length = word.length;
  let baseScore = 0;
  
  if (length === 3) baseScore = 10;
  else if (length === 4) baseScore = 20;
  else if (length === 5) baseScore = 35;
  else if (length === 6) baseScore = 50;
  else baseScore = 75 + (length - 7) * 10;
  
  // Combo bonus
  if (combo > 1) {
    baseScore *= 1 + (combo - 1) * 0.1;
  }
  
  return Math.round(baseScore);
}

// Calculate rewards for Word Builder
export function calculateBuilderRewards(
  wordsFound: number,
  score: number,
  difficulty: Difficulty,
  perfectRun: boolean
): { coins: number; xp: number } {
  const baseCoins = wordsFound * 3;
  const baseXP = wordsFound * 8;
  
  // Difficulty bonus
  const difficultyBonus = {
    easy: 1,
    medium: 1.5,
    hard: 2,
  }[difficulty];
  
  const coins = Math.round(baseCoins * difficultyBonus);
  const xp = Math.round(baseXP * difficultyBonus);
  
  // Perfect run bonus (found 80%+ of valid words)
  const perfectBonus = perfectRun ? 50 : 0;
  
  return {
    coins: coins + perfectBonus,
    xp: xp + perfectBonus,
  };
}
