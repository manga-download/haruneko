import type { Priority } from '../taskpool/TaskPool';
import type { Page } from '../providers/MangaPlugin';
import { DecoratableMangaScraper, type Chapter } from '../providers/MangaPlugin';
export default class extends DecoratableMangaScraper {
    constructor();
    Initialize(): Promise<void>;
    get Icon(): string;
    FetchPages(chapter: Chapter): Promise<Page[]>;
    FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob>;
}
