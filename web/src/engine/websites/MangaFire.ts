import { Tags } from '../Tags';
import icon from './MangaFire.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, Manga, Chapter, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { GetBytesFromBase64, GetBytesFromUTF8, GetURLBase64FromBytes } from '../BufferEncoder';

type APIResults<T> = {
    items: T[];
};

type APIManga = {
    hid: string;
    title: string;
};

type APIChapter = {
    id: number;
    number: number;
    name: string;
    language: string;
    type: string;
    pages: {
        url: string;
    }[];
};

type APIMangas = APIResults<APIManga>;
type APIChapters = APIResults<APIChapter>;

const chapterLanguageMap = new Map([
    ['en', Tags.Language.English],
    ['es', Tags.Language.Spanish],
    ['es-la', Tags.Language.Spanish],
    ['fr', Tags.Language.French],
    ['ja', Tags.Language.Japanese],
    ['pt-br', Tags.Language.Portuguese]
]);

// Raw Base64 stage data from MangaFire protection code
const STAGE_DATA: Array<{ tableB64: string; keyB64: string; iv: number }> = [
    {
        tableB64:
            'yINlmUNho8VYJT+ibTIP+9ESiULpVEtMOoD6U6lRE0R/xwXo/Xp9NrUgC4cw/' +
            'Lmo33vUyjUE40kUoEWIr/fxfNNcq2s79ShQ5NhNrFnJ4hXPwOu/SuXzIbuTQKG' +
            'Fvfm08E9jvCfqAtoDqvQq3dVWPQFmJjgvkISBeXY3BgANR+yVnjGbcxZ47d6k' +
            'LNfZPIayTq3/YGySb1KuVZodWp/WGNAO5pfMcpaK53Hhs0allBszaMaxuouOwd' +
            'xbwgxIw6YunSsXjI05Yi0j9j4eHKfSXR8Ifo/Od+8iamRfCXTyvm7NGRGYdcQ' +
            '0ywcK/u6RXhrbcCm4t2eCtrDgQVecJGkQ+A==',
        keyB64: '0Ec58JOY3uBzJK9m3zqIOpdlF7UFiax9DmA=',
        iv: 0x5a,
    },
    {
        tableB64:
            'IUFltCxD3Oc2cwCgkJffthaOg9cgPUb0LgW6H/VtfcF0kc5F25t+aWj6JH9V' +
            'OhOaY0rAFdUxlDnl5BLNvwEJvQtP5qcw7vdb/K+chnbwnspSHT8mz5lqwz41T' +
            'ezG0hkO06FTjJZhsyNuFLDpD2ZZxQj/QIRcF90zpmQ7Byu483WsQqUE0C342H' +
            'L+JXngRB6fRzxRyVTaKu83h7UYTJ0QMt6ixFh6S3F8gqkKwrGTL3jHNBsD45U' +
            'nifK8+RGtishQV2K3rujLKEkiZxpr2dYcudFW4oFsDKhad3CLBvuyTqsCo4B7m' +
            'L5IKQ1vXo/MOOvq1I1d8ar9X6Ttu5KF4fZgiA==',
        keyB64: 'AAdjb1iPY8CiDmq9H34tKTBF8a3oDQ==',
        iv: 0x35,
    },
    {
        tableB64:
            'NQHlu1/wVO5EmkwQymF810qqY2xG1k2obcas4Z9mCsPEIFl9pRIjFxbJ7ybM' +
            'HbBckT5Ton85E0FOeHezbh/mjlEYpmpnlXOS8dgrqeq2KfxImTh1YK9y0PeMN' +
            'hzA1OQzSY9brYOJq/l2QnE/hwOeZIhPixVSKIUlDb5vLcH6RWKxkIEMuP0bDw' +
            'IqQ71AJJaEaMJL7A6YtyIwoRT+L5v4aZzodN/0+3nOGsfblFjgxSfPzVDjNFe' +
            'Nl5P26+kEC/8AHgdrpAbt3hHz3HrRN1Y6e+JHgF7ncFWnoF0y3THL1S71WgWG' +
            'Ca6KtSzTCCG58n68nTyj2T3Sshk7utqCtMi/ZQ==',
        keyB64: 'DELOJgPsVaCcblDtTGMdHzM=',
        iv: 0xba,
    },
];

const STAGES = STAGE_DATA.map(({ tableB64, keyB64, iv }) => ({
    table: GetBytesFromBase64(tableB64),
    key: GetBytesFromBase64(keyB64),
    iv: iv,
}));

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('mangafire', 'MangaFire', 'https://mangafire.to', Tags.Language.English, Tags.Language.French, Tags.Language.Japanese, Tags.Language.Portuguese, Tags.Language.Spanish, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/title/[^/]+$`).test(url);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { items } = await this.FetchAPI<APIMangas>(`./titles?page=${page}&limit=100`);
                const mangas = items.map(({ hid, title }) => new Manga(this, provider, hid, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { hid, title } } = await this.FetchAPI<{ data: APIManga }>(`./titles/${url.match(/\/title\/([^-]+)/).at(1)}`);
        return new Manga(this, provider, hid, title);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { items } = await this.FetchAPI<APIChapters>(`./titles/${manga.Identifier}/volumes`);
        const volumes = items.map(({ id, language, name, number }) => new Chapter(this, manga, `volumes/${id}`, [`Vol. ${number}`, name, `(${language})`].joinTitleSegments(), ...[chapterLanguageMap.get(language)].filter(Boolean)));

        type This = typeof this;
        const chapters = await Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { items } = await this.FetchAPI<APIChapters>(`./titles/${manga.Identifier}/chapters?sort=number&order=desc&page=${page}&limit=200`);
                const chapters = items.map(({ id, language, name, number, type }) => new Chapter(this, manga, `chapters/${id}`, [`Ch. ${number}`, name, `(${type})`, `(${language})`].joinTitleSegments(),
                    ...[chapterLanguageMap.get(language)].filter(Boolean)));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
        return [...chapters, ...volumes];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { pages } } = await this.FetchAPI<{ data: APIChapter }>(`./${chapter.Identifier}`);
        return pages.map(({ url }) => new Page(this, chapter, new URL(url), { Referer: this.URI.href }));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        const baseURL = new URL(endpoint, this.apiURL);
        baseURL.searchParams.set('vrf', this.ComputeVrf(baseURL));
        return FetchJSON<T>(new Request(baseURL));
    }

    /**
     * Apply feedback substitution stage.
     */
    private EncryptStage(data: Uint8Array, table: Uint8Array, key: Uint8Array, iv: number): Uint8Array {
        const output = new Uint8Array(data.length);
        let previous = iv;
        for (let i = 0; i < data.length; i++) {
            previous = table[data[i] ^ key[i % key.length] ^ previous];
            output[i] = previous;
        }
        return output;
    }

    /**
     * Computes the VRF token directly for a given URL/path and optional extra params.
     */
    private ComputeVrf(baseURL: URL): string {
        const url = new URL(baseURL);
        url.searchParams.sort();

        let data: Uint8Array = GetBytesFromUTF8(`${baseURL.pathname.replace(/^\/api\//, '/')}${url.search}`);
        for (const stage of STAGES) {
            data = this.EncryptStage(data, stage.table, stage.key, stage.iv);
        }
        return GetURLBase64FromBytes(data);
    }
}