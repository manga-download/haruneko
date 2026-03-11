import { Tags } from '../Tags';
import icon from './MonochromeScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from './../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    title: string;
    id: string;
};

type APIMangas = {
    results: APIManga[];
};

type APIChapter = {
    name: string;
    volume: number;
    number: number;
    id: string;
    mangaId: string;
    version: number;
    length: number;
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.manga.d34d.one/';

    public constructor() {
        super('monochromescans', `Monochrome Scans`, 'https://manga.d34d.one', Tags.Language.English, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, title } = await FetchJSON<APIManga>(new Request(new URL(new URL(url).pathname, this.apiUrl)));
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run; page++) {
                const { results } = await FetchJSON<APIMangas>(new Request(new URL(`./manga?limit=50&offset=${page * 50}`, this.apiUrl)));
                const mangas = results.map(({ id, title }) => new Manga(this, provider, id, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const data = await FetchJSON<APIChapter[]>(new Request(new URL(`./manga/${manga.Identifier}/chapters`, this.apiUrl)));
        return data.map(({ id, volume, number, name }) => {
            const title = [
                volume ? `Volume ${volume}` : undefined,
                'Chapter',
                number,
                name ? '-' : undefined,
                name
            ].filter(entry => entry).join(' ');
            return new Chapter(this, manga, id, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { length, mangaId, version } = await FetchJSON<APIChapter>(new Request(new URL(`./chapter/${chapter.Identifier}`, this.apiUrl)));
        const images = Array.from({ length }, (_, i) => i + 1).map(index => `${this.URI.origin}/media/${mangaId}/${chapter.Identifier}/${index}.jpg?version=${version}`);
        return images.map(page => new Page(this, chapter, new URL(page)));
    }
}