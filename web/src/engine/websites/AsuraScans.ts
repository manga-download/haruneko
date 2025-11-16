import { Tags } from '../Tags';
import icon from './AsuraScans.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchJSON, FetchNextJS, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type APIResult<T> = {
    success: boolean;
    data: T;
};

type HydratedPages = {
    chapter: {
        id: number;
        pages: {
            url: string;
        }[];
    }
};

type APIPages = APIResult<{
    unlock_token: string;
    pages: {
        id?: number;
        url?: string;
    }[]
}>

type APIMedia = {
    data: string;
};

type PageParameters = {
    chapterId: number;
    mediaId: number;
    token: string;
} | null;

const excludes = [
    /panda_gif_large/i,
    /2021\/04\/page100-10\.jpg/i,
    /2021\/03\/20-ending-page-\.jpg/i,
    /ENDING-PAGE/i,
    /EndDesignPSD/i
];

const chapterScript = `
    new Promise( resolve => {
        resolve( [...document.querySelectorAll('a[href*="/chapter/"]:has(h3.text-xs)')].map(chapter => {
            return {
                id: chapter.pathname.replace(/(-[^-]+\\/chapter)/, '-/chapter'),
                title : chapter.querySelector('h3').innerText.replace('\\n', ' ').trim()
            };
        }));
    });
`;

function MangaLinkExtractor(title: HTMLTitleElement, uri: URL) {
    return {
        id: uri.pathname.replace(/-[^-]+$/, '-'),
        title: title.innerText.replace(/-[^-]+$/, '').trim(),
    };
}

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname.replace(/-[^-]+$/, '-'),
        title: anchor.querySelector('div.items-center span.font-bold').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'head title', MangaLinkExtractor)
@Common.MangasMultiPageCSS('div.grid a', Common.PatternLinkGenerator('/series?page={page}'), 0, MangaInfoExtractor)
@Common.ChaptersSinglePageJS(chapterScript, 500)
export default class extends DecoratableMangaScraper {
    private readonly drmProvider: DRMProvider;

    public constructor() {
        super('asurascans', 'Asura Scans', 'https://asuracomic.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
        this.drmProvider = new DRMProvider(this.URI, 'https://gg.asuracomic.net/api/');
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript<string>(new Request(this.URI), `window.cookieStore.set('imageQuality', JSON.stringify({'HD': true}));window.location.origin;`);
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
        await this.drmProvider.UpdateToken();
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { chapter: chapterData } = await FetchNextJS<HydratedPages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'chapter' in data);
        if (chapterData.pages.length > 0) {
            return this.FilterPages(chapterData.pages.map(({ url }) => new Page(this, chapter, new URL(url))));
        };

        //pages is empty, chapter may be early access : try to get pages id and unlock token
        const { data: { unlock_token, pages } } = await this.drmProvider.FetchAPI<APIPages>('./chapter/max-quality', JSON.stringify({ chapterId: chapterData.id }), 'POST');

        //if unlock_token is undefined, we have the direct page url
        if (!unlock_token) {
            return this.FilterPages(pages.map(({ url }) => new Page(this, chapter, new URL(url))));
        } else {
            //otherwise FetchImage will have to request real image url
            return pages.map(page => new Page<PageParameters>(this, chapter, new URL(this.URI), { chapterId: chapterData.id, mediaId: page.id, token: unlock_token }));
        }
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        if (!page.Parameters) return Common.FetchImageAjax.call(this, page, priority, signal);
        return this.imageTaskPool.Add(async () => {

            //get real image url :
            const { data } = await this.drmProvider.FetchAPI<APIMedia>('./media', JSON.stringify({
                chapter_id: page.Parameters.chapterId,
                media_id: page.Parameters.mediaId,
                quality: 'max-quality',
                token: page.Parameters.token,
                signal
            }), 'POST');

            const response = await Fetch(new Request(data, {
                signal: signal,
                headers: {
                    Referer: this.URI.href
                }
            }));
            return response.blob();
        }, priority, signal);
    }

    private FilterPages(pages: Page<PageParameters>[]): Page<PageParameters>[] {
        return pages.filter(page => excludes.none(pattern => pattern.test(page.Link.pathname)));
    }
}

/**
 * A basic oAuth token manager with AsuraScans specific business logic
 */
class DRMProvider {
    #crsfToken: string = null;

    constructor(private readonly clientURI: URL, private readonly apiUrl: string) { }

    /**
     * Get Crsf token needed for api directly from page cookies
     */
    public async UpdateToken() {
        try {
            this.#crsfToken = await FetchWindowScript<string>(new Request(this.clientURI), `
               new Promise(async (resolve, reject) => {
                   try {
                       resolve(decodeURIComponent((await window.cookieStore.get('XSRF-TOKEN'))?.value));
                   }
                   catch {
                       reject();
                   }
               });
            `);
        } catch (error) {
            console.warn('UpdateToken()', error);
            this.#crsfToken = null;
        }
    }

    /**
     * Determine the crsfToken extracted from the current token and add it as authorization header to the given {@link init} headers (replacing any existing authorization header).
     * In case the crsfToken could not be extracted from the current token the authorization header will not be added/replaced.
     */
    private async ApplyToken(init: HeadersInit): Promise<HeadersInit> {
        const headers = new Headers(init);
        if (this.#crsfToken) {
            //await this.RefreshToken();
            headers.set('x-xsrf-token', this.#crsfToken);
        }
        return headers;
    }

    public async FetchAPI<T extends JSONElement>(endpoint: string, body: string = undefined, method: string = 'GET') {
        const request = new Request(new URL(endpoint, this.apiUrl), {
            method,
            credentials: 'include',
            body: body ? body : null,
            headers: await this.ApplyToken({
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                Referer: this.clientURI.href,
                Origin: this.clientURI.origin
            }),
        });
        return FetchJSON<T>(request);
    }
}