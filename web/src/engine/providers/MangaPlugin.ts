import { Key, Scope } from '../SettingsGlobal';
import type { Check, Choice, Directory, ISettings, SettingsManager } from '../SettingsManager';
import { SanitizeFileName, type StorageController, Store } from '../StorageController';
import { type Priority, TaskPool } from '../taskpool/TaskPool';
import { MediaContainer, StoreableMediaContainer, MediaItem, MediaScraper } from './MediaPlugin';
import icon from '../../img/manga.webp';
import { NotImplementedError } from '../Error';
import { CreateChapterExportRegistry } from '../exporters/MangaExporterRegistry';
import { Observable } from '../Observable';
import type { Tag } from '../Tags';

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
        this.tags.Value = this.scraper.Tags;
        this.Prepare();
    }

    private async Prepare() {
        await this._settings.Initialize(...this.scraper.Settings);
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

    constructor(private readonly scraper: MangaScraper, parent: MangaPlugin, identifier: string, title: string, ...tags: Tag[]) {
        super(identifier, title, parent);
        this.tags.Value = tags;
    }

    public override get Icon() {
        return icon;
    }

    public override CreateEntry(identifier: string, title: string): Chapter {
        return new Chapter(this.scraper, this, identifier, title);
    }

    protected async PerformUpdate(): Promise<Chapter[]> {
        const chapters = await this.scraper.FetchChapters(this);
        const offlineChapters = await this.FindOfflineChapters(chapters);
        return [...chapters, ...offlineChapters];
    }

    /**
     * Try to get a subdirectory by exact name, falling back to case-insensitive match.
     */
    private static async FindDirectoryHandle(parent: FileSystemDirectoryHandle, name: string): Promise<FileSystemDirectoryHandle | null> {
        try {
            return await parent.getDirectoryHandle(name);
        } catch { /* exact match not found */ }
        const nameLower = name.toLowerCase();
        for await (const [entryName, handle] of parent as any) {
            if (handle.kind === 'directory' && entryName.toLowerCase() === nameLower) {
                return handle as FileSystemDirectoryHandle;
            }
        }
        return null;
    }

    /**
     * Scan the manga directory on disk, mark which online chapters are stored,
     * and return offline-only chapter entries for files that don't match any online chapter.
     */
    private async FindOfflineChapters(chapters: Chapter[]): Promise<Chapter[]> {
        try {
            const settings = HakuNeko.SettingsManager.OpenScope(Scope);
            const directory = settings.Get<Directory>(Key.MediaDirectory);
            if (!directory.Value) return [];
            await directory.EnsureAccess();
            let output = directory.Value;
            if (settings.Get<Check>(Key.UseWebsiteSubDirectory).Value && this.Parent) {
                const website = SanitizeFileName(this.Parent.Title);
                const websiteDir = await Manga.FindDirectoryHandle(output, website);
                if (!websiteDir) return [];
                output = websiteDir;
            }
            const manga = SanitizeFileName(this.Title);
            const mangaDir = await Manga.FindDirectoryHandle(output, manga);
            if (!mangaDir) return [];
            // Scan directory once, build a lowercase set for matching and a map to original names
            const diskEntries = new Set<string>();
            const originalNames = new Map<string, string>();
            for await (const [name] of mangaDir as any) {
                const lower = name.toLowerCase();
                diskEntries.add(lower);
                originalNames.set(lower, name);
            }
            // Mark online chapters that exist on disk
            const matchedEntries = new Set<string>();
            for (const chapter of chapters) {
                const matched = chapter.CheckIsStoredAgainst(diskEntries);
                if (matched) matchedEntries.add(matched);
            }
            // Create offline chapters for unmatched disk entries
            const offlineChapters: Chapter[] = [];
            for (const entry of diskEntries) {
                if (matchedEntries.has(entry)) continue;
                // Strip known extensions to get the chapter title
                let title = originalNames.get(entry);
                for (const ext of ['.cbz', '.epub', '.pdf']) {
                    if (title.toLowerCase().endsWith(ext)) {
                        title = title.slice(0, -ext.length);
                        break;
                    }
                }
                const chapter = Chapter.CreateOffline(this, title);
                offlineChapters.push(chapter);
            }
            return offlineChapters;
        } catch {
            // Media directory not set or no permission, skip silently
            return [];
        }
    }
}

