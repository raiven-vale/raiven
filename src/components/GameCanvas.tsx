import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameMode, GameTheme, GameStatus, Obstacle, CollectibleStar, Particle } from '../types';
import { LoadedAssets, preloadGameAssets } from '../utils/spriteLoader';
import { sounds } from '../utils/audio';

interface GameCanvasProps {
  mode: GameMode;
  theme: GameTheme;
  status: GameStatus;
  onGameOver: (score: number, starsCollected: number) => void;
  onScoreUpdate: (score: number) => void;
  onStarsUpdate: (stars: number) => void;
  onModeSwitch: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  mode,
  theme,
  status,
  onGameOver,
  onScoreUpdate,
  onStarsUpdate,
  onModeSwitch,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [assets, setAssets] = useState<LoadedAssets | null>(null);
  const [loading, setLoading] = useState(true);

  // Mutable Game State inside refs for 60fps loop
  const gameStateRef = useRef({
    // Physics & coordinates
    groundY: 0,
    playerX: 80,
    playerY: 0,
    playerVy: 0,
    isGrounded: true,
    jumpsAvailable: 1,
    coyoteTimer: 0,
    jumpBuffered: false,

    // Dimensions
    playerWidth: 50,
    playerHeight: 70,

    // Animation frames
    frameTimer: 0,
    runFrameIndex: 0,
    carFrameIndex: 0,

    // Scroll & parallax
    bgScrollX: 0,
    roadScrollX: 0,
    speed: 5.5,

    // Game stats
    score: 0,
    starsCollected: 0,
    totalDistance: 0,

    // Objects
    obstacles: [] as Obstacle[],
    stars: [] as CollectibleStar[],
    particles: [] as Particle[],

    // FX
    screenShake: 0,

    // Spawn timers
    obstacleSpawnTimer: 0,
    starSpawnTimer: 0,
  });

