import { Tags } from '../Tags';
import icon from './VizShonenJump.webp';
import { type Chapter, DecoratableMangaScraper, type Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Fetch, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import * as Common from './decorators/Common';
import exifr from 'exifr';
import DeScramble from '../transformers/ImageDescrambler';
import { RateLimit } from '../taskpool/RateLimit';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type PagesInfos = {
    pagesCount: number;
    mangaID: string;
};

type APIPages = {
    data: Record<number, string> | string;
};

type ExifData = {
    ImageUniqueID: string;
    ImageWidth: number;
    ImageHeight: number;
};

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
        id: anchor.dataset.targetUrl.match(/(['"])(\/(shonenjump|vizmanga)[^'"]+)\1/)?.at(2) ?? anchor.dataset.targetUrl,
        title: (anchor.querySelector<HTMLElement>('.disp-id, tr.o_chapter td > div')?.textContent ?? anchor.text).trim()
    };
}

export default class extends DecoratableMangaScraper {

    private readonly patterns = new Map<RegExp, string>([
        [new RegExp(`^${this.URI.origin}/(shonenjump|vizmanga)/chapters/[^/]+$`), 'section#series-intro div h2'],
        [new RegExp(`^${this.URI.origin}/account/library/(gn|sj)/[^/]+$`), 'body > div.row h3.type-md'],
    ]);

    public constructor() {
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
            ...await Common.FetchMangasSinglePageCSS.call(this, provider, '/read/shonenjump/section/free-chapters', 'div#chpt_grid div.o_sortable a.o_chapters-link', MangasExtractor),
            ...await Common.FetchMangasSinglePageCSS.call(this, provider, '/read/vizmanga/section/free-chapters', 'div.o_sort_container div.o_sortable a.o_chapters-link', MangasExtractor),
            ...await Common.FetchMangasMultiPageCSS.call(this, provider, 'table.purchase-table a', Common.StaticLinkGenerator('/account/library', '/account/library/sj'), 0, MangasExtractor),
        ].distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: 'base'
        });

        return (/^\/(shonenjump|vizmanga)\/chapters/.test(manga.Identifier)
            ? await Common.FetchChaptersSinglePageCSS.call(this, manga, 'div > a.o_chapter-container[data-target-url], tr.o_chapter td.ch-num-list-spacing a.o_chapter-container[data-target-url]', undefined, ChapterExtractor)
            : await Common.FetchChaptersSinglePageCSS.call(this, manga, 'table.product-table tr', undefined, VolumeExtractor))
            //website default sorting is unreliable. Sometimes its asc, sometimes its desc
            .sort((self, other) => collator.compare(other.Title, self.Title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterurl = new URL(chapter.Identifier, this.URI);
        const { pagesCount, mangaID } = await FetchWindowScript<PagesInfos>(new Request(chapterurl), `
            new Promise(resolve => {
                resolve({
                    pagesCount: pages,
                    mangaID: mangaCommonId ?? currentMCid
                });
            });
        `, 1500);

        const indices = Array.from({ length: pagesCount + 1 }, (_, index) => index);
        const { data } = await FetchJSON<APIPages>(new Request(new URL(`./manga/get_manga_url?device_id=3&manga_id=${mangaID}&pages=${indices.join(',')}`, this.URI), {
            headers: {
                Referer: chapterurl.href,
                'X-Requested-With': 'XMLHttpRequest'
            }
        }));

        if (typeof data === 'string') throw new Exception(R.Plugin_Common_Chapter_UnavailableError);

        const pages = Object.values(data).map(page => new Page(this, chapter, new URL(page)));
        // last page may be a dummy (unavailable) page. In that case strip it from page array.
        const response = await fetch(new Request(pages.at(-1).Link, { method: 'HEAD', headers: { Referer: this.URI.href, Origin: this.URI.origin } }));
        return response.status != 403 ? pages : pages.slice(0, -1);
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(page.Link, {
                signal,
                headers: {
                    Referer: this.URI.href,
                    Origin: this.URI.origin
                }
            }));
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
                        Math.floor((shuffleMap[index] % 8 + 1) * blockWidth),
                        Math.floor((Math.floor(shuffleMap[index] / 8) + 1) * blockHeight),
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