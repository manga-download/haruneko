import { describe, it, expect } from 'vitest';
import { Store, type StorageController } from './StorageController';
import { LoadMediaList, MediaListChunkSize, SaveMediaList } from './MediaListStore';

class MemoryStorage implements StorageController {
    private readonly data = new Map<string, unknown>();

    private Key(store: Store, key?: string): string {
        return `${store}${key ? ':' + key : ''}`;
    }

    public async SavePersistent<T>(value: T, store: Store, key?: string): Promise<void> {
        if (key !== undefined) {
            this.data.set(this.Key(store, key), value);
        } else {
            for (const [entryKey, entryValue] of Object.entries(value as Record<string, unknown>)) {
                this.data.set(this.Key(store, entryKey), entryValue);
            }
        }
    }

    public async LoadPersistent<T>(store: Store, key?: string): Promise<T> {
        return this.data.get(this.Key(store, key)) as T;
    }

    public async RemovePersistent(store: Store, ...keys: string[]): Promise<void> {
        if (keys.length === 0) {
            const prefix = `${store}:`;
            for (const key of [...this.data.keys()]) {
                if (key.startsWith(prefix)) this.data.delete(key);
            }
        } else {
            for (const key of keys) this.data.delete(this.Key(store, key));
        }
    }

    public async SaveTemporary<T>(_value: T): Promise<string> { return 'temporary'; }
    public async LoadTemporary<T>(_key: string): Promise<T> { return undefined as T; }
    public async RemoveTemporary(..._keys: string[]): Promise<void> {}
}

function entries(count: number): { id: string; title: string }[] {
    return Array.from({ length: count }, (_, index) => ({ id: `manga-${index}`, title: `Manga ${index}` }));
}

class WriteCountingStorage extends MemoryStorage {
    public readonly writes = new Map<string, number>();

    public override async SavePersistent<T>(value: T, store: Store, key?: string): Promise<void> {
        await super.SavePersistent(value, store, key);
        if (key !== undefined) {
            const current = this.writes.get(key) ?? 0;
            this.writes.set(key, current + 1);
        }
    }
}

describe('MediaListStore', () => {

    it('Should round-trip a multi-chunk list in order', async () => {
        const storage = new MemoryStorage();
        const list = entries(MediaListChunkSize * 2 + 250);
        await SaveMediaList(storage, 'mangafire', list);
        expect(await LoadMediaList(storage, 'mangafire')).toEqual(list);
    });

    it('Should prune stale chunks when the list shrinks', async () => {
        const storage = new MemoryStorage();
        await SaveMediaList(storage, 'site', entries(MediaListChunkSize * 3));
        await SaveMediaList(storage, 'site', entries(MediaListChunkSize + 10));
        expect(await LoadMediaList(storage, 'site')).toHaveLength(MediaListChunkSize + 10);
        expect(await storage.LoadPersistent(Store.MediaLists, 'site#2')).toBeUndefined();
    });

    it('Should fall back to the legacy single-key list', async () => {
        const storage = new MemoryStorage();
        const legacy = entries(42);
        await storage.SavePersistent(legacy, Store.MediaLists, 'legacy-site');
        expect(await LoadMediaList(storage, 'legacy-site')).toEqual(legacy);
    });

    it('Should handle an empty list', async () => {
        const storage = new MemoryStorage();
        await SaveMediaList(storage, 'empty', entries(MediaListChunkSize * 2));
        await SaveMediaList(storage, 'empty', []);
        expect(await LoadMediaList(storage, 'empty')).toEqual([]);
    });

    it('Should only rewrite shards whose content changed', async () => {
        const storage = new WriteCountingStorage();
        await SaveMediaList(storage, 'site', entries(MediaListChunkSize * 3));

        // Change a single entry in the middle shard only.
        const updated = entries(MediaListChunkSize * 3);
        updated[MediaListChunkSize + 5] = { id: 'manga-new', title: 'New Manga' };
        await SaveMediaList(storage, 'site', updated);

        // First and last shards must not have been written again.
        expect(storage.writes.get('site#0')).toBe(1);
        expect(storage.writes.get('site#2')).toBe(1);
        // The changed shard and the meta are rewritten.
        expect(storage.writes.get('site#1')).toBe(2);
        expect(storage.writes.get('site#meta')).toBe(2);
        expect(await LoadMediaList(storage, 'site')).toEqual(updated);
    });
});
