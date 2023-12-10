import { Tags } from '../Tags';
import icon from './Piccoma.webp';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, FetchRequest, FetchWindowScript } from '../FetchProvider';
import type { Priority } from '../taskpool/TaskPool';
import DeScramble from '../transformers/ImageDescrambler';

type APIMangas = {
    data: {
        p_products: [{
            product_id: number,
            title: string,
        }]
    }
}

type NextData = {
    props: {
        pageProps: {
            initialState: {
                episode: {
                    episodeList: {
                        episode_list?: NextChapters
                    }
                },
                viewer: {
                    pData?: NextPages
                },
            }
        }
    }
}

type NextChapters = {
    id: string,
    title: string,
    volume: number,
    is_free: 'Y' | 'N',
}[];

type NextPages = {
    isScrambled: boolean,
    img: NextImage[],
};

type NextImage = {
    path: string,
    width: number,
    height: number,
};

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('piccoma-fr', 'Piccoma (French)', 'https://piccoma.com/fr', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.French, Tags.Source.Official);
    }

    private getAPI(endpoint: string): URL {
        return new URL(this.URI.href + '/api/haribo/api/public/v2' + endpoint);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.href}/product(/episode)?/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = url.split('/').pop();
        const request = new FetchRequest(`${this.URI.href}/product/${id}`);
        const [ element ] = await FetchCSS<HTMLMetaElement>(request, 'meta[property="og:title"]');
        return new Manga(this, provider, id, element.content.split('|').shift().trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        const vowels = 'aeiou'.split('');
        for (const word of vowels) {
            for (let page = 1, run = true; run; page++) {
                const mangas = await this.getMangasFromPage(word, page, provider);
                mangas.length > 0 ? mangaList.push(...mangas) : run = false;
            }
        }
        return [...new Set(mangaList.map(manga => manga.Identifier))].map(id => mangaList.find(manga => manga.Identifier === id));
    }

    private async getMangasFromPage(word: string, page: number, provider: MangaPlugin): Promise<Manga[]> {
        const uri = this.getAPI('/search/product');
        uri.searchParams.set('search_type', 'P');
        uri.searchParams.set('word', word);
        uri.searchParams.set('page', `${page}`);
        const { data: { p_products: entries } } = await FetchJSON<APIMangas>(new FetchRequest(uri.href));
        return entries.map(entry => new Manga(this, provider, `${entry.product_id}`, entry.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new FetchRequest(`${this.URI.href}/product/episode/${manga.Identifier}`);
        const [ { text: json } ] = await FetchCSS<HTMLScriptElement>(request, 'script#__NEXT_DATA__');
        const chapters = (JSON.parse(json) as NextData).props.pageProps.initialState.episode.episodeList.episode_list;
        return chapters.map(chapter => new Chapter(this, manga, chapter.id, chapter.title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new FetchRequest(`${this.URI.href}/viewer/${chapter.Parent.Identifier}/${chapter.Identifier}`);
        const data = await FetchWindowScript<ImageLinks>(request, `(${script})()`, 2500);
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

type ImageLinks = {
    link: string,
    tiles?: Record<string, TileGroup>,
}[];

type TileGroup = {
    tileWidth: number,
    tileHeight: number,
    tiles: {
        x: number,
        y: number,
    }[],
    indexmap: number[],
};

type PData = {
    isScrambled: boolean,
    img: PDataImage[],
};

type PDataImage = {
    path: string,
    width: number,
    height: number,
};

function script(this: Window) {
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
            })(globalThis.webpackChunk_N_E, 71987)(temp);
            globalThis.shuffleSeed = temp.exports;
        })();

        function extractSeed(uri: URL): string {
            const checksum = uri.searchParams.get('q');
            const expiration = uri.searchParams.get('expires');
            const sum = expiration.split('').reduce((accumulator, character) => accumulator + parseInt(character), 0);
            const residualIndex = sum % checksum.length;
            const seed = checksum.slice(-residualIndex) + checksum.slice(0, -residualIndex);
            return globalThis.dd(seed);
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

        const pdata = globalThis.__NEXT_DATA__.props.pageProps.initialState.viewer.pData as PData;

        const images: ImageLinks = pdata.img
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