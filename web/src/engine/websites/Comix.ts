import { Tags } from '../Tags';
import icon from './Comix.webp';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
import { Page } from '../providers/MangaPlugin';
import { type MangaPlugin, Manga, Chapter, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { DRMProvider } from './Comix.DRM';
import type { Priority } from '../taskpool/DeferredTask';
import { GetTypedData } from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';

type APIMangas = {
    result: {
        items: {
            hash_id: string;
            title: string;
            slug: string;
        }[];
    };
};

@Common.MangaCSS(/^{origin}\/title\/[^/]+$/, 'meta[property="og:title"]')
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/v1/`;
    readonly #drm = new DRMProvider();

    public constructor() {
        super('comix', 'Comix', 'https://comix.to', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { result: { items } } = await FetchJSON<APIMangas>(new Request(new URL(`./manga?limit=100&page=${page}`, this.apiURL)));
                const mangas = items.map(({ hash_id: hash, title, slug }) => new Manga(this, provider, `/title/${hash}-${slug}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.#drm.GetChaptersData(new URL(manga.Identifier, this.URI));
        return chapters.map(({ id, number, name, group }) => {
            const title = [number?.toString(), name && `- ${name}`, group && `[${group.name}]`].filter(Boolean).join(' ');
            return new Chapter(this, manga, `${manga.Identifier}/${id}-chapter-${number}`, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const images = await this.#drm.CreatePageLinks(new URL(chapter.Identifier, this.URI));
        return images.map(page => new Page(this, chapter, new URL(page), { Referer: this.URI.href }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(page.Link, {
                headers: {
                    Referer: page.Parameters.Referer
                }
            }));

            const seed = parseInt(response.headers.get('x-scramble-seed'));
            const scrambleType = response.headers.get('x-scramble-grid');
            const blob = await GetTypedData(await response.arrayBuffer());

            return !seed ? blob : DeScramble(blob, async (image, ctx) => {
                const LCG_MULTIPLIER = BigInt(1664525);
                const LCG_INCREMENT = BigInt(1013904223);

                const [numRows, numCols] = scrambleType.split('x').map(el => parseInt(el));
                const numTiles = numRows * numCols;

                const tileW = Math.floor(image.width / numCols);
                const tileH = Math.floor(image.height / numRows);

                const ComputeOrder = (seed: number, n: number): number[] => {
                    const arr: number[] = Array.from({ length: n }, (_, i) => i);
                    let state = BigInt(seed);
                    for (let i = n - 1; i > 0; i--) {
                        state = BigInt.asIntN(32, state * LCG_MULTIPLIER + LCG_INCREMENT);
                        const stateUnsigned = BigInt.asUintN(32, state);
                        const j = Number(stateUnsigned % BigInt(i + 1));
                        const tmp = arr[i];
                        arr[i] = arr[j];
                        arr[j] = tmp;
                    }
                    return arr;
                };

                const scrambleOrder = ComputeOrder(seed, numTiles);

                for (let srcIdx = 0; srcIdx < numTiles; srcIdx++) {
                    const dstIdx = scrambleOrder[srcIdx];

                    const srcCol = srcIdx % numCols;
                    const srcRow = Math.floor(srcIdx / numCols);

                    const dstCol = dstIdx % numCols;
                    const dstRow = Math.floor(dstIdx / numCols);

                    const sx = srcCol * tileW;
                    const sy = srcRow * tileH;

                    const dx = dstCol * tileW;
                    const dy = dstRow * tileH;

                    ctx.drawImage(image, sx, sy, tileW, tileH, dx, dy, tileW, tileH);
                }
            });
        }, priority, signal);
    }
}