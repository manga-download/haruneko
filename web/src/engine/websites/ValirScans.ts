import { Tags } from '../Tags';
import icon from './ValirScans.webp';
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
        number: number;
        title: string;
    }[]
};

type HydratedPages = {
    pages: {
        imageUrl: string;
    }[]
};

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/series\/comic\/[^/]+$/, 'meta[property="og:title"]', (el, uri) => ({ id: uri.pathname.split('/').at(-1), title: el.content.trim() }))
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://valirscans.org/api/';

    public constructor() {
        super('valirscans', 'Valir Scans', 'https://valirscans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run && page; page++) {
                const { data } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL(`./series?page=${page}&limit=100`, this.apiUrl)));
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { chapters: chaptersData } = await FetchNextJS<HydratedChapters>(new Request(new URL(`./series/comic/${manga.Identifier}?page=${page}`, this.URI)), data => 'chapters' in data);
                const chapters = chaptersData.map(({ number, title }) => new Chapter(this, manga, `/series/comic/${manga.Identifier}/chapter/${number}`, title));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchNextJS<HydratedPages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'pages' in data);
        return pages.map(({ imageUrl }) => new Page(this, chapter, new URL(imageUrl, this.URI)));
    }
}