// For websites using Mangahub.io API
import { RandomHex } from '../../Random';
import { RateLimit } from '../../taskpool/RateLimit';
import { FetchCSS, FetchGraphQL, FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';
import { DecodeEntities } from '../../transformers/HtmlEntityTranscoder';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { Delay } from '../../BackgroundTimers';
import { GetBytesFromURLBase64, GetUTF8FromBytes } from '../../BufferEncoder';

type GQLMangas = {
    search: {
        rows: {
            slug: string;
            title: string;
        }[];
    };
};

type GQLChapters = {
    manga: {
        chapters: {
            number: number;
            title: string;
        }[];
    };
};

type GQLPages = {
    chapter: {
        pages: string;
    };
};

type JSONPages = {
    i: string[];
    p: string;
} | string[];

type CryptoParams = {
    keyId: string;
    key?: string;
    expiresAt: number;
    keys?: Record<string, string>;
};

@Common.ImageAjax()
export class MangaHubBase extends DecoratableMangaScraper {

    private readonly localeAPI = `${this.URI.origin}/api/`;
    private readonly apiURL = 'https://api.mghcdn.com/graphql';
    private readonly cdnURL = 'https://imgx.mghcdn.com';
    private token = '';
    private scope = '';

    public WithScope(scope: string): MangaHubBase {
        this.scope = scope;
        return this;
    }

    public override async Initialize(): Promise<void> {
        this.imageTaskPool.RateLimit = new RateLimit(8);
        await this.RenewApiKey();
    }

    private async RenewApiKey(): Promise<void> {
        this.token = RandomHex(32);
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('mhub_access', '${this.token}');`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const title = (await FetchCSS(new Request(new URL(url)), 'div#mangadetail div.container-fluid div.row h1')).at(0).firstChild.textContent.trim();
        return new Manga(this, provider, new URL(url).pathname.split('/').at(-1), title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run; offset += 50) {
                const { search: { rows } } = await this.FetchGQL<GQLMangas>(`
                    query ($scope: MangaSource) {
                        search(x: $scope, q: "", genre: "all", mod: ALPHABET, limit: 50, offset: ${offset}) { rows { id, slug, title } }
                    }`, { scope: this.scope });
                const mangas = rows.map(manga => new Manga(this, provider, manga.slug, DecodeEntities(manga.title).trim()));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { manga: { chapters } } = await this.FetchGQL<GQLChapters>(`
            query ($scope: MangaSource, $slug: String) {
                manga(x: $scope, slug: $slug) { chapters { number, title } }
            }
        `, { scope: this.scope, slug: manga.Identifier });
        return chapters.map(({ number, title: chaptertitle }) => {
            let title = `Ch.${number}`;
            title += chaptertitle ? ` - ${chaptertitle}` : '';
            return new Chapter(this, manga, `${number}`, title.trim());
        }).reverse();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const cryptoParams = await FetchJSON<CryptoParams>(new Request(new URL('./chapter-crypto', this.localeAPI)));

        const { chapter: { pages } } = await this.FetchGQL<GQLPages>(`
            query ($scope: MangaSource, $manga: String!, $chapter: Float!) {
                chapter(x: $scope, slug: $manga, number: $chapter) { pages }
            }
        `, {
            scope: this.scope,
            manga: chapter.Parent.Identifier,
            chapter: parseFloat(chapter.Identifier),
        });

        let jsonPages: JSONPages = undefined;

        if (pages.startsWith('enc:v1')) {
            const [, , keyId, iv, authTag, ciphertext] = pages.split(':');
            const keydata = cryptoParams.keys && cryptoParams.keys[keyId] ? cryptoParams.keys[keyId] : cryptoParams.key;
            const key = await crypto.subtle.importKey('raw', GetBytesFromURLBase64(keydata), { name: 'AES-GCM' }, !1, ['decrypt']);
            const decrypted = await crypto.subtle.decrypt({
                name: 'AES-GCM',
                iv: GetBytesFromURLBase64(iv),
                tagLength: 128
            }, key, this.ConcatBuffers(GetBytesFromURLBase64(ciphertext), GetBytesFromURLBase64(authTag)));
            jsonPages = <JSONPages>JSON.parse(GetUTF8FromBytes(decrypted));
        } else {
            jsonPages = <JSONPages>JSON.parse(pages);
        }

        return jsonPages['i'] ?
            jsonPages['i'].map(pageNumber => new Page(this, chapter, new URL(`${jsonPages['p']}${pageNumber}`, this.cdnURL)))
            :
            Object.values(jsonPages as string[]).map(page => new Page(this, chapter, new URL(page, this.cdnURL)));
    }

    private ConcatBuffers(...arrays: Uint8Array[]): Uint8Array<ArrayBuffer> {
        const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const arr of arrays) {
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    }

    private async FetchGQL<T extends JSONElement>(query: string, variables: JSONObject, remainingRetryAttempts = 3): Promise<T> {
        const request = new Request(new URL(this.apiURL), {
            headers: {
                'Origin': this.URI.origin,
                'Referer': this.URI.href,
                'X-MHub-Access': this.token,
            }
        });

        try {
            return await FetchGraphQL(request, undefined, query, variables);
        } catch (error) {
            const message = error.params?.join('');
            if (remainingRetryAttempts <= 0) throw error;
            if (/rate\s*limit/i.test(message)) await Delay(2500);
            if (/api\s*key\s*(invalid)?/i.test(message)) await this.RenewApiKey();
            return this.FetchGQL(query, variables, remainingRetryAttempts - 1);
        }
    }
}