  // Preload assets
  useEffect(() => {
    let mounted = true;
    preloadGameAssets()
      .then((loaded) => {
        if (mounted) {
          setAssets(loaded);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load game assets:', err);
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Jump Action
  const triggerJump = useCallback(() => {
    const s = gameStateRef.current;
    if (status !== 'playing') return;

    const maxJumps = mode === 'car' ? 2 : 1; // Car has double turbo-jump!
    if (s.isGrounded || s.coyoteTimer > 0 || s.jumpsAvailable > 0) {
      const isDouble = !s.isGrounded && s.jumpsAvailable < maxJumps;
      s.playerVy = mode === 'car' ? (isDouble ? -12 : -11.5) : -13;
      s.isGrounded = false;
      s.coyoteTimer = 0;
      s.jumpsAvailable--;

      sounds.playJump(mode === 'car');

      // Jump particles
      for (let i = 0; i < (isDouble ? 12 : 8); i++) {
        s.particles.push({
          x: s.playerX + s.playerWidth / 2,
          y: s.playerY + s.playerHeight,
          vx: (Math.random() - 0.5) * 4 - s.speed * 0.4,
          vy: Math.random() * 2 + 1,
          size: Math.random() * 3 + 2,
          alpha: 1,
          color: isDouble ? '#38bdf8' : (theme === 'heatwave' ? '#fb923c' : '#c084fc'),
          life: 0,
          maxLife: 20,
        });
      }
    } else {
      s.jumpBuffered = true;
      setTimeout(() => {
        s.jumpBuffered = false;
      }, 120);
    }
  }, [mode, status, theme]);

  // Handle User Input (Keyboard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        triggerJump();
      } else if (e.code === 'KeyC') {
        e.preventDefault();
        sounds.playSwitchMode();
        onModeSwitch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerJump, onModeSwitch]);

  // Main Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !assets) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const resize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Logical dimensions
      const logicalHeight = rect.height;
      const groundOffset = Math.min(90, logicalHeight * 0.22);
      gameStateRef.current.groundY = logicalHeight - groundOffset;

      if (status === 'idle') {
        gameStateRef.current.playerY = gameStateRef.current.groundY - gameStateRef.current.playerHeight;
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Reset game state on new game start
    if (status === 'playing') {
      const s = gameStateRef.current;
      s.playerX = 80;
      s.playerVy = 0;
      s.isGrounded = true;
      s.jumpsAvailable = mode === 'car' ? 2 : 1;
      s.score = 0;
      s.starsCollected = 0;
      s.totalDistance = 0;
      s.speed = 5.2;
      s.obstacles = [];
      s.stars = [];
      s.particles = [];
      s.screenShake = 0;
      s.obstacleSpawnTimer = 40;
      s.starSpawnTimer = 90;
    }

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 16.666, 2.5); // normalized frame delta
      lastTime = time;

      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || 800;
      const height = rect?.height || 450;
      const s = gameStateRef.current;

      // Adjust player dimensions based on mode
      if (mode === 'car') {
        s.playerWidth = 92;
        s.playerHeight = 44;
      } else {
        s.playerWidth = 52;
        s.playerHeight = 74;
      }

      ctx.save();

      // Screen Shake
      if (s.screenShake > 0) {
        const sx = (Math.random() - 0.5) * s.screenShake;
        const sy = (Math.random() - 0.5) * s.screenShake;
        ctx.translate(sx, sy);
        s.screenShake *= 0.88;
        if (s.screenShake < 0.5) s.screenShake = 0;
      }

      // --- 1. RENDER BACKGROUND ---
      const bgImg = theme === 'heatwave' ? assets.themes.heatwave : assets.themes.midnight;
      if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
        // Draw parallax repeating background
        const bgAspect = bgImg.naturalWidth / bgImg.naturalHeight;
        const bgHeight = height;
        const bgWidth = bgHeight * bgAspect;

        if (status === 'playing') {
          s.bgScrollX = (s.bgScrollX + s.speed * 0.28 * dt) % bgWidth;
        }

        const startX = -s.bgScrollX;
        ctx.drawImage(bgImg, startX, 0, bgWidth, bgHeight);
        ctx.drawImage(bgImg, startX + bgWidth, 0, bgWidth, bgHeight);
        if (startX + bgWidth < width) {
          ctx.drawImage(bgImg, startX + bgWidth * 2, 0, bgWidth, bgHeight);
        }
      } else {
        // Fallback gradient if image not ready
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        if (theme === 'heatwave') {
          grad.addColorStop(0, '#f97316');
          grad.addColorStop(0.6, '#ea580c');
          grad.addColorStop(1, '#7c2d12');
        } else {
          grad.addColorStop(0, '#0f172a');
          grad.addColorStop(0.6, '#1e1b4b');
          grad.addColorStop(1, '#09090b');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Gradient overlay for visual depth & contrast
      const overlayGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (theme === 'heatwave') {
        overlayGrad.addColorStop(0, 'rgba(251, 146, 60, 0.08)');
        overlayGrad.addColorStop(0.7, 'rgba(124, 45, 18, 0.2)');
        overlayGrad.addColorStop(1, 'rgba(30, 15, 10, 0.7)');
      } else {
        overlayGrad.addColorStop(0, 'rgba(15, 23, 42, 0.1)');
        overlayGrad.addColorStop(0.7, 'rgba(88, 28, 135, 0.25)');
        overlayGrad.addColorStop(1, 'rgba(10, 10, 15, 0.75)');
      }
      ctx.fillStyle = overlayGrad;
      ctx.fillRect(0, 0, width, height);

      // --- 2. RENDER ROAD / GROUND ---
      const groundY = s.groundY;
      const roadHeight = height - groundY;

      // Dark asphalt ground
      ctx.fillStyle = theme === 'heatwave' ? '#1c1917' : '#09090b';
      ctx.fillRect(0, groundY, width, roadHeight);

      // Neon Top Border of Road
      ctx.strokeStyle = theme === 'heatwave' ? '#f97316' : '#a855f7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Road Grid / Speed Stripe Markings
      if (status === 'playing') {
        s.roadScrollX = (s.roadScrollX + s.speed * dt) % 60;
      }
      ctx.strokeStyle = theme === 'heatwave' ? 'rgba(253, 186, 116, 0.35)' : 'rgba(192, 132, 252, 0.3)';
      ctx.lineWidth = 2;
      ctx.setLineDash([24, 16]);
      ctx.lineDashOffset = -s.roadScrollX;
      ctx.beginPath();
      ctx.moveTo(0, groundY + roadHeight * 0.45);
      ctx.lineTo(width, groundY + roadHeight * 0.45);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // --- 3. PHYSICS & GAMEPLAY LOGIC ---
      if (status === 'playing') {
        // Speed Ramp
        s.speed = Math.min(12, 5.2 + Math.floor(s.score / 120) * 0.4);

        // Score update
        s.totalDistance += s.speed * dt * 0.1;
        const newScore = Math.floor(s.totalDistance) + s.starsCollected * 25;
        if (newScore !== s.score) {
          s.score = newScore;
          onScoreUpdate(s.score);
        }

        // Gravity & Jump Physics
        const gravity = mode === 'car' ? 0.62 : 0.68;
        s.playerVy += gravity * dt;
        s.playerY += s.playerVy * dt;

        const maxFloor = groundY - s.playerHeight;
        if (s.playerY >= maxFloor) {
          s.playerY = maxFloor;
          s.playerVy = 0;
          if (!s.isGrounded) {
            s.isGrounded = true;
            s.jumpsAvailable = mode === 'car' ? 2 : 1;
            // Land particle
            for (let i = 0; i < 4; i++) {
              s.particles.push({
                x: s.playerX + s.playerWidth * 0.5,
                y: groundY - 2,
                vx: (Math.random() - 0.5) * 4 - s.speed * 0.3,
                vy: -Math.random() * 2,
                size: Math.random() * 2 + 1,
                alpha: 0.8,
                color: theme === 'heatwave' ? '#fdba74' : '#d8b4fe',
                life: 0,
                maxLife: 15,
              });
            }
          }
          s.coyoteTimer = 6;
        } else {
          s.isGrounded = false;
          if (s.coyoteTimer > 0) s.coyoteTimer -= dt;
        }

        // Check buffered jump
        if (s.jumpBuffered && s.isGrounded) {
          s.jumpBuffered = false;
          triggerJump();
        }

        // Footstep / tire particles while grounded
        if (s.isGrounded && Math.random() < 0.45) {
          s.particles.push({
            x: s.playerX + (mode === 'car' ? 10 : 8),
            y: groundY - 2,
            vx: -s.speed * 0.5 - Math.random() * 2,
            vy: -Math.random() * 1.5,
            size: Math.random() * 3 + (mode === 'car' ? 2 : 1),
            alpha: 0.6,
            color: mode === 'car' ? (theme === 'heatwave' ? '#f97316' : '#818cf8') : 'rgba(255,255,255,0.4)',
            life: 0,
            maxLife: 18,
          });
        }

        // --- 4. SPAWN OBSTACLES ---
        s.obstacleSpawnTimer -= dt;
        if (s.obstacleSpawnTimer <= 0) {
          // Dynamic obstacle interval based on speed
          const minGap = Math.max(70, 140 - s.speed * 6);
          s.obstacleSpawnTimer = minGap + Math.random() * 60;

          // Pick obstacle type
          const randType = Math.random();
          let type: 'trash_il' | 'trash_pride' | 'barrier' = 'trash_il';
          let obsW = 46;
          let obsH = 46;

          if (randType < 0.4) {
            type = 'trash_il';
            obsW = 54;
            obsH = 38;
          } else if (randType < 0.75) {
            type = 'trash_pride';
            obsW = 48;
            obsH = 34;
          } else {
            type = 'barrier';
            obsW = 32;
            obsH = 50;
          }

          s.obstacles.push({
            x: width + 20,
            y: groundY - obsH,
            width: obsW,
            height: obsH,
            type,
            speed: s.speed,
          });
        }

        // --- 5. SPAWN COLLECTIBLE STARS ---
        s.starSpawnTimer -= dt;
        if (s.starSpawnTimer <= 0) {
          s.starSpawnTimer = 110 + Math.random() * 90;
          // Spawn a chain of 1-3 stars in an arc
          const count = Math.random() > 0.5 ? 3 : 1;
          const arcBaseY = groundY - (mode === 'car' ? 65 : 85);
          for (let i = 0; i < count; i++) {
            s.stars.push({
              x: width + 30 + i * 44,
              y: arcBaseY - Math.sin((i / (count + 1)) * Math.PI) * 45,
              radius: 12,
              collected: false,
              angle: 0,
              id: Date.now() + Math.random(),
            });
          }
        }
      }

      // Update & Render Obstacles
      for (let i = s.obstacles.length - 1; i >= 0; i--) {
        const obs = s.obstacles[i];
        if (status === 'playing') {
          obs.x -= s.speed * dt;
        }

        // Draw obstacle
        if (obs.type === 'trash_il' && assets.obstacles.il && assets.obstacles.il.complete) {
          ctx.drawImage(assets.obstacles.il, obs.x, obs.y, obs.width, obs.height);
        } else if (obs.type === 'trash_pride' && assets.obstacles.pride && assets.obstacles.pride.complete) {
          ctx.drawImage(assets.obstacles.pride, obs.x, obs.y, obs.width, obs.height);
        } else {
          // Neon warning barrier fallback
          ctx.save();
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(obs.x + 4, obs.y + 4, obs.width - 8, obs.height - 8);
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚠', obs.x + obs.width / 2, obs.y + obs.height / 2 + 4);
          ctx.restore();
        }

        // Collision Detection with Player Hitbox (tightened for fairness)
        if (status === 'playing') {
          const pBox = {
            x: s.playerX + 8,
            y: s.playerY + 6,
            w: s.playerWidth - 16,
            h: s.playerHeight - 8,
          };
          const oBox = {
            x: obs.x + 4,
            y: obs.y + 4,
            w: obs.width - 8,
            h: obs.height - 8,
          };

          const isColliding =
            pBox.x < oBox.x + oBox.w &&
            pBox.x + pBox.w > oBox.x &&
            pBox.y < oBox.y + oBox.h &&
            pBox.y + pBox.h > oBox.y;

          if (isColliding) {
            // CRASH / GAME OVER
            sounds.playCrash();
            s.screenShake = 16;
            // Crash particles
            for (let p = 0; p < 24; p++) {
              s.particles.push({
                x: s.playerX + s.playerWidth / 2,
                y: s.playerY + s.playerHeight / 2,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                size: Math.random() * 5 + 2,
                alpha: 1,
                color: ['#ef4444', '#f97316', '#fbbf24', '#ffffff'][p % 4],
                life: 0,
                maxLife: 35,
              });
            }
            onGameOver(s.score, s.starsCollected);
            break;
          }
        }

        // Remove offscreen obstacles
        if (obs.x + obs.width < -50) {
          s.obstacles.splice(i, 1);
        }
      }

      // Update & Render Collectible Stars
      for (let i = s.stars.length - 1; i >= 0; i--) {
        const star = s.stars[i];
        if (status === 'playing') {
          star.x -= s.speed * dt;
          star.angle += 0.05 * dt;

          // Pickup check
          const px = s.playerX + s.playerWidth / 2;
          const py = s.playerY + s.playerHeight / 2;
          const dist = Math.hypot(px - star.x, py - star.y);
          if (dist < star.radius + s.playerWidth * 0.4) {
            star.collected = true;
            s.starsCollected++;
            onStarsUpdate(s.starsCollected);
            sounds.playCollect();

            // Collect burst particles
            for (let p = 0; p < 12; p++) {
              s.particles.push({
                x: star.x,
                y: star.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                size: Math.random() * 3 + 2,
                alpha: 1,
                color: '#facc15',
                life: 0,
                maxLife: 22,
              });
            }
            s.stars.splice(i, 1);
            continue;
          }
        }

        // Render rotating star coin
        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.rotate(star.angle);

        // Star glow
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#fde047';

        // Draw 5-pointed star
        ctx.beginPath();
        for (let pt = 0; pt < 5; pt++) {
          const a1 = (pt * 2 * Math.PI) / 5 - Math.PI / 2;
          const a2 = ((pt + 0.5) * 2 * Math.PI) / 5 - Math.PI / 2;
          const r1 = star.radius;
          const r2 = star.radius * 0.45;
          if (pt === 0) ctx.moveTo(Math.cos(a1) * r1, Math.sin(a1) * r1);
          else ctx.lineTo(Math.cos(a1) * r1, Math.sin(a1) * r1);
          ctx.lineTo(Math.cos(a2) * r2, Math.sin(a2) * r2);
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        if (star.x < -40) {
          s.stars.splice(i, 1);
        }
      }

      // --- 6. RENDER PLAYER SPRITE ---
      ctx.save();
      const px = s.playerX;
      const py = s.playerY;

      if (mode === 'car') {
        // Car Mode Rendering
        let carSprite: HTMLImageElement | null = assets.car.idle;

        if (status === 'playing') {
          if (!s.isGrounded) {
            carSprite = assets.car.jump;
          } else {
            s.frameTimer += dt * (s.speed * 0.15);
            s.carFrameIndex = Math.floor(s.frameTimer) % assets.car.drive.length;
            carSprite = assets.car.drive[s.carFrameIndex] || assets.car.idle;
          }
        }

        if (carSprite && carSprite.complete) {
          // Subtle jump tilt
          ctx.save();
          ctx.translate(px + s.playerWidth / 2, py + s.playerHeight / 2);
          if (!s.isGrounded) {
            ctx.rotate(Math.min(0.25, Math.max(-0.25, s.playerVy * 0.025)));
          }
          ctx.drawImage(
            carSprite,
            -s.playerWidth / 2,
            -s.playerHeight / 2,
            s.playerWidth,
            s.playerHeight
          );
          ctx.restore();
        }
      } else {
        // Runner Character Rendering
        let runnerSprite: HTMLCanvasElement | HTMLImageElement | null = assets.runner.idle;

        if (status === 'gameover') {
          runnerSprite = assets.runner.dead;
        } else if (!s.isGrounded) {
          runnerSprite = assets.runner.jump;
        } else if (status === 'playing') {
          s.frameTimer += dt * (s.speed * 0.18);
          s.runFrameIndex = Math.floor(s.frameTimer) % assets.runner.run.length;
          runnerSprite = assets.runner.run[s.runFrameIndex] || assets.runner.idle;
        }

        if (runnerSprite) {
          // If dead, adjust aspect ratio since dead sprite is wider
          if (status === 'gameover') {
            const deadW = s.playerWidth * 1.5;
            const deadH = s.playerHeight * 0.55;
            ctx.drawImage(runnerSprite, px, groundY - deadH, deadW, deadH);
          } else {
            ctx.drawImage(runnerSprite, px, py, s.playerWidth, s.playerHeight);
          }
        }
      }
      ctx.restore();

      // --- 7. PARTICLES UPDATE & RENDER ---
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        if (p.life >= p.maxLife) {
          s.particles.splice(i, 1);
        }
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [assets, mode, status, theme, triggerJump, onGameOver, onScoreUpdate, onStarsUpdate]);

  return (
    <div
      ref={containerRef}
      id="game-viewport"
      onClick={triggerJump}
      className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] rounded-2xl overflow-hidden cursor-pointer shadow-2xl border border-neutral-800 bg-neutral-950 select-none"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950/90 backdrop-blur-sm z-30">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-neutral-300 font-display text-lg tracking-wider">LOADING SPRITES & ASSETS...</p>
        </div>
      )}

      {/* Touch Screen Jump Indicator */}
      <div className="absolute bottom-3 right-3 sm:hidden z-10 pointer-events-none">
        <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-black/60 text-white/80 border border-white/10 backdrop-blur-md">
          TAP ANYWHERE TO JUMP
        </span>
      </div>
    </div>
  );
};
