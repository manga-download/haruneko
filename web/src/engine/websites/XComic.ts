import { Tags } from '../Tags';
import icon from './MangaDex.webp';
import { FetchGraphQL } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { RateLimit } from '../taskpool/RateLimit';
import { Priority, TaskPool } from '../taskpool/TaskPool';

//TODO: Map languages on chapters
//TODO: Chapters Optimizations
//TODO: ICON

type APIMangas = {
    get_title_browse_items: {
        id: string;
        data: APIManga;
    }[];
};

type APIManga = {
    id: string;
    title: string;
    comic_ids: string[];
};

type APITitleNode = {
    get_title_titleNode: {
        data: APIManga
    };
};

type APIComicProbe = {
    get_comicNode: {
        id: string;
        data: {
            subName: string;
            dbStatus: string;
            isPublic: boolean;
            translatedLanguage: string;
            chaps_normal: number;
        };
    };
};

type ChapterSource = {
    id: string;
    name: string;
    translatedLanguage: string;
    chapterCount: number;
};

type APIChapterList = {
    get_comic_chapterList_fullList: {
        items: {
            data: {
                id: string;
                dname: string;
                chaNum: number;
            };
        }[];
    };
};

type ChapterData = {
    id: string;
    dname: string;
    chaNum: number;
    language: string;
    source: string;
};

type APIPages = {
    get_chapterNode: {
        data: {
            imageUrls: string[];
        };
    };
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/query/`;
    private readonly chaptersTaskPool = new TaskPool(1, new RateLimit(4, 1));

    public constructor() {
        super('xcomic', 'XComic', 'https://xcomic.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/title/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { get_title_titleNode: { data: { id, title } } } = await FetchGraphQL<APITitleNode>(new Request(this.apiURL), 'get_title_titleNode', `
            query get_title_titleNode($id: ID!) {
                get_title_titleNode(id: $id) {
                    data {
                        id
                        title
                    }
                }
            }
        `, { id: url.split('/').at(-1)});
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const perPage = 100;
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { get_title_browse_items } = await FetchGraphQL<APIMangas>(new Request(this.apiURL), 'get_title_browse', `
                    query get_title_browse($select: Title_Browse_Select) {
                        get_title_browse_items(select: $select) {
                            id
                            data {
                                title
                            }
                        }
                    }
                `, {
                    select: {
                        page, size: perPage, init: (page - 1) * perPage,
                    }
                });

                const mangas = get_title_browse_items.map(({ id, data: { title } }) => new Manga(this, provider, id, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const sources = await this.GetChapterSources(manga.Identifier);
        const chapters: ChapterData[] = [];

        for (const source of sources) {
            for (let page = 1, run = true; run; page++) {
                const { get_comic_chapterList_fullList: { items } } = await FetchGraphQL<APIChapterList>(new Request(this.apiURL), 'get_comic_chapterList_fullList', `
                     query get_comic_chapterList_fullList($select: Select_Comic_ChapterList) {
                         get_comic_chapterList_fullList(select: $select) {
                             items {
                                 data {
                                     id
                                     dname
                                     chaNum
                                 }
                             }
                         }
                     }
                 `, {
                    select: {
                        comic_id: source.id,
                        page,
                        size: 1000,
                        sortby: 'chapter_desc',
                    }
                });

                const chaptersData = items.map(({ data: { id, dname, chaNum } }) => ({ id, dname, chaNum, language: source.translatedLanguage, source: source.name }));
                chapters.push(...chaptersData);
                run = items.length > 0;
            }
        }

        return chapters
            .sort((self, other) => other.chaNum - self.chaNum)
            .map(({ id, dname, source, language }) => new Chapter(this, manga, id, [dname, source, language].joinTitleSegments()));
    }

    private async GetChapterSources(mangaId: string): Promise<ChapterSource[]> {
        // 1) gather all chapter sources ID
        const { get_title_titleNode: { data: { comic_ids } } } = await FetchGraphQL<APITitleNode>(new Request(this.apiURL), 'get_title_titleNode', `
            query get_title_titleNode($id: ID!) {
                get_title_titleNode(id: $id) {
                    id
                    data {
                        id
                        title
                        comic_ids
                    }
                }
            }
        `, { id: mangaId });

        // 2) Fetch all ChapterSource infos
        const promises = comic_ids.map(sourceId => this.chaptersTaskPool.Add(async () => {
            const { get_comicNode: { id, data: { subName, translatedLanguage, dbStatus, chaps_normal, isPublic } } } = await FetchGraphQL<APIComicProbe>(new Request(this.apiURL), 'get_comicNode', `
                query get_comicNode($id: ID!) {
                    get_comicNode(id: $id) {
                        id
                        data {
                            subName
                            dbStatus
                            isPublic
                            translatedLanguage
                            chaps_normal
                        }
                    }
                }
            `, { id: sourceId });
            return {
                id,
                name: subName,
                translatedLanguage,
                dbStatus,
                isPublic,
                chapterCount: chaps_normal
            };

        }, Priority.Normal));

        const sources = (await Promise.all(promises))
            .filter(({ isPublic, dbStatus }) => isPublic != false && (dbStatus === null || dbStatus === "normal"));
        return sources;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { get_chapterNode: { data: { imageUrls } } } = await FetchGraphQL<APIPages>(new Request(this.apiURL), 'get_chapterNode', `
            query get_chapterNode($id: ID!) {
                get_chapterNode(id: $id) {
                    data {
                        imageUrls
                    }
                }
            }
        `, { id: chapter.Identifier });
        return imageUrls.map(image => new Page(this, chapter, new URL(image)));
    }
}