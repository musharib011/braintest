import React, { useState } from 'react';
import { PlayerData } from '../game/types';

interface SettingsPanelProps {
  playerData: PlayerData;
  onClose: () => void;
  onToggleSound: () => void;
  onToggleTheme: () => void;
  onResetProgress: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  playerData, onClose, onToggleSound, onToggleTheme, onResetProgress
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">⚙️ SETTINGS</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-xl">✕</button>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Sound</span>
            <button onClick={onToggleSound} className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium text-sm">
              {playerData.settings.soundEnabled ? '🔊 ON' : '🔇 OFF'}
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Theme</span>
            <button onClick={onToggleTheme} className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium text-sm">
              {playerData.settings.theme === 'light' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 px-6 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-xl transition-colors border border-red-200 dark:border-red-800"
          >
            🗑️ RESET ALL PROGRESS
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all"
        >
          CLOSE
        </button>

        {showResetConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">RESET ALL PROGRESS?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This will permanently delete all coins, XP, levels, skins, achievements, and statistics.</p>
              <div className="space-y-2">
                <button
                  onClick={() => { onResetProgress(); setShowResetConfirm(false); onClose(); }}
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
};
