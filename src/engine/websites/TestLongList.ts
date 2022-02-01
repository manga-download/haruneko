import { Tags } from '../Tags';
import { FetchJSON, FetchRequest } from '../FetchProvider';
import { MangaScraper, MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';

/**
 * Sample Website Implementation for Developer Testing
 */
export default class extends MangaScraper {

    public constructor() {
        super('test-long-list', `Test - Long List`, 'https://hakuneko.download/sample-websites/long-title-list/', Tags.Media.Comic, Tags.Source.Official, Tags.Rating.Safe, Tags.Language.Multilingual);
    }

    public async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        throw new Error('not implemented');
    }

    public async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new FetchRequest(this.URI + '/mangadex.json');
        const data = await FetchJSON<{ id: string; title: string; }[]>(request);
        return data.map(entry => new Manga(this, provider, entry.id, entry.title));
    }

    public async FetchChapters(manga: Manga): Promise<Chapter[]> {
        throw new Error('not implemented');
    }

    public async FetchPages(chapter: Chapter): Promise<Page[]> {
        throw new Error('not implemented');
    }
}