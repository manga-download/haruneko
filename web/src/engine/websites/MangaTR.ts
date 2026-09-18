import { Tags } from '../Tags';
import icon from './MangaTR.webp';
import { FetchHTML, FetchWindowPreloadScript, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import * as Common from './decorators/Common';
import { RandomText } from '../Random';

type EncodedPagesData = {
    order?: string; //stringified array of number
    parts: string; //stringified array of string
};

type PageOrder = {
    order: number[];
};

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
        const initialKey = await FetchWindowScript<string>(new Request(new URL(manga.Identifier, this.URI)), `window.mtrChapterKeys.listKey`, 500);
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, chapter_list_key = initialKey; chapter_list_key; page++) {
                const doc = await FetchHTML(new Request(new URL('/cek/fetch_pages_manga.php', this.URI), {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        Origin: this.URI.origin,
                        Referer: this.URI.href,
                        'Sec-Fetch-Site': 'same-origin'
                    },
                    credentials: 'include',
                    method: 'POST',
                    body: new URLSearchParams({
                        chapter_list_key
                    })
                }));

                const chapters = [...doc.querySelectorAll<HTMLAnchorElement>('a.bento-ep-title-link')].map(anchor => {
                    return new Chapter(this, manga, anchor.pathname, anchor.text.replace(manga.Title, '').trim() || anchor.text.trim());
                });
                yield* chapters;
                chapter_list_key = doc.querySelector<HTMLElement>(`a.pagination-link[data-page="${page + 1}"]`)?.dataset.key;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageOrder>[]> {
        const eventName = RandomText(Math.random() * 8 + 8);
        const preload = `
            JSON.parse = new Proxy(JSON.parse, {
              apply(target, thisArg, argumentsList) {
                const result = Reflect.apply(target, thisArg, argumentsList);
                if (result.cls && result.data && result.key){
					try{
						const pagekey = [...document.querySelector('script[type="application/json"][id^="rdm-"]').attributes].find(att => /[0-9a-f]{32}/.test(att.value)).value;
						const myobject = Object.assign({}, result, {});
						myobject.pagekey =  pagekey;
						setInterval(() => window.dispatchEvent(new CustomEvent('${eventName}', { detail: myobject })), 250);
					} catch {}
				}
                return result;
              }
            });
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
		            return new TextDecoder().decode(bytes);
	            }

	            window.addEventListener('${eventName}', event => {
		            const {cls, data, key, pagekey} = event.detail;
		            const pages = [...document.querySelectorAll('.'+ cls.page)];
		 
		            resolve (pages.map(el=> {
			            const parts = decrypt(el.getAttribute(data.parts), "attr|"+ pagekey +"|reader");
			            const order = decrypt(el.getAttribute(data.order), "order|"+ pagekey +"|reader");
			            return ({ order, parts });
		            }));
	            } , { once: true });
            });
        `;

        const elements = await FetchWindowPreloadScript<EncodedPagesData[]>(new Request(new URL(chapter.Identifier, this.URI)), preload, pageScript, 0);
        return elements.map(({ order, parts }) => {
            const imageUrl = (<string[]>JSON.parse(parts)).at(0);
            return new Page<PageOrder>(this, chapter, new URL(imageUrl), { Referer: this.URI.href, order: order ? JSON.parse(order): undefined });
        });
    }

    public override async FetchImage(page: Page<PageOrder>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const { order } = page.Parameters;
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (!order) return blob;

        return DeScramble(blob, async (sourceImage, ctx) => {
            const stripHeight = Math.floor(sourceImage.height / order.length);
            const totalHeight = stripHeight * order.length;

            ctx.canvas.height = totalHeight;

            order.forEach((code, sourceIndex) => {
                const flip = Math.floor(code / 100);
                const destination = code % 100;

                const srcY = sourceIndex * stripHeight;
                const top = destination * stripHeight;

                ctx.save();

                // Calculate scale factors (equivalent to Android's bitwise checks & scales)
                const scaleX = (flip & 1) !== 0 ? -1 : 1;
                const scaleY = (flip & 2) !== 0 ? -1 : 1;

                const centerX = sourceImage.width / 2;
                const centerY = top + stripHeight / 2;

                // Apply transformations around the center of the strip
                ctx.translate(centerX, centerY);
                ctx.scale(scaleX, scaleY);
                ctx.translate(-centerX, -centerY);

                // Draw the sliced portion of the image onto the destination strip
                ctx.drawImage(
                    sourceImage,
                    0, srcY, sourceImage.width, stripHeight, // Source rectangle
                    0, top, sourceImage.width, stripHeight // Destination rectangle
                );

                ctx.restore();
            });
        });
    }
}