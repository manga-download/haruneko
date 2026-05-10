import { Tags } from '../Tags';
import icon from './SoftKomik.webp';
import * as Common from './decorators/Common';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchJSON, FetchWindowPreloadScript } from '../platform/FetchProvider';
import { RandomText } from '../Random';
import { Delay } from '../BackgroundTimers';

type APIMangas = {
    data: {
        title: string;
        title_slug: string;
    }[];
};

type TokenData = {
    token: string;
    sign: string;
    ex: number;
};

class DRMProvider {

    #auth: TokenData = undefined;

    constructor(private readonly uri: URL, private readonly api: URL) { }

    private async RefreshToken(): Promise<void> {

        if (this.#auth?.ex > Date.now()) return;

        const eventName = RandomText(Math.random() * 8 + 8);
        this.#auth = await FetchWindowPreloadScript<TokenData>(new Request(new URL('/komik/list', this.uri)), `
            JSON.parse = new Proxy(JSON.parse, {
                apply: function(funcNative, funcThis, funcArgs) {
                    const result = Reflect.apply(funcNative, funcThis, funcArgs);
                    if (result?.token && result?.sign && result?.ex) {
                        setInterval(() => window.dispatchEvent(new CustomEvent('${eventName}', { detail: result })), 250);
                    }
                    return result;
                }
            });
        `, `
            new Promise(resolve => {
                window.addEventListener('${eventName}', event => resolve(event.detail), { once: true });
            });
        `);
    }

    public async FetchSigned<T extends JSONElement>(endpoint: string): Promise<T> {
        await this.RefreshToken();
        return FetchJSON<T>(new Request(new URL(endpoint, this.api), {
            headers: {
                'Referer': this.uri.href,
                'X-Token': this.#auth.token,
                'X-Sign': this.#auth.sign,
            }
        }));
    }
}

@Common.MangaCSS(/^{origin}\/[^/]+$/, 'div.bg-content.title h1', (element, uri) => ({ id: uri.pathname.split('/').at(-1), title: element.textContent.trim() }))
@Common.ChaptersSinglePageJS(`[...document.querySelectorAll('div.chapter-list a')].map(el => ({ id: el.pathname, title:el.textContent.trim() }))`, 1500)
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div.container-img img')].map(img => img.src)`, 2500)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    #drm: DRMProvider = new DRMProvider(this.URI, new URL('https://v2.softdevices.my.id/'));

    public constructor() {
        super('softkomik', 'Softkomik', 'https://softkomik.co', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run && page; page++) {
                const { data } = await this.#drm.FetchSigned<APIMangas>(`./komik?sortBy=newKomik&limit=50&page=${page}`);
                const mangas = data.map(({ title, title_slug: slug }) => new Manga(this, provider, slug, title.trim()));
                mangas.length > 0 ? yield* mangas : run = false;
                await Delay(1000);
            }
        }.call(this));
    }
}