import { Tags } from '../Tags';
import icon from './ComixTo.webp';
import { FetchJSON, FetchNextJS } from '../platform/FetchProvider';
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
    chapter_id: number;
    number: number;
    name: string;
    scanlation_group: {
        name: string;
    } | null
};

type HydratedImages = {
    images: {
        url: string;
    }[]
};

@Common.MangaCSS(/^{origin}\/title\/[^/]+$/, 'section.comic-info h1.title')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = `${this.URI.origin}/api/v2/`;

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
                const { result: { items } } = await FetchJSON<APIChapters>(new Request(new URL(`./manga/${mangaHash}/chapters?limit=100&page=${page}&order[number]=desc&time=1&_=${requestHash}`, this.apiUrl)));
                const chapters = items.map(({ chapter_id: id, number, name, scanlation_group: scanGroup }) => {
                    const title = [number, name && `- ${name}`, scanGroup && `[${scanGroup.name}]`].filter(Boolean).join(' ');
                    return new Chapter(this, manga, `${manga.Identifier}/${id}-chapter-${number}`, title);
                });
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { images } = await FetchNextJS<HydratedImages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'images' in data);
        return images.map(({ url }) => new Page(this, chapter, new URL(url), { Referer: this.URI.href }));
    }
}

class ComixHash {

    static KEYS = [
        "13YDu67uDgFczo3DnuTIURqas4lfMEPADY6Jaeqky+w=", "yEy7wBfBc+gsYPiQL/4Dfd0pIBZFzMwrtlRQGwMXy3Q=", "yrP+EVA1Dw==",
        "vZ23RT7pbSlxwiygkHd1dhToIku8SNHPC6V36L4cnwM=", "QX0sLahOByWLcWGnv6l98vQudWqdRI3DOXBdit9bxCE=", "WJwgqCmf",
        "BkWI8feqSlDZKMq6awfzWlUypl88nz65KVRmpH0RWIc=", "v7EIpiQQjd2BGuJzMbBA0qPWDSS+wTJRQ7uGzZ6rJKs=", "1SUReYlCRA==",
        "RougjiFHkSKs20DZ6BWXiWwQUGZXtseZIyQWKz5eG34=", "LL97cwoDoG5cw8QmhI+KSWzfW+8VehIh+inTxnVJ2ps=", "52iDqjzlqe8=",
        "U9LRYFL2zXU4TtALIYDj+lCATRk/EJtH7/y7qYYNlh8=", "e/GtffFDTvnw7LBRixAD+iGixjqTq9kIZ1m0Hj+s6fY=", "xb2XwHNB"
    ];

    public static GenerateHash(path: string, bodySize: number = 0, time: number = 1): string {
        const baseString = `${path}:${bodySize}:${time}`;

        const encoded = encodeURIComponent(baseString);
        //    .replace(/\+/g, "%20")
        //    .replace(/\*/g, "%2A")
        //    .replace(/%7E/g, "~");

        const initialBytes = GetBytesFromUTF8(encoded);
        const result = ComixHash.Round5(ComixHash.Round4(ComixHash.Round3(ComixHash.Round2(ComixHash.Round1(initialBytes)))));
        return GetURLBase64FromBytes(result);
    }

