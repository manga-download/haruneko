import { Tags } from '../Tags';
import icon from './YomuComics.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    results: T;
};

type APIManga = {
    id: number;
    name: string;
    chapters: APIChapter[];
};

type APIChapter = {
    index: number;
    name: string;
    slug: string;
    pages: {
        url: string;
    }[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://yomu.com.br/api/public/';

    public constructor() {
        super('yomucomics', 'Yomu Comics', 'https://yomu.com.br', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/obra/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, name } = await FetchJSON<APIManga>(new Request(new URL(`./series/${url.split('/').at(-1)}`, this.apiUrl)));
        return new Manga(this, provider, id.toString(), name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { results } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL('.series?page=1&limit=9999&sort=name&order=asc', this.apiUrl)));
        return results.map(({ id, name }) => new Manga(this, provider, id.toString(), name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIManga>(new Request(new URL(`.series/${manga.Identifier}`, this.apiUrl)));
        return chapters.map(({ index, name }) => new Chapter(this, manga, index.toString(), name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchJSON<APIChapter>(new Request(new URL(`./chapters/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.apiUrl)));
        return pages.map(({ url }) => new Page(this, chapter, new URL(url, this.URI)));
    }
}