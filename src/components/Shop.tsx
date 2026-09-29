import React from 'react';
import { PlayerData } from '../game/types';
import { SKINS, getRarityColor, getRarityBg, getRarityBorder } from '../game/content';
import { formatScore } from '../game/logic';

interface ShopProps {
  data: PlayerData;
  onClose: () => void;
  onBuySkin: (skinId: string) => boolean;
  onEquipSkin: (skinId: string) => void;
  onBuyBooster: (multiplier: number, durationMinutes: number, cost: number) => boolean;
}

export const Shop: React.FC<ShopProps> = ({ data, onClose, onBuySkin, onEquipSkin, onBuyBooster }) => {
  const [selectedSkin, setSelectedSkin] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleBuy = (skinId: string) => {
    const success = onBuySkin(skinId);
    if (!success) {
      setMessage('Not enough coins!');
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const handleBuyBooster = (mult: number, duration: number, cost: number) => {
    const success = onBuyBooster(mult, duration, cost);
    if (!success) {
      setMessage('Not enough coins!');
      setTimeout(() => setMessage(null), 2000);
    } else {
      setMessage(`⚡ ${mult}× XP Booster activated!`);
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const boosterActive = data.booster && data.booster.expiresAt > Date.now();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl animate-scale-in my-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">🛍️ SKIN SHOP</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-xl">✕</button>
        </div>

        <div className="flex items-center justify-between mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Your Coins</span>
          <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">🪙 {formatScore(data.coins)}</span>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
            <span className="text-sm font-medium text-red-600 dark:text-red-400">{message}</span>
          </div>
        )}

        {/* XP Boosters */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-3">⚡ XP Boosters</h3>
          {boosterActive ? (
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-center">
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                ⚡ {data.booster!.multiplier}× XP ACTIVE
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleBuyBooster(2, 30, 500)}
                className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl hover:scale-105 transition-transform"
              >
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-sm font-bold text-gray-800 dark:text-gray-100">2× XP</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">30 min</div>
                <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400 mt-1">🪙 500</div>
              </button>
              <button
                onClick={() => handleBuyBooster(3, 15, 750)}
                className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700 rounded-xl hover:scale-105 transition-transform"
              >
                <div className="text-2xl mb-1">⚡⚡</div>
                <div className="text-sm font-bold text-gray-800 dark:text-gray-100">3× XP</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">15 min</div>
                <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400 mt-1">🪙 750</div>
              </button>
            </div>
          )}
        </div>

        {/* Skins */}
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-3">🎨 Card Skins</h3>
        <div className="grid grid-cols-2 gap-3">
          {SKINS.map(skin => {
            const owned = data.skinsOwned.includes(skin.id);
            const equipped = data.equippedSkin === skin.id;
            const isSelected = selectedSkin === skin.id;
            
            return (
              <div
                key={skin.id}
                className={`p-3 rounded-xl border-2 transition-all cursor-pointer hover:scale-105 ${getRarityBorder(skin.rarity)} ${isSelected ? 'ring-2 ring-indigo-400' : ''} ${getRarityBg(skin.rarity)}`}
                onClick={() => setSelectedSkin(isSelected ? null : skin.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">{skin.icon}</span>
                  <span className={`text-[10px] font-bold uppercase ${getRarityColor(skin.rarity)}`}>{skin.rarity}</span>
                </div>
                <div className="text-sm font-bold text-gray-800 dark:text-gray-100">{skin.name}</div>
                
                {isSelected && (
                  <div className="mt-2">
                    <div className="w-full h-8 rounded-lg mb-2" style={{ background: skin.cardBack }} />
                    {equipped ? (
                      <div className="text-xs font-bold text-green-600 dark:text-green-400 text-center">✓ EQUIPPED</div>
                    ) : owned ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); onEquipSkin(skin.id); }}
                        className="w-full py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        EQUIP
                      </button>
                    ) : skin.price === 0 ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBuy(skin.id); }}
                        className="w-full py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        BUY (FREE)
                      </button>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBuy(skin.id); }}
                        className="w-full py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        BUY 🪙 {formatScore(skin.price)}
                      </button>
                    )}
                  </div>
                )}
                
                {!isSelected && !equipped && owned && (
                  <div className="text-[10px] text-green-600 dark:text-green-400 mt-1">Owned</div>
                )}
                {!isSelected && equipped && (
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1 font-bold">Equipped ✓</div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all duration-200"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};
