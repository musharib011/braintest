import React, { useState } from 'react';
import { PlayerData } from '../game/types';
import { formatTime, formatScore } from '../game/logic';

interface StatisticsProps {
  data: PlayerData;
  onClose: () => void;
}

export const Statistics: React.FC<StatisticsProps> = ({ data, onClose }) => {
  const [tab, setTab] = useState<'global' | 'memory' | 'scramble' | 'builder' | 'math' | 'logic' | 'match' | 'focus' | 'pattern' | 'knowledge'>('global');
  const { statistics, streak } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl animate-scale-in my-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">📊 STATISTICS</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-xl">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-700 rounded-xl p-1 overflow-x-auto">
          <TabButton active={tab === 'global'} onClick={() => setTab('global')} label="Global" />
          <TabButton active={tab === 'memory'} onClick={() => setTab('memory')} label="🧠" />
          <TabButton active={tab === 'scramble'} onClick={() => setTab('scramble')} label="🔀" />
          <TabButton active={tab === 'builder'} onClick={() => setTab('builder')} label="🔤" />
          <TabButton active={tab === 'math'} onClick={() => setTab('math')} label="🧮" />
          <TabButton active={tab === 'logic'} onClick={() => setTab('logic')} label="🧩" />
          <TabButton active={tab === 'match'} onClick={() => setTab('match')} label="🔗" />
          <TabButton active={tab === 'focus'} onClick={() => setTab('focus')} label="🎯" />
          <TabButton active={tab === 'pattern'} onClick={() => setTab('pattern')} label="🔷" />
          <TabButton active={tab === 'knowledge'} onClick={() => setTab('knowledge')} label="📚" />
        </div>

        {tab === 'global' && (
          <div className="space-y-2">
            <StatRow icon="🎮" label="Total Games" value={String(statistics.gamesPlayed)} />
            <StatRow icon="🏆" label="Games Won" value={String(statistics.gamesWon)} />
            <StatRow icon="✨" label="Perfect Runs" value={String(statistics.perfectRuns)} />
            <StatRow icon="🔥" label="Highest Combo" value={`x${statistics.highestCombo}`} />
            <StatRow icon="🪙" label="Total Coins Earned" value={formatScore(statistics.totalCoinsEarned)} />
            <StatRow icon="📅" label="Daily Challenges" value={String(statistics.dailyChallengesCompleted)} />
            <StatRow icon="🔥" label="Current Streak" value={`${streak.current} days`} />
            <StatRow icon="🔥" label="Longest Streak" value={`${streak.longest} days`} />
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase">Games by Mode</p>
              <StatRow icon="🧠" label="Memory Flip" value={String(statistics.gamesPlayedByMode.memoryFlip)} />
              <StatRow icon="🔀" label="Word Scramble" value={String(statistics.gamesPlayedByMode.wordScramble)} />
              <StatRow icon="🔤" label="Word Builder" value={String(statistics.gamesPlayedByMode.wordBuilder)} />
            </div>
          </div>
        )}

        {tab === 'memory' && (
          <div className="space-y-2">
            <StatRow icon="🎮" label="Games Played" value={String(statistics.gamesPlayedByMode.memoryFlip)} />
            <StatRow icon="🃏" label="Pairs Matched" value={formatScore(statistics.totalPairsMatched)} />
            <StatRow icon="🎯" label="Total Moves" value={formatScore(statistics.totalMoves)} />
            <StatRow icon="✨" label="Perfect Runs" value={String(statistics.perfectRuns)} />
            <StatRow icon="⏱️" label="Best Time (Easy)" value={statistics.bestTimeEasy !== null ? formatTime(statistics.bestTimeEasy) : '—'} />
            <StatRow icon="⏱️" label="Best Time (Medium)" value={statistics.bestTimeMedium !== null ? formatTime(statistics.bestTimeMedium) : '—'} />
            <StatRow icon="⏱️" label="Best Time (Hard)" value={statistics.bestTimeHard !== null ? formatTime(statistics.bestTimeHard) : '—'} />
          </div>
        )}

        {tab === 'scramble' && (
          <div className="space-y-2">
            <StatRow icon="🎮" label="Games Played" value={String(statistics.scrambleGamesPlayed)} />
            <StatRow icon="📝" label="Words Solved" value={String(statistics.scrambleWordsSolved)} />
            <StatRow icon="⭐" label="Best Score" value={formatScore(statistics.scrambleBestScore)} />
            <StatRow icon="🔥" label="Highest Combo" value={`x${statistics.scrambleHighestCombo}`} />
            <StatRow icon="✨" label="Perfect Runs" value={String(statistics.scramblePerfectRuns)} />
          </div>
        )}

        {tab === 'builder' && (
          <div className="space-y-2">
            <StatRow icon="🎮" label="Games Played" value={String(statistics.builderGamesPlayed)} />
            <StatRow icon="📝" label="Words Created" value={String(statistics.builderWordsCreated)} />
            <StatRow icon="⭐" label="Best Score" value={formatScore(statistics.builderBestScore)} />
            <StatRow icon="🔥" label="Highest Combo" value={`x${statistics.builderHighestCombo}`} />
            <StatRow icon="✨" label="Perfect Runs" value={String(statistics.builderPerfectRuns)} />
            <StatRow icon="📏" label="Longest Word" value={statistics.builderLongestWord || '—'} />
          </div>
        )}

        {tab === 'math' && (
          <div className="space-y-2">
            <StatRow icon="🎮" label="Games Played" value={String(statistics.mathGamesPlayed)} />
            <StatRow icon="📝" label="Questions Answered" value={String(statistics.mathQuestionsAnswered)} />
            <StatRow icon="✓" label="Correct Answers" value={String(statistics.mathCorrectAnswers)} />
            <StatRow icon="⭐" label="Best Score" value={formatScore(statistics.mathBestScore)} />
            <StatRow icon="🔥" label="Highest Combo" value={`x${statistics.mathHighestCombo}`} />
            <StatRow icon="⚡" label="Fastest Answer" value={statistics.mathFastestAnswer !== null ? `${statistics.mathFastestAnswer.toFixed(1)}s` : '—'} />
          </div>
        )}

        {tab === 'logic' && (
          <div className="space-y-2">
            <StatRow icon="🎮" label="Games Played" value={String(statistics.logicGamesPlayed)} />
            <StatRow icon="🧩" label="Puzzles Solved" value={String(statistics.logicPuzzlesSolved)} />
            <StatRow icon="⭐" label="Best Score" value={formatScore(statistics.logicBestScore)} />
            <StatRow icon="🔥" label="Highest Combo" value={`x${statistics.logicHighestCombo}`} />
          </div>
        )}

        {tab === 'match' && (
          <div className="space-y-2">
            <StatRow icon="🎮" label="Games Played" value={String(statistics.matchGamesPlayed)} />
            <StatRow icon="🔗" label="Matches Made" value={String(statistics.matchMatchesMade)} />
            <StatRow icon="⭐" label="Best Score" value={formatScore(statistics.matchBestScore)} />
            <StatRow icon="⚡" label="Fastest Reaction" value={statistics.matchFastestReaction !== null ? `${statistics.matchFastestReaction.toFixed(1)}s` : '—'} />
          </div>
        )}

        {tab === 'focus' && (
          <div className="space-y-2">
            <StatRow icon="🎮" label="Games Played" value={String(statistics.focusGamesPlayed)} />
            <StatRow icon="⭐" label="Best Score" value={formatScore(statistics.focusBestScore)} />
            <StatRow icon="⚡" label="Fastest Reaction" value={statistics.focusFastestReaction !== null ? `${statistics.focusFastestReaction.toFixed(1)}s` : '—'} />
          </div>
        )}

        {tab === 'pattern' && (
          <div className="space-y-2">
            <StatRow icon="🎮" label="Games Played" value={String(statistics.patternGamesPlayed)} />
            <StatRow icon="🔷" label="Patterns Solved" value={String(statistics.patternPuzzlesSolved)} />
            <StatRow icon="⭐" label="Best Score" value={formatScore(statistics.patternBestScore)} />
          </div>
        )}

        {tab === 'knowledge' && (
          <div className="space-y-2">
            <StatRow icon="🎮" label="Games Played" value={String(statistics.knowledgeGamesPlayed)} />
            <StatRow icon="📝" label="Questions Answered" value={String(statistics.knowledgeQuestionsAnswered)} />
            <StatRow icon="✓" label="Correct Answers" value={String(statistics.knowledgeCorrectAnswers)} />
            <StatRow icon="⭐" label="Best Score" value={formatScore(statistics.knowledgeBestScore)} />
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all duration-200"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};

const StatRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
    </div>
    <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{value}</span>
  </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
      active ? 'bg-white dark:bg-gray-600 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
    }`}
  >
    {label}
  </button>
);
