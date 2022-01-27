import type { PluginController } from '../PluginController';
import { type IMediaChild, type IMediaContainer, MediaContainer } from './MediaPlugin';
import type { StorageController } from '../StorageController';

const uid = 'engine.bookmarks';

export class BookmarkPlugin extends MediaContainer<Bookmark> {

    private readonly storage: StorageController;
    private readonly plugins: PluginController;

    constructor(storage: StorageController, plugins: PluginController) {
        super(null, null);
        this.storage = storage;
        this.plugins = plugins;
    }

    private Deserialize(bookmark: SerializedBookmark): Bookmark {
        const parent = this.plugins.WebsitePlugins.find(plugin => plugin.Identifier === bookmark.PluginID);
        return new Bookmark(parent, bookmark.MediaID, bookmark.Title);
    }

    private async Load() {
        const bookmarks = await this.storage.LoadPersistent<SerializedBookmark[]>(uid);
        this._entries = bookmarks.map(bookmark => this.Deserialize(bookmark));
    }

    private Serialize(bookmark: IMediaContainer): SerializedBookmark {
        return {
            PluginID: bookmark.Parent.Identifier,
            MediaID: bookmark.Identifier,
            Title: bookmark.Title
        };
    }

    private async Save(): Promise<void> {
        const bookmarks = this._entries.map(bookmark => this.Serialize(bookmark));
        await this.storage.SavePersistent<SerializedBookmark[]>(uid, bookmarks);
    }

    public async Add(entry: IMediaContainer) {
        const bookmark = new Bookmark(entry.Parent, entry.Identifier, entry.Title);
        this._entries.push(bookmark);
        // TODO: Sort bookmarks, or is this a frontend job?
        // TODO: Dispatch event?
        await this.Save();
    }

    public async Remove(bookmark: Bookmark) {
        this._entries = this._entries.filter(entry => entry !== bookmark);
        // TODO: Dispatch event?
        await this.Save();
    }

    public override async Initialize(): Promise<void> {
        await super.Initialize();
        await this.Load();
        // TODO: Dispatch event?
    }

    public async Update(): Promise<void> {
        await this.Load();
        // TODO: Dispatch event?
    }
}

export class Bookmark extends MediaContainer<IMediaChild> {

    constructor(parent: IMediaContainer, identifier: string, title: string) {
        super(identifier, title, parent);
    }

    public async Update(): Promise<void> {
        const entry = this.Parent.CreateEntry(this.Identifier, this.Title) as IMediaContainer;
        await entry.Update();
        this._entries = entry.Entries;
    }
}

type SerializedBookmark = {
    PluginID: string;
    MediaID: string;
    Title: string;
};