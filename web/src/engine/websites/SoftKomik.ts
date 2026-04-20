import { Tags } from '../Tags';
import icon from './SoftKomik.webp';
import * as Common from './decorators/Common';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchJSON, FetchWindowPreloadScript } from '../platform/FetchProvider';
import { RandomText } from '../Random';

type APIManga = {
    title: string;
    title_slug: string;
};

type APIMangas = {
    data: APIManga[];
};

type TokenData = {
    token: string;
    sign: string;
    ex: number;
};

function tokenScript(eventName: string): string {
    return `
        JSON.parse = new Proxy(JSON.parse, {
            apply: function(target, thisArg, argumentsList) {
                const result = Reflect.apply(target, thisArg, argumentsList);
                if( result?.token && result?.ex && result?.sign)
                    setInterval(() => window.dispatchEvent(new CustomEvent('${eventName}', { detail: result })), 250);
                return result;
            }
        });
    `;
};

function payloadScript(eventName: string): string {
    return `
        new Promise( resolve => {
            window.addEventListener('${eventName}', event => resolve(event.detail), { once: true });
        });
    `;
};

@Common.MangaCSS(/^{origin}\/[^/]+$/, 'div.bg-content.title h1', (element, uri) => ({ id: uri.pathname.split('/').at(-1), title: element.textContent.trim() }))
@Common.ChaptersSinglePageJS(`[...document.querySelectorAll('div.chapter-list a')].map(el => ({ id: el.pathname, title:el.textContent.trim() }))`, 1500)
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div.container-img img')].map(img => img.src)`, 2500)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://v2.softdevices.my.id/';
    private websiteToken: TokenData = undefined;

    public constructor() {
        super('softkomik', 'Softkomik', 'https://softkomik.co', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await this.RefreshToken();
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run && page; page++) {
                const { data } = await this.FetchSigned<APIMangas>(`./komik?page=${page}&limit=50&sortBy=newKomik`);
                const mangas = data.map(({ title, title_slug: slug }) => new Manga(this, provider, slug, title.trim()));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    private async RefreshToken(): Promise<void> {
        if (this.websiteToken?.ex === undefined || Date.now() > this.websiteToken?.ex) {
            const eventName = RandomText(32);
            this.websiteToken = await FetchWindowPreloadScript<TokenData>(new Request(new URL('/komik/list', this.URI)), tokenScript(eventName), payloadScript(eventName));
        }
    }

    private async FetchSigned<T extends JSONElement>(endpoint: string): Promise<T> {
        await this.RefreshToken();
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl), {
            headers: {
                Origin: this.URI.origin,
                Referer: this.URI.href,
                'X-Token': this.websiteToken.token,
                'X-Sign': this.websiteToken.sign,
            }
        }));
    }
}