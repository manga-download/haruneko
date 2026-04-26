import { Tags } from '../Tags';
import icon from './QToon.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { RandomText } from '../Random';
import { GetBase64FromBytes, GetBytesFromBase64, GetBytesFromUTF8, GetHexFromBytes } from '../BufferEncoder';

type CookiesAndTokens = {
    did: string;
    uid: string;
    profile: string;
    token: string;
};

type EncryptedResult = {
    data: string;
    ts: number;
};

type APIMangas = {
    comics: APIManga[];
};

type APIManga = {
    csid: string;
    title: string;
    languageType: string;
};

type APIMangaDetails = {
    comic: APIManga;
    episodes: APIChapter[];
};

type APIChapter = {
    esid: string;
    title: string;
};

type ChapterToken = {
    definitions: {
        token: string;
    }[]
};

type APIPages = {
    resources: {
        url: string;
    }[];
};

const chapterLanguageMap = new Map([
    ['es-ES', Tags.Language.Spanish],
    ['pt-PT', Tags.Language.Portuguese],
    ['fr-FR', Tags.Language.French],
    ['en-US', Tags.Language.English]
]);

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly pubAesKey = 'OQlM9JBJgLWsgffb';
    private readonly apiUrl = 'https://api.qtoon.com/api/w/';
    private tokens: CookiesAndTokens = undefined;

    public constructor() {
        super('qtoon', 'QToon', 'https://qtoon.com', Tags.Media.Manhwa, Tags.Language.Multilingual, Tags.Source.Official);
    }

    public override async Initialize(): Promise<void> {
        // TODO: Update the token whenever the user performs a login/logout through manual website interactio
        await this.#RefreshToken();
    }

    public override get Icon() {
        return icon;
    }

    async #RefreshToken(): Promise<void> {
        this.tokens = await FetchWindowScript<CookiesAndTokens>(new Request(this.URI), `
            (async () => {
                const authData = localStorage.getItem('auth');
                const authToken = authData ? JSON.parse(authData).authToken : undefined;
                return {
                    did: (await cookieStore.get('did')).value,
                    uid: (await cookieStore.get('uid'))?.value,
                    profile: (await cookieStore.get('profile')).value,
                    token: authToken
                };
            })()
        `, 2500);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^https://(q)?qtoon.com(/[^/]+)?/detail/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { comic: { languageType, csid, title } } = await this.FetchAPI<APIMangaDetails>(`./comic/detail?csid=${url.split('/').at(-1)}`);
        return new Manga(this, provider, csid, [title, `[${languageType.split('-').at(0)}]`].join(' ').trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (const [language] of chapterLanguageMap) {
                for (let page = 1, run = true; run; page++) {
                    const { comics } = await this.FetchAPI<APIMangas>(`./search/comic/gallery?page=${page}`, language);
                    const mangas = comics.map(({ csid, title }) => new Manga(this, provider, csid, [title, `[${language.split('-').at(0)}]`].join(' ').trim()));
                    mangas.length > 0 ? yield* mangas : run = false;
                }
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { comic: { languageType }, episodes } = await this.FetchAPI<APIMangaDetails>(`./comic/detail?csid=${manga.Identifier}`);
        return episodes.reverse().map(({ esid, title }) => new Chapter(this, manga, esid, title, chapterLanguageMap.get(languageType)));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { definitions } = await this.FetchAPI<ChapterToken>(`./comic/episode/detail?esid=${chapter.Identifier}`);
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { resources } = await this.FetchAPI<APIPages>(`./resource/group/rslv?token=${encodeURIComponent(definitions.at(0).token)}&page=${page}`);
                const pages = await Promise.all(
                    resources.map(async ({ url }) => new Page(this, chapter, await this.DecryptImageUrl(url)))
                );
                pages.length > 0 ? yield* pages : run = false;
            }
        }.call(this));
    }

    public override async GetChapterURL(chapter: Chapter): Promise<URL> {
        return new URL(`/pt/reader/${chapter.Parent.Identifier}?chapter=${chapter.Identifier}`, this.URI);
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, language = 'en-US'): Promise<T> {
        const extraData = {
            bl: 'en-US'// navigator.language
        };
        const { did, profile, token, uid } = this.tokens;
        const { data, ts } = await FetchJSON<EncryptedResult>(new Request(new URL(endpoint, this.apiUrl), {
            headers: {
                platform: 'pc',
                lth: language,
                did, //cookie "did" (aka device id)
                profile, //cookie "profile"
                token, // localstorage "auth".authToken
                uid, // cookie "uid"
                pwa: '0',
                'req-ts': `${Date.now()}`,
                'req-id': RandomText(32),
                sig: await this.GenerateSignature(did, extraData)
            }
        }));
        return this.DecryptResult<T>(`${ts}`, data);
    }

    private async GenerateSignature(didCookievalue: string, data: string | JSONElement = undefined): Promise<string> {
        const { key, iv } = this.GetCryptoParams(MD5(didCookievalue));
        typeof data == 'object' && data !== null && (data = JSON.stringify(data));
        return this.AESEncrypt(key, iv, data as string);
    }

    private async AESEncrypt(keyData: string, iv: string, data: string): Promise<string> {
        const algorithm = { name: 'AES-CBC', iv: GetBytesFromUTF8(iv) };
        const key = await crypto.subtle.importKey('raw', GetBytesFromUTF8(keyData), algorithm, false, ['encrypt']);
        const encrypted = await crypto.subtle.encrypt(algorithm, key, GetBytesFromUTF8(data));
        return GetBase64FromBytes(new Uint8Array(encrypted));
    }

    private async AESDecrypt(keyData: string, iv: string, data: string): Promise<string> {
        const algorithm = { name: 'AES-CBC', iv: GetBytesFromUTF8(iv) };
        const key = await crypto.subtle.importKey('raw', GetBytesFromUTF8(keyData), algorithm, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(algorithm, key, GetBytesFromBase64(data));
        return new TextDecoder().decode(decrypted);
    }

    private async DecryptResult<T extends JSONElement>(timestamp: string, data: string): Promise<T> {
        const { key, iv } = this.GetCryptoParams(MD5(`${MD5(`${this.tokens.did}${timestamp}`)}${this.pubAesKey}`));
        return JSON.parse(await this.AESDecrypt(key, iv, data)) as T;
    }

    private async DecryptImageUrl(text: string): Promise<URL> {
        const { key, iv } = this.GetCryptoParams(MD5(`${MD5(`${this.tokens.did}`)}9tv86uBwmOYs7QZ0`));
        const url = new URL(await this.AESDecrypt(key, iv, text));
        url.search = '';
        return url;
    }

    private GetCryptoParams(hash: string): { key: string, iv: string } {
        return {
            key: hash.slice(0, 16),
            iv: hash.slice(16)
        };
    }
}

