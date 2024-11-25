import type { Priority } from '../taskpool/TaskPool';
import type { Chapter, Page } from '../providers/MangaPlugin';
import { DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
export default class extends DecoratableMangaScraper {
    #private;
    constructor();
    get Icon(): string;
    private GetAppCheckToken;
    FetchChapters(manga: Manga): Promise<Chapter[]>;
    FetchPages(chapter: Chapter): Promise<Page[]>;
    private FetchPagesPlain;
    private FetchPagesDirectDRM;
    private FetchPagesBrowserDRM;
    FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob>;
}
