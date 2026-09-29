import { Tags } from '../Tags';
import icon from './FalcoScan.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

type PageData = {
    url: string;
    baseDir?: string;
};

type PageInfo = {
    baseDir?: string;
};

type ImageManifest = {
    width: number;
    height: number;
    pieceWidth: number;
    pieceHeight: number;
    pieces: {
        file: string;
        row: number;
        col: number;
    }[];
};

@Common.MangaCSS(/^{origin}\/comics\/[^/]+$/, 'div.series-main h1')
@Common.MangasSinglePageCSS<HTMLAnchorElement>('/comics', 'div.list-grid a.falco-card', anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('div.info h4').textContent.trim()
}))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('a.chapter-card', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('div.ch-name').textContent.trim()
}))
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tenkai', 'Falco Scan', 'https://falcoscan.net', Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageInfo>[]> {
        const pages = await FetchWindowScript<PageData[]>(new Request(new URL(chapter.Identifier, this.URI)), `
            new Promise(resolve => {
                const elements = [...document.querySelectorAll('div#canvas-reader div.cap-canvas')];
                const images = elements.map(image => {
                    if (image.dataset.scrambled === '1') {
                        return {
                            url: new URL(atob(image.dataset.manifestSrc.match(/\\/img-manifest\\/([^/]+)/).at(-1)), window.location.origin).href,
                            baseDir : 'projects/' + image.getAttribute('data-fragment-dir')
                        };
                    } else {
                        return { url: new URL(atob(image.dataset.src.match(/\\/img-serve\\/([^/]+)/).at(-1)), window.location.origin).href };
                    }
                });
                resolve(images);
            });
        `, 1500);
        return pages.map(({ url, baseDir }) => new Page(this, chapter, new URL(url), { baseDir }));
    }

    public override async FetchImage(page: Page<PageInfo>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        if (!page.Parameters.baseDir) return Common.FetchImageAjax.call(this, page, priority, signal);

        const { width, height, pieceHeight, pieceWidth, pieces } = await FetchJSON<ImageManifest>(new Request(new URL(page.Link)));

        const bitmaps = await Promise.all(pieces.map(async ({ file }) => {
            return await this.imageTaskPool.Add(async () => {
                const response = await Fetch(new Request(new URL(`${page.Parameters.baseDir}${file}`, this.URI)));
                const data = await response.arrayBuffer();
                return createImageBitmap(await Common.GetTypedData(data));
            }, priority, signal);
        }));

        return DeScramble(new ImageData(width, height), async (_, ctx) => {
            for (let pieceIndex = 0; pieceIndex < pieces.length; pieceIndex++) {
                const { col, row } = pieces[pieceIndex];
                ctx.drawImage(bitmaps[pieceIndex], col * pieceWidth, row * pieceHeight);
                bitmaps[pieceIndex].close();
            }
        });
    }
}