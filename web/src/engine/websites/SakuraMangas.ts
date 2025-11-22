import { Tags } from '../Tags';
import icon from './MangaDex.webp';
import { Fetch, FetchCSS, FetchHTML, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import { GetBytesFromBase64, GetBytesFromHex, GetBytesFromUTF8, GetHexFromBytes } from '../BufferEncoder';
import type { Priority } from '../taskpool/DeferredTask';

class DrmProvider {
    constructor(private readonly clientURL: URL, private readonly apiURL: URL) { };

    private readonly keypair = {
        key_01: 'a1b2c3d4-g0h2-i3j4k5l6m7n7-e5f5-7891',
        key_02: 'z8y8x7w6-v2u3-3210-r7q6p5o4n3n2-t9s8'
    };

    private readonly cinfo = {
        manga_info: 8106199014740981,
        chapter_read: 9007099254040970
    };

    public async FetchAPI<T extends JSONElement>(endpoint: string, postData: Record<string, string>, referer: string = this.clientURL.href, signed: boolean = false) {

        const headers: HeadersInit = {
            Origin: this.clientURL.origin,
            Referer: referer,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };

        if (signed) {
            const sourceData = await FetchHTML(new Request(new URL(referer)));
            const securityKeyName = sourceData.querySelector<HTMLMetaElement>('meta[name="security-key-name"]').content.trim();

            const mangaInfo = this.cinfo[securityKeyName];
            const challenge = sourceData.querySelector<HTMLMetaElement>('meta[name="header-challenge"]').content.trim();
            const token = sourceData.querySelector<HTMLMetaElement>('meta[name="csrf-token"]').content.trim();
            const proof = await this.GenerateHeaderProof(challenge, mangaInfo);

            headers['X-Client-Signature'] = 'FTY9K-SY6WY-96LKPM';
            headers['X-CSRF-Token'] = token;
            headers['X-Verification-Key-1'] = this.keypair.key_01;
            headers['X-Verification-Key-2'] = this.keypair.key_02;

            postData['challenge'] = challenge;
            postData['proof'] = proof;
        };

        const request = new Request(new URL(endpoint, this.apiURL), {
            method: 'POST',
            headers,
            body: new URLSearchParams(postData)
        });

        return FetchJSON<T>(request);
    }

    private async GenerateHeaderProof(challenge: string, mangaInfo: string) {
        if (!challenge || !mangaInfo) {
            return null;
        }

        const length = 23;
        try {
            const decodedChallenge = String.fromCharCode(...GetBytesFromBase64(challenge));
            const decodedChallengeArray = decodedChallenge.split("/");
            if (decodedChallengeArray.length !== 3) {
                return null;
            }
            const element1 = decodedChallengeArray[0];
            const element3 = decodedChallengeArray[2];
            const UA = navigator.userAgent;
            const message = element1 + UA + mangaInfo + element3;
            let result = message;
            for (let index = 0; index < length; index++) {
                const _byteArray = new TextEncoder().encode(result);
                const hash = await crypto.subtle.digest("SHA-256", _byteArray);
                const finalarray = Array.from(new Uint8Array(hash));
                result = finalarray.map(el => el.toString(16).padStart(2, "0")).join("");
            }
            return result;
        } catch (error) {
            console.error("Falha ao gerar prova de cabeçalho:", error);
            return null;
        }
    }

}

type APIMangas = {
    html: string;
};

type APIChapters = {
    data: {
        numero: number;
    }[]
};

type APIPages = {
    data: {
        encryptedUrls: string;
        encryptedImageKey: string;
        encryptedEphemeralKey: {
            cipher: string;
            payload: string;
        }
    }
};

const mangaScript = `
    new Promise( resolve => {
        resolve({
            id: window.location.pathname,
            title : document.querySelector('div.inicio h1.h1-titulo').textContent.trim()
        });
    });
`;

export default class extends DecoratableMangaScraper {
    #drmProvider = new DrmProvider(this.URI, new URL('https://sakuramangas.org/dist/sakura/models/'));

    public constructor() {
        super('sakuramangas', 'Sakura Mangás', 'https://sakuramangas.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/obras/[^/]+\/$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, title } = await FetchWindowScript<{ id: string, title: string }>(new Request(new URL(url)), mangaScript);
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { html } = await this.#drmProvider.FetchAPI<APIMangas>('./obras/__.obras__buscar.php', {
            search: '',
            order: '3',
            offset: '0',
            limit: '9999',
            demography: '',
            classification: ''
        });

        const nodes = [...new DOMParser().parseFromString(html, 'text/html').querySelectorAll<HTMLAnchorElement>('div.result-item a.text-white:has(h5)')];
        return nodes.map(element => new Manga(this, provider, `${element.pathname}/`, element.text.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaUrl = new URL(manga.Identifier, this.URI);
        const mangaId = (await FetchCSS<HTMLMetaElement>(new Request(mangaUrl), 'meta[manga-id]')).at(0).getAttribute('manga-id').trim();
        const { data } = await this.#drmProvider.FetchAPI<APIChapters>('./manga/.__obf__manga_capitulos.php', {
            manga_id: mangaId,
            offset: '0',
            order: 'desc',
            limit: '9999',
        }, mangaUrl.href, true);
        return data.map(({ numero }) => new Chapter(this, manga, `${manga.Identifier}${numero}/`, `Cap ${numero}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        const doc = await FetchHTML(new Request(chapterUrl));
        const chapterID = doc.querySelector<HTMLMetaElement>('meta[chapter-id]').getAttribute('chapter-id').trim();
        const token = doc.querySelector<HTMLMetaElement>('meta[token]').getAttribute('token').trim();
        const subtoken = doc.querySelector<HTMLMetaElement>('meta[subtoken]').getAttribute('subtoken').trim();

        const { data: { encryptedEphemeralKey: { payload }, encryptedImageKey, encryptedUrls } } = await this.#drmProvider.FetchAPI<APIPages>('./capitulo/__obf__capitulos__read.php', {
            chapter_id: chapterID,
            token,
        }, chapterUrl.href, true);

        const decoded = this.XOR(encryptedUrls, this.XOR(encryptedImageKey, await this.Decipher(payload, subtoken)));
        const pageArray: string[] = JSON.parse(decoded);
        return pageArray.map(page => new Page(this, chapter, new URL(page, chapterUrl), { Referer: chapterUrl.href }));

    }

    private XOR(data: string, key: string): string {
        const decoded = String.fromCharCode(...GetBytesFromBase64(data));//_0x16c314.atob(data);
        let result = '';
        for (let index = 0; index < decoded.length; index++) {
            result += String.fromCharCode(decoded.charCodeAt(index) ^ key.charCodeAt(index % key.length));
        }
        return result;
    }

    private async Decipher(payload: string, subtoken: string): Promise<string> {
        const payloadBytes = GetBytesFromBase64(payload);
        const subtokenHashBytes = GetBytesFromHex(await this.Sha256(subtoken));

        const array1 = [];
        const dataview1 = new DataView(new Uint8Array(subtokenHashBytes).buffer);
        for (let index = 0; index < dataview1.byteLength; index += 4) {
            if (index + 4 <= dataview1.byteLength) {
                array1.push(dataview1.getUint32(index, true));
            }
        }
        const array1Length = array1.length;
        const dataview2 = new DataView(new Uint8Array(payloadBytes).buffer);
        const uintArray1 = new Uint8Array(payloadBytes.length);
        const dataview3 = new DataView(uintArray1.buffer);
        for (let index = 0; index < dataview2.byteLength; index += 4) {
            if (index + 4 <= dataview2.byteLength) {
                const _0x2c2602 = dataview2.getUint32(index, true);
                dataview3.setUint32(index, _0x2c2602 ^ array1[index / 4 % array1Length], true);
            }
        }
        let str1 = Array.from(uintArray1).map(c => String.fromCharCode(c)).join('');//this._bytesToString(uintArray1);
        const number1 = str1.charCodeAt(str1.length - 1);
        if (number1 > 0 && number1 <= 4) {
            let flag = true;
            for (let index = 1; index <= number1; index++) {
                if (str1.charCodeAt(str1.length - index) !== number1) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                str1 = str1.slice(0, - number1);
            }
        }
        return str1;
    }

    private async Sha256(text: string): Promise<string> {
        const buffer = await crypto.subtle.digest('SHA-256', GetBytesFromUTF8(text));
        return GetHexFromBytes(new Uint8Array(buffer));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const blob = await (await Fetch(new Request(page.Link, {
                headers: {
                    Referer: page.Parameters.Referer,
                    'X-Requested-With': 'SakuraFetchClient',
                    'X-Signature-Version': '2-xhr-custom',
                    'Sec-Fetch-Site': 'same-origin'
                }
            }))).blob();
            return blob;
        }, priority, signal);
    }
}