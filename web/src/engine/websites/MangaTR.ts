import { Tags } from '../Tags';
import icon from './MangaTR.webp';
import { FetchHTML, FetchWindowPreloadScript, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import * as Common from './decorators/Common';
import { RandomText } from '../Random';
import { HashUTF8 } from '../Crypto';
import { GetHexFromBytes } from '../BufferEncoder';

type Signature = {
    ts: number;
    sig: string;
}

type PageParameters = {
    parts?: string[];
    seed: number;
    grid: number;
};

type PiecesMap = {
    [key: number]: {
        scramIdx: number;
        flip: number;
    };
};

class PRNG {
    private state: number;
    constructor(seed: number = 123456789) {
        const sanitizedSeed = (seed & -1) >>> 0;
        this.state = sanitizedSeed === 0 ? 123456789 : sanitizedSeed;
    }

    #Next(): number {
        let x = this.state >>> 0;
        x = (x ^ x << 13) >>> 0;
        x = (x ^ x >>> 17) >>> 0;
        x = (x ^ x << 5) >>> 0;
        this.state = x >>> 0;
        return this.state;
    }

    public Sequence(length: number): { order: number[]; flips: number[] } {
        // Create an array of indices from 0 up to length - 1
        const order: number[] = Array.from({ length }, (_, i) => i);

        // Shuffle the array using the Fisher-Yates algorithm powered by xorshift32
        for (let i = length - 1; i > 0; i--) {
            const randomValue = this.#Next();
            const j = randomValue % (i + 1);

            // Swap elements
            const temp = order[i];
            order[i] = order[j];
            order[j] = temp;
        }

        // Generate an array of pseudo-random integers (0 to 3) for each element
        const flips: number[] = [];
        for (let i = 0; i < length; i++) {
            flips.push(this.#Next() % 4);
        }
        return { order, flips };
    }
}

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
        return FetchWindowScript(new Request(new URL('/manga-list.html', this.URI)), `window.cookieStore.set('read_type', '1')`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+\.html$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaUrl = new URL(url);
        const title = await FetchWindowScript<string>(new Request(mangaUrl), `document.querySelector('.bento-hero-title').textContent.trim()`, 1500);
        return new Manga(this, provider, mangaUrl.pathname, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await FetchWindowScript<{ id: string, title: string }[]>(new Request(new URL('/manga-list.html', this.URI)), `
                [...document.querySelectorAll('a.la-manga-item:not([data-original-title=""])')].map( manga => ({ id: manga.pathname, title: manga.dataset.originalTitle.trim()  }));
        `, 1500);
        return mangas.map(({ id, title }) => new Manga(this, provider, id, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaURL = new URL(manga.Identifier, this.URI);

        const eventName = RandomText(Math.random() * 8 + 8);
        const preload = `

            crypto.subtle.digest = new Proxy( crypto.subtle.digest, {
                apply(func, fthis, fargs) {
                    try {
                        // Make sure fargs[1] exists before trying to decode
                        if (fargs && fargs[1]) {
                            const raw = new TextDecoder().decode(new Uint8Array(fargs[1]));
                            const resultEL = document.querySelector('#results');
                            const slug = resultEL?.dataset?.manga;
                            const tur = resultEL?.dataset?.tur;
                            const myobj = { tur, raw };

                            if (slug && raw.startsWith(slug)) {
                                setInterval(() => window.dispatchEvent(new CustomEvent('${eventName}', { detail: myobj })), 250);
                            }
                        }
                    } catch (e) {
                        // Gracefully catch any decoding or DOM query errors
                    }

                    // Ensure 'this' points to crypto.subtle if it was lost or detached
                    const targetThis = (fthis === crypto.subtle) ? fthis : crypto.subtle;
                    return Reflect.apply(func, targetThis, fargs);
                }
            });
        `;
        const script = `
            new Promise(resolve => {
                window.addEventListener('${eventName}', event => resolve (event.detail), { once: true });
            });
        `;

        const { raw, tur } = await FetchWindowPreloadScript<{ tur: string, raw: string }>(new Request(mangaURL), preload, script, 0);
        const [mangaSlug, seed] = raw.split('_');

        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { ts, sig } = await this.Sign(mangaSlug, seed);
                const doc = await FetchHTML(new Request(new URL('/cek/fetch_pages_manga.php', this.URI), {
                    headers: {
                        Origin: this.URI.origin,
                        Referer: mangaURL.href,
                        'X-Requested-With': 'XMLHttpRequest',
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin",
                    },
                    credentials: 'include',
                    method: 'POST',
                    body: new URLSearchParams({
                        manga: mangaSlug,
                        page: `${page}`,
                        tur,
                        _t: `${ts}`,
                        _sig: sig
                    })
                }));

                const chapters = [...doc.querySelectorAll<HTMLAnchorElement>('a.bento-ep-title-link')].map(anchor => {
                    return new Chapter(this, manga, anchor.pathname, anchor.text.replace(manga.Title, '').trim() || anchor.text.trim());
                });
                yield* chapters;

                doc.querySelector<HTMLInputElement>('input#has-more-chapters')?.value === '1' ? run = true : run = false;
            }
        }.call(this));
    }

    private async Sign(mangaSlug: string, seed: string): Promise<Signature> {
        const ts = Math.floor(Date.now() / 1000);
        return { ts, sig: GetHexFromBytes(await HashUTF8('SHA-256', `${mangaSlug}_${seed}_${ts}`)) };
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const eventName = RandomText(Math.random() * 8 + 8);
        const preload = `
            (() => {
                const originalParse = JSON.parse;
                JSON.parse = new Proxy(JSON.parse, {
                    apply(target, thisArg, argumentsList) {
                        const result = Reflect.apply(target, thisArg, argumentsList);
                        if (result.cls && result.data && result.key) {
                            try {
                                JSON.parse = originalParse;
                                setInterval(() => window.dispatchEvent(new CustomEvent('${eventName}', {
                                    detail: result
                                })), 250);
                            } catch {}
                        }
                        return result;
                    }
                });
            })();
        `;

        const pageScript = `
            new Promise(resolve => {

	            function decrypt(encryptedStr, key) {
                    if (!encryptedStr) return undefined;
		            const base64 = encryptedStr.replace(/-/g, '+').replace(/_/g, '/');
		            const binaryString = atob(base64);

		            const bytes = new Uint8Array(binaryString.length);
		            for (let i = 0; i < binaryString.length; i++) {
			            bytes[i] = binaryString.charCodeAt(i);
		            }

		            for (let i = 0; i < bytes.length; i++) {
			            bytes[i] = bytes[i] ^ key.charCodeAt(i % key.length);
		            }
                    return JSON.parse(new TextDecoder().decode(bytes));
	            }

	            window.addEventListener('${eventName}', event => {
		            const {cls, data, key, grid, seeds} = event.detail;
		            const pages = [...document.querySelectorAll('.'+ cls.page)];
		 
		            resolve (pages.map(el=> {
			            const parts = decrypt(el.getAttribute(data.parts), "attr|"+ key +"|reader");
                        const pageIndex = el.getAttribute(data.pageIndex);
                        const seed = seeds?.[pageIndex] ?? seeds?.[0] ?? 0;
			            return ({ parts, seed, grid });
		            }));
	            } , { once: true });
            });
        `;

        const elements = await FetchWindowPreloadScript<PageParameters[]>(new Request(new URL(chapter.Identifier, this.URI)), preload, pageScript, 0);
        return elements.map(({ parts, seed, grid }) => {
            const imageUrl = parts.at(0);
            return new Page<PageParameters>(this, chapter, new URL(imageUrl), { Referer: this.URI.href, seed, grid });
        });
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const { seed, grid } = page.Parameters;
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (!seed || !grid) return blob;

        return DeScramble(blob, async (sourceImage, ctx) => {
            const imageWidth = sourceImage.width;
            const imageHeight = sourceImage.height;
            const gridSize = grid ?? 2;
            const { order, flips } = new PRNG(seed).Sequence(gridSize);
            const piecesMap: PiecesMap = {};

            for (let index = 0; index < gridSize; index++) {
                piecesMap[order[index]] = {
                    scramIdx: index,
                    flip: flips[index]
                };
            };

            const sliceHeight = imageHeight / gridSize;
            const sliceWidth = imageWidth;

            for (let index = 0; index < gridSize; index++) {
                const currentPiece = piecesMap[index];
                const scrambleIndex = currentPiece.scramIdx;
                const transformation = currentPiece.flip;

                // Source rectangle (where the slice comes from in the scrambled source image)
                const sx = 0;
                const sy = scrambleIndex * sliceHeight;
                const sWidth = sliceWidth;
                const sHeight = sliceHeight;

                // Destination rectangle (where the slice goes in the reconstructed image)
                const dx = 0;
                const dy = index * sliceHeight;
                const dWidth = sliceWidth;
                const dHeight = sliceHeight;
                ctx.save();

                // Replicate CSS transform-origin: 50% 50% (center of the slice)
                const cx = dx + dWidth / 2;
                const cy = dy + dHeight / 2;
                ctx.translate(cx, cy);

                // Apply scale transformations matching your CSS flips
                let scaleX = 1;
                let scaleY = 1;
                if (transformation === 1) {
                    scaleX = -1; // scaleX(-1)
                } else if (transformation === 2) {
                    scaleY = -1; // scaleY(-1)
                } else if (transformation === 3) {
                    scaleX = -1;
                    scaleY = -1; // scale(-1, -1)
                }
                ctx.scale(scaleX, scaleY);

                // Draw the image slice centered at the origin
                ctx.drawImage(sourceImage, sx, sy, sWidth, sHeight, -dWidth / 2, -dHeight / 2, dWidth, dHeight);

                ctx.restore();
            }
        });
    }
}