import { Tags } from '../Tags';
import icon from './MangaTR.webp';
import { HashUTF8 } from '../Crypto';
import { GetHexFromBytes } from '../BufferEncoder';
import { FisherYates, XorShift32 } from '../Random';
import { FetchHTML, FetchWindowPreloadScript, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import * as Common from './decorators/Common';

type PageParameters = {
    parts?: string[];
    seed: number;
    grid: number;
};

const transformations = new Map([
    [0, { x: 1, y: 1 }],
    [1, { x: -1, y: 1 }],
    [2, { x: 1, y: -1 }],
    [3, { x: -1, y: -1 }],
]);

AddAntiScrapingDetection(async (invoke) => {
    const result = await invoke<boolean>(`document.title === 'Bot Koruması' && document.querySelector('canvas#sliderCanvas') != undefined`);
    return result ? FetchRedirection.Interactive : undefined;
}, /^https:\/\/manga-tr\.com/);

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatr', 'Manga-TR', 'https://manga-tr.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(new URL('/manga-list.html', this.URI)), `
            // The 'read_only' cookie is HttpOnly => Cannot be replaced via cookieStore.set('read_type', '1'), only via HTTP response
            fetch('/app/manga/controllers/cont.readType.php', {
                method: 'POST',
                body: new URLSearchParams({ action: 'type', type: '1' }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            });
        `);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+\.html$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const title = await FetchWindowScript<string>(new Request(uri), `document.querySelector('.bento-hero-title').textContent.trim()`, 1500);
        return new Manga(this, provider, uri.pathname, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await FetchWindowScript<{ id: string, title: string }[]>(new Request(new URL('/manga-list.html', this.URI)), `
                [...document.querySelectorAll('a.la-manga-item:not([data-original-title=""])')].map( manga => ({ id: manga.pathname, title: manga.dataset.originalTitle.trim()  }));
        `, 1500);
        return mangas.map(({ id, title }) => new Manga(this, provider, id, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(manga.Identifier, this.URI);

        const eventName = crypto.randomUUID();
        const preload = `
            crypto.subtle.digest = new Proxy( crypto.subtle.digest, {
                apply(target, thisArg, argArray) {
                    try {
                        const { tur, manga } = document.querySelector('#results')?.dataset;
                        const result = { tur, raw: new TextDecoder().decode(new Uint8Array(argArray[1])) };
                        if (manga && result.raw.startsWith(manga)) setInterval(() => window.dispatchEvent(new CustomEvent('${eventName}', { detail: result })), 250);
                    } catch { }
                    return Reflect.apply(target, crypto.subtle, argArray);
                }
            });
        `;
        const script = `new Promise(resolve => window.addEventListener('${eventName}', event => resolve(event.detail), { once: true }));`;

        const { raw, tur } = await FetchWindowPreloadScript<{ tur: string, raw: string }>(new Request(uri), preload, script, 0);
        const [mangaSlug, seed] = raw.split('_');
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { ts, sig } = await this.Sign(mangaSlug, seed);
                const dom = await FetchHTML(new Request(new URL('/cek/fetch_pages_manga.php', this.URI), {
                    headers: {
                        'Referer': uri.href,
                        'Origin': this.URI.origin, // TODO: really required?
                        'X-Requested-With': 'XMLHttpRequest',
                        "Sec-Fetch-Site": "same-origin",
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                    },
                    credentials: 'include',
                    method: 'POST',
                    body: new URLSearchParams({
                        manga: mangaSlug,
                        page: `${page}`,
                        tur,
                        _t: `${ts}`,
                        _sig: sig
                    }),
                }));

                const chapters = [...dom.querySelectorAll<HTMLAnchorElement>('a.bento-ep-title-link')].map(anchor => {
                    return new Chapter(this, manga, anchor.pathname, anchor.text.replace(manga.Title, '').trim() || anchor.text.trim());
                });
                yield* chapters;

                run = dom.querySelector<HTMLInputElement>('input#has-more-chapters')?.value === '1';
            }
        }.call(this));
    }

    private async Sign(mangaSlug: string, seed: string){
        const ts = Math.floor(Date.now() / 1000);
        return { ts, sig: GetHexFromBytes(await HashUTF8('SHA-256', `${mangaSlug}_${seed}_${ts}`)) };
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const eventName = crypto.randomUUID();
        const preload = `
            (() => {
                const nativeJsonParse = JSON.parse;
                JSON.parse = new Proxy(JSON.parse, {
                    apply(target, thisArg, argArray) {
                        const result = Reflect.apply(target, thisArg, argArray);
                        if (result.cls && result.data && result.key) {
                            try {
                                JSON.parse = nativeJsonParse;
                                setInterval(() => window.dispatchEvent(new CustomEvent('${eventName}', { detail: result })), 250);
                            } catch { }
                        }
                        return result;
                    }
                });
            })();
        `;
        const pageScript = `
            new Promise((resolve, reject) => {

	            function decrypt(encoded, key) {
                    if (!encoded) return undefined;
		            const encrypted = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
		            const bytes = new Uint8Array(encrypted.length)
                        .map((_, index) => encrypted.charCodeAt(index) ^ key.charCodeAt(index % key.length));
                    return JSON.parse(new TextDecoder().decode(bytes));
	            }

	            window.addEventListener('${eventName}', event => {
					try {
    		            const { cls, data, key, grid, seeds } = event.detail;
    		            const pages = [...document.querySelectorAll('.'+ cls.page)].map(element => {
    			            const parts = decrypt(element.getAttribute(data.parts), 'attr|' + key +'|reader');
                            const pageIndex = element.getAttribute(data.pageIndex);
                            const seed = seeds?.[pageIndex] ?? seeds?.[0] ?? 0;
    			            return ({ parts, seed, grid });
    		            });
    		            resolve(pages);
					} catch(error) {
					    reject(error);
					}
	            }, { once: true });
            });
        `;

        const elements = await FetchWindowPreloadScript<PageParameters[]>(new Request(new URL(chapter.Identifier, this.URI)), preload, pageScript, 0);
        return elements.map(({ parts, seed, grid }) => {
            return new Page<PageParameters>(this, chapter, new URL(parts.at(0)), { Referer: this.URI.href, seed, grid });
        });
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const { seed, grid } = page.Parameters;
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (!seed || !grid) return blob;

        return DeScramble(blob, async (sourceImage, ctx) => {
            const prng = XorShift32((seed & -1) >>> 0 || 123456789);
            const pieces = FisherYates.WithModuloDerivation(prng)
                .Shuffle(...new Array(grid ?? 2).keys())
                .map((dstIndex, srcIndex) => ({ srcIndex, dstIndex, scale: transformations.get(prng.next().value % 4) }));
            const blockWidth = sourceImage.width;
            const blockHeight = sourceImage.height / pieces.length;

            for (const { srcIndex, dstIndex, scale } of pieces) {
                const srcPosX = 0;
                const srcPosY = srcIndex * blockHeight;
                const dstPosX = 0;
                const dstPosY = dstIndex * blockHeight;
                ctx.save();
                ctx.translate(dstPosX + blockWidth / 2, dstPosY + blockWidth / 2);
                ctx.scale(scale.x, scale.y);
                ctx.drawImage(sourceImage, srcPosX, srcPosY, blockWidth, blockHeight, -0.5 * blockWidth, -0.5 * blockHeight, blockWidth, blockHeight);
                ctx.restore();
            }
        });
    }
}