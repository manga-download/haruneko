import { Tags } from '../Tags';
import icon from './Piccoma.webp';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import DeScramble from '../transformers/ImageDescrambler';
import { TaskPool, Priority } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type APIMangas = {
    data: {
        total_page: number;
        products?: [{
            id: number;
            title: string;
        }]
    }
}

type ImageLinks = {
    link: string;
    tiles?: Record<string, TileGroup>;
}[];

type TileGroup = {
    tileWidth: number;
    tileHeight: number;
    tiles: {
        x: number;
        y: number;
    }[];
    indexmap: number[];
};

type PageData = {
    scrambled?: string;
};

@Common.MangaCSS(/^https:\/\/(jp\.)?piccoma\.com\/web\/product\/\d+/, '.PCM-productTitle, .PCM-headTitle_name', (element, uri) => ({
    id: uri.pathname.match(/\/web\/product\/(\d+)/).at(1),
    title: element.textContent.trim()
}))
export default class extends DecoratableMangaScraper {

    private readonly mangasTaskPool = new TaskPool(4, new RateLimit(8, 1));

    public constructor() {
        super('piccoma', 'Piccoma', 'https://piccoma.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Japanese, Tags.Source.Official, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const cancellator = new AbortController();
        try {
            const genres = [1, 2, 3, 4, 5, 6, 7, 9, 10];
            const mangaList: Manga[] = [];
            for (const genre of genres) {
                const result = await this.GetMangasFromPage(genre, 1, provider, cancellator.signal);
                mangaList.push(...result.mangas);
                const promises = Array(result.pages - 1).fill(0).map(async (_, index) => {
                    const { mangas } = await this.GetMangasFromPage(genre, index + 2, provider, cancellator.signal);
                    mangaList.push(...mangas);
                });
                await Promise.all(promises);
            }
            return mangaList.distinct();
        } catch (error) {
            cancellator.abort();
            throw error;
        }
    }

    private async GetMangasFromPage(genre: number, page: number, provider: MangaPlugin, signal: AbortSignal) {
        return this.mangasTaskPool.Add(async () => {
            const { data: { total_page, products } } = await FetchJSON<APIMangas>(new Request(new URL(`/web/next_page/list?list_type=G&result_id=${genre}&page_id=${page}`, this.URI)));
            return {
                pages: total_page,
                mangas: products.map(({ id, title }) => new Manga(this, provider, `${id}`, title))
            };
        }, Priority.Normal, signal);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return [
            ... await this.FetchEpisodes(manga),
            ... await this.FetchVolumes(manga)
        ];
    }

    private async FetchEpisodes(manga: Manga): Promise<Chapter[]> {
        const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`/web/product/${manga.Identifier}/episodes?etype=E`, this.URI)), 'ul.PCM-epList li a[data-episode_id]');
        return data.map(element => new Chapter(this, manga, element.dataset.episode_id, element.querySelector('div.PCM-epList_title h2').textContent.trim()));
    }

    private async FetchVolumes(manga: Manga): Promise<Chapter[]> {
        const data = await FetchCSS<HTMLUListElement>(new Request(new URL(`/web/product/${manga.Identifier}/episodes?etype=V`, this.URI)), 'ul.PCM-volList li');
        const buttonSelector = ['PCM-prdVol_readBtn', 'PCM-prdVol_freeBtn', 'PCM-prdVol_trialBtn'].map(selector => `a[data-episode_id].${selector}`).join(', ');
        return data.map(element => {
            const title = element.querySelector('.PCM-prdVol_title h2').textContent.trim();
            return new Chapter(this, manga,
                element.querySelector<HTMLAnchorElement>(buttonSelector).dataset.episode_id,
                title.replace(manga.Title, '').trim() || title.trim());
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const data = await FetchWindowScript<ImageLinks>(new Request(new URL(`./web/viewer/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI)), script, 2500, 60_000);
        if (data.length === 0) throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        return data.map(({ link, tiles }) => new Page<PageData>(this, chapter, new URL(link), { scrambled: JSON.stringify(tiles) }));
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
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
    isScrambled: boolean;
    img?: PDataImage[];
    contents?: PDataImage[];
};

type PDataImage = {
    path: string;
    width: number;
    height: number;
};

export async function script(this: Window) {
    return new Promise<ImageLinks>(async (resolve, reject) => {
        try {
            function extractSeed(path: string): string {
                const imgUrl = new URL(path, window.location.href);
                const checksum = imgUrl.pathname.split('/').at(-2);
                const expiration = imgUrl.searchParams.get('expires');
                const sum = expiration.split('').reduce((accumulator, character) => accumulator + parseInt(character), 0);
                const residualIndex = sum % checksum.length;
                const seed = checksum.slice(-residualIndex) + checksum.slice(0, -residualIndex);
                return globalThis.dd ? globalThis.dd(seed, expiration) : seed;
            }

            function extractGroupedTileMaps(img: HTMLImageElement, seed: string, tileSize: number) {
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
                    if (!groupedTileMaps[group]) {
                        groupedTileMaps[group] = { tileWidth, tileHeight, tiles: [], indexmap: [] };
                    }
                    groupedTileMaps[group].tiles.push({ x: offsetX, y: offsetY });
                }

                for (const key in groupedTileMaps) {
                    const group = groupedTileMaps[key];
                    group.indexmap = globalThis.shuffleSeed.shuffle(group.tiles.map((_, index) => index), seed);
                }

                return groupedTileMaps;
            }

            async function LoadImage(src: string): Promise<HTMLImageElement> {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = src;
                });
            }

            const pdata = (globalThis._pdata_ ?? globalThis.__NEXT_DATA__?.props?.pageProps?.initialState?.viewer?.pData) as PData;
            const images: ImageLinks = await Promise.all(
                (pdata?.img ?? pdata?.contents ?? [])
                    .filter((img) => img.path)
                    .map(async (img) => {
                        const uri = new URL(img.path, window.location.origin);
                        const seed = extractSeed(img.path);
                        const image = await LoadImage(uri.href); //we need REAL image dimensions to solve the puzzle, not the ones from pdata
                        return {
                            link: uri.href,
                            tiles: pdata.isScrambled ? extractGroupedTileMaps(image, seed, 50) : undefined,
                        };
                    })
            );
            resolve(images);
        } catch (error) {
            reject(error);
        }
    });
}