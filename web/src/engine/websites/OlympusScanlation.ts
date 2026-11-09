import { Tags } from '../Tags';
import icon from './OlympusScanlation.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    slug: string;
    name: string;
};

type APIMangas = {
    data: APIManga[];
};

type APIChapter = {
    name: string;
    pages: string[];
};

type APIChapters = {
    data: APIChapter[];
    meta: {
        current_page: number;
        last_page: number;
    };
};

type APIPages = {
    chapter: APIChapter;
};

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'nav.crumbs span.text-marble', (element, uri) => ({
    id: uri.pathname.split('/').at(-1).split('-').slice(1).join('-'),
    title: element.textContent.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('olympusscanlation', 'Olympus Scanlation', 'https://olympusxyz.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./series/list`, this.apiURL)));
        return data.map(({ name, slug }) => new Manga(this, provider, slug, name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data, meta: { current_page, last_page } } = await FetchJSON<APIChapters>(new Request(new URL(`./series/${manga.Identifier}/chapters?page=${page}&direction=desc`, this.apiURL)));
                const chapters = data.map(({ name }) => new Chapter(this, manga, name, name));
                chapters.length > 0 ? yield* chapters : null;
                run = last_page > current_page;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { pages } } = await FetchJSON<APIPages>(new Request(new URL(`./capitulo/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.apiURL)));
        return pages.map(page => new Page(this, chapter, new URL(page)));
    }
}