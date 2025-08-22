import { Tags } from '../Tags';
import icon from './AlucardScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    series: APIManga[]
};

type APIManga = {
    _id: string,
    title: string,
    slug: string,
};

type APIChapter = {
    _id: string,
    title: string,
    number: string
};

type APIPages = {
    chapter: {
        pages: {
            url: string
        }[]
    }
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://alucardscans.com/api/';

    public constructor() {
        super('alucardscans', 'Alucard Scans', 'https://alucardscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = url.split('/').at(-1);
        const { series } = await FetchJSON<APIMangas>(new Request(new URL(`./series?search=${slug}&limit=8`, this.apiUrl)));
        const { _id, title } = series.find(serie => serie.slug === slug);
        return new Manga(this, provider, _id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { series } = await FetchJSON<APIMangas>(new Request(new URL('./series?page=1&limit=9999', this.apiUrl)));
        return series.map(({ _id, title }) => new Manga(this, provider, _id, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FetchJSON<APIChapter[]>(new Request(new URL(`./series/${manga.Identifier}/chapters`, this.apiUrl)));
        return chapters.map(({ _id, title, number }) => new Chapter(this, manga, _id, ['Bölüm', number, title].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { pages } } = await FetchJSON<APIPages>(new Request(new URL(`./chapters/${chapter.Identifier}`, this.apiUrl)));
        return pages.map(({ url }) => new Page(this, chapter, new URL(url, this.URI)));
    }
}