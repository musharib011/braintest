// Card types
export type CardState = 'hidden' | 'revealed' | 'matched';

export interface Card {
  id: number;
  pairId: number;
  symbol: string;
  state: CardState;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  cols: number;
  rows: number;
  totalPairs: number;
  multiplier: number;
  label: string;
}

export interface GameState {
  cards: Card[];
  score: number;
  moves: number;
  matchedPairs: number;
  totalPairs: number;
  firstCard: number | null;
  secondCard: number | null;
  locked: boolean;
  gameStarted: boolean;
  gameFinished: boolean;
  paused: boolean;
  difficulty: Difficulty;
  timeElapsed: number;
  totalAttempts: number;
  combo: number;
  maxCombo: number;
  perfectRun: boolean;
  mismatchedIds: number[];
}

export interface BestScore {
  score: number;
  time: number;
  moves: number;
  accuracy: number;
}

// Progression types
export interface Skin {
  id: string;
  name: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  cardBack: string;
  cardFront: string;
  accent: string;
  glow: string;
  icon: string;
}

export interface Emote {
  id: string;
  emoji: string;
  name: string;
  unlockType: 'level' | 'achievement' | 'coins' | 'free';
  unlockRequirement: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  rewardCoins: number;
  rewardXP: number;
  statKey: string;
}

export interface Booster {
  multiplier: number;
  expiresAt: number;
}

export type GameMode = 'memoryFlip' | 'wordScramble' | 'wordBuilder' | 'mathChallenge' | 'logicPuzzles' | 'patternRecognition' | 'knowledgeQuiz';

export interface DailyChallenge {
  id: string;
  description: string;
  type: string;
  target: number;
  difficulty?: Difficulty;
  gameMode?: GameMode;
  rewardCoins: number;
  rewardXP: number;
}

export interface PlayerData {
  version: number;
  coins: number;
  xp: number;
  level: number;
  totalXPEarned: number;
  skinsOwned: string[];
  equippedSkin: string;
  emotesOwned: string[];
  equippedEmote: string | null;
  achievementsUnlocked: string[];
  statistics: {
    gamesPlayed: number;
    gamesWon: number;
    perfectRuns: number;
    totalPairsMatched: number;
    totalMoves: number;
    totalCoinsEarned: number;
    highestCombo: number;
    bestTimeEasy: number | null;
    bestTimeMedium: number | null;
    bestTimeHard: number | null;
    dailyChallengesCompleted: number;
    // Word Scramble stats
    scrambleGamesPlayed: number;
    scrambleWordsSolved: number;
    scramblePerfectRuns: number;
    scrambleBestScore: number;
    scrambleHighestCombo: number;
    // Word Builder stats
    builderGamesPlayed: number;
    builderWordsCreated: number;
    builderPerfectRuns: number;
    builderBestScore: number;
    builderHighestCombo: number;
    builderLongestWord: string;
    // Math Challenge stats
    mathGamesPlayed: number;
    mathQuestionsAnswered: number;
    mathCorrectAnswers: number;
    mathBestScore: number;
    mathHighestCombo: number;
    mathFastestAnswer: number | null;
    // Logic Puzzles stats
    logicGamesPlayed: number;
    logicPuzzlesSolved: number;
    logicBestScore: number;
    logicHighestCombo: number;
    // Match Challenge stats
    matchGamesPlayed: number;
    matchMatchesMade: number;
    matchBestScore: number;
    matchFastestReaction: number | null;
    // Focus Game stats
    focusGamesPlayed: number;
    focusBestScore: number;
    focusFastestReaction: number | null;
    // Pattern Recognition stats
    patternGamesPlayed: number;
    patternPuzzlesSolved: number;
    patternBestScore: number;
    // Knowledge Quiz stats
    knowledgeGamesPlayed: number;
    knowledgeQuestionsAnswered: number;
    knowledgeCorrectAnswers: number;
    knowledgeBestScore: number;
    // Cross-game stats
    gamesPlayedByMode: {
      memoryFlip: number;
      wordScramble: number;
      wordBuilder: number;
      mathChallenge: number;
      logicPuzzles: number;
      matchChallenge: number;
      focusGame: number;
      patternRecognition: number;
      knowledgeQuiz: number;
    };
  };
  dailyChallenge: {
    date: string;
    challengeId: string;
    completed: boolean;
    progress: number;
  };
  streak: {
    current: number;
    longest: number;
    lastCompletedDate: string;
    milestonesClaimed: number[];
  };
  booster: Booster | null;
  settings: {
    soundEnabled: boolean;
    theme: 'light' | 'dark';
  };
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: { cols: 4, rows: 4, totalPairs: 8, multiplier: 1, label: 'Easy' },
  medium: { cols: 6, rows: 6, totalPairs: 18, multiplier: 1.5, label: 'Medium' },
  hard: { cols: 8, rows: 8, totalPairs: 32, multiplier: 2, label: 'Hard' },
};

