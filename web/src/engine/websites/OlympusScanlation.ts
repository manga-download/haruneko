import { Tags } from '../Tags';
import icon from './OlympusScanlation.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    slug: string;
    type: string;
    name: string;
};

type APIMangas = {
    data: {
        series: {
            data: APIManga[];
        }
    }
};

type APIChapter = {
    name: string;
    id: number;
    pages: string[];
};

type APIChapters = {
    data: APIChapter[];
};

type APIPages = {
    chapter: APIChapter;
};

function MangaExtractor(img: HTMLImageElement, uri: URL) {
    const [, type, slug] = uri.pathname.match(/\/series\/([^/-]+)-([^/]+)/);
    return {
        id: JSON.stringify({ slug, type }),
        title: img.alt.trim()
    };
}

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/series\/[^/]+$/, 'img.object-cover', MangaExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://dashboard.olympusbiblioteca.com/api/';

    public constructor() {
        super('olympusscanlation', 'Olympus Scanlation', 'https://olympusbiblioteca.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data: { series: { data } } } = await FetchJSON<APIMangas>(new Request(new URL(`./series?page=${page}&direction=asc&type=comic`, this.apiUrl)));
                const mangas = data.map(({ name, slug, type }) => new Manga(this, provider, JSON.stringify({ slug, type }), name));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        const { slug, type } = JSON.parse(manga.Identifier) as APIManga;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run ; page++) {
                const { data } = await FetchJSON<APIChapters>(new Request(new URL(`./series/${slug}/chapters?page=${page}&direction=desc&type=${type}`, this.apiUrl)));
                const chapters = data.map(({ id, name }) => new Chapter(this, manga, `${id}`, name));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { slug, type } = JSON.parse(chapter.Parent.Identifier) as APIManga;
        const { chapter: { pages } } = await FetchJSON<APIPages>(new Request(new URL(`./series/${slug}/chapters/${chapter.Identifier}?type=${type}`, this.apiUrl)));
        return pages.map(page => new Page(this, chapter, new URL(page)));
    }
}