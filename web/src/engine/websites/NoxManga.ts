import { Tags } from '../Tags';
import icon from './NoxManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIManga = {
    slug: string;
    title: string;
};

type APIMangas = {
    comics: APIManga[];
};

type APIChapters = {
    chapters: {
        number: number;
        title?: string;
        id: string;
    }[];
};

type APIPages = {
    pages: {
        image_url: string;
    }[];
};

type SignParams = {
    day: string;
    slot: string;
    token: string;
    signature: string;
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.detail-info-section .detail-title', (el, uri) => ({ id: uri.pathname.split('/').at(-1), title: el.textContent.trim() }))
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://xodneo.site/api/v1/';
    private readonly siteId = '00000000-0000-0000-0000-000000000003';
    private cachedSignaturesMap = new Map<string, SignParams>();

    public constructor() {
        super('noxmanga', 'NoxManga', 'https://noxmangas.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { comics } = await this.FetchAPI<APIMangas>(`./comics?per_page=100&page=${page}`);
                const mangas = comics.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<APIChapters>(`./comics/slug/${manga.Identifier}/chapters?per_page=10000&sort=newest`);
        return chapters.map(({ number, title, id }) => new Chapter(this, manga, id, ['Capítulo', number, title ].joinTitleSegments()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await this.FetchAPI<APIPages>(`./chapters/${chapter.Identifier}?skip_view=true`);
        return pages.map(({ image_url: url }) => new Page(this, chapter, new URL(url)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        const url = new URL(endpoint, this.apiURL);
        const { day, slot, token, signature, } = await this.GetSignature(url.pathname);
        return FetchJSON<T>(new Request(url, {
            headers: {
                'Referer': this.URI.href,
                'Origin': this.URI.origin,
                'X-Site-Id': this.siteId,
                'X-Web-Slot': slot || day || '',
                'X-Web-Token': token,
                'X-Web-Signature': signature
            }
        }));
    }

    private async GetSignature(endpoint: string, method: string = 'GET'): Promise<SignParams> {
        if (this.cachedSignaturesMap.has(endpoint)) return this.cachedSignaturesMap.get(endpoint);

        const sig = await FetchWindowScript<SignParams>(new Request(this.URI), `
            new Promise( async (resolve, reject) => {
                try {
                    const { sign } = window.__NIX_SIGNER__;
                    const sig = await sign('${method}', '${endpoint}', '${this.siteId}');
                    const {day, slot, token, signature} = sig;
                    resolve({signature, slot, token, day});
                } catch (error) {
                    reject(error);
                }
            });
        `, 1750);

        this.cachedSignaturesMap.set(endpoint, sig);
        return sig;
    }
}