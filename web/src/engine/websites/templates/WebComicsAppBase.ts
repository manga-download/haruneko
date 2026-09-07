import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';

type APIResult<T> = {
    code: number;
    msg: string;
    data: T;
};

type APIList<T> = {
    list: T[];
};

type APIManga = {
    book_id: string;
    name: string;
};

type APIChapter = {
    index: number;
    chapter_id: string;
    name: string;
    base_url: string;
    images: {
        url: string;
    }[];
};

type APIMangas = APIList<APIManga>;
type APIChapters = APIList<APIChapter>;

const languageMap = {
    en: 0, id: 1, fr: 5, pt: 6, es: 7
};

@Common.ImageAjax()
export class WebComicsAppBase extends DecoratableMangaScraper {
    private language = 'en';
    private readonly apiURL = 'https://official-website-api.webcomicsapp.com/api/web/v4/';
    private udid: string;
    private userChannel: string = '0';

    public WithLanguageCode(code: string): WebComicsAppBase {
        this.language = code;
        return this;
    }

    public override async Initialize(): Promise<void> {
        // TODO: Update the token whenever the user performs a login/logout through manual website interaction
        const { udid, channel } = await FetchWindowScript<{ udid: string, channel: number }>(new Request(this.URI), `
            new Promise(async (resolve, reject) => {
                try {
                    resolve({
                        udid: localStorage.getItem('udid') || null,
                        channel: await cookieStore.get('userChannel').then(({ value }) => value ?? 0).catch(error => 0)
                    });
                } catch (error) {
                    reject(error)
                }
            })`
            , 1500);
        this.udid = udid;
        this.userChannel = `${channel}`;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/${this.language}/[^/]+/[^/]+/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { book_id: id, name } = await this.FetchAPI<APIManga>('./book/info', {
            book_id: url.split('/').at(-1)
        });
        return new Manga(this, provider, id, name);
    }

    public override async FetchMangas(provider): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { list } = await this.FetchAPI<APIMangas>('./genre/books', {
                    category: '0',
                    page,
                    size: 200,
                    sort: 1,
                    status: '0'
                });
                const mangas = list.map(({ book_id: id, name }) => new Manga(this, provider, id, name));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { list } = await this.FetchAPI<APIChapters>('./book/chapter/list', {
                    book_id: manga.Identifier,
                    page,
                    size: 200,
                    sort: 'desc',
                });
                const chapters = list.map(({ chapter_id: id, name, index }) => new Chapter(this, manga, `${id}/${index}`, name));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [chapterId, chapterIndex] = chapter.Identifier.split('/');
        const { images, base_url } = await this.FetchAPI<APIChapter>('./book/chapter/detail', {
            book_id: chapter.Parent.Identifier,
            chapter_id: chapterId,
            index: parseInt(chapterIndex)
        });
        return images.map(({ url }) => new Page(this, chapter, new URL(url, base_url)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, body: JSONElement): Promise<T> {
        return (await FetchJSON<APIResult<T>>(new Request(new URL(endpoint, this.apiURL), {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                lang: languageMap[this.language],
                Origin: this.URI.origin,
                Udid: this.udid,
                UserChannel: this.userChannel
            }
        }))).data;
    }
}