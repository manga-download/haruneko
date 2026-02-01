import { FetchCSS, FetchJSON } from '../../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, Chapter, Page } from '../../providers/MangaPlugin';
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

type APIChapters = {
    series: {
        episodes: {
            id: string;
            title: string;
        }[]
    }
};

function StripTrailingSlash(pathname: string): string {
    return pathname.replace(/\/$/, '');
}

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/?$/, 'h1.series-h-title span:not([class])', (span, uri) => ({ id: StripTrailingSlash(uri.pathname), title: span.innerText.trim() }))
@Common.MangasMultiPageCSS('div.series-box-vertical', Common.PatternLinkGenerator('/series/list?page={page}', 0), 0, div => ({
    id: StripTrailingSlash(div.querySelector('a').pathname),
    title: div.querySelector<HTMLHeadingElement>('h2.title-text').innerText.trim()
}))
@Common.ChaptersSinglePageCSS('div.series-ep-list a[data-href]', manga => `${manga.Identifier}/list`, a => ({
    id: new URL(a.dataset.href).pathname,
    title: a.querySelector<HTMLSpanElement>('span.series-ep-list-item-h-text').innerText.trim(),
}))
export class ComiciViewer extends DecoratableMangaScraper {

    readonly #identityTileMap = new Array(16).fill(null).map((_, index) => ({ col: index / 4 >> 0, row: index % 4 >> 0 }));
    #apiURL = this.URI;

    protected WithEndpointAPI(endpoint: string) {
        this.#apiURL = new URL(endpoint, this.URI);
        return this;
    }

    protected WithChaptersFromAPI() {
        this.FetchChapters = async (manga: Manga) => {
            const { series: { episodes } } = await FetchJSON<APIChapters>(new Request(new URL(`./episodes?seriesHash=${manga.Identifier.split('/').at(-1)}&episodeFrom=1&episodeTo=9999`, this.#apiURL)));
            return episodes.map(({ id, title }) => new Chapter(this, manga, `/episodes/${id}`, title));
        };
        return this;
    }

    #FetchContentInfo(chapter: Chapter, viewerId: string, userId: string, pageTo: number): Promise<APIPages> {
        return FetchJSON<APIPages>(new Request(new URL(`./book/contentsInfo?comici-viewer-id=${viewerId}&user-id=${userId}&page-from=0&page-to=${pageTo}`, this.#apiURL), {
            headers: {
                Referer: new URL(chapter.Identifier, this.URI).href,
            },
        }));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<ScrambleData>[]> {
        const [viewer] = await FetchCSS(new Request(new URL(chapter.Identifier, this.URI)), '#comici-viewer');
        const viewerId = viewer.getAttribute('comici-viewer-id') ?? viewer.dataset.comiciViewerId;
        const { totalPages } = await this.#FetchContentInfo(chapter, viewerId, viewer.dataset.memberJwt, 1);
        const { result } = await this.#FetchContentInfo(chapter, viewerId, viewer.dataset.memberJwt, totalPages);
        return result.map(({ imageUrl, scramble }) => new Page<ScrambleData>(this, chapter, new URL(imageUrl), { scramble, Referer: this.URI.href }));
    }

    public override async FetchImage(page: Page<ScrambleData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return !page.Parameters?.scramble ? blob : DeScramble(blob, async (image, ctx) => {
            const scrambleTileMap = page.Parameters.scramble.replace(/\s+/g, '').slice(1).slice(0, -1).split(',').map(index => this.#identityTileMap[index]);
            const tileWidth = Math.floor(image.width / 4);
            const tileHeight = Math.floor(image.height / 4);
            for (let index = 0; index < this.#identityTileMap.length; index++) {
                const sourceOffsetX = scrambleTileMap[index].col * tileWidth;
                const sourceOffsetY = scrambleTileMap[index].row * tileHeight;
                const targetOffsetX = this.#identityTileMap[index].col * tileWidth;
                const targetOffsetY = this.#identityTileMap[index].row * tileHeight;
                ctx.drawImage(image, sourceOffsetX, sourceOffsetY, tileWidth, tileHeight, targetOffsetX, targetOffsetY, tileWidth, tileHeight);
            }
        });
    }
}