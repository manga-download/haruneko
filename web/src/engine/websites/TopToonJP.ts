import { Tags } from '../Tags';
import icon from './TopToonJP.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { GetBase64FromBytes, GetBytesFromUTF8, GetHexFromBytes } from '../BufferEncoder';
import type { Priority } from '../taskpool/DeferredTask';

type APIResult<T> = {
    data: T;
};

type APIChapters = APIResult<{
    episode: {
        episodeId: number;
        order: number;
    }[];
}>;

type APIPages = APIResult<{
    currentEpisode: {
        contentImage: {
            webp: {
                path: string;
            }[];
        };
    };
}>;

@Common.MangaCSS(/^{origin}\/product\/\d+$/, 'div.titleCon div.title', (element, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: element.textContent.trim()
}))
@Common.MangasNotSupported()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.toptoon.jp/api/';
    private deviceId: string = '';

    public constructor() {
        super('toptoonjp', `TOPTOON (Japanese)`, 'https://www.toptoon.jp', Tags.Language.Japanese, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.deviceId = await FetchWindowScript(new Request(this.URI), `cookieStore.get('udid').then(({ value }) => value ?? null).catch(error => null);`, 1500);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { episode } } = await this.FetchAPI<APIChapters>(`./v2/page/episodeAll?comicId=${manga.Identifier}`);
        return episode
            .sort((self, other) => other.order - self.order)
            .map(({ episodeId, order }) => new Chapter(this, manga, `${episodeId}`, `${order}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { currentEpisode: { contentImage: { webp } } } } = await this.FetchAPI<APIPages>(`./v2/viewer/${chapter.Parent.Identifier}/${chapter.Identifier}?`, true);
        return webp.map(({ path }) => new Page(this, chapter, new URL(path)));
    }

    public async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const buffer = await (await Common.FetchImageAjax.call(this, page, priority, signal)).arrayBuffer();
        return Common.GetTypedData(new Uint8Array(buffer).slice().reverse().buffer);
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, deriveKey: boolean = false): Promise<T> {
        const date = new Date();
        const timestamp = date.getTime();
        const apiKey = 'SUPERCOOLAPIKEY2021#@#(';
        const iterations = 257;
        return await FetchJSON<T>(new Request(new URL(endpoint, this.apiURL), {
            method: 'POST',
            headers: {
                Origin: this.URI.origin,
                Referer: this.URI.href,
                deviceId: this.deviceId,
                'image-type': 'webp',
                'is-Native': '0',
                language: 'ja',
                offset: '0',
                'package-name': '',
                'local-datetime': `${date.getFullYear()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
                'therok-key': '',
                timestamp: `${timestamp}`,
                timezone: 'America/New_York',
                ua: 'web',
                'user-id': '0',
                'version': '2.0.0',
                'x-api-key': !deriveKey ? apiKey : await this.DeriveKey(timestamp, this.deviceId, iterations),
                'x-origin': 'www.toptoon.jp',
                'x-referer': this.URI.href
            }
        }));
    }

    private async DeriveKey(timestamp: number, deviceId: string, iterations: number): Promise<string> {
        const message = deviceId.toString().replace(/-/g, `${timestamp}`);
        const hash = GetHexFromBytes(new Uint8Array(await crypto.subtle.digest('SHA-256', GetBytesFromUTF8(message))));

        const keyMaterial = await crypto.subtle.importKey('raw', GetBytesFromUTF8(`${deviceId}|${timestamp}`), { name: 'PBKDF2' }, false, ['deriveBits']);

        const derivedBits = await crypto.subtle.deriveBits(
            { name: 'PBKDF2', salt: GetBytesFromUTF8(hash), iterations: iterations, hash: 'SHA-512' },
            keyMaterial, hash.length * 8
        );

        return GetBase64FromBytes(new Uint8Array(derivedBits));
    }
}