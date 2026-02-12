import { Tags } from '../Tags';
import icon from './Honeytoon.webp';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';
import type { Priority } from '../taskpool/DeferredTask';

type PageData = {
    scrambled: boolean;
};

@Common.MangaCSS(/^{origin}\/([^/]+\/)?comic\/[^/]+$/, 'h1.comic-book__title')
@Common.MangasSinglePageCSS('/genres', 'a.preview-card__link', anchor => ({ id: (anchor as HTMLAnchorElement).pathname, title: anchor.querySelector('.preview-card__title').textContent.trim() }))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('a.comic-list__item[href*="/comic/"]', undefined, anchor => ({ id: anchor.pathname, title: anchor.querySelector('.comic-list__title-desc').textContent.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('honeytoon', 'Honeytoon', 'https://honeytoon.com', Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('eighteen', '1')`);
    }

    public async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const pages = await FetchCSS<HTMLImageElement | HTMLCanvasElement>(new Request(new URL(chapter.Identifier, this.URI)), 'div.single__item img, div.single__item canvas');
        return pages.map(page => {
            const scrambled = page instanceof HTMLCanvasElement;
            return new Page<PageData>(this, chapter, scrambled ? new URL(`./api/common/resource/sync?t=${encodeURIComponent(page.dataset.token)}`, this.URI) : new URL(page.dataset.src ?? page.src), { scrambled });
        });
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        if (!page.Parameters.scrambled) return Common.FetchImageAjax.call(this, page, priority, signal);
        return this.imageTaskPool.Add(async () => {

            const response = await Fetch(new Request(page.Link));
            const scrambleData = response.headers.get('X-Part-Sizes').split(',').map(value => parseInt(value, 10));
            const buffer = await response.arrayBuffer();

            const blobs: Blob[] = [];
            for (let position = 0, index = 0; index < 3; index++) {
                const part = buffer.slice(position, position + scrambleData[index]);
                blobs.push(new Blob([part], { type: 'image/webp' }));
                position += scrambleData[index];
            }

            const bitmaps: ImageBitmap[] = await Promise.all(
                blobs.map(blob => createImageBitmap(blob))
            );

            const totalHeight = bitmaps.reduce((sum, b) => sum + b.height, 0);

            return DeScramble(new ImageData(bitmaps[0].width, totalHeight), async (_, ctx) => {
                let currentY = 0;
                for (const bitmap of bitmaps) {
                    ctx.drawImage(bitmap, 0, currentY);
                    currentY += bitmap.height;
                    bitmap.close();
                }
            });
        }, priority, signal);
    }

}