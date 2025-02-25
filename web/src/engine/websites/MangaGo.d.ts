import type { Page} from '../providers/MangaPlugin';
import { DecoratableMangaScraper, type Chapter } from '../providers/MangaPlugin';
import type { Priority } from '../taskpool/DeferredTask';
export default class extends DecoratableMangaScraper {
    constructor();
    get Icon(): any;
    FetchPages(chapter: Chapter): Promise<Page[]>;
    private FetchPagesData;
    FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob>;
}
