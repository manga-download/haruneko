import { Tags } from '../Tags';
import icon from './Comix.webp';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
import { Page } from '../providers/MangaPlugin';
import { type MangaPlugin, Manga, Chapter, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { DRMProvider } from './Comix.DRM';
import type { Priority } from '../taskpool/DeferredTask';
import { GetTypedData } from './decorators/Common';

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
            const title = [number, name && `- ${name}`, group?.name && `[${group.name}]`].joinTitleSegments();
            return new Chapter(this, manga, `${manga.Identifier}/${id}-chapter-${number}`, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const images = await this.#drm.CreatePageLinks(new URL(chapter.Identifier, this.URI));
        return images.map(page => new Page(this, chapter, new URL(page), { Referer: this.URI.href }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const response = await this.imageTaskPool.Add(() => Fetch(new Request(page.Link, {
            headers: {
                Referer: page.Parameters.Referer
            }
        })), priority, signal);

        const seed = parseInt(response.headers.get('x-enc-seed'), 10);
        const encLength = parseInt(response.headers.get('x-enc-len'), 10);
        const buffer = await response.arrayBuffer();
        return await GetTypedData(!seed || !encLength ? buffer : this.DecryptImage(buffer, seed, encLength));
    }

    private DecryptImage(encrypted: ArrayBuffer, seed: number, length: number): ArrayBuffer {
        const bytes = new Uint8Array(encrypted);
        let state = seed;
        const limit = Math.min(bytes.length, length);

        for (let i = 0; i < limit; i++) {
            state = state * 1000005 + 1234567891 >> 0;
            bytes[i] = bytes[i] ^ state >>> 24;
        }
        return bytes.buffer;
    }
}