import type { PluginController } from '../PluginController';
import { MediaContainer, type MediaChild } from './MediaPlugin';
import { type StorageController, Store } from '../StorageController';
import type { InteractiveFileContentProvider } from '../InteractiveFileContentProvider';
import { Event } from '../Event';
import { ConvertToSerializedBookmark } from '../transformers/BookmarkConverter';
import { Bookmark, MissingWebsite, type BookmarkSerialized } from './Bookmark';
import { MissingInfoTracker } from '../trackers/IMediaInfoTracker';
import { Priority, TaskPool } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';

export type BookmarkImportResult = {
    cancelled: boolean;
    found: number;
    imported: number;
    skipped: number;
    broken: number;
}

export type BookmarkExportResult = {
    cancelled: boolean;
    exported: number;
}

const defaultBookmarkFileType: FilePickerAcceptType = {
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
        const tracker = this.plugins.InfoTrackers.find(tracker => tracker.Identifier === serialized.Info.ProviderID) ?? new MissingInfoTracker(serialized.Info.ProviderID);
        const bookmark = new Bookmark(
            new Date(serialized.Created),
            new Date(serialized.Updated),
            parent,
            serialized.Media.EntryID,
            serialized.Title,
            tracker,
            serialized.Info?.EntryID
        );
        bookmark.Changed.Subscribe(this.OnBookmarkChangedCallback.bind(this));
        return bookmark;
    }

    private async Load() {
        const bookmarks = await this.storage.LoadPersistent<BookmarkSerialized[]>(Store.Bookmarks);
        this._entries = bookmarks.map(bookmark => this.Deserialize(bookmark));
        this.EntriesUpdated.Dispatch(this, this.Entries);
    }

    public async Import(): Promise<BookmarkImportResult> {
        let data: Blob;
        const result: BookmarkImportResult = {
            cancelled: false,
            found: 0,
            imported: 0,
            skipped: 0,
            broken: 0,
        };
        try {
            data = await this.fileIO.LoadFile({
                types: [ defaultBookmarkFileType ]
            });
        } catch(error) {
            if(this.fileIO.IsAbortError(error)) {
                result.cancelled = true;
                return result;
            } else {
                throw error;
            }
        }
        const found = (JSON.parse(await data.text()) as Array<unknown>).map(entry => this.Deserialize(ConvertToSerializedBookmark(entry)));
        result.found = found.length;
        const imported = found.filter(bookmark => !this.Entries.some(entry => entry.IsSameAs(bookmark)));
        for(const bookmark of imported) {
            await this.storage.SavePersistent<BookmarkSerialized>(this.Serialize(bookmark), Store.Bookmarks, bookmark.StorageKey);
        }
        await this.Load();
        result.imported = imported.length;
        result.skipped = found.length - imported.length;
        result.broken = imported.filter(entry => entry.Parent instanceof MissingWebsite).length;
        return result;
    }

    public async Export(): Promise<BookmarkExportResult> {
        const bookmarks = this._entries.map(bookmark => this.Serialize(bookmark));
        const result: BookmarkExportResult = {
            cancelled: false,
            exported: 0
        };
        const data = new Blob([ JSON.stringify(bookmarks, null, 2) ], { type: 'application/json' });
        const today = new Date(Date.now() - 60000 * new Date().getTimezoneOffset()).toISOString().split('T').shift();
        try {
            await this.fileIO.SaveFile(data, {
                suggestedName: `HakuNeko (${today}).bookmarks`,
                types: [ defaultBookmarkFileType ]
            });
            result.exported = bookmarks.length;
            return result;
        } catch(error) {
            if(this.fileIO.IsAbortError(error)) {
                result.cancelled = true;
                return result;
            } else {
                throw error;
            }
        }
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
            }
        };
    }

    public async Add(entry: MediaContainer<MediaContainer<MediaChild>>) {
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

    public async Toggle(entry: MediaContainer<MediaContainer<MediaChild>>): Promise<boolean> {
        const bookmark = this.Find(entry);
        if (bookmark) { await this.Remove(bookmark); return false; }
        else { await this.Add(entry); return true;}
    }

    public Find(entry: MediaContainer<MediaChild>): Bookmark {
        return this.Entries.find(bookmark => bookmark.Identifier === entry.Identifier && bookmark.Parent.Identifier === entry.Parent.Identifier);
    }

    public isBookmarked(entry: MediaContainer<MediaChild>): boolean {
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

    /**
     * Update each entry in {@link Entries}.
     * Depending on the number of {@link Entries} this may take some time.
     * Multiple invocations have no effect, only one execution is allowed at a time.
     */
    public UpdateEntries(): Promise<Bookmark>[] {
        const thisUpdateEntries = this.UpdateEntries;
        const taskpool: TaskPool = new TaskPool(4, new RateLimit(4, 1));
        const promises = this._entries.map(entry => taskpool.Add(async () => {
            await entry.Update();
            return entry;
        }, Priority.Low));
        Promise.allSettled(promises).finally(() => this.UpdateEntries = thisUpdateEntries);
        this.UpdateEntries = () => promises;
        return promises;
    }
}