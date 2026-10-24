import { Tags } from '../Tags';
import icon from './XComic.webp';
import { FetchCSS, FetchGraphQL } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
//import { RateLimit } from '../taskpool/RateLimit';
//import { TaskPool } from '../taskpool/TaskPool';

//TODO: Chapters Optimizations
//TODO: Use a prefered language setting to reduce requests ?
//TODO: Clean code

type APIMangas = {
    get_title_browse_items: {
        id: string;
        data: APIManga;
    }[];
};

type APIMangasPagination = {
    get_title_browse_pager: {
        pages: number;
    };
};

type APIManga = {
    id: string;
    title: string;
    comic_ids: string[];
};

/*
type APIChapterSource = {
    get_comicNode: {
        id: string;
        data: {
            name: string;
            subName: string;
            dbStatus: string;
            isPublic: boolean;
            translatedLanguage: string;
            chaps_normal: number;
        };
    };
};
*/

type ChapterSource = {
    id: string;
    subName: string;
    translatedLanguage: string;
    //chapterCount: number;
};

type APIChapterList = {
    get_comic_chapterList_fullList: {
        paging: {
            next: number;
        };
        items: {
            data: {
                id: string;
                dname: string;
                chaNum: number;
            };
        }[];
    };
};

type APIPages = {
    get_chapterNode: {
        data: {
            imageUrls: string[];
        };
    };
};

/*
const chapterLanguageMap = new Map([
    ['ar', Tags.Language.Arabic],
    ['de', Tags.Language.German],
    ['en', Tags.Language.English],
    ['es', Tags.Language.Spanish],
    ['es-419', Tags.Language.Spanish],
    ['fr', Tags.Language.French],
    ['id', Tags.Language.Indonesian],
    ['it', Tags.Language.Italian],
    ['ko', Tags.Language.Korean],
    ['pl', Tags.Language.Polish],
    ['pt', Tags.Language.Portuguese],
    ['pt_BR', Tags.Language.Portuguese],
    ['ru', Tags.Language.Russian],
    ['th', Tags.Language.Thai],
    ['tr', Tags.Language.Turkish],
    ['vi', Tags.Language.Vietnamese],
    ['zh', Tags.Language.Chinese],
    ['zh_hk', Tags.Language.Chinese]
]);*/

const chapterLanguageMap = new Map([
    ['🇸🇦', Tags.Language.Arabic],
    ['🇩🇪', Tags.Language.German],
    ['🇬🇧', Tags.Language.English],
    ['🇪🇸', Tags.Language.Spanish],
    ['🇲🇽', Tags.Language.Spanish], // es_419 uses the Mexican flag
    ['🇫🇷', Tags.Language.French],
    ['🇮🇩', Tags.Language.Indonesian],
    ['🇮🇹', Tags.Language.Italian],
    ['🇰🇷', Tags.Language.Korean],
    ['🇵🇱', Tags.Language.Polish],
    ['🇵🇹', Tags.Language.Portuguese],
    ['🇧🇷', Tags.Language.Portuguese], // pt_BR uses the Brazilian flag
    ['🇷🇺', Tags.Language.Russian],
    ['🇹🇭', Tags.Language.Thai],
    ['🇹🇷', Tags.Language.Turkish],
    ['🇻🇳', Tags.Language.Vietnamese],
    ['🇨🇳', Tags.Language.Chinese],
    ['🇭🇰', Tags.Language.Chinese]// zh_hk uses the Hong Kong flag
]);

