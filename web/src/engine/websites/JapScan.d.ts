import { DecoratableMangaScraper, type Chapter, type Page } from '../providers/MangaPlugin';
export default class extends DecoratableMangaScraper {
    constructor();
    get Icon(): string;
    FetchPages(chapter: Chapter): Promise<Page[]>;
}
