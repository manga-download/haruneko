import type { PluginController } from '../PluginController';
import { type IMediaChild, type IMediaContainer, MediaContainer } from './MediaPlugin';
import { type StorageController, Store } from '../StorageController';
import { Event } from '../Event';
import type { IMediaInfoTracker } from '../trackers/IMediaInfoTracker';

export class BookmarkPlugin extends MediaContainer<Bookmark> {

    public readonly EntriesUpdated: Event<typeof this, Bookmark[]> = new Event<typeof this, Bookmark[]>();

    constructor(private readonly storage: StorageController, private readonly plugins: PluginController) {
        super('bookmarks', 'Bookmarks');
        this.Load();
    }

    public get Entries(): Bookmark[] {
        return this._entries.sort((a, b) => a.Title.localeCompare(b.Title));
    }

    private OnBookmarkChangedCallback(sender: Bookmark): void {
        this.EntriesUpdated.Dispatch(this, this.Entries);
        this.storage.SavePersistent<BookmarkSerialized>(this.Serialize(sender), Store.Bookmarks, sender.StorageKey);
    }

    private Deserialize(serialized: BookmarkSerialized): Bookmark {
        const parent = this.plugins.WebsitePlugins.find(plugin => plugin.Identifier === serialized.Media.ProviderID) ?? this._createInvalidParent('[DELETED] ' + serialized.Media.ProviderID, serialized.Media.ProviderID);
        const tracker = this.plugins.InfoTrackers.find(tracker => tracker.Identifier === serialized.Info.ProviderID);
        const bookmark = new Bookmark(
            new Date(serialized.Created),
            new Date(serialized.Updated),
            parent,
            serialized.Media.EntryID,
            serialized.Title,
            serialized.LastKnownEntries,
            tracker,
            serialized.Info.EntryID
        );
        bookmark.Changed.Subscribe(this.OnBookmarkChangedCallback.bind(this));
        console.log('is orphaned : '+ this.isOrphaned(bookmark));
        return bookmark;
    }

    _createInvalidParent(name: string, identifier: string): IMediaContainer {
        const fakePlugin: IMediaContainer = {
            Identifier: identifier,
            Title: name,
            Entries: [],
            Settings: null,
            Icon: null,
            Tags: [],

            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            IsSameAs: (other: IMediaContainer) => { return false; },

            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            CreateEntry: (_: string, __: string) => { throw new Error(); },

            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            TryGetEntry: (_: string) => { throw new Error(); },

            Update: () => { throw new Error(); },

            [Symbol.iterator]: function* () { },

        };
        return fakePlugin;
    }

    public isOrphaned(bookmark: Bookmark) {
        return !this.plugins.WebsitePlugins.some(plugin => plugin.IsSameAs(bookmark.Parent));
    }

    private async Load() {
        const bookmarks = await this.storage.LoadPersistent<BookmarkSerialized[]>(Store.Bookmarks);
        this._entries = bookmarks.map(bookmark => this.Deserialize(bookmark)).filter(entry => entry);//remove invalid bookmark
        this.EntriesUpdated.Dispatch(this, this.Entries);
    }

    private Serialize(bookmark: Bookmark): BookmarkSerialized {
        return {
            Created: bookmark.Created.getTime(),
            Updated: bookmark.Updated.getTime(),
            Title: bookmark.Title,
            Media: {
                ProviderID: bookmark.Parent.Identifier,
                EntryID: bookmark.Identifier
            },
            Info: {
                ProviderID: bookmark.Tracker?.Identifier,
                EntryID: bookmark.InfoID
            },
            LastKnownEntries: bookmark.LastKnownEntries,
        };
    }

    public async Add(entry: IMediaContainer) {
        if(this.isBookmarked(entry)) {
            // TODO: Keep duplicate bookmark, or replace with new one?
            return;
        }
        const bookmark = new Bookmark(new Date(), new Date(), entry.Parent, entry.Identifier, entry.Title);
        bookmark.Changed.Subscribe(this.OnBookmarkChangedCallback.bind(this));
        this._entries.unshift(bookmark);
        this.EntriesUpdated.Dispatch(this, this.Entries);
        await this.storage.SavePersistent<BookmarkSerialized>(this.Serialize(bookmark), Store.Bookmarks, bookmark.StorageKey);
    }

    public async Remove(bookmark: Bookmark) {
        this._entries = this._entries.filter(entry => entry !== bookmark);
        this.EntriesUpdated.Dispatch(this, this.Entries);
        await this.storage.RemovePersistent(Store.Bookmarks, bookmark.StorageKey);
    }

    public async Toggle(entry: IMediaContainer): Promise<boolean> {
        const bookmark = this.Find(entry);
        if (bookmark) { await this.Remove(bookmark); return false; }
        else { await this.Add(entry); return true;}
    }

