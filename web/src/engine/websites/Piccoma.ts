import { Tags } from '../Tags';
import icon from './Piccoma.webp';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import DeScramble from '../transformers/ImageDescrambler';
import { TaskPool, Priority } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';

type APIMangas = {
    data: {
        total_page: number,
        products?: [{
            id: number,
            title: string,
        }]
    }
}

export type ImageLinks = {
    link: string,
    tiles?: Record<string, TileGroup>,
}[];

export type TileGroup = {
    tileWidth: number,
    tileHeight: number,
    tiles: {
        x: number,
        y: number,
    }[],
    indexmap: number[],
};

export default class extends DecoratableMangaScraper {

    private readonly mangasTaskPool = new TaskPool(4, new RateLimit(8, 1));

    public constructor() {
        super('piccoma', 'Piccoma', 'https://piccoma.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Japanese, Tags.Source.Official, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp('^https://(jp\\.)?piccoma.com/web/product/\\d+').test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const id = uri.pathname.split('/')[3];
        uri.pathname = uri.pathname.split('/').slice(0, 4).join('/');
        const [ element ] = await FetchCSS<HTMLHeadElement>(new Request(uri.href), 'h1.PCM-productTitle');
        return new Manga(this, provider, id, element.textContent.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const cancellator = new AbortController();
        try {
            const genres = [ 1, 2, 3, 4, 5, 6, 7, 9, 10 ];
            const mangaList: Manga[] = [];
            for(const genre of genres) {
                const result = await this.GetMangasFromPage(genre, 1, provider, cancellator.signal);
                mangaList.push(...result.mangas);
                const promises = Array(result.pages - 1).fill(0).map(async (_, index) => {
                    const { mangas } = await this.GetMangasFromPage(genre, index + 2, provider, cancellator.signal);
                    mangaList.push(...mangas);
                });
                await Promise.all(promises);
            }
            return mangaList.distinct();
        } catch(error) {
            cancellator.abort();
            throw error;
        }
    }

    private async GetMangasFromPage(genre: number, page: number, provider: MangaPlugin, signal: AbortSignal) {
        return this.mangasTaskPool.Add(async () => {
            const uri = new URL('/web/next_page/list', this.URI);
            uri.searchParams.set('list_type', 'G');
            uri.searchParams.set('result_id', `${genre}`);
            uri.searchParams.set('page_id', `${page}`);
            const { data } = await FetchJSON<APIMangas>(new Request(uri.href));
            return {
                pages: data.total_page,
                mangas: data.products.map(entry => new Manga(this, provider, `${entry.id}`, entry.title))
            };
        }, Priority.Normal, signal);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return [
            ... await this.FetchEpisodes(manga),
            ... await this.FetchVolumes(manga),
        ].sort((self, other) => self.Title.localeCompare(other.Title));
    }

    private async FetchEpisodes(manga: Manga): Promise<Chapter[]> {
        const request = new Request(`${this.URI.origin}/web/product/${manga.Identifier}/episodes?etype=E`);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'ul.PCM-epList li a[data-episode_id]');
        return data.map(element => new Chapter(this, manga, element.dataset.episode_id, element.querySelector('div.PCM-epList_title h2').textContent.trim()));
    }

    private async FetchVolumes(manga: Manga): Promise<Chapter[]> {
        const request = new Request(`${this.URI.origin}/web/product/${manga.Identifier}/episodes?etype=V`);
        const data = await FetchCSS<HTMLUListElement>(request, 'ul.PCM-volList li');
        return data.map(element => {
            const volume = [ ...element.querySelectorAll<HTMLElement>('div.PCM-prdVol_btns > a:not([class*="buyBtn"])') ].pop();
            const title = [
                element.querySelector<HTMLElement>('div.PCM-prdVol_title h2').innerText.trim(),
                volume.classList.contains('PCM-prdVol_freeBtn') ? ` (${ volume.innerText.trim() })` : '',
                volume.classList.contains('PCM-prdVol_trialBtn') ? ` (${ volume.innerText.trim() })` : '',
            ].join('');
            return new Chapter(this, manga, volume.dataset.episode_id, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(`${this.URI.origin}/web/viewer/${chapter.Parent.Identifier}/${chapter.Identifier}`);
        const data = await FetchWindowScript<ImageLinks>(request, script, 2500);
        return data.map(entry => new Page(this, chapter, new URL(entry.link), { scrambled: JSON.stringify(entry.tiles) }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (!page.Parameters?.scrambled) {
            return blob;
        }
        return DeScramble(blob, async (bitmap, ctx) => {
            const scrambled: Record<string, TileGroup> = JSON.parse(page.Parameters.scrambled as string);
            for (const key in scrambled) {
                const group = scrambled[key];
                for (let index = 0; index < group.tiles.length; index++) {
                    const d = group.tiles[index];
                    const s = group.tiles[group.indexmap[index]];
                    ctx.drawImage(bitmap, s.x, s.y, group.tileWidth, group.tileHeight, d.x, d.y, group.tileWidth, group.tileHeight);
                }
            }
        });
    }
}

type PData = {
    isScrambled: boolean,
    img?: PDataImage[],
    contents?: PDataImage[]
};

type PDataImage = {
    path: string,
    width: number,
    height: number,
};

export function script(this: Window) {
    return new Promise<ImageLinks>(resolve => {

        (function() {
            if(globalThis.shuffleSeed?.shuffle) {
                return;
            }
            const temp = { exports: {} };
            (function locate(object, id) {
                if(object[id]) {
                    return object[id];
                }
                let result = null;
                for(const key in object) {
                    result = result ?? locate(object[key], id);
                }
                return result;
            })(globalThis.webpackChunk_N_E, 28544)(temp);
            globalThis.shuffleSeed = temp.exports;
        })();

        function extractSeed(uri: URL): string {
            const checksum = uri.searchParams.get('q') ?? uri.pathname.split('/').slice(-2).shift();
            const expiration = uri.searchParams.get('expires');
            const sum = expiration.split('').reduce((accumulator, character) => accumulator + parseInt(character), 0);
            const residualIndex = sum % checksum.length;
            const seed = checksum.slice(-residualIndex) + checksum.slice(0, -residualIndex);
            return globalThis.dd ? globalThis.dd(seed) : seed;
        }

        // See: https://github.com/webcaetano/image-scramble/blob/master/unscrambleImg.js
        function extractGroupedTileMaps(img: PDataImage, seed: string, tileSize: number) {
            const columns = Math.ceil(img.width / tileSize);
            const tileCount = columns * Math.ceil(img.height / tileSize);
            const groupedTileMaps: Record<string, TileGroup> = {};
            for (let index = 0; index < tileCount; index++) {
                const row = Math.floor(index / columns);
                const column = index - row * columns;
                const offsetX = column * tileSize;
                const offsetY = row * tileSize;
                const tileWidth = offsetX + tileSize > img.width ? img.width - offsetX : tileSize;
                const tileHeight = offsetY + tileSize > img.height ? img.height - offsetY : tileSize;
                const group = `${tileWidth}-${tileHeight}`;
                if(!groupedTileMaps[group]) {
                    groupedTileMaps[group] = { tileWidth, tileHeight, tiles: [], indexmap: [] };
                }
                groupedTileMaps[group].tiles.push({ x: offsetX, y: offsetY });
            }

            for (const key in groupedTileMaps) {
                const group = groupedTileMaps[key];
                // See: https://github.com/webcaetano/shuffle-seed/blob/master/shuffle-seed.js
                group.indexmap = globalThis.shuffleSeed.shuffle(group.tiles.map((_, index) => index), seed);
            }

            return groupedTileMaps;
        }

        const pdata = (globalThis._pdata_ ?? globalThis.__NEXT_DATA__.props.pageProps.initialState.viewer.pData) as PData;

        const images: ImageLinks = (pdata.img ?? pdata.contents)
            .filter(img => img.path)
            .map(img => {
                const uri = new URL(img.path, window.location.origin);
                const seed = extractSeed(uri);
                return {
                    link: uri.href,
                    tiles: pdata.isScrambled ? extractGroupedTileMaps(img, seed, 50) : undefined,
                };
            });

        resolve(images);
    });
}