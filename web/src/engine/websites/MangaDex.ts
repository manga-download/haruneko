import { Tags } from '../Tags';
import icon from './MangaDex.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { MangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import { TaskPool, Priority } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';
import * as Common from './decorators/Common';

type APIContainer<T> = {
    data: T
}

type APIManga = APIContainer<{
    id: string;
    attributes: {
        title: Record<string, string>;
    };
}>;

type CachedMangas = {
    id: string;
    title: string;
}[];

type APIChapters = APIContainer<{
    id: string;
    attributes: {
        isUnavailable?: boolean;
        volume?: string;
        chapter?: string;
        pages: number;
        title: string;
        translatedLanguage: string;
    };
    relationships: {
        type: string;
        attributes?: {
            name: string;
        };
    }[];
}[]>;

type APIMedia = {
    baseUrl: string;
    chapter: {
        hash: string;
        data: string[];
    };
};

type PageParameters = {
    Mirror: string;
}

const chapterLanguageMap = new Map([
    ['ar', [Tags.Language.Arabic]],
    ['bg', []],
    ['bn', []],
    ['ca', []],
    ['cs', []],
    ['da', []],
    ['de', [Tags.Language.German]],
    ['el', []],
    ['en', [Tags.Language.English]],
    ['es', [Tags.Language.Spanish]],
    ['fa', []],
    ['fi', []],
    ['fr', [Tags.Language.French]],
    ['he', []],
    ['hi', []],
    ['hu', []],
    ['id', [Tags.Language.Indonesian]],
    ['it', [Tags.Language.Italian]],
    ['ja', [Tags.Language.Japanese]],
    ['ko', [Tags.Language.Korean]],
    ['lt', []],
    ['mn', []],
    ['ms', []],
    ['my', []],
    ['ne', []],
    ['nl', []],
    ['no', []],
    ['pl', [Tags.Language.Polish]],
    ['pt', [Tags.Language.Portuguese]],
    ['ro', []],
    ['ru', [Tags.Language.Russian]],
    ['sh', []],
    ['sv', []],
    ['th', [Tags.Language.Thai]],
    ['tl', []],
    ['tr', [Tags.Language.Turkish]],
    ['uk', []],
    ['vi', [Tags.Language.Vietnamese]],
    ['zh', [Tags.Language.Chinese]],
]);

export default class extends MangaScraper {

    private readonly api = 'https://api.mangadex.org';
    private readonly chaptersTaskPool = new TaskPool(1, new RateLimit(4, 1));

    public constructor() {
        super('mangadex', 'MangaDex', 'https://mangadex.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/title/`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const regexGUID = /[a-fA-F0-9]{8}-([a-fA-F0-9]{4}-){3}[a-fA-F0-9]{12}/;
        const id = (uri.pathname.match(regexGUID) || uri.hash.match(regexGUID))[0].toLowerCase();
        const request = new Request(`${this.api}/manga/${id}`, { headers: { Referer: this.URI.href }});
        const { data: { attributes: { title: titles } } } = await FetchJSON<APIManga>(request);
        const title = titles.en || Object.values(titles).at(0);
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaCache = await FetchJSON<CachedMangas>(new Request(`https://websites.hakuneko.download/${this.Identifier}.json`));
        return mangaCache.map(({ id, title }) => new Manga(this, provider, id, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return (await Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run; page++) {
                const chapters = await this.chaptersTaskPool.Add(() => this.FetchChaptersFromPage(manga, page), Priority.Normal);
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this))).reverse();
    }

    private async FetchChaptersFromPage(manga: Manga, page: number) {

        function pad(number: string, places: number): string {
            // '17', '17.5', '17-17.5', '17 - 17.5', '17-123456789'
            return number.split('-').map(chapter => {
                chapter = chapter.trim();
                const digits = chapter.split('.')[0].length;
                return '0'.repeat(Math.max(0, places - digits)) + chapter;
            }).join('-');
        }

        const uri = new URL('/chapter', this.api);
        uri.searchParams.set('limit', '100');
        uri.searchParams.set('offset', `${100 * page}`);
        uri.searchParams.set('manga', manga.Identifier);
        uri.searchParams.append('includes[]', 'scanlation_group');
        uri.searchParams.append('contentRating[]', 'safe');
        uri.searchParams.append('contentRating[]', 'suggestive');
        uri.searchParams.append('contentRating[]', 'erotica');
        uri.searchParams.append('contentRating[]', 'pornographic');

        const request = new Request(uri.href, { headers: { Referer: this.URI.href }});
        const { data } = await FetchJSON<APIChapters>(request);

        return !data ? [] : data
            .filter(entry => entry.attributes.pages && !entry.attributes.isUnavailable)
            .map(entry => {
                const groups = entry.relationships.filter(relation => relation.type === 'scanlation_group' && relation.attributes?.name);
                const title = [
                    entry.attributes.volume && `Vol.${pad(entry.attributes.volume, 2)}`,
                    entry.attributes.chapter && `Ch.${pad(entry.attributes.chapter, 4)}`,
                    entry.attributes.title && `- ${entry.attributes.title}`,
                    entry.attributes.translatedLanguage && `(${entry.attributes.translatedLanguage})`,
                    groups.length > 0 ? `[${groups.map(group => group.attributes.name).join(', ')}]`: null,
                ].joinTitleSegments();
                const languageCode = entry.attributes.translatedLanguage?.split('-')?.shift();
                return new Chapter(this, manga, entry.id, title.trim(), ...chapterLanguageMap.get(languageCode) ?? []);
            });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const request = new Request(`${this.api}/at-home/server/${chapter.Identifier}`, { headers: { Referer: this.URI.href }});
        const { baseUrl, chapter: { hash, data: files } } = await FetchJSON<APIMedia>(request);
        return files.map(file => {
            const slug = [ '/data', hash, file ].join('/');
            return new Page(this, chapter, new URL(`https://uploads.mangadex.org${slug}`), { Referer: this.URI.href, Mirror: baseUrl + slug });
        });
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        try {
            return await Common.FetchImageAjax.call(this, page, priority, signal, false);
        } catch {
            const source = new Page(this, page.Parent as Chapter, new URL(page.Parameters.Mirror), page.Parameters);
            return Common.FetchImageAjax.call(this, source, priority, signal, false);
        }
    }

    public override async GetChapterURL(chapter: Chapter): Promise<URL> {
        return new URL(`/chapter/${chapter.Identifier}`, this.URI);
    }
}