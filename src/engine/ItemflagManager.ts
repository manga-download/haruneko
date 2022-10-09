import type { IMediaContainer } from './providers/MediaPlugin';
import { type StorageController, Store } from './StorageController';
import { Event } from './Event';

export class ItemflagManager {

    public readonly FlagChanged: Event<IMediaContainer, FlagType> = new Event<IMediaContainer, FlagType>();
    public readonly MediaFlagsChanged: Event<ItemflagManager, IMediaContainer> = new Event<this, IMediaContainer>();

    private items:Map<string,ItemFlag[]> = new Map();
    constructor(private readonly storage: StorageController) {
    }

    public async LoadContainerFlags(media: IMediaContainer) {
        const mediaflags = await this.storage.LoadPersistent<ItemFlag[]>(Store.Itemflags,this.StorageKey(media));
        this.items.set(this.StorageKey(media), mediaflags);
        this.MediaFlagsChanged.Dispatch(this, media);
    }

    private async SaveContainerFlags(container: IMediaContainer, flags: ItemFlag[]) {
        await this.storage.SavePersistent<ItemFlag[]>(flags, Store.Itemflags, this.StorageKey(container));
    }

    /* Key to store flags by plugin-media */
    private StorageKey(item: IMediaContainer): string {
        return `${item.Parent.Identifier} :: ${item.Identifier}`;
    }

    private Hash(text: string): string {
        return text.split('').reduce((hash, c) => 31 * hash + c.charCodeAt(0) | 0, 0).toString(36);
    }

    private isContainerSameItem(flag: ItemFlag, container: IMediaContainer): boolean {
        const doesIdentifierMatch = flag.IdentifierHash === this.Hash(container.Identifier);
        const doesTitleMatch = flag.TitleHash === this.Hash(container.Title);
        return doesIdentifierMatch || doesTitleMatch;
    }

    /* Retrieves the flags of a media */
    public async GetContainerItemsFlags(container: IMediaContainer): Promise<ItemFlag[]> {
        const storagekey = this.StorageKey(container);
        if (!this.items.has(storagekey)) await this.LoadContainerFlags(container);
        return this.items.get(storagekey);
    }

    /* Add a flag of an item */
    public async FlagItem(entry: IMediaContainer, kind: FlagType) {
        const newflag: ItemFlag = {
            IdentifierHash: this.Hash(entry.Identifier),
            TitleHash: this.Hash(entry.Title),
            kind: kind,
        };
        let flags: ItemFlag[] = [];
        if (kind === FlagType.Current) {
            // Ignore all previous flags and add flag viewed on all items after entry
            // TODO: Manage flags context per language in case of multiple current flag (1 per language)
            const items = entry.Parent?.Entries as IMediaContainer[];
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
        this.FlagChanged.Dispatch(entry, kind);
        this.MediaFlagsChanged.Dispatch(this, entry.Parent);
    }

    /* Remove the flag of an item */
    public async UnflagItem(itemToRemove: IMediaContainer) {
        let flags = await this.GetContainerItemsFlags(itemToRemove.Parent);
        if (!flags) return;
        flags = flags.filter(flag => {
            return ! this.isContainerSameItem(flag, itemToRemove);
        });
        this.items.set(this.StorageKey(itemToRemove.Parent), flags);
        await this.SaveContainerFlags(itemToRemove.Parent, flags);
        this.FlagChanged.Dispatch(itemToRemove, undefined);
        this.MediaFlagsChanged.Dispatch(this, itemToRemove.Parent);
    }

    /* Get the flagType of an item */
    public async GetItemFlagType(item: IMediaContainer): Promise<FlagType>{
        const marks = await this.GetContainerItemsFlags(item.Parent);
        if (!marks) return undefined;
        const mark = marks.find(mark => {
            return this.isContainerSameItem(mark, item);
        });
        return mark?.kind;
    }

    public async GetUnFlaggedItems(media: IMediaContainer): Promise<IMediaContainer[]> {
        const marks = await this.GetContainerItemsFlags(media);
        return media.Entries.filter((item:IMediaContainer) => {
            const mark = marks?.find(mark => {
                return this.isContainerSameItem(mark, item);
            });
            return mark === undefined;
        }) as IMediaContainer[];
    }
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