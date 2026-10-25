import { Tags } from '../Tags';
import icon from './XComic.webp';
import { FetchCSS, FetchGraphQL } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIMangas = {
    get_title_browse_items: {
        id: string;
        data: {
            title: string;
        };
    }[];
};

type APIMangasPagination = {
    get_title_browse_pager: {
        pages: number;
    };
};

type APIChapters = {
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

const chapterLanguageMap = new Map([
    ['🇸🇦', { locale: 'ar', tags: [Tags.Language.Arabic] }],
    ['🇩🇪', { locale: 'de', tags: [Tags.Language.German] }],
    ['🇬🇧', { locale: 'en', tags: [Tags.Language.English] }],
    ['🇪🇸', { locale: 'es', tags: [Tags.Language.Spanish] }],
    ['🇲🇽', { locale: 'es_MX', tags: [Tags.Language.Spanish] }],
    ['🇫🇷', { locale: 'fr', tags: [Tags.Language.French] }],
    ['🇮🇩', { locale: 'id', tags: [Tags.Language.Indonesian] }],
    ['🇮🇹', { locale: 'it', tags: [Tags.Language.Italian] }],
    ['🇰🇷', { locale: 'ko', tags: [Tags.Language.Korean] }],
    ['🇵🇱', { locale: 'pl', tags: [Tags.Language.Polish] }],
    ['🇵🇹', { locale: 'pt', tags: [Tags.Language.Portuguese] }],
    ['🇧🇷', { locale: 'pt_BR', tags: [Tags.Language.Portuguese] }],
    ['🇷🇺', { locale: 'ru', tags: [Tags.Language.Russian] }],
    ['🇹🇭', { locale: 'th', tags: [Tags.Language.Thai] }],
    ['🇹🇷', { locale: 'tr', tags: [Tags.Language.Turkish] }],
    ['🇻🇳', { locale: 'vi', tags: [Tags.Language.Vietnamese] }],
    ['🇨🇳', { locale: 'zh', tags: [Tags.Language.Chinese] }],
    ['🇭🇰', { locale: 'zh_HK', tags: [Tags.Language.Chinese] }],
]);

@Common.MangaCSS(/^https:\/\/xcomic\.(me|net)\/title\/[^/]+$/, 'h1 a.link[href^="/title/"]', (element, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: element.textContent.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    readonly #apiURL = `${this.URI.origin}/query/`;

    public constructor() {
        super('xcomic', 'XComic', 'https://xcomic.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        const perPage = 120;
        const { get_title_browse_pager: { pages } } = await FetchGraphQL<APIMangasPagination>(new Request(this.#apiURL), 'get_title_browse_pager', `
            query get_title_browse_pager($select: Title_Browse_Select) {
                get_title_browse_pager(select: $select) { pages }
            }
        `, { select: { page: 1, size: perPage } });
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1; page <= pages; page++) {
                const { get_title_browse_items } = await FetchGraphQL<APIMangas>(new Request(this.#apiURL), 'get_title_browse', `
                    query get_title_browse($select: Title_Browse_Select) {
                        get_title_browse_items(select: $select) { id data { title } }
                    }
                `, { select: { page, size: perPage, init: (page - 1) * perPage } });
                yield* get_title_browse_items.map(({ id, data: { title } }) => new Manga(this, provider, id, title));
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        const chapters = await Array.fromAsync(async function* (this: This) {
            for (const source of await this.#GetChapterSources(manga.Identifier)) {
                for (let page = 1, run = true; run; page++) {
                    const delay = new Promise<void>(resolve => setTimeout(resolve, 250));
                    const { get_comic_chapterList_fullList: { items, paging: { next } } } = await FetchGraphQL<APIChapters>(new Request(this.#apiURL), 'get_comic_chapterList_fullList', `
                        query get_comic_chapterList_fullList($select: Select_Comic_ChapterList) {
                            get_comic_chapterList_fullList(select: $select) {
                                paging { next }
                                items { data { id dname chaNum } }
                            }
                        }
                    `, { select: { comic_id: source.id, page, size: 9999, sortby: 'chapter_desc' } });
                    yield* items.map(({ data: { id, dname, chaNum } }) => ({
                        id,
                        order: chaNum,
                        title: [
                            dname,
                            `(${chapterLanguageMap.get(source.locale)?.locale || source.locale})`,
                            `[${source.name?.replace(manga.Title, '').trim() || source.id.toUpperCase()}]`
                        ].joinTitleSegments(),
                        tags: chapterLanguageMap.get(source.locale)?.tags ?? [],
                    }));
                    page <= next ? await delay : run = false;
                }
            }
        }.call(this));

        return chapters
            .sort((self, other) => other.order - self.order)
            .map(({ id, title, tags }) => new Chapter(this, manga, id, title, ...tags));
    }

    async #GetChapterSources(mangaId: string) {
        const elements = await FetchCSS(new Request(new URL(`/title/${mangaId}`, this.URI)), 'div.grid div.border');
        return elements.map(element => ({
            id: element.querySelector<HTMLAnchorElement>('a[href^="/source/"]').pathname.split('/').at(-1),
            name: element.querySelector(`div[${CSS.escape(':')}="1a_8"]`)?.textContent.trim(),
            locale: element.querySelector('span.mr-1').textContent.trim()
        }));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { get_chapterNode: { data: { imageUrls } } } = await FetchGraphQL<APIPages>(new Request(this.#apiURL), 'get_chapterNode', `
            query get_chapterNode($id: ID!) {
                get_chapterNode(id: $id) { data { imageUrls } }
            }
        `, { id: chapter.Identifier });
        return imageUrls.map(image => new Page(this, chapter, new URL(image)));
    }
}