import { Difficulty } from './types';

export interface FocusTarget {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
  isTarget: boolean;
  appearedAt: number;
}

export interface FocusGameState {
  targets: FocusTarget[];
  currentRule: string;
  score: number;
  combo: number;
  maxCombo: number;
  correctHits: number;
  falseHits: number;
  missedTargets: number;
  timeElapsed: number;
  timeLimit: number;
  gameStarted: boolean;
  gameFinished: boolean;
  difficulty: Difficulty;
  perfectRun: boolean;
  fastestReaction: number | null;
  round: number;
}

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const SHAPES: Array<'circle' | 'square' | 'triangle'> = ['circle', 'square', 'triangle'];

const RULES = [
  { rule: 'Tap all RED circles', targetColor: 'red', targetShape: 'circle' as const },
  { rule: 'Tap all BLUE squares', targetColor: 'blue', targetShape: 'square' as const },
  { rule: 'Tap all GREEN triangles', targetColor: 'green', targetShape: 'triangle' as const },
  { rule: 'Tap all YELLOW circles', targetColor: 'yellow', targetShape: 'circle' as const },
  { rule: 'Tap all PURPLE squares', targetColor: 'purple', targetShape: 'square' as const },
  { rule: 'Tap all ORANGE triangles', targetColor: 'orange', targetShape: 'triangle' as const },
];

export function createFocusGameState(difficulty: Difficulty): FocusGameState {
  const timeLimit = { easy: 45, medium: 40, hard: 35 }[difficulty];
  const rule = RULES[Math.floor(Math.random() * RULES.length)];
  
  return {
    targets: [],
    currentRule: rule.rule,
    score: 0,
    combo: 0,
    maxCombo: 0,
    correctHits: 0,
    falseHits: 0,
    missedTargets: 0,
    timeElapsed: 0,
    timeLimit,
    gameStarted: false,
    gameFinished: false,
    difficulty,
    perfectRun: true,
    fastestReaction: null,
    round: 0,
  };
}

export function generateFocusTargets(difficulty: Difficulty, rule: typeof RULES[0]): FocusTarget[] {
  const count = { easy: 8, medium: 12, hard: 16 }[difficulty];
  const targetCount = { easy: 2, medium: 3, hard: 4 }[difficulty];
  const targets: FocusTarget[] = [];
  const now = Date.now();
  
  // Generate targets
  for (let i = 0; i < count; i++) {
    const isTarget = i < targetCount;
    let color: string;
    let shape: 'circle' | 'square' | 'triangle';
    
    if (isTarget) {
      color = rule.targetColor;
      shape = rule.targetShape;
    } else {
      // Generate distractors
      do {
        color = COLORS[Math.floor(Math.random() * COLORS.length)];
        shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      } while (color === rule.targetColor && shape === rule.targetShape);
    }
    
    const size = { easy: 50, medium: 40, hard: 35 }[difficulty];
    
    targets.push({
      id: i,
      x: Math.random() * 80 + 10, // percentage
      y: Math.random() * 70 + 15, // percentage
      size,
      color,
      shape,
      isTarget,
      appearedAt: now,
    });
  }
  
  // Shuffle
  for (let i = targets.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [targets[i], targets[j]] = [targets[j], targets[i]];
  }
  
  return targets;
}

export function calculateFocusRewards(
  correctHits: number,
  score: number,
  difficulty: Difficulty,
  maxCombo: number,
  perfectRun: boolean
): { coins: number; xp: number } {
  let baseCoins = correctHits * 2;
  let baseXP = correctHits * 3;
  
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2,
    expert: 3,
  }[difficulty];
  
  baseCoins = Math.round(baseCoins * difficultyMultiplier);
  baseXP = Math.round(baseXP * difficultyMultiplier);
  
  if (maxCombo >= 5) {
    baseCoins += 15;
    baseXP += 10;
  }
  
  if (perfectRun) {
    baseCoins += 30;
    baseXP += 15;
  }
  
  return { coins: baseCoins, xp: baseXP };
}
