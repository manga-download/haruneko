import type { Chapter, Page } from '../providers/MangaPlugin';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
export default class extends DecoratableMangaScraper {
    constructor();
    get Icon(): string;
    FetchPages(chapter: Chapter): Promise<Page[]>;
}
