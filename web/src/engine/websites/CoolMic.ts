import { Tags } from '../Tags';
import icon from './CoolMic.webp';
import type { MangaPlugin } from '../providers/MangaPlugin';
import { Chapter, DecoratableMangaScraper, Page, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { GetBytesFromBase64, GetBytesFromUTF8 } from '../BufferEncoder';
import { GetTypedData } from './decorators/Common';

type APIMangas = {
    hits: {s
        hit: {
            id: number;
            fields: {
                title_name: string;
            }
        }[]
    }
};

type JsonChapters = {
    episodes: {
        id: number;
        number: string;
    }[]
};

type APIPages = {
    image_data?: {
        path: string
    }[];
};

type PageData = {
    encrypted_image: string;
    iv: string;
    salt: string;
    iterations: number;
    kms_encrypted_data_key: string;
    file_name: string;
};

type DecryptedKey = {
    decrypted_key: string;
};

@Common.MangaCSS(/^{origin}\/titles\/\d+$/, 'meta[property="og:title"]')
export default class extends DecoratableMangaScraper {
    protected readonly apiUrl = `${this.URI.origin}/api/v1/`;
    private readonly languageCode: string = 'en';
    private token = undefined;

    public constructor(id = 'coolmic', label = 'CoolMic', url = 'https://coolmic.me', tags = [Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.English, Tags.Source.Official]) {
        super(id, label, url, ...tags);
        this.languageCode = this.URI.href.match(/https:\/\/([a-z]+)\.coolmic/)?.at(-1) ?? this.languageCode;
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        super.Initialize();
        this.token = (await FetchCSS<HTMLMetaElement>(new Request(this.URI), 'meta[name="csrf-token"]')).at(0).content;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const promises = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(character => {
            const url = new URL(`https://${this.languageCode}-search.coolmic.me/search`);
            const params = new URLSearchParams({
                q: `(${character}|*${character})`,
                size: '10000',
                start: '0',
                'q.parser': 'simple',
                return: '_all_fields',
                sort: '_score desc, like_vote_count desc',
                fq: ''
            });

            url.search = params.toString();
            return FetchJSON<APIMangas>(new Request(url, {
                headers: {
                    'x-csrf-token': this.token,
                    'x-requested-with': 'XMLHttpRequest'
                }
            }));
        });

        const results = (await Promise.all(promises)).reduce((accumulator: Manga[], element) => {
            const mangas = element.hits.hit.map(({ id, fields: { title_name: title } }) => new Manga(this, provider, `/titles/${id}`, title.trim()));
            accumulator.push(...mangas);
            return accumulator;
        }, []);

        return results.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [jsonNode] = await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), '[\\:page-objects]');
        const { episodes } = JSON.parse(jsonNode.getAttribute(':page-objects')) as JsonChapters;
        return episodes.map(episode => new Chapter(this, manga, episode.id.toString(), episode.number.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { image_data } = await this.FetchAPI<APIPages>(`./viewer/comic/secure_episodes/${chapter.Identifier}`);
        return image_data.map(({ path }) => new Page(this, chapter, new URL(path)));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {

            //fetch page JSON data
            const pageData = await FetchJSON<PageData>(new Request(page.Link, {
                headers: {
                    Origin: this.URI.origin,
                    Referrer: this.URI.href
                }
            }));

            //get decrypted key
            const { decrypted_key } = await this.FetchAPI<DecryptedKey>(`./decryption_keys`, { encrypted_key: pageData.kms_encrypted_data_key, file_name: pageData.file_name });
            return GetTypedData(await this.Decrypt(pageData, decrypted_key));

        }, priority, signal);
    }

    private async Decrypt(pageData: PageData, decryptedKey: string): Promise<ArrayBuffer> {

        const { encrypted_image, iterations, iv, salt } = pageData;
        //create decryptionKey
        const derivableKey = await crypto.subtle.importKey('raw', GetBytesFromUTF8(decryptedKey), {
            name: 'PBKDF2'
        }, false, ['deriveKey']);

        const decryptionKey = await crypto.subtle.deriveKey({
            name: 'PBKDF2',
            salt: GetBytesFromBase64(salt),
            iterations,
            hash: 'SHA-256'
        }, derivableKey, { name: 'AES-CBC', length: 256 }, false, ['decrypt']);

        //decrypt picture
        return crypto.subtle.decrypt({ name: 'AES-CBC', iv: GetBytesFromBase64(iv) }, decryptionKey, GetBytesFromBase64(encrypted_image));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, body: JSONElement = undefined): Promise<T> {
        const request = new Request(new URL(endpoint, this.apiUrl), {
            method: body ? 'POST' : 'GET',
            headers: {
                'Content-type': 'application/json',
                'X-CSRF-TOKEN': this.token,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: body ? JSON.stringify(body) : undefined

        });
        return FetchJSON<T>(request);
    }

}