import type { IMediaContainer } from './providers/MediaPlugin';
import { type StorageController, Store } from './StorageController';

export class ItemmarkManager {

    private readonly Items:Map<string,ItemMark[]>=new Map();
    constructor(private readonly storage: StorageController) {
        this.Load();
    }

    private async Load() {
        const mediamarks = await this.storage.LoadPersistent<ItemmarkSerialized[]>(Store.Itemmarks);
        mediamarks.forEach(itemmark => {
            this.Items.set(`${itemmark.Media.ProviderID} :: ${itemmark.Media.EntryID}`,itemmark.Marks);
        });
    }

    private Serialize(media: IMediaContainer, marks: ItemMark[]): ItemmarkSerialized {
        return {
            Media: {
                ProviderID: media.Parent.Parent.Identifier,
                EntryID: media.Parent.Identifier
            },
            Marks: marks,
        };
    }

    /* Retrieves the marks of a media */
    public Find(entry: IMediaContainer): ItemMark[] {
        return this.Items.get(this.StorageKey(entry));
    }

    /* Add a mark of an item */
    public async Add(entry: IMediaContainer, kind: MarkType): Promise<ItemMark[]> {
        const newmark: ItemMark = {
            IdentifierHash: this.Hash(entry.Identifier),
            TitleHash: this.Hash(entry.Title),
            kind: kind,
        };
        const marks = this.Find(entry.Parent) ?? [];
        marks.push(newmark);
        const key = this.StorageKey(entry.Parent);
        this.Items.set(key,marks);
        await this.storage.SavePersistent<ItemmarkSerialized>(this.Serialize(entry, marks), Store.Itemmarks, key);
        return marks;
    }

    /* Remove the mark of an item */
    public async Remove(entryToRemove: IMediaContainer): Promise<ItemMark[]> {
        let marks = this.Find(entryToRemove.Parent);
        if (!marks) return;
        marks = marks.filter(entry => {
            const doesIdentifierMatch = entry.IdentifierHash === this.Hash(entryToRemove.Identifier);
            const doesTitleMatch = entry.TitleHash === this.Hash(entryToRemove.Title);
            return !doesIdentifierMatch && !doesTitleMatch;

        });
        const key = this.StorageKey(entryToRemove.Parent);
        this.Items.set(key,marks);
        await this.storage.SavePersistent<ItemmarkSerialized>(this.Serialize(entryToRemove, marks), Store.Itemmarks, key);
        return marks;
    }

    /* Key to store marks by plugin-media */
    private StorageKey(item: IMediaContainer): string {
        return `${item.Parent.Identifier} :: ${item.Identifier}`;
    }

    public Hash(text: string): string {
        return text.split('').reduce((hash, c) => 31 * hash + c.charCodeAt(0) | 0, 0).toString(36);
    }

    /* Get the mark of an item */
    public getMark(item: IMediaContainer, marks: ItemMark[]): MarkType{
        marks = marks || this.Find(item.Parent);
        if (!marks) return MarkType.None;
        const itemIdentifierHash = this.Hash(item.Identifier);
        const itemTitleHash = this.Hash(item.Title);
        const mark = marks.find(mark => {
            const doesIdentifierMatch = mark.IdentifierHash === itemIdentifierHash;
            const doesTitleMatch = mark.TitleHash === itemTitleHash;
            return doesIdentifierMatch || doesTitleMatch;
        });
        return mark ? mark.kind : MarkType.None;
    }
}

type ItemmarkSerialized = {
    Media: Provider,
    Marks : ItemMark[],
}
type Provider = {
    ProviderID: string,
    EntryID: string
}
export type ItemMark = {
    IdentifierHash: string,
    TitleHash: string,
    kind:MarkType,
}
export const enum MarkType {
    None,
    Current,
    Viewed,
}