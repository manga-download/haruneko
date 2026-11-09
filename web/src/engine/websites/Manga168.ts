import { Tags } from '../Tags';
import icon from './Manga168.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchNextJS } from '../platform/FetchProvider';

type APIResult<T> = {
    data: T;
};

type APIManga = {
    slug: string;
    title: string;
};

type HydratedChapters = {
    chapters: {
        id: string;
        title: string;
    }[];
};

type HydratedManga = {
    series: {
        id: number;
        chapters: {
            id: string;
            number: number;
        }[];
    }[];
};

type APIMangas = APIResult<APIManga[]>;
type APIPages = APIResult<string[]>;

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/manga\/[^/]+$/, 'img.object-cover', (img, uri) => ({
    id: uri.pathname,
    title: img.alt.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiURL = `${this.URI.origin}/api/manga/`;

    public constructor() {
        super('manga168', 'Manga168', 'https://manga168x.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Thai, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./mangas?limit=500&page=${page}`, this.apiURL)));
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, `/manga/${slug}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchNextJS<HydratedChapters>(new Request(new URL(manga.Identifier, this.URI)), data => 'chapters' in data);
        return chapters.map(({ id, title }) => new Chapter(this, manga, `${manga.Identifier}/chapter/${id}`, title.replace(manga.Title, '').trim() || title.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { series: [{ id, chapters }] } = await FetchNextJS<HydratedManga>(new Request(new URL(chapter.Identifier, this.URI)), data => 'series' in data);
        const chapterNumber = chapters.find(({ id }) => id === chapter.Identifier.split('/').at(-1)).number;
        const { data } = await FetchJSON<APIPages>(new Request(new URL(`./mangas/${id}/${chapterNumber}/images`, this.apiURL)));
        return data.map(page => new Page(this, chapter, new URL(page, this.URI), { Referer: this.URI.href }));
    }
}