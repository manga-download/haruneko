import { Tags } from '../Tags';
import icon from './Ganma.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchGraphQL } from '../platform/FetchProvider';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import { Exception } from '../Error';

type APIMagazine = {
    magazine: {
        magazineId: string,
        title: string,
        storyInfos: {
            edges: {
                node: APIStory
            }[]
        }
        storyContents: APIPages
    }
}

type APIStory = {
    storyId: string,
    title: string,
    subtitle: string | null,
    isPurchased: boolean
}

type APIPages = {
    pageImages: {
        pageCount: number,
        pageImageBaseURL: string,
        pageImageSign: string
    } | undefined
}

type APIRanking = {
    ranking: {
        totalRanking: {
            magazineId: string,
            title: string
        }[]
    }
}

type APIMagazineCompleted = {
    magazinesByCategory: {
        magazines: {
            edges: {
                node: {
                    magazineId: string,
                    title: string
                }
            }[]
        }
    }
}

const queryMagazine = `
    query MagazineDetail($magazineIdOrAlias: String!) {
      magazine(magazineIdOrAlias: $magazineIdOrAlias) {
        magazineId
        title
        storyInfos(first: 9999) {
          edges {
            node {
              ...MagazineDetailStoryInfo
            }
          }
        }
      }
    }
    fragment MagazineDetailStoryInfo on StoryInfo {
      storyId
      title
      subtitle
      isPurchased
    }
`;

const queryPages = `
    query magazineStoryForReader($magazineIdOrAlias: String!, $storyId: String!) {
      magazine(magazineIdOrAlias: $magazineIdOrAlias) {
        storyContents(storyId: $storyId) {
          ... on StoryContents {
            pageImages {
              pageCount
              pageImageBaseURL
              pageImageSign
            }
          }
        }
      }
    }
`;

const queryRanking = `
    query MagazineRankingTotal {
      ranking {
        totalRanking {
          ...rankingMagazineFragment
        }
      }
    }
    fragment rankingMagazineFragment on Magazine {
      magazineId
      title
    }
`;

const queryFinishedMagazines = `
    query finishedMagazines($after: String) {
      magazinesByCategory(category: FINISHED) {
        magazines(after: $after, first: 99999) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              magazineId
              alias
              title
            }
          }
        }
      }
    }

`;

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://ganma.jp/api/graphql';

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
        const mangaId = new URL(url).pathname.split('/').at(-1);
        const { magazine: { magazineId, title } } = await FetchGraphQL<APIMagazine>(this.CreateRequest(), 'MagazineDetail', queryMagazine, { magazineIdOrAlias: mangaId });
        return new Manga(this, provider, magazineId, title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return [
            ...await this.GetMangasTop(provider),
            ...await this.GetMangasCompleted(provider)
        ].distinct();
    }

    private async GetMangasCompleted(provider: MangaPlugin): Promise<Manga[]> {
        const { magazinesByCategory: { magazines: { edges } } } = await FetchGraphQL<APIMagazineCompleted>(this.CreateRequest(), 'finishedMagazines', queryFinishedMagazines, {});
        return edges.map(manga => new Manga(this, provider, manga.node.magazineId, manga.node.title));
    }

    private async GetMangasTop(provider: MangaPlugin): Promise<Manga[]> {
        const { ranking: { totalRanking } } = await FetchGraphQL<APIRanking>(this.CreateRequest(), 'MagazineRankingTotal', queryRanking, {});
        return totalRanking.map(manga => new Manga(this, provider, manga.magazineId, manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { magazine: { storyInfos: { edges } } } = await FetchGraphQL<APIMagazine>(this.CreateRequest(), 'MagazineDetail', queryMagazine, { magazineIdOrAlias: manga.Identifier });
        return edges.map(chapter => new Chapter(this, manga, chapter.node.storyId, [chapter.node.title, chapter.node.subtitle || ''].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { magazine: { storyContents: { pageImages } } } = await FetchGraphQL<APIMagazine>(this.CreateRequest(), 'magazineStoryForReader', queryPages, { magazineIdOrAlias: chapter.Parent.Identifier, storyId: chapter.Identifier });
        if (!pageImages) throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        return new Array<Page>(pageImages.pageCount).fill(null).map((_, index) => new Page(this, chapter, new URL(`${pageImages.pageImageBaseURL}${index + 1}.jpg?${pageImages.pageImageSign}`)));
    }

    private CreateRequest(): Request {
        return new Request(new URL(this.apiUrl), {
            headers: {
                'X-From': this.URI.href
            }
        });
    }
}