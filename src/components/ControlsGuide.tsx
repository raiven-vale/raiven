import React from 'react';
import { GameMode, GameTheme, StickerItem } from '../types';
import { Keyboard, Smartphone, Zap, Sparkles } from 'lucide-react';

interface ControlsGuideProps {
  mode: GameMode;
  theme: GameTheme;
  equippedSticker?: StickerItem | null;
  onOpenStickers: () => void;
}

export const ControlsGuide: React.FC<ControlsGuideProps> = ({
  mode,
  theme,
  equippedSticker,
  onOpenStickers,
}) => {
  return (
    <div className="w-full mt-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Controls Info */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-neutral-300">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-neutral-800 text-rose-400 border border-neutral-700">
            <Keyboard className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white">SPACE / ↑ / W</span>
            <span className="text-neutral-400 ml-1.5">to Jump</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-neutral-800 text-cyan-400 border border-neutral-700">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white">Tap Canvas</span>
            <span className="text-neutral-400 ml-1.5">on Mobile</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-neutral-800 text-amber-400 border border-neutral-700">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white">Key [C]</span>
            <span className="text-neutral-400 ml-1.5">Toggle Car / Runner</span>
          </div>
        </div>

        {mode === 'car' && (
          <div className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-300 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3" /> Double Jump Available in Car Mode!
          </div>
        )}
      </div>

      {/* Equipped Sticker Badge or Gallery Link */}
      <div className="flex items-center gap-3">
        {equippedSticker ? (
          <div
            onClick={onOpenStickers}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-neutral-950/80 border border-amber-500/30 cursor-pointer hover:border-amber-400 transition-all"
            title="Equipped Sticker"
          >
            <img
              src={equippedSticker.src}
              alt={equippedSticker.title}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-amber-400"
            />
            <div className="text-left">
              <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold block">
                Pinned Art
              </span>
              <span className="text-xs font-semibold text-white line-clamp-1">
                #{equippedSticker.id} {equippedSticker.title}
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenStickers}
            className="text-xs text-neutral-400 hover:text-white transition-colors underline underline-offset-4"
          >
            View Sticker Album (8 collectible arts)
          </button>
        )}
      </div>
    </div>
  );
};
