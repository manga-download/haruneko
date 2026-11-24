import { Tags } from '../Tags';
import icon from './ShinigamiID.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T;
    meta: {
        has_next: boolean;
        next_cursor: string;
    };
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
    private readonly apiURL = 'https://api.shinigami.io/v1/';

    public constructor() {
        super('shinigamiid', 'Shinigami ID', 'https://s1.shinigami.mx', Tags.Language.Indonesian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript<string>(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^https?://[^/.]+.shinigami.mx/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { title, manga_id } } = await FetchJSON<APIResult<APIManga>>(new Request(new URL(`./manga/detail/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, manga_id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run && offset < 1000;) {
                const { data, meta: { has_next } } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL(`./manga/list?page=1&limit=100&offset=${offset}`, this.apiURL)));
                const mangas = data.map(({ manga_id: mangaId, title }) => new Manga(this, provider, mangaId, title));
                yield* mangas;
                offset += mangas.length;
                run = has_next;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let cursor = undefined, run = true; run;) {
                const { data, meta: { next_cursor, has_next } } = await FetchJSON<APIResult<APIChapter[]>>(new Request(new URL(`./chapter/${manga.Identifier}/list?sort_order=desc&limit=2000&cursor=${cursor}`, this.apiURL)));
                const chapters = data.map(({ chapter_id: chapId, chapter_number: chapNum, chapter_title: chapTitle }) => new Chapter(this, manga, `${chapId}`, ['Chapter', chapNum, chapTitle].join(' ').trim()));
                yield* chapters;
                cursor = next_cursor;
                run = has_next;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: {base_url, chapter: { data, path } } } = await FetchJSON<APIResult<APIPages>>(new Request(new URL(`./chapter/detail/${chapter.Identifier}`, this.apiURL)));
        return data.map(image => new Page(this, chapter, new URL(`${path}${image}`, base_url)));
    }
}