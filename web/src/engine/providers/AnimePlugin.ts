import { MediaContainer, MediaItem, MediaScraper } from './MediaPlugin';

export abstract class AnimeScraper extends MediaScraper<AnimePlugin> {

    public CreatePlugin(): AnimePlugin {
        return new AnimePlugin(this);
    }

    public abstract FetchAnime(provider: AnimePlugin, url: string): Promise<Anime>;
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

    private get EntriesKey() {
        return `animes.${this.Identifier}`;
    }

    public get Entries(): Anime[] {
        if(this._entries.length === 0) {
            // TODO: load entries from cache ...
            const content = localStorage.getItem(this.EntriesKey) || '[]';
            // May instead use: https://developer.chrome.com/docs/extensions/reference/storage/
            //                  chrome.storage.local.get(this.EntriesKey, data => data[this.EntriesKey]);
            const animes = JSON.parse(content) as { id: string, title: string }[];
            this._entries = animes.map(anime => this.CreateEntry(anime.id, anime.title));
        }
        return this._entries;
    }

    public async Initialize(): Promise<void> {
        await this._scraper.Initialize();
        return super.Initialize();
    }

    public CreateEntry(identifier: string, title: string): Anime {
        return new Anime(this._scraper, this, identifier, title);
    }

    public async TryGetEntry(url: string): Promise<Anime> {
        await this.Initialize();
        return this._scraper.FetchAnime(this, url);
    }

    public async Update(): Promise<void> {
        await this.Initialize();
        this._entries = await this._scraper.FetchAnimes(this);
        // TODO: store entries in cache ...
        const animes = this._entries.map(entry => {
            return {
                id: entry.Identifier,
                title: entry.Title
            };
        });
        // May instead use: https://developer.chrome.com/docs/extensions/reference/storage/
        //                  chrome.storage.local.set({ this.EntriesKey: animes }, () => {});
        const content = JSON.stringify(animes);
        localStorage.setItem(this.EntriesKey, content);
    }
}

export class Anime extends MediaContainer<Episode> {

    private readonly _scraper: AnimeScraper;

    constructor(scraper: AnimeScraper, parent: MediaContainer<Anime>, identifier: string, title: string) {
        super(identifier, title, parent);
        this._scraper = scraper;
    }

    public CreateEntry(identifier: string, title: string): Episode {
        return new Episode(this._scraper, this, identifier, title);
    }

    public async Update(): Promise<void> {
        await this.Initialize();
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
        await this.Initialize();
        this._entries = await this._scraper.FetchVideos(this);
    }
}

export class Video extends MediaItem {

    private _controller?: AbortController;

    public constructor(/*private readonly scraper: AnimeScraper, */parent: MediaContainer<Video>, private readonly uri: URL/*, private readonly request: RequestInit*/) {
        super(parent);
    }

    public get SourceURL(): string {
        return this.uri.href;
    }

    public async Fetch(/*IStorageStream out // file: string priority: Priority*/): Promise<Blob> {
        if(this._controller) {
            return;
        }
        this._controller = new AbortController();
        /*
        const request = new Request(this.SourceURL, {
            ...this._request,
            signal: this._controller.signal
        });
        const response = await fetch(request);
        */
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