export class Chapter extends StoreableMediaContainer<Page> {

    private readonly isStored = new Observable<boolean, Chapter>(false);
    private _isOffline = false;

    constructor(private readonly scraper: MangaScraper, parent: Manga, identifier: string, title: string, ...tags: Tag[]) {
        super(identifier, title, parent);
        this.tags.Value = tags;
    }

    public get IsOffline(): boolean {
        return this._isOffline;
    }

    public static CreateOffline(parent: Manga, title: string): Chapter {
        const chapter = new Chapter(parent['scraper'], parent, `offline:${title}`, title);
        chapter._isOffline = true;
        chapter.isStored.Value = true;
        return chapter;
    }

    protected PerformUpdate(): Promise<Page[]> {
        return this.scraper.FetchPages(this);
    }

    public get IsStored() {
        return this.isStored;
    }

    /**
     * Check whether this chapter already exists on disk in any supported export format.
     * Sets {@link isStored} to `true` if a matching file or directory is found.
     */
    public async CheckIsStored(mangaDirectory: FileSystemDirectoryHandle): Promise<void> {
        const sanitized = SanitizeFileName(this.Title);
        try {
            await mangaDirectory.getDirectoryHandle(sanitized);
            this.isStored.Value = true;
            return;
        } catch { /* not found */ }
        for (const ext of ['.cbz', '.epub', '.pdf']) {
            try {
                await mangaDirectory.getFileHandle(SanitizeFileName(this.Title + ext));
                this.isStored.Value = true;
                return;
            } catch { /* not found */ }
        }
    }

    /**
     * Check whether this chapter exists in a pre-scanned set of directory entry names (lowercase).
     * Returns the matched entry name, or null if not found.
     */
    public CheckIsStoredAgainst(diskEntries: Set<string>): string | null {
        const sanitized = SanitizeFileName(this.Title).toLowerCase();
        if (diskEntries.has(sanitized)) {
            this.isStored.Value = true;
            return sanitized;
        }
        for (const ext of ['.cbz', '.epub', '.pdf']) {
            const withExt = SanitizeFileName(this.Title + ext).toLowerCase();
            if (diskEntries.has(withExt)) {
                this.isStored.Value = true;
                return withExt;
            }
        }
        return null;
    }

    public async Store(resources: Map<number, string>): Promise<void> {
        // TODO: Inject settings manager and global scope identifier?
        const settings = HakuNeko.SettingsManager.OpenScope(Scope);
        const directory = settings.Get<Directory>(Key.MediaDirectory);
        await directory.EnsureAccess();
        let output = directory.Value;
        if(settings.Get<Check>(Key.UseWebsiteSubDirectory).Value && this.Parent?.Parent) {
            const website = SanitizeFileName(this.Parent?.Parent?.Title);
            output = await output.getDirectoryHandle(website, { create: true });
        }
        if(this.Parent) {
            const manga = SanitizeFileName(this.Parent?.Title);
            output = await output.getDirectoryHandle(manga, { create: true });
        }

        // TODO: Find more appropriate way to inject the storage dependency
        const registry = CreateChapterExportRegistry(this.Parent?.Parent['storageController']);
        await registry[settings.Get<Choice>(Key.MangaExportFormat).Value].Export(resources, output, this.Title, this.Parent?.Title);
        this.isStored.Value = true;
    }
}

type Parameters = {
    readonly Referer?: string;
}

export class Page<T extends JSONObject = JSONObject> extends MediaItem {

    public constructor(
        private readonly scraper: MangaScraper,
        parent: Chapter,
        public readonly Link: URL,
        public readonly Parameters?: T & Parameters) {
        super(parent);
    }

    public async Fetch(priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.scraper.FetchImage(this, priority, signal);
    }
}