import React from 'react';
import { Card as CardType } from '../game/types';
import { getSkinById } from '../game/content';

interface CardProps {
  card: CardType;
  onClick: (id: number) => void;
  disabled: boolean;
  gridSize: number;
  isMismatched: boolean;
  skinId: string;
}

export const CardComponent: React.FC<CardProps> = ({ card, onClick, disabled, gridSize, isMismatched, skinId }) => {
  const isRevealed = card.state === 'revealed' || card.state === 'matched';
  const isMatched = card.state === 'matched';
  const skin = getSkinById(skinId);
  
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

  const fontSize = gridSize <= 4 ? 'text-3xl sm:text-4xl' : gridSize <= 6 ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-2xl';
  const backFontSize = gridSize <= 4 ? 'text-2xl sm:text-3xl' : gridSize <= 6 ? 'text-xl sm:text-2xl' : 'text-base sm:text-xl';

  return (
    <button
      className={`
        card-container aspect-square w-full cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        ${disabled && !isRevealed ? 'cursor-not-allowed' : ''}
        ${isMismatched ? 'card-shake' : ''}
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
            card-face card-back card-back-pattern absolute inset-0 rounded-lg sm:rounded-xl flex items-center justify-center
            shadow-lg border-2 transition-all duration-200
            ${isRevealed ? 'pointer-events-none' : ''}
            ${isMatched ? 'opacity-0' : ''}
          `}
          style={{ 
            backfaceVisibility: 'hidden',
            background: skin?.cardBack || 'linear-gradient(135deg, #6366f1, #9333ea)',
            borderColor: `${skin?.accent || '#6366f1'}40`,
          }}
        >
          <span className={`${backFontSize} text-white/80 select-none font-bold drop-shadow-sm`}>✦</span>
        </div>
        
        {/* Card Front */}
        <div
          className={`
            card-face card-front absolute inset-0 rounded-lg sm:rounded-xl flex items-center justify-center
            shadow-lg border-2 transition-all duration-300
            ${isMatched 
              ? 'matched-glow' 
              : ''
            }
          `}
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)',
            backgroundColor: skin?.cardFront || '#ffffff',
            borderColor: isMatched ? '#4ade80' : (skin?.accent || '#e5e7eb') + '40',
            boxShadow: isMatched ? `0 0 15px ${skin?.glow || 'rgba(74, 222, 128, 0.3)'}` : undefined,
          }}
        >
          <span className={`${fontSize} select-none`} role="img">{card.symbol}</span>
        </div>
      </div>
    </button>
  );
};
