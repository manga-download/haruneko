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

    public constructor(private readonly scraper: AnimeScraper) {
        super(scraper.Identifier, scraper.Title);
    }

    private get EntriesKey() {
        return `animes.${this.Identifier}`;
    }

    public async Initialize(): Promise<void> {
        await this.scraper.Initialize();
        return super.Initialize();
    }

    public CreateEntry(identifier: string, title: string): Anime {
        return new Anime(this.scraper, this, identifier, title);
    }

    public async TryGetEntry(url: string): Promise<Anime> {
        await this.Initialize();
        return this.scraper.FetchAnime(this, url);
    }

    protected async PerformUpdate(): Promise<Anime[]> {
        const entries = await this.scraper.FetchAnimes(this);
        /*
        const animes = entries.map(entry => {
            return { id: entry.Identifier, title: entry.Title };
        });
        await this.storageController.SavePersistent(animes, Store.MediaLists, this.Identifier);
        */
        return entries;
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

    public PerformUpdate(): Promise<Episode[]> {
        return this._scraper.FetchEpisodes(this);
    }
}

export class Episode extends MediaContainer<Video> {

    constructor(private readonly scraper: AnimeScraper, parent: MediaContainer<Episode>, identifier: string, title: string) {
        super(identifier, title, parent);
    }

    public PerformUpdate(): Promise<Video[]> {
        return this.scraper.FetchVideos(this);
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