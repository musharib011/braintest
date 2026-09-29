import React from 'react';

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onQuitToMenu: () => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({ onResume, onRestart, onQuitToMenu }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-scale-in text-center">
        <div className="text-5xl mb-3">⏸️</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">GAME PAUSED</h2>
        <div className="space-y-3">
          <button onClick={onResume} className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
            ▶️ RESUME
          </button>
          <button onClick={onRestart} className="w-full py-3 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all duration-200">
            🔄 RESTART
          </button>
          <button onClick={onQuitToMenu} className="w-full py-3 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all duration-200">
            🏠 QUIT TO MENU
          </button>
        </div>
      </div>
    </div>
  );
};
