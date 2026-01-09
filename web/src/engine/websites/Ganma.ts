import { Tags } from '../Tags';
import icon from './Ganma.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchGraphQL } from '../platform/FetchProvider';
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
};

type APIMagazineDetails = {
    magazineId: string;
    isWebOnlySensitive: boolean;
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

type MangaId = {
    magazineId: string;
    isWebOnlySensitive: boolean;
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private apiUrl = 'https://ganma.jp/api/graphql';

    public constructor() {
        super('ganma', `GANMA!`, 'https://ganma.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/web/magazine/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { magazine } = await this.FetchAPI<APIMagazine>('magazineDetail', { magazineIdOrAlias: url.split('/').at(-1) }, '9a1460a42f8d04c70b23bb9ad763d0dbef2eb6f5d05dafca98ca2be8a2bfe867');
        return this.CreateManga(magazine, provider);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangasList: Manga[] = [];
        for (let run = true, after = undefined; run;) {
            const { magazinesByCategory: { magazines: { edges, pageInfo: { endCursor, hasNextPage } } } } = await this.FetchAPI<APIFinishedMagazines>('finishedMagazines', { after },
                'ade49c46df5ef36f15485df70f656fb14f3261e90863fcd9ffbcc10baf30bc4c');
            const mangas = edges.map(({ node }) => this.CreateManga(node, provider));
            mangasList.push(...mangas);
            after = endCursor;
            run = hasNextPage;
        }
        return mangasList;
    }

    private CreateManga(mangasData: APIMagazineDetails, provider: MangaPlugin): Manga {
        const { magazineId, title, isWebOnlySensitive } = mangasData;
        return new Manga(this, provider, JSON.stringify({ magazineId, isWebOnlySensitive: !!isWebOnlySensitive }), title);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { magazineId, isWebOnlySensitive } = JSON.parse(manga.Identifier) as MangaId;
        const chaptersList: Chapter[] = [];
        for (let run = true, after = undefined; run;) {
            const { magazine: { storyInfos: { edges, pageInfo: { endCursor, hasNextPage } } } } = await this.FetchAPI<APIMagazine>('storyInfoList',
                {
                    magazineIdOrAlias: magazineId,
                    first: 100,
                    after
                }, 'acd460c52a231029d09e1ccca0aa06b99ae8163d5edff661cd64984ebb6dc4c3', !isWebOnlySensitive);
            const chapters = edges.map(({ node: { storyId, title, subtitle } }) => new Chapter(this, manga, storyId, [title, subtitle].join(' ').trim()));
            chaptersList.push(...chapters);
            after = endCursor;
            run = hasNextPage;
        }
        return chaptersList;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { magazineId, isWebOnlySensitive } = JSON.parse(chapter.Parent.Identifier) as MangaId;
        const { magazine: { storyContents } } = await this.FetchAPI<APIMagazine>('magazineStoryForReader', {
            magazineIdOrAlias: magazineId,
            storyId: chapter.Identifier,
        }, 'de907920c909c7ba40a7b6cad5a4b2f3760a4e6a9a871239663c522f3983506f', !isWebOnlySensitive);

        if (storyContents.error || !storyContents.pageImages) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        const { pageCount, pageImageBaseURL, pageImageSign } = storyContents.pageImages;
        return new Array(pageCount).fill(0).map((_, index) => index + 1).map(page => new Page(this, chapter, new URL(`${pageImageBaseURL}${page}.jpg?${pageImageSign}`)));
    }

    private async FetchAPI<T extends JSONElement>(operation: string, variables: JSONObject, queryID: string, useAppHeaders: boolean = true, queryVersion = 1): Promise<T> {
        const request = new Request(new URL(this.apiUrl), {
            headers: {
                'X-From': this.URI.href + 'web',
            }
        });
        if (useAppHeaders) request.headers.set('User-Agent', 'GanmaReader / 9.9.1 Android');
        return FetchGraphQL<T>(request, operation, undefined, variables, {
            persistedQuery: {
                sha256Hash: queryID,
                version: queryVersion,
            }
        });
    }
}