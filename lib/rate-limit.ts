/**
 * Sliding window rate limiter for Next.js Server Route.
 * Limits each IP address to maxRequests within windowMs.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

const WINDOW_MS = 60 * 1000; // 1 phút
const MAX_REQUESTS_PER_WINDOW = 10; // 10 lượt / phút
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // Dọn dẹp mỗi 5 phút

let lastCleanup = Date.now();

function cleanupExpired() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  lastCleanup = now;
  for (const [key, record] of rateLimitStore.entries()) {
    const validTimestamps = record.timestamps.filter((ts) => now - ts < WINDOW_MS);
    if (validTimestamps.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, { timestamps: validTimestamps });
    }
  }
}

export interface RateLimitResult {
  isAllowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkRateLimit(
  clientIp: string,
  maxRequests: number = MAX_REQUESTS_PER_WINDOW,
  windowMs: number = WINDOW_MS
): RateLimitResult {
  cleanupExpired();

  const now = Date.now();
  const record = rateLimitStore.get(clientIp) || { timestamps: [] };

  // Lọc các timestamp nằm trong window hiện tại
  const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (validTimestamps.length >= maxRequests) {
    const oldest = validTimestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      isAllowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  validTimestamps.push(now);
  rateLimitStore.set(clientIp, { timestamps: validTimestamps });

  return {
    isAllowed: true,
    remaining: maxRequests - validTimestamps.length,
    retryAfterSeconds: 0,
  };
}
