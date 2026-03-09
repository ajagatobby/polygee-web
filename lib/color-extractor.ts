/**
 * Client-side dominant color extraction from team logo images.
 *
 * Strategy:
 * 1. Load the image through Next.js image proxy (same-origin, avoids CORS taint)
 * 2. Draw to an offscreen canvas, sample pixels
 * 3. Filter out white, near-white, black, near-black, transparent pixels
 * 4. Cluster remaining pixels and pick the most dominant, saturated color
 * 5. Cache in memory + localStorage so each logo is only processed once
 */

// ─── In-memory cache ───────────────────────────────────────────────────
const memoryCache = new Map<string, string>();

const STORAGE_KEY = "polygee-team-colors";
const STORAGE_VERSION = 1;

interface StorageData {
  version: number;
  colors: Record<string, string>;
}

function loadStorageCache(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: StorageData = JSON.parse(raw);
    if (parsed.version !== STORAGE_VERSION) return {};
    return parsed.colors;
  } catch {
    return {};
  }
}

function saveToStorage(key: string, color: string) {
  if (typeof window === "undefined") return;
  try {
    const existing = loadStorageCache();
    existing[key] = color;
    const data: StorageData = { version: STORAGE_VERSION, colors: existing };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — ignore
  }
}

// Initialize memory cache from localStorage on first load
let storageLoaded = false;
function ensureStorageLoaded() {
  if (storageLoaded) return;
  storageLoaded = true;
  const stored = loadStorageCache();
  for (const [key, value] of Object.entries(stored)) {
    memoryCache.set(key, value);
  }
}

// ─── Color extraction logic ────────────────────────────────────────────

/** Convert RGB to HSL. Returns [h (0-360), s (0-1), l (0-1)] */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return [0, 0, l];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return [h * 360, s, l];
}

/** Check if a pixel should be skipped (white, near-white, black, near-black, gray) */
function shouldSkipPixel(r: number, g: number, b: number, a: number): boolean {
  // Skip transparent/semi-transparent
  if (a < 128) return true;

  const [, s, l] = rgbToHsl(r, g, b);

  // Skip near-white (lightness > 0.92)
  if (l > 0.92) return true;

  // Skip near-black (lightness < 0.08)
  if (l < 0.08) return true;

  // Skip very desaturated (grays) — these are usually background/border artifacts
  if (s < 0.12 && l > 0.2 && l < 0.8) return true;

  return false;
}

/** Simple color bucket for quantization */
interface ColorBucket {
  rSum: number;
  gSum: number;
  bSum: number;
  count: number;
  saturationSum: number;
}

/**
 * Extract the dominant color from image pixel data.
 * Uses a simple quantization: group similar colors into buckets,
 * then pick the bucket with the best combo of frequency and saturation.
 */
function extractDominantFromPixels(data: Uint8ClampedArray, pixelCount: number): string | null {
  // Step 1: Sample pixels, skip undesirable ones
  const bucketSize = 24; // Group colors into 24-unit ranges (256/24 ≈ 10 buckets per channel)
  const buckets = new Map<string, ColorBucket>();

  const step = Math.max(1, Math.floor(pixelCount / 5000)); // Sample up to ~5000 pixels

  for (let i = 0; i < pixelCount; i += step) {
    const offset = i * 4;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const a = data[offset + 3];

    if (shouldSkipPixel(r, g, b, a)) continue;

    // Quantize to bucket
    const rBucket = Math.floor(r / bucketSize);
    const gBucket = Math.floor(g / bucketSize);
    const bBucket = Math.floor(b / bucketSize);
    const key = `${rBucket},${gBucket},${bBucket}`;

    const [, s] = rgbToHsl(r, g, b);

    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { rSum: 0, gSum: 0, bSum: 0, count: 0, saturationSum: 0 };
      buckets.set(key, bucket);
    }
    bucket.rSum += r;
    bucket.gSum += g;
    bucket.bSum += b;
    bucket.count++;
    bucket.saturationSum += s;
  }

  if (buckets.size === 0) return null;

  // Step 2: Score each bucket — balance frequency with saturation
  // We want the most "colorful" dominant color, not gray backgrounds
  let bestBucket: ColorBucket | null = null;
  let bestScore = -1;

  const totalPixels = Array.from(buckets.values()).reduce((sum, b) => sum + b.count, 0);

  for (const bucket of buckets.values()) {
    const avgSaturation = bucket.saturationSum / bucket.count;
    const frequency = bucket.count / totalPixels;

    // Score: frequency * (1 + saturation boost)
    // Saturation gets a 3x multiplier so vibrant colors rank higher
    const score = frequency * (0.3 + avgSaturation * 3.0);

    if (score > bestScore) {
      bestScore = score;
      bestBucket = bucket;
    }
  }

  if (!bestBucket || bestBucket.count === 0) return null;

  const r = Math.round(bestBucket.rSum / bestBucket.count);
  const g = Math.round(bestBucket.gSum / bestBucket.count);
  const b = Math.round(bestBucket.bSum / bestBucket.count);

  // Ensure the color isn't too light for a button background
  // If lightness > 0.75, darken it slightly
  const [h, s, l] = rgbToHsl(r, g, b);
  if (l > 0.75) {
    return hslToHex(h, s, Math.min(l, 0.55));
  }

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/** Convert HSL to hex */
function hslToHex(h: number, s: number, l: number): string {
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h / 360 + 1 / 3);
    g = hue2rgb(p, q, h / 360);
    b = hue2rgb(p, q, h / 360 - 1 / 3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ─── Public API ────────────────────────────────────────────────────────

/**
 * Extract dominant color from an image URL.
 * Uses Next.js image proxy to avoid CORS issues.
 * Returns a hex color string, or null if extraction fails.
 */
export function extractColorFromImage(imageUrl: string): Promise<string | null> {
  ensureStorageLoaded();

  // Check memory cache first
  const cached = memoryCache.get(imageUrl);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve) => {
    // Use Next.js image optimization proxy for same-origin access
    // This avoids CORS canvas tainting
    const proxyUrl = `/_next/image?url=${encodeURIComponent(imageUrl)}&w=64&q=75`;

    const img = new Image();
    img.crossOrigin = "anonymous";

    const timeout = setTimeout(() => {
      resolve(null);
    }, 5000); // 5s timeout

    img.onload = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          resolve(null);
          return;
        }

        // Draw at small size for speed
        const size = Math.min(img.naturalWidth || 64, 64);
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const imageData = ctx.getImageData(0, 0, size, size);
        const color = extractDominantFromPixels(imageData.data, size * size);

        if (color) {
          memoryCache.set(imageUrl, color);
          saveToStorage(imageUrl, color);
        }

        resolve(color);
      } catch {
        // Canvas tainted or other error
        resolve(null);
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      resolve(null);
    };

    img.src = proxyUrl;
  });
}

/**
 * Get cached extracted color for an image URL (synchronous).
 * Returns null if not yet extracted.
 */
export function getCachedColor(imageUrl: string): string | null {
  ensureStorageLoaded();
  return memoryCache.get(imageUrl) ?? null;
}
