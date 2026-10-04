import { Tags } from '../Tags';
import icon from './NamiComi.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { Page } from '../providers/MangaPlugin';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIManga = {
    id: string;
    attributes: {
        originalLanguage: string;
        title: Record<string, string>;
    }
};

type APIChapters = {
    id: string;
    attributes: {
        volume?: string;
        chapter: string;
        name?: string;
        translatedLanguage: string;
    };
}[];

type APIPages = {
    baseUrl: string;
    hash: string;
    high: { filename: string; }[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.namicomi.com/';

    public constructor() {
        super('namicomi', `NamiComi`, 'https://namicomi.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Comic, Tags.Language.Multilingual, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+/title/[^/]+/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const manga = await this.FetchAPI<APIManga>('./title/' + url.split('/').at(-2));
        return this.CreateManga(provider, manga);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await this.FetchAPI<APIManga[]>('./title/search', { limit: '9999', offset: '0' });
        return mangas.map(manga => this.CreateManga(provider, manga));
    }

    private CreateManga(provider: MangaPlugin, manga: APIManga): Manga {
        const { id, attributes: { title, originalLanguage } } = manga;
        return new Manga(this, provider, id, title[originalLanguage] || title.en || Object.values(title).at(0));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.FetchAPI<APIChapters>('./chapter', { titleId: manga.Identifier, limit: '9999', offset: '0' });
        return chapters.map(({ id, attributes: { name, translatedLanguage, chapter, volume } }) => {
            const title = [
                volume && `Volume ${volume}`,
                chapter && `Chapter ${chapter}`,
                name,
            ].joinTitleSegments() || 'Oneshot';
            return new Chapter(this, manga, id, `${title} [${translatedLanguage}]`);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { high, hash, baseUrl } = await this.FetchAPI<APIPages>('./images/chapter/' + chapter.Identifier, { newQualities: 'true' });
        return high.map(({ filename }) => new Page(this, chapter, new URL(`/chapter/${chapter.Identifier}/${hash}/high/${filename}`, baseUrl)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, searchParams: Record<string, string> = {}): Promise<T> {
        const uri = new URL(endpoint, this.apiUrl);
        uri.search = new URLSearchParams(searchParams).toString();
        return (await FetchJSON<{ data: T }>(new Request(uri))).data;
    }
}