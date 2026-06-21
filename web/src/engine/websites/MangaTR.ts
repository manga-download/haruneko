import { Tags } from '../Tags';
import icon from './MangaTR.webp';
import { FetchHTML, FetchJSON, FetchRegex, FetchWindowPreloadScript, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import { RandomText } from '../Random';

type PagesData = {
    order: {
        m: number;
        n: number;
        p: number;
        slot: number;
        target: number;
    }[];
    parts: string[];
};

type PageOrder = {
    bySlot: Record<string, number>;
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
        const [initialKey] = await FetchRegex(new Request(new URL(manga.Identifier, this.URI)), /const\s+initialChapterListKey\s*=\s*['"`]([A-Za-z0-9_=-]+\.[A-Za-z0-9_=-]+)['"`]/g);
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

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const eventName = RandomText(Math.random() * 8 + 8);
        const preload = `
            JSON.parse = new Proxy(JSON.parse, {
              apply(target, thisArg, argumentsList) {
                const result = Reflect.apply(target, thisArg, argumentsList);
                if (result.cls && result.data && result.key)
	                setInterval(() => window.dispatchEvent(new CustomEvent('${eventName}', { detail: result })), 250);
                return result;
              }
            });
        `;

        const pageScript = `
            new Promise(resolve => {

                const hmacLikeKey = (purpose, saltKey) => purpose + '|' + saltKey + '|reader';
                const b64ToBin = (raw) => {
                    raw = String(raw || '').replace(/-/g, '+').replace(/_/g, '/');
                    while (raw.length % 4) {
                        raw += '=';
                    }
                    return atob(raw);
                };

                const xorUnpack = (raw, key) => {
                    const bin = b64ToBin(raw);
                    let out = '';
                    const kLen = key.length;
                    for (let i = 0; i < bin.length; i++) {
                        out += String.fromCharCode(bin.charCodeAt(i) ^ key.charCodeAt(i % kLen));
                    }
                    return out;
                };

                const getAttr = (data, el, name) => { return el.getAttribute(data[name]) || ''};

                function decodePacked(raw, purpose, key) {
                    return JSON.parse(xorUnpack(raw, hmacLikeKey(purpose, key)));
                };

                window.addEventListener('${eventName}', event => {
                    const {cls, data, key} = event.detail;
                    const pages = [...document.querySelectorAll('.' + cls.page + '.' + cls.lazy + ':not(.' + cls.decoy + ')')];
                    resolve (pages.map(el=> {
                        const parts = decodePacked(getAttr(data, el, 'parts'), 'attr', key);
                        const order = decodePacked(getAttr(data, el, 'order'), 'order', key);
                        return ({ order, parts});
                    }));
                } , { once: true });
            });
        `;

        const elements = await FetchWindowPreloadScript<PagesData[]>(new Request(new URL(chapter.Identifier, this.URI)), preload, pageScript, 0);
        return elements.map(({ order, parts }) => new Page<PagesData>(this, chapter, new URL(this.URI), { parts, order }));
    }

    public override async FetchImage(page: Page<PagesData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const { order, parts } = page.Parameters;
        return this.imageTaskPool.Add(async () => {
            const indexOrder = this.ComputeOrder(parts.length, order).bySlot;
            const orderedParts: string[] = Object.keys(indexOrder)
                .sort((a, b) => indexOrder[a] - indexOrder[b]) // Sort by the new index order
                .map(key => parts[key]); // Reorder based on the sorted keys
            ;
            const images = await this.LoadImages(orderedParts);
            const maxWidth = Math.max(...images.map(img => img.width));
            const totalHeight = images.reduce((sum, img) => sum + img.height, 0);

            return DeScramble(new ImageData(maxWidth, totalHeight), async (_, ctx) => {
                let currentY = 0;
                for (const part of images) {
                    ctx.drawImage(part, 0, currentY);
                    currentY += part.height;
                    URL.revokeObjectURL(part.src);
                }
            });

        }, priority, signal);
    }

    private ComputeOrder(limit: number, order: PagesData['order']): PageOrder {
        if (!Array.isArray(order)) {
            // Handle legacy object format if needed
            // order = Object.entries(order).map(([k, v]) => ({
            //     slot: parseInt(k, 10),
            //     target: v,
            //     p: 900,
            //     m: 0,
            //     n: 0
            // }));
        }

        const selected: Record<number, number> = {};
        const selectedScore: Record<number, number> = {};
        let maxTarget = -1;

        order.forEach(entry => {
            if (!entry || typeof entry !== 'object') return;

            const slot = Number(entry.slot);
            const target = Number(entry.target);
            const p = Number(entry.p || 0);
            const m = Number(entry.m || 0);

            if (!Number.isFinite(slot) || !Number.isFinite(target) || slot < 0 || target < 0) return;
            if (slot >= limit) return;

            const score = (p ^ m) & 1023;

            if (selectedScore[target] === undefined || score > selectedScore[target]) {
                selectedScore[target] = score;
                selected[target] = slot;
            }

            if (target > maxTarget) maxTarget = target;
        });

        const bySlot: Record<string, number> = {};
        const targetCount = maxTarget + 1;

        for (let t = 0; t < targetCount; t++) {
            if (selected[t] === undefined) return null;
            bySlot[String(selected[t])] = t;
        }

        return { bySlot };
    }

    private async LoadImages(sources: string[]): Promise<HTMLImageElement[]> {

        const loadImage = async (src: string): Promise<HTMLImageElement> => {
            const response = await fetch(new Request(src, {
                headers: { Referer: this.URI.href, Origin: this.URI.origin }
            }));

            const blob = await response.blob();
            const objectURL = URL.createObjectURL(blob);

            const img = new Image();
            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = (err) => reject(err);
                img.src = objectURL;
            });

            return img;
        };

        // Load all images in parallel, preserving order
        const images: HTMLImageElement[] = await Promise.all(sources.map(src => loadImage(src)));
        return images;
    }

    private async RenewToken(currentToken: string = undefined): Promise<string> {
        return (await FetchJSON<{ token: string }>(new Request(new URL('/yorum/get_antispam_token.php', this.URI), {
            method: 'POST',
            headers: {
                Origin: this.URI.origin,
                Referer: this.URI.href,
                'Sec-Fetch-Site': 'same-origin'
            }

        }))).token;

    }
    //https://manga-tr.com/yorum/get_antispam_token.php
}