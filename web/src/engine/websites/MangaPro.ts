import { GetBytesFromURLBase64 } from '../BufferEncoder';
import { Tags } from '../Tags';
import { FetchJSON, FetchNextJS, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import type { Priority } from '../taskpool/TaskPool';
import DeScramble from '../transformers/ImageDescrambler';
import icon from './MangaPro.webp';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T;
};
/*
type APIManga = {
    id: number;
    title: string;
    slug: string;
    type: string;
};*/

type APIChapter = {
    id: number;
    content_id: number;
    chapter_number: string;
};

type ImagesData = {
    images: string[];
    deferredMedia: {
        token: string;
    }
    //maps: MappedImage[];
};

type DeferredData = {
    splitIndex: number;
    images: string[];
    maps: MappedImage[];
};

type MappedImage = {
    dim?: number[];//[width, height]
    mode?: string;
    order?: number[];
    pieces?: string[];
    token?: string;
    method?: 'browser' | 'browser_session';
};

type PageData = {
    map?: MappedImage;
};

type ImageToken = {
    token: string;
    expires: number;
};

type ScrambleDecryptionData = {
    m: 'browser' | 'browser_session';
    //v: number;
    iv: string;
    tag: string;
    data: string;
    cid: string;
};

type SessionKey = {
    data?: {
        key?: string;
    },
    key?: string;
};

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/series\/(manga|manhua|manhwa)\/\d+\/[^/]+$/, 'meta[property="og:image:alt"]')
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://prochan.net/api/';
    private readonly turnstileApiKey = '0x4AAAAAACk1d7qWJi_of2qU';

    public constructor() {
        super('mangapro', 'ProChan', 'https://prochan.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangascript =`
            new Promise(function (resolve, reject) {
                const element = document.createElement('div');
                document.body.appendChild(element);

                const mangalist = [];

                // Turnstile wrapper
                function requestWithTurnstile(url) {
                    return new Promise(function (resolve, reject) {
                        turnstile.render(element, {
                            sitekey: '${this.turnstileApiKey}',
                            callback: async function (token) {
                                try {
                                    const res = await fetch(url, {
                                        method: "GET",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "x-turnstile-token": token
                                        }
                                    });

                                    if (!res.ok) throw new Error("HTTP " + res.status);

                                    const json = await res.json();
                                    resolve(json);
                                } catch (err) {
                                    reject(err);
                                }
                            }
                        });
                    });
                }

                // Async IIFE for pagination
                (async function () {
                    try {
                        for (let page = 1; ; page++) {
                            const result = await requestWithTurnstile(
                                "/api/public/series/search?status=approved&limit=50&page=" + page + "&sort=latest"
                            );

                            const data = result.data;

                            if (data.length === 0) break;

                            const mangas = data
                                .filter(function (item) { return item.type !== "novel"; })
                                .map(function (item) {
                                    return {
                                        id: "/series/" + item.type + "/" + item.id + "/" + item.slug,
                                        title: item.title
                                    };
                                });

                            mangalist.push(...mangas);
                        }

                        resolve(mangalist);
                    } catch (err) {
                        reject(err);
                    }
                })();
            });
        `;

        const mangas = await FetchWindowScript<{ id: string, title: string }[]>(new Request(new URL('/series', this.URI)), mangascript, 3000, 60_000);
        return mangas.map(manga => new Manga(this, provider, manga.id, manga.title));
    }

    /* // API need a new turnstile token for each request, so disabled for now
    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await this.FetchAPI<APIResult<APIManga[]>>(`./public/series/search?limit=18&page=${page}&sort=latest`);
                const mangas = data.filter(({ type }) => type !== 'novel')
                    .map(({ id, title, type, slug }) => new Manga(this, provider, `/series/${type}/${id}/${slug}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }*/

    public override FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [, , type, mangaId] = manga.Identifier.split('/');
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await this.FetchAPI<APIResult<APIChapter[]>>(`./public/${type}/${mangaId}/chapters?page=${page}&limit=500&order=desc`);
                const chapters = data.map(({ id, chapter_number: chapterNumber }) => new Chapter(this, manga, `${manga.Identifier}/${id}/${chapterNumber}`, `Chapter ${chapterNumber}`));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        const chapterId = chapterUrl.pathname.split('/').at(-2);
        const { images, deferredMedia: { token } } = await FetchNextJS<ImagesData>(new Request(chapterUrl), data => 'deferredMedia' in data);

        // Regular images
        const pages = images.map(image => new Page<PageData>(this, chapter, new URL(image, this.URI), { Referer: chapterUrl.href }));

        // deffered images

        const pageScript = `
            new Promise(async (resolve, reject) => {
                try {
                    if (!window.turnstile) throw new Error("Turnstile is not loaded");

                    // Temporary container for the widget
                    const container = document.createElement("div");
                    document.body.appendChild(container);

                    // Render the Turnstile widget
                    turnstile.render(container, {
                        sitekey: '${this.turnstileApiKey}',
                        callback: async function(token) {
                            try {
                                document.body.removeChild(container);

                                // Build URL without template strings
                                const url = '/chapter-deferred-media/' + ${JSON.stringify(chapterId)} + '?token=' + ${JSON.stringify(encodeURIComponent(token))};

                                // Use token in fetch request
                                const response = await fetch(url, {
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "X-Turnstile-Token": token
                                    },
                                });

                                if (!response.ok) throw new Error("HTTP error! status: " + response.status);

                                const json = await response.json();
                                resolve(json); // resolves the promise with JSON
                            } catch (err) {
                                reject(err);
                            }
                        },
                        "error-callback": function() {
                            document.body.removeChild(container);
                            reject(new Error("Turnstile failed to generate a token"));
                        },
                        "expired-callback": function() {
                            document.body.removeChild(container);
                            reject(new Error("Turnstile token expired"));
                        }
                    });
                } catch (err) {
                    reject(err);
                }
            });
        const { data: { images: deferredImages, maps } } = await FetchWindowScript<APIResult<DeferredData>>(new Request(chapterUrl), pageScript, 3000, 10_000);
        //const { data: { images: deferredImages, maps } } = await this.FetchAPI<APIResult<DeferredData>>(`./chapter-deferred-media/${chapterUrl.pathname.split('/').at(-2) }?token=${encodeURIComponent(token)}`, this.URI.origin);

        // Delayed images: regular images
        for (let image of deferredImages) {
            const page = new Page<PageData>(this, chapter, new URL(image, this.URI), { Referer: chapterUrl.href });
            pages.push(page);
        }

        // Delayed images: Mapped images (puzzled)
        for (let map of maps) {
            const page = new Page<PageData>(this, chapter, this.URI, { map, Referer: chapterUrl.href });
            pages.push(page);
        };
        return pages;
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        if (!page.Parameters?.map) {
            if (page.Link.hostname.startsWith('cdn')) {
                page.Link.href = (await this.SignUrl(page.Link, page.Parameters.Referer)).href;
            }
            return Common.FetchImageAjax.call(this, page, priority, signal, true);
        }
        return this.imageTaskPool.Add(async () => {
            //MappedImage is either : dim, mode, order, pieces (unencrypted) either crypted : method, token
            const { dim, mode, order, pieces } = !page.Parameters.map.method ? page.Parameters.map : await this.DecryptMappedImage(page.Parameters.map);

            const [puzzleMode, layout] = mode.split('_');
            return DeScramble(new ImageData(dim[0], dim[1]), async (_, ctx) => {

                const orderedPieces = order.map(index => pieces[index]);
                let images = await Promise.all(orderedPieces.map(piece => this.LoadImage(piece, new URL(page.Parent.Identifier, this.URI).href)));

                switch (puzzleMode) {
                    case 'vertical': {
                        let x = 0;
                        for (const img of images) {
                            ctx.drawImage(img, x, 0);
                            x += img.width;
                        }
                    };
                    case 'grid': {
                        const [cols, rows] = layout.split('x').map(value => parseInt(value));

                        let y = 0;
                        for (let r = 0; r < rows; r++) {
                            let x = 0;
                            for (let c = 0; c < cols; c++) {
                                const index = r * cols + c;
                                if (index < images.length) {
                                    const img = images[index];
                                    ctx.drawImage(img, x, y, img.width, img.height);
                                    x += img.width;
                                }
                            }
                            const rowImages = images.slice(r * cols, (r + 1) * cols);
                            const rowHeight = Math.max(...rowImages.map(i => i.height));
                            y += rowHeight;
                        }
                    };
                }
                images = null;
            });

        }, priority, signal);
    }

    private async DecryptMappedImage(cryptedMappedImage: MappedImage): Promise<MappedImage> {
        const { m, data, iv, cid, tag, /*v*/ }: ScrambleDecryptionData = JSON.parse(new TextDecoder().decode(GetBytesFromURLBase64(cryptedMappedImage.token)));
        const encrypted = new Uint8Array([...GetBytesFromURLBase64(data), ...GetBytesFromURLBase64(tag)]);

        let keyData: ArrayBuffer;
        switch (m) {
            case 'browser': {
                keyData = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`prochan-browser-map:2e6f9a1c4d8b7e3f0a5c9d2b6e1f4a8c7d3b0e6a9f2c5d8b1e4a7c0d3f6b9e2:${cid}`));
                break;
            }
            case 'browser_session': {
                // UNTESTED (perhaps its for premium content ? )
                const { data, key } = await this.FetchAPI<SessionKey>(`./chapter-map-session-key/${cid}`, this.URI.origin);
                keyData = GetBytesFromURLBase64(data?.key ?? key).buffer;
                break;
            }
        };

        const key = await crypto.subtle.importKey('raw', keyData, { name: 'AES-GCM' }, false, ['decrypt']);
        const algorythm = { name: 'AES-GCM', iv: GetBytesFromURLBase64(iv), tagLength: 128 };
        const decryptedBytes = await crypto.subtle.decrypt(algorythm, key, encrypted);
        return JSON.parse(new TextDecoder().decode(decryptedBytes)) as MappedImage;
    }

    private async SignUrl(url: URL, chapterUrl: string): Promise<URL> {
        const { expires, token } = await this.FetchAPI<ImageToken>('./cdn-image/sign', undefined, { url: url.href }, chapterUrl);
        url.searchParams.set('token', token);
        url.searchParams.set('expires', expires.toString());
        return url;
    }

    private async LoadImage(src: string, chapterUrl: string): Promise<HTMLImageElement> {
        if (src.startsWith('/')) {
            const [, , type] = new URL(chapterUrl).pathname.split('/');
            const cdn = type === 'manga' ? 'cdn1' : type === 'manhua' ? 'cdn2' : 'cdn3';
            src = `https://${cdn}.${this.URI.host}${src}`;
        }

        let url = new URL(src);
        if (url.hostname.startsWith('cdn')) {
            url = await this.SignUrl(url, chapterUrl);
        };
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url.href;
        });
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, base: string = this.apiUrl, body: JSONElement = undefined, referer: string = undefined): Promise<T> {
        return await FetchJSON<T>(new Request(new URL(endpoint, base), {
            method: body ? 'POST' : 'GET',
            credentials: 'include',
            body: body ? JSON.stringify(body) : undefined,
            headers: {
                'Content-Type': 'application/json',
                'Sec-Fetch-Site': 'same-origin',
                ...referer && { Referer: referer },
                Origin: this.URI.origin
            },
            cache: 'no-store'
        }));
    }
}