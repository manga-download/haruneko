import { Observable } from './Observable';
import type { MediaChild, MediaContainer } from './providers/MediaPlugin';
import { type StorageController, Store } from './StorageController';

export type ItemFlag = {
    IdentifierHash: string,
    TitleHash: string,
    kind: FlagType,
}

export const enum FlagType {
    Current,
    Viewed,
}

export type EntryFlagEventData = {
    readonly Entry: MediaContainer<MediaChild>;
    readonly Kind?: FlagType;
};

// TODO: Revise how flags can be handled in a more effcient/optimized and reactive way
// See: Proposalfor managing generic annotation data => https://github.com/manga-download/haruneko/tree/decouple-bookmarks-itemflags-dependency
export class ItemflagManager {

    /**
     * Occures when the flag for a single entry is changed
     */
    public readonly EntryFlagEventChannel = new Observable<EntryFlagEventData, this>(null, this);

    /**
     * Occurs when one or more flags of entries in a container are changed
     */
    public readonly ContainerFlagsEventChannel = new Observable<MediaContainer<MediaChild>, this>(null, this);

    private items = new Map<string, ItemFlag[]>();
    constructor(private readonly storage: StorageController) {}

    public async LoadContainerFlags(media: MediaContainer<MediaChild>) {
        if(media.Parent) {
            const mediaflags = await this.storage.LoadPersistent<ItemFlag[]>(Store.Itemflags, this.StorageKey(media));
            this.items.set(this.StorageKey(media), mediaflags);
            this.ContainerFlagsEventChannel.Value = media;
        }
    }

    private async SaveContainerFlags(container: MediaContainer<MediaChild>, flags: ItemFlag[]) {
        await this.storage.SavePersistent<ItemFlag[]>(flags, Store.Itemflags, this.StorageKey(container));
    }

    /* Key to store flags by plugin-media */
    private StorageKey(item: MediaContainer<MediaChild>): string {
        return `${item.Parent.Identifier} :: ${item.Identifier}`;
    }

    private Hash(text: string): string {
        return text.split('').reduce((hash, c) => 31 * hash + c.charCodeAt(0) | 0, 0).toString(36);
    }

    private IsContainerSameItem(flag: ItemFlag, container: MediaContainer<MediaChild>): boolean {
        const doesIdentifierMatch = flag.IdentifierHash === this.Hash(container.Identifier);
        const doesTitleMatch = flag.TitleHash === this.Hash(container.Title);
        return doesIdentifierMatch || doesTitleMatch;
    }

    /* Retrieves the flags of a media */
    public async GetContainerItemsFlags(container: MediaContainer<MediaChild>) {
        const storagekey = this.StorageKey(container);
        if (!this.items.has(storagekey)) await this.LoadContainerFlags(container);
        return this.items.get(storagekey);
    }

    /* Add a flag of an item */
    public async FlagItem(entry: MediaContainer<MediaChild>, kind: FlagType) {
        const newflag: ItemFlag = {
            IdentifierHash: this.Hash(entry.Identifier),
            TitleHash: this.Hash(entry.Title),
            kind: kind,
        };
        let flags: ItemFlag[] = [];
        if (kind === FlagType.Current) {
            // Ignore all previous flags and add flag viewed on all items after entry
            // TODO: Manage flags context per language in case of multiple current flag (1 per language)
            const items = entry.Parent?.Entries.Value;
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
        this.items.set(this.StorageKey(entry.Parent), flags);
        await this.SaveContainerFlags(entry.Parent, flags);
        this.EntryFlagEventChannel.Value = {
            Entry: entry,
            Kind: kind,
        };
        this.ContainerFlagsEventChannel.Value = entry.Parent;
    }

    /* Remove the flag of an item */
    public async UnflagItem(itemToRemove: MediaContainer<MediaChild>) {
        let flags = await this.GetContainerItemsFlags(itemToRemove.Parent);
        if (!flags) return;
        flags = flags.filter(flag => {
            return ! this.IsContainerSameItem(flag, itemToRemove);
        });
        this.items.set(this.StorageKey(itemToRemove.Parent), flags);
        await this.SaveContainerFlags(itemToRemove.Parent, flags);
        this.EntryFlagEventChannel.Value = {
            Entry: itemToRemove,
            Kind: undefined,
        };
        this.ContainerFlagsEventChannel.Value = itemToRemove.Parent;
    }

    /* Get the flagType of an item */
    public async GetItemFlagType(item: MediaContainer<MediaChild>) {
        const marks = await this.GetContainerItemsFlags(item.Parent);
        if (!marks) return undefined;
        const mark = marks.find(mark => {
            return this.IsContainerSameItem(mark, item);
        });
        return mark?.kind;
    }

    public async GetUnFlaggedItems(media: MediaContainer<MediaContainer<MediaChild>>) {
        const marks = await this.GetContainerItemsFlags(media);
        return media.Entries.Value.filter(item => {
            const mark = marks?.find(mark => {
                return this.IsContainerSameItem(mark, item);
            });
            return mark === undefined;
        });
    }
}