import { DecoratableMangaScraper, type MangaPlugin, type Manga, type Chapter, type Page } from '../providers/MangaPlugin';
export default class extends DecoratableMangaScraper {
    #private;
    constructor();
    get Icon(): string;
    FetchMangas(provider: MangaPlugin): Promise<Manga[]>;
    FetchChapters(manga: Manga): Promise<Chapter[]>;
    FetchPages(chapter: Chapter): Promise<Page[]>;
}
