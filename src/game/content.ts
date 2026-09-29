import { Skin, Emote, Achievement } from './types';

export const SKINS: Skin[] = [
  { id: 'classic', name: 'Classic', price: 0, rarity: 'common', cardBack: 'linear-gradient(135deg, #6366f1, #9333ea)', cardFront: '#ffffff', accent: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)', icon: '🎴' },
  { id: 'neon', name: 'Neon', price: 500, rarity: 'rare', cardBack: 'linear-gradient(135deg, #00ff88, #00ccff)', cardFront: '#0a0a0a', accent: '#00ff88', glow: 'rgba(0, 255, 136, 0.5)', icon: '💚' },
  { id: 'galaxy', name: 'Galaxy', price: 1000, rarity: 'epic', cardBack: 'linear-gradient(135deg, #1a0033, #4a0080, #0066cc)', cardFront: '#0d001a', accent: '#9966ff', glow: 'rgba(153, 102, 255, 0.5)', icon: '🌌' },
  { id: 'fire', name: 'Fire', price: 1500, rarity: 'epic', cardBack: 'linear-gradient(135deg, #ff4500, #ff8c00, #ffd700)', cardFront: '#1a0000', accent: '#ff6600', glow: 'rgba(255, 100, 0, 0.5)', icon: '🔥' },
  { id: 'ocean', name: 'Ocean', price: 1500, rarity: 'epic', cardBack: 'linear-gradient(135deg, #006994, #40e0d0, #00ced1)', cardFront: '#001a2c', accent: '#00bcd4', glow: 'rgba(0, 188, 212, 0.5)', icon: '🌊' },
  { id: 'forest', name: 'Forest', price: 2000, rarity: 'epic', cardBack: 'linear-gradient(135deg, #1b5e20, #4caf50, #8bc34a)', cardFront: '#0a1a0a', accent: '#4caf50', glow: 'rgba(76, 175, 80, 0.5)', icon: '🌲' },
  { id: 'gold', name: 'Gold', price: 3000, rarity: 'legendary', cardBack: 'linear-gradient(135deg, #b8860b, #ffd700, #ffec8b)', cardFront: '#1a1400', accent: '#ffd700', glow: 'rgba(255, 215, 0, 0.6)', icon: '👑' },
  { id: 'cyber', name: 'Cyber', price: 4000, rarity: 'legendary', cardBack: 'linear-gradient(135deg, #0a0a0a, #1a1a2e, #00ff41)', cardFront: '#000000', accent: '#00ff41', glow: 'rgba(0, 255, 65, 0.5)', icon: '🤖' },
  { id: 'candy', name: 'Candy', price: 5000, rarity: 'legendary', cardBack: 'linear-gradient(135deg, #ff69b4, #ff1493, #ff6ec7)', cardFront: '#1a0011', accent: '#ff69b4', glow: 'rgba(255, 105, 180, 0.5)', icon: '🍬' },
  { id: 'legendary', name: 'Legendary', price: 10000, rarity: 'legendary', cardBack: 'linear-gradient(135deg, #ff0080, #7928ca, #0070f3, #00dfd8)', cardFront: '#0a0014', accent: '#ff0080', glow: 'rgba(255, 0, 128, 0.6)', icon: '✨' },
];