function MD5(input: string): string {
    const msg = new TextEncoder().encode(input);
    const l = msg.length;

    const padded = new Uint8Array(((l + 8 >> 6) + 1) * 64);
    padded.set(msg);
    padded[l] = 0x80;

    const view = new DataView(padded.buffer);
    view.setUint32(padded.length - 8, l * 8, true);

    let a0 = 0x67452301,
        b0 = 0xefcdab89,
        c0 = 0x98badcfe,
        d0 = 0x10325476;

    const s = [
        7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
        5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
        4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
        6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
    ];

    const K = Array.from({ length: 64 }, (_, i) =>
        Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32)
    );

    const rotl = (x: number, c: number) => x << c | x >>> 32 - c;

    for (let i = 0; i < padded.length; i += 64) {
        const M = new Uint32Array(padded.buffer, i, 16);

        let A = a0, B = b0, C = c0, D = d0;

        for (let j = 0; j < 64; j++) {
            let F: number, g: number;

            if (j < 16) { F = B & C | ~B & D; g = j; }
            else if (j < 32) { F = D & B | ~D & C; g = (5 * j + 1) % 16; }
            else if (j < 48) { F = B ^ C ^ D; g = (3 * j + 5) % 16; }
            else { F = C ^ (B | ~D); g = 7 * j % 16; }

            const tmp = D;
            D = C;
            C = B;
            B = B + rotl(A + F + K[j] + M[g] >>> 0, s[j]) >>> 0;
            A = tmp;
        }

        a0 = a0 + A >>> 0;
        b0 = b0 + B >>> 0;
        c0 = c0 + C >>> 0;
        d0 = d0 + D >>> 0;
    }

    const out = new ArrayBuffer(16);
    const outView = new DataView(out);
    outView.setUint32(0, a0, true);
    outView.setUint32(4, b0, true);
    outView.setUint32(8, c0, true);
    outView.setUint32(12, d0, true);

    return GetHexFromBytes(new Uint8Array(out));
}