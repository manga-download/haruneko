import { Tags } from '../Tags';
import icon from './Comico.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Fetch } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

export type APIResult<T> = {
    result: {
        code: number
    },
    data: T
}

type ApiMangas = {
    contents: {
        id: number,
        type: string,
        name: string,
    }[],
    page: ApiPagination
}

type ApiPagination = {
    currentPageNo: number,
    hasNext: boolean
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

export type ApiChapters = {
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

type MangaID = {
    id: string,
    lang: string
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    protected api = 'https://api.comico.jp';
    protected mangaPaths = ['new_release', 'read_for_free'];

    public constructor(id = 'comico', label = `Comico (コミコ)`, url = 'https://www.comico.jp', tags = [Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official]) {
        super(id, label, url, ...tags);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/\\S+/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname;
        const data = await this.fetchPOST<APIResult<ApiChapters>>(id, 'ja-JP');
        const title = data.data.volume?.content?.name ?? data.data.episode.content.name;
        return new Manga(this, provider, JSON.stringify({ id: id, lang: 'ja-JP' }), title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return this.FetchMangasLanguages(provider, ['ja-JP']);
    }

    protected async FetchMangasLanguages(provider: MangaPlugin, languages: string[]): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (const language of languages) {
            for (const path of this.mangaPaths) {
                for (let page = 0, run = true; run; page++) {
                    const data = await this.fetchPOST<APIResult<ApiMangas>>(`/all_comic/${path}?pageNo=${page}`, language);
                    const mangas = data.result.code != 200 ? [] : data.data.contents.map(manga => new Manga(this, provider, JSON.stringify({ id: `/${manga.type}/${manga.id}`, lang: language }), manga.name));
                    mangas.length > 0 ? mangaList.push(...mangas) : run = false;
                }
            }
        }
        return mangaList.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { id, lang }: MangaID = JSON.parse(manga.Identifier);
        const data = await this.fetchPOST<APIResult<ApiChapters>>(id, lang);
        //episode or volume?
        const element = data.data.episode?.content ?? data.data.volume.content;
        return element.chapters
            .filter(chapter => chapter.activity.rented || chapter.activity.unlocked || chapter.salesConfig.free)
            .map(chapter => new Chapter(this, manga, String(chapter.id), chapter.name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const{ id, lang }: MangaID = JSON.parse(chapter.Parent.Identifier);
        const data = await this.fetchPOST<APIResult<ApiPage>>(`${id}/chapter/${chapter.Identifier}/product`, lang);
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

    async fetchPOST<T>(path: string, language: string): Promise<T> {
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
                'x-referer': this.URI.origin,
                'x-origin': this.URI.origin,
                'accept': 'application/json, text/plain, */*',
                'Accept-Language': language,
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