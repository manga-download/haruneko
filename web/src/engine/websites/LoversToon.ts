import { Tags } from '../Tags';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import icon from './LoversToon.webp';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    data: APIManga[];
};

type APIManga = {
    id: string;
    slug: string;
    title: string;
    lastChapters: {
        id: string;
        number: number;
        title: string;
    }[];
};

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('loverstoon', 'Lovers Toon', 'https://loverstoon.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/#/comic/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, title } = await FetchJSON<APIManga>(new Request(new URL(`./comics/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./comics`, this.apiURL)));
        return data.map(({ slug, title }) => new Manga(this, provider, slug, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { lastChapters } = await FetchJSON<APIManga>(new Request(new URL(`./comics/${manga.Identifier}`, this.apiURL)));
        return lastChapters.map(({ id, title }) => new Chapter(this, manga, id, title ));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await FetchJSON<string[]>(new Request(new URL(`./chapter-images?chapterId=${chapter.Identifier}`, this.apiURL)));
        return pages.map(image => new Page(this, chapter, new URL(image, this.URI), { Referer: this.URI.href }));
    }
}