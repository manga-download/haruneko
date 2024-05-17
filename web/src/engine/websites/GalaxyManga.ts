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

    private readonly apiUrl: string;
    private readonly cdnUrl: string;
    private readonly categories = ['action', 'romance'];
    private readonly mangaRegexp: RegExp;
    private readonly usePrefix: boolean;

    /*

GalaxyManga
https://ar.flixscans.site/api/v1/webtoon/pages/latest/action?page=1
https://ar.flixscans.site/api/v1/series/268/5297
https://ar.flixscans.site/api/v1/chapters/733-desc
https://ar.flixscans.site/api/v1/chapters/webtoon/34886/7345

FlixScans
https://flixscans.site/api/v1/webtoon/pages/latest/action?page=3
https://flixscans.site/api/v1/webtoon/series/50/11103
https://flixscans.site/api/v1/webtoon/chapters/92-desc
https://flixscans.site/api/v1/webtoon/chapters/chapter/3845/11103

 */
    public constructor(id = 'galaxymanga', label = 'Galaxy Manga', url = 'https://flixscans.com', tags = [Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Scanlator], apiurl: string = 'https://ar.flixscans.site/api/v1/', cdnurl: string = 'https://media.flixscans.com', usePrefix: boolean = false) {
        super(id, label, url, ...tags);
        this.apiUrl = apiurl;
        this.cdnUrl = cdnurl;
        this.mangaRegexp = new RegExp(`^${this.URI.origin}/series/(\\d+)-(\\d+)[^/]+$`);
        this.usePrefix = usePrefix;
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return this.mangaRegexp.test(url);
    }
    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const matches = new URL(url).pathname.match(this.mangaRegexp);
        const prefix = this.usePrefix ? 'webtoon/' : '';
        const request = new Request(`${this.apiUrl}series/${prefix}${matches[2]}/${matches[1]}`);
        const { serie } = await FetchJSON<APIMangaClipboard>(request);
        return new Manga(this, provider, JSON.stringify(<APIManga>{
            id: serie.id,
            prefix: serie.prefix
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
        const request = new Request(`${this.apiUrl}webtoon/pages/latest/${category}?page=${page}`);
        const { data } = await FetchJSON<APIMangas>(request);
        return data.map(manga => new Manga(this, provider, JSON.stringify(<APIManga>{
            id: manga.id,
            prefix: manga.prefix
        }), manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaID: APIManga = JSON.parse(manga.Identifier);
        const prefix = this.usePrefix ? 'webtoon/' : '';
        const request = new Request(`${this.apiUrl}${prefix}/chapters/${mangaID.id}-desc`);
        const data = await FetchJSON<APIChapter[]>(request);
        return data.map(chapter => new Chapter(this, manga, chapter.id.toString(), `${chapter.name} ${chapter.title || ''}`.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangaID: APIManga = JSON.parse(chapter.Parent.Identifier);
        const prefix = this.usePrefix ? 'webtoon/' : '';
        const request = new Request(`${this.apiUrl}${prefix}chapters/webtoon/${chapter.Identifier}/${mangaID.prefix}`);
        const data = await FetchJSON<APIPages>(request);
        return data.chapter.chapterData.webtoon.map(image => new Page(this, chapter, new URL(image, this.cdnUrl)));
    }

}