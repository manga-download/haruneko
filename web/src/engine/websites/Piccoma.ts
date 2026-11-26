import { Tags } from '../Tags';
import icon from './Piccoma.webp';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import DeScramble from '../transformers/ImageDescrambler';
import { TaskPool, Priority } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';
//import { Exception } from '../Error';
//import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import { GetBytesFromUTF8, GetUTF8FromBytes } from '../BufferEncoder';

type APIMangas = {
    data: {
        total_page: number;
        products?: [{
            id: number;
            title: string;
        }];
    };
};

type PagesData = {
    links: string[];
    scrambled: boolean;
};

type PageData = {
    scrambled: boolean;
};

type Point = { x: number; y: number; };

const WIDTH = 256;
const CHUNKS = 6;
const DIGITS = 52;
const MASK = WIDTH - 1;

//This is NOT standard ARC4, but the version used in SeedRandom implementation https://github.com/davidbau/seedrandom
class ARC4Custom {
    private indexI = 0;
    private indexJ = 0;
    private state: number[] = Array.from({ length: WIDTH }, (_, it) => it);

    constructor(key: number[]) {
        const effectiveKey = key.length === 0 ? [0] : key;

        let jCounter = 0;
        for (let k = 0; k < WIDTH; k++) {
            const t = this.state[k];
            jCounter = MASK & jCounter + effectiveKey[k % effectiveKey.length] + t;
            this.state[k] = this.state[jCounter];
            this.state[jCounter] = t;
        }
        this.Generate(WIDTH);
    }

    /**
     * Generates pseudo-random bytes/values from the state array.
     */
    public Generate(count: number): number {
        let r = 0;
        let c = count;
        while (c-- > 0) {
            this.indexI = MASK & this.indexI + 1;
            const t = this.state[this.indexI];
            this.indexJ = MASK & this.indexJ + t;
            const sj = this.state[this.indexJ];
            this.state[this.indexI] = sj;
            this.state[this.indexJ] = t;
            r = r * WIDTH + this.state[MASK & sj + t];
        }
        return r;
    }
}

export class SeedRandom {
    private startDenominator = Math.pow(WIDTH, CHUNKS);
    private significance = Math.pow(2, DIGITS);
    private overflow = this.significance * 2;
    private arc4: ARC4Custom;

    constructor(seed: string) {
        this.arc4 = new ARC4Custom(this.MixKey(seed));
    }

    /**
     * Returns the next pseudo-random number in the range `[0, 1)`.
     */
    public NextDouble(): number {
        let n = this.arc4.Generate(CHUNKS);
        let d = this.startDenominator;
        let x = 0;
        while (n < this.significance) {
            n = (n + x) * WIDTH;
            d *= WIDTH;
            x = this.arc4.Generate(1);
        }
        while (n >= this.overflow) {
            n /= 2;
            d /= 2;
            x = x >>> 1; // Bitwise unsigned right shift
        }
        return (n + x) / d;
    }

    /**
     * Returns a new array holding the elements of the input list shuffled with this generator.
     */
    public Shuffle<T>(list: T[]): T[] {
        const size = list.length;
        const resp: T[] = [];
        const keys: number[] = Array.from({ length: size }, (_, i) => i);

        for (let i = 0; i < size; i++) {
            const r = Math.floor(this.NextDouble() * keys.length);
            resp.push(list[keys.splice(r, 1)[0]]);
        }
        return resp;
    }

    private MixKey(seed: string): number[] {
        const key = new Array(WIDTH).fill(0);
        let smear = 0;
        for (let j = 0; j < seed.length; j++) {
            smear = smear ^ key[MASK & j] * 19;
            key[MASK & j] = MASK & smear + seed.charCodeAt(j);
        }
        return key.slice(0, Math.min(seed.length, WIDTH));
    }
}

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
        return data.map(element => new Chapter(this, manga, element.dataset.episode_id, element.querySelector('div.PCM-epList_title h2').textContent.trim())).reverse();
    }

    private async FetchVolumes(manga: Manga): Promise<Chapter[]> {
        const data = await FetchCSS<HTMLUListElement>(new Request(new URL(`/web/product/${manga.Identifier}/episodes?etype=V`, this.URI)), 'ul.PCM-volList li');
        const buttonSelector = ['PCM-prdVol_readBtn', 'PCM-prdVol_freeBtn', 'PCM-prdVol_trialBtn'].map(selector => `a[data-episode_id].${selector}`).join(', ');
        return data.map(element => {
            const title = element.querySelector('.PCM-prdVol_title h2').textContent.trim();
            return new Chapter(this, manga,
                element.querySelector<HTMLAnchorElement>(buttonSelector).dataset.episode_id,
                title.replace(manga.Title, '').trim() || title.trim());
        }).reverse();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const { links, scrambled } = await FetchWindowScript<PagesData>(new Request(new URL(`./web/viewer/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI)), `
            new Promise (resolve => {
                resolve({
                    links : (_pdata_.img ?? _pdata_.content).filter(img => img.path).map(img => 'https:'+img.path),
                    scrambled : _pdata_.isScrambled
	            });
            });
        `, 2500);

        //if (data.length === 0) throw new Exception(R.Plugin_Common_Chapter_UnavailableError);

        return links.map(link => new Page<PageData>(this, chapter, new URL(link), { scrambled }));
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (!page.Parameters?.scrambled) {
            return blob;
        }

        const seed = this.ExtractSeed(page.Link);
        return DeScramble(blob, async (bitmap, ctx) => {
            const width = bitmap.width;
            const height = bitmap.height;

            const TILE_SIZE = 50;

            const columns = Math.ceil(width / TILE_SIZE);
            const rows = Math.ceil(height / TILE_SIZE);

            const tileGroups = new Map<string, { tiles: Point[], w: number, h: number }>();

            for (let index = 0; index < columns * rows; index++) {
                const x = index % columns * TILE_SIZE;
                const y = Math.floor(index / columns) * TILE_SIZE;
                const w = x + TILE_SIZE > width ? width - x : TILE_SIZE;
                const h = y + TILE_SIZE > height ? height - y : TILE_SIZE;

                const key = `${w},${h}`;
                if (!tileGroups.has(key)) {
                    tileGroups.set(key, { tiles: [], w, h });
                }
                tileGroups.get(key)!.tiles.push({ x, y });
            }

            for (const group of tileGroups.values()) {
                const { tiles, w, h } = group;
                const shuffled = new SeedRandom(seed).Shuffle(tiles);

                for (let i = 0; i < tiles.length; i++) {
                    const dest = tiles[i];
                    const src = shuffled[i];
                    ctx.drawImage(
                        bitmap,
                        src.x, src.y, w, h,
                        dest.x, dest.y, w, h
                    );
                }
            }
        });
    }

    private ExtractSeed(imgUrl: URL): string {
        const checksum = imgUrl.pathname.split('/').at(-2);
        const expiration = imgUrl.searchParams.get('expires');
        const sum = expiration.split('').reduce((accumulator, character) => accumulator + parseInt(character), 0);
        const residualIndex = sum % checksum.length;
        const seed = checksum.slice(-residualIndex) + checksum.slice(0, -residualIndex);
        return this.RotateSeed(seed);
    }

    private RotateSeed(seed: string): string {
        const bytes = GetBytesFromUTF8(seed);
        for (let i = 0; i < bytes.length; i++) {
            // Check if the i-th bit of the bitmask is set to 1
            if ((3236551 >> i & 1) === 1) {
                bytes[i] ^= 1; // XOR the byte with 1
            }
        }
        return GetUTF8FromBytes(bytes);
    }
}
