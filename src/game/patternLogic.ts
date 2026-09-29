import { Difficulty } from './types';

export interface PatternPuzzle {
  pattern: string[];
  options: string[];
  answer: string;
  explanation: string;
  difficulty: Difficulty;
}

const NUMBER_PATTERNS: PatternPuzzle[] = [
  { pattern: ['2', '4', '6', '8', '?'], options: ['9', '10', '11', '12'], answer: '10', explanation: 'Adding 2 each time', difficulty: 'easy' },
  { pattern: ['1', '3', '5', '7', '?'], options: ['8', '9', '10', '11'], answer: '9', explanation: 'Odd numbers', difficulty: 'easy' },
  { pattern: ['5', '10', '15', '20', '?'], options: ['22', '25', '30', '35'], answer: '25', explanation: 'Adding 5 each time', difficulty: 'easy' },
  { pattern: ['10', '20', '30', '40', '?'], options: ['45', '50', '55', '60'], answer: '50', explanation: 'Adding 10 each time', difficulty: 'easy' },
  { pattern: ['1', '2', '4', '8', '?'], options: ['10', '12', '16', '20'], answer: '16', explanation: 'Doubling each time', difficulty: 'medium' },
  { pattern: ['1', '4', '9', '16', '?'], options: ['20', '25', '30', '36'], answer: '25', explanation: 'Perfect squares: 1², 2², 3², 4², 5²', difficulty: 'medium' },
  { pattern: ['2', '6', '12', '20', '?'], options: ['28', '30', '32', '36'], answer: '30', explanation: 'n×(n+1): 1×2, 2×3, 3×4, 4×5, 5×6', difficulty: 'medium' },
  { pattern: ['1', '1', '2', '3', '5', '?'], options: ['6', '7', '8', '9'], answer: '8', explanation: 'Fibonacci: add previous two numbers', difficulty: 'medium' },
  { pattern: ['3', '6', '11', '18', '?'], options: ['25', '27', '29', '31'], answer: '27', explanation: 'Differences increase by 2: +3, +5, +7, +9', difficulty: 'hard' },
  { pattern: ['1', '8', '27', '64', '?'], options: ['100', '125', '150', '200'], answer: '125', explanation: 'Perfect cubes: 1³, 2³, 3³, 4³, 5³', difficulty: 'hard' },
];

const SHAPE_PATTERNS: PatternPuzzle[] = [
  { pattern: ['🔴', '🔵', '🔴', '🔵', '?'], options: ['🔴', '🔵', '🟢', '🟡'], answer: '🔴', explanation: 'Alternating red and blue', difficulty: 'easy' },
  { pattern: ['⭐', '⭐', '🌙', '⭐', '⭐', '?'], options: ['⭐', '🌙', '☀️', '🌟'], answer: '🌙', explanation: 'Two stars then a moon', difficulty: 'easy' },
  { pattern: ['🔺', '🔻', '🔺', '🔻', '?'], options: ['🔺', '🔻', '⬛', '⬜'], answer: '🔺', explanation: 'Alternating up and down triangles', difficulty: 'easy' },
  { pattern: ['🟥', '🟧', '🟨', '🟩', '?'], options: ['🟦', '🟪', '🟫', '⬛'], answer: '🟦', explanation: 'Rainbow colors in order', difficulty: 'medium' },
  { pattern: ['⬛', '⬛', '⬜', '⬛', '⬛', '⬜', '?'], options: ['⬛', '⬜', '🟥', '🟦'], answer: '⬛', explanation: 'Two black, one white pattern', difficulty: 'medium' },
];

const LETTER_PATTERNS: PatternPuzzle[] = [
  { pattern: ['A', 'B', 'C', 'D', '?'], options: ['E', 'F', 'G', 'H'], answer: 'E', explanation: 'Alphabetical order', difficulty: 'easy' },
  { pattern: ['Z', 'Y', 'X', 'W', '?'], options: ['V', 'U', 'T', 'S'], answer: 'V', explanation: 'Reverse alphabetical', difficulty: 'easy' },
  { pattern: ['A', 'C', 'E', 'G', '?'], options: ['H', 'I', 'J', 'K'], answer: 'I', explanation: 'Skip one letter each time', difficulty: 'medium' },
  { pattern: ['B', 'D', 'F', 'H', '?'], options: ['I', 'J', 'K', 'L'], answer: 'J', explanation: 'Every other letter', difficulty: 'medium' },
];

export function getPatternPuzzle(difficulty: Difficulty): PatternPuzzle {
  const allPuzzles = [...NUMBER_PATTERNS, ...SHAPE_PATTERNS, ...LETTER_PATTERNS];
  const filtered = allPuzzles.filter(p => p.difficulty === difficulty);
  
  if (filtered.length === 0) {
    return allPuzzles[Math.floor(Math.random() * allPuzzles.length)];
  }
  
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function calculatePatternRewards(
  puzzlesSolved: number,
  correctAnswers: number,
  difficulty: Difficulty,
  maxCombo: number
): { coins: number; xp: number } {
  let baseCoins = correctAnswers * 5;
  let baseXP = correctAnswers * 7;
  
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2,
  }[difficulty];
  
  baseCoins = Math.round(baseCoins * difficultyMultiplier);
  baseXP = Math.round(baseXP * difficultyMultiplier);
  
  if (maxCombo >= 5) {
    baseCoins += 20;
    baseXP += 12;
  }
  
  const accuracy = puzzlesSolved > 0 ? correctAnswers / puzzlesSolved : 0;
  if (accuracy === 1 && puzzlesSolved >= 5) {
    baseCoins += 40;
    baseXP += 25;
  }
  
  return { coins: baseCoins, xp: baseXP };
}
