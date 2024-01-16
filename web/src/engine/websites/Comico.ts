import { Tags } from '../Tags';
import icon from './Comico.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Fetch } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

type APIResult<T> = {
    result: {
        code: number
    },
    data: T
}

type ApiMangas = {
    contents: {
        id: number,
        type: string,
        name: string
    }[]
}

type ApiChapter = {
    activity: {
        rented: boolean,
        unlocked: boolean
    },
    salesConfig: {
        free: boolean
    },
    id: number,
    name: string
}

type ApiChapters = {
    episode: {
        content: {
            chapters: ApiChapter[]
            name?: string,
        }
    },
    volume: {
        content: {
            chapters: ApiChapter[]
            name?: string,
        }
    }
}

type ApiPage = {
    content: {
        chapterFileFormat: string
    },
    chapter: {
        images: ApiImage[]
    }
}

type ApiImage = {
    url: string,
    parameter: string
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly api = 'https://api.comico.jp';

    public constructor() {
        super('comico', `Comico (コミコ)`, 'https://comico.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/\\S+/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname;
        const data = await this.fetchPOST<APIResult<ApiChapters>>(id);
        const title = data.data.volume.content != null ? data.data.volume.content.name : data.data.episode.content.name;
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const data = await this.fetchPOST<APIResult<ApiMangas>>(`/all_comic/new_release?pageNo=${page}&pageSize=50`);
        return data.result.code != 200 ? [] : data.data.contents.map(manga => new Manga(this, provider, `/${manga.type}/${manga.id}`, manga.name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const data = await this.fetchPOST<APIResult<ApiChapters>>(manga.Identifier);
        //episode or volume?
        const element = data.data.episode.content != null ? data.data.episode.content : data.data.volume.content;
        return element.chapters
            .filter(chapter => chapter.activity.rented || chapter.activity.unlocked || chapter.salesConfig.free)
            .map(chapter => new Chapter(this, manga, String(chapter.id), chapter.name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await this.fetchPOST<APIResult<ApiPage>>(`${chapter.Parent.Identifier}/chapter/${chapter.Identifier}/product`);
        if (data.data.content.chapterFileFormat == 'epub') {
            throw Error('This chapter is an Epub :/');
        }
        const pages = [];
        for (const page of data.data.chapter.images) {
            pages.push(await this.decryptPictureUrl(page));
        }
        return pages.map(image => new Page(this, chapter, new URL(image)));
    }

    async decryptPictureUrl(page: ApiImage): Promise<string> {
        const AESKey = 'a7fc9dc89f2c873d79397f8a0028a4cd';
        const iv = new Uint8Array(16).buffer;//empty IV, just a 16 bytes buffer
        const passPhrase = Buffer.from(AESKey, 'utf-8');
        const secretKey = await crypto.subtle.importKey(
            'raw',
            passPhrase,
            {
                name: 'AES-CBC',
                length: 128
            }, true, ['encrypt', 'decrypt']);

        const decrypted = await crypto.subtle.decrypt({
            name: 'AES-CBC',
            iv: iv
        }, secretKey, Buffer.from(page.url, 'base64'),);

        return new TextDecoder('utf-8').decode(decrypted) + '?' + page.parameter;
    }

    async fetchPOST<T>(path: string): Promise<T> {
        const webkey = '9241d2f090d01716feac20ae08ba791a';
        const ip = '0.0.0.0';
        const tm = Math.round(new Date().getTime() / 1000);
        const plaintext = new TextEncoder().encode(webkey + ip + String(tm));
        const hash = await crypto.subtle.digest('SHA-256', plaintext);
        const checksum = Buffer.from(hash).toString('hex');
        const uri = new URL(path, this.api);
        const request = new Request(uri.href, {
            method: 'GET',
            headers: {
                'x-referer': this.URI.href,
                'x-origin': this.URI.href,
                'accept': 'application/json, text/plain, */*',
                'Accept-Language': 'ja-JP',
                'X-comico-client-os': 'other',
                'X-comico-client-store': 'other',
                'X-comico-request-time': String(tm),
                'X-comico-check-sum': checksum,
                'X-comico-timezone-id': 'Europe/Paris',
                'X-comico-client-immutable-uid': '0.0.0.0',
                'X-comico-client-platform': 'web',
                'X-comico-client-accept-mature': 'Y',
            }
        });
        const response = await Fetch(request);
        const data = await response.text();
        return JSON.parse(data) as T;
    }
}