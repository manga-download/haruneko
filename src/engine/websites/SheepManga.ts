import { FetchJSON, FetchRequest } from '../FetchProvider';
import { MangaScraper, MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';

/**
 * Sample Website Implementation for Developer Testing
 */
export default class extends MangaScraper {

    public constructor() {
        super('sheep-scanlations', `Sheep's Awesome Mangas`, 'https://hakuneko.download/sample-websites/sheep-scanlations/');
    }

    /*
    public const Tags = [
        new Tag(Tags.Media, [ Media.Manga, Media.Manhua, Media.Novel ])
    ];
    */

    public async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        if(/\/sheep-scanlations\/\d+\.json/.test(url)) {
            // TODO: May search through provider.Entries, in case the manga is already in the list ...
            const mangas = await this.FetchMangas(provider);
            const id = '/' + new URL(url).pathname.split('/').pop();
            return mangas.find(manga => manga.Identifier === id);
        }
    }

    public async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new FetchRequest(this.URI + '/index.json');
        const data = await FetchJSON<{ id: string; title: string; }[]>(request);
        return data.map(entry => new Manga(this, provider, entry.id, entry.title));
    }

    public async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new FetchRequest(this.URI + manga.Identifier);
        const data = await FetchJSON<{ id: string; title: string; }[]>(request);
        return data.map(entry => new Chapter(this, manga, entry.id, entry.title));
    }

    public async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new FetchRequest(this.URI + chapter.Parent.Identifier);
        const data = await FetchJSON<{ id: string, pages: string[]; }[]>(request);
        const pages = data.find(ch => ch.id === chapter.Identifier).pages;
        return pages.map(page => new Page(this, chapter, new URL(page, this.URI)));
    }
}