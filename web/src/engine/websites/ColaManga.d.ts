import type { Page } from '../providers/MangaPlugin';
import { type Chapter, DecoratableMangaScraper } from '../providers/MangaPlugin';
import type { Priority } from '../taskpool/DeferredTask';
type PageKey = {
    key: Uint8Array | null;
};
export default class extends DecoratableMangaScraper {
    constructor();
    get Icon(): string;
    FetchPages(chapter: Chapter): Promise<Page<PageKey>[]>;
    FetchImage(page: Page<PageKey>, priority: Priority, signal: AbortSignal): Promise<Blob>;
    private DecryptPicture;
}
export {};
