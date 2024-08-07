import { EngineResourceKey as R } from '../../i18n/ILocale';
import { Key, Scope } from '../SettingsGlobal';
import type { Check, Choice, Directory, ISettings, SettingsManager } from '../SettingsManager';
import { SanitizeFileName, type StorageController, Store } from '../StorageController';
import { type Priority, TaskPool } from '../taskpool/TaskPool';
import { MediaContainer, StoreableMediaContainer, MediaItem, MediaScraper } from './MediaPlugin';
import icon from '../../img/manga.webp';
import { Exception, NotImplementedError } from '../Error';
import { CreateChapterExportRegistry } from '../exporters/MangaExporterRegistry';
import { Observable } from '../Observable';

const settingsKeyPrefix = 'plugin.';

/**
 * The abstract base class that any custom manga scraper must implement.
 * This should be used for any custom manga scraper implementation that is not going to utilize the decorator pattern.
 * Custom manga scrapers that are going to utilize decorators must extend the {@link DecoratableMangaScraper} instead.
 */
export abstract class MangaScraper extends MediaScraper<MangaPlugin> {

    protected readonly imageTaskPool = new TaskPool();

    public CreatePlugin(storageController: StorageController, settingsManager: SettingsManager): MangaPlugin {
        return new MangaPlugin(storageController, settingsManager, this);
    }

    public abstract ValidateMangaURL(url: string): boolean;
    public abstract FetchManga(provider: MangaPlugin, url: string): Promise<Manga>;
    public abstract FetchMangas(provider: MangaPlugin): Promise<Manga[]>;
    public abstract FetchChapters(manga: Manga): Promise<Chapter[]>;
    public abstract FetchPages(chapter: Chapter): Promise<Page[]>;
    public abstract FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob>;
}

/**
 * An empty implementation of the `MangaScraper` class.
 * Since decorators do not (yet) work well with the abstract classes, this base class can be used when applying the decorator pattern to customize manga scrapers.
 */
export class DecoratableMangaScraper extends MangaScraper {

    public ValidateMangaURL(_url: string): boolean {
        return false;
    }

    public FetchManga(_provider: MangaPlugin, _url: string): Promise<Manga> {
        throw new NotImplementedError();
    }

    public FetchMangas(_provider: MangaPlugin): Promise<Manga[]> {
        throw new NotImplementedError();
    }

    public FetchChapters(_manga: Manga): Promise<Chapter[]> {
        throw new NotImplementedError();
    }

    public FetchPages(_chapter: Chapter): Promise<Page[]> {
        throw new NotImplementedError();
    }

    public FetchImage(_page: Page, _priority: Priority, _signal: AbortSignal): Promise<Blob> {
        throw new NotImplementedError();
    }
}

export class MangaPlugin extends MediaContainer<Manga> {

    private readonly _settings: ISettings;

    public constructor(private readonly storageController: StorageController, private readonly settingsManager: SettingsManager, private readonly scraper: MangaScraper) {
        super(scraper.Identifier, scraper.Title);
        this._settings = this.settingsManager.OpenScope(settingsKeyPrefix + this.Identifier);
        this.Prepare();
    }

    private async Prepare() {
        this.tags.Value = this.scraper.Tags;
        this._settings.Initialize(...this.scraper.Settings);
        const mangas = await this.storageController.LoadPersistent<{ id: string, title: string }[]>(Store.MediaLists, this.Identifier) || [];
        this.entries.Value = mangas.map(manga => this.CreateEntry(manga.id, manga.title));
    }

    public override get Settings(): ISettings {
        return this._settings;
    }

    public override get Icon(): string {
        return this.scraper.Icon;
    }

    public get URI(): URL {
        return this.scraper.URI;
    }

    public async Initialize(): Promise<void> {
        await this.scraper.Initialize();
        return super.Initialize();
    }

    public override CreateEntry(identifier: string, title: string): Manga {
        return new Manga(this.scraper, this, identifier, title);
    }

    public override async TryGetEntry(url: string): Promise<Manga> {
        if(this.scraper.ValidateMangaURL(url)) {
            await this.Initialize();
            const manga = await this.scraper.FetchManga(this, url);
            return this.Entries.Value.find((entry) => entry.IsSameAs(manga)) ?? manga;
        }
    }

    protected async PerformUpdate(): Promise<Manga[]> {
        const entries = await this.scraper.FetchMangas(this);
        const mangas = entries.map(entry => {
            return { id: entry.Identifier, title: entry.Title };
        });
        await this.storageController.SavePersistent(mangas, Store.MediaLists, this.Identifier);
        return entries;
    }
}

export class Manga extends MediaContainer<Chapter> {

    constructor(private readonly scraper: MangaScraper, parent: MangaPlugin, identifier: string, title: string) {
        super(identifier, title, parent);
    }

    public override get Icon() {
        return icon;
    }

    public override CreateEntry(identifier: string, title: string): Chapter {
        return new Chapter(this.scraper, this, identifier, title);
    }

    protected PerformUpdate(): Promise<Chapter[]> {
        return this.scraper.FetchChapters(this);
    }
}

export class Chapter extends StoreableMediaContainer<Page> {

    private readonly isStored = new Observable<boolean, Chapter>(false);

    constructor(private readonly scraper: MangaScraper, parent: Manga, identifier: string, title: string) {
        super(identifier, title, parent);
    }

    protected PerformUpdate(): Promise<Page[]> {
        return this.scraper.FetchPages(this);
    }

    public get IsStored() {
        return this.isStored;
    }

    public async Store(resources: Map<number, string>): Promise<void> {
        // TODO: Inject settings manager and global scope identifier?
        const settings = HakuNeko.SettingsManager.OpenScope(Scope);
        let directory = settings.Get<Directory>(Key.MediaDirectory).Value;
        if(!directory) {
            throw new Exception(R.Settings_Global_MediaDirectory_UnsetError);
        }
        if(await directory.requestPermission() !== 'granted') {
            throw new Exception(R.Settings_Global_MediaDirectory_PermissionError);
        }
        if(settings.Get<Check>(Key.UseWebsiteSubDirectory).Value && this.Parent?.Parent) {
            const website = SanitizeFileName(this.Parent?.Parent?.Title);
            directory = await directory.getDirectoryHandle(website, { create: true });
        }
        if(this.Parent) {
            const manga = SanitizeFileName(this.Parent?.Title);
            directory = await directory.getDirectoryHandle(manga, { create: true });
        }

        // TODO: Find more appropriate way to inject the storage dependency
        const registry = CreateChapterExportRegistry(this.Parent?.Parent['storageController']);
        await registry[settings.Get<Choice>(Key.MangaExportFormat).Value].Export(resources, directory, this.Title);
    }
}

type Parameters = JSONObject & {
    readonly Referer?: string;
    //readonly [member: string]: JSONElement | ArrayBuffer;
}

export class Page extends MediaItem {

    public constructor(
        private readonly scraper: MangaScraper,
        parent: Chapter,
        public readonly Link: URL,
        public readonly Parameters?: Parameters) {
        super(parent);
    }

    public async Fetch(priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.scraper.FetchImage(this, priority, signal);
    }
}