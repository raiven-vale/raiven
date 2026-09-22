// Sprite loading & canvas chroma-key background removal for JPEG sprites
export interface LoadedAssets {
  runner: {
    idle: HTMLCanvasElement | HTMLImageElement;
    run: (HTMLCanvasElement | HTMLImageElement)[];
    jump: HTMLCanvasElement | HTMLImageElement;
    dead: HTMLCanvasElement | HTMLImageElement;
  };
  car: {
    idle: HTMLImageElement;
    drive: HTMLImageElement[];
    jump: HTMLImageElement;
  };
  themes: {
    heatwave: HTMLImageElement;
    midnight: HTMLImageElement;
  };
  obstacles: {
    il: HTMLImageElement;
    pride: HTMLImageElement;
  };
  pfp: HTMLImageElement;
}

function processWhiteBgToTransparent(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width || 200;
  canvas.height = img.naturalHeight || img.height || 280;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.drawImage(img, 0, 0);
  try {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // White/near-white pixel detection
      if (r > 238 && g > 238 && b > 238) {
        data[i + 3] = 0; // Transparent
      } else if (r > 218 && g > 218 && b > 218) {
        // Soft edge feathering
        const brightness = (r + g + b) / 3;
        const alpha = Math.max(0, 255 - ((brightness - 218) / 20) * 255);
        data[i + 3] = Math.min(data[i + 3], alpha);
      }
    }
    ctx.putImageData(imgData, 0, 0);
  } catch {
    // If security error (CORS), fall back to original canvas
  }

  return canvas;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn(`[Raiven] Failed to load image: ${src}`);
      // Return empty image or fallback to avoid breaking the game
      resolve(img);
    };
    img.src = src;
  });
}

let cachedAssets: LoadedAssets | null = null;
let assetLoadingPromise: Promise<LoadedAssets> | null = null;

export async function preloadGameAssets(): Promise<LoadedAssets> {
  if (cachedAssets) return cachedAssets;
  if (assetLoadingPromise) return assetLoadingPromise;

  assetLoadingPromise = (async () => {
    // 1. Character Sprites
    const [idleImg, jumpImg, deadImg, ...runImgs] = await Promise.all([
      loadImage('/assets/character/idle.png.jpg'),
      loadImage('/assets/character/jump.png.jpg'),
      loadImage('/assets/character/dead.png.jpg'),
      loadImage('/assets/character/run1.png.jpg'),
      loadImage('/assets/character/run2.png.jpg'),
      loadImage('/assets/character/run3.png.jpg'),
      loadImage('/assets/character/run4.png.jpg'),
      loadImage('/assets/character/run5.png.jpg'),
      loadImage('/assets/character/run6.png.jpg'),
    ]);

    // Chroma-key clean character sprites
    const idleProcessed = processWhiteBgToTransparent(idleImg);
    const jumpProcessed = processWhiteBgToTransparent(jumpImg);
    const deadProcessed = processWhiteBgToTransparent(deadImg);
    const runProcessed = runImgs.map((img) => processWhiteBgToTransparent(img));

    // 2. Car Sprites (Native Transparent PNGs)
    const [carIdle, carDrive2, carDrive3, carDrive4, carJump] = await Promise.all([
      loadImage('/assets/frames/car_idle.png'),
      loadImage('/assets/frames/car_drive2.png'),
      loadImage('/assets/frames/car_drive3.png'),
      loadImage('/assets/frames/car_drive4.png'),
      loadImage('/assets/frames/car_jumping.png'),
    ]);

    // 3. Concept Background Themes
    const [heatwaveTheme, midnightTheme] = await Promise.all([
      loadImage('/assets/concept images/theme-heatwave.png.jfif'),
      loadImage('/assets/concept images/theme-midnight.png.png'),
    ]);

    // 4. Trash / Obstacles
    const [trashIl, trashPride] = await Promise.all([
      loadImage('/assets/trash file/IL.png'),
      loadImage('/assets/trash file/pride.png'),
    ]);

    // 5. PFP
    const pfp = await loadImage('/assets/pfp.png.jpg');

    cachedAssets = {
      runner: {
        idle: idleProcessed,
        run: runProcessed,
        jump: jumpProcessed,
        dead: deadProcessed,
      },
      car: {
        idle: carIdle,
        drive: [carDrive2, carDrive3, carDrive4],
        jump: carJump,
      },
      themes: {
        heatwave: heatwaveTheme,
        midnight: midnightTheme,
      },
      obstacles: {
        il: trashIl,
        pride: trashPride,
      },
      pfp,
    };

    return cachedAssets;
  })();

  return assetLoadingPromise;
}
