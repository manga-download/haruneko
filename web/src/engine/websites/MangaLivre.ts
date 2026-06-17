import { Tags } from '../Tags';
import icon from './MangaLivre.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    id: string;
    title: string;
};

type APIMangas = {
    mangas: APIManga[];
};

type APIChapters = {
    id: string;
    chapters: {
        id: string;
        number: string;
        title: string;
    }[];
};

type APIPages = {
    pages: string[];
};

@Common.MangaCSS(/^{origin}\/[^/]+$/, 'head title', (title, uri) => ({ id: uri.pathname.split('/').at(-1), title: title.innerText.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('mangalivre', 'ToonLivre', 'https://toonlivre.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Language.Portuguese);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { mangas: entries } = await FetchJSON<APIMangas>(new Request(new URL(`./mangas/releases?limit=9999&page=${page}`, this.apiURL)));
                const mangas = entries.map(({ id, title }) => new Manga(this, provider, this.Slugify(id), title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { id: slug, chapters } = await FetchJSON<APIChapters>(new Request(new URL(`./manga-by-slug/${manga.Identifier}`, this.apiURL)));
        return chapters.map(({ id, number, title }) => new Chapter(this, manga, `./mangas/${slug}/chapters/${id}`, ['Capítulo', number, title].joinTitleSegments()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchJSON<APIPages>(new Request(new URL(chapter.Identifier, this.apiURL)));
        return pages.map(page => new Page(this, chapter, new URL(page, this.URI)));
    }

    private Slugify(title: string): string {
        return title.toString().toLowerCase().normalize('NFD').replace(new RegExp('\\p{Diacritic}', 'gu'), '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
}