export const EMOTES: Emote[] = [
  { id: 'fire', emoji: '🔥', name: 'Fire', unlockType: 'free', unlockRequirement: 0 },
  { id: 'cool', emoji: '😎', name: 'Cool', unlockType: 'level', unlockRequirement: 3 },
  { id: 'mindblown', emoji: '🤯', name: 'Mind Blown', unlockType: 'level', unlockRequirement: 5 },
  { id: 'perfect', emoji: '💯', name: 'Perfect', unlockType: 'achievement', unlockRequirement: 0 },
  { id: 'fast', emoji: '⚡', name: 'Fast', unlockType: 'level', unlockRequirement: 7 },
  { id: 'champion', emoji: '👑', name: 'Champion', unlockType: 'level', unlockRequirement: 10 },
  { id: 'bigbrain', emoji: '🧠', name: 'Big Brain', unlockType: 'achievement', unlockRequirement: 0 },
  { id: 'bullseye', emoji: '🎯', name: 'Bullseye', unlockType: 'coins', unlockRequirement: 200 },
  { id: 'rocket', emoji: '🚀', name: 'Rocket', unlockType: 'level', unlockRequirement: 15 },
  { id: 'winner', emoji: '🏆', name: 'Winner', unlockType: 'achievement', unlockRequirement: 0 },
  { id: 'insane', emoji: '😈', name: 'Insane', unlockType: 'coins', unlockRequirement: 500 },
  { id: 'amazing', emoji: '✨', name: 'Amazing', unlockType: 'level', unlockRequirement: 20 },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_flip', name: 'First Flip', description: 'Flip your first card', icon: '🃏', requirement: 1, rewardCoins: 10, rewardXP: 5, statKey: 'totalMoves' },
  { id: 'first_win', name: 'First Win', description: 'Complete your first game', icon: '🎉', requirement: 1, rewardCoins: 50, rewardXP: 25, statKey: 'gamesWon' },
  { id: 'memory_beginner', name: 'Memory Beginner', description: 'Complete 5 games', icon: '📚', requirement: 5, rewardCoins: 100, rewardXP: 50, statKey: 'gamesWon' },
  { id: 'memory_master', name: 'Memory Master', description: 'Complete 25 games', icon: '🎓', requirement: 25, rewardCoins: 500, rewardXP: 200, statKey: 'gamesWon' },
  { id: 'perfect_start', name: 'Perfect Start', description: 'Complete your first perfect game', icon: '⭐', requirement: 1, rewardCoins: 150, rewardXP: 75, statKey: 'perfectRuns' },
  { id: 'perfectionist', name: 'Perfectionist', description: 'Complete 10 perfect runs', icon: '💯', requirement: 10, rewardCoins: 500, rewardXP: 200, statKey: 'perfectRuns' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Complete Easy Mode under 30 seconds', icon: '⚡', requirement: 30, rewardCoins: 200, rewardXP: 100, statKey: 'bestTimeEasy' },
  { id: 'lightning', name: 'Lightning', description: 'Complete Medium Mode under 60 seconds', icon: '🌩️', requirement: 60, rewardCoins: 300, rewardXP: 150, statKey: 'bestTimeMedium' },
  { id: 'accurate', name: 'Accurate', description: 'Achieve 95%+ accuracy in a game', icon: '🎯', requirement: 95, rewardCoins: 200, rewardXP: 100, statKey: '_accuracy' },
  { id: 'combo_king', name: 'Combo King', description: 'Reach combo x5', icon: '🔥', requirement: 5, rewardCoins: 150, rewardXP: 75, statKey: 'highestCombo' },
  { id: 'combo_master', name: 'Combo Master', description: 'Reach combo x10', icon: '💥', requirement: 10, rewardCoins: 300, rewardXP: 150, statKey: 'highestCombo' },
  { id: 'coin_collector', name: 'Coin Collector', description: 'Earn 1,000 total coins', icon: '🪙', requirement: 1000, rewardCoins: 100, rewardXP: 50, statKey: 'totalCoinsEarned' },
  { id: 'rich', name: 'Rich', description: 'Earn 10,000 total coins', icon: '💰', requirement: 10000, rewardCoins: 500, rewardXP: 200, statKey: 'totalCoinsEarned' },
  { id: 'level_5', name: 'Rising Star', description: 'Reach Level 5', icon: '🌟', requirement: 5, rewardCoins: 200, rewardXP: 100, statKey: '_level' },
  { id: 'level_10', name: 'High Level', description: 'Reach Level 10', icon: '💫', requirement: 10, rewardCoins: 500, rewardXP: 200, statKey: '_level' },
  { id: 'hard_mode', name: 'Hard Mode', description: 'Complete Hard Mode', icon: '💪', requirement: 1, rewardCoins: 300, rewardXP: 150, statKey: '_hardModeWins' },
  { id: 'pairs_100', name: 'Pair Finder', description: 'Match 100 pairs total', icon: '🔍', requirement: 100, rewardCoins: 200, rewardXP: 100, statKey: 'totalPairsMatched' },
  { id: 'pairs_500', name: 'Memory Expert', description: 'Match 500 pairs total', icon: '🧩', requirement: 500, rewardCoins: 500, rewardXP: 200, statKey: 'totalPairsMatched' },
  { id: 'daily_5', name: 'Daily Player', description: 'Complete 5 daily challenges', icon: '📅', requirement: 5, rewardCoins: 300, rewardXP: 150, statKey: 'dailyChallengesCompleted' },
  { id: 'streak_7', name: 'Streak Master', description: 'Reach a 7-day streak', icon: '🔥', requirement: 7, rewardCoins: 500, rewardXP: 200, statKey: '_streak' },
];

export function getSkinById(id: string): Skin | undefined {
  return SKINS.find(s => s.id === id);
}

export function getEmoteById(id: string): Emote | undefined {
  return EMOTES.find(e => e.id === id);
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common': return 'text-gray-400';
    case 'rare': return 'text-blue-400';
    case 'epic': return 'text-purple-400';
    case 'legendary': return 'text-yellow-400';
    default: return 'text-gray-400';
  }
}

export function getRarityBg(rarity: string): string {
  switch (rarity) {
    case 'common': return 'bg-gray-100 dark:bg-gray-700';
    case 'rare': return 'bg-blue-50 dark:bg-blue-900/30';
    case 'epic': return 'bg-purple-50 dark:bg-purple-900/30';
    case 'legendary': return 'bg-yellow-50 dark:bg-yellow-900/30';
    default: return 'bg-gray-100 dark:bg-gray-700';
  }
}

export function getRarityBorder(rarity: string): string {
  switch (rarity) {
    case 'common': return 'border-gray-300 dark:border-gray-600';
    case 'rare': return 'border-blue-400';
    case 'epic': return 'border-purple-400';
    case 'legendary': return 'border-yellow-400';
    default: return 'border-gray-300 dark:border-gray-600';
  }
}
