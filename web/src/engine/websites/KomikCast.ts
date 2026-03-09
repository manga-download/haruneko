import { Tags } from '../Tags';
import icon from './KomikCast.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { FetchJSON } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T;
};

type APIManga = {
    data: {
        title: string;
        slug: string;
    };
};

type APIChapter = {
    data: {
        index: number;
        title: string | null;
    }
};

type APIPages = {
    data: {
        images: string[];
    }
};

@Common.ImageAjax()

export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://be.komikcast.fit/series/';

    public constructor() {
        super('komikcast', 'KomikCast', 'https://v1.komikcast.fit', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { title, slug } } = await this.FetchAPI<APIManga>(`./${url.split('/').at(-1)}`);
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run && page; page++) {
                const mangasData = await this.FetchAPI<APIManga[]>(`./?take=500&page=${page}`);
                const mangas = mangasData.map(({ data: { title, slug } }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.FetchAPI<APIChapter[]>(`./${manga.Identifier}/chapters`);
        return chapters.map(({ data: { index, title }, }) => new Chapter(this, manga, `${index}`, [`Chapter ${index}`, title ?? ''].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { images } } = await this.FetchAPI<APIPages>(`./${chapter.Parent.Identifier}/chapters/${chapter.Identifier}`);
        return images.map(image => new Page(this, chapter, new URL(image), { Referer: this.URI.href }));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return (await FetchJSON<APIResult<T>>(new Request(new URL(endpoint, this.apiUrl), {
            headers: {
                Referer: this.URI.href,
                Origin: this.URI.origin
            }
        }))).data;
    }
}