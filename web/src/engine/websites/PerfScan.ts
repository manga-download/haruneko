import { Tags } from '../Tags';
import icon from './PerfScan.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    data : T
}

type APIManga = {
    id: string,
    title: string
    Chapter: APIChapter[]
}

type APIChapter = {
    id: string,
    index: number,
    content: {
        value : string
    }[]
}

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.perf-scan.fr/';
    private readonly CdnUrl = 'https://api.perf-scan.fr/cdn/';

    public constructor() {
        super('perfscan', 'Perf Scan', 'https://perf-scan.fr', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/(en|fr|id)/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaId = url.split('/').at(-1);
        const { data: { id, title } } = await FetchJSON<APIResult<APIManga>>(this.CreateRequest(`./series/${mangaId}`));
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIResult<APIManga[]>>(this.CreateRequest(`./series?type=COMIC&take=9999&page=1&dataForPage=HOME`));
        return data.map(manga => new Manga(this, provider, manga.id, manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = (await FetchJSON<APIResult<APIManga>>(this.CreateRequest(`./series/${manga.Identifier}`))).data.Chapter;
        return chapters.map(chapter => new Chapter(this, manga, chapter.id, chapter.index.toString()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { content } } = await FetchJSON<APIResult<APIChapter>>(this.CreateRequest(`./series/${chapter.Parent.Identifier}/chapter/${chapter.Identifier}`));
        return content.map(page => new Page(this, chapter, new URL(page.value, this.CdnUrl)));
    }

    private CreateRequest(endpoint: string): Request {
        return new Request(new URL(endpoint, this.apiUrl), {
            headers: {
                Referer: this.URI.href,
                Origin: this.URI.origin
            }
        });
    }

}