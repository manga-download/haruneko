import { Tags } from '../Tags';
import icon from './ZeroScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    id: number,
    name: string,
    slug: string
}

type APIResult<T> = {
    success: boolean,
    data: T,
    message : string
}

type APIMangas = {
    comics: APIManga[]
}

type APIChapters = {
    data: APIChapter[]
}

type APIPages = {
    chapter: APIChapter
}

type APIChapter = {
    id: number,
    name: number,
    high_quality : string[]
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('zeroscans', `ZeroScans`, 'https://zscans.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/comics/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = url.match(/\/comics\/([^/]+)$/)[1];
        const request = new Request(new URL(`/swordflake/comic/${slug}`, this.URI).href);
        const { data } = await FetchJSON<APIResult<APIManga>>(request);
        return new Manga(this, provider, JSON.stringify({ id: data.id, slug: data.slug }), data.name.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(new URL('/swordflake/comics', this.URI).href);
        const data = await FetchJSON<APIResult<APIMangas>>(request);
        return data.success ? data.data.comics.map(manga => new Manga(this, provider, JSON.stringify({ id: manga.id, slug: manga.slug }), manga.name.trim())) : [];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.getChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async getChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]>{
        const mangainfos: APIManga = JSON.parse(manga.Identifier);
        const params = new URLSearchParams({
            page: String(page),
            sort: 'desc'
        });
        const uri = new URL(`/swordflake/comic/${mangainfos.id}/chapters`, this.URI);
        uri.search = params.toString();
        const request = new Request(uri.href);
        const data = await FetchJSON<APIResult<APIChapters>>(request);
        return data.success ? data.data.data.map(chapter => new Chapter(this, manga, chapter.id.toString(), `Chapter ${chapter.name}`)) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangainfos: APIManga = JSON.parse(chapter.Parent.Identifier);
        const uri = new URL(`/swordflake/comic/${mangainfos.slug}/chapters/${chapter.Identifier}`, this.URI);
        const request = new Request(uri.href);
        const data = await FetchJSON<APIResult<APIPages>>(request);
        return data.success ? data.data.chapter.high_quality.map(page => new Page(this, chapter, new URL(page))) : [];
    }
}