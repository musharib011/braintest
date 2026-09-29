import React from 'react';
import { PlayerData, Difficulty, DIFFICULTY_CONFIGS, BestScore } from '../game/types';
import { formatScore, getXPForLevel, isBoosterActive, getBoosterTimeRemaining, formatTime } from '../game/logic';
import { loadBestScore } from '../game/storage';

type GameMode = 'memoryFlip' | 'wordScramble' | 'wordBuilder' | 'mathChallenge' | 'logicPuzzles' | 'matchChallenge' | 'focusGame' | 'patternRecognition' | 'knowledgeQuiz';

interface GameHubProps {
  playerData: PlayerData;
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onSelectGame: (mode: GameMode) => void;
  onOpenShop: () => void;
  onOpenAchievements: () => void;
  onOpenProfile: () => void;
  onOpenStatistics: () => void;
  onOpenDaily: () => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const GameHub: React.FC<GameHubProps> = ({
  playerData, difficulty, onDifficultyChange, onSelectGame,
  onOpenShop, onOpenAchievements, onOpenProfile, onOpenStatistics,
  onOpenDaily, onOpenSettings, onOpenHowToPlay,
  soundEnabled, onToggleSound, theme, onToggleTheme
}) => {
  const xpForNext = getXPForLevel(playerData.level);
  const xpPercent = (playerData.xp / xpForNext) * 100;
  const boosterActive = isBoosterActive(playerData);
  const boosterRemaining = getBoosterTimeRemaining(playerData);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 animate-fade-in">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="animate-float inline-block mb-2">
            <span className="text-4xl">🧠</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            BRAIN ARCADE
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm italic">Play. Learn. Level Up.</p>
        </div>

        {/* Player Summary */}
        <button onClick={onOpenProfile} className="w-full mb-4 p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {playerData.level}
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-500 dark:text-gray-400">Level {playerData.level}</div>
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all" style={{ width: `${xpPercent}%` }} />
                </div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{playerData.xp}/{xpForNext} XP</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-right">
              {boosterActive && (
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  ⚡{formatTime(Math.floor(boosterRemaining / 1000))}
                </span>
              )}
              <div>
                <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400">🪙 {formatScore(playerData.coins)}</div>
                <div className="text-sm font-bold text-orange-600 dark:text-orange-400">🔥 {playerData.streak.current}</div>
              </div>
            </div>
          </div>
        </button>

        {/* Game Modes */}
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Game Modes</h2>
        <div className="space-y-3 mb-4">
          {/* Memory Flip */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🧠</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 dark:text-white">MEMORY FLIP</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Test your memory and concentration.</p>
                <div className="flex items-center gap-2 mt-2">
                  <select
                    value={difficulty}
                    onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
                    className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <button
                    onClick={() => onSelectGame('memoryFlip')}
                    className="flex-1 py-1.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold rounded-lg shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    ▶ PLAY
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Word Scramble */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔀</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 dark:text-white">WORD SCRAMBLE</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Unscramble letters and discover hidden words.</p>
                <div className="flex items-center gap-2 mt-2">
                  <select
                    value={difficulty}
                    onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
                    className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <button
                    onClick={() => onSelectGame('wordScramble')}
                    className="flex-1 py-1.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold rounded-lg shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    ▶ PLAY
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Word Builder */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔤</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 dark:text-white">WORD BUILDER</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Create words from a set of letters.</p>
                <div className="flex items-center gap-2 mt-2">
                  <select
                    value={difficulty}
                    onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
                    className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <button
                    onClick={() => onSelectGame('wordBuilder')}
                    className="flex-1 py-1.5 px-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold rounded-lg shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    ▶ PLAY
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Math Challenge */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🧮</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 dark:text-white">MATH CHALLENGE</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Solve math problems quickly and accurately.</p>
                <div className="flex items-center gap-2 mt-2">
                  <select
                    value={difficulty}
                    onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
                    className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <button
                    onClick={() => onSelectGame('mathChallenge')}
                    className="flex-1 py-1.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold rounded-lg shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    ▶ PLAY
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Logic Puzzles */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🧩</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 dark:text-white">LOGIC PUZZLES</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Test your logical reasoning skills.</p>
                <div className="flex items-center gap-2 mt-2">
                  <select
                    value={difficulty}
                    onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
                    className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <button
                    onClick={() => onSelectGame('logicPuzzles')}
                    className="flex-1 py-1.5 px-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-xs font-bold rounded-lg shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    ▶ PLAY
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Match Challenge */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔗</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 dark:text-white">MATCH CHALLENGE</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Match pairs quickly before time runs out.</p>
                <div className="flex items-center gap-2 mt-2">
                  <select
                    value={difficulty}
                    onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
                    className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <button
                    onClick={() => onSelectGame('matchChallenge')}
                    className="flex-1 py-1.5 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xs font-bold rounded-lg shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    ▶ PLAY
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Focus Game */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🎯</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 dark:text-white">FOCUS GAME</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Test your attention and reaction speed.</p>
                <div className="flex items-center gap-2 mt-2">
                  <select
                    value={difficulty}
                    onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
                    className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <button
                    onClick={() => onSelectGame('focusGame')}
                    className="flex-1 py-1.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold rounded-lg shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    ▶ PLAY
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pattern Recognition */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔷</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 dark:text-white">PATTERN RECOGNITION</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Identify patterns in sequences.</p>
                <div className="flex items-center gap-2 mt-2">
                  <select
                    value={difficulty}
                    onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
                    className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <button
                    onClick={() => onSelectGame('patternRecognition')}
                    className="flex-1 py-1.5 px-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white text-xs font-bold rounded-lg shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    ▶ PLAY
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Knowledge Quiz */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📚</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 dark:text-white">KNOWLEDGE QUIZ</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Test your general knowledge.</p>
                <div className="flex items-center gap-2 mt-2">
                  <select
                    value={difficulty}
                    onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
                    className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <button
                    onClick={() => onSelectGame('knowledgeQuiz')}
                    className="flex-1 py-1.5 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold rounded-lg shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    ▶ PLAY
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Challenge Banner */}
        <button
          onClick={onOpenDaily}
          className="w-full mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">🔥 Daily Challenge</div>
              <div className="text-sm text-gray-700 dark:text-gray-200 mt-0.5">Complete today's challenge</div>
            </div>
            <div className="text-right text-xs">
              <div className="text-yellow-600 dark:text-yellow-400 font-bold">+250 🪙</div>
              <div className="text-indigo-600 dark:text-indigo-400 font-bold">+100 XP</div>
            </div>
          </div>
        </button>

        {/* Navigation Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <NavButton icon="🏆" label="Awards" onClick={onOpenAchievements} />
          <NavButton icon="🛍️" label="Shop" onClick={onOpenShop} />
          <NavButton icon="📊" label="Stats" onClick={onOpenStatistics} />
          <NavButton icon="❓" label="Help" onClick={onOpenHowToPlay} />
          <NavButton icon="⚙️" label="Settings" onClick={onOpenSettings} />
          <NavButton icon="👤" label="Profile" onClick={onOpenProfile} />
        </div>

        {/* Quick toggles */}
        <div className="flex items-center justify-center gap-3">
          <button onClick={onToggleSound} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-lg" aria-label="Toggle sound">
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button onClick={onToggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-lg" aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ icon: string; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="p-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl transition-all hover:scale-105 active:scale-95"
  >
    <div className="text-lg">{icon}</div>
    <div className="text-[10px] font-medium text-gray-600 dark:text-gray-300 mt-0.5">{label}</div>
  </button>
);
