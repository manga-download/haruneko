import { Tags } from '../Tags';
import icon from './PerfScan.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = { data: T };
type APIManga = APIResult<{ id: string, title: string }>;
type APIMangas = APIResult<{ id: string, title: string }[]>;
type APIChapters = APIResult<{ Chapter: { id: string, index: number }[] }>;
type APIPages = APIResult<{ content: { value: string }[] }>;

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.perf-scan.xyz/';
    private readonly cdnUrl = this.apiUrl + 'cdn/';

    public constructor() {
        super('perfscan', 'Perf Scan', 'https://perf-scan.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/(en|fr|id)/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { id, title } } = await this.FetchAPI<APIManga>(`./series/${ url.split('/').at(-1) }`);
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await this.FetchAPI<APIMangas>('./series?type=COMIC&take=9999&page=1&dataForPage=HOME');
        return data.map(manga => new Manga(this, provider, manga.id, manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { Chapter: chapters } } = await this.FetchAPI<APIChapters>(`./series/${manga.Identifier}`);
        return chapters.map(chapter => new Chapter(this, manga, chapter.id, chapter.index.toString()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { content } } = await this.FetchAPI<APIPages>(`./series/${chapter.Parent.Identifier}/chapter/${chapter.Identifier}`);
        return content.map(page => new Page(this, chapter, new URL(page.value, this.cdnUrl)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl), {
            headers: {
                Referer: this.URI.href,
                Origin: this.URI.origin,
            }
        }));
    }
}