import { Tags } from '../Tags';
import icon from './FalcoScan.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

type ChapterData = {
    token: string;
    images: PageData[];
};

type PageData = {
    url: string;
    baseDir?: string;
};

type PageInfo = {
    baseDir?: string;
    token: string;
};

type ImageManifest = {
    w: number;
    h: number;
    pw: number;
    ph: number;
    p: {
        c: number;
        r: number;
        t: number;
        id: string;
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
        const { images, token } = await FetchWindowScript<ChapterData>(new Request(new URL(chapter.Identifier, this.URI)), `
            new Promise(resolve => {
                const reader = document.querySelector('div#canvas-reader');
                const token = reader.dataset.token;
                const baseDir = reader.dataset.fragmentBase;
                const elements = [...reader.querySelectorAll('div.cap-canvas')];
                const images = elements.map(image => {
                    if (image.dataset.scrambled === '1') {
                        return {
                            url: new URL(image.dataset.src, window.location.origin).href,
                            baseDir
                        };
                    } else {
                        return { url: new URL(image.dataset.src, window.location.origin).href };
                    }
                });
                resolve({images, token});
            });
        `, 1500);
        return images.map(({ url, baseDir }) => new Page(this, chapter, new URL(url), { baseDir, token }));
    }

    private CreateRequest(url: URL, token: string): Request {
        return new Request(url, {
            headers: {
                'X-Falco-Token': token,
                'X-Requested-With': 'XMLHttpRequest',
                Referer: this.URI.href
            }
        });
    }

    public override async FetchImage(page: Page<PageInfo>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const { baseDir, token } = page.Parameters;
        if (!baseDir) {
            return await this.imageTaskPool.Add(async () => {
                const response = await Fetch(this.CreateRequest(new URL(page.Link), token));
                return Common.GetTypedData(await response.arrayBuffer());
            }, priority, signal);
        }

        const { w, h, ph, pw, p } = await FetchJSON<ImageManifest>(this.CreateRequest(page.Link, token));

        const bitmaps = await Promise.all(p.map(async ({ id }) => {
            return await this.imageTaskPool.Add(async () => {
                const response = await Fetch(this.CreateRequest(new URL(`${baseDir}${id}`, this.URI), token));
                const data = await response.arrayBuffer();
                return createImageBitmap(await Common.GetTypedData(data));
            }, priority, signal);
        }));

        return DeScramble(new ImageData(w, h), async (_, ctx) => {

            for (let pieceIndex = 0; pieceIndex < p.length; pieceIndex++) {
                ctx.save();
                const { c, r, t } = p[pieceIndex];

                const pieceWidth = Math.min(pw, w - c * pw);
                const pieceHeight = Math.min(ph, h - r * ph);

                const dx = c * pieceWidth;
                const dy = r * pieceHeight;

                const sx = t & 1 ? -1 : 1;
                const sy = t & 2 ? -1 : 1;

                //invert piece color BEFORE drawing if needed
                if (t & 4) {
                    ctx.filter = 'invert(1)';
                }

                //transformations if needed
                if (sx < 0 || sy < 0) {
                    ctx.translate(dx + (sx < 0 ? pieceWidth : 0), dy + (sy < 0 ? pieceHeight : 0));
                    ctx.scale(sx, sy);
                    ctx.drawImage(bitmaps[pieceIndex], 0, 0, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
                } else {
                    ctx.drawImage(bitmaps[pieceIndex], 0, 0, pieceWidth, pieceHeight, dx, dy, pieceWidth, pieceHeight);
                }

                ctx.restore();
                bitmaps[pieceIndex].close();
            }
        });
    }
}