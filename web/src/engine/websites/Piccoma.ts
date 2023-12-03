import { Tags } from '../Tags';
import icon from './Piccoma.webp';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, FetchRequest, FetchWindowScript } from '../FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

type APIMangas = {
    data: {
        products: [{
            id: number,
            title: string,
        }]
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

export default class extends DecoratableMangaScraper {

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
        const id = new URL(url).pathname.split('/').pop();
        const [ element ] = await FetchCSS<HTMLHeadElement>(new FetchRequest(url), 'h1.PCM-productTitle');
        return new Manga(this, provider, id, element.textContent.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        const vowels = 'aeiouあいうえお'.split('');
        for (const word of vowels) {
            for (let page = 1, run = true; run; page++) {
                const mangas = await this.getMangasFromPage(word, page, provider);
                mangas.length > 0 ? mangaList.push(...mangas) : run = false;
            }
        }

        const dbg = mangaList.distinct();
        console.log('Distinct:', mangaList.length, dbg.length);
        return mangaList.distinct();
    }

    private async getMangasFromPage(word: string, page: number, provider: MangaPlugin): Promise<Manga[]> {
        const uri = new URL('/web/search/result_ajax/list', this.URI);
        uri.searchParams.set('tab_type', 'T');
        uri.searchParams.set('word', word);
        uri.searchParams.set('page', `${page}`);
        const { data: { products: entries } } = await FetchJSON<APIMangas>(new FetchRequest(uri.href));
        return entries.map(entry => new Manga(this, provider, `${entry.id}`, entry.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return [
            ... await this.fetchEpisodes(manga),
            ... await this.fetchVolumes(manga),
        ].sort((self, other) => self.Title.localeCompare(other.Title));
    }

    private async fetchEpisodes(manga: Manga): Promise<Chapter[]> {
        const request = new FetchRequest(`${this.URI.origin}/web/product/${manga.Identifier}/episodes?etype=E`);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'ul.PCM-epList li a[data-episode_id]');
        return data.map(element => new Chapter(this, manga, element.dataset.episode_id, element.querySelector('div.PCM-epList_title h2').textContent.trim()));
    }

    private async fetchVolumes(manga: Manga): Promise<Chapter[]> {
        const request = new FetchRequest(`${this.URI.origin}/web/product/${manga.Identifier}/episodes?etype=V`);
        const data = await FetchCSS<HTMLUListElement>(request, 'ul.PCM-volList li');
        return data.map(element => new Chapter(
            this,
            manga,
            element.querySelector<HTMLElement>('div.PCM-prdVol_btns a:last-of-type').dataset.episode_id,
            element.querySelector('div.PCM-prdVol_title h2').textContent.trim(),
        ));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new FetchRequest(`${this.URI.origin}/web/viewer/${chapter.Parent.Identifier}/${chapter.Identifier}`);
        const data = await FetchWindowScript<ImageLinks>(request, `(${script})()`, 2500);
        console.log('Scrambled Images:', data);
        return data.map(entry => new Page(this, chapter, new URL(entry.link), { scrambled: entry.tiles }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        const scrambled = page.Parameters?.scrambled as Record<string, TileGroup>;
        if (!scrambled) {
            return blob;
        }
        return DeScramble(blob, async (bitmap, ctx) => {
            for (const key in scrambled) {
                const group = scrambled[key];
                for(let index = 0; index < group.tiles.length; index++) {
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
    img: PDataImage[],
};

type PDataImage = {
    path: string,
    width: number,
    height: number,
};

function script(this: Window) {
    return new Promise<ImageLinks>(resolve => {

        function extractSeed(uri: URL): string {
            const checksum = uri.pathname.split('/').slice(-2).shift();
            const expiration = uri.searchParams.get('expires');
            const sum = expiration.split('').reduce((accumulator, character) => accumulator + parseInt(character), 0);
            const residualIndex = sum % checksum.length;
            return checksum.slice(-residualIndex) + checksum.slice(0, -residualIndex);
        }

        /*
        // window.shuffleSeed.shuffle();
        function shuffle(indices: number[], seed: string) {
            const next = seedrandom(seed); // Math.seedrandom.call(this, seed);
            const shuffled = [];
            const indicesCopy = [ ...indices ];
            for (let index = 0; index < indices.length; index++) {
                const i = Math.floor(next() * indicesCopy.length);
                shuffled.push(indices[indicesCopy[i]]);
                indicesCopy.splice(i, 1);
            }
            return shuffled;
        }
        */

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
                group.indexmap = globalThis.shuffleSeed.shuffle(group.tiles.map((_, index) => index), seed);
            }

            return groupedTileMaps;
        }

        const pdata = globalThis._pdata_ as PData;

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