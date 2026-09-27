/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Suitable for the single-instance Expo dev/preview server. For horizontally
 * scaled deployments, back this with Redis (same interface).
 */

type Bucket = {
    count: number;
    resetAt: number;
};

type RateLimitOptions = {
    /** Max requests allowed per window. */
    limit: number;
    /** Window length in milliseconds. */
    windowMs: number;
};

export type RateLimitResult = {
    success: boolean;
    remaining: number;
    /** Seconds until the window resets (only meaningful when blocked). */
    retryAfterSeconds: number;
};

const buckets = new Map<string, Bucket>();
let lastPrune = Date.now();

function prune(now: number) {
    if (now - lastPrune < 60_000) {
        return;
    }
    lastPrune = now;
    for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) {
            buckets.delete(key);
        }
    }
}

export function rateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
    const now = Date.now();
    prune(now);

    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, {
            count: 1,
            resetAt: now + windowMs,
        });
        return {
            success: true,
            remaining: limit - 1,
            retryAfterSeconds: 0,
        };
    }

    if (bucket.count >= limit) {
        return {
            success: false,
            remaining: 0,
            retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
        };
    }

    bucket.count += 1;
    return {
        success: true,
        remaining: limit - bucket.count,
        retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
}

/** Best-effort client identity for rate limiting (session user id > IP). */
export function getClientKey(request: Request, userId?: string): string {
    if (userId) {
        return `user:${userId}`;
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    return `ip:${ip}`;
}
