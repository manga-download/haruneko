import { Tags } from '../Tags';
import icon from './Ganma.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchCSS, FetchGraphQL } from '../platform/FetchProvider';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type APIFinishedMagazines = {
    magazinesByCategory: {
        magazines: {
            edges: {
                node: APIMagazineDetails
            }[];
            pageInfo: PageInfo
        }
    }
};

type APIMagazine = {
    magazine: APIMagazineDetails;
};

type PageInfo = {
    endCursor: string;
    hasNextPage: boolean;
}

type APIMagazineDetails = {
    magazineId: string;
    title: string;
    storyInfos: {
        edges: {
            node: APIChapter
        }[]
        pageInfo: PageInfo
    },
    storyContents: {
        error: string;
        pageImages?: {
            pageCount: number;
            pageImageBaseURL: string;
            pageImageSign: string;
        }
    }
};

type APIChapter = {
    storyId: string;
    title: string;
    subtitle: string;
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private queryHashesMap = new Map<string, string>();
    private apiUrl = 'https://ganma.jp/api/graphql';

    public constructor() {
        super('ganma', `GANMA!`, 'https://ganma.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        //Website forces persistedQueries so we gather queries hashes from scripts
        const scriptUrl = (await FetchCSS<HTMLScriptElement>(new Request(this.URI), 'script[src*="/app/layout-"]')).at(0).getAttribute('src');
        const scriptData = await (await Fetch(new Request(new URL(scriptUrl, this.URI)))).text();
        for (const match of scriptData.matchAll(/id:"([a-f0-9]{64})",body:".*?",name:"(\w+)"/g)) {
            this.queryHashesMap.set(match[2], match[1]);// queryName, queryHash
        }
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/web/magazine/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { magazine: { magazineId, title } } = await this.FetchAPI<APIMagazine>('magazineDetail', { magazineIdOrAlias: url.split('/').at(-1) });
        return new Manga(this, provider, magazineId, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangasList: Manga[] = [];
        for (let run = true, after = undefined; run;) {
            const { magazinesByCategory: { magazines: { edges, pageInfo: { endCursor, hasNextPage } } } } = await this.FetchAPI<APIFinishedMagazines>('finishedMagazines', { after });
            const mangas = edges.map(({ node: { magazineId, title } }) => new Manga(this, provider, magazineId, title));
            mangasList.push(...mangas);
            after = endCursor;
            run = hasNextPage;
        }
        return mangasList;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chaptersList: Chapter[] = [];
        for (let run = true, after = undefined; run;) {
            const variables = {
                magazineIdOrAlias: manga.Identifier,
                first: 100,
                after
            };
            const { magazine: { storyInfos: { edges, pageInfo: { endCursor, hasNextPage } } } } = await this.FetchAPI<APIMagazine>('storyInfoList', variables);
            const chapters = edges.map(({ node: { storyId, title, subtitle } }) => new Chapter(this, manga, storyId, [title, subtitle].join(' ').trim()));
            chaptersList.push(...chapters);
            after = endCursor;
            run = hasNextPage;
        }
        return chaptersList;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const variables = {
            magazineIdOrAlias: chapter.Parent.Identifier,
            storyId: chapter.Identifier,
        };
        const { magazine: { storyContents } } = await this.FetchAPI<APIMagazine>('magazineStoryForReader', variables);
        if (storyContents.error || !storyContents.pageImages) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        const { pageCount, pageImageBaseURL, pageImageSign } = storyContents.pageImages;
        return new Array(pageCount).fill(0).map((_, index) => index + 1).map(page => new Page(this, chapter, new URL(`${pageImageBaseURL}${page}.jpg?${pageImageSign}`)));
    }

    private async FetchAPI<T extends JSONElement>(operation: string, variables: JSONObject): Promise<T> {
        return FetchGraphQL<T>(new Request(new URL(this.apiUrl), {
            headers: {
                'User-Agent': 'GanmaReader / 9.9.1 Android',
                'X-From': this.URI.href + 'web',
                'Content-Type': 'application/json;charset=UTF-8',
                Accept: 'application/json, text/plain, */*'
            }
        }), operation, undefined, variables, {
            persistedQuery: {
                sha256Hash: this.queryHashesMap.get(operation),
                version: 1,
            }
        });
    }
}