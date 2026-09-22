import React, { useState, useEffect, useCallback, useTransition } from 'react';
import confetti from 'canvas-confetti';
import { GameMode, GameTheme, GameStatus, StickerItem } from './types';
import { Header } from './components/Header';
import { GameCanvas } from './components/GameCanvas';
import { GameOverModal } from './components/GameOverModal';
import { StickerGalleryModal } from './components/StickerGalleryModal';
import { ControlsGuide } from './components/ControlsGuide';
import { loadSavedStickers, saveUnlockedSticker } from './data/stickers';
import { sounds } from './utils/audio';
import { Play, Sparkles } from 'lucide-react';

const HIGH_SCORE_KEY = 'raiven_runner_high_score_v1';
const EQUIPPED_STICKER_KEY = 'raiven_equipped_sticker_v1';

export default function App() {
  const [mode, setMode] = useState<GameMode>('runner');
  const [theme, setTheme] = useState<GameTheme>('midnight');
  const [status, setStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [isNewHigh, setIsNewHigh] = useState<boolean>(false);

  const [stickers, setStickers] = useState<StickerItem[]>([]);
  const [equippedStickerId, setEquippedStickerId] = useState<number>(1);
  const [isStickerModalOpen, setIsStickerModalOpen] = useState<boolean>(false);
  const [newlyUnlockedSticker, setNewlyUnlockedSticker] = useState<StickerItem | null>(null);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Initialize saved state from localStorage
  useEffect(() => {
    try {
      const savedHigh = localStorage.getItem(HIGH_SCORE_KEY);
      if (savedHigh) setHighScore(parseInt(savedHigh, 10) || 0);

      const savedEquipped = localStorage.getItem(EQUIPPED_STICKER_KEY);
      if (savedEquipped) setEquippedStickerId(parseInt(savedEquipped, 10) || 1);

      setStickers(loadSavedStickers());
      setSoundEnabled(sounds.enabled);
    } catch {
      setStickers(loadSavedStickers());
    }
  }, []);

  // Check sticker unlocks dynamically as score rises
  const checkStickerUnlocks = useCallback((currentScore: number) => {
    setStickers((prevStickers) => {
      let updated = [...prevStickers];
      let newUnlock: StickerItem | null = null;

      for (const sticker of updated) {
        if (!sticker.isUnlocked && currentScore >= sticker.requiredScore) {
          updated = saveUnlockedSticker(sticker.id);
          newUnlock = sticker;
          sounds.playUnlock();
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
          break;
        }
      }

      if (newUnlock) {
        setNewlyUnlockedSticker(newUnlock);
      }

      return updated;
    });
  }, []);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore);
    checkStickerUnlocks(newScore);
  }, [checkStickerUnlocks]);

  const handleStarsUpdate = useCallback((count: number) => {
    setStars(count);
  }, []);

  const handleStartGame = () => {
    sounds.playJump(mode === 'car');
    setStatus('playing');
    setIsNewHigh(false);
    setNewlyUnlockedSticker(null);
  };

  const handleGameOver = (finalScore: number, finalStars: number) => {
    setStatus('gameover');

    if (finalScore > highScore) {
      setHighScore(finalScore);
      setIsNewHigh(true);
      try {
        localStorage.setItem(HIGH_SCORE_KEY, finalScore.toString());
      } catch {}

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
      });
    }

    // Check unlocks on game over as well
    checkStickerUnlocks(finalScore);
  };

  const handleRestart = () => {
    sounds.playJump(mode === 'car');
    setStatus('playing');
    setScore(0);
    setStars(0);
    setIsNewHigh(false);
    setNewlyUnlockedSticker(null);
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'runner' ? 'car' : 'runner'));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'heatwave' ? 'midnight' : 'heatwave'));
  };

  const toggleSound = () => {
    const newState = sounds.toggle();
    setSoundEnabled(newState);
  };

  const handleEquipSticker = (id: number) => {
    setEquippedStickerId(id);
    try {
      localStorage.setItem(EQUIPPED_STICKER_KEY, id.toString());
    } catch {}
  };

  const unlockedCount = stickers.filter((s) => s.isUnlocked).length;
  const equippedSticker = stickers.find((s) => s.id === equippedStickerId);

  // Global key to start game if in idle
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (status === 'idle' && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        handleStartGame();
      } else if (status === 'gameover' && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        handleRestart();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status, mode]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <Header
        mode={mode}
        theme={theme}
        score={score}
        highScore={highScore}
        stars={stars}
        unlockedStickersCount={unlockedCount}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onToggleMode={toggleMode}
        onToggleTheme={toggleTheme}
        onOpenStickers={() => setIsStickerModalOpen(true)}
      />

      {/* Main Game Stage */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-center">
        <div className="relative">
          <GameCanvas
            mode={mode}
            theme={theme}
            status={status}
            onGameOver={handleGameOver}
            onScoreUpdate={handleScoreUpdate}
            onStarsUpdate={handleStarsUpdate}
            onModeSwitch={toggleMode}
          />

          {/* Idle / Start Overlay */}
          {status === 'idle' && (
            <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs rounded-2xl">
              <div className="max-w-md w-full p-6 sm:p-8 bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-2xl text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4 ring-2 ring-rose-500 shadow-xl shadow-rose-500/20">
                  <img
                    src="/assets/pfp.png.jpg"
                    alt="Raiven"
                    className="w-full h-full object-cover"
                  />
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-wider text-white mb-2">
                  READY TO RUN
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 mb-6">
                  Leap over obstacles, collect golden stars, switch into high-speed car mode, and unlock all 8 official sticker arts.
                </p>

                <button
                  id="btn-start-game"
                  onClick={handleStartGame}
                  className="w-full py-3.5 px-6 rounded-xl font-display font-bold text-base tracking-wider bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 hover:from-rose-400 hover:to-amber-400 text-neutral-950 shadow-xl shadow-rose-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 group"
                >
                  <Play className="w-5 h-5 fill-neutral-950 group-hover:scale-110 transition-transform" /> START RUN (SPACE)
                </button>

                <div className="flex items-center gap-3 mt-4 text-xs text-neutral-400">
                  <span>Current Theme: <strong className="text-white capitalize">{theme}</strong></span>
                  <span>•</span>
                  <span>Vehicle: <strong className="text-white capitalize">{mode}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Game Over Modal */}
          {status === 'gameover' && (
            <GameOverModal
              score={score}
              highScore={highScore}
              isNewHigh={isNewHigh}
              starsCollected={stars}
              mode={mode}
              newlyUnlockedSticker={newlyUnlockedSticker}
              onRestart={handleRestart}
              onOpenStickers={() => setIsStickerModalOpen(true)}
              onSwitchMode={toggleMode}
            />
          )}
        </div>

        {/* Controls and Equipped Sticker Guide */}
        <ControlsGuide
          mode={mode}
          theme={theme}
          equippedSticker={equippedSticker}
          onOpenStickers={() => setIsStickerModalOpen(true)}
        />
      </main>

      {/* Footer Info */}
      <footer className="w-full border-t border-neutral-900 bg-neutral-950/80 px-4 py-3 text-center text-xs text-neutral-500 flex flex-wrap items-center justify-between gap-2 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span>Raiven Runner</span>
          <span>•</span>
          <span className="text-neutral-400">Animated Sprite & Vehicle Engine</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsStickerModalOpen(true)}
            className="hover:text-cyan-400 transition-colors"
          >
            Album ({unlockedCount}/8)
          </button>
          <span>•</span>
          <span>Theme: {theme}</span>
        </div>
      </footer>

      {/* Sticker Gallery Modal */}
      <StickerGalleryModal
        stickers={stickers}
        isOpen={isStickerModalOpen}
        onClose={() => setIsStickerModalOpen(false)}
        equippedStickerId={equippedStickerId}
        onEquipSticker={handleEquipSticker}
      />
    </div>
  );
}
