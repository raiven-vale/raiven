export type GameMode = 'runner' | 'car';

export type GameTheme = 'heatwave' | 'midnight';

export type GameStatus = 'idle' | 'playing' | 'gameover';

export interface StickerItem {
  id: number;
  title: string;
  filename: string;
  src: string;
  unlockCondition: string;
  requiredScore: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  description: string;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'trash_il' | 'trash_pride' | 'barrier';
  speed: number;
  passed?: boolean;
}

export interface CollectibleStar {
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  angle: number;
  id: number;
  stickerId?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}
