import React from 'react';
import { Card as CardType, Difficulty, DIFFICULTY_CONFIGS } from '../game/types';
import { CardComponent } from './Card';

interface GameBoardProps {
  cards: CardType[];
  difficulty: Difficulty;
  locked: boolean;
  onCardClick: (id: number) => void;
  paused: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({ cards, difficulty, locked, onCardClick, paused }) => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const isDisabled = locked || paused;
  
  const gridClass = 
    config.cols === 4 ? 'grid-cols-4' :
    config.cols === 6 ? 'grid-cols-6' :
    'grid-cols-8';

  const gapClass = 
    config.cols <= 4 ? 'gap-2 sm:gap-3' :
    config.cols <= 6 ? 'gap-1.5 sm:gap-2' :
    'gap-1 sm:gap-1.5';

  return (
    <div 
      className={`grid ${gridClass} ${gapClass} w-full max-w-4xl mx-auto`}
      role="grid"
      aria-label="Game board"
    >
      {cards.map((card) => (
        <CardComponent
          key={card.id}
          card={card}
          onClick={onCardClick}
          disabled={isDisabled}
          gridSize={config.cols}
        />
      ))}
    </div>
  );
};
