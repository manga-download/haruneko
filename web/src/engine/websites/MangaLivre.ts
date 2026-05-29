import { Tags } from '../Tags';
import icon from './MangaLivre.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    id: string;
    title: string;
    chapters: APIChapter[];
};

type APIChapter = {
    id: string;
    number: string;
    title: string;
    pages: string[];
};

type APIMangas = { mangas: APIManga[]; };

type MangaID = {
    id: string;
    slug: string;
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('mangalivre', 'ToonLivre', 'https://toonlivre.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Language.Portuguese);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = url.split('/').at(-1);
        const { id, title } = await FetchJSON<APIManga>(new Request(new URL(`./manga-by-slug/${slug}`, this.apiURL)));
        return new Manga(this, provider, JSON.stringify({ id, slug }), title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { mangas: mangasData } = await FetchJSON<APIMangas>(new Request(new URL(`./mangas/releases?limit=9999&page=${page}`, this.apiURL)));
                const mangas = mangasData.map(({ id, title }) => new Manga(this, provider, JSON.stringify({ id, slug: this.Slugify(id) }), title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { slug } = <MangaID>JSON.parse(manga.Identifier);
        const { chapters } = await FetchJSON<APIManga>(new Request(new URL(`./manga-by-slug/${slug}`, this.apiURL)));
        return chapters.map(({ id, number, title }) => new Chapter(this, manga, id, [`Capítulo ${number}`, title.trim()].filter(Boolean).join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { id: mangaId } = <MangaID>JSON.parse(chapter.Parent.Identifier);
        const { pages } = await FetchJSON<APIChapter>(new Request(new URL(`./mangas/${mangaId}/chapters/${chapter.Identifier}`, this.apiURL)));
        return pages.map(page => new Page(this, chapter, new URL(page, this.URI)));
    }

    private Slugify(title: string): string {
        return title.toString().toLowerCase().normalize('NFD').replace(new RegExp('\\p{Diacritic}', 'gu'), '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
}