import type { Page } from '../providers/MangaPlugin';
import { type Chapter, DecoratableMangaScraper } from '../providers/MangaPlugin';
import type { Priority } from '../taskpool/DeferredTask';
export default class extends DecoratableMangaScraper {
    constructor();
    get Icon(): string;
    FetchPages(chapter: Chapter): Promise<Page[]>;
    private ConvertWordArrayToUint8Array;
    FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob>;
    private DecryptPicture;
}
