import type { PluginController } from '../PluginController';
import { type IMediaChild, type IMediaContainer, MediaContainer } from './MediaPlugin';
import type { StorageController } from '../StorageController';
import { Event } from '../../engine/EventManager';
import type { IMediaInfoTracker } from './IMediaInfoTracker';

const storageID = 'bookmarks';

export class BookmarkPlugin extends MediaContainer<Bookmark> {

    public readonly EntriesUpdated: Event<typeof this, Bookmark[]> = new Event<typeof this, Bookmark[]>();

    constructor(private readonly storage: StorageController, private readonly plugins: PluginController) {
        super(null, null);
        this.Load();
    }

    private OnTrackerChangedCallback(): void {
        this.EntriesUpdated.Dispatch(this, this.Entries);
        this.Save();
    }

    private Deserialize(serialized: BookmarkSerialized): Bookmark {
        const parent = this.plugins.WebsitePlugins.find(plugin => plugin.Identifier === serialized.Media.ProviderID);
        const tracker = this.plugins.InfoTrackers.find(tracker => tracker.Identifier === serialized.Info.ProviderID);
        const bookmark = new Bookmark(new Date(serialized.Timestamp), parent, serialized.Media.EntryID, serialized.Title, tracker, serialized.Info.EntryID);
        bookmark.TrackerChanged.Subscribe(this.OnTrackerChangedCallback.bind(this));
        return bookmark;
    }

    private async Load() {
        const bookmarks = await this.storage.LoadPersistent<BookmarkSerialized[]>(storageID);
        this._entries = bookmarks.map(bookmark => this.Deserialize(bookmark));
        this.EntriesUpdated.Dispatch(this, this.Entries);
    }

    private Serialize(bookmark: Bookmark): BookmarkSerialized {
        return {
            Timestamp: bookmark.Created.getTime(),
            Title: bookmark.Title,
            Media: {
                ProviderID: bookmark.Parent.Identifier,
                EntryID: bookmark.Identifier
            },
            Info: {
                ProviderID: bookmark.Tracker?.Identifier,
                EntryID: bookmark.InfoID
            }
        };
    }

    private async Save(): Promise<void> {
        const bookmarks = this._entries.map(bookmark => this.Serialize(bookmark));
        await this.storage.SavePersistent<BookmarkSerialized[]>(storageID, bookmarks);
    }

    public async Add(entry: IMediaContainer) {
        // TODO: prevent adding duplicates ...
        const bookmark = new Bookmark(new Date(), entry.Parent, entry.Identifier, entry.Title);
        bookmark.TrackerChanged.Subscribe(this.OnTrackerChangedCallback.bind(this));
        this._entries.unshift(bookmark);
        // TODO: Sort bookmarks, or is this a frontend job?
        this.EntriesUpdated.Dispatch(this, this.Entries);
        await this.Save();
    }

    public async Remove(bookmark: Bookmark) {
        this._entries = this._entries.filter(entry => entry !== bookmark);
        this.EntriesUpdated.Dispatch(this, this.Entries);
        await this.Save();
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
}

export class Bookmark extends MediaContainer<IMediaChild> {

    public readonly TrackerChanged: Event<typeof this, IMediaInfoTracker> = new Event<typeof this, IMediaInfoTracker>();

    constructor(
        public readonly Created: Date,
        parent: IMediaContainer,
        MediaID: string,
        title: string,
        private tracker?: IMediaInfoTracker,
        private infoID?: string
    ) {
        super(MediaID, title, parent);
    }

    public get Tracker(): IMediaInfoTracker {
        return this.tracker;
    }

    public get InfoID(): string {
        return this.infoID;
    }

    public async Update(): Promise<void> {
        const entry = this.Parent.CreateEntry(this.Identifier, this.Title) as IMediaContainer;
        await entry.Update();
        this._entries = entry.Entries;
    }

    public LinkTracker(tracker: IMediaInfoTracker, infoID: string) {
        this.tracker = tracker;
        this.infoID = infoID;
        this.TrackerChanged.Dispatch(this, tracker);
    }
}

type BookmarkSerialized = {
    Timestamp: number,
    Title: string,
    Media: Provider,
    Info: Provider
};

type Provider = {
    ProviderID: string,
    EntryID: string
}