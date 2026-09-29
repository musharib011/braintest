import React from 'react';
import { Difficulty, DIFFICULTY_CONFIGS, BestScore, PlayerData } from '../game/types';
import { formatScore, getXPForLevel, isBoosterActive, getBoosterTimeRemaining, formatTime } from '../game/logic';
import { loadBestScore } from '../game/storage';

type MenuScreen = 'main' | 'settings';

interface GameMenuProps {
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onStartGame: () => void;
  onShowHowToPlay: () => void;
  onOpenShop: () => void;
  onOpenAchievements: () => void;
  onOpenProfile: () => void;
  onOpenStatistics: () => void;
  onOpenDaily: () => void;
  playerData: PlayerData;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onResetProgress: () => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({
  difficulty, onDifficultyChange, onStartGame, onShowHowToPlay,
  onOpenShop, onOpenAchievements, onOpenProfile, onOpenStatistics, onOpenDaily,
  playerData, soundEnabled, onToggleSound, theme, onToggleTheme, onResetProgress
}) => {
  const [menuScreen, setMenuScreen] = React.useState<MenuScreen>('main');
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  const xpForNext = getXPForLevel(playerData.level);
  const xpPercent = (playerData.xp / xpForNext) * 100;
  const boosterActive = isBoosterActive(playerData);
  const boosterRemaining = getBoosterTimeRemaining(playerData);

  const bestScores: Record<Difficulty, BestScore | null> = {
    easy: loadBestScore('easy'),
    medium: loadBestScore('medium'),
    hard: loadBestScore('hard'),
  };

  if (menuScreen === 'settings') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">⚙️ SETTINGS</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Sound</span>
              <button onClick={onToggleSound} className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium text-sm">
                {soundEnabled ? '🔊 ON' : '🔇 OFF'}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Theme</span>
              <button onClick={onToggleTheme} className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium text-sm">
                {theme === 'light' ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-3 px-6 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-xl transition-colors border border-red-200 dark:border-red-800"
            >
              🗑️ RESET ALL PROGRESS
            </button>
          </div>

          <button
            onClick={() => setMenuScreen('main')}
            className="w-full py-3 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all"
          >
            ← BACK
          </button>

          {showResetConfirm && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in text-center">
                <div className="text-4xl mb-3">⚠️</div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">RESET ALL PROGRESS?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This will permanently delete all coins, XP, levels, skins, achievements, and statistics.</p>
                <div className="space-y-2">
                  <button
                    onClick={() => { onResetProgress(); setShowResetConfirm(false); setMenuScreen('main'); }}
                    className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors"
                  >
                    RESET
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="w-full py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-colors"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full text-center">
        {/* Player summary bar */}
        <div className="flex items-center justify-between mb-4 p-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
          <button onClick={onOpenProfile} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {playerData.level}
            </div>
            <div className="text-left">
              <div className="text-[10px] text-gray-500 dark:text-gray-400">Level {playerData.level}</div>
              <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>
          </button>
          <div className="flex items-center gap-3">
            {boosterActive && (
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                ⚡{formatTime(Math.floor(boosterRemaining / 1000))}
              </span>
            )}
            <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">🪙 {formatScore(playerData.coins)}</span>
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">🔥 {playerData.streak.current}</span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <div className="animate-float inline-block mb-3">
            <span className="text-5xl">🧠</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-1">
            MEMORY FLIP
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm italic">How good is your memory?</p>
        </div>

        {/* Difficulty */}
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(DIFFICULTY_CONFIGS) as Difficulty[]).map((d) => {
              const config = DIFFICULTY_CONFIGS[d];
              const isSelected = difficulty === d;
              const best = bestScores[d];
              return (
                <button
                  key={d}
                  onClick={() => onDifficultyChange(d)}
                  className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all duration-200 ${
                    isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-md scale-105' : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className={`text-sm sm:text-base font-bold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-200'}`}>{config.label}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">{config.cols}×{config.rows}</div>
                  {best && <div className="text-[9px] text-indigo-500 dark:text-indigo-400 mt-0.5">🏆 {formatScore(best.score)}</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Play button */}
        <button
          onClick={onStartGame}
          className="w-full py-3.5 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mb-3"
        >
          ▶ PLAY
        </button>

        {/* Navigation grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <NavButton icon="📅" label="Daily" onClick={onOpenDaily} />
          <NavButton icon="🛍️" label="Shop" onClick={onOpenShop} />
          <NavButton icon="🏆" label="Awards" onClick={onOpenAchievements} />
          <NavButton icon="📊" label="Stats" onClick={onOpenStatistics} />
          <NavButton icon="❓" label="Help" onClick={onShowHowToPlay} />
          <NavButton icon="⚙️" label="Settings" onClick={() => setMenuScreen('settings')} />
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
