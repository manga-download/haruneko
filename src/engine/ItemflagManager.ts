import type { IMediaContainer } from './providers/MediaPlugin';
import { type StorageController, Store } from './StorageController';

export class ItemflagManager {

    private readonly Items:Map<string,ItemFlag[]>=new Map();
    constructor(private readonly storage: StorageController) {
        this.Load();
    }

    private async Load() {
        const mediaflags = await this.storage.LoadPersistent<ItemflagSerialized[]>(Store.Itemflags);
        mediaflags.forEach(itemflag => {
            this.Items.set(`${itemflag.Media.ProviderID} :: ${itemflag.Media.EntryID}`,itemflag.Flags);
        });
    }

    private Serialize(media: IMediaContainer, flags: ItemFlag[]): ItemflagSerialized {
        return {
            Media: {
                ProviderID: media.Parent.Parent.Identifier,
                EntryID: media.Parent.Identifier
            },
            Flags: flags,
        };
    }

    /* Retrieves the flags of a media */
    public Find(entry: IMediaContainer): ItemFlag[] {
        return this.Items.get(this.StorageKey(entry));
    }

    /* Add a flag of an item */
    public async Add(entry: IMediaContainer, kind: FlagType): Promise<ItemFlag[]> {
        const newflag: ItemFlag = {
            IdentifierHash: this.Hash(entry.Identifier),
            TitleHash: this.Hash(entry.Title),
            kind: kind,
        };
        const flags = this.Find(entry.Parent) ?? [];
        flags.push(newflag);
        const key = this.StorageKey(entry.Parent);
        this.Items.set(key,flags);
        await this.storage.SavePersistent<ItemflagSerialized>(this.Serialize(entry, flags), Store.Itemflags, key);
        return flags;
    }

    /* Remove the flag of an item */
    public async Remove(entryToRemove: IMediaContainer): Promise<ItemFlag[]> {
        let flags = this.Find(entryToRemove.Parent);
        if (!flags) return;
        flags = flags.filter(entry => {
            const doesIdentifierMatch = entry.IdentifierHash === this.Hash(entryToRemove.Identifier);
            const doesTitleMatch = entry.TitleHash === this.Hash(entryToRemove.Title);
            return !doesIdentifierMatch && !doesTitleMatch;

        });
        const key = this.StorageKey(entryToRemove.Parent);
        this.Items.set(key,flags);
        await this.storage.SavePersistent<ItemflagSerialized>(this.Serialize(entryToRemove, flags), Store.Itemflags, key);
        return flags;
    }

    /* Key to store flags by plugin-media */
    private StorageKey(item: IMediaContainer): string {
        return `${item.Parent.Identifier} :: ${item.Identifier}`;
    }

    public Hash(text: string): string {
        return text.split('').reduce((hash, c) => 31 * hash + c.charCodeAt(0) | 0, 0).toString(36);
    }

    /* Get the flag of an item */
    public getFlag(item: IMediaContainer, flags: ItemFlag[]): FlagType {
        flags = flags || this.Find(item.Parent);
        if (!flags) return undefined;
        const itemIdentifierHash = this.Hash(item.Identifier);
        const itemTitleHash = this.Hash(item.Title);
        const flag = flags.find(flag => {
            const doesIdentifierMatch = flag.IdentifierHash === itemIdentifierHash;
            const doesTitleMatch = flag.TitleHash === itemTitleHash;
            return doesIdentifierMatch || doesTitleMatch;
        });
        return flag ? flag.kind : undefined;
    }
}

type ItemflagSerialized = {
    Media: Provider,
    Flags : ItemFlag[],
}
type Provider = {
    ProviderID: string,
    EntryID: string
}
export type ItemFlag = {
    IdentifierHash: string,
    TitleHash: string,
    kind:FlagType,
}
export const enum FlagType {
    Current,
    Viewed,
}