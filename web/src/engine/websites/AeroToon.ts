import { Tags } from '../Tags';
import icon from './AeroToon.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    series: APIManga[];
};

type APIManga = {
    slug: string;
    title: string;
    chapters: APIChapter[];
};

type APIChapter = {
    id: number;
    title: string;
    external_url: string;
    pages: {
        image_path: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/seri\/[^/]+$/, 'ol.breadcrumb-list li:last-of-type', (el, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: el.textContent.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('aerotoon', 'AeroToon', 'https://aerotoon.vercel.app', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { series } = await FetchJSON<APIMangas>(new Request(new URL(`./series?page=${page}&limit=200`, this.apiURL)));
                const mangas = series.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIManga>(new Request(new URL(`./series/${manga.Identifier}`, this.apiURL)));
        return chapters
            .filter(({ external_url: externaUrl }) => !externaUrl)
            .map(({ id, title }) => new Chapter(this, manga, `${id}`, title))
            .reverse();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchJSON<APIChapter>(new Request(new URL(`./chapters/${chapter.Identifier}`, this.apiURL)));
        return pages.map(({ image_path: path }) => new Page(this, chapter, new URL(path)));
    }
}