    static Rc4(key: Uint8Array, data: Uint8Array): Uint8Array {
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

    static MutS(e: number): number { return e + 143 & 0xff; }
    static MutL(e: number): number { return (e >>> 1 | e << 7) & 0xff; }
    static MutC(e: number): number { return e + 115 & 0xff; }
    static MutM(e: number): number { return (e ^ 177) & 0xff; }
    static MutF(e: number): number { return e - 188 & 0xff; }
    static MutG(e: number): number { return (e << 2 | e >>> 6) & 0xff; }
    static MutH(e: number): number { return e - 42 & 0xff; }
    static MutDollar(e: number): number { return (e << 4 | e >>> 4) & 0xff; }
    static MutB(e: number): number { return e - 12 & 0xff; }
    static MutUnderscore(e: number): number { return e - 20 & 0xff; }
    static MutY(e: number): number { return (e >>> 1 | e << 7) & 0xff; }
    static MutK(e: number): number { return e - 241 & 0xff; }
    static GetMutKey(mk: Uint8Array, idx: number): number { return mk.length > 0 && idx % 32 < mk.length ? mk[idx % 32] : 0; }
    static GetKeyBytes(index: number): Uint8Array { return GetBytesFromBase64(ComixHash.KEYS[index]); }

    static Round1(data: Uint8Array): Uint8Array {
        const enc = ComixHash.Rc4(ComixHash.GetKeyBytes(0), data);
        const mutKey = ComixHash.GetKeyBytes(1);
        const prefKey = ComixHash.GetKeyBytes(2);
        const out = [];

        for (let i = 0; i < enc.length; i++) {
            if (i < 7 && i < prefKey.length) out.push(prefKey[i]);
            let v = enc[i] ^ ComixHash.GetMutKey(mutKey, i);

            switch (i % 10) {
                case 0:
                case 9: v = ComixHash.MutC(v); break;
                case 1: v = ComixHash.MutB(v); break;
                case 2: v = ComixHash.MutY(v); break;
                case 3: v = ComixHash.MutDollar(v); break;
                case 4:
                case 6: v = ComixHash.MutH(v); break;
                case 5: v = ComixHash.MutS(v); break;
                case 7: v = ComixHash.MutK(v); break;
                case 8: v = ComixHash.MutL(v); break;
                default:
                    break;
            }
            out.push(v & 255);
        }
        return new Uint8Array(out);
    }

    static Round2(data: Uint8Array): Uint8Array {
        const enc = ComixHash.Rc4(ComixHash.GetKeyBytes(3), data);
        const mutKey = ComixHash.GetKeyBytes(4);
        const prefKey = ComixHash.GetKeyBytes(5);
        const out = [];

        for (let i = 0; i < enc.length; i++) {
            if (i < 6 && i < prefKey.length) out.push(prefKey[i]);
            let v = enc[i] ^ ComixHash.GetMutKey(mutKey, i);
            switch (i % 10) {
                case 0:
                case 8: v = ComixHash.MutC(v); break;
                case 1: v = ComixHash.MutB(v); break;
                case 2:
                case 6: v = ComixHash.MutDollar(v); break;
                case 3: v = ComixHash.MutH(v); break;
                case 4:
                case 9: v = ComixHash.MutS(v); break;
                case 5: v = ComixHash.MutK(v); break;
                case 7: v = ComixHash.MutUnderscore(v); break;
                default:
                    break;
            }
            out.push(v & 255);
        }
        return new Uint8Array(out);
    }

    static Round3(data: Uint8Array): Uint8Array {
        const enc = ComixHash.Rc4(ComixHash.GetKeyBytes(6), data);
        const mutKey = ComixHash.GetKeyBytes(7);
        const prefKey = ComixHash.GetKeyBytes(8);
        const out = [];

        for (let i = 0; i < enc.length; i++) {
            if (i < 7 && i < prefKey.length) out.push(prefKey[i]);
            let v = enc[i] ^ ComixHash.GetMutKey(mutKey, i);
            switch (i % 10) {
                case 0: v = ComixHash.MutC(v); break;
                case 1: v = ComixHash.MutF(v); break;
                case 2:
                case 8: v = ComixHash.MutS(v); break;
                case 3: v = ComixHash.MutG(v); break;
                case 4: v = ComixHash.MutY(v); break;
                case 5: v = ComixHash.MutM(v); break;
                case 6: v = ComixHash.MutDollar(v); break;
                case 7: v = ComixHash.MutK(v); break;
                case 9: v = ComixHash.MutB(v); break;
                default:
                    break;
            }
            out.push(v & 255);
        }
        return new Uint8Array(out);
    }

    static Round4(data: Uint8Array): Uint8Array {
        const enc = ComixHash.Rc4(ComixHash.GetKeyBytes(9), data);
        const mutKey = ComixHash.GetKeyBytes(10);
        const prefKey = ComixHash.GetKeyBytes(11);
        const out = [];

        for (let i = 0; i < enc.length; i++) {
            if (i < 8 && i < prefKey.length) out.push(prefKey[i]);
            let v = enc[i] ^ ComixHash.GetMutKey(mutKey, i);
            switch (i % 10) {
                case 0: v = ComixHash.MutB(v); break;
                case 1:
                case 9: v = ComixHash.MutM(v); break;
                case 2:
                case 7: v = ComixHash.MutL(v); break;
                case 3:
                case 5: v = ComixHash.MutS(v); break;
                case 4:
                case 6: v = ComixHash.MutUnderscore(v); break;
                case 8: v = ComixHash.MutY(v); break;
                default:
                    break;
            }
            out.push(v & 255);
        }
        return new Uint8Array(out);
    }

    static Round5(data: Uint8Array): Uint8Array {
        const enc = ComixHash.Rc4(ComixHash.GetKeyBytes(12), data);
        const mutKey = ComixHash.GetKeyBytes(13);
        const prefKey = ComixHash.GetKeyBytes(14);
        const out = [];

        for (let i = 0; i < enc.length; i++) {
            if (i < 6 && i < prefKey.length) out.push(prefKey[i]);
            let v = enc[i] ^ ComixHash.GetMutKey(mutKey, i);
            switch (i % 10) {
                case 0: v = ComixHash.MutUnderscore(v); break;
                case 1:
                case 7: v = ComixHash.MutS(v); break;
                case 2: v = ComixHash.MutC(v); break;
                case 3:
                case 5: v = ComixHash.MutM(v); break;
                case 4: v = ComixHash.MutB(v); break;
                case 6: v = ComixHash.MutF(v); break;
                case 8: v = ComixHash.MutDollar(v); break;
                case 9: v = ComixHash.MutG(v); break;
            }
            out.push(v & 255);
        }
        return new Uint8Array(out);
    }
}