import type { Chapter, Page } from '../providers/MangaPlugin';
import { DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
export default class extends DecoratableMangaScraper {
    constructor();
    get Icon(): string;
    Initialize(): Promise<void>;
    FetchChapters(manga: Manga): Promise<Chapter[]>;
    FetchPages(chapter: Chapter): Promise<Page[]>;
}
