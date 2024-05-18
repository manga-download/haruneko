import { Tags } from '../Tags';
import icon from './GalaxyManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

export type APIMangaClipboard = {
    serie: APIManga
}

export type APIManga = {
    id: number,
    title: string,
    prefix: number
}

export type APIMangas = {
    data: APIManga[]
}

export type APIChapter = {
    id: number,
    title: string,
    name: string
}

export type APIPages = {
    chapter: {
        chapterData: {
            webtoon: string[]
        }
    }
}

export const categories = ['action', 'romance'];

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    protected readonly apiUrl: string;
    protected readonly cdnUrl: string;
    protected readonly mangaRegexp: RegExp;

    public constructor(id: string = 'galaxymanga', label: string = 'Galaxy Manga', url: string = 'https://flixscans.com', apiUrl: string = 'https://ar.flixscans.site/api/v1/', cdnUrl = 'https://media.flixscans.com', tags = [Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Scanlator]) {
        super(id, label, url, ...tags);
        this.apiUrl = apiUrl;
        this.cdnUrl = cdnUrl;
        this.mangaRegexp = new RegExp(`^${this.URI.origin}/series/(\\d+)-(\\d+)[^/]+$`);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return this.mangaRegexp.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const matches = url.match(this.mangaRegexp);
        const request = new Request(`${this.apiUrl}series/${matches[2]}/${matches[1]}`);
        const { serie } = await FetchJSON<APIMangaClipboard>(request);
        return new Manga(this, provider, JSON.stringify(<APIManga>{
            id: serie.id,
            prefix: serie.prefix
        }), serie.title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (const category of categories) {
            for (let page = 1, run = true; run; page++) {
                const mangas = await this.GetMangasFromCategoryPage(page, provider, category);
                mangas.length > 0 ? mangaList.push(...mangas) : run = false;
            }
        }
        return mangaList;
    }

    private async GetMangasFromCategoryPage(page: number, provider: MangaPlugin, category: string): Promise<Manga[]> {
        const request = new Request(`${this.apiUrl}webtoon/pages/latest/${category}?page=${page}`);
        const { data } = await FetchJSON<APIMangas>(request);
        return data.map(manga => new Manga(this, provider, JSON.stringify(<APIManga>{
            id: manga.id,
            prefix: manga.prefix
        }), manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaID: APIManga = JSON.parse(manga.Identifier);
        const request = new Request(`${this.apiUrl}chapters/${mangaID.id}-desc`);
        const data = await FetchJSON<APIChapter[]>(request);
        return data.map(chapter => new Chapter(this, manga, chapter.id.toString(), `${chapter.name} ${chapter.title || ''}`.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangaID: APIManga = JSON.parse(chapter.Parent.Identifier);
        const request = new Request(`${this.apiUrl}chapters/webtoon/${chapter.Identifier}/${mangaID.prefix}`);
        const data = await FetchJSON<APIPages>(request);
        return data.chapter.chapterData.webtoon.map(image => new Page(this, chapter, new URL(image, this.cdnUrl)));
    }

}