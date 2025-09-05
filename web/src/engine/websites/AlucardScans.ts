import { Tags } from '../Tags';
import icon from './AlucardScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    _id: string;
    slug: string;
    title: string;
};

type APIMangas = {
    series: APIManga[];
};

type APIChapters = {
    _id: string;
    number: string;
    title: string;
}[];

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
        const { series: [ { _id, title } ] } = await FetchJSON<APIMangas>(new Request(new URL('./series?search=' + slug, this.apiUrl)));
        return new Manga(this, provider, _id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { series } = await FetchJSON<APIMangas>(new Request(new URL('./series?limit=9999', this.apiUrl)));
        return series.map(({ _id, title }) => new Manga(this, provider, _id, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FetchJSON<APIChapters>(new Request(new URL(`./series/${manga.Identifier}/chapters`, this.apiUrl)));
        return chapters.map(({ _id, number, title }) => new Chapter(this, manga, _id, [ 'Bölüm', number, title ].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { pages } } = await FetchJSON<APIPages>(new Request(new URL('./chapters/' + chapter.Identifier, this.apiUrl)));
        return pages.map(({ url }) => new Page(this, chapter, new URL(url, this.URI)));
    }
}