// Expanded symbol pools organized by category for visual variety
export const SYMBOL_CATEGORIES = {
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', '🦂', '🐢', '🐍', '🦎', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿', '🦔'],
  food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯'],
  nature: ['🌸', '💮', '🏵', '🌹', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘', '🍀', '🍁', '🍂', '🍃', '🍄', '🌰', '🦀', '🌍', '🌎', '🌏', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '☀', '🌝', '🌞', '⭐', '🌟', '🌠', '☁', '⛅', '⛈', '🌤', '🌥', '🌦', '🌧', '🌨', '🌩', '🌪', '🌫', '🌬', '🌈', '🌂', '☂', '☔', '⛱', '⚡', '❄', '☃', '⛄', '☄', '🔥', '💧', '🌊'],
  technology: ['⌚', '📱', '💻', '⌨', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽', '🎞', '📞', '☎', '📟', '📠', '📺', '📻', '🎙', '🎚', '🎛', '🧭', '⏱', '⏲', '⏰', '🕰', '📡', '🔋', '🔌', '💡', '🔦', '🕯', '🪔', '🧯', '🛢', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖', '🪜', '🧰', '🪛', '🔧', '🔨', '⚒', '🛠', '⛏', '🪚', '🔩', '⚙', '🪤', '🧱', '⛓', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡', '⚔', '🛡', '🚬', '⚰', '🪦', '⚱', '🏺', '🔮', '📿', '🧿', '💈', '⚗', '🔭', '🔬', '🕳', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡', '🧹', '🪠', '🧺', '🧻', '🚽', '🚰', '🚿', '🛁', '🪤', '🪒', '🧴', '🧷', '🧸', '🪆', '🖼', '🪞', '🪟', '🛍', '🛒', '🎁', '🎈', '🎏', '🎀', '🪄', '🪅', '🎊', '🎉', '🎎', '🏮', '🎐', '🧧', '✉', '📩', '📨', '📧', '💌', '📥', '📤', '📦', '🏷', '🪧', '📪', '📫', '📬', '📭', '📮', '📯', '📜', '📃', '📄', '📑', '🧾', '📊', '📈', '📉', '🗒', '🗓', '📆', '📅', '🗑', '📇', '🗃', '🗳', '🗄', '📋', '📁', '📂', '🗂', '🗞', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '📚', '📖', '🔖', '🧷', '🔗', '📎', '🖇', '📐', '📏', '🧮', '📌', '📍', '✂', '🖊', '🖋', '✒', '🖌', '🖍', '📝', '✏', '🔍', '🔎', '🔏', '🔐', '🔒', '🔓'],
  sports: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸', '🥿', '🎿', '⛷', '🏂', '🪂', '🏋', '🤼', '🤸', '⛹', '🤺', '🤾', '🏌', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖', '🏵'],
  travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🦯', '🦽', '🦼', '🛴', '🚲', '🛵', '🏍', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈', '🛫', '🛬', '🛩', '💺', '🛰', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥', '🛳', '⛴', '🚢', '⚓', '🪝', '⛽', '🚧', '🚦', '🚥', '🗺', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟', '🎡', '🎢', '🎠', '⛲', '⛱', '🏖', '🏝', '🏜', '🌋', '⛰', '🏔', '🗻', '🏕', '⛺', '🛖', '🏠', '🏡', '🏘', '🏚', '🏗', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛', '⛪', '🕌', '🕍', '🛕', '🕋', '⛩'],
  symbols: ['❤', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮', '✝', '☪', '🕉', '☸', '✡', '🔯', '🕎', '☯', '☦', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛', '🉑', '☢', '☣', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷', '✴', '🆚', '💮', '🉐', '㊙', '㊗', '🈴', '🈵', '🈹', '🈲', '🅰', '🅱', '🆎', '🆑', '🅾', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼', '⁉', '🔅', '🔆', '〽', '⚠', '🚸', '🔱', '⚜', '🔰', '♻', '✅', '🈯', '💹', '❇', '✳', '❎', '🌐', '💠', 'Ⓜ', '🌀', '💤', '🏧', '🚾', '♿', '🅿', '🛗', '🈳', '🈂', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚻', '🚼', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0⃣', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟', '🔢', '#⃣', '*⃣', '⏏', '▶', '⏸', '⏯', '⏹', '⏺', '⏭', '⏮', '⏩', '⏪', '⏫', '⏬', '◀', ' 🔼', '🔽', '➡', '⬅', '⬆', '⬇', '↗', '↘', '↙', '↖', '↕', '↔', '↪', '↩', '⤴', '⤵', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖', '♾', '💲', '💱', '™', '©', '®', '👁‍🗨', '🔚', '🔙', '🔛', '🔝', '🔜', '〰', '➰', '➿', '✔', '☑', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪', '▫', '◾', '◽', '◼', '◻', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '👁‍🗨', '💬', '💭', '🗯', '♠', '♣', '♥', '♦', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧'],
};

// Legacy compatibility - combined pool
export const SYMBOLS: string[] = [
  ...SYMBOL_CATEGORIES.animals.slice(0, 20),
  ...SYMBOL_CATEGORIES.food.slice(0, 20),
  ...SYMBOL_CATEGORIES.nature.slice(0, 20),
  ...SYMBOL_CATEGORIES.technology.slice(0, 20),
  ...SYMBOL_CATEGORIES.sports.slice(0, 20),
  ...SYMBOL_CATEGORIES.travel.slice(0, 20),
  ...SYMBOL_CATEGORIES.symbols.slice(0, 20),
];
