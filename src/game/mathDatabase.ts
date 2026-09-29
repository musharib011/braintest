import { Difficulty } from './types';

export interface MathQuestion {
  question: string;
  answer: number;
  difficulty: Difficulty;
  operation: string;
}

// Generate math questions dynamically
export function generateMathQuestion(difficulty: Difficulty): MathQuestion {
  switch (difficulty) {
    case 'easy':
      return generateEasyQuestion();
    case 'medium':
      return generateMediumQuestion();
    case 'hard':
      return generateHardQuestion();
  }
}

function generateEasyQuestion(): MathQuestion {
  const operations = ['+', '-', '×'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let a: number, b: number, answer: number, question: string;
  
  switch (operation) {
    case '+':
      a = Math.floor(Math.random() * 50) + 1;
      b = Math.floor(Math.random() * 50) + 1;
      answer = a + b;
      question = `${a} + ${b}`;
      break;
    case '-':
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * a);
      answer = a - b;
      question = `${a} - ${b}`;
      break;
    case '×':
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
      answer = a * b;
      question = `${a} × ${b}`;
      break;
    default:
      a = 1;
      b = 1;
      answer = 2;
      question = '1 + 1';
  }
  
  return { question, answer, difficulty: 'easy', operation };
}

function generateMediumQuestion(): MathQuestion {
  const operations = ['+', '-', '×', '÷', '%'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let a: number, b: number, answer: number, question: string;
  
  switch (operation) {
    case '+':
      a = Math.floor(Math.random() * 200) + 50;
      b = Math.floor(Math.random() * 200) + 50;
      answer = a + b;
      question = `${a} + ${b}`;
      break;
    case '-':
      a = Math.floor(Math.random() * 200) + 100;
      b = Math.floor(Math.random() * a);
      answer = a - b;
      question = `${a} - ${b}`;
      break;
    case '×':
      a = Math.floor(Math.random() * 20) + 5;
      b = Math.floor(Math.random() * 20) + 5;
      answer = a * b;
      question = `${a} × ${b}`;
      break;
    case '÷':
      b = Math.floor(Math.random() * 15) + 2;
      answer = Math.floor(Math.random() * 15) + 2;
      a = b * answer;
      question = `${a} ÷ ${b}`;
      break;
    case '%':
      b = Math.floor(Math.random() * 50) + 10;
      const percent = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
      answer = (b * percent) / 100;
      question = `${percent}% of ${b}`;
      break;
    default:
      a = 1;
      b = 1;
      answer = 2;
      question = '1 + 1';
  }
  
  return { question, answer, difficulty: 'medium', operation };
}

function generateHardQuestion(): MathQuestion {
  const operations = ['+', '-', '×', '÷', 'mixed'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let a: number, b: number, c: number, answer: number, question: string;
  
  switch (operation) {
    case '+':
      a = Math.floor(Math.random() * 500) + 100;
      b = Math.floor(Math.random() * 500) + 100;
      answer = a + b;
      question = `${a} + ${b}`;
      break;
    case '-':
      a = Math.floor(Math.random() * 500) + 200;
      b = Math.floor(Math.random() * a);
      answer = a - b;
      question = `${a} - ${b}`;
      break;
    case '×':
      a = Math.floor(Math.random() * 30) + 10;
      b = Math.floor(Math.random() * 30) + 10;
      answer = a * b;
      question = `${a} × ${b}`;
      break;
    case '÷':
      b = Math.floor(Math.random() * 20) + 5;
      answer = Math.floor(Math.random() * 20) + 5;
      a = b * answer;
      question = `${a} ÷ ${b}`;
      break;
    case 'mixed':
      const type = Math.floor(Math.random() * 3);
      if (type === 0) {
        // a + b × c
        a = Math.floor(Math.random() * 20) + 5;
        b = Math.floor(Math.random() * 10) + 2;
        c = Math.floor(Math.random() * 10) + 2;
        answer = a + (b * c);
        question = `${a} + ${b} × ${c}`;
      } else if (type === 1) {
        // a × b - c
        a = Math.floor(Math.random() * 15) + 5;
        b = Math.floor(Math.random() * 15) + 5;
        c = Math.floor(Math.random() * (a * b));
        answer = (a * b) - c;
        question = `${a} × ${b} - ${c}`;
      } else {
        // (a + b) × c
        a = Math.floor(Math.random() * 20) + 5;
        b = Math.floor(Math.random() * 20) + 5;
        c = Math.floor(Math.random() * 10) + 2;
        answer = (a + b) * c;
        question = `(${a} + ${b}) × ${c}`;
      }
      break;
    default:
      a = 1;
      b = 1;
      c = 1;
      answer = 2;
      question = '1 + 1';
  }
  
  return { question, answer, difficulty: 'hard', operation };
}

export function calculateMathRewards(
  questionsAnswered: number,
  correctAnswers: number,
  difficulty: Difficulty,
  highestCombo: number,
  timeElapsed: number
): { coins: number; xp: number } {
  const accuracy = questionsAnswered > 0 ? correctAnswers / questionsAnswered : 0;
  
  let baseCoins = correctAnswers * 3;
  let baseXP = correctAnswers * 5;
  
  // Difficulty multiplier
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2,
  }[difficulty];
  
  baseCoins = Math.round(baseCoins * difficultyMultiplier);
  baseXP = Math.round(baseXP * difficultyMultiplier);
  
  // Combo bonus
  if (highestCombo >= 5) {
    baseCoins += 20;
    baseXP += 10;
  }
  if (highestCombo >= 10) {
    baseCoins += 30;
    baseXP += 15;
  }
  
  // Perfect accuracy bonus
  if (accuracy === 1 && questionsAnswered >= 5) {
    baseCoins += 50;
    baseXP += 25;
  }
  
  return { coins: baseCoins, xp: baseXP };
}
