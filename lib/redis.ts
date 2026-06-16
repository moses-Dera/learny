// ioredis singleton for rate limiting on auth routes.
// Rate limit: 10 requests per minute per IP on /api/auth/signin.
// Sliding window algorithm via ioredis sorted sets.

import Redis from "ioredis";
import { env } from "@/lib/env";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

// Rate limit constants
export const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per window

/**
 * Sliding window rate limiter using Redis sorted sets.
 * Returns true if the request should be allowed, false if rate limited.
 */
export async function checkRateLimit(identifier: string): Promise<boolean> {
  const key = `rate_limit:${identifier}`;
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  const pipeline = redis.pipeline();

  // Remove entries outside the current window
  pipeline.zremrangebyscore(key, 0, windowStart);
  // Count entries in current window
  pipeline.zcard(key);
  // Add current request
  pipeline.zadd(key, now, `${now}-${Math.random()}`);
  // Set TTL so keys auto-expire
  pipeline.expire(key, Math.ceil(RATE_LIMIT_WINDOW_MS / 1000));

  const results = await pipeline.exec();
  const count = (results?.[1]?.[1] as number) ?? 0;

  return count < RATE_LIMIT_MAX_REQUESTS;
}
