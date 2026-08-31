import { Tags } from '../Tags';
import icon from './Kairatoon.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    title: string;
    id: string;
};

type APIPages = {
    pages: string[];
};

type APIChapter = {
    id: string;
    title: string;
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;
    private readonly CDN = 'https://cdn.kairatoon.com/';

    public constructor() {
        super('kairatoon', 'Kairatoon', 'https://kairatoon.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/webtoon/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, title } = await FetchJSON<APIManga>(new Request(new URL(`./webtoons/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await FetchJSON<APIManga[]>(new Request(new URL(`./webtoons?page=1&limit=9999`, this.apiURL)));
        return mangas.map(({ id, title }) => new Manga(this, provider, id, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FetchJSON<APIChapter[]>(new Request(new URL(`./webtoons/${manga.Identifier}/chapters`, this.apiURL)));
        return chapters.reverse().map(({ id, title }) => new Chapter(this, manga, id, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchJSON<APIPages>(new Request(new URL(`./chapters/${chapter.Identifier}`, this.apiURL)));
        return pages.map(page => new Page(this, chapter, new URL(page.replace('/api/files/', ''), this.CDN), { Referer: this.URI.href }));
    }
}