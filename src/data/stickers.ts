import { StickerItem } from '../types';

export const INITIAL_STICKERS: StickerItem[] = [
  {
    id: 1,
    title: 'First Step',
    filename: '1.jfif',
    src: '/assets/stickers/1.jfif',
    unlockCondition: 'Start your first run',
    requiredScore: 0,
    isUnlocked: true,
    unlockedAt: 'Welcome Gift',
    description: 'The journey begins with a single leap into the neon metropolis.',
  },
  {
    id: 2,
    title: 'Heatwave Cruiser',
    filename: '2.jfif',
    src: '/assets/stickers/2.jfif',
    unlockCondition: 'Reach a score of 150 points',
    requiredScore: 150,
    isUnlocked: false,
    description: 'Cruising through the blazing desert horizons with maximum horsepower.',
  },
  {
    id: 3,
    title: 'Midnight Phantom',
    filename: '3.jfif',
    src: '/assets/stickers/3.jfif',
    unlockCondition: 'Reach a score of 300 points',
    requiredScore: 300,
    isUnlocked: false,
    description: 'Blends into the deep twilight skyline under the luminescence of neon skyscrapers.',
  },
  {
    id: 4,
    title: 'Star Collector',
    filename: '4.jfif',
    src: '/assets/stickers/4.jfif',
    unlockCondition: 'Collect 10 golden stars in runs',
    requiredScore: 450,
    isUnlocked: false,
    description: 'Awarded to swift runners who never miss a collectible in mid-air.',
  },
  {
    id: 5,
    title: 'Turbo Charged',
    filename: '5.jfif',
    src: '/assets/stickers/5.jfif',
    unlockCondition: 'Reach a score of 600 points',
    requiredScore: 600,
    isUnlocked: false,
    description: 'Pushing the speedometer past safe limits with high-speed reflex maneuvers.',
  },
  {
    id: 6,
    title: 'Pride & Glory',
    filename: '6.jfif',
    src: '/assets/stickers/6.jfif',
    unlockCondition: 'Dodge 25 hazardous obstacles',
    requiredScore: 800,
    isUnlocked: false,
    description: 'Commemorating resilience and agility through treacherous streets.',
  },
  {
    id: 7,
    title: 'Hyper Driver',
    filename: '7.jfif',
    src: '/assets/stickers/7.jfif',
    unlockCondition: 'Reach a score of 1,000 points',
    requiredScore: 1000,
    isUnlocked: false,
    description: 'Legendary mastery achieved in high-stakes velocity runs.',
  },
  {
    id: 8,
    title: 'Raiven Master',
    filename: '8.jfif',
    src: '/assets/stickers/8.jfif',
    unlockCondition: 'Reach a score of 1,500 points',
    requiredScore: 1500,
    isUnlocked: false,
    description: 'The supreme badge of the ultimate cybernetic highway champion.',
  },
];

const STORAGE_KEY = 'raiven_unlocked_stickers_v1';

export function loadSavedStickers(): StickerItem[] {
  if (typeof window === 'undefined') return INITIAL_STICKERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STICKERS;
    const ids: number[] = JSON.parse(raw);
    return INITIAL_STICKERS.map((s) => ({
      ...s,
      isUnlocked: s.isUnlocked || ids.includes(s.id),
    }));
  } catch {
    return INITIAL_STICKERS;
  }
}

export function saveUnlockedSticker(id: number): StickerItem[] {
  if (typeof window === 'undefined') return INITIAL_STICKERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const ids: number[] = raw ? JSON.parse(raw) : [1];
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }
    return INITIAL_STICKERS.map((s) => ({
      ...s,
      isUnlocked: ids.includes(s.id),
      unlockedAt: ids.includes(s.id) ? 'Unlocked' : undefined,
    }));
  } catch {
    return INITIAL_STICKERS;
  }
}
