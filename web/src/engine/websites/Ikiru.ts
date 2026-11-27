import { Tags } from '../Tags';
import icon from './Ikiru.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T;
};

type APIMangas = APIResult<{ mangas: APIManga[] }>;

type APIManga = {
    title: string;
    slug: string;
    chapters: {
        chapters: APIChapter[];
    };
};

type APIMangaDetails = APIResult<APIManga>;

type APIChapter = {
    id: string;
    number: number;
    medias: {
        filePath: string;
    }[]
};

type APIPages = APIResult<APIChapter>

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.detail-info h1', (h1, uri) => ({
    id: uri.pathname.split('/').filter(Boolean).at(-1),
    title: h1.textContent.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ikiru', 'Ikiru', 'https://v1.ikiru.wtf', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    get APIURL() {
        return `${this.URI.origin}/api/public/`;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data: { mangas: mangasData } } = await FetchJSON<APIMangas>(new Request(new URL(`./library/search?page=${page}&limit=100`, this.APIURL)));
                const mangas = mangasData.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { chapters: { chapters } } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./manga/${manga.Identifier}`, this.APIURL)));
        return chapters.map(({ number }) => new Chapter(this, manga, `${number}`, `Chapter ${number}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { medias } } = await FetchJSON<APIPages>(new Request(new URL(`./chapter/${chapter.Identifier}?mangaSlug=${chapter.Parent.Identifier}`, this.APIURL)));
        return medias.map(({ filePath }) => new Page(this, chapter, new URL(filePath, this.URI)));
    }
}
