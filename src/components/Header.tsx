import React from 'react';
import { GameMode, GameTheme } from '../types';
import { Sparkles, Volume2, VolumeX, Car, User, Sun, Moon, Image as ImageIcon } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  mode: GameMode;
  theme: GameTheme;
  score: number;
  highScore: number;
  stars: number;
  unlockedStickersCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onToggleMode: () => void;
  onToggleTheme: () => void;
  onOpenStickers: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  theme,
  score,
  highScore,
  stars,
  unlockedStickersCount,
  soundEnabled,
  onToggleSound,
  onToggleMode,
  onToggleTheme,
  onOpenStickers,
}) => {
  return (
    <header className="w-full bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40">
      {/* Brand & Character Avatar */}
      <div className="flex items-center gap-3">
        <div className="relative group cursor-pointer" onClick={onOpenStickers} title="Raiven Profile">
          <img
            src="/assets/pfp.png.jpg"
            alt="Raiven Profile"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover ring-2 ring-rose-500/80 shadow-lg shadow-rose-500/20"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-neutral-900" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider font-display bg-gradient-to-r from-rose-400 via-amber-300 to-rose-500 bg-clip-text text-transparent">
              RAIVEN
            </h1>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {mode === 'car' ? 'Car Velocity' : 'Runner'}
            </span>
          </div>
          <p className="text-xs text-neutral-400 hidden sm:block">
            Endless Cyber Velocity & Sticker Odyssey
          </p>
        </div>
      </div>

      {/* Center Scores */}
      <div className="flex items-center gap-4 sm:gap-6 order-3 lg:order-2 w-full lg:w-auto justify-around sm:justify-center bg-neutral-950/60 py-1.5 px-4 rounded-xl border border-neutral-800/80">
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-medium">Score</span>
          <span className="text-lg sm:text-xl font-bold font-display text-white tabular-nums tracking-wide">
            {score.toLocaleString()}
          </span>
        </div>

        <div className="w-[1px] h-6 bg-neutral-800" />

        <div className="text-center">
          <span className="text-[10px] uppercase tracking-wider text-amber-400/90 block font-medium flex items-center justify-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" /> High Score
          </span>
          <span className="text-lg sm:text-xl font-bold font-display text-amber-400 tabular-nums tracking-wide">
            {highScore.toLocaleString()}
          </span>
        </div>

        <div className="w-[1px] h-6 bg-neutral-800" />

        <div className="text-center">
          <span className="text-[10px] uppercase tracking-wider text-yellow-400 block font-medium">Stars</span>
          <span className="text-lg sm:text-xl font-bold font-display text-yellow-300 tabular-nums">
            ★ {stars}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2 order-2 lg:order-3">
        {/* Mode Toggle Button */}
        <button
          id="btn-toggle-mode"
          onClick={() => {
            sounds.playSwitchMode();
            onToggleMode();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
            mode === 'car'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
          }`}
          title="Switch vehicle mode (or press C)"
        >
          {mode === 'car' ? <Car className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{mode === 'car' ? 'Car Mode' : 'Runner Mode'}</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          id="btn-toggle-theme"
          onClick={onToggleTheme}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
            theme === 'heatwave'
              ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 hover:bg-orange-500/30'
              : 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30'
          }`}
          title="Switch Theme"
        >
          {theme === 'heatwave' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span className="capitalize hidden md:inline">{theme}</span>
        </button>

        {/* Stickers Modal Button */}
        <button
          id="btn-open-stickers"
          onClick={onOpenStickers}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-all relative"
          title="Open Stickers Gallery"
        >
          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Stickers</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {unlockedStickersCount}/8
          </span>
        </button>

        {/* Sound Mute Toggle */}
        <button
          id="btn-toggle-sound"
          onClick={onToggleSound}
          className="p-2 rounded-xl text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-all"
          title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
        </button>
      </div>
    </header>
  );
};
