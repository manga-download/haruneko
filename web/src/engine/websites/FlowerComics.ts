import { Tags } from '../Tags';
import icon from './FlowerComics.webp';
import { GetBytesFromHex } from '../BufferEncoder';
import type { Priority } from '../taskpool/DeferredTask';
import { Fetch, FetchNextJS } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type HydratedMangas = {
    weekdays: Record<string, HydratedManga[]>
};

type HydratedManga = {
    id: number;
    name: string;
};

type HydratedChapters = {
    chapters: {
        earlyChapters: HydratedChapter[];
        omittedMiddleChapters: HydratedChapter[];
        latestChapters: HydratedChapter[];
    }
};

type HydratedChapter = {
    id: number;
    title: string;
};

type HydratedPages = {
    pages: {
        crypto?: PageParams;
        src: string;
    }[]
};

type PageParams = {
    key: string;
    iv: string;
};

@Common.MangaCSS(/^{origin}\/title\/\d+$/, 'section div.grid h1.font-semibold')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('flowercomics', 'Flower Comics', 'https://flowercomics.jp', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga/*, Tags.Accessibility.RegionLocked*/);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { weekdays } = await FetchNextJS<HydratedMangas>(new Request(new URL('/rensai', this.URI)), data => 'weekdays' in data);
        return Object.values(weekdays).reduce((mangasAccumulator: Manga[], day) => {
            const mangas = day.map(({ id, name }) => new Manga(this, provider, `/title/${id}`, name));
            mangasAccumulator.push(...mangas);
            return mangasAccumulator;
        }, []);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters: { earlyChapters, latestChapters, omittedMiddleChapters } } = await FetchNextJS<HydratedChapters>(new Request(new URL(manga.Identifier, this.URI)), data => 'chapters' in data);
        return [ earlyChapters, omittedMiddleChapters, latestChapters ].reduce((accumulator: Chapter[], chapters) => [
            ...accumulator,
            ...chapters.map(({ id, title }) => new Chapter(this, manga, '/chapter/' + id, title))
        ], []);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParams>[]> {
        const { pages } = await FetchNextJS<HydratedPages>(new Request(new URL(`${chapter.Identifier}/viewer`, this.URI)), data => 'pages' in data);
        return pages
            .filter(({ src }) => !/\/banner\//.test(src))
            .map(({ src, crypto }) => new Page<PageParams>(this, chapter, new URL(src), crypto));
    }

    public override async FetchImage(page: Page<PageParams>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const response = await this.imageTaskPool.Add(() => Fetch(new Request(page.Link, { signal })), priority, signal);
        return page.Parameters ? this.DecryptImage(await response.arrayBuffer(), page.Parameters.key, page.Parameters.iv) : response.blob();
    }

    private async DecryptImage(encrypted: ArrayBuffer, keyData: string, iv: string): Promise<Blob> {
        const algorithm = { name: 'AES-CBC', iv: GetBytesFromHex(iv) };
        const key = await crypto.subtle.importKey('raw', GetBytesFromHex(keyData), algorithm, false, [ 'decrypt' ]);
        const decrypted = await crypto.subtle.decrypt(algorithm, key, encrypted);
        return Common.GetTypedData(decrypted);
    };
}