import { Tags } from '../Tags';
import icon from './Roxinha.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIManga = {
    id: number;
    title: string;
    chapters: {
        id: number;
        chapterNumber: number;
    }[];
};

type APIPages = {
    pages: string[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('roxinha', 'Roxinha', 'https://roxinha.online', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, title } = await FetchJSON<APIManga>(new Request(new URL(`./manga/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, `${id}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await FetchJSON<APIManga[]>(new Request(new URL('./manga', this.apiURL)));
        return mangas.map(({ id, title }) => new Manga(this, provider, `${id}`, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIManga>(new Request(new URL(`./manga/${manga.Identifier}`, this.apiURL)));
        return chapters.reverse().map(({ id, chapterNumber }) => new Chapter(this, manga, `${id}`, `Capítulo ${chapterNumber}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { ticket } = await FetchJSON<{ ticket: string }>(new Request(new URL(`./manga/chapter/${chapter.Identifier}/access`, this.apiURL)));
        const { pages } = await FetchJSON<APIPages>(new Request(new URL(`./manga/chapter/${chapter.Identifier}`, this.apiURL), {
            headers: {
                'X-Chapter-Access': ticket
            }
        }));
        return pages.map(page => new Page(this, chapter, new URL(page, this.URI)));
    }
}