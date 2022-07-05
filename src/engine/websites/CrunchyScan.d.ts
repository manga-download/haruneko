import { DecoratableMangaScraper, type Chapter, type Page } from '../providers/MangaPlugin';
export default class extends DecoratableMangaScraper {
    constructor();
    Initialize(): Promise<void>;
    get Icon(): string;
    FetchPages(chapter: Chapter): Promise<Page[]>;
}
