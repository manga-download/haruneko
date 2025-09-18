import { Tags } from '../Tags';
import icon from './MangaTek.webp';
import { type Manga, Chapter, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

type HydratedManga = {
    manga: {
        MangaChapters: {
            chapter_number: string;
            title: string;
        }[]
    }
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'img#mangaCover', (element: HTMLImageElement) => element.alt.trim())
@Common.MangasMultiPageCSS('/manga-list?page={page}', 'div.manga-card a[dir]')
@Common.PagesSinglePageCSS('div.manga-page img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatek', 'MangaTek', 'https://mangatek.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { manga: { MangaChapters } } = await this.FetchAstro<HydratedManga>(new URL(manga.Identifier, this.URI), data => 'manga' in data);
        return MangaChapters.map(({ title, chapter_number: number }) => new Chapter(this, manga, `/reader/${manga.Identifier.split('/').at(-1)}/${number}`, title));
    }

    private async FetchAstro<T extends JSONElement>(url: URL, predicate: (data: JSONObject<JSONElement> | JSONArray<JSONElement>) => unknown): Promise<T> {
        const payloads = await FetchCSS<HTMLElement>(new Request(url), 'astro-island');
        const goodElement = payloads.find(el => {
            const jsonProps = JSON.parse(el.getAttribute('props') ?? '');
            return predicate(jsonProps);
        });
        return !goodElement ? {} as T : this.Deserialize(JSON.parse(goodElement.getAttribute('props'))) as T;
    }

    private Deserialize(obj: JSONElement) {
        const revivers = {
            0: t => this.Deserialize(t),
            1: t => hydrateArray(t),
            /* 2: t => new RegExp(t),
            3: t => new Date(t),
            4: t => new Map(hydrateArray(t)),
            5: t => new Set(hydrateArray(t)),
            6: t => BigInt(t),
            7: t => new URL(t),
            8: t => new Uint8Array(t),
            9: t => new Uint16Array(t),
            10: t => new Uint32Array(t),
            11: t => 1 / 0 * t*/
        };
        const hydrate = t => {
            let [reviverType, value] = t;
            return reviverType in revivers ? revivers[reviverType](value) : void 0;
        };
        const hydrateArray = t => t.map(hydrate);
        return typeof obj != 'object' || obj === null ? obj : Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, hydrate(value)]));
    }
}