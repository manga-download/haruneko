import type { PluginController } from '../PluginController';
import { type IMediaContainer, MediaContainer } from './MediaPlugin';
import { type StorageController, Store } from '../StorageController';
import type { InteractiveFileContentProvider } from '../InteractiveFileContentProvider';
import { Event } from '../Event';
import { ConvertToSerializedBookmark } from '../transformers/BookmarkConverter';
import { Bookmark, MissingWebsite, type BookmarkSerialized } from './Bookmark';

const defaultBookmarkFileType = {
    description: 'HakuNeko Bookmarks',
    accept: {
        'application/json': [ '.bookmarks' ]
    }
};

export class BookmarkPlugin extends MediaContainer<Bookmark> {

    public readonly EntriesUpdated: Event<typeof this, Bookmark[]> = new Event<typeof this, Bookmark[]>();

    constructor(private readonly storage: StorageController, private readonly plugins: PluginController, private readonly fileIO: InteractiveFileContentProvider) {
        super('bookmarks', 'Bookmarks');
        this.Load();
    }

    public get Entries(): Bookmark[] {
        return this._entries.sort((self, other) => self.Title.localeCompare(other.Title));
    }

    private OnBookmarkChangedCallback(sender: Bookmark): void {
        this.EntriesUpdated.Dispatch(this, this.Entries);
        this.storage.SavePersistent<BookmarkSerialized>(this.Serialize(sender), Store.Bookmarks, sender.StorageKey);
    }

    private Deserialize(serialized: BookmarkSerialized): Bookmark {
        const parent = this.plugins.WebsitePlugins.find(plugin => plugin.Identifier === serialized.Media.ProviderID) ?? new MissingWebsite(serialized.Media.ProviderID);
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
        return bookmark;
    }

    private async Load() {
        const bookmarks = await this.storage.LoadPersistent<BookmarkSerialized[]>(Store.Bookmarks);
        this._entries = bookmarks.map(bookmark => this.Deserialize(bookmark));
        this.EntriesUpdated.Dispatch(this, this.Entries);
    }

    public async Import() {
        // TODO: Error Handling
        const data = await this.fileIO.LoadFile({
            types: [ defaultBookmarkFileType ]
        });
        if (!data.text) {
            return;
        }
        const bookmarks = (JSON.parse(await data.text()) as Array<unknown>)
            .map(entry => this.Deserialize(ConvertToSerializedBookmark(entry)))
            .filter(entry => !this.Entries.some(bookmark => bookmark.IsSameAs(entry)));
        for(const bookmark of bookmarks) {
            await this.storage.SavePersistent<BookmarkSerialized>(this.Serialize(bookmark), Store.Bookmarks, bookmark.StorageKey);
        }
        await this.Load();
    }

    public async Export() {
        // TODO: Error Handling
        const bookmarks = this._entries.map(bookmark => this.Serialize(bookmark));
        /*
        bookmarks.forEach(bookmark => {
            bookmark.LastKnownEntries.IdentifierHashes = [];
            bookmark.LastKnownEntries.TitleHashes = [];
        });
        */
        const data = new Blob([ JSON.stringify(bookmarks, null, 2) ], { type: 'application/json' });
        const today = new Date(Date.now() - 60000 * new Date().getTimezoneOffset()).toISOString().split('T').shift();
        await this.fileIO.SaveFile(data, {
            suggestedName: `HakuNeko (${today}).bookmarks`,
            types: [ defaultBookmarkFileType ]
        });
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
                ProviderID: bookmark.Tracker?.Identifier ?? null,
                EntryID: bookmark.InfoID ?? null
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
        return !!this.Find(entry);
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