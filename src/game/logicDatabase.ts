import { Difficulty } from './types';

export interface LogicPuzzle {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: Difficulty;
  category: string;
}

// Number sequences
const numberSequences: LogicPuzzle[] = [
  { question: '2, 4, 6, 8, ?', options: ['9', '10', '11', '12'], answer: '10', explanation: 'Each number increases by 2', difficulty: 'easy', category: 'Number Sequence' },
  { question: '1, 3, 5, 7, ?', options: ['8', '9', '10', '11'], answer: '9', explanation: 'Odd numbers increasing by 2', difficulty: 'easy', category: 'Number Sequence' },
  { question: '5, 10, 15, 20, ?', options: ['22', '25', '30', '35'], answer: '25', explanation: 'Multiples of 5', difficulty: 'easy', category: 'Number Sequence' },
  { question: '1, 4, 9, 16, ?', options: ['20', '25', '30', '36'], answer: '25', explanation: 'Perfect squares: 1², 2², 3², 4², 5²', difficulty: 'medium', category: 'Number Sequence' },
  { question: '2, 6, 12, 20, ?', options: ['28', '30', '32', '36'], answer: '30', explanation: 'n×(n+1): 1×2, 2×3, 3×4, 4×5, 5×6', difficulty: 'medium', category: 'Number Sequence' },
  { question: '1, 1, 2, 3, 5, 8, ?', options: ['11', '12', '13', '14'], answer: '13', explanation: 'Fibonacci: each number is sum of previous two', difficulty: 'hard', category: 'Number Sequence' },
  { question: '3, 6, 11, 18, 27, ?', options: ['36', '38', '40', '42'], answer: '38', explanation: 'Differences increase by 2: +3, +5, +7, +9, +11', difficulty: 'hard', category: 'Number Sequence' },
];

// Letter sequences
const letterSequences: LogicPuzzle[] = [
  { question: 'A, C, E, G, ?', options: ['H', 'I', 'J', 'K'], answer: 'I', explanation: 'Skip one letter each time', difficulty: 'easy', category: 'Letter Sequence' },
  { question: 'B, D, F, H, ?', options: ['I', 'J', 'K', 'L'], answer: 'J', explanation: 'Every other letter', difficulty: 'easy', category: 'Letter Sequence' },
  { question: 'Z, Y, X, W, ?', options: ['U', 'V', 'W', 'X'], answer: 'V', explanation: 'Alphabet backwards', difficulty: 'easy', category: 'Letter Sequence' },
  { question: 'A, D, G, J, ?', options: ['K', 'L', 'M', 'N'], answer: 'M', explanation: 'Skip 2 letters each time', difficulty: 'medium', category: 'Letter Sequence' },
  { question: 'J, F, M, A, M, ?', options: ['J', 'J', 'J', 'J'], answer: 'J', explanation: 'First letters of months: January, February, March, April, May, June', difficulty: 'hard', category: 'Letter Sequence' },
];

// Odd one out
const oddOneOut: LogicPuzzle[] = [
  { question: 'Which is different? Apple, Banana, Carrot, Orange', options: ['Apple', 'Banana', 'Carrot', 'Orange'], answer: 'Carrot', explanation: 'Carrot is a vegetable, others are fruits', difficulty: 'easy', category: 'Odd One Out' },
  { question: 'Which is different? Dog, Cat, Bird, Fish', options: ['Dog', 'Cat', 'Bird', 'Fish'], answer: 'Fish', explanation: 'Fish lives in water, others live on land', difficulty: 'easy', category: 'Odd One Out' },
  { question: 'Which is different? 2, 4, 6, 7, 8', options: ['2', '4', '6', '7'], answer: '7', explanation: '7 is odd, others are even', difficulty: 'easy', category: 'Odd One Out' },
  { question: 'Which is different? Paris, London, New York, Tokyo', options: ['Paris', 'London', 'New York', 'Tokyo'], answer: 'New York', explanation: 'New York is not a capital city', difficulty: 'medium', category: 'Odd One Out' },
  { question: 'Which is different? Gold, Silver, Bronze, Iron, Platinum', options: ['Gold', 'Silver', 'Bronze', 'Iron'], answer: 'Bronze', explanation: 'Bronze is an alloy, others are pure metals', difficulty: 'hard', category: 'Odd One Out' },
];

// Simple deduction
const deduction: LogicPuzzle[] = [
  { question: 'If all roses are flowers, and some flowers fade quickly, which is true?', options: ['All roses fade quickly', 'Some roses fade quickly', 'No roses fade quickly', 'Cannot determine'], answer: 'Cannot determine', explanation: 'We cannot conclude anything specific about roses from these statements', difficulty: 'medium', category: 'Deduction' },
  { question: 'John is taller than Mike. Mike is taller than Sam. Who is shortest?', options: ['John', 'Mike', 'Sam', 'Cannot determine'], answer: 'Sam', explanation: 'John > Mike > Sam, so Sam is shortest', difficulty: 'easy', category: 'Deduction' },
  { question: 'If it rains, the ground is wet. The ground is wet. Did it rain?', options: ['Yes', 'No', 'Maybe', 'Cannot determine'], answer: 'Cannot determine', explanation: 'The ground could be wet for other reasons', difficulty: 'hard', category: 'Deduction' },
];

// Ordering puzzles
const ordering: LogicPuzzle[] = [
  { question: 'Arrange from smallest to largest: Elephant, Mouse, Horse, Cat', options: ['Mouse, Cat, Horse, Elephant', 'Cat, Mouse, Horse, Elephant', 'Mouse, Horse, Cat, Elephant', 'Elephant, Horse, Cat, Mouse'], answer: 'Mouse, Cat, Horse, Elephant', explanation: 'Size order from smallest to largest', difficulty: 'easy', category: 'Ordering' },
  { question: 'Which comes next in the sequence? Monday, Wednesday, Friday, ?', options: ['Saturday', 'Sunday', 'Monday', 'Tuesday'], answer: 'Sunday', explanation: 'Every other day of the week', difficulty: 'medium', category: 'Ordering' },
];

export function getLogicPuzzle(difficulty: Difficulty): LogicPuzzle {
  const allPuzzles = [...numberSequences, ...letterSequences, ...oddOneOut, ...deduction, ...ordering];
  const filtered = allPuzzles.filter(p => p.difficulty === difficulty);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function calculateLogicRewards(
  puzzlesSolved: number,
  correctAnswers: number,
  difficulty: Difficulty,
  highestCombo: number
): { coins: number; xp: number } {
  let baseCoins = correctAnswers * 5;
  let baseXP = correctAnswers * 8;
  
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2,
  }[difficulty];
  
  baseCoins = Math.round(baseCoins * difficultyMultiplier);
  baseXP = Math.round(baseXP * difficultyMultiplier);
  
  if (highestCombo >= 5) {
    baseCoins += 25;
    baseXP += 15;
  }
  
  const accuracy = puzzlesSolved > 0 ? correctAnswers / puzzlesSolved : 0;
  if (accuracy === 1 && puzzlesSolved >= 5) {
    baseCoins += 50;
    baseXP += 30;
  }
  
  return { coins: baseCoins, xp: baseXP };
}
