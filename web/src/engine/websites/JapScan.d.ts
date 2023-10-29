import type { Page } from '../providers/MangaPlugin';
import { DecoratableMangaScraper, type Chapter } from '../providers/MangaPlugin';
export default class extends DecoratableMangaScraper {
    constructor();
    get Icon(): string;
    FetchPages(chapter: Chapter): Promise<Page[]>;
}
