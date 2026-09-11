import { Tags } from '../Tags';
import icon from './VizShonenJump.webp';
import { type Chapter, DecoratableMangaScraper, type Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Fetch, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import * as Common from './decorators/Common';
import exifr from 'exifr';
import DeScramble from '../transformers/ImageDescrambler';
import { RateLimit } from '../taskpool/RateLimit';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

// TODO: Check for possible revision

type PagesInfos = {
    pagesCount: number,
    mangaID: string;
    pageURLs: string[];
    error?: string;
};

type ExifData = {
    ImageUniqueID: string,
    ImageWidth: number,
    ImageHeight: number;
};

const PagesScript = `
    (async () => {
        const mangaID = mangaCommonId ?? currentMCid;
        const authURL = new URL('/manga/auth', location.origin);
        authURL.searchParams.set('device_id', '3');
        authURL.searchParams.set('manga_id', mangaID);
        const auth = await fetch(authURL, { credentials: 'include' }).then(response => response.json());
        if (auth.ok !== 1 || auth.archive_info?.ok === 0) {
            return {
                pagesCount: pages,
                mangaID,
                pageURLs: [],
                error: auth.archive_info?.err?.msg ?? JSON.stringify(auth),
            };
        }

        // VIZ now accepts a comma-separated pages parameter and responds with
        // JSON. The former singular page endpoint returns no_auth.
        const indices = Array.from({ length: pages + 1 }, (_, index) => index);
        const pagesURL = new URL('/manga/get_manga_url', location.origin);
        pagesURL.searchParams.set('device_id', '3');
        pagesURL.searchParams.set('manga_id', mangaID);
        pagesURL.searchParams.set('pages', indices.join(','));
        const result = await fetch(pagesURL, { credentials: 'include' }).then(response => response.json());
        if (!result.data || typeof result.data !== 'object') {
            return {
                pagesCount: pages,
                mangaID,
                pageURLs: [],
                error: typeof result.data === 'string' ? result.data : JSON.stringify(result),
            };
        }

        return {
            pagesCount: pages,
            mangaID,
            pageURLs: indices.map(index => result.data[index]).filter(url => typeof url === 'string' && url.startsWith('http')),
        };
    })();
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
        return /^\/(shonenjump|vizmanga)\/chapters/.test(manga.Identifier)
            ? Common.FetchChaptersSinglePageCSS.call(this, manga, 'div > a.o_chapter-container[data-target-url], tr.o_chapter td.ch-num-list-spacing a.o_chapter-container[data-target-url]', undefined, ChapterExtractor)
            : Common.FetchChaptersSinglePageCSS.call(this, manga, 'table.product-table tr', undefined, VolumeExtractor);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterurl = new URL(chapter.Identifier, this.URI);
        const { pageURLs, error } = await FetchWindowScript<PagesInfos>(new Request(chapterurl), PagesScript, 1500);
        if (error || pageURLs.length === 0) {
            const reason = error?.trim().replace(/\s+/g, ' ').slice(0, 300) || '(no image URLs returned)';
            throw new Error(`${new Exception(R.Plugin_Common_Chapter_UnavailableError).message} Viz response: ${reason}`);
        }
        return pageURLs.map(url => new Page(this, chapter, new URL(url), { Referer: chapterurl.href }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await this.imageTaskPool.Add(async () => {
            const init = {
                signal,
                headers: {
                    Referer: page.Parameters.Referer,
                }
            };
            const response = await Fetch(new Request(page.Link, init));
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
