import { Difficulty } from './types';

export interface LogicPuzzle {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: Difficulty;
}

const LOGIC_PUZZLES: LogicPuzzle[] = [
  // Easy
  { question: 'If all cats are animals, and some animals are pets, are all cats pets?', options: ['Yes', 'No', 'Maybe', 'Cannot determine'], answer: 'Cannot determine', explanation: 'We know cats are animals, but not all animals are pets', difficulty: 'easy' },
  { question: 'John is taller than Mike. Mike is taller than Sam. Who is the shortest?', options: ['John', 'Mike', 'Sam', 'Cannot determine'], answer: 'Sam', explanation: 'John > Mike > Sam, so Sam is shortest', difficulty: 'easy' },
  { question: 'If it rains, the ground gets wet. The ground is wet. Did it rain?', options: ['Yes', 'No', 'Maybe', 'Cannot determine'], answer: 'Cannot determine', explanation: 'The ground could be wet for other reasons (sprinkler, etc.)', difficulty: 'easy' },
  { question: 'A bat and ball cost $1.10. The bat costs $1 more than the ball. How much does the ball cost?', options: ['$0.10', '$0.05', '$0.15', '$0.20'], answer: '$0.05', explanation: 'Ball = $0.05, Bat = $1.05, Total = $1.10', difficulty: 'easy' },
  { question: 'If you have 3 apples and you take away 2, how many do you have?', options: ['1', '2', '3', '0'], answer: '2', explanation: 'You took 2, so you have 2', difficulty: 'easy' },
  
  // Medium
  { question: 'All roses are flowers. Some flowers fade quickly. Can we conclude some roses fade quickly?', options: ['Yes', 'No', 'Maybe', 'Cannot determine'], answer: 'Cannot determine', explanation: 'We don\'t know if the flowers that fade quickly include roses', difficulty: 'medium' },
  { question: 'If 5 machines make 5 widgets in 5 minutes, how long does it take 100 machines to make 100 widgets?', options: ['5 minutes', '100 minutes', '20 minutes', '50 minutes'], answer: '5 minutes', explanation: 'Each machine makes 1 widget in 5 minutes', difficulty: 'medium' },
  { question: 'A lily pad patch doubles in size every day. If it takes 48 days to cover the lake, how long to cover half?', options: ['24 days', '47 days', '46 days', '36 days'], answer: '47 days', explanation: 'If it doubles daily, day 47 = half, day 48 = full', difficulty: 'medium' },
  { question: 'You\'re in a race and pass the person in 2nd place. What place are you in now?', options: ['1st', '2nd', '3rd', 'Depends'], answer: '2nd', explanation: 'You took their place in 2nd', difficulty: 'medium' },
  { question: 'If you rearrange "CIFAIPC", you get the name of a(n):', options: ['Country', 'Ocean', 'City', 'Animal'], answer: 'Ocean', explanation: 'CIFAIPC = PACIFIC', difficulty: 'medium' },
  { question: 'A man builds a house with all 4 sides facing south. A bear walks by. What color is the bear?', options: ['Brown', 'Black', 'White', 'Cannot determine'], answer: 'White', explanation: 'House at North Pole, so it\'s a polar bear', difficulty: 'medium' },
  
  // Hard
  { question: 'If the day after tomorrow is two days before Thursday, what day is today?', options: ['Monday', 'Tuesday', 'Wednesday', 'Sunday'], answer: 'Sunday', explanation: 'Two days before Thursday = Tuesday. Day after tomorrow = Tuesday, so today = Sunday', difficulty: 'hard' },
  { question: 'Three doctors said Robert was their brother. Robert says he has no brothers. Who is lying?', options: ['The doctors', 'Robert', 'Nobody', 'Cannot determine'], answer: 'Nobody', explanation: 'The doctors could be his sisters', difficulty: 'hard' },
  { question: 'How many times can you subtract 10 from 100?', options: ['10 times', '1 time', '9 times', '100 times'], answer: '1 time', explanation: 'After first subtraction, it\'s no longer 100', difficulty: 'hard' },
  { question: 'If you\'re running in a race and pass the person in last place, what place are you in?', options: ['Last', 'Second to last', 'Impossible', 'First'], answer: 'Impossible', explanation: 'You can\'t pass someone in last place - there\'s no one behind them', difficulty: 'hard' },
  { question: 'A man is looking at a picture. "Brothers and sisters I have none, but that man\'s father is my father\'s son." Who is in the picture?', options: ['Himself', 'His son', 'His father', 'His brother'], answer: 'His son', explanation: '"My father\'s son" = himself (no siblings). "That man\'s father is me" = his son', difficulty: 'hard' },
  { question: 'What occurs once in a minute, twice in a moment, but never in a thousand years?', options: ['The letter M', 'Time', 'A second', 'Nothing'], answer: 'The letter M', explanation: 'M appears once in "minute", twice in "moment", zero in "thousand years"', difficulty: 'hard' },
];

export function getLogicPuzzle(difficulty: Difficulty): LogicPuzzle {
  const filtered = LOGIC_PUZZLES.filter(p => p.difficulty === difficulty);
  
  if (filtered.length === 0) {
    return LOGIC_PUZZLES[Math.floor(Math.random() * LOGIC_PUZZLES.length)];
  }
  
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function calculateLogicRewards(
  puzzlesSolved: number,
  correctAnswers: number,
  difficulty: Difficulty,
  maxCombo: number
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
  
  if (maxCombo >= 5) {
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
