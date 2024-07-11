import { EngineResourceKey as R } from '../../i18n/ILocale';
import { Key, Scope } from '../SettingsGlobal';
import type { Check, Directory, ISettings, SettingsManager } from '../SettingsManager';
import { SanitizeFileName, type StorageController, Store } from '../StorageController';
import type { Tag } from '../Tags';
import { type Priority, TaskPool } from '../taskpool/TaskPool';
import { MediaContainer, StoreableMediaContainer, MediaItem, MediaScraper } from './MediaPlugin';
import icon from '../../img/manga.webp';
import { Exception, NotImplementedError } from '../Error';
import JSZip from 'jszip';

const settingsKeyPrefix = 'plugin.';

// See: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
const mimeFileExtension = {
    default: '.bin',
    'image/avif': '.avif',
    'image/webp': '.webp',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/bmp': '.bmp',
};

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
        this._settings.Initialize(...this.scraper.Settings);
        const mangas = await this.storageController.LoadPersistent<{ id: string, title: string }[]>(Store.MediaLists, this.Identifier) || [];
        super.Entries = mangas.map(manga => this.CreateEntry(manga.id, manga.title));
    }

    public override get Settings(): ISettings {
        return this._settings;
    }

    public override get Icon(): string {
        return this.scraper.Icon;
    }

    public override get Tags(): Tag[] {
        return this.scraper.Tags;
    }

    public get URI(): URL {
        return this.scraper.URI;
    }

    public async Initialize(): Promise<void> {
        await this.scraper.Initialize();
        return super.Initialize();
    }

    public CreateEntry(identifier: string, title: string): Manga {
        return new Manga(this.scraper, this, identifier, title);
    }

    public async TryGetEntry(url: string): Promise<Manga> {
        if(this.scraper.ValidateMangaURL(url)) {
            await this.Initialize();
            const manga = await this.scraper.FetchManga(this, url);
            return this.Entries.find((entry) => entry.IsSameAs(manga)) ?? manga;
        }
    }

    public async Update(): Promise<void> {
        await this.Initialize();
        super.Entries = await this.scraper.FetchMangas(this);
        const mangas = super.Entries.map(entry => {
            return { id: entry.Identifier, title: entry.Title };
        });
        await this.storageController.SavePersistent(mangas, Store.MediaLists, this.Identifier);
    }
}

export class Manga extends MediaContainer<Chapter> {

    constructor(private readonly scraper: MangaScraper, parent: MangaPlugin, identifier: string, title: string) {
        super(identifier, title, parent);
    }

    public override get Icon() {
        return icon;
    }

    public CreateEntry(identifier: string, title: string): Chapter {
        return new Chapter(this.scraper, this, identifier, title);
    }

    public async Update(): Promise<void> {
        await this.Initialize();
        super.Entries = await this.scraper.FetchChapters(this);
    }
}

export class Chapter extends StoreableMediaContainer<Page> {

    // TODO: inject storage controller
    private readonly storageController: StorageController;

    constructor(private readonly scraper: MangaScraper, parent: Manga, identifier: string, title: string) {
        super(identifier, title, parent);
        this.storageController = parent?.Parent['storageController'];
    }

    public async Update(): Promise<void> {
        await this.Initialize();
        super.Entries = await this.scraper.FetchPages(this);
    }

    public get IsStored() {
        return false;
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
        //if(/* ouput format folder with images ... */) {
        await this.StoreImageFolder(directory, resources);
        //}
        //if(/* ouput format CBZ ... */) {
        await this.StoreComicBookArchive(directory, resources);
        //}
        //if(/* ouput format PDF ... */) {
        await this.StorePortableDocumentFormat(directory, resources);
        //}
        //if(/* ouput format ePub ... */) {
        await this.StoreElectronicPublication(directory, resources);
        //}

        // Perform post processing (e.g. pdf, ffmpeg, ...)
    }

    private async ReadTempImageData(file: string, index: number, digits: number): Promise<{ name: string, data: Blob }> {
        const data = await this.storageController.LoadTemporary<Blob>(file);
        const extension: string = mimeFileExtension[data.type] ?? mimeFileExtension.default;
        const name = (index + 1).toString().padStart(digits, '0') + extension;
        return { name, data };
    }

    private async StoreImageFolder(directory: FileSystemDirectoryHandle, resources: Map<number, string>): Promise<void> {
        const chapter = SanitizeFileName(this.Title);
        directory = await directory.getDirectoryHandle(chapter, { create: true });
        const digits = resources.size.toString().length;

        // TODO: delete all existing entries?
        // TODO: Maybe parallelization of storing files?
        for(const [ index, tempfile ] of resources) {
            const { name, data } = await this.ReadTempImageData(tempfile, index, digits);
            const file = await directory.getFileHandle(name, { create: true });
            const stream = await file.createWritable();
            await stream.write(data);
            await stream.close();
        }
    }

    private async StoreComicBookArchive(directory: FileSystemDirectoryHandle, resources: Map<number, string>): Promise<void> {
        const zip = new JSZip();
        const digits = resources.size.toString().length;

        // TODO: delete all existing entries?
        for(const [ index, tempfile ] of resources) {
            const { name, data } = await this.ReadTempImageData(tempfile, index, digits);
            zip.file(name, data);
        }

        const chapter = SanitizeFileName(this.Title) + '.cbz';
        const file = await directory.getFileHandle(chapter, { create: true });
        const stream = await file.createWritable();
        await stream.write(await zip.generateAsync({ type: 'blob' }));
        await stream.close();
    }

    private async StorePortableDocumentFormat(_directory: FileSystemDirectoryHandle, _resources: Map<number, string>): Promise<void> {
    }

    private async StoreElectronicPublication(_directory: FileSystemDirectoryHandle, _resources: Map<number, string>): Promise<void> {
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