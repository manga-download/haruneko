import { Tags } from '../Tags';
import icon from './MonochromeScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from './../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    title: string,
    id: string
};

type APIMangas = {
    results: APIManga[]
};

type APIChapter = {
    name: string,
    volume: number,
    number: number,
    id: string,
    mangaId: string,
    version: number,
    length: number
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.manga.d34d.one';

    public constructor() {
        super('monochromescans', `Monochrome Scans`, 'https://manga.d34d.one', Tags.Language.English, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/manga/`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = url.split('/').pop();
        const request = new Request(new URL('/manga/' + id, this.apiUrl));
        const data = await FetchJSON<APIManga>(request);
        return new Manga(this, provider, data.id, data.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 0, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;

    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const uri = new URL('/manga', this.apiUrl);
        uri.searchParams.set('limit', '50');
        uri.searchParams.set('offset', String(page * 50));
        const { results } = await FetchJSON<APIMangas>(new Request(uri));
        return results.map(entry => new Manga(this, provider, entry.id, entry.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL('/manga/' + manga.Identifier + '/chapters', this.apiUrl));
        const data = await FetchJSON<APIChapter[]>(request);
        return data.map(chapter => {
            const title = [
                chapter.volume ? `Volume ${chapter.volume}` : undefined,
                'Chapter',
                chapter.number,
                chapter.name ? '-' : undefined,
                chapter.name
            ].filter(entry => entry).join(' ');
            return new Chapter(this, manga, chapter.id, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL('/chapter/' + chapter.Identifier, this.apiUrl));
        const data = await FetchJSON<APIChapter>(request);
        const images = Array.from({ length: data.length }, (_, i) => i + 1).map(index => `${this.apiUrl}/media/${data.mangaId}/${chapter.Identifier}/${index}.jpg?version=${data.version}`);
        return images.map(page => new Page(this, chapter, new URL(page)));
    }
}