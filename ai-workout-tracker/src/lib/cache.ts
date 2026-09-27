/**
 * Minimal in-memory TTL cache.
 *
 * Suitable for the single-instance Expo dev/preview server. Entries are never
 * persisted — a server restart simply repopulates the cache on demand.
 */

type Entry<T> = {
    value: T;
    expiresAt: number;
};

export class TTLCache<T> {
    private readonly entries = new Map<string, Entry<T>>();

    constructor(
        private readonly ttlMs: number,
        private readonly maxSize = 1000,
    ) {}

    get(key: string): T | undefined {
        const entry = this.entries.get(key);

        if (!entry) {
            return undefined;
        }

        if (entry.expiresAt <= Date.now()) {
            this.entries.delete(key);
            return undefined;
        }

        return entry.value;
    }

    set(key: string, value: T): void {
        if (this.entries.size >= this.maxSize) {
            // Evict the oldest entry (Map preserves insertion order).
            const oldest = this.entries.keys().next();
            if (!oldest.done) {
                this.entries.delete(oldest.value);
            }
        }

        this.entries.set(key, {
            value,
            expiresAt: Date.now() + this.ttlMs,
        });
    }
}
