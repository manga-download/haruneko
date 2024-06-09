import type { Manga, Chapter, Page } from '../providers/MangaPlugin';
import { DecoratableMangaScraper, type MangaPlugin } from '../providers/MangaPlugin';
export default class extends DecoratableMangaScraper {
    private readonly matchMangaPattern;
    constructor();
    get Icon(): string;
    Initialize(): Promise<void>;
    ValidateMangaURL(url: string): boolean;
    FetchManga(provider: MangaPlugin, url: string): Promise<Manga>;
    FetchMangas(provider: MangaPlugin): Promise<Manga[]>;
    FetchChapters(manga: Manga): Promise<Chapter[]>;
    FetchPages(chapter: Chapter): Promise<Page[]>;
}
