import { Tags } from '../Tags';
import icon from './ShinigamiID.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T;
};

type APIManga = {
    manga_id: string;
    title: string;
};

type APIChapter = {
    chapter_id: string;
    chapter_title: string;
    chapter_number: string;
};

type APIPages = {
    base_url: string;
    chapter: {
        path: string;
        data: string[];
    };
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.shngm.io/v1/';

    public constructor() {
        super('shinigamiid', `Shinigami ID`, 'https://09.shinigami.asia', Tags.Language.Indonesian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript<string>(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^https?://\\d+.shinigami.asia/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { title, manga_id } = await this.FetchAPI<APIManga>(`./manga/detail/${url.split('/').at(-1)}`);
        return new Manga(this, provider, manga_id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await this.FetchAPI<APIManga[]>('./manga/list?page=1&page_size=9999');
        return mangas.map(({ manga_id: mangaId, title }) => new Manga(this, provider, mangaId, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.FetchAPI<APIChapter[]>(`./chapter/${manga.Identifier}/list?page=1&page_size=9999`);
        return chapters.map(({ chapter_id: chapId, chapter_number: chapNum, chapter_title: chapTitle }) => new Chapter(this, manga, `${chapId}`, ['Chapter', chapNum, chapTitle].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { base_url, chapter: { data, path } } = await this.FetchAPI<APIPages>(`./chapter/detail/${chapter.Identifier}`);
        return data.map(image => new Page(this, chapter, new URL(`${path}${image}`, base_url)));
    }

    public async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return (await FetchJSON<APIResult<T>>(new Request(new URL(endpoint, this.apiUrl)))).data as T;
    }
}