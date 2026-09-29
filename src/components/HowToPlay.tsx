import React from 'react';

interface HowToPlayProps {
  onClose: () => void;
}

export const HowToPlay: React.FC<HowToPlayProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🧠</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">How to Play</h2>
        </div>
        
        <div className="space-y-3 text-left">
          <Step number={1} text="Flip two cards by clicking or tapping them." />
          <Step number={2} text="Find matching pairs of symbols." />
          <Step number={3} text="Remember card positions to match pairs faster." />
          <Step number={4} text="Build combos with consecutive matches for bonus rewards!" />
          <Step number={5} text="Match all pairs to win the game." />
        </div>
        
        <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
          <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium mb-1.5">💡 Tips:</p>
          <ul className="text-[11px] text-indigo-600 dark:text-indigo-400 space-y-0.5">
            <li>• Fewer moves = higher score</li>
            <li>• Build combos for bonus coins & XP</li>
            <li>• Perfect runs (no mismatches) earn big rewards</li>
            <li>• Complete daily challenges for extra rewards</li>
            <li>• Use XP boosters to level up faster</li>
          </ul>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200"
        >
          GOT IT!
        </button>
      </div>
    </div>
  );
};

const Step: React.FC<{ number: number; text: string }> = ({ number, text }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{number}</span>
    </div>
    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 pt-0.5">{text}</p>
  </div>
);
