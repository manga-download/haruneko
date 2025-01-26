import type { Chapter, Manga, Page } from '../providers/MangaPlugin';
import { DecoratableMangaScraper, type MangaPlugin } from '../providers/MangaPlugin';
import type { Priority } from '../taskpool/TaskPool';
export default class extends DecoratableMangaScraper {
    private readonly mangasTaskPool;
    constructor();
    get Icon(): any;
    ValidateMangaURL(url: string): boolean;
    FetchManga(provider: MangaPlugin, url: string): Promise<Manga>;
    FetchMangas(provider: MangaPlugin): Promise<Manga[]>;
    private GetMangasFromPage;
    FetchChapters(manga: Manga): Promise<Chapter[]>;
    FetchPages(chapter: Chapter): Promise<Page[]>;
    FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob>;
    private GetImageSizeByQuality;
    private FetchTwirp;
}
