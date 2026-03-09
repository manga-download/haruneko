import { Tags } from '../Tags';
import icon from './NexusToons.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { GetBytesFromBase64 } from '../BufferEncoder';

type APICryptedData = {
    d: string;
    v: number;
    k: number;
};

type APIResult<T extends JSONElement> = APICryptedData | T;

type EncryptionKeys = {
    key: Uint8Array;
    rsbox: Uint8Array;
    sbox: Uint8Array;
}

type APIManga = {
    title: string;
    slug: string;
    chapters: APIChapter[];
};

type APIChapter = {
    id: number;
    number: string;
    title: string | null;
};

type APIMangas = {
    data: APIManga[];
};

type APIPages = {
    pages: {
        imageUrl: string;
    }[]
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://nexustoons.com/api/';
    private readonly seed = 'OrionNexus2025CryptoKey!Secure';
    private readonly keys: EncryptionKeys[] = [];

    public constructor() {
        super('nexustoons', 'Nexus Toons', 'https://nexustoons.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await this.InitKeys(this.seed);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { title, slug } = await this.FetchAPI<APIManga>(`./manga/${url.split('/').at(-1)}`);
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run; offset += 500) {
                const { data } = await this.FetchAPI<APIMangas>(`./mangas?offset=${offset}&limit=500`);
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<APIManga>(`./manga/${manga.Identifier}`);
        return chapters.map(({ id, number, title }) => new Chapter(this, manga, `${id}`, [number, title ?? ''].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await this.FetchAPI<APIPages>(`./chapter/${chapter.Identifier}`);
        return pages.map(({ imageUrl }) => new Page(this, chapter, new URL(imageUrl)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        const data = await FetchJSON<APIResult<T>>(new Request(new URL(endpoint, this.apiUrl)));
        return !data['d'] ? data as T : this.Decrypt(data as APICryptedData);
    }

    private async Decrypt<T extends JSONElement>(data: APICryptedData): Promise<T> {
        const keyIndex = data.v === 1 ? 0 : data.k || 0;
        const { key, rsbox } = this.keys.at(keyIndex);
        const message = GetBytesFromBase64(data.d);

        function rotateRight(t, a) {
            return a = a % 8, (t >>> a | t << 8 - a) & 255;
        }

        const resultBuffer = new Uint8Array(message.length);
        for (let index = message.length - 1; index >= 0; index--) {
            let h = message[index];
            index > 0 ? h ^= message[index - 1] : h ^= key[key.length - 1];
            h = rsbox[h];
            const f = (key[(index + 3) % key.length] + (index & 255) & 255) % 7 + 1;
            h = rotateRight(h, f);
            h ^= key[index % key.length];
            resultBuffer[index] = h;
        }
        return JSON.parse(new TextDecoder().decode(resultBuffer)) as T;
    }

    private async InitKeys(seed: string): Promise<void> {
        for (let index = 0; index < 5; index++) {
            const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`_orion_key_${index}_v2_${seed}`));
            const key = new Uint8Array(buffer);

            // Init sboxes (this is RC4 KSA)
            const encryptionKeys: EncryptionKeys = {
                key,
                sbox: new Uint8Array(256),
                rsbox: new Uint8Array(256)
            };

            for (let r = 0; r < 256; r++) encryptionKeys.sbox[r] = r;
            for (let r = 0, n = 0; r < 256; r++) {
                n = (n + encryptionKeys.sbox[r] + key[r % key.length]) % 256;
                [encryptionKeys.sbox[r], encryptionKeys.sbox[n]] = [encryptionKeys.sbox[n], encryptionKeys.sbox[r]];
            }
            for (let r = 0; r < 256; r++) encryptionKeys.rsbox[encryptionKeys.sbox[r]] = r;

            this.keys.push(encryptionKeys);
        }
    }
}
