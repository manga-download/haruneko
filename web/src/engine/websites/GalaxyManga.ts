import { Tags } from '../Tags';
import icon from './GalaxyManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangaClipboard = {
    serie: APIManga
}

type APIManga = {
    id: number,
    title: string,
    prefix: number
}

type APIMangas = {
    data: APIManga[]
}

type APIChapter = {
    id: number,
    title: string,
    name: string
}

type APIPages = {
    chapter: {
        chapterData: {
            webtoon: string[]
        }
    }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    protected apiurl = 'https://ar.flixscans.site/api/v1/webtoon/';
    protected cdnUrl = 'https://media.flixscans.com';
    protected categories = ['action', 'romance'];

    public constructor(id = 'galaxymanga', label = 'Galaxy Manga', url = 'https://flixscans.com', tags = [Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Scanlator]) {
        super(id, label, url, ...tags);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }
    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const matches = new URL(url).pathname.match(/\/series\/(\d+)-(\d+)/);
        const request = new Request(`${this.apiurl}series/${matches[2]}/${matches[1]}`);
        const { serie } = await FetchJSON<APIMangaClipboard>(request);
        return new Manga(this, provider, JSON.stringify({
            id: serie.id.toString(),
            prefix: serie.prefix.toString()
        }), serie.title);
    }
    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (const category of this.categories) {
            for (let page = 1, run = true; run; page++) {
                const mangas = await this.GetMangasFromCategoryPage(page, provider, category);
                mangas.length > 0 ? mangaList.push(...mangas) : run = false;
            }
        }
        return mangaList.distinct();
    }

    async GetMangasFromCategoryPage(page: number, provider: MangaPlugin, category: string): Promise<Manga[]> {
        const request = new Request(`${this.apiurl}pages/latest/${category}?page=${page}`);
        const { data } = await FetchJSON<APIMangas>(request);
        return data.map(manga => new Manga(this, provider, JSON.stringify({
            id: manga.id.toString(),
            prefix: manga.prefix.toString()
        }), manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaID: APIManga = JSON.parse(manga.Identifier);
        const request = new Request(`${this.apiurl}chapters/${mangaID.id}-desc`);
        const data = await FetchJSON<APIChapter[]>(request);
        return data.map(chapter => new Chapter(this, manga, chapter.id.toString(), `${chapter.name} ${chapter.title || ''}`.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangaID: APIManga = JSON.parse(chapter.Parent.Identifier);
        const request = new Request(`${this.apiurl}chapters/chapter/${chapter.Identifier}/${mangaID.prefix}`);
        const data = await FetchJSON<APIPages>(request);
        return data.chapter.chapterData.webtoon.map(image => new Page(this, chapter, new URL(image, this.cdnUrl)));
    }

}