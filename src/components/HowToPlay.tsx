import React from 'react';

interface HowToPlayProps {
  onClose: () => void;
}

export const HowToPlay: React.FC<HowToPlayProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🧠</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            How to Play
          </h2>
        </div>
        
        <div className="space-y-4 text-left">
          <Step number={1} text="Flip two cards by clicking or tapping them." />
          <Step number={2} text="Find matching pairs of symbols." />
          <Step number={3} text="Remember card positions to match pairs faster." />
          <Step number={4} text="Match all pairs to win the game." />
          <Step number={5} text="Finish with the best time and fewest moves!" />
        </div>
        
        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
          <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium mb-2">💡 Tips:</p>
          <ul className="text-xs text-indigo-600 dark:text-indigo-400 space-y-1">
            <li>• Fewer moves = higher score</li>
            <li>• Faster completion = time bonus</li>
            <li>• Higher difficulty = score multiplier</li>
            <li>• Use keyboard arrows + Enter to play</li>
          </ul>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200"
        >
          GOT IT!
        </button>
      </div>
    </div>
  );
};

const Step: React.FC<{ number: number; text: string }> = ({ number, text }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{number}</span>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-300 pt-0.5">{text}</p>
  </div>
);
