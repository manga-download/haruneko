import type { Chapter, Page } from '../providers/MangaPlugin';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import type { Priority } from '../taskpool/TaskPool';
export default class extends DecoratableMangaScraper {
    constructor();
    get Icon(): string;
    Initialize(): Promise<void>;
    FetchPages(chapter: Chapter): Promise<Page[]>;
    FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob>;
}
