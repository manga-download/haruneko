import { Tags } from '../Tags';
import icon from './Comico.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import { GetHexFromBytes, GetBytesFromUTF8, GetBytesFromBase64 } from '../BufferEncoder';

type APIResult<T> = {
    data: T;
};

type APIMangas = {
    contents: {
        id: number;
        type: string;
        name: string;
    }[];
};

type APIChapter = {
    activity: {
        rented: boolean;
        unlocked: boolean;
    };
    salesConfig: {
        free: boolean;
    };
    id: number;
    name: string;
};

type APIChapters = {
    episode?: {
        content: {
            chapters: APIChapter[];
            name?: string;
        }
    };
    volume?: {
        content: {
            chapters: APIChapter[];
            name?: string;
        }
    };
};

type APIPage = {
    content: {
        chapterFileFormat: string;
    };
    chapter: {
        images: APIImage[];
        epub: EPUBData;
    }
};

type EPUBData = {
    chapterEpubIncludedFile: {
        m2Parameter: {
            optimize: string;
        };
        parameter: string;
        rootFileName: string;
        rootPath: string;
        url: string;
    };
};

type APIImage = {
    url: string;
    parameter: string;
};

type MangaID = {
    id: string;
    lang: string;
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly keyData = GetBytesFromUTF8('a7fc9dc89f2c873d79397f8a0028a4cd');
    private readonly apiUrl = 'https://api.comico.jp';

    public constructor() {
        super('comico', 'Comico (コミコ)', 'https://www.comico.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/(magazine_)?comic/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname;
        const { volume: { content: volumeContent }, episode: { content: episodeContent } } = await this.FetchPOST<APIChapters>(id, 'ja-JP');
        return new Manga(this, provider, JSON.stringify({ id, lang: 'ja-JP' }), (volumeContent ?? episodeContent).name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (const language of ['ja-JP']) {
            for (const path of ['new_release', 'read_for_free']) {
                for (let page = 0, run = true; run; page++) {
                    const { contents } = await this.FetchPOST<APIMangas>(`./all_comic/${path}?pageNo=${page}`, language);
                    const mangas = contents.map(({ id, name, type }) => new Manga(this, provider, JSON.stringify({ id: `/${type}/${id}`, lang: language }), name));
                    mangas.length > 0 ? mangaList.push(...mangas) : run = false;
                }
            }
        }
        return mangaList.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { id, lang }: MangaID = JSON.parse(manga.Identifier);
        const { volume: { content: volumeContent }, episode: { content: episodeContent } } = await this.FetchPOST<APIChapters>(id, lang);
        return (episodeContent ?? volumeContent).chapters
            .filter(({ activity: { rented, unlocked }, salesConfig: { free } }) => rented || unlocked || free)
            .map(({ id, name }) => new Chapter(this, manga, `${id}`, name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { id, lang }: MangaID = JSON.parse(chapter.Parent.Identifier);
        const { content: { chapterFileFormat }, chapter: { images, epub } } = await this.FetchPOST<APIPage>(`${id}/chapter/${chapter.Identifier}/product`, lang);
        if (chapterFileFormat === 'epub') {
            return await this.DecryptEpub(chapter, epub);
        }
        return Promise.all(images.map(async page => {
            return new Page(this, chapter, new URL(await this.DecryptPictureUrl(page)));
        }));
    }

    public override async GetChapterURL(chapter: Chapter): Promise<URL> {
        const { id }: MangaID = JSON.parse(chapter.Parent.Identifier);
        return new URL(`/comic/${id}/chapter/${chapter.Identifier}/product`, this.URI);
    }

    async DecryptEpub(chapter: Chapter, epub: EPUBData): Promise<Page[]> {
        const { chapterEpubIncludedFile } = epub;
        const { rootPath, rootFileName, url: opfUrl, parameter: opfParameter, m2Parameter } = chapterEpubIncludedFile;

        const epubRootUrl = new TextDecoder('utf-8').decode(await this.AESDecrypt(GetBytesFromBase64(opfUrl))) + rootPath;
        const epubUrl = `${epubRootUrl}${rootFileName}?${opfParameter}`;

        const response = await Fetch(new Request(new URL(epubUrl)));
        const XML = new DOMParser().parseFromString(await response.text(), 'text/xml');

        return [...XML.querySelectorAll('item[media-type^="image/"]')].map(element => {
            return new Page(this, chapter, new URL(`${epubRootUrl}${element.getAttribute('href')}${m2Parameter.optimize}?${opfParameter}`));
        });
    }

    private async DecryptPictureUrl(page: APIImage): Promise<string> {
        const decrypted = await this.AESDecrypt(GetBytesFromBase64(page.url));
        return new TextDecoder('utf-8').decode(decrypted) + '?' + page.parameter;
    }

    private async AESDecrypt(data: Uint8Array<ArrayBuffer>): Promise<ArrayBuffer> {
        const algorithm = { name: 'AES-CBC', iv: new Uint8Array(16).buffer };
        const secretKey = await crypto.subtle.importKey('raw', this.keyData, algorithm, false, ['decrypt']);
        return await crypto.subtle.decrypt(algorithm, secretKey, data);
    }

    protected async FetchPOST<T extends JSONElement>(path: string, language: string): Promise<T> {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const seed = GetBytesFromUTF8('9241d2f090d01716feac20ae08ba791a' + '0.0.0.0' + `${timestamp}`);
        const checksum = GetHexFromBytes(new Uint8Array(await crypto.subtle.digest('SHA-256', seed)));
        return (await FetchJSON<APIResult<T>>(new Request(new URL(path, this.apiUrl), {
            method: 'GET',
            headers: {
                'x-referer': this.URI.origin,
                'x-origin': this.URI.origin,
                'Accept-Language': language,
                'X-comico-client-os': 'other',
                'X-comico-client-store': 'other',
                'X-comico-request-time': `${timestamp}`,
                'X-comico-check-sum': checksum,
                'X-comico-timezone-id': 'Europe/Paris',
                'X-comico-client-immutable-uid': '0.0.0.0',
                'X-comico-client-platform': 'web',
                'X-comico-client-accept-mature': 'Y',
            }
        }))).data as T;
    }
}