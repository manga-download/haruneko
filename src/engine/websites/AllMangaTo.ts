import { Delay } from '../BackgroundTimers';
import { FetchGraphQL } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { Tags } from '../Tags';
import icon from './AllMangaTo.webp';
import * as Common from './decorators/Common';

type APIMangas = {
    mangas: {
        edges: APIManga[];
    };
};

type APIManga = {
    _id: string;
    name: string;
    englishName: string | null;
};

type APIChapters = {
    episodeInfos: APIChapter[];
};

type TranslationKeys = 'sub' | '[raw]';

type APIChapter = {
    episodeIdNum: number;
    notes?: string;
    uploadDates: Record<TranslationKeys, never>;
};

type APIPages = {
    chapterPages: {
        edges: {
            pictureUrlHead: string;
            pictureUrls: {
                url: string;
            }[];
        }[];
    };
};

type ChapterID = {
    id: string;
    translationType: string;
};

// TODO: Check for possible revision

@Common.MangaCSS<HTMLUListElement>(/{origin}\/manga\/[^/]+$/, 'ol.breadcrumb li:last-of-type', (li, uri) => ({ id: uri.href.split('/').at(-1), title: li.innerText.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.allanime.day/api';

    public constructor() {
        super('allmanga', `AllManga.to`, 'https://allmanga.to', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
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
            query ($page: Int) {
                mangas(
                    search: {
                        isManga: true
                        allowAdult: true
                        allowUnknown: false
                    }
                    page: $page
                    limit: 20
                    countryOrigin: ALL
                ) {
                    edges {
                        _id
                        name
                        englishName
                    }
                }
            }
        `;

        const data = await this.FetchAPI<APIMangas>(query, { page: page });
        return data?.mangas?.edges ? data.mangas.edges.map(manga => new Manga(this, provider, manga._id, manga.englishName ?? manga.name)) : [];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const query = `
            query ($id: String!) {
                episodeInfos(
                    showId: $id
                    episodeNumStart: 0
                    episodeNumEnd: 9999
                ) {
                    episodeIdNum
                    notes
                    uploadDates
                }
            }
        `;

        const { episodeInfos } = await this.FetchAPI<APIChapters>(query, { id: `manga@${manga.Identifier}` });

        episodeInfos.sort((self, other) => other.episodeIdNum - self.episodeIdNum);
        return episodeInfos.reduce((accumulator: Chapter[], entry) => {
            const chapters = Object.keys(entry.uploadDates).map((key: TranslationKeys) => {
                const title = [
                    'Chapter',
                    entry.episodeIdNum,
                    entry.notes ? '-' : '',
                    entry.notes ?? '',
                    key === 'sub' ? '' : '[raw]',
                ].filter(segment => segment).join(' ').trim();
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
        let { pictureUrlHead, pictureUrls } = edges.at(0);
        pictureUrlHead = pictureUrlHead ?? this.URI.origin;
        const domain = (/^https?:\/\//).test(pictureUrlHead) ? pictureUrlHead : 'https://' + pictureUrlHead;
        return pictureUrls.map(({ url }) => new Page(this, chapter, new URL(url, domain)));
    }

    private async FetchAPI<T extends JSONElement>(query: string, variables: JSONObject): Promise<T> {
        return await FetchGraphQL<T>(new Request(new URL(this.apiUrl)), '', query, variables);
    }
}