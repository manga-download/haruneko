import { MediaContainer, MediaItem, MediaScraper } from './MediaPlugin';

export abstract class MangaScraper extends MediaScraper {

    public CreatePlugin(): MangaPlugin {
        return new MangaPlugin(this);
    }

    public abstract FetchMangas(provider: MangaPlugin): Promise<Manga[]>;
    public abstract FetchChapters(manga: Manga): Promise<Chapter[]>;
    public abstract FetchPages(chapter: Chapter): Promise<Page[]>;
}

export class MangaPlugin extends MediaContainer<Manga> {

    private readonly _scraper: MangaScraper;

    public constructor(scraper: MangaScraper) {
        super(scraper.Identifier, scraper.Title);
        this._scraper = scraper;
    }

    private get EntriesKey() {
        return `mangas.${this.Identifier}`;
    }

    public get Entries(): Manga[] {
        if(this._entries.length === 0) {
            // TODO: load entries from cache ...
            const content = localStorage.getItem(this.EntriesKey) || '[]';
            // May instead use: https://developer.chrome.com/docs/extensions/reference/storage/
            //                  chrome.storage.local.get(this.EntriesKey, data => data[this.EntriesKey]);
            const mangas = JSON.parse(content) as { id: string, title: string }[];
            this._entries = mangas.map(manga => new Manga(this._scraper, this, manga.id, manga.title));
        }
        return this._entries;
    }

    public async Initialize(): Promise<void> {
        await this._scraper.Initialize();
        return super.Initialize();
    }

    public async Update(): Promise<void> {
        await this.Initialize();
        this._entries = await this._scraper.FetchMangas(this);
        // TODO: store entries in cache ...
        const mangas = this._entries.map(entry => {
            return {
                id: entry.Identifier,
                title: entry.Title
            };
        });
        // May instead use: https://developer.chrome.com/docs/extensions/reference/storage/
        //                  chrome.storage.local.set({ this.EntriesKey: mangas }, () => {});
        const content = JSON.stringify(mangas);
        localStorage.setItem(this.EntriesKey, content);
    }
}

export class Manga extends MediaContainer<Chapter> {

    private readonly _scraper: MangaScraper;

    constructor(scraper: MangaScraper, parent: MediaContainer<Manga>, identifier: string, title: string) {
        super(identifier, title, parent);
        this._scraper = scraper;
    }

    public async Update(): Promise<void> {
        await this.Initialize();
        this._entries = await this._scraper.FetchChapters(this);
    }
}

export class Chapter extends MediaContainer<Page> {

    private readonly _scraper: MangaScraper;

    constructor(scraper: MangaScraper, parent: MediaContainer<Chapter>, identifier: string, title: string) {
        super(identifier, title, parent);
        this._scraper = scraper;
    }

    public async Update(): Promise<void> {
        await this.Initialize();
        this._entries = await this._scraper.FetchPages(this);
    }
}

export class Page extends MediaItem {

    private readonly _scraper: MangaScraper;
    private _controller?: AbortController;
    private _request?: RequestInit;
    private _uri: URL;

    public constructor(scraper: MangaScraper, parent: MediaContainer<Page>, uri: URL, request?: RequestInit) {
        super(parent);
        this._scraper = scraper;
        this._request = request;
        this._uri = uri;
    }

    public get SourceURL(): string {
        return this._uri.href;
    }

    public async Download(/*IStorageStream out // file: string*/): Promise<void> {
        if(this._controller) {
            return;
        }
        this._controller = new AbortController();
        const request = new Request(this.SourceURL, {
            ...this._request,
            signal: this._controller.signal
        });
        const response = await fetch(request);
        if(this._controller.signal.aborted) {
            return;
        }
        // stream repsonse.body to file ...
    }

    public async Abort(): Promise<void> {
        if(this._controller) {
            this._controller.abort();
        }
    }
}