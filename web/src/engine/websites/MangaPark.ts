import { Tags } from '../Tags';
import icon from './MangaPark.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchGraphQL, FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

type APIMangas = {
    get_searchComic: {
        items: APIManga[]
    }
}

type APISingleManga = {
    get_comicNode: APIManga
}

type APIManga = {
    data: {
        id: string,
        name: string,
        tranLang: string
    }
}

type APIChapters = {
    get_comicChapterList: APIChapter[]
}

type APIChapter = {
    data: {
        id: string,
        dateCreate: number,
        dname: string,
        title: string
    }
}

type APIPages = {
    get_chapterNode: {
        data: {
            imageFile: {
                urlList: string[]
            }
        }
    }
}

const primaryDomain = 'mangapark.org';
const patternAliasDomains = [
    primaryDomain,
    'mangapark.net',
    'mangapark.com',
    'mangapark.me',
    'mangapark.io',
    'mangapark.to',
    'comicpark.org',
    'comicpark.to',
    'readpark.org',
    'readpark.net',
    'parkmanga.com',
    'parkmanga.net',
    'parkmanga.org',
    'mpark.to',
].join('|').replaceAll('.', '\\.');

const mangaLanguageMap = new Map([
    ['en', Tags.Language.English],
    ['fr', Tags.Language.French],
]);

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    protected apiURL = `${this.URI.origin}/apo/`;

    public constructor() {
        super('mangapark', 'MangaPark', `https://${primaryDomain}`, Tags.Media.Manhwa, Tags.Media.Manga, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await FetchWindowScript(new Request(this.URI), `window.cookieStore.set('nsfw', '2');`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^https?://(${patternAliasDomains})/title/\\d+[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const query = `
            query get_comicNode($comicId: ID!) {
                get_comicNode(id: $comicId) {
                    data { id, name, tranLang }
                }
            }
        `;

        const variables = {
            comicId: new URL(url).pathname.match(/\/title\/(\d+)/).at(1)
        };

        const { get_comicNode: { data } } = await FetchGraphQL<APISingleManga>(this.CreateRequest(), 'get_comicNode', query, variables);
        return this.CreateManga(provider, data);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const query = `
            query get_searchComic($select: SearchComic_Select) {
                get_searchComic(select: $select) {
                    paging { pages }
                    items { data { id, name, tranLang } }
                }
            }
        `;

        const variables = {
            select: { page }
        };

        const { get_searchComic: { items } } = await FetchGraphQL<APIMangas>(this.CreateRequest(), 'get_searchComic', query, variables);
        return items.map(item => this.CreateManga(provider, item.data));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const query = `
            query Get_comicChapterList($comicId: ID!) {
                get_comicChapterList(comicId: $comicId) {
                    data { id, dateCreate, dname, title }
                } 
            }
        `;

        const variables = {
            comicId: manga.Identifier
        };

        const { get_comicChapterList } = await FetchGraphQL<APIChapters>(this.CreateRequest(), 'Get_comicChapterList', query, variables);
        return get_comicChapterList
            .sort((a, b) => b.data.dateCreate - a.data.dateCreate)
            .map(chapter => new Chapter(this, manga, chapter.data.id, (chapter.data.title ? `${chapter.data.dname} - ${chapter.data.title}` : chapter.data.dname).trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const query = `
            query Get_chapterNode($getChapterNodeId: ID!) {
                get_chapterNode(id: $getChapterNodeId) {
                    data { imageFile { urlList } }
                }
            }
        `;

        const variables = {
            getChapterNodeId: chapter.Identifier
        };

        const { get_chapterNode: { data: { imageFile: { urlList } } } } = await FetchGraphQL<APIPages>(this.CreateRequest(), 'Get_chapterNode', query, variables);
        return urlList.map(page => new Page(this, chapter, new URL(page), { Referer: this.URI.href }));
    }

    private CreateManga(provider: MangaPlugin, data: APIManga['data']): Manga {
        const title = new DOMParser().parseFromString(`${data.name} [${data.tranLang}]`, 'text/html').documentElement.innerText.trim();
        const tags = [ mangaLanguageMap.get(data.tranLang) ].filter(tag => tag);
        return new Manga(this, provider, data.id, title, ...tags);
    }

    private CreateRequest(): Request {
        return new Request(new URL(this.apiURL), {
            headers: {
                Referer: this.URI.href,
                Cookie: 'nsfw=2'
            }
        });
    }
}