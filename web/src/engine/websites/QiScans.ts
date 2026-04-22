import { Tags } from '../Tags';
import icon from './QiScans.webp';
import { FetchJSON } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';

type APIResult<T> = {
    data: T;
};

type APIManga = {
    slug: string;
    title: string | null;
};

type APIChapter = {
    slug: string;
    number: number;
    title: string;
    images: {
        url: string;
    }[]
};

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'h1.series-title', (element, uri) => ({ id: uri.pathname.split('/').at(-1), title: element.textContent.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.qimanhwa.com/api/v1/';

    public constructor() {
        super('quantumscans', 'Qi Scans', 'https://qimanhwa.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL(`./series?perPage=100&page=${page}`, this.apiUrl)));
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await FetchJSON<APIResult<APIChapter[]>>(new Request(new URL(`./series/${manga.Identifier}/chapters?perPage=100&page=${page}`, this.apiUrl)));
                const chapters = data.map(({ number, slug, title }) => new Chapter(this, manga, slug, `Chapter ${number} ${title || ''}`.trim()));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { images } = await FetchJSON<APIChapter>(new Request(new URL(`./series/${chapter.Parent.Identifier}/chapters/${chapter.Identifier}`, this.apiUrl)));
        return images.map(({ url }) => new Page(this, chapter, new URL(url)));
    }
}