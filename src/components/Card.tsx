import React from 'react';
import { Card as CardType } from '../game/types';

interface CardProps {
  card: CardType;
  onClick: (id: number) => void;
  disabled: boolean;
  gridSize: number;
}

export const CardComponent: React.FC<CardProps> = ({ card, onClick, disabled, gridSize }) => {
  const isRevealed = card.state === 'revealed' || card.state === 'matched';
  const isMatched = card.state === 'matched';
  
  const handleClick = () => {
    if (disabled || card.state === 'matched' || card.state === 'revealed') return;
    onClick(card.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const getAriaLabel = () => {
    if (isMatched) return `Matched card: ${card.symbol}`;
    if (isRevealed) return `Revealed card: ${card.symbol}`;
    return 'Hidden card';
  };

  // Dynamic font size based on grid
  const fontSize = gridSize <= 4 ? 'text-3xl sm:text-4xl' : gridSize <= 6 ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-2xl';
  const backFontSize = gridSize <= 4 ? 'text-2xl sm:text-3xl' : gridSize <= 6 ? 'text-xl sm:text-2xl' : 'text-base sm:text-xl';

  return (
    <button
      className={`
        card-container aspect-square w-full cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        ${disabled && !isRevealed ? 'cursor-not-allowed' : ''}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={getAriaLabel()}
      tabIndex={0}
      disabled={disabled && card.state !== 'matched'}
    >
      <div
        className={`
          card-inner relative w-full h-full transition-transform duration-500
          ${isRevealed ? 'card-flipped' : ''}
        `}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back */}
        <div
          className={`
            card-face card-back absolute inset-0 rounded-xl flex items-center justify-center
            bg-gradient-to-br from-indigo-500 to-purple-600
            dark:from-indigo-600 dark:to-purple-800
            shadow-lg border-2 border-indigo-400/30
            hover:from-indigo-400 hover:to-purple-500
            dark:hover:from-indigo-500 dark:hover:to-purple-700
            transition-all duration-200
            ${isRevealed ? 'pointer-events-none' : ''}
            ${isMatched ? 'opacity-0' : ''}
          `}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className={`${backFontSize} text-white/80 select-none`}>✦</span>
        </div>
        
        {/* Card Front */}
        <div
          className={`
            card-face card-front absolute inset-0 rounded-xl flex items-center justify-center
            bg-white dark:bg-gray-800
            shadow-lg border-2
            transition-all duration-300
            ${isMatched 
              ? 'border-green-400 dark:border-green-500 shadow-green-200 dark:shadow-green-900/30 matched-glow' 
              : 'border-gray-200 dark:border-gray-600'
            }
          `}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className={`${fontSize} select-none`}>{card.symbol}</span>
        </div>
      </div>
    </button>
  );
};
