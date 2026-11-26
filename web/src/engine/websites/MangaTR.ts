import { Tags } from '../Tags';
import icon from './MangaTR.webp';
import { HashUTF8, XOR } from '../Crypto';
import { GetBytesFromUTF8, GetHexFromBytes, GetUTF8FromBytes } from '../BufferEncoder';
import { Fetch, FetchHTML, FetchWindowPreloadScript, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import * as Common from './decorators/Common';
import { Delay } from '../BackgroundTimers';
import { DrmProvider } from './MangaTR.DRM';

type ChapterData = {
    tickets: string[];
    readerSid: string;
    pagesCount: number;
};

type PageInfo = {
    index: number;
    url?: string;
    tk: number;
    ticket: string;
};

AddAntiScrapingDetection(async (invoke) => {
    const result = await invoke<boolean>(`document.title === 'Bot Koruması' && document.querySelector('canvas#sliderCanvas') != undefined`);
    return result ? FetchRedirection.Interactive : undefined;
}, /^https:\/\/manga-tr\.com/);

export default class extends DecoratableMangaScraper {
    #Drm = new DrmProvider();

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

    private async Sign(mangaSlug: string, seed: string) {
        const ts = Math.floor(Date.now() / 1000);
        return { ts, sig: GetHexFromBytes(await HashUTF8('SHA-256', `${mangaSlug}_${seed}_${ts}`)) };
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { tickets, readerSid, pagesCount } = await FetchWindowScript<ChapterData>(new Request(new URL(chapter.Identifier, this.URI)), `
            new Promise(resolve => {
	            resolve({
		            tickets: MTR_BATCH_TICKETS,
		            readerSid: MTR_READER_SID ?? '',
		            pagesCount: [...document.querySelectorAll(".reader-page-wrap, .reader-webtoon-wrap")].length
	            });
            });
        `, 750);

        const pagesMap = new Map<number, PageInfo>();
        let pageIndex = 0;

        while (pagesMap.size < pagesCount) {
            if (!pagesMap.has(pageIndex)) {
                const ticket = tickets[Math.floor(pageIndex / 3)];
                const pagesInfos = await this.FetchImagesInfo(ticket, readerSid);
                pagesInfos.forEach(page => pagesMap.set(page.index, page));
                await Delay(500); // 500ms delay between requests to avoid triggering anti-scraping measures*/
            }
            pageIndex++;
        }

        return Array.from(pagesMap.values()).map(({ tk, url, ticket, index }) => new Page(this, chapter, new URL(url), { Referer: this.URI.href, tk, ticket, index }));
    }

    private async FetchImagesInfo(ticket: string, readerSid: string): Promise<PageInfo[]> {
        const payload = this.#Drm.BuildSignedPayloadPure(ticket, readerSid);
        const response = await Fetch(new Request(new URL('/reader/panel/', this.URI), {
            method: 'POST',
            body: payload.slice(),
            credentials: 'same-origin',
            headers: {
                Referer: this.URI.href,
                Origin: this.URI.origin,
                "Content-Type": 'application/octet-stream',
                "X-Requested-With": 'XMLHttpRequest',
                "Sec-Fetch-Dest": 'empty',
                "Sec-Fetch-Mode": 'cors',
                "Sec-Fetch-Site": 'same-origin',
            },
            cache: 'no-store',
        }));

        let panelBuffer = new Uint8Array(await response.arrayBuffer());
        //decode answer
        panelBuffer = XOR(panelBuffer, GetBytesFromUTF8(ticket));

        const view = new DataView(panelBuffer.buffer, panelBuffer.byteOffset, panelBuffer.byteLength);
        const count = view.getUint8(0);
        let offset = 1;
        const pages: PageInfo[] = [];

        for (let j = 0; j < count; j++) {
            const index = view.getUint16(offset, true);
            offset += 2;

            const tk = view.getUint32(offset, true);
            offset += 4;

            const urlLen = view.getUint16(offset, true);
            offset += 2;

            const end = offset + urlLen;
            const url = GetUTF8FromBytes(panelBuffer.subarray(offset, end));
            offset = end;

            pages.push({ index, url, tk, ticket });
        }
        return pages;
    }

    public override async FetchImage(page: Page<PageInfo>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const { index, ticket, tk } = page.Parameters;
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);

        return DeScramble(blob, async (sourceImage, ctx) => {
            const w = sourceImage.width;
            const h = sourceImage.height;

            function drawSlice(img: ImageBitmap, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number, flip: number) {
                if (sw <= 0 || sh <= 0) {
                    return;
                }
                const flipX = (flip & 1) !== 0;
                const flipY = (flip & 2) !== 0;
                ctx.save();
                ctx.translate(dx + (flipX ? dw : 0), dy + (flipY ? dh : 0));
                ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
                ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
                ctx.restore();
            }

            const { slice1SrcX, slice1Width, slice1Flip, slice2SrcX, slice2Width, slice2Flip } = this.#Drm.GetSlices(index, tk, GetBytesFromUTF8(ticket), w, h);
            drawSlice(sourceImage, slice1SrcX, 0, slice1Width, h, 0, 0, slice1Width, h, slice1Flip);
            drawSlice(sourceImage, slice2SrcX, 0, slice2Width, h, slice1Width, 0, slice2Width, h, slice2Flip);
        });
    }
}