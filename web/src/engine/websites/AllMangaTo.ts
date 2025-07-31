import { Tags } from '../Tags';
import icon from './AllMangaTo.webp';
import { Chapter, Page } from '../providers/MangaPlugin';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchGraphQL } from '../platform/FetchProvider';
import { Delay } from '../BackgroundTimers';

type APIMangas = {
    mangas: {
        edges: APIManga[],
    }
}

type APIManga = {
    _id: string,
    englishName: string | null,
    name: string,
}

type APIChapters = {
    episodeInfos: APIChapter[]
}

type APIChapter = {
    episodeIdNum: number,
    notes: string,
    uploadDates: {
        sub: string,
        raw: string
    }[]
}

type APIPages = {
    chapterPages: {
        edges: {
            pictureUrlHead: string,
            pictureUrls: {
                url: string
            }[]
        }[]
    }
}

type ChapterID = {
    id: string,
    translationType: string
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.allanime.day/api';

    public constructor() {
        super('allmangato', `AllManga.to`, 'https://allmanga.to', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const title = (await FetchCSS(new Request(new URL(url)), 'ol.breadcrumb li:last-of-type')).shift().textContent.trim();
        return new Manga(this, provider, url.match(/\/manga\/([^/]+)/)[1], title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            await Delay(200);
            const mangas = await this.GetMangasFromPage(page, provider);
            mangaList.isMissingLastItemFrom(mangas) ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const query = `
            query (
                $search: SearchInput
                $size: Int
                $page: Int
                $countryOrigin: VaildCountryOriginEnumType
            ) {
                mangas(
                    search: $search
                    limit: $size
                    page: $page
                    countryOrigin: $countryOrigin
                ) {
                    edges {
                        _id
                        name
                        englishName
                    }
                }
            }        
        `;

        const data = await this.FetchAPI<APIMangas>(query, {
            search: {
                isManga: true,
                allowAdult: true,
                allowUnknown: false,
            },
            size: 20,
            page: page,
            countryOrigin: 'ALL'
        });
        return data?.mangas?.edges ? data.mangas.edges.map(manga => new Manga(this, provider, manga._id, manga.englishName ?? manga.name)) : [];

    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const query = `
            query ($id: String!, $chapterNumStart: Float!, $chapterNumEnd: Float!) {
                episodeInfos(
                    showId: $id
                    episodeNumStart: $chapterNumStart
                    episodeNumEnd: $chapterNumEnd
                ) {
                    episodeIdNum
                    notes
                    uploadDates
                }
            }
        `;

        const { episodeInfos } = await this.FetchAPI<APIChapters>(query, {
            id: `manga@${manga.Identifier}`,
            chapterNumStart: 0,
            chapterNumEnd: 9999
        });

        episodeInfos.sort((a, b) => b.episodeIdNum - a.episodeIdNum);
        return episodeInfos.reduce((accumulator: Chapter[], entry) => {
            const chapters = Object.keys(entry.uploadDates).map(key => {
                const title = `Chapter ${entry.episodeIdNum} ${entry.notes ?? ''} ${key != 'sub' ? '[raw]' : ''}`.trim();
                return new Chapter(this, manga, JSON.stringify({ id: entry.episodeIdNum.toString(), translationType: key }), title);
            });
            accumulator.push(...chapters);
            return accumulator;
        }, []);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { id: chapterId, translationType }: ChapterID = JSON.parse(chapter.Identifier);
        const query = `
            query (
                $id: String!
                $translationType: VaildTranslationTypeMangaEnumType!
                $chapterNum: String!
            ) {
                chapterPages(
                    mangaId: $id
                    translationType: $translationType
                    chapterString: $chapterNum
                ) {
                    edges {
                        pictureUrls
                        pictureUrlHead
                    }
                }
            }
        `;

        const { chapterPages: { edges } } = await this.FetchAPI<APIPages>(query, {
            id: chapter.Parent.Identifier,
            chapterNum: chapterId,
            translationType
        });
        const server = edges.at(0);
        if (!server.pictureUrlHead) server.pictureUrlHead = this.URI.origin;
        const domain = (/^https?:\/\//).test(server.pictureUrlHead) ? server.pictureUrlHead : `https://${server.pictureUrlHead}`;
        return server.pictureUrls.map(picture => new Page(this, chapter, new URL(picture.url, domain)));
    }

    private async FetchAPI<T extends JSONElement>(query: string, variables: JSONObject): Promise<T> {
        return await FetchGraphQL<T>(new Request(new URL(this.apiUrl)), '', query, variables);
    }

}