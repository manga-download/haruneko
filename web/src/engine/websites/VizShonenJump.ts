import { Tags } from '../Tags';
import icon from './VizShonenJump.webp';
import { type Chapter, DecoratableMangaScraper, type Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Fetch, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import * as Common from './decorators/Common';
import exifr from 'exifr';
import DeScramble from '../transformers/ImageDescrambler';
import { RateLimit } from '../taskpool/RateLimit';

type PagesInfos = {
    pagesCount: number,
    mangaID: string
}

type ExifData = {
    ImageUniqueID: string,
    ImageWidth: number,
    ImageHeight: number
}

const PagesScript = `
    new Promise ( resolve => {
        resolve({
            pagesCount : pages,
            mangaID : mangaCommonId ?? currentMCid
        });
    });
`;

const MangasExtractor = Common.AnchorInfoExtractor(false, '.display-label');

function VolumesExtractor(row: HTMLTableRowElement) {
    const anchor = row.querySelector<HTMLAnchorElement>('a.btn-primary-dark');
    return {
        id: anchor.pathname + anchor.search,
        title: row.querySelector<HTMLTableCellElement>('td.product-table--primary').textContent.replace(', Vol.', 'Vol.').trim()
    };
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: /javascript/.test(anchor.dataset.targetUrl) ? anchor.dataset.targetUrl.match(/['"](\/(shonenjump|vizmanga)[^']+)['"]/)[1] : anchor.dataset.targetUrl,
        title: (anchor.querySelector<HTMLElement>('.disp-id, tr.o_chapter td > div')?.textContent ?? anchor.text).trim()
    };
}

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('vizshonenjump', 'Viz - Shonen Jump', 'https://www.viz.com', Tags.Language.English, Tags.Media.Manga, Tags.Source.Official, Tags.Accessibility.RegionLocked);
        this.imageTaskPool.RateLimit = new RateLimit(4, 1);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        const mangaRegexp = new RegExpSafe(`^${this.URI.origin}/(shonenjump|vizmanga)/chapters/[^/]+$`);
        const libraryRegexp = new RegExpSafe(`^${this.URI.origin}/account/library/(gn|sj)/[^/]+$`);
        return mangaRegexp.test(url) || libraryRegexp.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaRegexp = new RegExpSafe(`^${this.URI.origin}/(shonenjump|vizmanga)/chapters/[^/]+$`);
        return mangaRegexp.test(url) ? await Common.FetchMangaCSS.call(this, provider, url, 'section#series-intro div h2') : await Common.FetchMangaCSS.call(this, provider, url, 'body > div.row h3.type-md');
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return [
            ...await Common.FetchMangasSinglePageCSS.call(this, provider, '/account/library', 'table.purchase-table a', MangasExtractor),
            ...await Common.FetchMangasSinglePageCSS.call(this, provider, '/account/library/sj', 'table.purchase-table a', MangasExtractor),
            ...await Common.FetchMangasSinglePageCSS.call(this, provider, '/read/shonenjump/section/free-chapters', 'div#chpt_grid div.o_sortable a.o_chapters-link', MangasExtractor),
            ...await Common.FetchMangasSinglePageCSS.call(this, provider, '/read/vizmanga/section/free-chapters', 'div.o_sort_container div.o_sortable a.o_chapters-link', MangasExtractor)
        ].distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return /^\/(shonenjump|vizmanga)\/chapters/.test(manga.Identifier)
            ? Common.FetchChaptersSinglePageCSS.call(this, manga, 'div > a.o_chapter-container[data-target-url]:not([href*="javascript"]), tr.o_chapter td.ch-num-list-spacing a.o_chapter-container[data-target-url]:not([href*="javascript"])', ChapterExtractor)
            : Common.FetchChaptersSinglePageCSS.call(this, manga, 'table.product-table tr', VolumesExtractor);
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
        const buffer = await this.imageTaskPool.Add(async () => {
            let response = await Fetch(new Request(page.Link, {
                signal,
                headers: {
                    Referer: page.Parameters.Referer,
                    Origin: this.URI.origin,
                }
            }));

            const img_url = await response.text();
            response = await Fetch(new Request(img_url, {
                signal,
                headers: {
                    Referer: page.Parameters.Referer,
                    Origin: this.URI.origin,
                    crossOrigin: 'Anonymous'
                }
            }));
            return await response.arrayBuffer();

        }, priority, signal);

        const tags: ExifData = await exifr.parse(buffer);
        const EXIFWIDTH = tags.ImageWidth;
        const EXIFHEIGHT = tags.ImageHeight;
        const shuffleMap = tags.ImageUniqueID.split(':');

        return DeScramble(new ImageData(EXIFWIDTH, EXIFHEIGHT), async (_, ctx) => {
            const blob = await Common.GetTypedData(buffer);
            const bitmap = await createImageBitmap(blob);
            const x_split = Math.floor(EXIFWIDTH / 10);
            const y_split = Math.floor(EXIFHEIGHT / 15);

            ctx.clearRect(0, 0, EXIFWIDTH, EXIFHEIGHT);

            //Draw borders
            ctx.drawImage(bitmap, 0, 0, EXIFWIDTH, y_split, 0, 0, EXIFWIDTH, y_split);
            ctx.drawImage(bitmap, 0, y_split + 10, x_split, EXIFHEIGHT - 2 * y_split, 0, y_split, x_split, EXIFHEIGHT - 2 * y_split);
            ctx.drawImage(bitmap, 0, 14 * (y_split + 10), EXIFWIDTH, bitmap.height - 14 * (y_split + 10), 0, 14 * y_split, EXIFWIDTH, bitmap.height - 14 * (y_split + 10));
            ctx.drawImage(bitmap, 9 * (x_split + 10), y_split + 10, x_split + (EXIFWIDTH - 10 * x_split), EXIFHEIGHT - 2 * y_split, 9 * x_split, y_split, x_split + (EXIFWIDTH - 10 * x_split), EXIFHEIGHT - 2 * y_split);

            //Draw pieces
            for (let m = 0; m < shuffleMap.length; m++) {
                const piecevalue = parseInt(shuffleMap[m], 16);
                ctx.drawImage(
                    bitmap,
                    Math.floor((m % 8 + 1) * (x_split + 10)),
                    Math.floor((Math.floor(m / 8) + 1) * (y_split + 10)),
                    Math.floor(x_split),
                    Math.floor(y_split),
                    Math.floor((piecevalue % 8 + 1) * x_split),
                    Math.floor((Math.floor(piecevalue / 8) + 1) * y_split),
                    Math.floor(x_split),
                    Math.floor(y_split)
                );
            }
        });
    }
}
