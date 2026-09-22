import React from 'react';
import { RotateCcw, Trophy, Star, Sparkles, Award } from 'lucide-react';
import { GameMode, StickerItem } from '../types';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewHigh: boolean;
  starsCollected: number;
  mode: GameMode;
  newlyUnlockedSticker: StickerItem | null;
  onRestart: () => void;
  onOpenStickers: () => void;
  onSwitchMode: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewHigh,
  starsCollected,
  mode,
  newlyUnlockedSticker,
  onRestart,
  onOpenStickers,
  onSwitchMode,
}) => {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-neutral-900/95 border border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-2xl text-center flex flex-col items-center">
        {/* Dead sprite badge */}
        <div className="relative mb-3 flex items-center justify-center">
          <div className="w-24 h-16 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-center p-2 overflow-hidden shadow-inner">
            <img
              src="/assets/character/dead.png.jpg"
              alt="Raiven Defeated"
              className="max-h-full object-contain filter drop-shadow"
            />
          </div>
          {isNewHigh && (
            <div className="absolute -top-3 -right-3 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-extrabold flex items-center gap-1 shadow-lg ring-2 ring-neutral-900 animate-bounce">
              <Trophy className="w-3 h-3" /> NEW RECORD!
            </div>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-wider text-rose-500 mb-1">
          SYSTEM OVERHEAT
        </h2>
        <p className="text-xs text-neutral-400 mb-5">
          Obstacle collision detected. Re-calibrating neural velocity drive.
        </p>

        {/* Newly Unlocked Sticker Banner */}
        {newlyUnlockedSticker && (
          <div
            onClick={onOpenStickers}
            className="w-full mb-4 p-3 rounded-xl bg-gradient-to-r from-cyan-950/60 to-purple-950/60 border border-cyan-500/40 cursor-pointer hover:border-cyan-400 transition-all flex items-center gap-3 text-left"
          >
            <img
              src={newlyUnlockedSticker.src}
              alt={newlyUnlockedSticker.title}
              className="w-12 h-12 rounded-lg object-cover ring-2 ring-cyan-400 shadow-md"
            />
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-300" /> New Sticker Unlocked!
              </span>
              <p className="text-sm font-bold text-white line-clamp-1">
                #{newlyUnlockedSticker.id} {newlyUnlockedSticker.title}
              </p>
            </div>
            <Award className="w-5 h-5 text-cyan-400" />
          </div>
        )}

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6">
          <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-800">
            <span className="text-[10px] uppercase font-semibold text-neutral-400 block mb-1">Final Score</span>
            <span className="text-2xl font-bold font-display text-white tabular-nums tracking-wide">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-800">
            <span className="text-[10px] uppercase font-semibold text-amber-400/80 block mb-1 flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> High Score
            </span>
            <span className="text-2xl font-bold font-display text-amber-400 tabular-nums tracking-wide">
              {highScore.toLocaleString()}
            </span>
          </div>

          <div className="bg-neutral-950/80 p-2.5 rounded-xl border border-neutral-800 col-span-2 flex items-center justify-around">
            <div className="flex items-center gap-1.5 text-xs text-yellow-400 font-medium">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>+{starsCollected} Stars Collected</span>
            </div>
            <div className="w-[1px] h-4 bg-neutral-800" />
            <div className="text-xs text-neutral-400">
              Mode: <span className="text-white font-semibold capitalize">{mode}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            id="btn-restart-game"
            onClick={onRestart}
            className="w-full py-3.5 px-6 rounded-xl font-display font-bold text-base tracking-wide bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-neutral-950 shadow-lg shadow-rose-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> REBOOT & RUN AGAIN
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchMode}
              className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
            >
              Switch to {mode === 'car' ? '🏃 Runner' : '🏎️ Car'}
            </button>

            <button
              onClick={onOpenStickers}
              className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-cyan-300 border border-neutral-700 transition-colors"
            >
              View Stickers Album
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
