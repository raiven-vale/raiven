import React, { useState } from 'react';
import { StickerItem } from '../types';
import { X, Lock, CheckCircle2, Award, Sparkles, ExternalLink } from 'lucide-react';

interface StickerGalleryModalProps {
  stickers: StickerItem[];
  isOpen: boolean;
  onClose: () => void;
  equippedStickerId?: number;
  onEquipSticker: (id: number) => void;
}

export const StickerGalleryModal: React.FC<StickerGalleryModalProps> = ({
  stickers,
  isOpen,
  onClose,
  equippedStickerId,
  onEquipSticker,
}) => {
  const [selectedSticker, setSelectedSticker] = useState<StickerItem | null>(null);

  if (!isOpen) return null;

  const unlockedCount = stickers.filter((s) => s.isUnlocked).length;
  const progressPercent = Math.round((unlockedCount / stickers.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                Sticker Odyssey Album
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {unlockedCount} / {stickers.length} Unlocked
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Unlock official art stickers by reaching high scores and dodging cyber hazards
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-800 h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-rose-500 to-amber-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Body / Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {stickers.map((sticker) => {
            const isEquipped = equippedStickerId === sticker.id;

            return (
              <div
                key={sticker.id}
                onClick={() => setSelectedSticker(sticker)}
                className={`group relative rounded-xl border p-3 flex flex-col items-center cursor-pointer transition-all duration-200 ${
                  sticker.isUnlocked
                    ? 'bg-neutral-800/60 hover:bg-neutral-800 border-neutral-700/80 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10'
                    : 'bg-neutral-950/40 border-neutral-800/40 opacity-60'
                }`}
              >
                {/* Sticker Image / Placeholder */}
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800/60 mb-2.5 flex items-center justify-center">
                  {sticker.isUnlocked ? (
                    <img
                      src={sticker.src}
                      alt={sticker.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-600 gap-1.5 p-2 text-center">
                      <Lock className="w-6 h-6 text-neutral-500 mb-1" />
                      <span className="text-[11px] font-medium leading-tight text-neutral-400">
                        {sticker.unlockCondition}
                      </span>
                    </div>
                  )}

                  {/* Equipped Badge */}
                  {isEquipped && (
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-500 text-black shadow-md flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> EQUIPPED
                    </div>
                  )}

                  {/* Unlocked checkmark */}
                  {sticker.isUnlocked && !isEquipped && (
                    <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-emerald-500/80 text-white shadow-sm">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Sticker Info */}
                <h3 className="text-xs sm:text-sm font-bold text-center text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  #{sticker.id} {sticker.title}
                </h3>
                <p className="text-[11px] text-neutral-400 text-center line-clamp-1 mt-0.5">
                  {sticker.isUnlocked ? 'Unlocked' : sticker.unlockCondition}
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Sticker Detail Drawer */}
        {selectedSticker && (
          <div className="border-t border-neutral-800 bg-neutral-950 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
            <img
              src={selectedSticker.isUnlocked ? selectedSticker.src : '/assets/pfp.png.jpg'}
              alt={selectedSticker.title}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-neutral-700 shadow-md ${
                !selectedSticker.isUnlocked && 'grayscale opacity-50'
              }`}
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-base sm:text-lg font-bold font-display text-white">
                  Sticker #{selectedSticker.id}: {selectedSticker.title}
                </h3>
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                    selectedSticker.isUnlocked
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                  }`}
                >
                  {selectedSticker.isUnlocked ? 'Unlocked & Ready' : 'Locked'}
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-1">{selectedSticker.description}</p>
              <p className="text-xs text-cyan-400 font-medium mt-1">
                Requirement: {selectedSticker.unlockCondition}
              </p>
            </div>

            {selectedSticker.isUnlocked && (
              <button
                onClick={() => onEquipSticker(selectedSticker.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                  equippedStickerId === selectedSticker.id
                    ? 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold'
                }`}
              >
                {equippedStickerId === selectedSticker.id ? 'Equipped' : 'Equip on HUD'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
