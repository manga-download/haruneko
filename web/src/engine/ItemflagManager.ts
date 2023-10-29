import type { MediaContainer, MediaChild } from './providers/MediaPlugin';
import { type StorageController, Store } from './StorageController';
import { Event } from './Event';

export class ItemflagManager {

    private readonly cache: Map<string, ItemFlag[]> = new Map();
    public readonly FlagChanged: Event<MediaContainer<MediaChild>, FlagType> = new Event<MediaContainer<MediaChild>, FlagType>();
    public readonly MediaFlagsChanged: Event<ItemflagManager, MediaContainer<MediaChild>> = new Event<this, MediaContainer<MediaChild>>();

    constructor(private readonly storage: StorageController) {}

    /**
     * Load the flags for the given {@link key} from the persistent storage into the internal {@link cache}.
     * @param key - The identifier for the flags to be loaded
     */
    private async LoadFlags(key: string) {
        const flags = await this.storage.LoadPersistent<ItemFlag[]>(Store.Itemflags, key);
        this.cache.set(key, flags ?? []);
    }

    /**
     * Save the flags for the given {@link key} from the internal {@link cache} into the persistent storage.
     * @param key - The identifier for the flags to be stored
     */
    private async SaveFlags(key: string) {
        const flags = this.cache.get(key).filter(flag => flag.kind !== FlagType.None);
        if(flags.length > 0) {
            await this.storage.SavePersistent<ItemFlag[]>(flags, Store.Itemflags, key);
        } else {
            await this.storage.RemovePersistent(Store.Itemflags, key);
        }
    }

    /**
     * Create a pseudo-unique identifier for a given {@link container}.
     */
    private StorageKey(container: MediaContainer<MediaContainer<MediaChild>>): string {
        return `${container.Parent.Identifier} :: ${container.Identifier}`;
    }

    /**
     * Create a pseudeo-unique identifier for a given {@link text}.
     */
    private Hash(text: string): string {
        return text.split('').reduce((hash, c) => 31 * hash + c.charCodeAt(0) | 0, 0).toString(36);
    }

    private isFlagRepresentingEntry(flag: ItemFlag, entry: MediaContainer<MediaChild>): boolean {
        return flag.IdentifierHash === this.Hash(entry.Identifier) || flag.TitleHash === this.Hash(entry.Title);
    }

    private findFlagType(flags: ItemFlag[], entry: MediaContainer<MediaChild>) {
        return flags?.find(flag => this.isFlagRepresentingEntry(flag, entry))?.kind ?? FlagType.None;
    }

    /**
     * Get the cached/stored flags for all entries within the given {@link container}.
     */
    private async GetContainerItemsFlags(container: MediaContainer<MediaContainer<MediaChild>>): Promise<ItemFlag[]> {
        const storagekey = this.StorageKey(container);
        if (!this.cache.has(storagekey)) await this.LoadFlags(storagekey);
        return this.cache.get(storagekey);
    }

    /* Add a flag of an item */
    public async SetFlag(entry: MediaContainer<MediaChild>, kind: FlagType) {
        const newflag: ItemFlag = {
            IdentifierHash: this.Hash(entry.Identifier),
            TitleHash: this.Hash(entry.Title),
            kind: kind,
        };
        let flags: ItemFlag[] = [];
        if (kind === FlagType.Current) {
            // Ignore all previous flags and add flag viewed on all items after entry
            // TODO: Manage flags context per language in case of multiple current flag (1 per language)
            const items = entry.Parent?.Entries;
            const entryIndex = items?.indexOf(entry);
            items.forEach((item, index) => {
                if (index > entryIndex) flags.push({
                    IdentifierHash: this.Hash(item.Identifier),
                    TitleHash: this.Hash(item.Title),
                    kind: FlagType.Viewed,
                });
            });
        }
        else flags = await this.GetContainerItemsFlags(entry.Parent) ?? [];
        flags = flags.filter(flag => {
            return !(newflag.IdentifierHash === flag.IdentifierHash)
                && !(newflag.TitleHash === flag.TitleHash);
        });
        flags.push(newflag);
        const storagekey = this.StorageKey(entry.Parent);
        this.cache.set(storagekey, flags);
        await this.SaveFlags(storagekey);
        this.FlagChanged.Dispatch(entry, kind);
        this.MediaFlagsChanged.Dispatch(this, entry.Parent);
    }

    /* Get the flagType of an item */
    public async GetFlag(entry: MediaContainer<MediaChild>) : Promise<FlagType> {
        return this.findFlagType(await this.GetContainerItemsFlags(entry.Parent), entry);
    }

    public async FilterEntries(container: MediaContainer<MediaContainer<MediaChild>>, mask: FlagType) {
        const marks = await this.GetContainerItemsFlags(container);
        return container.Entries.filter(entry => {
            const flag = this.findFlagType(marks, entry);
            return (mask & flag) === flag;
        });
    }
}

type ItemFlag = {
    IdentifierHash: string,
    TitleHash: string,
    kind:FlagType,
}

export const enum FlagType {
    None = 0,
    Viewed = 1 << 0,
    Current = 1 << 1,
}