import { Tags } from '../Tags';
import icon from './MangaDex.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import { TaskPool, Priority } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';
import * as Grouple from './decorators/Grouple';

type APIContainer<T> = {
    data: T;
};

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
    mirrors: string[];
};

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

@Grouple.ImageWithMirrors()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.mangadex.org/';
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
        const { data: { attributes: { title: titles } } } = await this.FetchAPI<APIManga>(`./manga/${ id }`);
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

        const uri = new URL(`./chapter?limit=100&offset=${100 * page}&manga=${manga.Identifier}&includes[]=scanlation_group`, this.apiURL);
        uri.searchParams.append('contentRating[]', 'safe');
        uri.searchParams.append('contentRating[]', 'suggestive');
        uri.searchParams.append('contentRating[]', 'erotica');
        uri.searchParams.append('contentRating[]', 'pornographic');

        const { data } = await this.FetchAPI<APIChapters>(uri.href);

        return !data ? [] : data
            .filter(({ attributes: { pages, isUnavailable } }) => pages && !isUnavailable)
            .map(({ id, attributes, relationships }) => {
                const groups = relationships.filter(relation => relation.type === 'scanlation_group' && relation.attributes?.name);
                const title = [
                    attributes.volume && `Vol.${pad(attributes.volume, 2)}`,
                    attributes.chapter && `Ch.${pad(attributes.chapter, 4)}`,
                    attributes.title && `- ${attributes.title}`,
                    attributes.translatedLanguage && `(${attributes.translatedLanguage})`,
                    groups.length > 0 ? `[${groups.map(group => group.attributes.name).join(', ')}]` : null,
                ].joinTitleSegments();
                const languageCode = attributes.translatedLanguage?.split('-')?.shift();
                return new Chapter(this, manga, id, title.trim(), ...chapterLanguageMap.get(languageCode) ?? []);
            });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { baseUrl, chapter: { hash, data: files } } = await this.FetchAPI<APIMedia>(`./at-home/server/${chapter.Identifier}`);
        return files.map(file => {
            const slug = ['/data', hash, file].join('/');
            return new Page(this, chapter, new URL(`https://uploads.mangadex.org${slug}`), { Referer: this.URI.href, mirrors: [baseUrl + slug] });
        });
    }

    public async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiURL), {
            headers: {
                'User-Agent': 'Hakuneko 10.0',
                Referer: this.URI.href
            }
        }));
    }
}