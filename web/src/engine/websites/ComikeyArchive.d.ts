import type { Manga, Chapter, Page } from '../providers/MangaPlugin';
import { DecoratableMangaScraper, type MangaPlugin } from '../providers/MangaPlugin';
export default class extends DecoratableMangaScraper {
    constructor();
    get Icon(): string;
    Initialize(): Promise<void>;
    FetchMangas(provider: MangaPlugin): Promise<Manga[]>;
    FetchChapters(manga: Manga): Promise<Chapter[]>;
    FetchPages(chapter: Chapter): Promise<Page[]>;
}
