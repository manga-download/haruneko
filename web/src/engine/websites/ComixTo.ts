import { Tags } from '../Tags';
import icon from './ComixTo.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { GetBytesFromBase64, GetBytesFromUTF8, GetURLBase64FromBytes } from '../BufferEncoder';

type APIResult<T> = {
    result: {
        items: T;
    };
};

type APIMangas = APIResult<APIManga[]>;

type APIManga = {
    hash_id: string;
    title: string;
    slug: string;
};

type APIChapters = APIResult<APIChapter[]>;

type APIChapter = {
    id: number;
    number: number;
    name: string;
    group: {
        name: string;
    } | null;
    pages: {
        url: string;
    }[];
};

type APIPages = {
    result: APIChapter;
};

@Common.MangaCSS(/^{origin}\/title\/[^/]+$/, 'meta[property="og:title"]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = `${this.URI.origin}/api/v1/`;

    public constructor() {
        super('comixto', 'Comix (.to)', 'https://comix.to', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { result: { items } } = await FetchJSON<APIMangas>(new Request(new URL(`./manga?limit=100&page=${page}`, this.apiUrl)));
                const mangas = items.map(({ hash_id: hash, title, slug }) => new Manga(this, provider, `/title/${hash}-${slug}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaHash = manga.Identifier.match(/\/title\/([^/-]+)-/).at(1);
        const requestHash = ComixHash.GenerateHash(`/manga/${mangaHash}/chapters`);

        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { result: { items } } = await FetchJSON<APIChapters>(new Request(new URL(`./manga/${mangaHash}/chapters?page=${page}&limit=100&order[number]=desc&_=${requestHash}`, this.apiUrl)));
                const chapters = items.map(({ id, number, name, group }) => {
                    const title = [number, name && `- ${name}`, group && `[${group.name}]`].filter(Boolean).join(' ');
                    return new Chapter(this, manga, `${manga.Identifier}/${id}-chapter-${number}`, title);
                });
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterId = chapter.Identifier.split('/').at(-1).match(/\d+/).at(0);
        const requestHash = ComixHash.GenerateHash(`/chapters/${chapterId}`);
        const { result: { pages } } = await FetchJSON<APIPages>(new Request(new URL(`./chapters/${chapterId}?_=${requestHash}`, this.apiUrl)));
        return pages.map(({ url }) => new Page(this, chapter, new URL(url), { Referer: this.URI.href }));
    }
}

class ComixHash {

    static KEYS = [
        "JxTcdyiA5GZxnbrmthXBQfU2IMTKcY1+3nNhbq98Sgo=", "3PordjODbhqla382Cxapmo/1JiABJQcjiJj1+48gTJ4=", "OaKvnI5ARA==",
        "MHNBHYWA7lvy867fXgvGcJwWDk79KqUJUVFsh3RwnnI=", "8i0Cru/VJBSVB2Y1GcMDVpzx2WepOcfnWdd81yxICl4=", "Fyskubz8VvA=",
        "B46L1x+UeWP+19cRpQ+OZvdLAK9EHID8g3mSgn57tew=", "DTSTmUt6LpDUw9r1lSQqyb3YlFTzruT8tk8wUGkwehQ=", "vY/meeI=",
        "7xWfIF5THL5LAnRgAARg+4mjWHPU9n3PQwvzbaMNi+Q=", "bewtiTuV+HJk56xxkf2iCljLgruCpBmN9BgE8i6gc9M=", "/Xcb2zAu8AU=",
        "WgeCQ3T8R51uTwVSiVa7Zy0dN6JOg6Z5JleMS+HV8Aw=", "yXayUVFrrcW56jQCEfZzuCidjpnWKjTDUNT7XeX9i7k=", "tSLco2w="
    ];

    public static GenerateHash(path: string, /*bodySize: number = 0, time: number = 1*/): string {
        const baseString = `${path}`;//:${bodySize}:${time}`;

        const encoded = encodeURIComponent(baseString);
        //    .replace(/\+/g, "%20")
        //    .replace(/\*/g, "%2A")
        //    .replace(/%7E/g, "~");

        const initialBytes = GetBytesFromUTF8(encoded);
        const result = ComixHash.Round5(ComixHash.Round4(ComixHash.Round3(ComixHash.Round2(ComixHash.Round1(initialBytes)))));
        return GetURLBase64FromBytes(result).slice(0);
    }

    static RC4(key: Uint8Array, data: Uint8Array): Uint8Array {
        if (!(key instanceof Uint8Array) || !(data instanceof Uint8Array)) {
            throw new TypeError("key and data must be Uint8Array");
        }
        if (key.length === 0) return data;
        const s = new Uint8Array(256);
        for (let i = 0; i < 256; i++) {
            s[i] = i;
        }
        let j = 0;
        for (let i = 0; i < 256; i++) {
            j = j + s[i] + key[i % key.length] & 0xff;
            const temp = s[i];
            s[i] = s[j];
            s[j] = temp;
        }
        let i = 0;
        j = 0;
        const out = new Uint8Array(data.length);
        for (let k = 0; k < data.length; k++) {
            i = i + 1 & 0xff;
            j = j + s[i] & 0xff;
            const temp = s[i];
            s[i] = s[j];
            s[j] = temp;
            const rnd = s[s[i] + s[j] & 0xff];
            out[k] = data[k] ^ rnd;
        }
        return out;
    }

    static OpShiftRight7Left1 = (e: number) => (e >>> 7 | e << 1) & 255;
    static OpShiftLeft1Right7 = (e: number) => (e << 1 | e >>> 7) & 255;
    static OpShiftRight2Left6 = (e: number) => (e >>> 2 | e << 6) & 255;
    static OpShiftLeft4Right4 = (e: number) => (e << 4 | e >>> 4) & 255;
    static OpShiftRight4Left4 = (e: number) => (e >>> 4 | e << 4) & 255;
    static GetMutKey(mk: Uint8Array, idx: number): number { return mk.length > 0 && idx % 32 < mk.length ? mk[idx % 32] : 0; }
    static GetKeyBytes(index: number): Uint8Array { return GetBytesFromBase64(ComixHash.KEYS[index]); }

    static Mutate(data: Uint8Array, mutKey: Uint8Array, prefKey: Uint8Array, prefKeyLimit: number, round: number): Uint8Array {
        const out: number[] = [];

        for (let o = 0; o < data.length; o++) {
            if (o < prefKeyLimit && o < prefKey.length) out.push(prefKey[o]);

            let n = data[o] ^ ComixHash.GetMutKey(mutKey, o);

            n = (() => {
                switch (round) {
                    case 1:
                        switch (o % 10) {
                            case 0: return ComixHash.OpShiftRight7Left1(n);
                            case 1: return n ^ 37;
                            case 2: return n ^ 81;
                            case 3: return n ^ 147;
                            case 4: return ComixHash.OpShiftRight2Left6(n);
                            case 5:
                            case 8: return ComixHash.OpShiftRight4Left4(n);
                            case 6: return n ^ 218;
                            case 7: return n + 159 & 255;
                            case 9: return n ^ 180;
                            default: return n;
                        }
                    case 2:
                        switch (o % 10) {
                            case 0:
                            case 9: return n ^ 180;
                            case 1: return ComixHash.OpShiftLeft1Right7(n);
                            case 2: return n ^ 147;
                            case 3: return ComixHash.OpShiftRight7Left1(n);
                            case 4: return ComixHash.OpShiftRight2Left6(n);
                            case 5: return ComixHash.OpShiftRight4Left4(n);
                            case 6:
                            case 8: return n + 159 & 255;
                            case 7: return n + 34 & 255;
                            default: return n;
                        }
                    case 3:
                        switch (o % 10) {
                            case 0: return n ^ 81;
                            case 1: return ComixHash.OpShiftRight4Left4(n);
                            case 2:
                            case 9: return ComixHash.OpShiftLeft4Right4(n);
                            case 3: return n ^ 37;
                            case 4: return n + 159 & 255;
                            case 5: return ComixHash.OpShiftLeft1Right7(n);
                            case 6: return n ^ 180;
                            case 7: return n + 34 & 255;
                            case 8: return ComixHash.OpShiftRight2Left6(n);
                            default: return n;
                        }
                    case 4:
                        switch (o % 10) {
                            case 0:
                            case 7: return n ^ 218;
                            case 1:
                            case 4: return ComixHash.OpShiftLeft1Right7(n);
                            case 2: return ComixHash.OpShiftRight7Left1(n);
                            case 3: return n + 159 & 255;
                            case 5:
                            case 8: return n ^ 180;
                            case 6: return n ^ 147;
                            case 9: return n ^ 37;
                            default: return n;
                        }
                    case 5:
                        switch (o % 10) {
                            case 0: return ComixHash.OpShiftLeft4Right4(n);
                            case 1:
                            case 3: return n ^ 147;
                            case 2: return n + 34 & 255;
                            case 4:
                            case 9: return n ^ 218;
                            case 5:
                            case 7: return ComixHash.OpShiftLeft1Right7(n);
                            case 6: return n ^ 180;
                            case 8: return ComixHash.OpShiftRight2Left6(n);
                            default: return n;
                        }
                    default: return n;
                }
            })();
            out.push(n & 255);
        }
        return Uint8Array.from(out);
    }

    static Round1(data: Uint8Array): Uint8Array {
        const mut = ComixHash.Mutate(data, ComixHash.GetKeyBytes(1), ComixHash.GetKeyBytes(2), 7, 1);
        return ComixHash.RC4(ComixHash.GetKeyBytes(0), mut);
    }
    static Round2(data: Uint8Array): Uint8Array {
        const mut = ComixHash.Mutate(data, ComixHash.GetKeyBytes(4), ComixHash.GetKeyBytes(5), 8, 2);
        return ComixHash.RC4(ComixHash.GetKeyBytes(3), mut);
    }

    static Round3(data: Uint8Array): Uint8Array {
        const mut = ComixHash.Mutate(data, ComixHash.GetKeyBytes(7), ComixHash.GetKeyBytes(8), 5, 3);
        return ComixHash.RC4(ComixHash.GetKeyBytes(6), mut);
    }

    static Round4(data: Uint8Array): Uint8Array {
        const mut = ComixHash.Mutate(data, ComixHash.GetKeyBytes(10), ComixHash.GetKeyBytes(11), 8, 4);
        return ComixHash.RC4(ComixHash.GetKeyBytes(9), mut);
    }

    static Round5(data: Uint8Array): Uint8Array {
        const mut = ComixHash.Mutate(data, ComixHash.GetKeyBytes(13), ComixHash.GetKeyBytes(14), 5, 5);
        return ComixHash.RC4(ComixHash.GetKeyBytes(12), mut);
    }
}