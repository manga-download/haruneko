import { type Tag } from '../Tags';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import type { Priority } from '../taskpool/DeferredTask';
export default class extends DecoratableMangaScraper {
    constructor(id?: string, label?: string, url?: string, tags?: Tag[]);
    get Icon(): string;
    FetchPages(chapter: Chapter): Promise<Page[]>;
    private ConvertWordArrayToUint8Array;
    FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob>;
    private DecryptPicture;
}
