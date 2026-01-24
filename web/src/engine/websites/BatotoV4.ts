import { Tags } from '../Tags';
import icon from './Batoto.webp';
import { DecoratableMangaScraper, Manga, Chapter, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchGraphQL } from '../platform/FetchProvider';

const primaryDomain = 'xbat.app';
const patternAliasDomains = [
    primaryDomain,
    'xbat.si',
    'xbat.io',
    'xbat.me',
    'xbat.tv',
    'xbat.la',
].join('|').replaceAll('.', '\\.');

type APISingleManga = {
    get_comicNode: {
        data: {
            id: string;
            name: string;
        }
    };
};

type APIMangas = {
    get_comic_browse: {
        items: {
            data: {
                id: string;
                name: string;
            }
        }[]
    }
};

type APIChapters = {
    get_comic_chapterList: {
        data: {
            id: string;
            dname: string;
        }
    }[];
};

type APIPages = {
    get_chapterNode: {
        data: {
            imageFile: {
                urlList: string[]
            }
        }
    }
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = `${this.URI.origin}/ap2/`;

    public constructor() {
        super('batotoV4', 'Batoto V4', `https://${primaryDomain}`, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^https://${patternAliasDomains}/title/\\d+-[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const query = `
            query get_comicNode($id: ID!) {
                get_comicNode(id: $id) {
                    data {
                        id
                        name
                    }
                }
            }
        `;

        const { get_comicNode: { data: { id, name } } } = await FetchGraphQL<APISingleManga>(new Request(new URL(this.apiUrl)), 'get_comicNode', query, {
            id: url.match(/\/title\/(\d+)/).at(1)
        });
        return new Manga(this, provider, id, name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const query = `
           query ($select: Comic_Browse_Select) {
            get_comic_browse(select: $select) {
                paging {
                    next
                }
                items {
                    data {
                        id
                        name
                    }
                }
            }
        }
        `;

        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { get_comic_browse: { items } } = await FetchGraphQL<APIMangas>(new Request(new URL(this.apiUrl)), undefined, query, {
                    select: {
                        page
                    }
                });
                const mangas = items.map(({ data: { id, name } }) => new Manga(this, provider, id, name));
                mangas.length > 0 ? yield* mangas : run = false;
            }

        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const query = `
            query get_comic_chapterList($comicId: ID!, $start: Int) {
                get_comic_chapterList(comicId: $comicId, start: $start) {
                    data {
                        id
                        dname
                    }
                }
            }
        `;

        const { get_comic_chapterList } = await FetchGraphQL<APIChapters>(new Request(new URL(this.apiUrl)), 'get_comic_chapterList', query, {
            comicId: manga.Identifier, start: -1
        });
        return get_comic_chapterList.map(({ data: { id, dname } }) => new Chapter(this, manga, id, dname));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const query = `
            query get_chapterNode($id: ID!) {
                get_chapterNode(id: $id) {
                    data {
                        imageFile {
                            urlList
                        }
                    }
                }
            }
        `;

        const { get_chapterNode: { data: { imageFile: { urlList } } } } = await FetchGraphQL<APIPages>(new Request(new URL(this.apiUrl)), 'get_chapterNode', query, {
            id: chapter.Identifier
        });
        return urlList.map(page => new Page(this, chapter, new URL(page)));
    }
}