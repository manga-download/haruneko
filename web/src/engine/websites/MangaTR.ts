import { Tags } from '../Tags';
import icon from './MangaTR.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, type Chapter, Page } from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';
import type { Priority } from '../taskpool/DeferredTask';
import { GetBytesFromBase64 } from '../BufferEncoder';
import DeScramble from '../transformers/ImageDescrambler';

type PagesData = {
    img?: string;
    order?: string;
    parts?: string;
};

AddAntiScrapingDetection(async (invoke) => {
    const result = await invoke<boolean>(`document.title === 'Bot Koruması' && document.querySelector('canvas#sliderCanvas') != undefined`);
    return result ? FetchRedirection.Interactive : undefined;
});

@Common.MangaCSS<HTMLImageElement>(FlatManga.pathManga, 'img.thumbnail', (img, uri) => ({ id: uri.pathname, title: img.title.trim() }))
@Common.MangasSinglePageCSS('/manga-list.html', 'div.container a[data-toggle="mangapop"]:not([data-original-title=""])')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatr', 'Manga-TR', 'https://manga-tr.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('read_type', '1')`);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return FlatManga.FetchChaptersAJAX.call(this, manga, '/cek/fetch_pages_manga.php?manga_cek={manga}', 'div.chapter-item div.chapter-title > a');
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pageScript = `
            new Promise(resolve => {

                const directImages = [...document.querySelectorAll("img[src*='img_part.php'], img[data-src*='img_part.php']")];
                if (directImages.length) {
                    resolve( directImages.map(image => ({ img: img.dataset.src ?? img.src })) );
                    return;
                }

                const chapterPages = [...document.querySelectorAll("div.chapter-page")];
                resolve(
                    chapterPages.map(imageContainer => ({
                        parts: imageContainer.dataset.parts,
                        order: imageContainer.dataset.order,
                    }))
                );
            });

        `;

        const elements = await FetchWindowScript<PagesData[]>(new Request(new URL(chapter.Identifier, this.URI)), pageScript, 1500);
        return elements.map(({ img, order, parts }) => new Page<PagesData>(this, chapter, new URL(img ?? this.URI), { parts, order }));
    }

    public override async FetchImage(page: Page<PagesData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const { order, parts } = page.Parameters;
        if (!parts) return Common.FetchImageAjax.call(this, page, priority, signal);
        return this.imageTaskPool.Add(async () => {
            const partsUrls: string[] = JSON.parse(parts);
            const indexOrder = this.DecryptOrder(order);
            const orderedParts = Object.keys(indexOrder)
                .sort((a, b) => indexOrder[a] - indexOrder[b]) // Sort by the new index order
                .map(key => partsUrls[key]); // Reorder based on the sorted keys

            const images = await Promise.all(orderedParts.map(piece => this.LoadImage(piece)));
            const maxWidth = Math.max(...images.map(img => img.width));
            const totalHeight = images.reduce((sum, img) => sum + img.height, 0);

            return DeScramble(new ImageData(maxWidth, totalHeight), async (_, ctx) => {
                let currentY = 0;
                for (const part of images) {
                    ctx.drawImage(part, 0, currentY);
                    currentY += part.height;
                }
            });

        }, priority, signal);
    }

    private DecryptOrder(order: string) : number[] {
        const raw = GetBytesFromBase64(order).map(byte => (byte ^ 0x5A) & 0xFF);
        return JSON.parse(new TextDecoder().decode(raw));
    }

    private async LoadImage(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
}