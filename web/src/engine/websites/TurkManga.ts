import { Tags } from '../Tags';
import icon from './TurkManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

type APIMangas = {
    mangalar: APIManga[]
}

type APIManga = {
    name: string,
    slug: string,
    episodes: APIChapter[]
}

type NextManga = {
    pageProps: {
        data: {
            manga: APIManga
        }
    }
}

type APIChapter = {
    name: string,
    slug: string
}

type APIPages = {
    pageProps: {
        datab: {
            bolum: {
                images: string[]
            }
        }
    }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.turkmanga.com.tr/';
    private nextBuild = '';

    public constructor() {
        super('turkmanga', 'TurkManga', 'https://turkmanga.com.tr', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.nextBuild = await FetchWindowScript<string>(new Request(this.URI), `__NEXT_DATA__.buildId`, 2500);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = new URL(url).pathname;
        const uri = new URL(`/_next/data/${this.nextBuild}${slug}.json`, this.URI);
        const { pageProps: { data: { manga } } } = await FetchJSON<NextManga>(new Request(uri));
        return new Manga(this, provider, slug, manga.name.trim());

    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const endpoint = new URL('api/manga/?limit=99999', this.apiUrl);
        const { mangalar } = await FetchJSON<APIMangas>(new Request(endpoint));
        return mangalar.map(manga => new Manga(this, provider, `/manga/${manga.slug}`, manga.name.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`/_next/data/${this.nextBuild}${manga.Identifier}.json`, this.URI);
        const request = new Request(uri);
        const { pageProps: { data: { manga: { episodes } } } } = await FetchJSON<NextManga>(request);
        return episodes.map(chapter => new Chapter(this, manga, chapter.slug, chapter.name.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL(`/_next/data/${this.nextBuild}${chapter.Parent.Identifier}/${chapter.Identifier}.json`, this.URI);
        const { pageProps: { datab: { bolum: { images } } } } = await FetchJSON<APIPages>(new Request(url));
        return images.map(page => new Page(this, chapter, new URL(page)));
    }

}