import { Tags } from '../Tags';
import icon from './VizShonenJump.webp';
import { type Chapter, DecoratableMangaScraper, type Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Fetch, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import * as Common from './decorators/Common';
import exifr from 'exifr';
import DeScramble from '../transformers/ImageDescrambler';
import { RateLimit } from '../taskpool/RateLimit';

// TODO: Check for possible revision

type PagesInfos = {
    pagesCount: number,
    mangaID: string;
};

type ExifData = {
    ImageUniqueID: string,
    ImageWidth: number,
    ImageHeight: number;
};

const PagesScript = `
    new Promise(resolve => {
        resolve({
            pagesCount: pages,
            mangaID: mangaCommonId ?? currentMCid
        });
    });
`;

const MangasExtractor = Common.AnchorInfoExtractor(false, '.display-label');

function VolumeExtractor(row: HTMLTableRowElement) {
    const anchor = row.querySelector<HTMLAnchorElement>('a.btn-primary-dark');
    return {
        id: anchor.pathname + anchor.search,
        title: row.querySelector<HTMLTableCellElement>('td.product-table--primary').textContent.replace(', Vol.', 'Vol.').trim()
    };
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: /javascript/.test(anchor.dataset.targetUrl) ? anchor.dataset.targetUrl.match(/['"](\/(shonenjump|vizmanga)[^']+)['"]/).at(1) : anchor.dataset.targetUrl,
        title: (anchor.querySelector<HTMLElement>('.disp-id, tr.o_chapter td > div')?.textContent ?? anchor.text).trim()
    };
}

export default class extends DecoratableMangaScraper {

    private readonly patterns = new Map<RegExp, string>([
        [ new RegExp(`^${this.URI.origin}/(shonenjump|vizmanga)/chapters/[^/]+$`), 'section#series-intro div h2' ],
        [ new RegExp(`^${this.URI.origin}/account/library/(gn|sj)/[^/]+$`), 'body > div.row h3.type-md' ],
    ]);

    public constructor () {
        super('vizshonenjump', 'Viz - Shonen Jump', 'https://www.viz.com', Tags.Language.English, Tags.Media.Manga, Tags.Source.Official, Tags.Accessibility.RegionLocked);
        this.imageTaskPool.RateLimit = new RateLimit(4, 1);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return this.patterns.keys().some(pattern => pattern.test(url));
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const pattern = this.patterns.keys().find(pattern => pattern.test(url));
        return Common.FetchMangaCSS.call(this, provider, url, this.patterns.get(pattern));
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return [
            ...await Common.FetchMangasSinglePagesCSS.call(this, provider, [ '/account/library', '/account/library/sj' ], 'table.purchase-table a', MangasExtractor),
            ...await Common.FetchMangasSinglePagesCSS.call(this, provider, [ '/read/shonenjump/section/free-chapters' ], 'div#chpt_grid div.o_sortable a.o_chapters-link', MangasExtractor),
            ...await Common.FetchMangasSinglePagesCSS.call(this, provider, [ '/read/vizmanga/section/free-chapters' ], 'div.o_sort_container div.o_sortable a.o_chapters-link', MangasExtractor)
        ].distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return /^\/(shonenjump|vizmanga)\/chapters/.test(manga.Identifier)
            ? Common.FetchChaptersSinglePageCSS.call(this, manga, 'div > a.o_chapter-container[data-target-url]:not([href*="javascript"]), tr.o_chapter td.ch-num-list-spacing a.o_chapter-container[data-target-url]:not([href*="javascript"])', ChapterExtractor)
            : Common.FetchChaptersSinglePageCSS.call(this, manga, 'table.product-table tr', VolumeExtractor);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterurl = new URL(chapter.Identifier, this.URI);
        const { pagesCount, mangaID } = await FetchWindowScript<PagesInfos>(new Request(chapterurl), PagesScript, 1500);
        return Array(pagesCount + 1).fill(0).map((_, index) => {
            const url = new URL('/manga/get_manga_url', this.URI);
            url.searchParams.set('device_id', '3');
            url.searchParams.set('manga_id', mangaID);
            url.searchParams.set('page', index.toString());
            return new Page(this, chapter, url, { Referer: chapterurl.href });
        });
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await this.imageTaskPool.Add(async () => {
            const init = {
                signal,
                headers: {
                    Referer: page.Parameters.Referer,
                }
            };
            const url = await (await Fetch(new Request(page.Link, init))).text();
            const response = await Fetch(new Request(url, init));
            return response.blob();

        }, priority, signal);

        const tags: ExifData = await exifr.parse(blob);
        const canvasWidth = tags.ImageWidth;
        const canvasHeight = tags.ImageHeight;
        const shuffleMap = tags.ImageUniqueID.split(':').map(value => parseInt(value, 16));

        const bitmap = await createImageBitmap(blob);
        try {
            return await DeScramble(new ImageData(canvasWidth, canvasHeight), async (_, ctx) => {
                const blockWidth = Math.floor(canvasWidth / 10);
                const blockHeight = Math.floor(canvasHeight / 15);

                console.log(`${canvasWidth}x${canvasHeight}`, '=>', `${bitmap.width}x${bitmap.height}`);
                ctx.drawImage(bitmap, 0, 0, canvasWidth, blockHeight, 0, 0, canvasWidth, blockHeight);
                ctx.drawImage(bitmap, 0, blockHeight + 10, blockWidth, canvasHeight - 2 * blockHeight, 0, blockHeight, blockWidth, canvasHeight - 2 * blockHeight);
                ctx.drawImage(bitmap, 0, 14 * (blockHeight + 10), canvasWidth, bitmap.height - 14 * (blockHeight + 10), 0, 14 * blockHeight, canvasWidth, bitmap.height - 14 * (blockHeight + 10));
                ctx.drawImage(bitmap, 9 * (blockWidth + 10), blockHeight + 10, blockWidth + (canvasWidth - 10 * blockWidth), canvasHeight - 2 * blockHeight, 9 * blockWidth, blockHeight, blockWidth + (canvasWidth - 10 * blockWidth), canvasHeight - 2 * blockHeight);

                for (let index = 0; index < shuffleMap.length; index++) {
                    ctx.drawImage(
                        bitmap,
                        Math.floor((index % 8 + 1) * (blockWidth + 10)),
                        Math.floor((Math.floor(index / 8) + 1) * (blockHeight + 10)),
                        blockWidth,
                        blockHeight,
                        Math.floor((shuffleMap[ index ] % 8 + 1) * blockWidth),
                        Math.floor((Math.floor(shuffleMap[ index ] / 8) + 1) * blockHeight),
                        blockWidth,
                        blockHeight
                    );
                }
            });
        } finally {
            bitmap.close();
        }
    }
}