    public Find(entry: IMediaContainer): Bookmark {
        return this.Entries.find(bookmark => bookmark.Identifier === entry.Identifier && bookmark.Parent.Identifier === entry.Parent.Identifier);
    }

    public isBookmarked(entry: IMediaContainer): boolean {
        return this.Find(entry)!==undefined;
    }

    /*
    public override async Initialize(): Promise<void> {
        await super.Initialize();
        await this.Load();
    }
    */

    public async Update(): Promise<void> {
        await this.Load();
    }

    public async getEntriesWithUnflaggedContent(): Promise<Bookmark[]> {
        const results = await Promise.all(this.Entries.map(
            async (bookmark) => (await bookmark.getUnflaggedContent()).length > 0
        ));
        return this.Entries.filter((_, index) => results[index]);
    }
}

/**
 * A bookmark is more or less a proxy/facade for a media container.
 */
export class Bookmark extends MediaContainer<IMediaChild> {

    public readonly Changed: Event<typeof this, void> = new Event<typeof this, void>();

    constructor(
        public readonly Created: Date,
        public Updated: Date,
        parent: IMediaContainer,
        MediaID: string,
        title: string,
        public readonly LastKnownEntries?: EntryHashes,
        private tracker?: IMediaInfoTracker,
        private infoID?: string
    ) {
        super(MediaID, title, parent);
        this.LastKnownEntries = this.LastKnownEntries || {
            IdentifierHashes: [],
            TitleHashes: []
        };
    }

    private Hash(text: string): string {
        return text.split('').reduce((hash, c) => 31 * hash + c.charCodeAt(0) | 0, 0).toString(36);
    }

    public get StorageKey(): string {
        return `${this.Parent.Identifier} :: ${this.Identifier}`;
    }

    /**
     * Get the origin entry related to this bookmark from the shared parent.
     * If the origin entry does not yet exist, it will be created and added to the entries of the parent for future access.
     * NOTE: The parent may overwrite the added entry whenever its entries are updated (e.g. Update() call).
     */
    private get Origin(): IMediaContainer {
        let entry = (this.Parent.Entries as IMediaContainer[]).find(entry => entry.Identifier === this.Identifier);
        if(!entry) {
            entry = this.Parent.CreateEntry(this.Identifier, this.Title) as IMediaContainer;
            this.Parent.Entries.push(entry);
        }
        return entry;
    }

    /**
     * Directly pass-through the entries from the shared parent.
     */
    public override get Entries(): IMediaContainer[] {
        return this.Origin.Entries as IMediaContainer[];
    }

    public get Tracker(): IMediaInfoTracker {
        return this.tracker;
    }

    public get InfoID(): string {
        return this.infoID;
    }

    /**
     * Update the entries of the origin related to this bookmark.
     */
    public async Update(): Promise<void> {
        await this.Origin.Update();
    }

    /**
     * Memorize the current list of entries as list of last known entries,
     * so future requests with {@link GetNewEntries} will be based on these known entries.
     */
    public async ApplyEntriesAsKnownEntries(): Promise<void> {
        const entries = this.Entries;
        if(entries.length > 0) {
            this.Updated = new Date();
            this.LastKnownEntries.IdentifierHashes = entries.map(entry => this.Hash(entry.Identifier));
            this.LastKnownEntries.TitleHashes = entries.map(entry => this.Hash(entry.Title));
            this.Changed.Dispatch(this);
        } else {
            // TODO: No entries available, maybe website is broken or entries not yet updated?
        }
    }

    public LinkTracker(tracker: IMediaInfoTracker, infoID: string) {
        this.Updated = new Date();
        this.tracker = tracker;
        this.infoID = infoID;
        this.Changed.Dispatch(this);
    }

    /**
     * {@link Update} the current list of entries from the website and determine which entries are not yet in the list of last known entries.
     */
    public async GetNewEntries(): Promise<IMediaContainer[]> {
        await this.Update();
        return this.Entries.filter(entry => {
            const isIdentifierUnknown = !this.LastKnownEntries.IdentifierHashes.includes(this.Hash(entry.Identifier));
            const isTitleUnknown = !this.LastKnownEntries.TitleHashes.includes(this.Hash(entry.Title));
            return isIdentifierUnknown && isTitleUnknown;
        });
    }

    /**
     * determine which entries have unflagged items
     */
    public async getUnflaggedContent(): Promise<IMediaContainer[]> {
        return await HakuNeko.ItemflagManager.GetUnFlaggedItems(this);
    }
}

type BookmarkSerialized = {
    Created: number,
    Updated: number,
    Title: string,
    Media: Provider,
    Info: Provider,
    LastKnownEntries: EntryHashes,
};

type EntryHashes = {
    IdentifierHashes: string[],
    TitleHashes: string[]
}

type Provider = {
    ProviderID: string,
    EntryID: string
}