@Common.MangaCSS(/^https:\/\/xcomic\.(me|net)\/title\/[^/]+$/, 'h1 a.link[href^="/title/"]', (element, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: element.textContent.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/query/`;
    //private readonly chaptersTaskPool = new TaskPool(1, new RateLimit(4, 1));

    public constructor() {
        super('xcomic', 'XComic', 'https://xcomic.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const perPage = 120;

        //get Max pages because last request would fail otherwise
        const { get_title_browse_pager: { pages } } = await FetchGraphQL<APIMangasPagination>(new Request(this.apiURL), 'get_title_browse_pager', `
            query get_title_browse_pager($select: Title_Browse_Select) {
                get_title_browse_pager(select: $select) {
                    pages
                }
            }
            `, { select: { page: 1, size: perPage } }
        );

        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1; page <= pages; page++) {
                const { get_title_browse_items } = await FetchGraphQL<APIMangas>(new Request(this.apiURL), 'get_title_browse', `
                    query get_title_browse($select: Title_Browse_Select) {
                        get_title_browse_items(select: $select) {
                            id
                            data {
                                title
                            }
                        }
                    }
                `, { select: { page, size: perPage, init: (page - 1) * perPage } }
                );

                const mangas = get_title_browse_items.map(({ id, data: { title } }) => new Manga(this, provider, id, title));
                yield* mangas;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const sources = await this.GetChapterSources(manga.Identifier);
        type This = typeof this;
        const chaptersData = await Array.fromAsync(async function* (this: This) {
            for (const source of sources) {
                for (let page = 1, run = true; run; page++) {
                    const { get_comic_chapterList_fullList: { items, paging: { next } } } = await FetchGraphQL<APIChapterList>(new Request(this.apiURL), 'get_comic_chapterList_fullList', `
                        query get_comic_chapterList_fullList($select: Select_Comic_ChapterList) {
                            get_comic_chapterList_fullList(select: $select) {
                                paging {
                                    next
                                }
                                items {
                                    data {
                                        id
                                        dname
                                        chaNum
                                    }
                                }
                            }
                        }
                    `, { select: { comic_id: source.id, page, size: 1000, sortby: 'chapter_desc' } }
                    );

                    const chaptersData = items.map(({ data: { id, dname, chaNum } }) => ({ id, name: dname, chaNum, language: source.translatedLanguage, sourceSubname: source.subName }));
                    yield* chaptersData;
                    run = page < next;
                }
            }
        }.call(this));

        // DUPLICATE CHAPTERS TITLE HANDLING: append source ID to duplicated chapters names
        const preprocessed = chaptersData
            .sort((self, other) => other.chaNum - self.chaNum)
            .map((item) => {
                const { name, sourceSubname, language } = item; // Removed 'id' here
                const subtitle = `${(sourceSubname ?? '').replace(manga.Title, '').trim()}`;
                const baseTitle = [name, subtitle ? `[${subtitle}]` : undefined, `[${language}]`].joinTitleSegments();
                return { item, baseTitle };
            });

        const titleCounts = preprocessed.reduce((acc, { baseTitle }) => {
            acc.set(baseTitle, (acc.get(baseTitle) || 0) + 1);
            return acc;
        }, new Map<string, number>());

        return preprocessed.map(({ item, baseTitle }) => {
            const { id, language } = item;
            const finalTitle = titleCounts.get(baseTitle) > 1 ? `${baseTitle} [${id}]` : baseTitle;
            return new Chapter(this, manga, id, finalTitle, ...[chapterLanguageMap.get(language)].filter(Boolean));
        });
    }

    private async GetChapterSources(mangaId: string): Promise<ChapterSource[]> {

        /*
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
            const { get_comicNode: { id, data: { name, subName, translatedLanguage, dbStatus, chaps_normal, isPublic } } } = await FetchGraphQL<APIChapterSource>(new Request(this.apiURL), 'get_comicNode', `
                query get_comicNode($id: ID!) {
                    get_comicNode(id: $id) {
                        id
                        data {
                            name
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
                name,
                subName,
                translatedLanguage,
                dbStatus,
                isPublic,
                chapterCount: chaps_normal
            };

        }, Priority.Normal));

        const sources = (await Promise.all(promises))
            .filter(({ isPublic, dbStatus, chapterCount }) => isPublic != false && (dbStatus === null || dbStatus === 'normal') && chapterCount > 0);
        return sources;
        */

        //Alternative: get sources by fetching HTML
        const elements = await FetchCSS(new Request(new URL(`/title/${mangaId}`, this.URI)), 'div.grid div.border');
        return elements.map(element => {
            return {
                id: element.querySelector<HTMLAnchorElement>('a[href^="/source/"]').pathname.split('/').at(-1), //id
                subName: element.querySelector(`div[${CSS.escape(':')}="1a_8"]`)?.textContent.trim(), //source subname
                translatedLanguage: element.querySelector('span.mr-1').textContent.trim() // language EMOJI
            };
        });
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