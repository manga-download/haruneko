import { MediaContainer, MediaItem, MediaScraper } from './MediaPlugin';

export abstract class AnimeScraper extends MediaScraper {

    public CreatePlugin(): AnimePlugin {
        return new AnimePlugin(this);
    }

    public abstract FetchAnimes(provider: AnimePlugin): Promise<Anime[]>;
    public abstract FetchEpisodes(anime: Anime): Promise<Episode[]>;
    public abstract FetchVideos(episode: Episode): Promise<Video[]>;
}

export class AnimePlugin extends MediaContainer<Anime> {

    private readonly _scraper: AnimeScraper;

    public constructor(scraper: AnimeScraper) {
        super(scraper.Identifier, scraper.Title);
        this._scraper = scraper;
    }

    public async Initialize(): Promise<void> {
        // try load anime items from file ...
        this._entries = [];
        super.Initialize();
    }

    public async Update(): Promise<void> {
        this._entries = await this._scraper.FetchAnimes(this);
    }
}

export class Anime extends MediaContainer<Episode> {

    private readonly _scraper: AnimeScraper;

    constructor(scraper: AnimeScraper, parent: MediaContainer<Anime>, identifier: string, title: string) {
        super(identifier, title, parent);
        this._scraper = scraper;
    }

    public async Update(): Promise<void> {
        this._entries = await this._scraper.FetchEpisodes(this);
    }
}

export class Episode extends MediaContainer<Video> {

    private readonly _scraper: AnimeScraper;

    constructor(scraper: AnimeScraper, parent: MediaContainer<Episode>, identifier: string, title: string) {
        super(identifier, title, parent);
        this._scraper = scraper;
    }

    public async Update(): Promise<void> {
        this._entries = await this._scraper.FetchVideos(this);
    }
}

export class Video extends MediaItem {

    private readonly _scraper: AnimeScraper;
    private _controller?: AbortController;
    private _request: RequestInit;
    private _url: string;

    public constructor(scraper: AnimeScraper, parent: MediaContainer<Video>, url: string, request: RequestInit) {
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