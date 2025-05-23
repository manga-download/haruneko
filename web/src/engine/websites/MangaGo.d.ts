import { DecoratableMangaScraper, type Page } from '../providers/MangaPlugin';
import type { Priority } from '../taskpool/DeferredTask';
export default class extends DecoratableMangaScraper {
    constructor();
    get Icon(): any;
    Initialize(): Promise<void>;
    FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob>;
}
