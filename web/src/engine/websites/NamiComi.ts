import { Tags } from '../Tags';
import icon from './NamiComi.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { Page } from '../providers/MangaPlugin';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = { data: T; };

type APIManga = {
    id: string;
    attributes: {
        originalLanguage: string;
        title: Record<string, string>;
    }
};

type APIChapter = {
    id: string;
    attributes: {
        volume: null | string;
        chapter: string;
        name: null | string;
        translatedLanguage: string;
    };
};

type APIPages = {
    baseUrl: string;
    hash: string;
    high: { filename: string; }[];
};

const chapterLanguageMap = new Map([
    [ 'ar', [ Tags.Language.Arabic ] ],
    [ 'de', [ Tags.Language.German ] ],
    [ 'en', [ Tags.Language.English ] ],
    [ 'es-419', [ Tags.Language.Spanish ] ],
    [ 'es-es', [ Tags.Language.Spanish ] ],
    [ 'fr', [ Tags.Language.French ] ],
    [ 'id', [ Tags.Language.Indonesian ] ],
    [ 'it', [ Tags.Language.Italian ] ],
    [ 'ja', [ Tags.Language.Japanese ] ],
    [ 'ko', [ Tags.Language.Korean ] ],
    [ 'pl', [ Tags.Language.Polish ] ],
    [ 'pt-br', [ Tags.Language.Portuguese ] ],
    [ 'pt-pt', [ Tags.Language.Portuguese ] ],
    [ 'ru', [ Tags.Language.Russian ] ],
    [ 'tr', [ Tags.Language.Turkish ] ],
    [ 'zh-hans', [ Tags.Language.Chinese ] ],
    [ 'zh-hant', [ Tags.Language.Chinese ] ],
]);

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
        const mangaData = await this.FetchAPI<APIManga>('./title/' + url.split('/').at(-2));
        return this.ExtractManga(mangaData, provider);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangasData = await this.FetchAPI<APIManga[]>('./title/search', { limit: '9999', offset: '0' });
        return mangasData.map(item => this.ExtractManga(item, provider));
    }

    private ExtractManga(mangaData: APIManga, provider: MangaPlugin): Manga {
        const { id, attributes: { title, originalLanguage } } = mangaData;
        return new Manga(this, provider, id, title[ originalLanguage ] || title[ 'en' ] || Object.values(title).at(0).trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.FetchAPI<APIChapter[]>('./chapter', { titleId: manga.Identifier, limit: '9999', offset: '0' });
        return chapters.map(({ id, attributes: { name, translatedLanguage, chapter, volume } }) => {
            const title = [
                volume ? `Volume ${volume}` : null,
                chapter ? `Chapter ${chapter}` : null,
                name ? `${name} ` : '',
            ].filter(Boolean).join(' ').trim() || 'Oneshot';
            return new Chapter(this, manga, id, title + ` [${translatedLanguage}]`, ...chapterLanguageMap.get(translatedLanguage) ?? []);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { high, hash, baseUrl } = await this.FetchAPI<APIPages>('./images/chapter/' + chapter.Identifier, { newQualities: 'true' });
        return high.map(({ filename }) => new Page(this, chapter, new URL(`/chapter/${chapter.Identifier}/${hash}/high/${filename}`, baseUrl)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, searchParams: Record<string, string> = {}): Promise<T> {
        const uri = new URL(endpoint, this.apiUrl);
        uri.search = new URLSearchParams(searchParams).toString();
        return (await FetchJSON<APIResult<T>>(new Request(uri))).data as T;
    }
}