import * as Common from '../decorators/Common';
import { DecoratableMangaScraper, Manga, Page, type MangaPlugin, Chapter } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/DeferredTask';
import { GetTypedData } from '../decorators/Common';
import { FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';
import { GetBytesFromUTF8, GetHexFromBytes, GetUTF8FromBytes } from '../../BufferEncoder';
import { Exception } from '../../Error';
import { WebsiteResourceKey as R } from '../../../i18n/ILocale';
import { Delay } from '../../BackgroundTimers';
import { MD5 } from '../../Crypto';

type APIResult<T> = {
    data: T;
};

type APIMedia = {
    title: string;
    id: number;
};

type APIPage = {
    url: string;
};

export class MangaToonBase extends DecoratableMangaScraper {
    private language = 'en';
    private readonly apiURL = 'https://sg.mangatoon.mobi/api/';
    private readonly mobileURI = new URL('https://h5.mangatoon.mobi');
    private udid: string = undefined;

    public override async Initialize(): Promise<void> {
        this.udid = await FetchWindowScript<string>(new Request(this.URI), `localStorage.getItem('mangatoon:udid') || null;`, 1500);
    };

    public WithLanguage(language: string): MangaToonBase {
        this.language = language;
        return this;
    }

    public override ValidateMangaURL(url: string): boolean {
        // websites got 2 url patterns
        // https://de.mangatoon.mobi/1234-shone-fraulein
        // https://mangatoon.mobi/id/my-disciples-cultivate-while-i-slack-off?content_id=3655551

        return new RegExpSafe(`^${this.URI.origin}/${this.language}/[^/]+?content_id=\\d+$`).test(url)
            || new RegExpSafe(`^${this.URI.origin}/\\d+-[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaId = new URL(url).searchParams?.get('content_id') ?? url.match(/\/(\d+)-/).at(1);
        const { id, title } = await this.FetchAPI<APIMedia>(`./content/detail?id=${mangaId}`);
        return new Manga(this, provider, `${id}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run; page++) {
                await Delay(500);
                const mangaData = await this.FetchAPI<APIMedia[]>(`./content/list?page=${page}&limit=500`);
                const mangas = mangaData.map(({ id, title }) => new Manga(this, provider, `${id}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.FetchAPI<APIMedia[]>(`./content/episodes?id=${manga.Identifier}`);
        return chapters.map(({ id, title }) => new Chapter(this, manga, `${id}`, title)).reverse();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await this.FetchAPI<APIPage[]>(`./cartoons/pictures?id=${chapter.Identifier}`);
        if (!pages) throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        return pages.map(({ url }) => new Page(this, chapter, new URL(url)));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return this.Decrypt(await blob.arrayBuffer());
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return (await FetchJSON<APIResult<T>>(new Request(this.GetSignedURL(endpoint), {
            headers: {
                Referer: this.mobileURI.href,
                Origin: this.mobileURI.origin
            }
        }))).data;
    }

    private GetSignedURL(endpoint: string): URL {
        const url = new URL(endpoint, this.apiURL);
        url.searchParams.set('_', `${Math.floor(Date.now())}`);
        url.searchParams.set('_webp', `true`);
        url.searchParams.set('_platform', `web`);
        url.searchParams.set('_v', `3.07.00`);
        url.searchParams.set('_language', this.language);
        url.searchParams.set('_udid', this.udid);

        const queryParams = Array.from(url.searchParams.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        const sign = GetHexFromBytes(MD5(GetBytesFromUTF8(url.pathname + queryParams + '66c10a61bd916c23f3b33810d3785d17')));
        url.searchParams.set('sign', sign);
        return url;
    }

    private async Decrypt(sourceBuffer: ArrayBuffer): Promise<Blob> {
        const table1 = new Uint8Array([161, 158, 189, 103, 2, 8, 54, 66, 27, 65, 108, 98, 114, 215, 107, 119, 96, 242, 19, 248, 230, 72, 218, 166, 239, 246, 252, 245, 137, 179, 243, 206, 197, 236, 9, 145, 249, 225, 0, 176, 28, 13, 250, 244, 35, 48, 57, 216, 16, 127, 220, 73, 21, 224, 124, 199, 228, 85, 191, 154, 162, 140, 160, 200, 234, 50, 113, 62, 5, 229, 178, 104, 133, 195, 86, 194, 11, 42, 134, 89, 193, 120, 4, 47, 152, 192, 126, 101, 63, 196, 208, 172, 38, 163, 150, 132, 240, 112, 117, 146, 255, 118, 141, 58, 110, 41, 81, 144, 188, 88, 32, 175, 46, 59, 167, 68, 93, 139, 227, 121, 251, 182, 180, 60, 94, 136, 156, 201, 147, 29, 78, 143, 40, 109, 185, 202, 138, 164, 130, 186, 170, 31, 45, 91, 18, 173, 100, 187, 254, 39, 97, 155, 74, 111, 223, 26, 203, 34, 67, 23, 237, 177, 207, 231, 20, 204, 159, 71, 125, 80, 174, 241, 221, 92, 84, 90, 168, 122, 153, 247, 77, 213, 64, 6, 184, 10, 116, 37, 149, 129, 99, 83, 115, 123, 128, 135, 33, 70, 238, 253, 214, 56, 76, 210, 226, 44, 51, 25, 82, 157, 53, 106, 131, 148, 151, 142, 198, 183, 169, 55, 212, 95, 43, 211, 36, 75, 209, 102, 14, 171, 190, 7, 12, 105, 181, 15, 24, 61, 17, 52, 87, 222, 30, 3, 233, 232, 22, 165, 219, 79, 217, 69, 1, 235, 205, 49]);
        const table2 = new Uint8Array([39, 197, 251, 159, 23, 170, 21, 209, 188, 18, 9, 13, 212, 105, 14, 200, 43, 100, 89, 161, 62, 27, 29, 19, 239, 134, 234, 109, 24, 112, 173, 133, 95, 32, 73, 91, 35, 107, 196, 125, 226, 113, 20, 94, 81, 143, 75, 44, 151, 220, 156, 246, 117, 41, 85, 240, 122, 187, 193, 15, 189, 175, 157, 211, 37, 26, 40, 178, 243, 6, 229, 179, 202, 233, 74, 114, 154, 204, 48, 165, 57, 127, 8, 207, 65, 61, 201, 206, 86, 195, 77, 22, 110, 181, 237, 254, 97, 160, 47, 138, 69, 221, 12, 140, 70, 191, 68, 255, 180, 5, 210, 245, 250, 56, 80, 249, 205, 144, 106, 174, 166, 121, 99, 244, 162, 194, 185, 82, 53, 84, 88, 230, 214, 64, 135, 228, 42, 58, 103, 52, 158, 218, 10, 124, 46, 167, 198, 208, 216, 222, 217, 153, 155, 59, 132, 223, 98, 142, 123, 152, 90, 199, 111, 129, 76, 146, 66, 118, 172, 71, 164, 1, 219, 247, 79, 36, 28, 4, 141, 72, 50, 137, 149, 120, 139, 236, 128, 227, 38, 115, 253, 241, 83, 203, 49, 213, 238, 232, 30, 186, 182, 184, 183, 176, 16, 148, 3, 92, 130, 0, 93, 34, 54, 25, 67, 150, 33, 102, 192, 168, 242, 2, 231, 87, 252, 55, 171, 177, 136, 248, 31, 96, 119, 163, 11, 45, 7, 60, 78, 131, 147, 104, 116, 215, 225, 190, 224, 126, 63, 169, 101, 235, 145, 51, 17, 108]);

        function getLookupTable(offset: number) {
            const lookup: number[] = new Array(256).fill(0);

            const rotatedTt = new Array(256).fill(0);
            for (let i = 0; i < 256; i++) {
                const newPos = (i + offset) % 256;
                rotatedTt[newPos] = table2[i];
            }

            const s: number[] = new Array(256).fill(0);
            for (let r = 0; r < 256; r++) {
                const val = rotatedTt[r];
                s[val] = r;
            }

            for (let i = 0; i < 256; i++) {
                lookup[i] = table1[s[i]];
            }
            return lookup;
        }

        function decryptBytes(dataChunk: Uint8Array, offset: number) {
            const lookup = getLookupTable(offset);
            const result = dataChunk.map(b => lookup[b]);
            return new Uint8Array(result);
        }

        let foundOffset = -1;
        const imgData = new Uint8Array(sourceBuffer);
        const headerChk = imgData.slice(0, 4);

        for (let offset = 0; offset < 256; offset++) {
            const decryptedHeader = GetUTF8FromBytes(decryptBytes(headerChk, offset));
            if (decryptedHeader === 'RIFF') {
                foundOffset = offset;
                break;
            }
        }

        const limit = Math.min(imgData.length, 2048);
        const decryptedPart = decryptBytes(imgData.slice(0, limit), foundOffset);
        const remainder = imgData.slice(limit);

        let finalData = new Uint8Array(decryptedPart.length + remainder.length);
        finalData.set(decryptedPart, 0);
        finalData.set(remainder, decryptedPart.length);
        return GetTypedData(finalData.buffer);
    }
}