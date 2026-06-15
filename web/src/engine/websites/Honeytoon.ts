import { Tags } from '../Tags';
import icon from './Honeytoon.webp';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';
import type { Priority } from '../taskpool/DeferredTask';

function ExtractMangaTitle(element: HTMLElement, title: string = null) {
    return `${(title ?? element.innerText).trim()} (${element.closest<HTMLElement>('[data-locale]').dataset.locale})`;
}

@Common.MangaCSS(/^{origin}(\/[a-z]{2})?\/comic\/[^/]+$/, 'h1.comic-book__title', (heading, uri) => ({ id: uri.pathname, title: ExtractMangaTitle(heading) }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('honeytoon', 'Honeytoon', 'https://honeytoon.com', Tags.Media.Manhwa, Tags.Language.Multilingual, Tags.Source.Official, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('eighteen', '1')`);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        type MangaInfo = { id: string; title: string; type: string; platform: string; slug: string; };
        const locales = [
            { path: '/genres' },
            { path: '/genres', adult: true },
            { path: '/manga-genres', adult: true },
            { path: '/fr/genres' },
            { path: '/fr/genres', adult: true },
            { path: '/fr/manga-genres', adult: true },
            { path: '/de/genres' },
            { path: '/de/genres', adult: true },
            { path: '/de/manga-genres', adult: true },
            { path: '/es/genres' },
            { path: '/es/genres', adult: true },
            { path: '/es/manga-genres', adult: true },
            { path: '/it/genres' },
            { path: '/it/genres', adult: true },
            { path: '/it/manga-genres', adult: true },
            { path: '/pt/genres' },
            { path: '/pt/genres', adult: true },
            { path: '/pt/manga-genres', adult: true },
        ];
        return Array.fromAsync(async function* (this: This) {
            for (const { path, adult } of locales) {
                const request = new Request(new URL(path, this.URI), { headers: { 'Cookie': `eighteen=${adult ? 1 : 0}` } });
                const anchors = await FetchCSS<HTMLAnchorElement>(request, 'a.preview-card__link[data-c-event]');
                const mangas = anchors.map(anchor => {
                    try {
                        const { title, platform } = <MangaInfo>JSON.parse(anchor.dataset.cEvent.split('|').at(-1));
                        return new Manga(this, provider, anchor.pathname, `${title} (${platform})`);
                    } catch {
                        // HACK: Fallback for 'data-c-event' with un-escaped double quotes
                        const title = anchor.querySelector<HTMLImageElement>('img.preview-card__image').alt.replace(/-\s*cover$/i, '');
                        return new Manga(this, provider, anchor.pathname, ExtractMangaTitle(anchor, title));
                    }
                });
                yield* mangas;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const elements = await FetchCSS<HTMLAnchorElement>(new Request(new URL(manga.Identifier, this.URI)), 'a.comic-list__item[href*="/comic/"]');
        return elements.map(anchor => new Chapter(this, manga, anchor.pathname, anchor.querySelector<HTMLElement>('.comic-list__title-desc').innerText.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()));
    }

    public async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await FetchCSS<HTMLImageElement | HTMLCanvasElement>(new Request(new URL(chapter.Identifier, this.URI)), 'div.single__item img, div.single__item canvas');
        return pages.map(page => {
            return new Page(this, chapter, page instanceof HTMLCanvasElement ? new URL(`/api/common/resource/sync?t=${encodeURIComponent(page.dataset.token)}`, this.URI) : new URL(page.dataset.src ?? page.src));
        });
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        if (page.Link.pathname.startsWith('/api/common/resource/sync')) {
            const { buffer, subBufferSizes } = await this.imageTaskPool.Add(async () => {
                const response = await Fetch(new Request(page.Link));
                return {
                    buffer: await response.arrayBuffer(),
                    subBufferSizes: response.headers.get('X-Part-Sizes').split(',').map(parseInt),
                };
            }, priority, signal);

            const bitmaps = await Promise.all(subBufferSizes.map((size, index) => {
                const offset = subBufferSizes.slice(0, index).reduce((sum, size) => sum + size, 0);
                const bytes = new Uint8Array(buffer).subarray(offset, offset + size);
                return createImageBitmap(new Blob([bytes], { type: 'image/webp' }));
            }));

            const pageWidth = bitmaps.reduce((max, { width }) => Math.max(max, width), 0);
            const pageHeight = bitmaps.reduce((sum, { height }) => sum + height, 0);

            return DeScramble(new ImageData(pageWidth, pageHeight), async (_, ctx) => bitmaps.forEach((bitmap, index) => {
                const offsetY = bitmaps.slice(0, index).reduce((sum, { height }) => sum + height, 0);
                ctx.drawImage(bitmap, 0, offsetY);
                bitmap.close();
            }));
        } else {
            return Common.FetchImageAjax.call(this, page, priority, signal);
        }
    }
}