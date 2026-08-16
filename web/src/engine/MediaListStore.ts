import { Store, type StorageController } from './StorageController';

export type MediaListEntry = { id: string; title: string };

/**
 * Number of entries stored per shard of a media list.
 * Sharding avoids cloning/rewriting a single multi-thousand-entry blob on every
 * load/save of the media list (e.g. ~70k entries for MangaFire).
 */
export const MediaListChunkSize = 1000;

type MediaListMeta = { chunks: number };

function MetaKey(identifier: string): string {
    return `${identifier}#meta`;
}

function ChunkKey(identifier: string, index: number): string {
    return `${identifier}#${index}`;
}

/**
 * Loads a media list stored as fixed-size shards, falling back to the legacy
 * single-key layout written by previous versions.
 */
export async function LoadMediaList(storage: StorageController, identifier: string): Promise<MediaListEntry[]> {
    const meta = await storage.LoadPersistent<MediaListMeta>(Store.MediaLists, MetaKey(identifier));
    if (meta && typeof meta.chunks === 'number') {
        const chunks = await Promise.all(
            Array.from({ length: meta.chunks }, (_, index) =>
                storage.LoadPersistent<MediaListEntry[]>(Store.MediaLists, ChunkKey(identifier, index)),
            ),
        );
        return chunks.flat();
    }
    // Legacy fallback: the whole list used to be stored under a single key.
    return await storage.LoadPersistent<MediaListEntry[]>(Store.MediaLists, identifier) ?? [];
}

/**
 * Stores a media list as fixed-size shards and prunes stale shards (and the
 * legacy single-key blob) left behind by previous runs.
 *
 * Each shard is compared against its previously stored counterpart **one at a
 * time**, so only the shards whose content actually changed (and any newly
 * added shards) are rewritten — without ever materializing the whole previous
 * list in memory. Refreshing a mostly-unchanged list therefore neither re-clones
 * nor re-stores tens of thousands of entries on every update.
 */
export async function SaveMediaList(storage: StorageController, identifier: string, entries: MediaListEntry[]): Promise<void> {
    const previous = await storage.LoadPersistent<MediaListMeta>(Store.MediaLists, MetaKey(identifier));
    const sharded = previous && typeof previous.chunks === 'number';
    const previousChunks = sharded ? previous.chunks : 0;
    const chunkCount = Math.ceil(entries.length / MediaListChunkSize);

    for (let index = 0; index < chunkCount; index++) {
        const chunk = entries.slice(index * MediaListChunkSize, (index + 1) * MediaListChunkSize);
        const previousChunk = sharded
            ? await storage.LoadPersistent<MediaListEntry[]>(Store.MediaLists, ChunkKey(identifier, index)) ?? []
            : [];
        if (!sharded || !ChunksEqual(chunk, previousChunk)) {
            await storage.SavePersistent(chunk, Store.MediaLists, ChunkKey(identifier, index));
        }
    }
    await storage.SavePersistent({ chunks: chunkCount }, Store.MediaLists, MetaKey(identifier));

    // Prune shards no longer needed (list shrank) and the legacy full-list key.
    const stale: string[] = [];
    for (let index = chunkCount; index < previousChunks; index++) {
        stale.push(ChunkKey(identifier, index));
    }
    stale.push(identifier);
    await storage.RemovePersistent(Store.MediaLists, ...stale);
}

/** True when two shards contain the same entries (identifier + title). */
function ChunksEqual(left: MediaListEntry[], right: MediaListEntry[]): boolean {
    if (left.length !== right.length) return false;
    return left.every((entry, index) => entry.id === right[index]?.id && entry.title === right[index]?.title);
}
