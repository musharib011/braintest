import { Difficulty } from './types';

export interface MatchItem {
  id: number;
  content: string;
  matchId: number;
  matched: boolean;
}

export interface MatchChallengeState {
  items: MatchItem[];
  selected: number | null;
  matchesFound: number;
  totalMatches: number;
  attempts: number;
  score: number;
  combo: number;
  maxCombo: number;
  timeElapsed: number;
  timeLimit: number;
  gameStarted: boolean;
  gameFinished: boolean;
  difficulty: Difficulty;
  perfectRun: boolean;
  fastestReaction: number | null;
  lastSelectionTime: number;
}

const MATCH_SETS = {
  easy: [
    { pairs: [['🍎', 'Apple'], ['🍌', 'Banana'], ['🍇', 'Grape'], ['🍊', 'Orange'], ['🍓', 'Strawberry'], ['🍒', 'Cherry']] },
    { pairs: [['🐶', 'Dog'], ['🐱', 'Cat'], ['🐭', 'Mouse'], ['🐰', 'Rabbit'], ['🦊', 'Fox'], ['🐻', 'Bear']] },
    { pairs: [['1+1', '2'], ['2+2', '4'], ['3+3', '6'], ['5+5', '10'], ['4+4', '8'], ['6+6', '12']] },
  ],
  medium: [
    { pairs: [['🇫🇷', 'Paris'], ['🇬🇧', 'London'], ['🇯🇵', 'Tokyo'], ['🇺🇸', 'Washington'], ['🇮🇹', 'Rome'], ['🇪🇸', 'Madrid'], ['🇩🇪', 'Berlin'], ['🇨🇳', 'Beijing']] },
    { pairs: [['H2O', 'Water'], ['CO2', 'Carbon Dioxide'], ['O2', 'Oxygen'], ['NaCl', 'Salt'], ['C6H12O6', 'Glucose'], ['Fe', 'Iron'], ['Au', 'Gold'], ['Ag', 'Silver']] },
    { pairs: [['×', 'Multiply'], ['÷', 'Divide'], ['+', 'Add'], ['-', 'Subtract'], ['=', 'Equals'], ['<', 'Less Than'], ['>', 'Greater Than'], ['%', 'Percent']] },
  ],
  hard: [
    { pairs: [['🎨', 'Art'], ['🔬', 'Science'], ['📚', 'Literature'], ['🎵', 'Music'], ['🏛️', 'Architecture'], ['💻', 'Technology'], ['🧮', 'Mathematics'], ['🌍', 'Geography'], ['⚖️', 'Law'], ['💊', 'Medicine']] },
    { pairs: [['☀️', 'Star'], ['🌍', 'Planet'], ['🌙', 'Moon'], ['☄️', 'Comet'], ['🌌', 'Galaxy'], ['🔭', 'Telescope'], ['🚀', 'Rocket'], ['👨‍🚀', 'Astronaut'], ['🛸', 'UFO'], ['⭐', 'Constellation']] },
    { pairs: [['🧬', 'DNA'], ['🦠', 'Bacteria'], ['🔬', 'Microscope'], ['⚗️', 'Chemistry'], ['🧪', 'Experiment'], ['🧲', 'Magnet'], ['⚡', 'Electricity'], ['💡', 'Invention'], ['🔋', 'Battery'], ['📡', 'Signal']] },
  ],
};

export function createMatchChallengeState(difficulty: Difficulty): MatchChallengeState {
  const sets = MATCH_SETS[difficulty];
  const set = sets[Math.floor(Math.random() * sets.length)];
  
  const items: MatchItem[] = [];
  let id = 0;
  
  set.pairs.forEach((pair, index) => {
    items.push({ id: id++, content: pair[0], matchId: index, matched: false });
    items.push({ id: id++, content: pair[1], matchId: index, matched: false });
  });
  
  // Shuffle
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  
  const timeLimit = { easy: 90, medium: 75, hard: 60 }[difficulty];
  
  return {
    items,
    selected: null,
    matchesFound: 0,
    totalMatches: set.pairs.length,
    attempts: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    timeElapsed: 0,
    timeLimit,
    gameStarted: false,
    gameFinished: false,
    difficulty,
    perfectRun: true,
    fastestReaction: null,
    lastSelectionTime: Date.now(),
  };
}

export function calculateMatchRewards(
  matchesFound: number,
  score: number,
  difficulty: Difficulty,
  maxCombo: number,
  attempts: number,
  perfectRun: boolean
): { coins: number; xp: number } {
  let baseCoins = matchesFound * 4;
  let baseXP = matchesFound * 6;
  
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2,
  }[difficulty];
  
  baseCoins = Math.round(baseCoins * difficultyMultiplier);
  baseXP = Math.round(baseXP * difficultyMultiplier);
  
  if (maxCombo >= 5) {
    baseCoins += 20;
    baseXP += 10;
  }
  
  if (perfectRun) {
    baseCoins += 40;
    baseXP += 20;
  }
  
  return { coins: baseCoins, xp: baseXP };
}
