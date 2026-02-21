import { FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';
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

    async #FetchPages(chapter: Chapter, viewerID: string, userID: string) {
        const uri = new URL('./book/contentsInfo', this.#apiURL);
        const init = { headers: { Referer: new URL(chapter.Identifier, this.URI).href } };
        uri.search = new URLSearchParams({ 'comici-viewer-id': viewerID, 'user-id': userID, 'page-from': '0', 'page-to': '1' }).toString();
        const { totalPages } = await FetchJSON<APIPages>(new Request(uri, init));
        uri.searchParams.set('page-to', `${totalPages}`);
        const { result } = await FetchJSON<APIPages>(new Request(uri, init));
        return result;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<ScrambleData>[]> {
        const { viewerId, memberJwt } = await FetchWindowScript(new Request(new URL(chapter.Identifier, this.URI)), () => {
            const { attributes, dataset: { comiciViewerId, memberJwt } } = document.querySelector<HTMLElement>('#comici-viewer');
            return { memberJwt, viewerId: attributes.getNamedItem('comici-viewer-id')?.value ?? comiciViewerId };
        }, 750);
        const pages = await this.#FetchPages(chapter, viewerId, memberJwt);
        return pages.map(({ imageUrl, scramble }) => new Page<ScrambleData>(this, chapter, new URL(imageUrl), { scramble, Referer: this.URI.href }));
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