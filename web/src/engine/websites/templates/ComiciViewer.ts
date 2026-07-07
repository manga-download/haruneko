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

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'h1.series-h-title', Common.WebsiteInfoExtractor({ queryBloat: 'span' }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a.series-list-item-link', Common.PatternLinkGenerator('/series/list/up/{page}', 1), 0, anchor => ({ id: anchor.pathname, title: anchor.querySelector('div.series-list-item-h span').textContent.trim() }))
export class ComiciViewer extends DecoratableMangaScraper {

    readonly #identityTileMap = new Array(16).fill(null).map((_, index) => ({ col: index / 4 >> 0, row: index % 4 >> 0 }));
    #apiURL = new URL('./api/', this.URI);

    async #FetchPages(chapter: Chapter, viewerID: string, userID: string, contentId: string = undefined) {
        const uri = new URL('./book/contentsInfo', this.#apiURL);
        const init = { headers: { Referer: new URL(chapter.Identifier, this.URI).href } };
        uri.search = new URLSearchParams({ 'comici-viewer-id': viewerID, 'user-id': userID, 'page-from': '0', 'page-to': '1', contentId }).toString();
        const { totalPages } = await FetchJSON<APIPages>(new Request(uri, init));
        uri.searchParams.set('page-to', `${totalPages}`);
        const { result } = await FetchJSON<APIPages>(new Request(uri, init));
        return result;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [, prefix, seriesHash] = manga.Identifier.match(/^(.*)\/series\/([^/]+)$/)!;
        const { series: { episodes }, } = await FetchJSON<APIChapters>(new Request(new URL(`./episodes?seriesHash=${seriesHash}&episodeFrom=1&episodeTo=9999`, this.#apiURL)));
        return episodes.map(({ id, title }) => new Chapter(this, manga, `${prefix}/episodes/${id}`, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<ScrambleData>[]> {
        type AccountData = { viewerId: string, memberJwt: string, contentId: string };
        const { viewerId, memberJwt, contentId } = await FetchWindowScript<AccountData>(new Request(new URL(chapter.Identifier, this.URI)), `
            new Promise((resolve, reject) => {
                let interval;
                try {
                    const checkElement = () => {
                        const element = document.querySelector('#comici-viewer');
                        if (element) {
                            const { attributes, dataset: { memberJwt, comiciViewerId, contentId } } = element;
                            return {
                                memberJwt,
                                viewerId: attributes.getNamedItem('comici-viewer-id')?.value ?? comiciViewerId,
                                contentId
                            };
                        } else {
                            return null;
                        }
                    };

                    const endTime = Date.now() + 15000;

                    interval = setInterval(() => {
                        if (Date.now() > endTime) {
                            clearInterval(interval);
                            reject(new Error("Element #comici-viewer not found after 10 seconds."));
                            return;
                        }

                        const result = checkElement();
                        if (result) {
                            clearInterval(interval);
                            resolve(result);
                        }
                    }, 150);

                } catch (error) {
                    if (interval) clearInterval(interval);
                    reject(error);
                }
            });
        `, 0);
        const pages = await this.#FetchPages(chapter, viewerId, memberJwt, contentId);
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