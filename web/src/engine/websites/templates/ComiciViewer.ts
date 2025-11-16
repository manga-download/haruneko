import { FetchCSS, FetchJSON } from '../../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, type Chapter, Page } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/DeferredTask';
import DeScramble from '../../transformers/ImageDescrambler';
import * as Common from '../decorators/Common';

type APIPages = {
    totalPages: number;
    result: {
        imageUrl: string;
        scramble?: string;
    }[];
};

type ScrambleData = {
    scramble: string;
};

function StripTrailingSlash(pathname: string): string {
    return pathname.replace(/\/$/, '');
}

function MangaInfoExtractor(div: HTMLDivElement) {
    return {
        id: StripTrailingSlash(div.querySelector('a').pathname),
        title: div.querySelector<HTMLHeadingElement>('h2.title-text').innerText.trim(),
    };
}

function ChapterInfoExtractor(element: HTMLElement) {
    return {
        id: new URL(element.dataset.href).pathname,
        title: element.querySelector<HTMLSpanElement>('span.series-ep-list-item-h-text').innerText.trim()/*.replace(manga.Title, '').trim() || manga.Title*/,
    };
}

function ChapterLinkResolver(manga: Manga): URL {
    return new URL(`${manga.Identifier}/list`, this.URI);
}

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/?$/, 'h1.series-h-title span:not([class])', (span, uri) => ({ id: StripTrailingSlash(uri.pathname), title: span.innerText.trim() }))
@Common.MangasMultiPageCSS('div.series-box-vertical', Common.PatternLinkGenerator('/series/list?page={page}', 0), 0, MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('div.series-ep-list a[data-href]', ChapterLinkResolver, ChapterInfoExtractor)
export class ComiciViewer extends DecoratableMangaScraper {

    private readonly identityTileMap = new Array(16).fill(null).map((_, index) => ({ col: index / 4 >> 0, row: index % 4 >> 0 }));

    public override async FetchPages(chapter: Chapter): Promise<Page<ScrambleData>[]> {
        const [viewer] = await FetchCSS(new Request(new URL(chapter.Identifier, this.URI)), '#comici-viewer');
        const { totalPages } = await this.FetchContentInfo(chapter, viewer.getAttribute('comici-viewer-id'), viewer.dataset.memberJwt, 1);
        const { result } = await this.FetchContentInfo(chapter, viewer.getAttribute('comici-viewer-id'), viewer.dataset.memberJwt, totalPages);
        return result.map(image => new Page<ScrambleData>(this, chapter, new URL(image.imageUrl), { scramble: image.scramble, Referer: this.URI.href }));
    }

    public override async FetchImage(page: Page<ScrambleData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal);
        return !page.Parameters?.scramble ? data : DeScramble(data, async (image, ctx) => {
            const scrambleTileMap = page.Parameters.scramble.replace(/\s+/g, '').slice(1).slice(0, -1).split(',').map(index => this.identityTileMap[index]);
            const tileWidth = Math.floor(image.width / 4);
            const tileHeight = Math.floor(image.height / 4);
            for (let index = 0; index < this.identityTileMap.length; index++) {
                const sourceOffsetX = scrambleTileMap[index].col * tileWidth;
                const sourceOffsetY = scrambleTileMap[index].row * tileHeight;
                const targetOffsetX = this.identityTileMap[index].col * tileWidth;
                const targetOffsetY = this.identityTileMap[index].row * tileHeight;
                ctx.drawImage(image, sourceOffsetX, sourceOffsetY, tileWidth, tileHeight, targetOffsetX, targetOffsetY, tileWidth, tileHeight);
            }
        });
    }

    private FetchContentInfo(chapter: Chapter, viewerId: string, userId: string, pageTo: number): Promise<APIPages> {
        const uri = new URL('/book/contentsInfo', this.URI);
        uri.search = new URLSearchParams({
            'comici-viewer-id': viewerId,
            'user-id': userId,
            'page-from': '0',
            'page-to': `${pageTo}`,
        }).toString();
        const request = new Request(uri, {
            headers: {
                Referer: new URL(chapter.Identifier, this.URI).href,
            },
        });
        return FetchJSON<APIPages>(request);
    }
}