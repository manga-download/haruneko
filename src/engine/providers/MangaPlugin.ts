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

    public async Initialize(): Promise<void> {
        await this._scraper.Initialize();
        // try load manga items from file ...
        this._entries = [];
        super.Initialize();
    }

    public async Update(): Promise<void> {
        this._entries = await this._scraper.FetchMangas(this);
    }
}

export class Manga extends MediaContainer<Chapter> {

    private readonly _scraper: MangaScraper;

    constructor(scraper: MangaScraper, parent: MediaContainer<Manga>, identifier: string, title: string) {
        super(identifier, title, parent);
        this._scraper = scraper;
    }

    public async Update(): Promise<void> {
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
        this._entries = await this._scraper.FetchPages(this);
    }
}

export class Page extends MediaItem {

    private readonly _scraper: MangaScraper;
    private _controller?: AbortController;
    private _request?: RequestInit;
    private _url: string;

    public constructor(scraper: MangaScraper, parent: MediaContainer<Page>, url: string, request?: RequestInit) {
        super(parent);
        this._scraper = scraper;
        this._request = request;
        this._url = url;
    }

    public get SourceURL(): string {
        return this._url;
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